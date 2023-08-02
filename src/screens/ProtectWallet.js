import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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

const ProtectWallet = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [biometrics, setBiometrics] = useState({
    isFaceId: false,
    isTouchId: false
  });

  useEffect(() => {
    
    ReactNativeBiometricsLegacy.isSensorAvailable().then(res => {
      const data = {
        isFaceId: res.available && res.biometryType === BiometryTypes.FaceID,
        isTouchId: res.available && res.biometryType === BiometryTypes.TouchID
      }
      setBiometrics(data);
      if (data.isFaceId) {
        ReactNativeBiometricsLegacy.simplePrompt({ promptMessage: 'FaceId' }).then(({ success }) => {
          if (success) {
            setLoading(true);
            setTimeout(() => {
              setLoading(false)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: ScreenNames.TabNav }],
                })
              );
            }, 2000);
          }
        })
      }
    })
  }, [])

  return (
    <ScreenContainer steps={{ total: 4, current: 4 }}>
      {!!loading && <Loading label={'Creating your wallet'} />}
      <Spacer height={16} />
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>Protect your wallet</CustomText>
        <CustomText titilium body2 style={styles.margin}>Create a secure 6-digit passcode to unlock your wallet and ensure the safety of your funds. Please note that this passcode cannot be used to recover your wallet.</CustomText>
        <Spacer height={50} />
        <PinHandler onPin={(pin) => null} />
      </View>
      <Spacer height={20} />
      <View style={styles.row}>
        {
          !!biometrics.isFaceId && (
            <View style={{ flex: 1, marginRight: 10 }}>
              <Button
                buttonContainerStyle={styles.button}
                label={'Touch ID  '}
                rightIcon={<Thumprint />}
              />
            </View>
          )
        }
        {
          !!biometrics.isTouchId && (
            <View style={{ flex: 1 }}>
              <Button
                buttonContainerStyle={styles.button}
                label={'Face ID  '}
                rightIcon={<FaceId />}
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