import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const Button = ({ label, onPress, disabled, textOnly = false }) => {
	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={onPress}
			style={[
				sytles.container,
				textOnly && { backgroundColor: undefined },
				disabled && { backgroundColor: themeColors.buttonDisabled }
			]}
			activeOpacity={0.8}>
			<>
				<CustomText
					button
					semiBold
					color={disabled && themeColors.buttonDisabledText}>{label}</CustomText>
			</>
		</TouchableOpacity>
	)
}

const sytles = StyleSheet.create({
	container: {
		height: 54,
		backgroundColor: themeColors.buttonPrimary,
		padding: 10,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center"
	}
})

export default Button;