import { useState } from 'react';
import AuthMethods from './AuthMethods';

export type AuthView = 'default' | 'google';

interface SignUpProps {
  handleGoogleLogin: () => Promise<void>;
  goToLogin: () => void;
  error?: Error;
}

export default function SignUpMethods({
  handleGoogleLogin,
  goToLogin,
  error,
}: SignUpProps) {
  const [view, setView] = useState<AuthView>('default');

  return (
    <div className="w-full max-w-md max-h-[calc(100vh-0.5rem)] bg-gray-800  rounded-lg overflow-y-auto">
      <div className="space-y-4">
        {error && (
          <div className="flex p-4 rounded-lg bg-red-50 border border-dashed border-red-500 mb-6">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}
        {view === 'default' && (
          <>
            <h1 className="text-3xl font-bold mb-2 text-white">Sign Up</h1>
            <p className="text-base leading-6">
              Create a wallet using Google Auth with Lit-powered programmable
              MPC wallets.
            </p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              setView={setView}
            />
            <div className="flex flex-col mt-6 space-y-2">
              <button
                type="button"
                className="text-sm font-medium text-white hover:text-gray-400 focus:outline-none"
                onClick={goToLogin}
              >
                Have an account? Log in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
