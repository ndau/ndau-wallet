import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { ethers, utils } from 'ethers';

import { themeColors } from '../../config/colors';
import CustomText from '../CustomText';
import Button from '../Button';
import { EIP155_CHAINS, ndauUtils } from '../../utils';
import { EIP155_SIGNING_METHODS } from '../../hooks/useWalletConnect';
import { walletKit } from '../../utils/WalletKitUtil';
import FlashNotification from '../common/FlashNotification';

const SendModal = ({ onApprove, onReject }) => {

  const [isVisible, setIsVisible] = useState(false);
  const [fullData, setData] = useState(null);
  const [requestSession, setRequestSession] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    global.sendModal = innerFunc;
    return () => {
      global.sendModal = undefined;
    };
  }, []);

  const innerFunc = ({ show, data }) => {
    if (show && data) {
      setData(data);
      const session = data.requestSession || walletKit?.getActiveSessions()?.[data.topic] || null;
      setRequestSession(session);
      setIsVisible(true);
    } else if (!show) {
      setIsVisible(false);
      setData(null);
      setRequestSession(null);
      setApproving(false);
      setRejecting(false);
    }
  };

  const requesterInfo = useMemo(() => {
    if (!requestSession?.peer?.metadata) {return { icon: undefined, name: '', url: '' };}
    const { name, icons, url } = requestSession.peer.metadata;
    const info = {
      icon: icons?.[0] || icons?.[1],
      name: name || 'Requesting App',
      url: url || '',
    };
    return info;
  }, [requestSession]);

  const requestInfo = useMemo(() => {
    if (!fullData?.params?.request) {
      return { type: 'unknown', method: 'Unknown', chainId: null, chain: null };
    }

    const { request, chainId } = fullData.params;
    const { params, method } = request;
    const chain = EIP155_CHAINS[chainId] || { name: chainId || 'Unknown Chain', id: chainId };

    if (method === EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION) {
      if (!params || !Array.isArray(params) || !params[0]) {
        return { type: 'unknown', method, chainId, chain };
      }
      const txData = params[0];
      const info = {
        type: 'transaction',
        method,
        chainId,
        chain,
        gas: ethers.utils.formatEther(txData.gas || txData.gasLimit || '0x0'),
        value: ethers.utils.formatEther(txData.value || '0x0'),
        from: txData.from ? ndauUtils.truncateAddress(txData.from) : undefined,
        to: txData.to ? ndauUtils.truncateAddress(txData.to) : undefined,
        data: txData.data,
      };
      return info;
    } else if (method === EIP155_SIGNING_METHODS.PERSONAL_SIGN) {
      if (!params || !Array.isArray(params) || params.length < 2) {
        return { type: 'unknown', method, chainId, chain };
      }
      const messageHex = params[0];
      const address = params[1];
      let messageString = '[Could not decode message]';
      try {
        messageString = utils.toUtf8String(messageHex);
      } catch (e) {
        if (typeof messageHex === 'string') { messageString = messageHex; }
      }
      const info = {
        type: 'sign_message',
        method,
        chainId,
        chain,
        address: address ? ndauUtils.truncateAddress(address) : undefined,
        message: messageString,
      };
      return info;
    } else {
      return { type: 'unknown', method: method || 'Unknown', chainId, chain };
    }
  }, [fullData]);

  const approve = async () => {
    if (!fullData) {return;}
    setApproving(true);
    try {
      if (typeof onApprove === 'function') {
        await onApprove(fullData);
      }
    } catch (e) {
      FlashNotification.show(e?.message || "Approval failed");
    } finally {
      setApproving(false);
      setIsVisible(false);
    }
  };

  const reject = async () => {
    if (!fullData) {return;}
    setRejecting(true);
    try {
      if (typeof onReject === 'function') {
        await onReject(fullData);
      }
    } catch (err) {
      FlashNotification.show(err?.message || "Failed to reject");
    } finally {
      setRejecting(false);
      setIsVisible(false);
    }
  };

  const renderDataField = ({ key, value }) => {
    if (value === undefined || value === null || value === '') {return null;}
    return (
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        <CustomText titiliumBold>{key}</CustomText>
        <CustomText titilium color={themeColors.black300}>{value}</CustomText>
      </View>
    );
  };

  const modalTitle = requestInfo?.type === 'transaction' ? 'Send Transaction' :
    requestInfo?.type === 'sign_message' ? 'Sign Message' :
      'Request';

  return (
    <Modal
      onBackdropPress={() => setIsVisible(false)}
      animationIn={'slideInUp'}
      style={styles.bottomModal}
      isVisible={isVisible}>
      <View style={styles.container}>
        {fullData ? (
          <>
            <CustomText titiliumBold body style={{ color: themeColors.white, textAlign: 'center' }}>{modalTitle}</CustomText>
            <View style={styles.separator} />

            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 10 }}>
              <View style={styles.innerContainer}>
                <Image source={{ uri: requesterInfo.icon }} style={styles.image} />
                <CustomText titiliumSemiBold h6 style={{ marginVertical: 5, marginBottom: 20 }}>{requesterInfo.name}</CustomText>

                {requestInfo.type === 'transaction' && (
                  <>
                    <View style={styles.dataBox}>
                      {renderDataField({ key: 'From', value: requestInfo.from })}
                      {renderDataField({ key: 'To', value: requestInfo.to })}
                      {renderDataField({ key: 'Estimated Gas', value: requestInfo.gas })}
                      {renderDataField({ key: 'Value', value: requestInfo.value })}
                    </View>
                    <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10 }}>Request Information</CustomText>
                    <View style={[styles.dataBox, { marginBottom: 20 }]}>
                      {renderDataField({ key: 'Chain', value: requestInfo.chain?.name || requestInfo.chainId || '' })}
                      {renderDataField({ key: 'Method', value: requestInfo.method || '' })}
                    </View>
                  </>
                )}

                {requestInfo.type === 'sign_message' && (
                  <>
                    <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10 }}>Signing Address</CustomText>
                    <View style={styles.dataBox}>
                      {renderDataField({ key: 'Address', value: requestInfo.address })}
                    </View>
                    <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10 }}>Message</CustomText>
                    <View style={[styles.dataBox]}>
                      <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10 }}>{requestInfo.message}</CustomText>
                    </View>
                    <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10 }}>Request Information</CustomText>
                    <View style={[styles.dataBox, { marginBottom: 20 }]}>
                      {renderDataField({ key: 'Chain', value: requestInfo.chain?.name || requestInfo.chainId || '' })}
                      {renderDataField({ key: 'Method', value: requestInfo.method || '' })}
                    </View>
                  </>
                )}

                {requestInfo.type === 'unknown' && (
                  <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10 }}>
                    Unsupported request method: {requestInfo.method}
                  </CustomText>
                )}

              </View>
            </ScrollView>

            <View style={[styles.row, { marginBottom: 20 }]}>
              <Button
                loading={rejecting}
                disabled={approving}
                onPress={reject}
                label={'Reject'}
                buttonContainerStyle={styles.rejectButton} />
              <Button
                loading={approving}
                disabled={rejecting}
                onPress={approve}
                label={'Approve'}
                buttonContainerStyle={styles.approveButton} />
            </View>
          </>
        ) : (
          <CustomText style={{ color: themeColors.white, textAlign: 'center' }}>Loading...</CustomText>
        )}
      </View>
    </Modal>
  );
};

export const sendModalHandler = {
  show: ({ data }) => {
    if (global.sendModal) {
      global.sendModal({ show: true, data });
    } else {
      console.error('SendModal handler not initialized yet!');
    }
  },
  hide: () => {
    if (global.sendModal) {
      global.sendModal({ show: false });
    } else {
      console.error('SendModal handler not initialized yet!');
    }
  },
};

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: themeColors.black300,
    borderBottomWidth: 0,
    backgroundColor: themeColors.black600,
    margin: 0,
    padding: 20,
    borderRadius: 20,
    maxHeight: '80%',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: themeColors.black300,
    marginVertical: 10,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    height: 70,
    width: 70,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: themeColors.dangerFlashBackground,
  },
  approveButton: {
    flex: 1,
    backgroundColor: themeColors.success300,
  },
  dataBox: {
    borderWidth: 1,
    borderColor: themeColors.black300,
    padding: 10,
    width: '100%',
    borderRadius: 10,
  },
});

export default SendModal;
