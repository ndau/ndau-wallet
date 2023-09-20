import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { images } from "../assets/images";
import BottomSheetModal from "../components/BottomSheetModal";
import Button from "../components/Button";
import DashboardHeader from "../components/DashboardHeader";
import NFT from "../components/NFT";
import ScreenContainer from "../components/Screen";
import Token from "../components/Token";
import { themeColors } from "../config/colors";
import DataFormatHelper from "../helpers/DataFormatHelper";
import { Converters, EthersScanAPI, NetworkManager } from "../helpers/EthersScanAPI";
import { useNFTS, useWallet } from "../hooks";
import NdauStore from "../stores/NdauStore";
import UserStore from "../stores/UserStore";
import { tokenShortName } from "../utils";
import { ScreenNames } from "./ScreenNames";
import AddWalletsPopup from "./components/dashboard/AddWalletsPopup";
import OrderAPI from "../api/OrderAPI";
import CustomText from "../components/CustomText";
import FlashNotification from "../components/common/FlashNotification";

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

	const [tokens, setTokens] = useState([
		{ shortName: tokenShortName.NDAU, name: "NDAU", network: "nDau", totalFunds: "0", usdAmount: "0", image: images.nDau, accounts: getNDauAccounts().length },
		{ shortName: tokenShortName.NPAY, name: "NPAY (ERC20)", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.nPay },
		{ shortName: tokenShortName.ETHERERUM, name: "ETHEREUM", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.ethereum },
		{ shortName: tokenShortName.USDC, name: "USDC (ERC20)", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.USDC },
	]);

	const [nfts, setNfts] = useState([]);

	const makeToken = (type, { totalFunds, usdAmount, accounts, address }) => {
		const tokens = {
			0: { shortName: tokenShortName.NDAU, name: "NDAU", network: "nDau", totalFunds: "0", usdAmount: "0", image: images.nDau, accounts: getNDauAccounts().length },
			1: { shortName: tokenShortName.NPAY, name: "NPAY (ERC20)", network: "zkSync Era", totalFunds: "0", usdAmount: "0", image: images.nPay },
			2: { shortName: tokenShortName.ETHERERUM, name: "ETHEREUM", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.ethereum },
			3: { shortName: tokenShortName.USDC, name: "USDC (ERC20)", network: "ethereum", totalFunds: "0", usdAmount: "0", image: images.USDC },
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
			NetworkManager.getBalance(),
			NetworkManager.getContractFor(NetworkManager.Coins().USDC).getBalance(),
			getNdauAccountsDetails(),
			NetworkManager.getContractFor(NetworkManager.Coins().NPAY).getBalance()
		]).then(results => {

			// getting all results
			const availableEth = results[0].status === "fulfilled" ? results[0].value : 0;
			const availableUSDC = results[1].status === "fulfilled" ? results[1].value : 0;
			const ndauAccounts = results[2].status === "fulfilled" ? results[2].value : 0;
			const availableNpay = results[3].status === "fulfilled" ? results[3].value : 0;

			const totalNdausOnAllAccounts = DataFormatHelper.getNdauFromNapu(Object.keys(ndauAccounts).map(key => ndauAccounts[key]).reduce((pv, cv) => pv += parseFloat(cv.balance), 0) || 0);

			const npay = {
				totalFunds: parseFloat(ethers.utils.formatEther(availableNpay._hex || 0)),
				usdAmount: parseFloat(ethers.utils.formatEther(availableNpay._hex || 0))
			};

			const eth = {
				totalFunds: parseFloat(ethers.utils.formatEther(availableEth || 0)),
				usdAmount: Converters.ETH_USD(ethers.utils.formatEther(availableEth || 0), ethusd)
			};

			const usdc = {
				totalFunds: parseFloat(ethers.utils.formatUnits(availableUSDC, 6) || 0),
				usdAmount: parseFloat(ethers.utils.formatUnits(availableUSDC, 6) || 0)
			};

			const currentPriceOfNdauInUsd = parseFloat(totalNdausOnAllAccounts * NdauStore.getMarketPrice()).toFixed(4)
			setTokens([
				makeToken(0, { totalFunds: totalNdausOnAllAccounts, accounts: getNDauAccounts().length, usdAmount: currentPriceOfNdauInUsd }),
				makeToken(1, { totalFunds: npay.totalFunds, address: getActiveWallet().ercAddress, usdAmount: npay.usdAmount }),
				makeToken(2, { totalFunds: eth.totalFunds, address: getActiveWallet().ercAddress, usdAmount: eth.usdAmount }),
				makeToken(3, { totalFunds: usdc.totalFunds, address: getActiveWallet().ercAddress, usdAmount: usdc.usdAmount }),
			])
			setMainRefreshing(false);
		}).catch(err => {
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
			if (selected == 1) setSelected(0);

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
		})
		setWalletData({
			walletName: UserStore.getActiveWallet().walletId,
			type: UserStore.getActiveWallet().type
		})
	}

	useEffect(() => {
		if (isFocused) refreshData();
	}, [isFocused])

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