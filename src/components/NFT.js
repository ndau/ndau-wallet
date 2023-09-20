import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import CustomText from "./CustomText";

const NFT = ({ name, image, index, isLast, onPress }) => {

	return (
		<Animated.View entering={FadeInDown.delay(100 * index)} style={[styles.container, isLast && { maxWidth: "48%" }]}>
			<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
				<>
					<Image resizeMode="stretch" source={{ uri: image }} style={styles.image} />
					<CustomText titiliumSemiBold h6 style={styles.name}>{name}</CustomText>
				</>
			</TouchableOpacity>
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
		height: 180,
		borderRadius: 20
	},
	name: {
		marginLeft: 10,
		marginTop: 4
	},
	row: {
		flex: 1,
		flexDirection: "row"
	}
})

export default NFT;