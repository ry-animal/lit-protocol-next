/* eslint-disable @typescript-eslint/no-explicit-any */
interface CreateAccountProp {
  signUp: any;
  error?: Error;
}

export default function CreateAccount({ signUp, error }: CreateAccountProp) {
  return (
    <div className="w-full max-w-md max-h-[calc(100vh-0.5rem)] bg-gray-800  rounded-lg overflow-y-auto">
      <div className="space-y-4">
        {error && (
          <div className="flex p-4 rounded-lg bg-red-50 border border-dashed border-red-500 mb-6">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2 text-white">Need a PKP?</h1>
        <p className="text-base leading-6 text-white">
          There doesn&apos;t seem to be a Lit wallet associated with your
          credentials. Create one today.
        </p>
        <div className="flex flex-col mt-6 space-y-2 text-white">
          <button
            onClick={signUp}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
