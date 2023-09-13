import React, { useEffect, useState } from "react";
import { FlatList, SectionList, StyleSheet, TouchableOpacity, View } from "react-native";

import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import { useTransaction } from "../hooks";
import moment from "moment";
import DataFormatHelper from "../helpers/DataFormatHelper";
import { themeColors } from "../config/colors";
import { ndauUtils } from "../utils";
import { ethers } from "ethers";
import { ScreenNames } from "./ScreenNames";

const Transactions = (props) => {
	const { item } = props?.route?.params ?? {};
	const paramItem = item;
	const { getTransactions, getERCTransactionHistory } = useTransaction();
	const [transactions, setTranstions] = useState([]);

	const [loading, setLoading] = useState("");

	useEffect(() => {
		// getTransactionsFoNDAU();
		// return console.log('ahh', JSON.stringify(paramItem, null, 2));
		if (!paramItem.shortName) getTransactionsFoNDAU();
		else getERCTransaction();
	}, [])

	const getERCTransaction = () => {
		setLoading("Getting transactions")
		getERCTransactionHistory(paramItem.address).then(res => {
			setLoading("")
			const dates = {};
			res?.forEach(transaction => {
				const date = moment(transaction.timestamp * 1000).format("DD MMM, YYYY");
				if (dates[date]) dates[date].push(transaction)
				else {
					dates[date] = [];
					dates[date].push(transaction);
				}
			});
			const sectionsData = [];
			Object.keys(dates).forEach((key, index) => sectionsData.push({ index, title: key, data: dates[key] }))

			setTranstions(sectionsData.sort((a, b) => a.index < b.index ? 1 : -1) || []);
		}).catch(err => {
			setLoading("")
		})
	}

	const getTransactionsFoNDAU = () => {
		setLoading("Getting transactions")
		getTransactions(paramItem.address).then(res => {
			setLoading("")

			const dates = {};
			res?.Items.forEach(transaction => {
				const date = moment(transaction.Timestamp).format("DD MMM, YYYY");
				if (dates[date]) dates[date].push(transaction)
				else {
					dates[date] = [];
					dates[date].push(transaction);
				}
			});
			const sectionsData = [];
			Object.keys(dates).forEach((key, index) => sectionsData.push({ index, title: key, data: dates[key] }))

			setTranstions(sectionsData.sort((a, b) => a.index < b.index ? 1 : -1) || []);
		}).catch(err => {
			setLoading("")
		});
	}

	const renderNDAUTransaction = (item) => {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={() => handleNavigation(item)}>
				<View style={styles.ndauContainer}>
					<View>
						<CustomText titiliumSemiBold>TxHash: </CustomText>
						<CustomText titilium color={themeColors.black100}>{item.TxHash}</CustomText>
					</View>
					<CustomText titiliumSemiBold>{DataFormatHelper.getNdauFromNapu(item.Balance)} NDAU</CustomText>
				</View>
			</TouchableOpacity>
		)
	}

	const renderERCTransaction = (item) => {
		// "hash": "0xcc7f04919132308e1bdb4b4d2f462e4bed2b101d4d6771014a3d16c95e39055a",
		// "type": 0,
		// "accessList": null,
		// "blockHash": "0x6957b3bea632c67b1775301fc30fde34a2cf109ff26ecd1f3384da5ed0272d86",
		// "blockNumber": 9480315,
		// "transactionIndex": 20,
		// "confirmations": 159914,
		// "from": "0xA7E4EF0a9e15bDEf215E2ed87AE050f974ECD60b",
		// "to": "0xa6E9515688ff6801AEc13ad73f4aCd722829a5a4",
		// "gasPrice": {
		//   "type": "BigNumber",
		//   "hex": "0xe4"
		// },
		// "gasLimit": {
		//   "type": "BigNumber",
		//   "hex": "0xf618"
		// },
		// "value": {
		//   "type": "BigNumber",
		//   "hex": "0x470de4df820000"
		// },
		// "nonce": 268601,
		// "data": "0x",
		// "creates": null,
		// "chainId": 0,
		// "timestamp": 1691456136
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={() => handleNavigation(item)}>
				<View style={styles.ndauContainer}>
					<View>
						<View>
							<CustomText titiliumSemiBold>From: </CustomText>
							<CustomText titilium color={themeColors.black100}>{ndauUtils.truncateAddress(item.from)}</CustomText>
						</View>
						<View>
							<CustomText titiliumSemiBold>to: </CustomText>
							<CustomText titilium color={themeColors.black100}>{ndauUtils.truncateAddress(item.to)}</CustomText>
						</View>
					</View>
					<CustomText titiliumSemiBold>{ethers.utils.formatEther(item.value._hex).substring(0, 8)} {paramItem.shortName}</CustomText>
				</View>
			</TouchableOpacity>
		)
	}

	const handleNavigation = (item) => {


		props.navigation.navigate(ScreenNames.TransactionDetail, { item: { ...item, isErc: !!paramItem.shortName }, accountAddress: paramItem?.address })
	}


	return (
		<ScreenContainer headerTitle={item.addressData?.nickname}>
			{loading && <Loading label={loading} />}
			<CustomText semiBold h5>Transactions</CustomText>
			<SectionList
				stickySectionHeadersEnabled={false}
				sections={transactions}
				keyExtractor={(i, _) => _.toString()}
				renderSectionHeader={({ section: { title } }) => (
					<CustomText titiliumSemiBold body style={styles.headerTitle}>{title}</CustomText>
				)}
				renderItem={({ item }) => {
					if (!paramItem.shortName) return renderNDAUTransaction(item);
					else return renderERCTransaction(item)
				}}
			/>
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

export default Transactions;