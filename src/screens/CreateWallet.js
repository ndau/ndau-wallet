import React, { useState } from "react";
import { StyleSheet, View, NativeModules } from "react-native";

import Button from "../components/Button";
import CheckBox from "../components/CheckBox";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { ArrowForward } from "../assets/svgs/components";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "./ScreenNames";

const CreateWallet = (props) => {
  const navigation = useNavigation();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { isAlreadyWallet, forCreation, item } = props?.route?.params ?? {};

  return (
    <ScreenContainer
      steps={{ total: !isAlreadyWallet && 4, current: !isAlreadyWallet && 2 }}
    >
      <Spacer height={16} />
      <View style={styles.container}>
        <CustomText titiliumSemiBold style={styles.margin}>
          Please review the nDau Wallet Terms of Service & Privacy Policy
        </CustomText>
        <Spacer height={16} />
        <Button
          titilium
          buttonContainerStyle={styles.buttonTerms}
          label={"Terms Of Use"}
          buttonTextColor={themeColors.black}
          onPress={() => navigation.navigate(ScreenNames.TermsPolicy)}
          rightIcon={<ArrowForward />}
        />
      </View>
      <CheckBox
        checked={termsAccepted}
        label={"I’ve read and accept the Terms of Service & Privacy Policy"}
        onPress={() => setTermsAccepted(!termsAccepted)}
      />
      <Spacer height={16} />
      <Button
        disabled={!termsAccepted}
        label={"Continue"}
        onPress={() => {
          if (isAlreadyWallet) {
            navigation.navigate(ScreenNames.ImportWallet);
          } else {
            navigation.navigate(ScreenNames.CreateWalletStarted, { forCreation, item });
          }
        }}
      />
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
    paddingHorizontal: 20,
  },
});

export default CreateWallet;
