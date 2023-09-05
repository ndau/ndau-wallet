import React from "react";
import { Image, StyleSheet, View } from "react-native";

import CopyAddressButton from "../components/CopyAddressButton";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import IconButton from "../components/IconButton";
import { Buy, Delete, Receive, Send } from "../assets/svgs/components";
import Button from "../components/Button";
import { ScreenNames } from "./ScreenNames";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTransaction } from "../hooks";

const ERCDetail = (props) => {
	const { item } = props?.route?.params ?? {};

	const { getERCTransactionHistory } = useTransaction();

	const disableButton = item.totalFunds === null || item.totalFunds === undefined || parseFloat(item.totalFunds) <= 0

	const copyAddress = () => {
		Clipboard.setString(item.address);
	}

	const navigateToTransaction = () => {
		props.navigation.navigate(ScreenNames.Transactions, { item })
	}

	return (
		<ScreenContainer headerTitle={" "} headerRight={<CopyAddressButton onPress={copyAddress}/>}>
			<View style={styles.headerContainer}>
				<Image style={styles.icon} source={item.image} />
				<CustomText semiBold h4 style={styles.balance}>{item?.totalFunds?.toFixed?.(4) || "0.00"}</CustomText>

				<View style={styles.buttonContainer}>
					<View style={styles.row}>
						<IconButton label="Buy" icon={<Buy />} />
						<IconButton disabled={disableButton} label="Send" icon={<Send />} onPress={() => props.navigation.navigate(ScreenNames.Send, { item })} />
						<IconButton label="Receive" icon={<Receive />} />
					</View>
				</View>
			</View>
			<View style={{ flex: 1, justifyContent: "flex-end" }}>
				<Button
					label={'View Transaction'}
					onPress={navigateToTransaction}
				/>
				<Button
					label={'Remove Account'}
					iconLeft={<Delete />}
					buttonContainerStyle={styles.removeButton}
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