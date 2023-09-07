import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import { useWallet, useWalletConnect } from "../hooks";
import Spacer from "../components/Spacer";
import { ArrowDownSVGComponent, ArrowRightSVGComponent, WalletIcon } from "../assets/svgs/components";
import { ScreenNames } from "./ScreenNames";
import { useIsFocused } from "@react-navigation/native";

const Setting = (props) => {

	const isFocused = useIsFocused();
	const { getActiveWallet } = useWallet();
	const [hideOptionForConnectWallet, setHideOptionForConnectWallet] = useState(false);

	const options = useMemo(() => [
		{ id: 0, name: "Wallets", image: <WalletIcon />, onPress: () => props.navigation.navigate(ScreenNames.SwitchWallet) },
		{ id: 1, name: "Wallet Connect", image: <WalletIcon />, onPress: () => props.navigation.navigate(ScreenNames.WalletConnect) },
		{ id: 2, name: "Node Environment", image: <WalletIcon />, onPress: () => null },
		{ id: 3, name: "Contact Support", image: <WalletIcon />, onPress: () => null },
		{ id: 4, name: "4.3", image: <WalletIcon />, onPress: () => null, hideArrow: true },
		{ id: 5, name: "Logout", image: <WalletIcon />, onPress: () => null, hideArrow: true },
	], [])

	useEffect(() => {
		if (isFocused) {
			setHideOptionForConnectWallet(!!getActiveWallet().type);
		}
	}, [isFocused])

	return (
		<ScreenContainer tabScreen>
			<View style={styles.container}>
				<CustomText h6 semiBold style={styles.text1}>Settings</CustomText>
				<Spacer height={16} />
				<FlatList
					data={options}
					showsVerticalScrollIndicator={false}
					keyExtractor={(i, _) => _.toString()}
					renderItem={({ item }) => {
						if (!hideOptionForConnectWallet && item.id == 1) return null;
						return (
							<TouchableOpacity activeOpacity={0.8} onPress={item.onPress}>
								<View style={styles.optionItem}>
									<View style={styles.iconContainer}>
										{item.image}
									</View>
									<CustomText style={{ flex: 1 }} titilium>{item.name}</CustomText>
									{
										!item.hideArrow ? (
											<View style={styles.arrow}>
												<ArrowDownSVGComponent />
											</View>
										) : null
									}
								</View>
							</TouchableOpacity>
						)
					}}
				/>
			</View>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	mainContainer: {
		flex: 1,
		paddingVertical: 10,
		marginBottom: 20
	},
	text1: {
		width: 200,
		marginBottom: 10
	},
	imageContainer: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		borderWidth: 1,
		width: "100%",
		borderRadius: 20,
		borderColor: themeColors.fontLight,
		backgroundColor: themeColors.lightBackground,
		marginBottom: 20
	},
	optionItem: {
		marginBottom: 14,
		flexDirection: "row",
		alignItems: "center"
	},
	iconContainer: {
		backgroundColor: themeColors.primary,
		borderRadius: 10,
		height: 40,
		width: 40,
		marginRight: 6,
		justifyContent: "center",
		alignItems: "center"
	},
	arrow: {
		transform: [{ rotate: "260deg" }]
	}
})

export default Setting;