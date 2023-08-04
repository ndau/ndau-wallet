import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { images } from "../assets/images";
import { ScreenNames } from "./ScreenNames";

const CreateWalletStarted = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer steps={{ total: 4, current: 3 }}>
      <Spacer height={16} />
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>Before we start!</CustomText>
        <CustomText titilium body2 style={styles.margin}>
          Your Recovery Phrase consists of 12 random words that act as a key to your wallet and its contents. Keep them safe and in the correct order to ensure access to your crypto funds.
        </CustomText>
        <Spacer height={16} />
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" source={images.walletPhrase1} />
        </View>
      </View>
      <CustomText semiBold style={{ textAlign: "center" }}>
        Important! -
        <CustomText titilium caption>
          {` Never share your Recovery Phrase with anyone`}
        </CustomText>
      </CustomText>
      <Spacer height={16} />
      <Button
        label={"Continue"}
        onPress={() => navigation.navigate(ScreenNames.SeedPhrase)}
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
    paddingHorizontal: 20
  },
  image: {
		height: "80%",
		width: "80%"
	},
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    width: "100%",
    borderRadius: 20,
    borderColor: themeColors.fontLight,
    backgroundColor: themeColors.lightBackground,
    marginBottom: 20
  }
});

export default CreateWalletStarted;
