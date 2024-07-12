import Header from '@/components/Header';
import { Inter } from 'next/font/google';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ORIGIN, signInWithGoogle } from '../utils/lit';
import { AuthMethodType } from '@lit-protocol/constants';
import useAccounts from '@/hooks/useAccount';
import useAuthenticate from '@/hooks/useAuthenticate';
import useSession from '@/hooks/useSession';
import Loading from '@/components/Loading';
import SignUpMethods from '@/components/SignUpMethods';
import LimitOrder from '@/components/LimitOrder';

const inter = Inter({ subsets: ['latin'] });

export type LoadingState = 'auth' | 'accounts' | 'session' | null;
export const loadingCopyMap: Record<NonNullable<LoadingState>, string> = {
  auth: 'Authenticating your credentials...',
  accounts: 'Creating your account...',
  session: 'Securing your session...',
};

export default function Home() {
  const redirectUri = ORIGIN;

  const {
    authMethod,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);

  const {
    createAccount,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();

  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();

  const router = useRouter();

  const error = authError || accountsError || sessionError;

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  useEffect(() => {
    if (authMethod && authMethod.authMethodType !== AuthMethodType.WebAuthn) {
      router.replace(window.location.pathname, undefined, { shallow: true });
      console.log('authMethod: ', authMethod);
      createAccount(authMethod);
    }
  }, [authMethod, createAccount]);

  useEffect(() => {
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  const currentLoadingState: LoadingState = authLoading
    ? 'auth'
    : accountsLoading
      ? 'accounts'
      : sessionLoading
        ? 'session'
        : null;

  console.log('currentAccount: ', currentAccount);
  console.log('sessionSigs: ', sessionSigs);

  return (
    <>
      <Header />
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} bg-gray-900 bg-opacity-25`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
          {currentLoadingState ? (
            <Loading copy={loadingCopyMap[currentLoadingState]} error={error} />
          ) : currentAccount && sessionSigs ? (
            <LimitOrder />
          ) : (
            <div className="text-white bg-gray-800 p-6 rounded-xl">
              <SignUpMethods
                handleGoogleLogin={handleGoogleLogin}
                goToLogin={() => router.push('/login')}
                error={error}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
