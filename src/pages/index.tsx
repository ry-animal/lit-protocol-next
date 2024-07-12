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
    if (authMethod && authMethod.authMethodType === AuthMethodType.Google) {
      router.replace(window.location.pathname, undefined, { shallow: true });
      createAccount(authMethod);
    }
  }, [authMethod, createAccount]);

  useEffect(() => {
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  if (authLoading) {
    return (
      <Loading copy={'Authenticating your credentials...'} error={error} />
    );
  }

  if (accountsLoading) {
    return <Loading copy={'Creating your account...'} error={error} />;
  }

  if (sessionLoading) {
    return <Loading copy={'Securing your session...'} error={error} />;
  }

  return (
    <>
      <Header />
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} bg-gray-900 bg-opacity-25`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
          {currentAccount && sessionSigs ? (
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
