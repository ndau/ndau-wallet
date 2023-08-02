import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const Token = ({ name, network, nDauAmount, usdAmount, image, index }) => {
	return (
		<Animated.View entering={FadeInDown.delay(100 * index)} style={styles.container}>
			<Image source={image} style={styles.image} />
			<View style={[styles.row, { justifyContent: "space-between", padding: 14 }]}>
				<View style={{ justifyContent: "space-around", flex: 1 }}>
					<CustomText titiliumSemiBold body>{name}</CustomText>
					<CustomText>{network}</CustomText>
				</View>
				<View style={{ justifyContent: "space-around", flex: 1, alignItems: "flex-end" }}>
					<CustomText titiliumSemiBold body>{nDauAmount}</CustomText>
					<CustomText titiliumSemiBold>{usdAmount}</CustomText>
				</View>
			</View>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderRadius: 24,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.white,
		marginBottom: 16
	},
	image: {
		width: 80,
		height: 80
	},
	row: {
		flex: 1,
		flexDirection: "row"
	}
})

export default Token;