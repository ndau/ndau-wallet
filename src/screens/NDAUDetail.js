import React, { useRef } from "react";
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import CopyAddressButton from "../components/CopyAddressButton";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import IconButton from "../components/IconButton";
import { Buy, Convert, Delete, DollarSign, EAI, Lock, Receive, Send, Swap, UnLocked } from "../assets/svgs/components";
import Spacer from "../components/Spacer";
import Button from "../components/Button";
import CustomModal from "../components/Modal";
import AppConstants from "../AppConstants";
import { ScreenNames } from "./ScreenNames";
import AppConfig from "../AppConfig";
import Clipboard from "@react-native-clipboard/clipboard";

const NDAUDetail = (props) => {
	const { item } = props?.route?.params ?? {};
	const customModalRef = useRef();

	const openLink = () => {
		customModalRef.current(false);
		Linking.openURL(AppConfig.TRANSACTION_FEE_KNOWLEDGEBASE_URL);
	}

	const navigateToSend = () => {
		customModalRef.current(false);
		setTimeout(() => props.navigation.navigate(ScreenNames.Send, { item }), 250);
	}

	const copyAddress = () => {
		Clipboard.setString(item.address);
	}

	const disableButton = item.totalFunds === null || item.totalFunds === undefined || parseFloat(item.totalFunds) <= 0

	return (
		<ScreenContainer headerTitle={item.name} headerRight={<CopyAddressButton onPress={copyAddress}/>}>
			<ScrollView>
				<View style={styles.headerContainer}>
					<Image style={styles.icon} source={item.image} />
					<CustomText semiBold h4 style={styles.balance}>{item.totalFunds || "0.00"}</CustomText>

					<View style={styles.buttonContainer}>
						<View style={styles.row}>
							<IconButton label="Buy" icon={<Buy />} />
							<IconButton disabled={disableButton} label="Send" icon={<Send />} onPress={() => customModalRef.current(true)} />
							<IconButton label="Receive" icon={<Receive />} />
						</View>
						<View style={styles.row}>
							<IconButton disabled={disableButton} label="Convert" icon={<Convert />} />
							<IconButton disabled={disableButton} label="Lock" icon={<Lock />} />
						</View>
					</View>
					<View style={styles.infoContainer}>
						<CustomText titiliumSemiBold body>Account Status</CustomText>
						<View style={styles.separator} />
						<View style={styles.row}>
							{false ? <Lock /> : <UnLocked />}
							<CustomText style={styles.margin} titilium>Unlocked</CustomText>
						</View>
						<Spacer height={6} />
						<View style={styles.row}>
							<DollarSign />
							<CustomText style={styles.margin} titilium>0.0000</CustomText>
						</View>
						<View style={[styles.row, { marginTop: 20, justifyContent: "space-between" }]}>
							<CustomText style={styles.margin} titilium>0% Annualized Incentive (EAI)</CustomText>
							<Button
								caption
								rightIcon={<EAI />}
								label={'Set EAI destination  '}
								buttonContainerStyle={styles.smallButton}
							/>
						</View>
						<View style={styles.separator} />
						<View style={[styles.row, { marginTop: 20, justifyContent: "space-between" }]}>
							<CustomText style={styles.margin} titilium>Weighted average age (WAA)</CustomText>
							<CustomText style={styles.margin} titilium>0 Days</CustomText>
						</View>
					</View>
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
			<Button
				label={'View Transaction'}
			/>
			<Button
				label={'Remove Account'}
				iconLeft={<Delete />}
				buttonContainerStyle={styles.removeButton}
			/>
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
		margin: 20
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