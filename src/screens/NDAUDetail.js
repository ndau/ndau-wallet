import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import CopyAddressButton from "../components/CopyAddressButton";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import IconButton from "../components/IconButton";
import { Buy, Clock, Convert, Delete, DollarSign, EAI, Exclamation, Lock, Receive, Send, Swap, UnLocked } from "../assets/svgs/components";
import Spacer from "../components/Spacer";
import Button from "../components/Button";
import CustomModal from "../components/Modal";
import AppConstants from "../AppConstants";
import { ScreenNames } from "./ScreenNames";
import AppConfig from "../AppConfig";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTransaction, useWallet } from "../hooks";
import DateHelper from "../helpers/DateHelper";
import AccountAPIHelper from "../helpers/AccountAPIHelper";
import DataFormatHelper from "../helpers/DataFormatHelper";
import NdauNumber from "../helpers/NdauNumber";
import { ndauUtils } from "../utils";
import UserStore from "../stores/UserStore";
import Loading from "../components/Loading";
import AccountAPI from "../api/AccountAPI";
import { useIsFocused } from "@react-navigation/native";
import FlashNotification from "../components/common/FlashNotification";

const NDAUDetail = (props) => {

	const { item } = props?.route?.params ?? {};
	const customModalRef = useRef();
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState("");
	const { getNdauAccountDetail, removeAccount } = useWallet();
	const { notifyForNDAU } = useTransaction();

	const [accountInfo, setAccountInfo] = useState({
		isLocked: false,
		unlocksOn: "",
		waaDays: 0,
		spendableNdau: 0,
		receivingEAIFrom: 0,
		eaiValueForDisplay: 0,
		baseEAI: 0,
		lockBonusEAI: 0,
		sendingEAITo: 0,
	})

	useEffect(() => {
		if (isFocused) {
			setLoading("Please wait")

			getNdauAccountDetail(item.address).then(res => {
				const addressData = res[item.address] || {};

				if (addressData.incomingRewardsFrom?.length && !addressData.incomingRewardsFromNickname) {
					addressData.incomingRewardsFromNickname = UserStore.getAccountDetail(addressData.incomingRewardsFrom)?.addressData?.nickname
				} else if (addressData.incomingRewardsFrom?.length == 0) {
					addressData.incomingRewardsFromNickname = null;
				}

				if (addressData.rewardsTarget && !addressData.rewardsTargetNickname) {
					addressData.rewardsTargetNickname = UserStore.getAccountDetail(addressData.rewardsTarget)?.addressData?.nickname
				} else if (addressData.rewardsTarget == null) {
					addressData.rewardsTargetNickname = null;
				}

				AccountAPI.getLockRates(UserStore.getAccountDetail(item.address)).then(lockData => {
					const notificePeriod = addressData.lock?.noticePeriod;
					if (notificePeriod) {
						const obj = lockData.filter(i => i.address === notificePeriod);
						if (obj.length) {
							addressData.eaiValueForDisplay = obj[0].eairate
						}
					}
					setAccountInfo(prev => {
						const _ = { ...prev }

						const eaiValueForDisplay = AccountAPIHelper.eaiValueForDisplay(addressData)
						const sendingEAITo = AccountAPIHelper.sendingEAITo(addressData)
						const receivingEAIFrom = AccountAPIHelper.receivingEAIFrom(addressData)
						const isAccountLocked = AccountAPIHelper.isAccountLocked(addressData)
						const accountLockedUntil = AccountAPIHelper.accountLockedUntil(addressData)
						const weightedAverageAgeInDays = AccountAPIHelper.weightedAverageAgeInDays(addressData)
						const lockBonusEAI = DataFormatHelper.lockBonusEAI(DateHelper.getDaysFromISODate(addressData.lock ? addressData.lock.noticePeriod : 0))
						const baseEAI = eaiValueForDisplay - lockBonusEAI
						let spendableNdau = 0
						if (!isAccountLocked) spendableNdau = AccountAPIHelper.spendableNdau(addressData, true, AppConfig.NDAU_DETAIL_PRECISION)

						const showAllAcctButtons = !isAccountLocked && spendableNdau > 0
						const spendableNdauDisplayed = new NdauNumber(spendableNdau).toDetail()

						_.isLocked = isAccountLocked;
						_.unlocksOn = accountLockedUntil;
						_.receivingEAIFrom = receivingEAIFrom;
						_.spendableNdau = spendableNdauDisplayed;
						_.eaiValueForDisplay = eaiValueForDisplay; // annualized inncentive
						_.waaDays = weightedAverageAgeInDays;
						_.baseEAI = baseEAI; // current eai based on waa
						_.lockBonusEAI = lockBonusEAI; // lock bonus
						_.sendingEAITo = ndauUtils.truncateAddress(sendingEAITo) // being sent to

						setLoading("")
						return _;
					})
				})

			})
		}
	}, [isFocused])

	const launchBuyNdauInBrowser = async () => {
		const url = AppConfig.BUY_NDAU_URL;
	
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


	const openLink = () => {
		customModalRef.current(false);
		Linking.openURL(AppConfig.TRANSACTION_FEE_KNOWLEDGEBASE_URL);
	}

	const navigateToSend = () => {
		customModalRef.current(false);
		setTimeout(() => props.navigation.navigate(ScreenNames.Send, { item }), 250);
	}

	const navigateToTransaction = () => {
		props.navigation.navigate(ScreenNames.Transactions, { item })
	}

	const copyAddress = () => {
		Clipboard.setString(item.address);
	}

	const handleNotify = () => {
		setLoading("Starting...")
		notifyForNDAU(UserStore.getAccountDetail(item.address)).then(res => {
			setLoading("")
		}).catch(err => {
			setLoading("")
		})
	}

	const confirm = (onYes) => {
		Alert.alert(
			'Delete account',
			'Are you sure that you want to delete the account?',
			[
				{ text: "Yes", onPress: onYes },
				{ text: "No", onPress: () => null },
			]
		)
	}

	const disableButton = item.totalFunds === null || item.totalFunds === undefined || parseFloat(item.totalFunds) <= 0
	const canRecieve = accountInfo.unlocksOn == null;



	return (
		<ScreenContainer headerTitle={item.name} headerRight={canRecieve && <CopyAddressButton onPress={copyAddress} />}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.headerContainer}>
					<Image style={styles.icon} source={item.image} />
					<CustomText titilium body style={{ marginTop: 20, marginBottom: 4 }}>{"Balance"}</CustomText>
					<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
						<CustomText semiBold h4>{`${(item.totalFunds || "0.00")}`}</CustomText>
						<CustomText titilium body>{` ~ $${parseFloat(item.usdAmount)?.toFixed(2) || "0"}`}</CustomText>
					</View>

					<View style={styles.buttonContainer}>
						<View style={styles.row}>
							<IconButton disabled={accountInfo.isLocked} label="Buy" icon={<Buy />} onPress={launchBuyNdauInBrowser} />
							<IconButton disabled={accountInfo.isLocked || disableButton} label="Send" icon={<Send />} onPress={() => customModalRef.current(true)} />
							<IconButton disabled={!canRecieve} label="Receive" icon={<Receive />} onPress={() => props.navigation.navigate(ScreenNames.Receive, { address: item.address,tokenName:item.tokenName })} />
						</View>
						<View style={styles.row}>
							<IconButton disabled={accountInfo.isLocked || disableButton} label="Convert" icon={<Convert />} />
							<IconButton disabled={accountInfo.isLocked || disableButton} label="Lock" icon={<Lock />} onPress={() => props.navigation.navigate(ScreenNames.LockPeriod, { item })} />
						</View>
					</View>
					<View style={styles.infoContainer}>
						<CustomText titiliumSemiBold body>Account Status</CustomText>
						<View style={styles.separator} />
						<View style={styles.row}>
							{accountInfo.isLocked ? <Lock /> : <UnLocked />}
							<CustomText style={styles.margin} titilium>{accountInfo.isLocked ? "Locked" : "UnLocked"}</CustomText>
						</View>
						{
							accountInfo.isLocked ? (
								<>
									<Spacer height={6} />
									<View style={styles.row}>
										<Exclamation />
										<CustomText style={styles.margin} titilium>You cannot send or receive</CustomText>
									</View>
									<Spacer height={6} />
									<View style={styles.row}>
										<Clock />
										<CustomText style={styles.margin} titilium>Will unlock on {accountInfo.unlocksOn}</CustomText>
									</View>
								</>
							) : null
						}
						<Spacer height={6} />
						<View style={styles.row}>
							<DollarSign />
							<CustomText style={styles.margin} titilium>{accountInfo.spendableNdau}</CustomText>
							<CustomText style={styles.margin} color={themeColors.success} titilium>Spendable</CustomText>
						</View>
						<View style={[styles.row, { marginTop: 20, justifyContent: "space-between" }]}>
							<CustomText style={styles.margin} titilium>{`${accountInfo.eaiValueForDisplay}% Annualized Incentive (EAI)`}</CustomText>
							<Button
								caption
								rightIcon={<EAI />}
								label={'Set EAI destination  '}
								buttonDisabledTextColor={themeColors.white}
								disabled={item.totalFunds === undefined || parseFloat(item.totalFunds) <= 0}
								buttonDisabledBG={themeColors.black300}
								buttonContainerStyle={styles.smallButton}
								onPress={() => props.navigation.navigate(ScreenNames.EAIDestination, { item, onlySetDestination: true })}
							/>
						</View>
						<View style={styles.separator} />

						<View style={[styles.row, { marginTop: 0, justifyContent: "space-between" }]}>
							<CustomText style={styles.margin} titilium>Weighted average age (WAA)</CustomText>
							<CustomText style={styles.margin} titilium>{accountInfo.waaDays} Days</CustomText>
						</View>

						<View style={[styles.row, { marginTop: 15, justifyContent: "space-between" }]}>
							<CustomText style={styles.margin} titilium>Current EAI based on WAA</CustomText>
							<CustomText style={styles.margin} titilium>{accountInfo.baseEAI}%</CustomText>
						</View>

						<View style={[styles.row, { marginTop: 15, justifyContent: "space-between" }]}>
							<CustomText style={styles.margin} titilium>Lock Bonus EAI</CustomText>
							<CustomText style={styles.margin} titilium>{accountInfo.lockBonusEAI}%</CustomText>
						</View>
						{
							!!accountInfo.sendingEAITo && (
								<View style={[styles.row, { marginTop: 15, justifyContent: "space-between" }]}>
									<CustomText style={styles.margin} titilium>EAI being sent to: </CustomText>
									<CustomText style={styles.margin} titilium>{accountInfo.sendingEAITo}</CustomText>
								</View>
							)
						}
					</View>
					<Spacer height={100} />
				</View>
			</ScrollView>
			<CustomModal bridge={customModalRef}>
				<View style={styles.innerModalContainer}>
					<Image style={styles.icon} source={item.image} />
					<CustomText titiliumSemiBold h5 style={{ marginVertical: 6 }}>NDAU TRANSFER FEE</CustomText>
					<View style={styles.separator} />
					<CustomText titilium style={styles.textPara}>Transaction are subject to a small fee that supports the operations of the ndau network</CustomText>
					<View style={styles.transferFeeContainer}>
						<CustomText titiliumSemiBold style={styles.textPara}>Transfer Fee</CustomText>
						<CustomText titiliumSemiBold style={styles.textPara}>{`(${AppConstants.TRANSACTION_FEE} ndau)`}</CustomText>
					</View>
					<TouchableOpacity onPress={openLink}>
						<CustomText titilium caption style={[{ marginTop: 0, marginBottom: 10 }]}>Read more about fees</CustomText>
					</TouchableOpacity>
				</View>
				<Button
					label={'I Understand'}
					onPress={navigateToSend}
				/>
				<Button
					textOnly
					label={'Cancel'}
					onPress={() => customModalRef.current(false)}
					buttonContainerStyle={styles.cancelButton}
				/>
			</CustomModal>
			{
				accountInfo.isLocked && accountInfo.unlocksOn === null && (
					<Button
						onPress={handleNotify}
						label={'Start Count down timer'}
						buttonContainerStyle={{ marginBottom: 10 }}
					/>
				)
			}
			<Button
				label={'View Transaction'}
				onPress={navigateToTransaction}
			/>
			<Button
				label={'Remove Account'}
				iconLeft={<Delete />}
				buttonContainerStyle={styles.removeButton}
				onPress={() => {
					confirm(() => {
						setLoading("Deleting");
						removeAccount(item.address).then(res => {
							setLoading("");
							props.navigation.goBack();
						}).catch(err => {
							setLoading("");
							FlashNotification.show(err.message);
						})
					})
				}}
			/>
			{loading && <Loading label={loading} />}
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
		flex: 1,
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
		flexDirection: "row",
		alignItems: "center"
	},
	balance: {
		margin: 20,
		marginTop: 0,
	},
	infoContainer: {
		width: "100%",
		marginTop: 20
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: themeColors.black300,
		width: "100%",
		marginVertical: 10,
		marginBottom: 20
	},
	margin: {
		marginHorizontal: 4
	},
	smallButton: {
		height: undefined,
		padding: undefined,
		paddingVertical: 6,
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center"
	},
	removeButton: {
		marginTop: 10,
		backgroundColor: themeColors.error500,
		flexDirection: "row",
		alignItems: "center"
	},
	cancelButton: {
		marginTop: 7,
		borderWidth: 1,
		borderColor: themeColors.white
	},
	innerModalContainer: {
		paddingVertical: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	textPara: {
		marginVertical: 6,
		textAlign: "center"
	},
	transferFeeContainer: {
		padding: 10,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: themeColors.white,
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		marginVertical: 20,
		justifyContent: "space-between",
		backgroundColor: themeColors.black300
	}
})

export default NDAUDetail;