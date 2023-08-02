import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";

import { themeColors } from "../config/colors";
import { NDauLogo, NotificationBell, Setting, DApps } from "../assets/svgs/components";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const CustomTabBar = ({ state, descriptors, navigation }) => {

	const av1 = useSharedValue(1);
	const av2 = useSharedValue(1);
	const av3 = useSharedValue(1);
	const av4 = useSharedValue(1);

	const av1Style = useAnimatedStyle(() => ({ flex: withTiming(av1.value, { duration: 500 }) }), [])
	const av2Style = useAnimatedStyle(() => ({ flex: withTiming(av2.value, { duration: 500 }) }), [])
	const av3Style = useAnimatedStyle(() => ({ flex: withTiming(av3.value, { duration: 500 }) }), [])
	const av4Style = useAnimatedStyle(() => ({ flex: withTiming(av4.value, { duration: 500 }) }), [])

	const getIcon = (index) => {
		switch (index) {
			case 0: return <NDauLogo />;
			case 1: return <DApps />;
			case 2: return <NotificationBell />;
			case 3: return <Setting />;
		}
	}

	return (
		<View style={styles.mainContainer}>
			{
				state.routes.map((route, index) => {
					const { options } = descriptors[route.key];

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

					return (
						<Animated.View
							key={index}
							entering={FadeIn}
							style={[
								styles.button,
								isFocused && { flex: 2.5 }
							]}>
							<Pressable style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} onPress={onPress}>
								{getIcon(index)}
							</Pressable>
						</Animated.View>
					);
				})
			}
		</View>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 25,
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