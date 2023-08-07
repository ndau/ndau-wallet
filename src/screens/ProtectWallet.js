import React, { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { BiometryTypes, ReactNativeBiometricsLegacy } from 'react-native-biometrics'
import { CommonActions, useNavigation } from "@react-navigation/native";

import { FaceId, Thumprint } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import PinHandler from "../components/PinHandler";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { ScreenNames } from "./ScreenNames";
import SetupStore from "../stores/SetupStore";
import UserStore from "../stores/UserStore";
import AccountHelper from "../helpers/AccountHelper";
import UserData from "../model/UserData";
import DataFormatHelper from "../helpers/DataFormatHelper";

const ProtectWallet = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState({ pin: "", confirmPin: "" });
  const [biometrics, setBiometrics] = useState({
  });
  const [validate, setValidate] = useState({
    errors: [],
    success: []
  });

  useEffect(() => {
    if (pins.pin !== "" && pins.confirmPin !== "" && pins.pin === pins.confirmPin) {
      SetupStore.encryptionPassword = pins.pin;
      SetupStore.walletId = "Main Wallet";
      UserStore.setPassword(pins.pin);
      setValidate(_ => ({
        ..._,
        errors: [],
        success: ['Looks Good!'],
      }))
      checkSensorsAvailability();
    } else if (pins.pin.length && pins.confirmPin.length && pins.pin !== pins.confirmPin) {
      setValidate(_ => ({
        ..._,
        errors: ['Passcode does not match'],
        success: [],
      }))
    }
  }, [pins.pin, pins.confirmPin])

  const addNewUser = async () => {
    let user = UserStore.getUser();
    user = await AccountHelper.setupNewUser(
      user,
      DataFormatHelper.convertRecoveryArrayToString(
        SetupStore.recoveryPhrase,
      ),
      SetupStore.walletId ? SetupStore.walletId : SetupStore.userId,
      SetupStore.numberOfAccounts,
      SetupStore.entropy,
      SetupStore.encryptionPassword,
      SetupStore.addressType,
    );
    await UserData.loadUserData(user);
    UserStore.setPassword(SetupStore.encryptionPassword);
    Alert.alert(
      'Additional Security',
      'Enable Touch ID / Face ID for more secure the account',
      [
        { text: "Open Settings", onPress: () => Linking.openSettings() },
        { text: "Later", onPress: navigateToDashboard },
      ]
    )
  }

  useEffect(() => {
    if (biometrics.isFaceId == false || biometrics.isTouchId === false) {
      addNewUser();
    }
  }, [biometrics])

  const checkSensorsAvailability = () => {
    ReactNativeBiometricsLegacy.isSensorAvailable().then(res => {
      const data = {
        isFaceId: res.available && res.biometryType === BiometryTypes.FaceID,
        isTouchId: res.available && res.biometryType === BiometryTypes.TouchID
      }
      setBiometrics(data);
    })
  }

  const navigateToDashboard = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreenNames.TabNav }],
      })
    );
  }

  const verifyFaceId = () => {
    ReactNativeBiometricsLegacy.simplePrompt({ promptMessage: 'FaceId' }).then(({ success }) => {
      if (success) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false)
          navigateToDashboard();
        }, 2000);
      }
    })
  }

  return (
    <ScreenContainer steps={{ total: 4, current: 4 }}>
      {!!loading && <Loading label={'Creating your wallet'} />}
      <Spacer height={16} />
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>Protect your wallet</CustomText>
        <CustomText titilium body2 style={styles.margin}>Create a secure 6-digit passcode to unlock your wallet and ensure the safety of your funds. Please note that this passcode cannot be used to recover your wallet.</CustomText>
        <Spacer height={20} />
        <PinHandler label={'Enter Passcode'} onPin={(pin) => setPins(_ => ({ ..._, pin }))} />
        <PinHandler errors={validate.errors} success={validate.success} label={'Confirm Passcode'} onPin={(pin) => setPins(_ => ({ ..._, confirmPin: pin }))} />
      </View>
      <Spacer height={20} />
      <View style={styles.row}>
        {
          biometrics.isTouchId && (
            <View style={{ flex: 1, marginRight: 10 }}>
              <Button
                buttonContainerStyle={styles.button}
                label={'Unlock with Touch ID  '}
                rightIcon={<Thumprint />}
                onPress={verifyFaceId}
              />
            </View>
          )
        }
        {
          biometrics.isFaceId && (
            <View style={{ flex: 1 }}>
              <Button
                buttonContainerStyle={styles.button}
                label={'Unlock with Face ID  '}
                rightIcon={<FaceId />}
                onPress={verifyFaceId}
              />
            </View>
          )
        }
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {
    marginBottom: 10,
  },
  buttonTerms: {
    backgroundColor: themeColors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20
  },
  seedContainer: {
    flex: 1,
    borderRadius: 20,
    borderColor: themeColors.fontLight,
    marginBottom: 20,
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonCopy: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: themeColors.white
  },
  buttonCopied: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: themeColors.primary
  },
  flex: {
    flex: 1
  },
  modal: {
    alignItems: "center",
    marginVertical: 20
  },
  button: {
    flexDirection: "row"
  }
});

export default ProtectWallet;
