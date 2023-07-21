import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { themeColors } from "../config/colors";
import { typography } from "../config/typography";

const CustomText = ({
	children,
	h1, h2, h3, h4, h5, h6,
	subtitle,
	body, body2,
	button,
	caption,
	size = 14,

	regular = true,
	light, medium, semiBold, bold,

	color = themeColors.font
}) => {

	const getStyles = () => ({
		fontSize: size,
		...(h1 && { fontSize: typography.h1 }),
		...(h2 && { fontSize: typography.h2 }),
		...(h3 && { fontSize: typography.h3 }),
		...(h4 && { fontSize: typography.h4 }),
		...(h5 && { fontSize: typography.h5 }),
		...(h6 && { fontSize: typography.h6 }),

		...(subtitle && { fontSize: typography.subtitle }),
		...(body && { fontSize: typography.bÏody }),
		...(body2 && { fontSize: typography.body2 }),
		...(button && { fontSize: typography.button }),
		...(caption && { fontSize: typography.caption }),

		...(regular && { fontFamily: "ClashDisplay-Regular" }),
		...(light && { fontFamily: "ClashDisplay-Light" }),
		...(medium && { fontFamily: "ClashDisplay-Medium" }),
		...(semiBold && { fontFamily: "ClashDisplay-Semibold" }),
		...(bold && { fontFamily: "ClashDisplay-Bold" }),
		...(color && { color }),
	})

	return <Text style={[sytles.text, getStyles()]}>{children}</Text>
}

const sytles = StyleSheet.create({
	text: {
		color: themeColors.font
	}
})

export default CustomText;