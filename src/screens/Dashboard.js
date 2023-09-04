import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { images } from "../assets/images";
import Button from "../components/Button";
import DashboardHeader from "../components/DashboardHeader";
import NFT from "../components/NFT";
import ScreenContainer from "../components/Screen";
import Token from "../components/Token";
import { themeColors } from "../config/colors";
import AccountAPIHelper from "../helpers/AccountAPIHelper";
import DataFormatHelper from "../helpers/DataFormatHelper";
import { Converters, EthersScanAPI } from "../helpers/EthersScanAPI";
import { useWallet } from "../hooks";
import NdauStore from "../stores/NdauStore";
import UserStore from "../stores/UserStore";
import { ScreenNames } from "./ScreenNames";
import BottomSheetModal from "../components/BottomSheetModal";
import CustomText from "../components/CustomText";
import { ArrowDownSVGComponent, BlockChainWalletLogoSVGComponent } from "../assets/svgs/components";
import Spacer from "../components/Spacer";
import { addWalletsData } from "../utils";
import DashBoardBottomSheetCard from "./components/DashBoardBottomSheetCard";
import { useIsFocused } from "@react-navigation/native";
import AddWalletsPopup from "./components/dashboard/AddWalletsPopup";

const Dashboard = ({ navigation }) => {

	const { getNDauAccounts, addAccountsInNdau, getActiveWallet, getNdauAccountsDetails } = useWallet();
	const isFocused = useIsFocused();

	const [walletData, setWalletData] = useState({ walletName: "", type: "" });
	const [currentPrice, setCurrentPrice] = useState(0);
	const [totalBalance, setTotalBalance] = useState(0);
	const [accounts, setAccounts] = useState({});
	const [selected, setSelected] = useState(0);
	const [data, setData] = useState([]);
	const refAddWalletSheet = useRef(null)

	const [tokens, setTokens] = useState([
		{ name: "NDAU", network: "nDau", totalFunds: "0", usdAmount: "0", image: images.nDau, accounts: getNDauAccounts().length },
		{ name: "NPAY (ERC20)", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.nPay },
		{ name: "ETHEREUM", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.ethereum },
		{ name: "USDC (ERC20)", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.USDC },
	]);

	const nfts = [
		// { name: "CLONE X - X TAKASHI MURAKAMI", image: images.nDau },
		// { name: "Valhala", image: images.nPay }
	];

	const makeToken = (type, { totalFunds, usdAmount, accounts, address }) => {

		console.log(type,'type----')
		const tokens = {
			0: { name: "NDAU", network: "nDau", totalFunds: "0", usdAmount: "0", image: images.nDau, accounts: getNDauAccounts().length },
			1: { name: "NPAY (ERC20)", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.nPay },
			2: { name: "ETHEREUM", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.ethereum },
			3: { name: "USDC (ERC20)", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.USDC },
		}
		return {
			...tokens[type],
			address,
			totalFunds,
			usdAmount,
			accounts
		}
	}

	const loadBalances = async () => {

		const { result: { ethusd } } = await EthersScanAPI.getEthPriceInUSD();
		Promise.allSettled([
			EthersScanAPI.getAddressBalance(getActiveWallet().ercAddress),
			EthersScanAPI.getAddressBalance(getActiveWallet().ercAddress, EthersScanAPI.contractaddress.USDC),
			getNdauAccountsDetails()
		]).then(results => {

			console.log(JSON.stringify(results,null,2), 'results-------')


			// getting all results
			const availableEthInWEI = results[0].status === "fulfilled" ? results[0].value.result : 0;
			const availableUSDC = results[1].status === "fulfilled" ? results[1].value.result : 0;
			const ndauAccounts = results[2].status === "fulfilled" ? results[2].value : 0;


			console.log(JSON.stringify(ndauAccounts,null,2), 'ndauAccounts-------')
			const totalNdausOnAllAccounts = DataFormatHelper.getNdauFromNapu(Object.keys(ndauAccounts).map(key => ndauAccounts[key]).reduce((pv, cv) => pv += parseFloat(cv.balance), 0) || 0);
			
			console.log(JSON.stringify(totalNdausOnAllAccounts,null,2), 'ndauAccounts-------')

			
			const npay = { totalFunds: 0, usdAmount: 0 };

			// handle eth
			const eth = { totalFunds: Converters.WEI_ETH(availableEthInWEI), usdAmount: Converters.ETH_USD(Converters.WEI_ETH(availableEthInWEI), ethusd) };

			// handle usdc
			const usdc = { totalFunds: availableUSDC, usdAmount: availableUSDC };

			const currentPriceOfNdauInUsd = parseFloat(totalNdausOnAllAccounts * NdauStore.getMarketPrice()).toFixed(4)
			setTokens([
				makeToken(0, { totalFunds: totalNdausOnAllAccounts, accounts: getNDauAccounts().length, usdAmount: currentPriceOfNdauInUsd }),
				makeToken(1, { totalFunds: npay.totalFunds, address: getActiveWallet().ercAddress, usdAmount: npay.usdAmount }),
				makeToken(2, { totalFunds: eth.totalFunds, address: getActiveWallet().ercAddress, usdAmount: eth.usdAmount }),
				makeToken(3, { totalFunds: usdc.totalFunds, address: getActiveWallet().ercAddress, usdAmount: usdc.usdAmount }),
			])

		}).catch(err => { })

	}

	const loadOnlyNDAUBalances = () => {
		getNdauAccountsDetails().then(ndauAccounts => {
			const totalNdausOnAllAccounts = DataFormatHelper.getNdauFromNapu(Object.keys(ndauAccounts).map(key => ndauAccounts[key]).reduce((pv, cv) => pv += parseFloat(cv.balance), 0) || 0);
			const currentPriceOfNdauInUsd = parseFloat(totalNdausOnAllAccounts * NdauStore.getMarketPrice()).toFixed(4)
			setTokens([
				makeToken(0, { totalFunds: totalNdausOnAllAccounts, accounts: getNDauAccounts().length, usdAmount: currentPriceOfNdauInUsd })
			])
		})
	}

	useEffect(() => {
		if (isFocused) {
			if (getActiveWallet().type) {
				setTokens([
					makeToken(0, { totalFunds: "l", accounts: getNDauAccounts().length, usdAmount: "l" }),
					makeToken(1, { totalFunds: "l", address: getActiveWallet().ercAddress, usdAmount: "l" }),
					makeToken(2, { totalFunds: "l", address: getActiveWallet().ercAddress, usdAmount: "l" }),
					makeToken(3, { totalFunds: "l", address: getActiveWallet().ercAddress, usdAmount: "l" }),
				])
				loadBalances();
			} else {
				setTokens([
					makeToken(0, { totalFunds: "l", accounts: getNDauAccounts().length, address: "", usdAmount: "l" })
				])
				loadOnlyNDAUBalances()
			}

			setWalletData({
				walletName: UserStore.getActiveWallet().walletId,
				type: UserStore.getActiveWallet().type
			})
		}
	}, [isFocused])

	useEffect(() => {
		const availableAllUSDAmount = tokens.reduce((prevValue, initial) => prevValue += parseFloat(initial.usdAmount), 0) || 0;
		setTotalBalance(
			parseFloat(availableAllUSDAmount).toFixed(2)
		);
	}, [tokens])

	useEffect(() => {

		if (selected === 0) setData(tokens);
		else if (selected === 1) setData(nfts);
	}, [selected])

	const renderItem = useCallback(({ item, index }) => {
		if (selected == 0) return <Token {...item} index={index} onPress={() => handleNavigation(item)} />
		else if (selected == 1) return <NFT {...item} index={index} />
	}, [])

	const handleNavigation = useCallback((item) => {
		if (item.name === "NDAU") navigation.navigate(ScreenNames.AddNdauAccount, { item });
		else navigation.navigate(ScreenNames.ERCDetail, { item });
	}, [])


	console.log(JSON.stringify(tokens,null,2), 'results-------')

	return (
		<ScreenContainer tabScreen>
			<ScrollView showsVerticalScrollIndicator={false}>
				<DashboardHeader
					currentWalletName={walletData?.walletName}
					marketPrice={NdauStore.getMarketPrice()}
					totalBalance={totalBalance}
					accounts={accounts}
					// onAddWallet={() => navigation.navigate(ScreenNames.IntroCreateWallet)}
					onAddWallet={() => {
						refAddWalletSheet.current.open()
					}}
				/>
				<View style={styles.line} />

				{
					walletData.type == "ERC" ? (
						<View style={styles.row}>
							<View style={[styles.buttonContainer]}>
								<Button label={'Tokens'} onPress={() => setSelected(0)} buttonContainerStyle={[selected === 1 && styles.unSelect]} buttonTextColor={selected === 1 ? themeColors.black : themeColors.font} />
							</View>
							<View style={[styles.buttonContainer, { marginHorizontal: 10 }]}>
								<Button label={'NFTs'} onPress={() => setSelected(1)} buttonContainerStyle={[selected === 0 && styles.unSelect]} buttonTextColor={selected === 0 ? themeColors.black : themeColors.white} />
							</View>
							{/* <View style={[styles.buttonContainer]}>
								<Button label={'Search'} rightIcon={<Search />} buttonContainerStyle={styles.searchButton} />
							</View> */}
						</View>
					) : null
				}
				{
					selected === 0 ? (
						<FlatList
							style={{ paddingTop: 2 }}
							scrollEnabled={false}
							data={tokens}
							renderItem={renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					) : (
						<FlatList
							key={selected}
							style={{ paddingTop: 2 }}
							scrollEnabled={false}
							data={nfts}
							numColumns={2}
							renderItem={renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					)
				}


				<View style={styles.height} />
			</ScrollView>

			<BottomSheetModal
				refRBSheet={refAddWalletSheet}
				setIsVisible={() => {
					refAddWalletSheet.current.close();
				}}
				height={Dimensions.get('window').height * 0.55}
			>
				<AddWalletsPopup

					onClose={() => {
						refAddWalletSheet.current.close()
					}}
					onItemClick={(index) => {

						console.log(index, 'index--')

						if (index == 0) navigation.navigate(ScreenNames.ImportWallet, { forCreation: true })

						else if (index == 1) navigation.navigate(ScreenNames.CreateWallet, { isAlreadyWallet: true })

						refAddWalletSheet.current.close();

					}}
				/>

			</BottomSheetModal>


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
		marginVertical: 14,
		borderWidth: 1,
		borderColor: themeColors.lightBackground
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10
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
	},


})

export default Dashboard;