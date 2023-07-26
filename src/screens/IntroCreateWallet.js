import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";
import { images } from "../assets/images";
import { themeColors } from "../config/colors";

const IntroCreateWallet = () => {
	const navigation = useNavigation();

	return (
		<ScreenContainer>
			<View style={styles.container}>
				<View style={styles.imageContainer}>
					<Image source={images.createWallet} />
				</View>
			</View>
			<View style={styles.textContainer}>
				<CustomText h6 semiBold style={styles.text1}>Buy, Sell & Swap NFT</CustomText>
				<CustomText body2>Easily and securely manage your crypto with just a few taps from your wallet. Exchange, swap, and transfer your assets instantly and effortlessly. Enjoy seamless control over your crypto funds.</CustomText>
			</View>
			<Button label={'Create Wallet'} onPress={() => navigation.navigate(ScreenNames.CreateWallet)} />
			<Button label={'I already have a wallet'} textOnly />
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	textContainer: {
		paddingVertical: 10,
		marginBottom: 20
	},
	text1: {
		width: 200,
		marginBottom: 10
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
})

export default IntroCreateWallet;