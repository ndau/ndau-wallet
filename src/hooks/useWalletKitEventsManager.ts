import React, { useCallback, useEffect } from 'react';
import { SignClientTypes } from '@walletconnect/types';
import { ApprovalModalHandler } from '../components/wallectConnectModals/ApprovalModal';
import { sendModalHandler } from '../components/wallectConnectModals/SendModal';
import { walletKit } from '../utils/WalletKitUtil';
import FlashNotification from '../components/common/FlashNotification';

import { EIP155_SIGNING_METHODS } from './useWalletConnect';

interface UseWalletKitEventsManagerProps {
  initialized: boolean;
  setProposal: React.Dispatch<React.SetStateAction<any>>;
  updatePairedSessions: () => void;
}

export default function useWalletKitEventsManager({
  initialized,
  setProposal,
}: UseWalletKitEventsManagerProps) {

  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      setProposal(proposal);
      ApprovalModalHandler.show({ data: proposal });
    },
    [setProposal],
  );

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      const { topic, params } = requestEvent;
      const { request } = params;
      const requestSession = walletKit?.engine?.signClient?.session?.get(topic);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          const modalData = { ...requestEvent, requestSession };
          return sendModalHandler.show({ data: modalData });
        default:
          console.warn(`Received unhandled method: ${request.method}`);
          break;
      }
    },
    [],
  );

  const onSessionDelete = useCallback(() => {
    if (global.refreshWCSessions) {
      global.refreshWCSessions();
    }
  }, []);

  useEffect(() => {
    if (initialized && walletKit) {
      try {
        walletKit.on('session_proposal', onSessionProposal);
        walletKit.on('session_request', onSessionRequest);
        walletKit.on('session_delete', onSessionDelete);
      } catch (error) {
        FlashNotification.show('Error setting up WalletConnect', true);
      }

      return () => {
        if (walletKit) {
          try {
            walletKit.off('session_proposal', onSessionProposal);
            walletKit.off('session_request', onSessionRequest);
            walletKit.off('session_delete', onSessionDelete);
          } catch (error) {
            console.error('Error removing WalletKit event listeners', error);
          }
        }
      };
    }
  }, [initialized, onSessionProposal, onSessionRequest, onSessionDelete]);
}
