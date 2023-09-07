import { useCallback, useEffect, useRef, useState } from 'react'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, PairingTypes } from '@walletconnect/types'
import FlashNotification from '../components/common/FlashNotification';
export let signClient: SignClient;

const useWalletConnect = () => {

  const relayUrl = "wss://relay.walletconnect.com";

  const [paired, setPaired] = useState<PairingTypes.Struct[]>([]);
  const [clientInitialized, setClientInitialized] = useState<boolean>();
  const [loading, setLoading] = useState<string | null>(null);
  const [proposal, setProposal] = useState<any>(null);


  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      console.log('session_request', JSON.stringify(proposal, null, 2));
      // set the verify context so it can be displayed in the projectInfoCard

      // SettingsStore.setCurrentRequestVerifyContext(proposal.verifyContext)
      // ModalStore.open('SessionProposalModal', { proposal })
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
    setPaired(signClient.pairing.getAll())

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
      console.log("Pairing response", response);
      setPaired(signClient.pairing.getAll())
      setLoading("");
    } catch (error) {
      FlashNotification.show((error as Error).message, true);
    } finally {
      setLoading("")
    }
  }

  const disconnect = (topic: string) => {
    signClient.disconnect({ topic, reason: "6000" });
    setPaired([]);
  }

  return {
    loading,
    paired,
    clientInitialized,
    proposal,

    connectWithURI,
    disconnect
  }
}

export default useWalletConnect;