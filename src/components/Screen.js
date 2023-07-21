import React, { useCallback } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { themeColors } from "../config/colors";

const ScreenContainer = ({ children, style }) => {

	const Header = useCallback(() => {
		return (
			<View style={sytles.headerContainer}>

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