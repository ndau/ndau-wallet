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

const Dashboard = ({ navigation }) => {

	const { getNDauAccounts, addAccountsInNdau, getActiveWallet, addLegacyWallet } = useWallet();

	const [walletData, setWalletData] = useState({ walletName: "" });
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

	const loadBalances = async () => {
		const { result: { ethusd } } = await EthersScanAPI.getEthPriceInUSD();
		const response = await EthersScanAPI.getAddressBalance("0xa6E9515688ff6801AEc13ad73f4aCd722829a5a4", EthersScanAPI.contractaddress.USDC);
		const { result } = response;
		console.log('result', JSON.stringify(response, null, 2));
		setTokens((_) => {
			const prev = [..._];
			const findIndex = prev.findIndex(token => token.name == "ETHEREUM")
			if (findIndex !== -1) {
				prev[findIndex].totalFunds = Converters.WEI_ETH(result)
				prev[findIndex].usdAmount = Converters.ETH_USD(Converters.WEI_ETH(result), ethusd)
			}
			return prev;
		})
	}

	useEffect(() => {
		// loadBalances();
		setWalletData({
			walletName: UserStore.getActiveWallet().walletId
		})
	}, [])

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
					currentWalletName={walletData?.walletName}
					marketPrice={currentPrice}
					totalBalance={totalBalance}
					accounts={accounts}
					onAddWallet={() => navigation.navigate(ScreenNames.IntroCreateWallet)}
					// onAddWallet={() => {
					// 	refAddWalletSheet.current.open()
					// }}
				/>
				<View style={styles.line} />

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

			<BottomSheetModal
				refRBSheet={refAddWalletSheet}
				setIsVisible={() => {
					refAddWalletSheet.current.close();
				}}
				height={Dimensions.get('window').height * 0.55}
			>
				<View>
					<View style={styles.modal}>
						<CustomText bold body>Wallet</CustomText>
						<TouchableOpacity onPress={() => {
							refAddWalletSheet.current.close();
						}}>
							<ArrowDownSVGComponent />
						</TouchableOpacity>
					</View>
					<Spacer height={12} />
					<View style={styles.divider} />
					<Spacer height={30} />

					<View style={styles.svgContainer}>
						<BlockChainWalletLogoSVGComponent />
					</View>
					<Spacer height={25} />
					<View style={styles.modalCardContainer}>
						{
							addWalletsData.map((item, index) => {
								return (
									<DashBoardBottomSheetCard
										key={index}
										rightSvg={item.svg}
										label={item.label}
										title={item.title}
										onPress={() => { }}
										onClose={() => {
											refAddWalletSheet.current.close();
										}}

									/>
								)
							})
						}
					</View>

				</View>

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
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: "#484848"
	},
	modal: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		width: Dimensions.get('window').width,
		justifyContent: 'space-between'
	},
	svgContainer: {
		alignSelf: 'center'
	},
	modalCardContainer: {
		paddingHorizontal: 16
	}

})

export default Dashboard;