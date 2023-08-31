import React from "react";
import { StyleSheet, View } from "react-native";
import { Plus } from "../assets/svgs/components";
import { themeColors } from "../config/colors";
import Button from "./Button";
import CustomText from "./CustomText";

const IconButton = ({ label = "", onPress, icon, disabled = false }) => {
	return (
		<View style={styles.buttonContainer}>
			<Button
				disabled={disabled}
				rightIcon={icon}
				onPress={onPress}
				buttonContainerStyle={styles.button}
			/>
			<CustomText titilium style={styles.buttonLabel}>{label}</CustomText>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 30,
		backgroundColor: themeColors.primary
	},
	buttonContainer: {
		flex: 1,
		margin: 2,
		marginRight: 4
	},
	buttonLabel: {
		marginVertical: 4,
		textAlign: "center"
	}
})

export default IconButton;