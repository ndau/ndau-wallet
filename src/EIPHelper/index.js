import { Wallet, providers } from "ethers";
import { getSdkError } from '@walletconnect/utils'

import { EIP155_SIGNING_METHODS } from "../hooks/useWalletConnect";
import { NetworkManager } from "../helpers/EthersScanAPI";
import UserStore from "../stores/UserStore";
import FlashNotification from "../components/common/FlashNotification";


export function formatJsonRpcResult(id, result) {
  return {
    id,
    jsonrpc: "2.0",
    result,
  };
}

export function formatJsonRpcError(id, error) {
  return {
    id,
    jsonrpc: "2.0",
    error: error,
  };
}

export async function approveEIP155Request(requestEvent) {
  const { params, id } = requestEvent
  const { chainId, request } = params

  switch (request.method) {
    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        const provideUrl = NetworkManager.getEnv().eth;
        const provider = new providers.JsonRpcProvider(provideUrl);
        const wallet = new Wallet(UserStore.getActiveWallet().ercKeys.privateKey);
        const sendTransaction = request.params[0]
        const connectedWallet = wallet.connect(provider)
        const { hash } = await connectedWallet.sendTransaction({
          to: sendTransaction.to,
          from: sendTransaction.from,
          gasPrice: sendTransaction.gas,
          value: sendTransaction.value,
          data: sendTransaction.data
        });
        return formatJsonRpcResult(id, hash)
      } catch (error) {
        console.log('Error while commiting', JSON.stringify(error, null, 2));
        FlashNotification.show(error.reason);
        return formatJsonRpcError(id, error.message)
      }

    default:
      throw new Error(getSdkError('INVALID_METHOD').message)
  }
}

export function rejectEIP155Request(request) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED').message)
}