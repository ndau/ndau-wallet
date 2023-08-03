import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import { useWallet } from "../redux/hooks";
import { ScreenNames } from "./ScreenNames";

const AuthLoading = ({ }) => {

	const { isWalletSetup } = useWallet();

	const navigation = useNavigation();

	useEffect(() => {
		if (!isWalletSetup) {
			setTimeout(() => {
				navigation.dispatch(
					CommonActions.reset({ index: 0, routes: [{ name: ScreenNames.IntroCreateWallet }] })
				);
			}, 1000);
		}
	}, [])

	return (
		<ScreenContainer>
			<Loading label={''} />
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