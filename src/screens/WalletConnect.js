import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';

import CustomText from '../components/CustomText';
import Loading from '../components/Loading';
import ScreenContainer from '../components/Screen';
import Spacer from '../components/Spacer';
import { useWalletConnect } from '../hooks';
import Button from '../components/Button';
import { themeColors } from '../config/colors';
import { ndauUtils } from '../utils';
import { Delete, QRCode } from '../assets/svgs/components';
import FlashNotification from '../components/common/FlashNotification';
import { ScreenNames } from './ScreenNames';

const WalletConnect = (props) => {
  const {
    loading,
    paired,
    connectWithURI,
    reject,
    disconnect,
    updatePairedSessions,
    isInitialized,
  } = useWalletConnect();

  const stableUpdatePairedSessions = useCallback(() => {
    if (updatePairedSessions) {
      updatePairedSessions();
    }
  }, [isInitialized, updatePairedSessions]);

  useEffect(() => {
    global.refreshWCSessions = stableUpdatePairedSessions;
    stableUpdatePairedSessions();

    return () => {
      global.refreshWCSessions = undefined;
    };
  }, [stableUpdatePairedSessions]);

  const scanQR = (data) => {
    if (!data.startsWith('wc:')) {return FlashNotification.show('Invalid QR Code');}
    connectWithURI(data);
  };

  return (
    <ScreenContainer
      preventBackPress={() => { reject(); props.navigation.goBack(); }}>
      <>
        <CustomText h6 titiliumBold>Scan & Connect</CustomText>
        <Spacer height={8} />
        <View style={styles.row}>
          <CustomText titilium>Scan QR Code with a </CustomText>
          <CustomText titiliumBold>WalletConnect</CustomText>
          <CustomText titilium> wallet.</CustomText>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Button
            onPress={() => {
              props.navigation.navigate(ScreenNames.Scanner, {
                onScan: (data) => {
                  scanQR(data);
                },
              });
            }}
            label={'Scan  '}
            rightIcon={<QRCode />}
            buttonContainerStyle={{ flexDirection: 'row' }} />
          {/* For testing */}

          <Spacer height={10} />
          <Button
            onPress={() => {
              const testUri = 'wc:acb458498d21106531e2889a77e785ff07cd462ad989664fb7d8debc1871c372@2?relay-protocol=irn&symKey=88060290c54ec0ede3157aac01a740c63bca897113088ef331dfe3eb76df3853&expiryTimestamp=1744729958';
              scanQR(testUri);
            }}
            label={'Test Connect'}
            buttonContainerStyle={{ backgroundColor: 'orange' }}
          />

        </View>
        <Spacer height={20} />
        <FlatList
          data={paired}
          keyExtractor={(item) => item.topic}
          ListHeaderComponent={(
            <View style={{ marginVertical: 10 }}>
              <CustomText titiliumSemiBold h6>Connected DApps</CustomText>
            </View>
          )}
          ListEmptyComponent={(
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <CustomText titiliumSemiBold body2>No connection yet</CustomText>
            </View>
          )}
          renderItem={({ item }) => {
            const address = item.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] || '---';
            const peerMetadata = item.peer?.metadata || {};
            return (
              <View style={styles.pairedItem}>
                <Image source={{ uri: peerMetadata?.icons?.[0] }} style={styles.peerIcon} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <CustomText titiliumSemiBold numberOfLines={1}>{peerMetadata?.name}</CustomText>
                  <CustomText titilium caption color={themeColors.black300}>Expiry: {moment(item.expiry * 1000).format('MMM DD, yyyy hh:mm')}</CustomText>
                  <CustomText titiliumSemiBold color={themeColors.white} style={{ marginTop: 4 }} >{ndauUtils.truncateAddress(address)}</CustomText>
                </View>
                <TouchableOpacity onPress={() => disconnect(item.topic)} style={{ padding: 10 }}>
                  <Delete color={themeColors.dangerFlashBackground} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </>
      {!!loading && <Loading label={loading} />}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proposalContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  buttonsContainer: {

  },
  accountsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: themeColors.dangerFlashBackground,
  },
  account: {
    padding: 10,
    borderWidth: 1,
    borderColor: themeColors.warning400,
    borderRadius: 10,
  },
  pairedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.black300,
    backgroundColor: themeColors.black500,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  peerIcon: {
    height: 50,
    width: 50,
  },
});

export default WalletConnect;
