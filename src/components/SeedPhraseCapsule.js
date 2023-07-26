import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const SeedPhraseCapsule = ({ disabled, style, selected, item, index, onSelect }) => {
	const [fullSelection, setFullSelection] = useState(selected);

	const indexInWord = useMemo(() => item.index === 0 ? `${item.index + 1}st` : item.index === 1 ? `${item.index + 1}nd` : `${item.index + 1}th`, [])

	const handleSelection = () => {
		if (fullSelection?.[item.index]) {
			setFullSelection(_ => ({
				..._,
				[item.index]: {
					selected: true,
					showIndex: true,
					index: item.index
				}
			}))
			onSelect?.(fullSelection?.[item.index])
		}
	}

	return (
		<Animated.View
			style={[
				styles.container,
				style,
				fullSelection[item.index]?.selected && styles.selected
			]}
			entering={FadeInDown.delay(200 + (index * 10 + 1))}
			exiting={FadeOutDown.delay(200 + (index * 10 + 1))}>
			<TouchableOpacity disabled={disabled} activeOpacity={0.8} style={{ width: "100%" }} onPress={handleSelection}>
				<View style={styles.inner}>
					{fullSelection[item.index]?.showIndex && (
						<View style={styles.selectedIndex}>
							<CustomText titilium color={themeColors.black}>{indexInWord}</CustomText>
						</View>
					)}
					<CustomText titilium h6>{item.seed}</CustomText>
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