import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const NFT = ({ name, image, index, isLast }) => {

	return (
		<Animated.View entering={FadeInDown.delay(100 * index)} style={[styles.container, isLast && { maxWidth: "48%" }]}>
			<Image resizeMode="stretch" source={{ uri: image }} style={styles.image} />
			<CustomText semiBold body style={styles.name}>{name}</CustomText>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 6
	},
	image: {
		width: "100%",
		height: 180
	},
	name: {
		marginLeft: 10,
		marginTop: 10
	},
	row: {
		flex: 1,
		flexDirection: "row"
	}
})

export default NFT;