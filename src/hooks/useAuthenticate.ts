/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import {
  isSignInRedirect,
  getProviderFromUrl,
} from '@lit-protocol/lit-auth-client';
import { AuthMethod } from '@lit-protocol/types';
import { authenticateWithGoogle } from '../utils/lit';

export default function useAuthenticate(redirectUri?: string) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const authWithGoogle = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = (await authenticateWithGoogle(
        redirectUri as any
      )) as any;
      setAuthMethod(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('unknown error in authWithGoogle'));
      }
    } finally {
      setLoading(false);
    }
  }, [redirectUri]);

  useEffect(() => {
    if (redirectUri && isSignInRedirect(redirectUri)) {
      const providerName = getProviderFromUrl();
      if (providerName === 'google') {
        authWithGoogle();
      }
    }
  }, [redirectUri, authWithGoogle]);

  return {
    authMethod,
    loading,
    error,
  };
}
