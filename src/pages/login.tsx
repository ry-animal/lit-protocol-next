import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import useAuthenticate from '../hooks/useAuthenticate';
import useSession from '../hooks/useSession';
import { ORIGIN, signInWithGoogle } from '../utils/lit';
import Loading from '../components/Loading';
import AccountSelection from '../components/AccountSelection';
import useAccounts from '@/hooks/useAccount';
import LoginMethods from '@/components/LoginMethods';
import CreateAccount from '@/components/CreateAccount';
import Header from '@/components/Header';
import LimitOrder from '@/components/LimitOrder';

const inter = Inter({ subsets: ['latin'] });

export default function LoginView() {
  const redirectUri = ORIGIN + '/login';

  const {
    authMethod,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);

  const {
    fetchAccounts,
    setCurrentAccount,
    currentAccount,
    accounts,
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

  function goToSignUp() {
    router.push('/');
  }

  useEffect(() => {
    if (authMethod) {
      router.replace(window.location.pathname, undefined, { shallow: true });
      fetchAccounts(authMethod);
    }
  }, [authMethod, fetchAccounts]);

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
    return <Loading copy={'Looking up your accounts...'} error={error} />;
  }

  if (sessionLoading) {
    return <Loading copy={'Securing your session...'} error={error} />;
  }

  if (currentAccount && sessionSigs) {
    return <div>Uniswap</div>;
  }

  if (authMethod && accounts.length > 0) {
    return (
      <AccountSelection
        accounts={accounts}
        setCurrentAccount={setCurrentAccount}
        error={error}
      />
    );
  }

  if (authMethod && accounts.length === 0) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} bg-gray-900 bg-opacity-25`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
          <div className="text-white bg-gray-800 p-6 rounded-xl">
            <CreateAccount signUp={goToSignUp} error={error} />
          </div>
        </div>
      </main>
    );
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
              <LoginMethods
                handleGoogleLogin={handleGoogleLogin}
                signUp={goToSignUp}
                error={error}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
