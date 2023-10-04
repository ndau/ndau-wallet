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
import { ScreenNames } from "./ScreenNames";

const LockPeriod = (props) => {
	const { item } = props?.route?.params ?? {};

	const modalRef = useRef();
	const modalLockRef = useRef();

	const [selectedPeriod, setSelectedPeriod] = useState({});
	const [lockPeriods, setLockPeriods] = useState([
		// { title: "3 Months", newBase: 6, bonus: 1 },
	])

	const HeaderRight = useCallback(() => {
		return (
			<TouchableOpacity onPress={() => modalRef.current(true)}>
				<View style={styles.headerRight}>
					<CustomText titilium body2>What is locking?</CustomText>
					<View style={{ transform: [{ scale: 0.8 }] }}>
						<InfoIcon />
					</View>
				</View>
			</TouchableOpacity>
		)
	}, [])

	useEffect(() => {
		getLockRates();
	}, [])

	const getLockRates = () => {
		AccountAPI.getLockRates(UserStore.getAccountDetail(item.address)).then(lockData => {
			const lockPeriods = ["90d", "180d", "1y", "2y", "3y"]
			const possibleLocks = lockData.map((data, index) => {
				const total = AccountAPIHelper.eaiValueForDisplay({ eaiValueForDisplay: data.eairate })
				const bonus = DataFormatHelper.lockBonusEAI(DateHelper.getDaysFromISODate(lockPeriods[index]))
				const base = total - bonus
				return {
					bonus,
					total,
					newBase: base,
					title: AppConstants.LOCK_ACCOUNT_POSSIBLE_TIMEFRAMES[data.address],
					lockISO: data.address
				}
			})
			setLockPeriods(possibleLocks);
		})
	}

	const openLink = () => {
		modalLockRef.current(false);
		Linking.openURL(AppConfig.TRANSACTION_FEE_KNOWLEDGEBASE_URL);
	}

	const navigateToEAIDestination = () => {
		modalLockRef.current(false);
		props.navigation.navigate(ScreenNames.EAIDestination, { selectedPeriod, item });
	}

	return (
		<ScreenContainer headerTitle=" " headerRight={<HeaderRight />}>
			<View style={styles.mainContainer}>
				<CustomText titilium style={styles.text1}>Choose your lock time and bonus rate.</CustomText>
				<Spacer height={16} />

				<View style={styles.row}>
					<View style={[styles.flex, { paddingLeft: 10 }]}>
						<CustomText titiliumSemiBold>Lock for</CustomText>
					</View>
					<View style={[styles.flex, styles.alignCenter]}>
						<CustomText titiliumSemiBold>New base</CustomText>
					</View>
					<View style={[styles.flex, styles.alignCenter]}>
						<CustomText titiliumSemiBold>Bonus</CustomText>
					</View>
					<View style={[styles.flex, styles.alignCenter]}>
						<CustomText titiliumSemiBold>Total</CustomText>
					</View>
				</View>
				<View style={styles.tableContainer}>
					{
						lockPeriods.map((item, index) => {
							return (
								<TouchableOpacity key={index} activeOpacity={0.8} onPress={() => setSelectedPeriod(item)}>
									<View style={[styles.optionContainer, styles.row, selectedPeriod.title === item.title && styles.selected]}>
										<View style={{ flex: 2 }}>
											<CustomText titilium>{item.title}</CustomText>
										</View>
										<View style={[styles.flex, styles.alignCenter]}>
											<CustomText titilium>{item.newBase}%</CustomText>
										</View>
										<View style={[styles.flex, styles.alignCenter]}>
											<CustomText titilium>+</CustomText>
										</View>
										<View style={[styles.flex, styles.alignCenter]}>
											<CustomText titilium>{item.bonus}%</CustomText>
										</View>
										<View style={[styles.flex, styles.alignCenter]}>
											<CustomText titilium>=</CustomText>
										</View>
										<View style={[styles.flex, styles.alignCenter]}>
											<CustomText titilium>{item.newBase + item.bonus}%</CustomText>
										</View>
									</View>
								</TouchableOpacity>
							)
						})
					}
				</View>
			</View>
			<Button
				disabled={!selectedPeriod?.title}
				label={'Confirm'}
				onPress={() => modalLockRef.current(true)}
			/>

			<CustomModal canIgnore bridge={modalRef}>
				<View style={styles.headerContainer}>
					<View style={styles.crossButton}>
						<TouchableOpacity onPress={() => modalRef.current(false)} style={{ padding: 10 }}>
							<CustomText h5>X</CustomText>
						</TouchableOpacity>
					</View>
					<View style={{ marginTop: 50, marginBottom: 30 }}>
						<InfoIcon
							color={themeColors.primary}
							height={100}
							width={100}
						/>
					</View>
					<CustomText titilium style={styles.modalText}>Locking is like staking your cryptocurrency to help verify transactions on the network and earn rewards. Once you stake your funds, they're locked up for a period of time and cannot be unlocked until the staking period is over</CustomText>
				</View>
			</CustomModal>

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
					onPress={navigateToEAIDestination}
				/>
				<Button
					textOnly
					label={'Cancel'}
					onPress={() => modalLockRef.current(false)}
					buttonContainerStyle={styles.cancelButton}
				/>
			</CustomModal>
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
})

export default LockPeriod;