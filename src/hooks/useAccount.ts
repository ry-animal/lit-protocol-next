import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { getPKPs, mintPKP } from '../utils/lit';
import { IRelayPKP } from '@lit-protocol/types';

export default function useAccounts() {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const fetchAccounts = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const myPKPs = await getPKPs(authMethod);
        console.log('fetchAccounts pkps: ', myPKPs);
        setAccounts(myPKPs);

        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('unknown error occurred in fetchAccounts'));
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createAccount = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const newPKP = await mintPKP(authMethod);
        console.log('createAccount pkp: ', newPKP);
        setAccounts((prev) => [...prev, newPKP]);
        setCurrentAccount(newPKP);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('unknown error in createAccount'));
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
    currentAccount,
    loading,
    error,
  };
}
