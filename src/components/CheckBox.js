import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import { Tick } from "../assets/svgs/components";

const CheckBox = ({ label, onPress, disabled, checked = false }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={[styles.check]}
				disabled={disabled}
				onPress={onPress}
				activeOpacity={0.8}>
				{checked && <Tick />}
			</TouchableOpacity>
			<CustomText titilium>{label}</CustomText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: 10,
		borderRadius: 100,
		justifyContent: "center"
	},
	check: {
		marginRight: 10,
		height: 20,
		width: 20,
		borderRadius: 4,
		borderWidth: 1,
		backgroundColor: themeColors.white
	},
	checked: {
		// backgroundColor: themeColors.primary
	}
})

export default CheckBox;