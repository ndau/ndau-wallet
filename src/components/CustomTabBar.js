import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";

import { themeColors } from "../config/colors";
import { NDauLogo, NotificationBell, Setting, DApps } from "../assets/svgs/components";
import Animated, { FadeIn, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { isSmallerDivce } from "../utils";

const CustomTabBar = ({ state, descriptors, navigation }) => {

	const getIcon = (name) => {
		switch (name) {
			case "Dashboard": return <NDauLogo />;
			case "DApps": return <DApps />;
			case "Notifications": return <NotificationBell />;
			case "Setting": return <Setting />;
		}
	}

	const renderTab = useCallback((route, index) => {
		const anim = useSharedValue(0);

		const expandStyle = useAnimatedStyle(() => {
			return {
				flex: interpolate(anim.value, [0, 1], [1.2, 2.5])
			}
		}, [])

		const isFocused = state.index === index;

		const onPress = () => {
			const event = navigation.emit({
				type: 'tabPress',
				target: route.key,
			});

			if (!isFocused && !event.defaultPrevented) {
				navigation.navigate(route.name);
			}

		};

		useEffect(() => {
			if (isFocused) {
				anim.value = withTiming(1);
			} else {
				anim.value = withTiming(0);
			}
		}, [isFocused])

		return (
			<Animated.View
				key={index}
				entering={FadeIn}
				style={[
					styles.button,
					expandStyle
				]}>
				<Pressable style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} onPress={onPress}>
					{getIcon(route.name)}
				</Pressable>
			</Animated.View>
		);
	}, [state])

	return (
		<View style={styles.mainContainer}>
			{
				state.routes.map((route, index) => renderTab(route, index))
			}
		</View>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: isSmallerDivce() ? 10 : 35,
		backgroundColor: themeColors.primary,
		borderRadius: 24,
		left: 14,
		right: 14,
		padding: 14
	},
	button: {
		flex: 1,
		backgroundColor: themeColors.lightBackground,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		height: 60,
		marginRight: 10
	},
	buttonContainer: {
	}
})

export default CustomTabBar;