import { Wallet, providers, utils } from 'ethers';
import { getSdkError } from '@walletconnect/utils';

import { EIP155_SIGNING_METHODS } from '../hooks/useWalletConnect';
import { NetworkManager } from '../helpers/EthersScanAPI';
import UserStore from '../stores/UserStore';
import FlashNotification from '../components/common/FlashNotification';

export function formatJsonRpcResult(id, result) {
  return { id, jsonrpc: '2.0', result };
}

export function formatJsonRpcError(id, error) {
  const errorPayload = typeof error === 'string' ? { message: error } : error;
  return { id, jsonrpc: '2.0', error: errorPayload };
}

const getRpcUrl = (chainId) => {
  const networkEnvUrls = NetworkManager.getEnv();
  switch (chainId) {
    case 'eip155:1':
    case 'eip155:5':
      return networkEnvUrls.eth;
    case 'eip155:11155111':
      return networkEnvUrls.ethSepolia;
    case 'eip155:137':
    case 'eip155:80001':
      return networkEnvUrls.polygon;
    case 'eip155:280':
    case 'eip155:324':
      return networkEnvUrls.zkSyncEra;
    default:
      return null;
  }
};

export async function handlePersonalSign(requestEvent) {
  const { params, id } = requestEvent;
  const { request } = params;
  try {
    const messageHex = request.params[0];
    const address = request.params[1];
    const activeWallet = UserStore.getActiveWallet();
    if (!activeWallet?.ercKeys?.privateKey) {
      throw new Error("Active wallet or private key not found.");
    }
    const wallet = new Wallet(activeWallet.ercKeys.privateKey);
    if (wallet.address.toLowerCase() !== address.toLowerCase()) {
      return formatJsonRpcError(id, getSdkError('UNAUTHORIZED_METHOD').message);
    }
    const message = utils.toUtf8String(messageHex);
    const signature = await wallet.signMessage(message);
    return formatJsonRpcResult(id, signature);
  } catch (error) {
    FlashNotification.show(error?.message || 'Failed to sign message');
    return formatJsonRpcError(id, { message: error?.message || 'Failed to sign message' });
  }
}

export async function handleSendTransaction(requestEvent) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  try {
    const provideUrl = getRpcUrl(chainId);
    if (!provideUrl) {
      throw new Error(`Unsupported or unknown chainId: ${chainId}`);
    }
    const provider = new providers.JsonRpcProvider(provideUrl);
    const activeWallet = UserStore.getActiveWallet();
    if (!activeWallet?.ercKeys?.privateKey) {
      throw new Error("Active wallet or private key not found.");
    }
    const wallet = new Wallet(activeWallet.ercKeys.privateKey);
    const connectedWallet = wallet.connect(provider);
    const sendTransaction = request.params[0];
    if (sendTransaction.from && sendTransaction.from.toLowerCase() !== wallet.address.toLowerCase()) {
      return formatJsonRpcError(id, getSdkError('UNAUTHORIZED_METHOD').message);
    }
    const nonce = await provider.getTransactionCount(wallet.address, 'pending');
    const tx = {
      to: sendTransaction.to,
      nonce: nonce,
      gasLimit: sendTransaction.gas || sendTransaction.gasLimit,
      gasPrice: sendTransaction.gasPrice || undefined,
      value: sendTransaction.value || '0x00',
      data: sendTransaction.data || undefined,
      chainId: parseInt(chainId.split(':')[1]),
    };
    if (!tx.gasLimit) {
      try {
        tx.gasLimit = (await connectedWallet.estimateGas(tx)).toString();
      } catch (estimateError) {
        tx.gasLimit = '21000';
      }
    }
    if (!tx.gasPrice) {
      try {
        const feeData = await provider.getFeeData();
        if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
          tx.maxFeePerGas = feeData.maxFeePerGas;
          tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
          delete tx.gasPrice;
        } else if (feeData.gasPrice) {
          tx.gasPrice = feeData.gasPrice;
        }
      } catch (feeError) {
        console.error("Failed to fetch fee data:", feeError);
      }
    }
    const { hash } = await connectedWallet.sendTransaction(tx);
    return formatJsonRpcResult(id, hash);
  } catch (error) {
    const reason = error?.reason || error?.data?.message || error?.message || 'Transaction failed';
    FlashNotification.show(reason);
    return formatJsonRpcError(id, { message: reason });
  }
}

export async function approveEIP155Request(requestEvent) {
  const { params } = requestEvent;
  const { request } = params;
  switch (request.method) {
    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      return handleSendTransaction(requestEvent);
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      return handlePersonalSign(requestEvent);
    default:
      return formatJsonRpcError(requestEvent.id, getSdkError('UNSUPPORTED_METHODS'));
  }
}

export function rejectEIP155Request(request) {
  const { id } = request;
  return formatJsonRpcError(id, getSdkError('USER_REJECTED').message);
}
