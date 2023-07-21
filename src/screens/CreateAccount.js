import React from "react";
import { StyleSheet, View } from "react-native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";

const CreateAccount = () => {
	return (
		<ScreenContainer steps={{ total: 4, current: 1 }}>
			<View style={styles.container}>
				<CustomText h6 semiBold>nDau Wallet</CustomText>
				<CustomText body>So lets begin</CustomText>
			</View>
			<Button disabled={true} label={'Create Account'} />
			<Button label={'Privacy Policy and Terms of Service apply'} textOnly caption />
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

export default CreateAccount;