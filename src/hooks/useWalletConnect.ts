import { useCallback, useState } from 'react';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';

import FlashNotification from '../components/common/FlashNotification';
import useInitializeWalletKit from './useInitializeWalletKit';
import useWalletKitEventsManager from './useWalletKitEventsManager';
import { walletKit } from '../utils/WalletKitUtil';

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};

const useWalletConnect = () => {
  const [paired, setPaired] = useState<SessionTypes.Struct[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [proposal, setProposal] = useState<any>(null);

  const isInitialized = useInitializeWalletKit();

  const updatePairedSessions = useCallback(() => {
    if (walletKit && isInitialized) {
      try {
        const sessions = walletKit.getActiveSessions();
        setPaired(Object.values(sessions || {}));
      } catch (error) {
        console.error('Error getting active sessions:', error);
        setPaired([]);
      }
    } else {
      setPaired([]);
    }
  }, [isInitialized]);

  useWalletKitEventsManager({
    initialized: isInitialized,
    setProposal,
    updatePairedSessions,
  });

  const connectWithURI = async (uri: string) => {
    try {
      setLoading('Pairing');
      if (walletKit) {
        await walletKit.pair({ uri });
      } else {
        FlashNotification.show('WalletConnect client not ready', true);
      }
    } catch (error: any) {
      FlashNotification.show(error?.message || 'Pairing failed', true);
    } finally {
      setLoading('');
    }
  };

  const disconnect = (topic: string) => {
    if (walletKit) {
      setLoading('Disconnecting');
      walletKit.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
        .then(() => {
          if (global.refreshWCSessions) {
            global.refreshWCSessions();
          }
        }).catch(err => {
          console.error('Error disconnecting session:', err);
          FlashNotification.show(err.message || 'Failed to disconnect', true);
        }).finally(() => {
          setLoading('');
        });
    }
  };

  const approve = (accountAddress: string, customProposal?: any) => {
    return new Promise((resolve, reject) => {
      try {
        const proposalToUse = customProposal || proposal;
        if (!accountAddress) {
          reject(new Error('Cannot approve session without a valid account address.'));
          return;
        }
        if (!proposalToUse || !walletKit) {
          reject(new Error('No proposal or WalletKit not initialized'));
          return;
        }

        const { id, params } = proposalToUse;
        const namespacesToProcess = (params.requiredNamespaces && Object.keys(params.requiredNamespaces).length > 0)
          ? params.requiredNamespaces
          : params.optionalNamespaces;
        if (!namespacesToProcess || Object.keys(namespacesToProcess).length === 0) {
          reject(new Error('Invalid session proposal: Missing namespaces.'));
          return;
        }

        const approvedNamespaces: SessionTypes.Namespaces = {};
        const supportedNamespaceKey = 'eip155';
        if (namespacesToProcess[supportedNamespaceKey]) {
          const requestedNamespace = namespacesToProcess[supportedNamespaceKey];
          const requestedChains = requestedNamespace.chains?.filter(chain => chain.startsWith('eip155:')) || [];
          if (requestedChains.length > 0) {
            const accountsForNamespace = requestedChains.map(chain => `${chain}:${accountAddress}`);
            approvedNamespaces[supportedNamespaceKey] = {
              accounts: accountsForNamespace,
              chains: requestedChains,
              methods: requestedNamespace.methods || [],
              events: requestedNamespace.events || [],
            };
          }
        }

        if (Object.keys(approvedNamespaces).length === 0) {
          reject(getSdkError('UNSUPPORTED_CHAINS'));
          return;
        }

        walletKit.approveSession({ id, namespaces: approvedNamespaces })
          .then((session) => {
            setProposal(null);
            resolve(session);
          }).catch(err => {
            FlashNotification.show(err?.message || 'Failed to approve session', true);
            reject(err);
          });
      } catch (e: any) {
        FlashNotification.show(e?.message || 'An unexpected error occurred during approval', true);
        reject(e);
      }
    });
  };

  const reject = () => {
    return new Promise<void>((resolve, rejectPromise) => {
      try {
        if (proposal && walletKit) {
          setLoading('Rejecting');
          walletKit.rejectSession({ id: proposal.id, reason: getSdkError('USER_REJECTED') })
            .then(() => {
              setProposal(null);
              resolve();
            }).catch(err => {
              FlashNotification.show(err.message || 'Failed to reject session', true);
              rejectPromise(err);
            }).finally(() => {
              setLoading('');
            });
        } else { resolve(); }
      } catch (e: any) {
        FlashNotification.show(e.message || 'An unexpected error occurred during rejection', true);
        rejectPromise(e);
      }
    });
  };

  return {
    loading,
    paired,
    clientInitialized: isInitialized,
    proposal,
    connectWithURI,
    disconnect,
    approve,
    reject,
    updatePairedSessions,
    isInitialized,
  };
};

export default useWalletConnect;
