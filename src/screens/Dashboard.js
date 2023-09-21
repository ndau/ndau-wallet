import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { ethers } from "ethers";
import OrderAPI from "../api/OrderAPI";
import { images } from "../assets/images";
import BottomSheetModal from "../components/BottomSheetModal";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import DashboardHeader from "../components/DashboardHeader";
import NFT from "../components/NFT";
import ScreenContainer from "../components/Screen";
import Token from "../components/Token";
import FlashNotification from "../components/common/FlashNotification";
import { themeColors } from "../config/colors";
import DataFormatHelper from "../helpers/DataFormatHelper";
import { CoinGecko, Converters, EthersScanAPI, NetworkManager } from "../helpers/EthersScanAPI";
import { useNFTS, useWallet } from "../hooks";
import NdauStore from "../stores/NdauStore";
import UserStore from "../stores/UserStore";
import { tokenShortName } from "../utils";
import { ScreenNames } from "./ScreenNames";
import AddWalletsPopup from "./components/dashboard/AddWalletsPopup";

const Dashboard = ({ navigation }) => {

	const { getNDauAccounts, getActiveWallet, getNdauAccountsDetails } = useWallet();
	const { getCollections } = useNFTS();
	const isFocused = useIsFocused();

	const [mainRefreshing, setMainRefreshing] = useState(false);
	const [walletData, setWalletData] = useState({ walletName: "", type: "" });
	const [totalBalance, setTotalBalance] = useState(0);
	const [nftLoading, setNFTLoading] = useState(false);
	const [selected, setSelected] = useState(0);
	const refAddWalletSheet = useRef(null)

	const [tokens, setTokens] = useState([]);

	const [nfts, setNfts] = useState([]);

	const makeToken = (type, { totalFunds, usdAmount, accounts }) => {
		const tokens = {
			0: { shortName: tokenShortName.NDAU, name: "NDAU", network: "nDau", totalFunds: "0", usdAmount: "0", image: images.nDau, accounts: getNDauAccounts().length },
			1: { shortName: tokenShortName.NPAY, name: "NPAY", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.nPay },
			2: { shortName: tokenShortName.ETHERERUM, name: "ETHEREUM", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.ethereum },
			3: { shortName: tokenShortName.USDC, name: "USDC", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.USDC },
			4: { shortName: tokenShortName.ZK_ETH, name: "ETHEREUM", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.ethereum },
			5: { shortName: tokenShortName.USDC, name: "USDC", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.USDC },
			6: { shortName: tokenShortName.MATIC, name: "Matic", network: "Polygon", totalFunds: "0", usdAmount: "0", image: images.matic }
		}
		return {
			...tokens[type],
			address: getActiveWallet().ercAddress,
			totalFunds,
			usdAmount,
			accounts
		}
	}

	const getFormattedToken = (availabeFunds, decimal = 18, usdRate = 1) => {
		return {
			totalFunds: parseFloat(ethers.utils.formatUnits(availabeFunds || 0, decimal)).toFixed(4),
			usdAmount: ethers.utils.formatUnits(availabeFunds || 0, decimal) * usdRate
		}
	}

	const loadBalances = async () => {

		Promise.allSettled([
			NetworkManager.getBalance(),
			NetworkManager.getContractFor(NetworkManager.Coins().USDC).getBalance(),
			getNdauAccountsDetails(),
			NetworkManager.getContractFor(NetworkManager.Coins().NPAY).getBalance(),
			NetworkManager.getBalance(NetworkManager.getEnv().polygon),
			NetworkManager.getBalance(NetworkManager.getEnv().zkSyncEra),
			NetworkManager.getContractFor(NetworkManager.Coins().ZK_USDC).getBalance(),
			CoinGecko.getPrices()
		]).then(results => {

			// getting all results
			const availableEth = results[0].status === "fulfilled" ? results[0].value : 0;
			const availableUSDC = results[1].status === "fulfilled" ? results[1].value : 0;
			const ndauAccounts = results[2].status === "fulfilled" ? results[2].value : 0;
			const availableNpay = results[3].status === "fulfilled" ? results[3].value : 0;
			const availableMatic = results[4].status === "fulfilled" ? results[4].value : 0;
			const availableZKEthMatic = results[5].status === "fulfilled" ? results[5].value : 0;
			const availableZKEthUSDC = results[6].status === "fulfilled" ? results[6].value : 0;

			const prices = results[7].status === "fulfilled" ? results[7].value : 0;

			const totalNdausOnAllAccounts = DataFormatHelper.getNdauFromNapu(Object.keys(ndauAccounts).map(key => ndauAccounts[key]).reduce((pv, cv) => pv += parseFloat(cv.balance), 0) || 0);

			const npay = getFormattedToken(availableNpay);
			const eth = getFormattedToken(availableEth, 18, prices?.['ethereum']?.usd || 1);
			const usdc = getFormattedToken(availableUSDC, 6)
			const matic = getFormattedToken(availableMatic, 18, prices?.['matic-network']?.usd || 1);
			const zkEth = getFormattedToken(availableZKEthMatic, 18, prices?.['ethereum']?.usd || 1);
			const zkUSDC = getFormattedToken(availableZKEthUSDC);

			const currentPriceOfNdauInUsd = parseFloat(totalNdausOnAllAccounts * NdauStore.getMarketPrice()).toFixed(4)
			setTokens([
				makeToken(0, { totalFunds: totalNdausOnAllAccounts, usdAmount: currentPriceOfNdauInUsd, accounts: getNDauAccounts().length }),
				makeToken(4, { totalFunds: zkEth.totalFunds, usdAmount: zkEth.usdAmount }),
				makeToken(1, { totalFunds: npay.totalFunds, usdAmount: npay.usdAmount }),
				// makeToken(5, { totalFunds: zkUSDC.totalFunds, usdAmount: zkUSDC.usdAmount }),
				makeToken(2, { totalFunds: eth.totalFunds, usdAmount: eth.usdAmount }),
				makeToken(3, { totalFunds: usdc.totalFunds, usdAmount: usdc.usdAmount }),
				makeToken(6, { totalFunds: matic.totalFunds, usdAmount: matic.usdAmount }),
			])
			setMainRefreshing(false);
		}).catch(err => {
			FlashNotification.show(err.message, true)
			setMainRefreshing(false);
		})

	}

	const loadOnlyNDAUBalances = () => {
		getNdauAccountsDetails().then(ndauAccounts => {
			const totalNdausOnAllAccounts = DataFormatHelper.getNdauFromNapu(Object.keys(ndauAccounts).map(key => ndauAccounts[key]).reduce((pv, cv) => pv += parseFloat(cv.balance), 0) || 0);
			const currentPriceOfNdauInUsd = parseFloat(totalNdausOnAllAccounts * NdauStore.getMarketPrice()).toFixed(4)
			setMainRefreshing(false);
			setTokens([
				makeToken(0, { totalFunds: totalNdausOnAllAccounts, accounts: getNDauAccounts().length, usdAmount: currentPriceOfNdauInUsd })
			])
		})
	}

	const refreshData = () => {
		OrderAPI.getMarketPrice().then(res => {
			NdauStore.setMarketPrice(res)
		})
		if (getActiveWallet().type) {
			setTokens([
				makeToken(0, { totalFunds: "l", accounts: getNDauAccounts().length, usdAmount: "l" }),
				makeToken(4, { totalFunds: "l", usdAmount: "l" }),
				makeToken(1, { totalFunds: "l", usdAmount: "l" }),
				// makeToken(5, { totalFunds: "l", usdAmount: "l" }),
				makeToken(2, { totalFunds: "l", usdAmount: "l" }),
				makeToken(3, { totalFunds: "l", usdAmount: "l" }),
				makeToken(6, { totalFunds: "l", usdAmount: "l" }),
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

	useEffect(() => {
		if (isFocused) refreshData();
	}, [isFocused])

	useEffect(() => {
		setSelected(0);
	}, [UserStore.getActiveWallet()])

	useEffect(() => {
		const availableAllUSDAmount = tokens.reduce((prevValue, initial) => prevValue += parseFloat(initial.usdAmount), 0) || 0;
		setTotalBalance(
			parseFloat(availableAllUSDAmount).toFixed(2)
		);
	}, [tokens])

	useEffect(() => {
		if (selected === 1) {
			setNFTLoading(true);
			getCollections().then(nftsList => {
				setNFTLoading(false);
				setNfts(nftsList);
			}).catch(err => {
				setNFTLoading(false);
				FlashNotification.show("NFT: " + err.message)
				console.log('err', JSON.stringify(err.message, null, 2));
			})
		} else {
			setNfts([])
		}
	}, [selected])

	const renderItem = useCallback(({ item, index }) => {
		if (selected == 0) return <Token {...item} index={index} onPress={() => handleNavigation(item)} />
		else if (selected == 1) return <NFT {...item} index={index} isLast={(nfts.length - 1) === index} onPress={() => navigation.navigate(ScreenNames.NFTList, { item })} />
	}, [tokens, nfts])

	const handleNavigation = useCallback((item) => {
		if (item.name === "NDAU") navigation.navigate(ScreenNames.AddNdauAccount, { item });
		else navigation.navigate(ScreenNames.ERCDetail, { item });
	}, [])

	return (
		<ScreenContainer tabScreen>
			<ScrollView
				refreshControl={
					<RefreshControl
						tintColor={themeColors.white}
						refreshing={mainRefreshing}
						onRefresh={() => {
							setMainRefreshing(true);
							refreshData();
						}}
					/>
				}
				showsVerticalScrollIndicator={false}>
				<DashboardHeader
					currentWalletName={walletData?.walletName}
					marketPrice={NdauStore.getMarketPrice()}
					totalBalance={totalBalance}
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
							ListEmptyComponent={nftLoading && nfts.length === 0 ? <ActivityIndicator /> : (
								<View style={styles.emptyNFT}>
									<CustomText color={themeColors.black300} titiliumBold>No NFT found in this account</CustomText>
								</View>
							)}
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
	emptyNFT: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20
	}
})

export default Dashboard;