import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";
import { themeColors } from "../config/colors";
import { images } from "../assets/images";

const IntroCreateAccount = () => {
	const navigation = useNavigation();

	return (
		<ScreenContainer>
			<View style={styles.container}>
				<View style={styles.imageContainer}>
					<Image source={images.buySellLanding} />
				</View>
			</View>
			<View style={styles.textContainer}>
				<CustomText h6 semiBold style={styles.text1}>Buy, Sell & Swap NFT</CustomText>
				<CustomText body>Easily and securely manage your crypto with just a few taps from your wallet. Exchange, swap, and transfer your assets instantly and effortlessly. Enjoy seamless control over your crypto funds.</CustomText>
			</View>
			<Button label={'Create Account'} onPress={() => navigation.navigate(ScreenNames.CreateAccount)} />
			<Button label={'Sign in'} textOnly />
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

export default IntroCreateAccount;