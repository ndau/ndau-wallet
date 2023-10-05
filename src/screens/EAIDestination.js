import React, { useCallback, useEffect, useRef, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

import { InfoIcon } from "../assets/svgs/components";
import CustomText from "../components/CustomText";
import CustomModal from "../components/Modal";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import Button from "../components/Button";
import AppConstants from "../AppConstants";
import AppConfig from "../AppConfig";
import AccountAPI from "../api/AccountAPI";
import UserStore from "../stores/UserStore";
import AccountAPIHelper from "../helpers/AccountAPIHelper";
import DataFormatHelper from "../helpers/DataFormatHelper";
import DateHelper from "../helpers/DateHelper";
import Loading from "../components/Loading";
import { useTransaction } from "../hooks";
import FlashNotification from "../components/common/FlashNotification";
import { ScreenNames } from "./ScreenNames";

const OPTIONS = {
	COMPOUND: 0,
	NEW_ACCOUNT: 1,
	CHOOSE_ACCOUNT: 2
}
const EAIDestination = (props) => {
	const { selectedPeriod, item, onlySetDestination } = props?.route?.params ?? {};
	const { setEAI, lockNDAUAccount } = useTransaction();

	const modalLockRef = useRef();
	const [loading, setLoading] = useState("");
	const [selectedOption, setSelectedOption] = useState(OPTIONS.COMPOUND);

	const openLink = () => {
		modalLockRef.current(false);
		Linking.openURL(AppConfig.TRANSACTION_FEE_KNOWLEDGEBASE_URL);
	}

	const RadioButton = ({ selected, text, onPress }) => {
		return (
			<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
				<View style={styles.radioContainer}>
					<View style={[styles.radio, selected && styles.radioSelected]} />
					<CustomText titilium>{text}</CustomText>
				</View>
			</TouchableOpacity>
		)
	}

	const handleOption = () => {
		if (selectedOption === OPTIONS.COMPOUND) {
			setLoading("Locking")
			if (onlySetDestination) {
				setEAI(item).then(res => {
					setLoading("")
					props.navigation.goBack();
				}).catch(err => {
					setLoading("")
					FlashNotification.show(err.message)
				})
			} else {
				lockNDAUAccount(item, selectedPeriod?.lockISO, item.address).then(res => {
					setLoading("")
					props.navigation.navigate(ScreenNames.NDAUDetail, { item });
				}).catch(err => {
					setLoading("")
					FlashNotification.show(err.message)
				})
			}
		} else if (selectedOption === OPTIONS.NEW_ACCOUNT) {
			props.navigation.navigate(ScreenNames.SelectNDAU, {
				item,
				onSelectAccount: (selectedAccount) => {
					if (onlySetDestination) {
						setLoading("Change EAI")
						setEAI(item, selectedAccount.address).then(res => {
							setLoading("")
							props.navigation.goBack();
						}).catch(err => {
							setLoading("")
							FlashNotification.show(err.message)
						})
					} else {
						setLoading("Locking")
						lockNDAUAccount(item, selectedPeriod?.lockISO, selectedAccount.address).then(res => {
							setLoading("")
							props.navigation.navigate(ScreenNames.NDAUDetail, { item });
						}).catch(err => {
							setLoading("")
							FlashNotification.show(err.message)
						})
					}
				},
				addAccount: true
			})
		} else if (selectedOption === OPTIONS.CHOOSE_ACCOUNT) {
			props.navigation.navigate(ScreenNames.SelectNDAU, {
				item,
				onSelectAccount: (selectedAccount) => {
					if (onlySetDestination) {
						setLoading("Change EAI")
						setEAI(item, selectedAccount.address).then(res => {
							setLoading("")
							props.navigation.goBack();
						}).catch(err => {
							setLoading("")
							FlashNotification.show(err.message)
						})
					} else {
						setLoading("Locking")
						lockNDAUAccount(item, selectedPeriod?.lockISO, selectedAccount.address).then(res => {
							setLoading("")
							props.navigation.navigate(ScreenNames.NDAUDetail, { item });
						}).catch(err => {
							setLoading("")
							FlashNotification.show(err.message)
						})
					}
				}
			})
		}
	}

	return (
		<ScreenContainer headerTitle="Set EAI Destination">
			<View style={styles.mainContainer}>
				<CustomText titiliumSemiBold style={styles.text1}>Where do you want to send the EAI from this account?</CustomText>
				<Spacer height={16} />
				<RadioButton text={`Compound to this account (${item?.name})`} selected={selectedOption == OPTIONS.COMPOUND} onPress={() => setSelectedOption(OPTIONS.COMPOUND)} />
				<RadioButton text={'Create new account'} selected={selectedOption == OPTIONS.NEW_ACCOUNT} onPress={() => setSelectedOption(OPTIONS.NEW_ACCOUNT)} />
				<RadioButton text={'Choose account on the next screen'} selected={selectedOption == OPTIONS.CHOOSE_ACCOUNT} onPress={() => setSelectedOption(OPTIONS.CHOOSE_ACCOUNT)} />
			</View>
			<Button
				label={'Continue'}
				onPress={handleOption}
			/>

			<CustomModal canIgnore bridge={modalLockRef}>
				<CustomText titiliumSemiBold h4 style={styles.modalText}>ndau lock fees</CustomText>
				<View style={styles.separator} />
				<View style={styles.headerContainer}>
					<CustomText titilium style={styles.modalText}>Transaction are subject to a small fee that supports the operation of the ndau network</CustomText>
					<View style={styles.feesContainer}>
						<View style={styles.rowSpaceBetween}>
							<CustomText titiliumSemiBold style={styles.textPara}>Lock Fee</CustomText>
							<CustomText titilium style={styles.textPara}>{`(${AppConstants.TRANSACTION_FEE} ndau)`}</CustomText>
						</View>
						<Spacer height={10} />
						<View style={styles.rowSpaceBetween}>
							<CustomText titiliumSemiBold style={styles.textPara}>Set Rewards Destination Fee*</CustomText>
							<CustomText titilium style={styles.textPara}>{`(${AppConstants.TRANSACTION_FEE} ndau)`}</CustomText>
						</View>
					</View>
					<CustomText titilium style={[styles.modalText, { marginBottom: 20 }]}>*Only if the user choose to have earned EAI sent to a different account</CustomText>
					<TouchableOpacity onPress={openLink}>
						<CustomText titiliumSemiBold caption style={[{ marginTop: 0, marginBottom: 20 }]}>Read more about fees</CustomText>
					</TouchableOpacity>
				</View>
				<Button
					label={'I Understand'}
					onPress={undefined}
				/>
				<Button
					textOnly
					label={'Cancel'}
					onPress={() => modalLockRef.current(false)}
					buttonContainerStyle={styles.cancelButton}
				/>
			</CustomModal>
			{!!loading && <Loading label={loading} />}
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	headerRight: {
		flexDirection: 'row',
		alignItems: "center"
	},
	mainContainer: {
		paddingVertical: 10,
		flex: 1
	},
	text1: {
		marginBottom: 10
	},
	headerContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	modalText: {
		textAlign: "center"
	},
	crossButton: {
		alignSelf: "baseline",
		position: "absolute",
		top: -20,
		left: -10
	},
	row: {
		flexDirection: "row",
		alignItems: "center"
	},
	flex: {
		flex: 1
	},
	tableContainer: {
		marginVertical: 10
	},
	optionContainer: {
		paddingLeft: 20,
		borderWidth: 1,
		borderColor: themeColors.primary,
		marginBottom: 14,
		borderRadius: 20,
		padding: 10
	},
	alignCenter: {
		alignItems: "center"
	},
	selected: {
		backgroundColor: themeColors.primary
	},
	separator: {
		borderBottomWidth: 1,
		borderColor: themeColors.black200,
		marginVertical: 20
	},
	feesContainer: {
		borderWidth: 1,
		borderColor: themeColors.white,
		borderRadius: 14,
		backgroundColor: themeColors.black300,
		padding: 10,
		width: "100%",
		marginVertical: 20,
		justifyContent: "center"
	},
	textPara: {
		textAlign: "center"
	},
	rowSpaceBetween: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center"
	},
	cancelButton: {
		marginTop: 7,
		borderWidth: 1,
		borderColor: themeColors.white
	},
	radioContainer: {
		paddingVertical: 10,
		flexDirection: "row",
		alignItems: "center"
	},
	radio: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: themeColors.white,
		marginRight: 10
	},
	radioSelected: {
		borderWidth: 4,
		backgroundColor: themeColors.primary
	},
})

export default EAIDestination;