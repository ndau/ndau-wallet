import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

import { images } from "../assets/images";
import { Search } from "../assets/svgs/components";
import Button from "../components/Button";
import DashboardHeader from "../components/DashboardHeader";
import NFT from "../components/NFT";
import ScreenContainer from "../components/Screen";
import Token from "../components/Token";
import { themeColors } from "../config/colors";
import AccountAPIHelper from "../helpers/AccountAPIHelper";
import DataFormatHelper from "../helpers/DataFormatHelper";
import NdauStore from "../stores/NdauStore";
import UserStore from "../stores/UserStore";
import { useWallet } from "../hooks";

const Dashboard = () => {

	const { getNDauAccounts, addAccountsInNdau } = useWallet();

	const [currentPrice, setCurrentPrice] = useState(0);
	const [totalBalance, setTotalBalance] = useState(0);
	const [accounts, setAccounts] = useState({});
	const [selected, setSelected] = useState(0);
	const [data, setData] = useState([]);

	const tokens = useMemo(() => [
		{ name: "NDAU", network: "nDau", totalFunds: "0", usdAmount: "$0", image: images.nDau, accounts: getNDauAccounts().length },
		{ name: "NPAY (ERC20)", network: "zkSync Era", totalFunds: "0", usdAmount: "$0", image: images.nPay },
		{ name: "USDC (ERC20)", network: "nDau", totalFunds: "0", usdAmount: "$0", image: images.USDC },
		{ name: "ETHEREUM", network: "ethereum", totalFunds: "0", usdAmount: "$0", image: images.ethereum },
	], [getNDauAccounts]);

	const nfts = [
		// { name: "CLONE X - X TAKASHI MURAKAMI", image: images.nDau },
		// { name: "Valhala", image: images.nPay }
	];

	useEffect(() => {

		const user = UserStore.getUser();

		const accounts = DataFormatHelper.getObjectWithAllAccounts(user)
		const totalNdauNumber = AccountAPIHelper.accountTotalNdauAmount(accounts, false)
		const currentPrice = AccountAPIHelper.currentPrice(NdauStore.getMarketPrice(), totalNdauNumber)

		setAccounts(accounts);
		setCurrentPrice(NdauStore.getMarketPrice())
		setTotalBalance(currentPrice);

		if (selected === 0) setData(tokens);
		else if (selected === 1) setData(nfts);
	}, [selected])

	const renderItem = useCallback(({ item, index }) => {
		if (selected == 0) return <Token {...item} index={index} onPress={() => console.log('getNDauAccounts()', JSON.stringify(getNDauAccounts(), null, 2))} />
		else if (selected == 1) return <NFT {...item} index={index} />
	}, [])

	return (
		<ScreenContainer tabScreen>
			<ScrollView showsVerticalScrollIndicator={false}>
				<DashboardHeader
					marketPrice={currentPrice}
					totalBalance={totalBalance}
					accounts={accounts}
				/>
				<View style={styles.line} />

				<View style={styles.row}>
					<View style={[styles.buttonContainer]}>
						<Button label={'Tokens'} onPress={() => setSelected(0)} buttonContainerStyle={[selected === 1 && styles.unSelect]} buttonTextColor={selected === 1 ? themeColors.black : themeColors.font} />
					</View>
					<View style={[styles.buttonContainer, { marginHorizontal: 10 }]}>
						<Button label={'NFTs'} onPress={() => setSelected(1)} buttonContainerStyle={[selected === 0 && styles.unSelect]} buttonTextColor={selected === 0 ? themeColors.black : themeColors.white} />
					</View>
					<View style={[styles.buttonContainer]}>
						<Button label={'Search'} rightIcon={<Search />} buttonContainerStyle={styles.searchButton} />
					</View>
				</View>

				<FlatList
					key={selected}
					scrollEnabled={false}
					data={data}
					numColumns={selected == 1 ? 2 : 1}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
				/>

				<View style={styles.height} />
			</ScrollView>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	textContainer: {
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
	height: { height: 100 },
	line: {
		marginVertical: 24,
		borderWidth: 1,
		borderColor: themeColors.lightBackground
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24
	},
	buttonContainer: {
		flex: 1
	},
	searchButton: {
		backgroundColor: undefined,
		flexDirection: "row",
		justifyContent: "space-around",
		borderWidth: 1,
		borderColor: themeColors.white
	},
	unSelect: {
		backgroundColor: themeColors.white
	}
})

export default Dashboard;