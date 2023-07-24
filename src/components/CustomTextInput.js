import React, { useCallback } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const CustomTextInput = ({
	label,
	placeholder,
	onChangeText,
	maxLength = 50, //by default 50 characters
	password = false,
	errors = [],
	success = []
}) => {

	const RenderMsg = useCallback(({ msg, isError }) => {
		return (
			<Animated.View style={styles.msgBox} entering={FadeInDown} exiting={FadeOutDown}>
				<View style={[styles.icon, { backgroundColor: isError ? themeColors.error : themeColors.success }]} />
				<CustomText>{msg}</CustomText>
			</Animated.View>
		)
	}, [errors, success])

	return (
		<View style={styles.main}>
			<CustomText body titilium>{label}</CustomText>
			<TextInput
				maxLength={maxLength}
				placeholder={placeholder}
				placeholderTextColor={themeColors.fontLight}
				style={styles.container}
				onChangeText={onChangeText}
				secureTextEntry={password}
			/>
			{errors.map(msg => <RenderMsg key={msg} msg={msg} isError />)}
			{success.map(msg => <RenderMsg key={msg} msg={msg} />)}
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		marginVertical: 10
	},
	container: {
		height: 54,
		padding: 10,
		paddingHorizontal: 14,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: themeColors.white,
		color: themeColors.white,
		marginTop: 10,
		fontFamily: 'TitiliumWeb-Regular'
	},
	msgBox: {
		marginTop: 10,
		marginLeft: 4,
		flexDirection: "row",
		alignItems: "center"
	},
	icon: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 5
	}
})

export default CustomTextInput;