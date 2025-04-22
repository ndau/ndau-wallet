import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import Loading from '../components/Loading';
import ScreenContainer from '../components/Screen';
import AsyncStorageHelper from '../model/AsyncStorageHelper';
import MultiSafe from '../model/MultiSafe';
import DeviceStore from '../stores/DeviceStore';
import SettingsStore from '../stores/SettingsStore';
import { ScreenNames } from './ScreenNames';

const AuthLoading = ({}) => {
  const navigation = useNavigation();

  const authenticating = async () => {
    const userIds = await AsyncStorageHelper.getAllKeys();
    const multiSafes = await MultiSafe.isAMultiSafePresent();

    // Always go to IntroCreateWallet if MultiSafe is missing
    if (!multiSafes) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.IntroCreateWallet }],
        })
      );
    } else if (multiSafes) {
      // Wallet is already setup; Let's authenticate user
      // return setTimeout(() => {
      // 	navigation.dispatch(
      // 		CommonActions.reset({ index: 0, routes: [{ name: ScreenNames.IntroCreateWallet }] })
      // 	);
      // }, 1000);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ScreenNames.Login }] }));
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.IntroCreateWallet }],
        })
      );
    }
  };

  useEffect(() => {
    DeviceStore.setOnline(true);
    SettingsStore.getApplicationNetwork()
      .then(() => {
        authenticating();
      })
      .catch((err) => {
        authenticating();
      });
  }, []);

  return <ScreenContainer>{/* <Loading label={''} /> */}</ScreenContainer>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoading;
