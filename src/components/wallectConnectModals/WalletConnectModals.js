import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ethers } from 'ethers';

import ApprovalModal, { ApprovalModalHandler } from './ApprovalModal';
import SendModal, {sendModalHandler} from './SendModal';
import FlashNotification from '../common/FlashNotification';
import { useWallet, useWalletConnect } from '../../hooks';
import { EthersScanAPI, NetworkManager, Converters } from '../../helpers/EthersScanAPI';
import { walletKit } from '../../utils/WalletKitUtil';
import { approveEIP155Request, formatJsonRpcError, rejectEIP155Request } from '../../EIPHelper';

const WalletConnectModals = () => {
  const { getActiveWallet } = useWallet();
  const { approve: approveSession, reject: rejectSession, proposal } = useWalletConnect();
  const [account, setAccount] = useState({
    accountAddress: '',
    totalFunds: '',
    usdAmount: '',
  });

  const activeWalletAddress = useMemo(() => getActiveWallet()?.ercAddress, [getActiveWallet]);

  const loadAccountData = useCallback(async () => {
    if (!activeWalletAddress) {
      setAccount({ accountAddress: '', totalFunds: '', usdAmount: '' });
      return;
    }
    try {
      const [ethPriceResponse, balance] = await Promise.all([
        EthersScanAPI.getEthPriceInUSD(),
        NetworkManager.getBalance(),
      ]);

      let ethUsdPrice = 0;
      if (ethPriceResponse?.message === 'OK') {
        ethUsdPrice = ethPriceResponse.result.ethusd;
      }
      const ethBalance = parseFloat(ethers.utils.formatEther(balance || 0));

      setAccount(prev => {
        const newState = {
          accountAddress: activeWalletAddress,
          totalFunds: ethBalance.toString(),
          usdAmount: Converters.ETH_USD(ethBalance, ethUsdPrice),
        };
        if(prev.accountAddress !== newState.accountAddress || prev.totalFunds !== newState.totalFunds || prev.usdAmount !== newState.usdAmount) {
          return newState;
        }
        return prev;
      });

    } catch (error) {
      console.error('Error loading wallet data:', error);
      setAccount({ accountAddress: '', totalFunds: '', usdAmount: '' });
    }
  }, [activeWalletAddress]);

  useEffect(() => {
    loadAccountData();
  }, [loadAccountData]);

  const handleApprovalApprove = () => {
    ApprovalModalHandler.acceptLoading(true);
    let currentAddress = account.accountAddress || activeWalletAddress;

    if (!currentAddress) {
      const activeWallet = getActiveWallet();
      currentAddress = activeWallet?.ercAddress;
    }

    if (!currentAddress) {
      ApprovalModalHandler.acceptLoading(false);
      FlashNotification.show('Active account address not found!');
      return;
    }

    let proposalData = proposal || global.ApprovalModal?.getData?.();
    if (!proposalData || !proposalData.id) {
      ApprovalModalHandler.acceptLoading(false);
      FlashNotification.show('Error: No connection data available');
      return;
    }

    approveSession(currentAddress, proposalData)
      .then(res => {
        ApprovalModalHandler.acceptLoading(false);
        ApprovalModalHandler.hide();
        if (global.refreshWCSessions) {
          global.refreshWCSessions();
        }
      })
      .catch(err => {
        ApprovalModalHandler.acceptLoading(false);
        FlashNotification.show(err?.message || 'Failed to approve session');
      });
  };

  const handleApprovalReject = () => {
    ApprovalModalHandler.rejectLoading(true);
    rejectSession().then(() => {
      ApprovalModalHandler.rejectLoading(false);
      ApprovalModalHandler.hide();
      if (global.refreshWCSessions) {
        global.refreshWCSessions();
      }
    }).catch(err => {
      ApprovalModalHandler.rejectLoading(false);
      FlashNotification.show(err?.message || 'Failed to reject session');
    });
  };

  const handleSendApprove = async (requestData) => {
    try {
      const response = await approveEIP155Request(requestData);
      await walletKit.respondSessionRequest({ topic: requestData.topic, response });
      sendModalHandler.hide();
    } catch (error) {
      console.error('Error approving transaction/sign:', error);
      FlashNotification.show(error?.message || 'Failed to approve request');
      try {
        if (requestData?.id && requestData?.topic) {
          await walletKit.respondSessionRequest({
            topic: requestData.topic,
            response: formatJsonRpcError(requestData.id, { message: error?.message || 'Processing failed' }),
          });
        }
      } catch (respError) {
        console.error('Failed to send error response after approve error', respError);
      }
      sendModalHandler.hide();
    }
  };

  const handleSendReject = async (requestData) => {
    try {
      const response = rejectEIP155Request(requestData);
      await walletKit.respondSessionRequest({ topic: requestData.topic, response });
      sendModalHandler.hide();
    } catch (error) {
      console.error('Error rejecting transaction/sign:', error);
      FlashNotification.show(error?.message || 'Failed to reject request');
      sendModalHandler.hide();
    }
  };

  return (
    <View style={styles.container}>
      <ApprovalModal
        accountData={account}
        onApprove={handleApprovalApprove}
        onReject={handleApprovalReject}
      />
      <SendModal
        onApprove={handleSendApprove}
        onReject={handleSendReject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'visible',
    zIndex: 1000,
  },
});

export default WalletConnectModals;
