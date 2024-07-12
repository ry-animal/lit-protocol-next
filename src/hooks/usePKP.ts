import { useLocalStorage } from 'usehooks-ts';

export function usePKP() {
  const [pkp, setPkp, removePkp] = useLocalStorage<string | null>(
    'lit-pkp',
    null
  );

  const storePkp = (newPkp: string) => {
    setPkp(newPkp);
  };

  return { pkp, storePkp, removePkp };
}
