/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  LitAbility,
  ILitResource,
  AuthSig,
  GetSessionSigsProps,
  LitResourcePrefix,
  SignSessionKeyResponse,
} from '@lit-protocol/types';
// import { usePKP } from '@/hooks/usePKP';

const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const FACTORY_ABI = [
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)',
];

const POOL_ABI = [
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
];

const SWAP_ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
];

const getProvider = (): ethers.providers.Web3Provider => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(
      window.ethereum as ethers.providers.ExternalProvider
    );
  }
  throw new Error('no provider');
};

export const getPoolAddress = async (
  tokenA: string,
  tokenB: string,
  fee: number
): Promise<string> => {
  const provider = getProvider();
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  return await factory.getPool(tokenA, tokenB, fee);
};

export const getCurrentPrice = async (
  poolAddress: string
): Promise<ethers.BigNumber> => {
  const provider = getProvider();
  const pool = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const slot0 = await pool.slot0();
  return slot0.sqrtPriceX96;
};

export const generateSwapCalldata = (
  tokenIn: string,
  tokenOut: string,
  fee: number,
  recipient: string,
  deadline: number,
  amountIn: string,
  amountOutMinimum: string
): string => {
  const swapRouter = new ethers.Contract(
    SWAP_ROUTER_ADDRESS,
    SWAP_ROUTER_ABI,
    getProvider()
  );
  return swapRouter.interface.encodeFunctionData('exactInputSingle', [
    {
      tokenIn,
      tokenOut,
      fee,
      recipient,
      deadline,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96: 0,
    },
  ]);
};

export const litNodeClient: LitNodeClient = new LitNodeClient({
  alertWhenUnauthorized: false,
  litNetwork: 'datil-dev',
  debug: true,
});

export const executeOrder = async (
  encryptedOrder: string,
  googleCredential: string
) => {
  const pkp = ''; // usePKP();
  await litNodeClient.connect();

  const sessionKey = litNodeClient.getSessionKey();

  if (!sessionKey) {
    throw new Error('no session key found');
  }

  const litActionCode = `
  const go = async () => {
    const { encryptedOrder, publicKey } = args;

    const decryptedOrder = await LitActions.decryptString(encryptedOrder, publicKey);
    const order = JSON.parse(decryptedOrder);

    const poolAddress = await Lit.Actions.call({
      ipfsId: "QmPoolAddressFunction",
      params: { tokenA: order.tokenIn, tokenB: order.tokenOut, fee: 3000 }
    });

    const currentPrice = await Lit.Actions.call({
      ipfsId: "QmGetCurrentPriceFunction",
      params: { poolAddress }
    });

    if (currentPrice >= order.priceThreshold) {
      const calldata = await Lit.Actions.call({
        ipfsId: "QmGenerateSwapCalldataFunction",
        params: {
          tokenIn: order.tokenIn,
          tokenOut: order.tokenOut,
          fee: 3000,
          recipient: LitActions.getParam('userAddress'),
          deadline: Math.floor(Date.now() / 1000) + 3600,
          amountIn: order.amountIn,
          amountOutMinimum: order.minAmountOut
        }
      });

      const sigShare = await LitActions.signEcdsa({ 
        toSign: calldata, 
        publicKey, 
        sigName: "sig1" 
      });

      LitActions.setResponse({signedTx: sigShare});
    } else {
      LitActions.setResponse({message: "Price conditions not met"});
    }
  };

  go();
`;

  const litResource: ILitResource = {
    resource: litActionCode,
    getResourceKey: function (): string {
      return 'executeOrder-' + Date.now();
    },
    isValidLitAbility: function (litAbility: LitAbility): boolean {
      return litAbility === LitAbility.LitActionExecution;
    },
    resourcePrefix: LitResourcePrefix.LitAction,
  };

  const authNeededCallback = async (params: any): Promise<AuthSig> => {
    const sessionSigResponse: SignSessionKeyResponse =
      await litNodeClient.signSessionKey({
        sessionKey: params.sessionKey,
        authMethods: [
          {
            authMethodType: 6,
            accessToken: googleCredential,
          },
        ],
        pkpPublicKey: pkp,
        expiration: params.expiration,
        resources: params.resources,
        chainId: 11155111,
      });

    const authSig: AuthSig = {
      sig: sessionSigResponse.authSig.sig,
      derivedVia: sessionSigResponse.authSig.derivedVia,
      signedMessage: sessionSigResponse.authSig.signedMessage,
      address: sessionSigResponse.authSig.address,
    };

    return authSig;
  };

  const sessionSigs = await litNodeClient.getSessionSigs({
    chain: 'sepolia',
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LitAbility.LitActionExecution,
      },
    ],
    expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    sessionKey: sessionKey,
    authNeededCallback: authNeededCallback,
  } as GetSessionSigsProps);

  const executionResult = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    jsParams: {
      encryptedOrder,
      publicKey: pkp,
      userAddress: await getProvider().getSigner().getAddress(),
    },
  });

  if (
    typeof executionResult.response === 'object' &&
    executionResult.response !== null
  ) {
    if ('signedTx' in executionResult.response) {
      const signer = getProvider().getSigner();
      const signedTx = executionResult.response.signedTx as {
        to: string;
        data: string;
        value: string;
        gasLimit: string;
        gasPrice: string;
      };
      const tx = await signer.sendTransaction({
        to: signedTx.to,
        data: signedTx.data,
        value: ethers.BigNumber.from(signedTx.value),
        gasLimit: ethers.BigNumber.from(signedTx.gasLimit),
        gasPrice: ethers.BigNumber.from(signedTx.gasPrice),
      });
      await tx.wait();
      console.log('Order executed:', tx.hash);
    } else if ('message' in executionResult.response) {
      console.log(executionResult.response.message);
    } else {
      console.log('Unexpected execution result:', executionResult);
    }
  } else {
    console.log('Unexpected execution result:', executionResult);
  }
};
