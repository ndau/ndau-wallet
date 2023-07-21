import React, { useCallback } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { themeColors } from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import Button from "./Button";

const ScreenContainer = ({ children, style, steps }) => {

	const navigation = useNavigation();

	const Header = useCallback(() => {
		if (!navigation.canGoBack()) return null;
		return (
			<View style={sytles.headerContainer}>
				{navigation.canGoBack() && (<Button textOnly label={'Back'} />)}
				
			</View>
		)
	}, [])

	return (
		<SafeAreaView style={sytles.container}>
			<StatusBar barStyle={'light-content'} />
			<Header />
			<View style={[{ flex: 1 }, style]}>
				{children}
			</View>
		</SafeAreaView>
	)
}

const sytles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: themeColors.background
	},
	headerContainer: {
		borderWidth: 1,
		borderColor: 'white',
		flexDirection: 'row',
		alignItems: "center"
	}
})

export default ScreenContainer;