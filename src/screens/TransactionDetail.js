import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import { useTransaction } from "../hooks";
import moment from "moment";
import { ethers } from "ethers";
import DataFormatHelper from "../helpers/DataFormatHelper";

const TransactionDetail = (props) => {
	const { item } = props?.route?.params ?? {};
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
				<CustomText titiliumSemiBold body style={{ marginVertical: 10 }}>{moment(paramItem.timestamp * 1000).format("DD  MMM, YYYY")}</CustomText>
				{renderData("From", transaction.from)}
				{renderData("To", transaction.to)}
				{renderData("Value", ethers.utils.formatEther(transaction.value?._hex || "0x0"))}
				{renderData("Gas Price", ethers.utils.formatEther(transaction.gasPrice?._hex || "0x0") + " Eth")}
				{renderData("Max. Priority Fee Per Gas", ethers.utils.formatEther(transaction.maxPriorityFeePerGas?._hex || "0x0") + " Eth")}
				{renderData("Max. Fee Per Gas", ethers.utils.formatEther(transaction.maxFeePerGas?._hex || "0x0") + " Eth")}
				{renderData("Gas Limit", ethers.utils.formatEther(transaction.gasLimit?._hex || "0x0") + " Eth")}
				{renderData("Block Hash", transaction.blockHash)}
				{renderData("Block Number", transaction.blockNumber)}
				{renderData("Confirmations", transaction.confirmations)}
				{renderData("Nonce", transaction.nonce)}
				{renderData("Data", transaction.data)}
				{renderData("Chain Id", transaction.chainId)}
			</View>
		)
	}
	const renderNDAUDetail = () => {
		console.log('hahah', JSON.stringify(transaction, null, 2));
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
			</View>
		)
	}

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
	}
})

export default TransactionDetail;