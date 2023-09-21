import React from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { themeColors } from "../config/colors";
import CustomText from "./CustomText";

const Token = ({ name, network, totalFunds, usdAmount, image, index, accounts, onPress }) => {
	return (
		<TouchableOpacity disabled={totalFunds === "l"} activeOpacity={0.8} onPress={onPress}>
			<Animated.View entering={FadeInDown.delay(100 * index)} style={styles.container}>
				<View style={styles.image}>
					<Image source={image} style={[styles.image, { position: "absolute", height: 84, width: 84, top: -2, left: -2 }]} />
				</View>
				<View style={[styles.row, { justifyContent: "space-between", padding: 14 }]}>
					<View style={{ justifyContent: "space-around", flex: 1 }}>
						<View style={[{ flexDirection: "row", alignItems: "center" }]}>
							<CustomText titiliumSemiBold body>{name}</CustomText>
							{
								!!accounts && (
									<View style={styles.capsule}>
										<CustomText titiliumSemiBold caption color={themeColors.black}>{`${accounts} accounts`}</CustomText>
									</View>
								)
							}
						</View>
						<CustomText>{network}</CustomText>
					</View>
					<View style={{ justifyContent: "space-around", flex: 1, alignItems: "flex-end" }}>
						{totalFunds === "l" ? <ActivityIndicator color={themeColors.black300}/> : <CustomText titiliumSemiBold body>{totalFunds == 0 ? 0 : parseFloat(totalFunds).toFixed(4)}</CustomText>}
						{usdAmount === "l" ? <ActivityIndicator color={themeColors.black300}/> : <CustomText titiliumSemiBold>${usdAmount == 0 ? 0 : parseFloat(usdAmount).toFixed(4)}</CustomText>}
					</View>
				</View>
			</Animated.View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderRadius: 24,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.white,
		marginBottom: 17,
		marginLeft: 2,
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 20
	},
	row: {
		flex: 1,
		flexDirection: "row"
	},
	capsule: {
		height: 24,
		borderRadius: 20,
		paddingHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: themeColors.white,
		marginLeft: 5
	}
})

export default Token;