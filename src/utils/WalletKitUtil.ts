import { WalletKit, IWalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../AppConfig';

export let walletKit: IWalletKit;

export async function createWalletKit() {
  const core = new Core({
    projectId: AppConfig.Wallet_Connect_ApiKey,
    relayUrl: 'wss://relay.walletconnect.com',
  });
  walletKit = await WalletKit.init({
    core,
    metadata: {
      name: 'NDAU Wallet',
      description: 'NDAU Wallet for WalletConnect',
      url: 'https://ndau.io/',
      icons: [],
    },
  });

  try {
    const clientId = await walletKit.engine.signClient.core.crypto.getClientId();
    AsyncStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId);
  } catch (error) {
    console.error('Failed to set WalletConnect clientId in localStorage: ', error);
  }
}

export async function updateSignClientChainId(
  chainId: string,
  address: string,
) {
  const sessions = walletKit.getActiveSessions();
  if (!sessions) {
    return;
  }
  const namespace = chainId.split(':')[0];
  Object.values(sessions).forEach(async session => {
    await walletKit.updateSession({
      topic: session.topic,
      namespaces: {
        ...session.namespaces,
        [namespace]: {
          ...session.namespaces[namespace],
          chains: [
            ...new Set(
              [chainId].concat(
                session.namespaces[namespace]?.chains || [],
              ),
            ),
          ],
          accounts: [
            ...new Set(
              [`${chainId}:${address}`].concat(
                session.namespaces[namespace]?.accounts || [],
              ),
            ),
          ],
        },
      },
    });
  });
}
