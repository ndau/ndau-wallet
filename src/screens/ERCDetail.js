import React from "react";
import { Alert, Image, Linking, StyleSheet, View } from "react-native";

import CopyAddressButton from "../components/CopyAddressButton";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import IconButton from "../components/IconButton";
import { Buy, Delete, Receive, Send, Swap } from "../assets/svgs/components";
import Button from "../components/Button";
import { ScreenNames } from "./ScreenNames";
import Spacer from "../components/Spacer";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTransaction } from "../hooks";
import AppConfig from "../AppConfig";

const ERCDetail = (props) => {
	const { item } = props?.route?.params ?? {};


	const disableButton = item.totalFunds === null || item.totalFunds === undefined || parseFloat(item.totalFunds) <= 0

	const copyAddress = () => {
		Clipboard.setString(item.address);
	}

	const launchBuyNdauInBrowser = async () => {
		const url = AppConfig.BUY_NDAU_URL;
	
		const supported = await Linking.openURL(url);
	
		if (supported) {
		  await Linking.openURL(url);
		} else {
		  Alert.alert(
			'Error',
			`Don't know how to open this URL: ${url}`,
			[{text: 'OK', onPress: () => {}}],
			{cancelable: false},
		  );
		}
	  };


	const navigateToTransaction = () => {
		props.navigation.navigate(ScreenNames.Transactions, { item })
	}

	return (
		<ScreenContainer headerTitle={" "} headerRight={<CopyAddressButton onPress={copyAddress} />}>
			<View style={styles.headerContainer}>
				<Image style={styles.icon} source={item.image} />
				<CustomText titiliumSemiBold h6 style={{ margin: 10, marginBottom: 0, textTransform: "capitalize" }}>{item.name}</CustomText>
				<CustomText titilium body style={{ marginTop: 6, marginBottom: 4 }}>{"Balance"}</CustomText>
				<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
					<CustomText semiBold h4>{item?.totalFunds || "0.00"}</CustomText>
					<CustomText titilium body>{` ~ $${parseFloat(item.usdAmount || 0)?.toFixed(2) || "0"}`}</CustomText>
				</View>


				<View style={styles.buttonContainer}>
					<View style={styles.row}>
						<IconButton label="Buy" icon={<Buy />} onPress={launchBuyNdauInBrowser} />
						<IconButton disabled={disableButton} label="Send" icon={<Send />} onPress={() => props.navigation.navigate(ScreenNames.Send, { item })} />
						<IconButton label="Receive" icon={<Receive />} onPress={() => {
							return props.navigation.navigate(ScreenNames.Receive, { address: item?.address, tokenName: item?.name })
						}} />
					</View>
					<Spacer height={12} />
					<View style={styles.row}>
						<IconButton label="Swap" icon={<Swap />} onPress={launchBuyNdauInBrowser} />
					</View>


				</View>
			</View>

			<View style={{ flex: 1, justifyContent: "flex-end" }}>
				<Button
					label={'View Transaction'}
					onPress={navigateToTransaction}
				/>
			</View>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	headerContainer: {
		padding: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	icon: {
		height: 60,
		width: 60,
		borderRadius: 30
	},
	buttonContainer: {
		width: "100%"
	},
	row: {
		flexDirection: "row"
	},
	balance: {
		margin: 20
	},
	removeButton: {
		marginTop: 10,
		backgroundColor: themeColors.error500,
		flexDirection: "row",
		alignItems: "center"
	}
})

export default ERCDetail;