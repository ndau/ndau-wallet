import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const SeedPhraseCapsule = ({ label, style, selected, onPress, index, textOnly = false, caption = false, buttonContainerStyle = {}, rightIcon, buttonTextColor = undefined, titilium = false }) => {
	const [fullSelection, setFullSelection] = useState(false);
	return (
		<Animated.View
			style={[
				styles.container,
				style,
				selected && fullSelection && styles.selected
			]}
			entering={FadeInDown.delay(200 + (index * 100 + 1))}
			exiting={FadeOutDown.delay(200 + (index * 100 + 1))}>
			<TouchableOpacity activeOpacity={0.8} style={{ width: "100%" }} onPress={() => setFullSelection(!fullSelection)}>
				<View style={styles.inner}>
					{selected && (
						<View style={styles.selectedIndex}>
							<CustomText titilium color={themeColors.black}>{index + 1}</CustomText>
						</View>
					)}
					<CustomText titilium h6>{label}</CustomText>
				</View>
			</TouchableOpacity>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 80,
		minWidth: 100,
		borderWidth: 2,
		borderColor: themeColors.primary,
		borderRadius: 100,
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
		marginBottom: 16
	},
	selected: {
		backgroundColor: themeColors.primary
	},
	selectedIndex: {
		position: "absolute",
		top: -6,
		right: -26,
		height: 30,
		width: 30,
		borderRadius: 15,
		backgroundColor: themeColors.white,
		justifyContent: "center",
		alignItems: "center"
	},
	inner: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	}
})

export default SeedPhraseCapsule;