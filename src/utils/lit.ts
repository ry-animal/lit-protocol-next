import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { GoogleProvider, LitAuthClient } from '@lit-protocol/lit-auth-client';
import {
  AuthMethodScope,
  AuthMethodType,
  ProviderType,
} from '@lit-protocol/constants';
import {
  AuthMethod,
  GetSessionSigsProps,
  IRelayPKP,
  SessionSigs,
} from '@lit-protocol/types';

export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
export const ORIGIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${DOMAIN}`
    : `http://${DOMAIN}:3000`;

export const litNodeClient: LitNodeClient = new LitNodeClient({
  alertWhenUnauthorized: false,
  litNetwork: 'datil-dev',
  debug: true,
});

export const litAuthClient: LitAuthClient = new LitAuthClient({
  litRelayConfig: {
    relayApiKey: 'test-api-key',
  },
  litNodeClient,
});

export async function signInWithGoogle(redirectUri: string): Promise<void> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  await googleProvider.signIn();
}

export async function authenticateWithGoogle(
  redirectUri: string
): Promise<AuthMethod | undefined> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  const authMethod = await googleProvider.authenticate();
  return authMethod;
}

export async function getSessionSigs({
  pkpPublicKey,
  authMethod,
  sessionSigsParams,
}: {
  pkpPublicKey: string;
  authMethod: AuthMethod;
  sessionSigsParams: GetSessionSigsProps;
}): Promise<SessionSigs> {
  const provider = getProviderByAuthMethod(authMethod);
  if (provider) {
    const sessionSigs = await provider.getSessionSigs({
      pkpPublicKey,
      authMethod,
      sessionSigsParams,
    });
    return sessionSigs;
  } else {
    throw new Error(
      `provider not found for auth method type ${authMethod.authMethodType}`
    );
  }
}

export async function updateSessionSigs(
  params: GetSessionSigsProps
): Promise<SessionSigs> {
  const sessionSigs = await litNodeClient.getSessionSigs(params);
  return sessionSigs;
}

export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
  const provider = getProviderByAuthMethod(authMethod);
  const allPKPs = await provider?.fetchPKPsThroughRelayer(authMethod);

  if (!allPKPs) {
    throw new Error('failed fetchPKPsThroughRelayer');
  }

  return allPKPs;
}

export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
  const provider = getProviderByAuthMethod(authMethod);
  const options = {
    permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
  };

  const txHash = await provider?.mintPKPThroughRelayer(authMethod, options);

  const response = await provider?.relay.pollRequestUntilTerminalState(
    txHash || ''
  );

  if (
    response?.status !== 'Succeeded' ||
    !response.pkpTokenId ||
    !response.pkpPublicKey ||
    !response.pkpEthAddress
  ) {
    throw new Error('minting failed');
  }

  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId,
    publicKey: response.pkpPublicKey,
    ethAddress: response.pkpEthAddress,
  };
  return newPKP;
}

function getProviderByAuthMethod(authMethod: AuthMethod) {
  switch (authMethod.authMethodType) {
    case AuthMethodType.GoogleJwt:
      return litAuthClient.getProvider(ProviderType.Google);
    default:
      return;
  }
}
