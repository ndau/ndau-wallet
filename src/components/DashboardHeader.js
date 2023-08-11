import React, { useCallback, useState } from "react";
import { ImageBackground, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { images } from "../assets/images";
import { themeColors } from "../config/colors";
import Button from "./Button";
import CustomText from "./CustomText";
import { ArrowForward, Plus } from "../assets/svgs/components";
import AppConstants from "../AppConstants";

const DashboardHeader = ({ marketPrice = 0, totalBalance = 0, accounts = {} }) => {

	const Avatar = useCallback(() => {
		return (
			<View style={styles.avatar}>
				<CustomText semiBold>MW</CustomText>
			</View>
		)
	}, []);

	const Collapsible = useCallback(() => {

		const [isOpen, setIsOpen] = useState(false);

		const av = useSharedValue(0);
		const aStyle = useAnimatedStyle(() => {
			return {
				minHeight: interpolate(av.value, [0, 100], [0, 90]),
			}
		})
		const heightStyle = useAnimatedStyle(() => {
			return {
				minHeight: interpolate(av.value, [0, 100], [0, 70]),
				opacity: interpolate(av.value, [0, 100], [0, 1]),
			}
		})
		const rotateStyle = useAnimatedStyle(() => {
			return {
				transform: [{ rotate: `${interpolate(av.value, [0, 100], [0, 90])}deg` }]
			}
		})

		return (
			<View style={{ marginTop: 20 }}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						av.value = isOpen ? withTiming(0, { duration: 300 }) : withTiming(100, { duration: 300 })
						setIsOpen(!isOpen);
					}}>
					<Animated.View style={[styles.upper]}>
						<CustomText titilium color={themeColors.black}>{`Current Blockchain Market Price: $${marketPrice}`}</CustomText>
						<Animated.View style={[styles.arrow, rotateStyle]}>
							<ArrowForward />
						</Animated.View>
					</Animated.View>
				</TouchableOpacity>

				<Animated.View style={aStyle}>
					<Animated.View style={[styles.lower, heightStyle]}>
						<CustomText size={10} color={themeColors.black}>*Updated & Recorded on the ndau Blockchain every 5 minutes</CustomText>
						<TouchableOpacity onPress={() => Linking.openURL(AppConstants.NDAU_WEBSITE)}>
							<CustomText size={9} color={themeColors.black} style={styles.underLine}>What is Blockchain Market Price and how is it calculated?</CustomText>
						</TouchableOpacity>
					</Animated.View>
				</Animated.View>
			</View>
		)
	}, [marketPrice, accounts])

	return (
		<ImageBackground
			resizeMode="stretch"
			style={styles.imageBackground}
			source={images.DashboardHeaderBack}>
			<View style={styles.spaceBetween}>

				<View style={styles.row}>
					{/* <Avatar /> */}
					<View style={{ flex: 1 }}>
						<TouchableOpacity>
							<View style={styles.row}>
								<CustomText h6 medium>Main Wallet</CustomText>
								<View style={styles.rotate}>
									<ArrowForward white />
								</View>
							</View>
						</TouchableOpacity>
						{/* <CustomText titilium body2 style={styles.walletName}>Account 1</CustomText> */}
					</View>
					<Button
						rightIcon={<Plus />}
						buttonContainerStyle={styles.addAccountButton} />
				</View>

				<View style={{ marginTop: 30 }}>
					<CustomText titilium body style={{ marginBottom: 6 }}>Your Balance</CustomText>
					<CustomText h1 semiBold>{totalBalance}</CustomText>
					<Collapsible />
				</View>
			</View>
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	imageBackground: {
		minHeight: 200,
		padding: 20,
		borderRadius: 30
	},
	row: {
		flexDirection: "row",
		alignItems: "center"
	},
	avatar: {
		height: 50,
		width: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: themeColors.lightBackground
	},
	addAccountButton: {
		backgroundColor: themeColors.lightBackground,
		height: 40,
		width: 40,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	spaceBetween: {
		flex: 1,
		justifyContent: "space-between"
	},
	upper: {
		padding: 10,
		borderRadius: 20,
		backgroundColor: themeColors.collapsibleBackground,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row"
	},
	lower: {
		marginTop: 10,
		borderRadius: 20,
		backgroundColor: themeColors.collapsibleBackground,
		opacity: 0,
		position: "absolute",
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center"
	},
	underLine: {
		marginTop: 6,
		textDecorationLine: "underline"
	},
	arrow: {
		marginLeft: 10
	},
	rotate: {
		marginLeft: 4,
		transform: [{ rotate: "90deg" }]
	}
})

export default DashboardHeader;