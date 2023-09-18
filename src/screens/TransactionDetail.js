import React, { useEffect, useState } from "react";
import { Dimensions, Linking, ScrollView, StyleSheet, View } from "react-native";

import { ethers } from "ethers";
import moment from "moment";
import AppConfig from "../AppConfig";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import DataFormatHelper from "../helpers/DataFormatHelper";
import { useTransaction } from "../hooks";


const TransactionDetail = (props) => {
	const { item, accountAddress } = props?.route?.params ?? {};
	const paramItem = item;
	const { getTransactionByHash, getERCTransactionDetail } = useTransaction();
	const [transaction, setTranstion] = useState({});

	const [loading, setLoading] = useState("");

	useEffect(() => {
		if (!paramItem.isErc) {
			getTransactionByHash(paramItem.TxHash).then(res => {
				setTranstion(res);
			})
		} else {
			getERCTransactionDetail(paramItem.hash).then(res => {
				setTranstion(res);
			})
		}
	}, [])

	const renderData = (key, value) => {
		if (!value) return;
		return (
			<View style={{ marginVertical: 5, marginBottom: 10 }}>
				<CustomText titiliumSemiBold body style={{ marginBottom: 4 }}>{key}</CustomText>
				<CustomText titilium color={themeColors.black200}>{value}</CustomText>
			</View>
		)
	}


	const renderERCDetail = () => {
		return (
			<View styles={styles.container}>
				<Spacer height={16} />
				{renderData("Block Number:", transaction.blockNumber)}
				{renderData("Timestamp:", `${moment.utc(paramItem.timestamp * 1000).fromNow()} ${moment.utc(paramItem.timestamp * 1000).format("DD-MMM-YYYY hh:mm:ss A Z")}`)}
				{renderData("From:", transaction.from)}
				{renderData("To:", transaction.to)}
				{renderData("Value:", ethers.utils.formatEther(transaction.value?._hex || "0x0"))}
				<Button
					onPress={() => launchViewTransactionDetailInBrowser(transaction.hash, "ERC")}
					label={"Details"}
					buttonContainerStyle={styles.detailsButton} />

			</View>
		)
	}
	const renderNDAUDetail = () => {
		return (
			<View styles={styles.container}>
				<CustomText semiBold style={{ marginVertical: 20 }}>{moment(transaction.Timestamp).format("DD  MMM, YYYY")}</CustomText>
				{renderData("Transaction Hash", transaction?.TxHash)}
				{renderData("Source", transaction?.TxData?.source)}
				{renderData("Destination", transaction?.TxData?.destination)}
				{renderData("Quantity", DataFormatHelper.getNdauFromNapu(transaction?.TxData?.qty || 0) + " NDAU")}
				{renderData("FEE", DataFormatHelper.getNdauFromNapu(transaction.Fee) + " NDAU")}
				{renderData("Transaction Type", transaction.TxType)}
				{renderData("Sequence", transaction?.TxData?.sequence)}
				<Button
					onPress={() => launchViewTransactionDetailInBrowser(accountAddress, "Ndau")}
					label={"Details"}
					buttonContainerStyle={styles.detailsButton} />
			</View>
		)
	}

	const launchViewTransactionDetailInBrowser = async (address, type) => {

		let url = '';

		if (type === "ERC") {
			url = `${AppConfig.VIEW_TRANSACTION_DETAIL_VIEW}/${address}`
		}

		if (type === "Ndau") {
			url = AppConfig.calcExplorerUrl(address, "mainnet")
		}

		const supported = await Linking.openURL(url);

		if (supported) {
			await Linking.openURL(url);
		} else {
			Alert.alert(
				'Error',
				`Don't know how to open this URL: ${url}`,
				[{ text: 'OK', onPress: () => { } }],
				{ cancelable: false },
			);
		}
	};



	return (
		<ScreenContainer headerTitle={item.addressData?.nickname}>
			{loading && <Loading label={loading} />}
			<CustomText semiBold h5>Transactions</CustomText>
			<ScrollView>
				{
					paramItem.isErc ? renderERCDetail() : renderNDAUDetail()
				}
			</ScrollView>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	headerTitle: {
		padding: 10,
		paddingLeft: 0
	},
	ndauContainer: {
		borderWidth: 1,
		marginBottom: 10,
		borderColor: themeColors.white,
		padding: 16,
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	detailsButton: {
		width: Dimensions.get('window').width / 4,
		padding: 0,
		height: 30,
		borderRadius: 6,
		backgroundColor: '#A7A7A7',
		alignSelf: 'center'
	}
})

export default TransactionDetail;