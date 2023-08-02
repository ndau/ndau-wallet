import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const Button = ({ label, onPress, disabled, textOnly = false, caption = false, buttonContainerStyle = {}, rightIcon, buttonTextColor = undefined, titilium = false, body2 = false }) => {
	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={onPress}
			style={[
				styles.container,
				textOnly && { backgroundColor: undefined },
				buttonContainerStyle,
				disabled && { backgroundColor: themeColors.buttonDisabled },
			]}
			activeOpacity={0.8}>
			<>
				<CustomText
					button
					semiBold
					caption={caption}
					body2={body2}
					titiliumSemiBold
					titilium={titilium}
					color={disabled ? themeColors.buttonDisabledText : buttonTextColor}>{label}</CustomText>
				{rightIcon}
			</>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
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