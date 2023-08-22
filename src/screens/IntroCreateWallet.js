import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Image, NativeModules, StyleSheet, View } from "react-native";
import { connect } from "react-redux";

import { images } from "../assets/images";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import LottieView from "lottie-react-native";
import { ScreenNames } from "./ScreenNames";

const IntroCreateWallet = ({ }) => {
  const navigation = useNavigation();

  const animationRef = useRef(null);

  useEffect(() => {
    //   animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(1, 1000);
    // NativeModules.KeyaddrManager.keyaddrWordsFromPrefix("en", "bo", 4)
    //   .then(res => {
    //     console.log('check', JSON.stringify(res, null, 2));
    //   })
    //   .catch(err => {
    //     console.log('check err', JSON.stringify(err.message, null, 2));
    //   })
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <LottieView
          source={require("../assets/welcome.json")}
          ref={animationRef}
          resizeMode="cover"
          style={{ width: "100%", flex: 1 }}
        />

        {/* <View style={styles.imageContainer}>
					<Image source={images.createWallet} />
				</View> */}
      </View>
      <View style={styles.textContainer}>
        <CustomText h6 semiBold style={styles.text1}>
          Buy, Sell & Swap NFT
        </CustomText>
        <CustomText body2>
          Easily and securely manage your crypto with just a few taps from your
          wallet. Exchange, swap, and transfer your assets instantly and
          effortlessly. Enjoy seamless control over your crypto funds.
        </CustomText>
      </View>
      <Button
        label={"Create Wallet"}
        onPress={() => {
          navigation.navigate(ScreenNames.ImportWallet, { forCreation: true })
          // navigation.navigate(ScreenNames.CreateWallet, {  })
        }}
      />
      <Button
        label={"I already have a wallet"}
        textOnly
        onPress={() => navigation.navigate(ScreenNames.CreateWallet, { isAlreadyWallet: true })}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  textContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  text1: {
    width: 200,
    marginBottom: 10,
  },
  image: {
    height: "80%",
    width: "80%",
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
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(IntroCreateWallet);
