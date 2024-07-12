import { executeOrder } from '@/uniswap/interface';
import React, { useState } from 'react';

const LimitOrder: React.FC = () => {
  const [orders, setOrders] = useState([]);

  // TODO: replace
  const pkp = '0x';

  const handleCreateOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: encrypt order
    //const formData = new FormData(event.currentTarget);

    // const order = {
    //   tokenIn: formData.get('tokenIn') as string,
    //   tokenOut: formData.get('tokenOut') as string,
    //   amountIn: formData.get('amountIn') as string,
    //   minAmountOut: formData.get('minAmountOut') as string,
    //   priceThreshold: formData.get('priceThreshold') as string,
    // };

    // const encryptedOrder = await createAndEncryptLimitOrder(order, pkp);
    // setOrders([...orders, encryptedOrder]);
  };

  const handleExecuteOrder = async (encryptedOrder: string) => {
    try {
      await executeOrder(encryptedOrder, pkp);
      setOrders(orders.filter((order) => order !== encryptedOrder));
    } catch (error) {
      console.error('failed executeOrder:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Limit Order</h2>
      <form onSubmit={handleCreateOrder} className="space-y-2">
        <input
          name="tokenIn"
          placeholder="Token In Address"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="tokenOut"
          placeholder="Token Out Address"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="amountIn"
          placeholder="Amount In"
          type="number"
          step="0.000001"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="minAmountOut"
          placeholder="Min Amount Out"
          type="number"
          step="0.000001"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="priceThreshold"
          placeholder="Price Threshold"
          type="number"
          step="0.000001"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Limit Order
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8">Your Limit Orders</h2>
      <ul className="space-y-2">
        {orders.map((order, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 bg-gray-100 rounded"
          >
            <span>Encrypted Order {index + 1}</span>
            <button
              onClick={() => handleExecuteOrder(order)}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Execute
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LimitOrder;
