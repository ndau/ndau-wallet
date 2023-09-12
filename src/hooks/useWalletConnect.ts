import { useCallback, useEffect, useRef, useState } from 'react'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, SessionTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'

import FlashNotification from '../components/common/FlashNotification';
import { sendModalHandler } from '../components/wallectConnectModals/SendModal';
import AppConfig from '../AppConfig';

export let signClient: SignClient;
export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction'
}

const useWalletConnect = () => {

  const relayUrl = "wss://relay.walletconnect.com";

  const [paired, setPaired] = useState<SessionTypes.Struct[]>([]);
  const [clientInitialized, setClientInitialized] = useState<boolean>();
  const [loading, setLoading] = useState<string | null>(null);
  const [proposal, setProposal] = useState<any>(null);

  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      // console.log('ahha', JSON.stringify(proposal, null, 2));
      setProposal(proposal);
    },
    []
  )

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      const { topic, params, verifyContext } = requestEvent
      const { request } = params
      const requestSession = signClient.session.get(topic)

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION: return sendModalHandler.show({ data: { ...requestEvent, requestSession } })
      }
    }, []);

  useEffect(() => {
    createSignClient();
    return () => {
      if (signClient) {
        signClient.removeAllListeners('session_request');
        signClient.removeAllListeners('session_proposal');
        signClient.removeAllListeners('session_ping');
        signClient.removeAllListeners('session_event');
        signClient.removeAllListeners('session_update');
        signClient.removeAllListeners('session_delete');
      }
    }
  }, [])

  const createSignClient = async () => {
    setLoading("Initializing client");
    signClient = await SignClient.init({
      projectId: AppConfig.Wallet_Connect_ApiKey,
      relayUrl: relayUrl,
      metadata: {
        name: 'NDAU Wallet',
        description: 'NDAU Wallet for WalletConnect',
        url: 'https://ndau.io/',
        icons: []
      }
    })
    setPaired(signClient?.session?.values)

    try {
      const clientId = await signClient.core.crypto.getClientId()
      if (clientId) {
        signClient.on('session_proposal', onSessionProposal)
        signClient.on('session_request', onSessionRequest)
        signClient.on('session_ping', data => console.log('ping', data))
        signClient.on('session_event', data => console.log('event', data))
        signClient.on('session_update', data => console.log('update', data))
        signClient.on('session_delete', data => setPaired(_ => _.filter(pair => pair.topic !== data.topic)))
        setClientInitialized(true);
      }

      setLoading("");
    } catch (error) {
      setLoading("");
      setClientInitialized(false);
      console.error('Failed to set WalletConnect clientId', error)
    }
  }

  const connectWithURI = async (uri: string) => {
    try {
      setLoading("Pairing");
      const response = await signClient.pair({ uri })
      setPaired(signClient?.session?.values)
      setLoading("");
    } catch (error) {
      FlashNotification.show((error as Error).message, true);
    } finally {
      setLoading("")
    }
  }

  const disconnect = (topic: string) => {
    signClient.disconnect({ topic, reason: getSdkError("USER_DISCONNECTED") }).then(res => {
      setPaired([...paired.filter(pair => pair.topic !== topic)]);
    }).catch(err => {
      FlashNotification.show(err.message, true)
    });
  }

  const approve = (accountAddress: string) => {
    return new Promise((resolve, reject) => {
      try {
        if (proposal?.id) {
          const { id, params } = proposal;
          const { proposer, requiredNamespaces, optionalNamespaces, sessionProperties, relays } = params
          // requiredNamespaces = {
          //   "eip155": {
          //     "chains": [
          //       "eip155:1"
          //     ],
          //     "methods": [
          //       "eth_sendTransaction",
          //       "personal_sign"
          //     ],
          //     "events": [
          //       "chainChanged",
          //       "accountsChanged"
          //     ],
          //     "rpcMap": {
          //       "1": "https://mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1"
          //     }
          //   }
          // };
          const namespaces: any = {
            /**
             * eip155: {
             *  accounts: ['eip155:1:acountaddress'],
             *  chains: { 0: 'eip155:1' },
             *  events: { 0: 'chainChainged', 1: 'accountsChanged' },
             *  methods: { 0: 'eth_sendTransaction', 1: 'personal_sign' }
             * }
             */
          };

          Object.keys(requiredNamespaces).forEach(key => {
            const obj = requiredNamespaces[key];
            namespaces[key] = {
              accounts: [
                `${obj.chains[0]}:${accountAddress}`,
                `eip155:5:${accountAddress}` // for goerli supported
              ],
              chains: obj.chains,
              methods: obj.methods,
              events: obj.events
            };
          })

          signClient.approve({
            id: id,
            relayProtocol: relays[0].protocol,
            namespaces
          }).then((res) => {
            setProposal(null);
            setPaired(signClient?.session?.values)
            resolve(res);
          }).catch(err => {
            console.log('Err while approving', err.message);
            reject(err);
          })
        }
      } catch (e: any) {
        FlashNotification.show(e.message, true);
        reject(e);
      }
    })
  }

  const reject = () => {
    return new Promise((resolve, reject) => {
      try {
        if (proposal?.id) {
          signClient.reject({
            id: proposal.id,
            reason: getSdkError("USER_REJECTED")
          }).then(() => {
            setProposal(null);
            resolve(true);
          })
        }
      } catch (e: any) {
        FlashNotification.show(e.message, true);
        reject(e);
      }
    })
  }

  return {
    loading,
    paired,
    clientInitialized,
    proposal,

    connectWithURI,
    disconnect,
    approve,
    reject
  }
}

export default useWalletConnect;