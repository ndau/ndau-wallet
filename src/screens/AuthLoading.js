import React from "react";
import { StyleSheet, View } from "react-native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";

const AuthLoading = () => {
	return (
		<ScreenContainer>
			<View style={styles.container}>
				<CustomText h6 semiBold>nDau Wallet</CustomText>
				<CustomText body>So lets begin</CustomText>
			</View>
			<Button label={'Create Account'} />
			<Button label={'Sign in'} textOnly />
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
})

export default AuthLoading;