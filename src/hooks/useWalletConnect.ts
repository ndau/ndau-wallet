import { useCallback, useEffect, useRef, useState } from 'react'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, SessionTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'

import FlashNotification from '../components/common/FlashNotification';
export let signClient: SignClient;

const useWalletConnect = () => {

  const relayUrl = "wss://relay.walletconnect.com";

  const [paired, setPaired] = useState<SessionTypes.Struct[]>([]);
  const [clientInitialized, setClientInitialized] = useState<boolean>();
  const [loading, setLoading] = useState<string | null>(null);
  const [proposal, setProposal] = useState<any>(null);

  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      console.log("Proposal", JSON.stringify(proposal, null, 2));
      setProposal(proposal);
    },
    []
  )

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      console.log('session_request', requestEvent)
      const { topic, params, verifyContext } = requestEvent
      const { request } = params
      const requestSession = signClient.session.get(topic)
      // set the verify context so it can be displayed in the projectInfoCard

      // SettingsStore.setCurrentRequestVerifyContext(verifyContext)

      switch (request.method) {

      }
    }, []);

  useEffect(() => {
    createSignClient();
    return () => {

    }
  }, [])

  const createSignClient = async () => {
    setLoading("Initializing client");
    signClient = await SignClient.init({
      projectId: "faceb005777e478fa503489e83ba8b3b",
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
        setClientInitialized(true);
      }

      setLoading("");
    } catch (error) {
      setLoading("");
      setClientInitialized(false);
      console.error('Failed to set WalletConnect clientId in localStorage: ', error)
    }
  }

  const connectWithURI = async (uri: string) => {
    try {
      setLoading("Pairing");
      const response = await signClient.pair({ uri })
      console.log('signClient.pairing.getAll()', JSON.stringify(signClient.pairing.getAll(), null, 2));
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
              accounts: [`${obj.chains[0]}:${accountAddress}`],
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