import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

const Loading = ({ label }) => {
	const av1 = useSharedValue(0);
	const av2 = useSharedValue(0);
	const av3 = useSharedValue(0);

	const as1 = useAnimatedStyle(() => ({ transform: [{ translateY: -av1.value }] }), [])
	const as2 = useAnimatedStyle(() => ({ transform: [{ translateY: -av2.value }] }), [])
	const as3 = useAnimatedStyle(() => ({ transform: [{ translateY: -av3.value }] }), [])

	useEffect(() => {

		const animationConfig = () => {
			const threshold = 20;
			av1.value = withRepeat(withTiming(threshold, { duration: 1000 }), 2, true);
			av2.value = withDelay(1500, withRepeat(withTiming(threshold, { duration: 1000 }), 2, true));
			av3.value = withDelay(2500, withRepeat(withTiming(threshold, { duration: 1000 }), 2, true));
		}
		animationConfig();
		const intervalId = setInterval(animationConfig, 2500);
		return () => {
			clearInterval(intervalId);
		}
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.dotContainer}>
				<Animated.View style={[styles.dot, as1]} />
				<Animated.View style={[styles.dot, as2]} />
				<Animated.View style={[styles.dot, as3]} />
			</View>
			<CustomText titilium h6>{label}</CustomText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		top: -50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,1)",
		zIndex: 100,
	},
	dotContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10
	},
	dot: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: themeColors.white,
		marginRight: 6
	}
})

export default Loading;