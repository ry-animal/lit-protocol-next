import { Interface } from '@ethersproject/abi';

interface ExactInputSingleData {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  amountIn: string;
  amountOutMinimum: string;
  sqrtPriceLimitX96: string;
}

const exactInputSingleInterface = new Interface([
  'function exactInputSingle(tuple(address,address,uint24,address,uint256,uint256,uint160)) external payable returns (uint256)',
]);

export function generateSwapExactInputSingleCalldata(
  exactInputSingleData: ExactInputSingleData
) {
  return exactInputSingleInterface.encodeFunctionData('exactInputSingle', [
    [
      exactInputSingleData.tokenIn,
      exactInputSingleData.tokenOut,
      exactInputSingleData.fee,
      exactInputSingleData.recipient,
      exactInputSingleData.amountIn,
      exactInputSingleData.amountOutMinimum,
      exactInputSingleData.sqrtPriceLimitX96,
    ],
  ]);
}
