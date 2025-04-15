import { useCallback, useEffect, useState } from 'react';
import { createWalletKit } from '../utils/WalletKitUtil';

export default function useInitializeWalletKit() {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    try {
      await createWalletKit();
      setInitialized(true);
    } catch (err: unknown) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}
