import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { themeColors } from '../../config/colors';
import CustomText from '../CustomText';
import Button from '../Button';
import { ndauUtils } from '../../utils';

const ApprovalModal = ({ accountData, onApprove, onReject }) => {

  const [isVisible, setIsVisible] = useState(false);
  const [proposalData, setProposalData] = useState({});
  const [loading, setLoading] = useState({
    isAcceptLoading: false,
    isRejectLoading: false,
  });

  useEffect(() => {
    global.ApprovalModal = Object.assign(innerFunc, {
      getData: () => proposalData,
    });
    return () => { global.ApprovalModal = undefined; };
  }, [proposalData]);

  const innerFunc = ({ show, data, loading }) => {
    if (data) {setProposalData(data);}
    if (typeof show === 'boolean') {setIsVisible(show);}
    if (typeof loading === 'string') {
      setLoading({
        isAcceptLoading: loading === 'accept',
        isRejectLoading: loading === 'reject',
      });
    }
    if (show === false) {
      setProposalData({});
      setLoading({ isAcceptLoading: false, isRejectLoading: false });
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

  const requester = useMemo(() => {
    const info = { icons: [], name: '', description: '', url: '' };
    const metadata = proposalData?.params?.proposer?.metadata;
    if (metadata) {
      info.icons = metadata.icons || [];
      info.name = metadata.name || '';
      info.description = metadata.description || '';
    }
    return info;
  }, [proposalData]);

  const accountInfo = useMemo(() => {
    return {
      address: accountData?.accountAddress,
      totalFunds: parseFloat(accountData?.totalFunds || 0).toFixed(8),
      usdAmount: accountData?.usdAmount || '0.00',
    };
  }, [accountData]);

  return (
    <Modal
      onBackdropPress={() => setIsVisible(false)}
      animationIn={'slideInUp'}
      style={styles.bottomModal}
      isVisible={isVisible}>
      <View style={styles.container}>
        <CustomText titiliumBold body>Approval</CustomText>
        <View style={styles.separator} />
          <View style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={styles.image} source={{ uri: requester.icons?.[0] || requester.icons?.[1] }} />
            <CustomText titiliumBold h6 style={{ marginVertical: 20 }}>{requester.name}</CustomText>
            <CustomText titiliumBold caption>{requester.description}</CustomText>
          </View>

          <View style={styles.innerContainer}>
            <CustomText titiliumSemiBold body style={{ alignSelf: 'flex-start', marginVertical: 10, color: themeColors.white }}>Request to Access Account</CustomText>
            <View style={[styles.dataBox, { marginBottom: 20 }]}>
              {renderDataField({ key: 'Account', value: ndauUtils.truncateAddress(accountInfo.address) })}
              {renderDataField({ key: 'Total Eth', value: parseFloat(accountInfo.totalFunds || 0).toFixed(8) })}
              {renderDataField({ key: 'USD', value: `$${accountInfo.usdAmount}` })}
            </View>
          </View>
        <View style={[styles.row, { marginBottom: 20 }]}>
          <Button
            loading={loading?.isRejectLoading}
            disabled={loading?.isAcceptLoading}
            onPress={onReject}
            label={'Reject'}
            buttonContainerStyle={styles.rejectButton} />
          <Button
            loading={loading?.isAcceptLoading}
            disabled={loading?.isRejectLoading}
            onPress={onApprove}
            label={'Approve'}
            buttonContainerStyle={styles.approveButton} />
        </View>
      </View>
    </Modal>
  );
};

export const ApprovalModalHandler = {
  show: ({ data }) => {
    if (global.ApprovalModal) {global.ApprovalModal({ show: true, data });}
  },
  hide: () => {
    if (global.ApprovalModal) {global.ApprovalModal({ show: false, data: {} });}
  },
  acceptLoading: (isLoading) => {
    if (global.ApprovalModal) {global.ApprovalModal({ loading: isLoading ? 'accept' : '' });}
  },
  rejectLoading: (isLoading) => {
    if (global.ApprovalModal) {global.ApprovalModal({ loading: isLoading ? 'reject' : '' });}
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

export default ApprovalModal;
