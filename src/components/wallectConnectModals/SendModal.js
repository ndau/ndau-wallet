import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

import { themeColors } from "../../config/colors";
import CustomModal from "../Modal";
import CustomText from "../CustomText";
import Button from "../Button";
import { ethers } from "ethers";
import { EIP155_CHAINS, ndauUtils } from "../../utils";
import { signClient } from "../../hooks/useWalletConnect";
import { approveEIP155Request, rejectEIP155Request } from "../../EIPHelper";
import FlashNotification from "../common/FlashNotification";

const SendModal = ({ }) => {

	const [isVisible, setIsVisible] = useState(false);
	const [fullData, setData] = useState({});
	const [verifier, setVerifier] = useState({});
	const [requestSession, setRequestSession] = useState({});

	useEffect(() => {
		global.sendModal = innerFunc
	}, [])

	const innerFunc = ({ show, data }) => {
		setData(data);
		if (data?.verifyContext?.verified) {
			setVerifier(data?.verifyContext?.verified)
		}
		if (data?.requestSession) {
			setRequestSession(data.requestSession);
		}
		if (typeof show === "boolean") setIsVisible(show);
	}

	const requesterInfo = useMemo(() => {
		const { name, icons } = requestSession?.peer?.metadata || { icon: [], name: "" };
		return {
			icon: icons?.[0] || icons?.[1],
			name
		}
	}, [requestSession])

	const requestInfo = useMemo(() => {
		const { request, chainId } = fullData?.params || {};
		const { params, method } = request || {};
		const { gas, value, from, to, data } = params?.[0] || {};
		return {
			chainId,
			chain: EIP155_CHAINS[chainId],
			method,
			gas: ethers.utils.formatEther(gas || "0x0"),
			value: ethers.utils.formatEther(value || "0x0"),
			from: ndauUtils.truncateAddress(from),
			to: ndauUtils.truncateAddress(to),
			data
		}
	}, [fullData]);

	const approve = async () => {
		try {
			const response = await approveEIP155Request(fullData)
			await signClient.respond({ topic: fullData.topic, response });
			setIsVisible(false);
		} catch (e) {
			FlashNotification.show(e.message);
		}
	}

	const reject = () => {
		const response = rejectEIP155Request(fullData)
		signClient.respond({
			topic: fullData.topic,
			response
		}).then(res => {
			setIsVisible(false);
		}).catch(err => {
			setIsVisible(false);
		})
	}

	renderDataField = ({ key, value }) => {
		return (
			<View style={[styles.row, { justifyContent: "space-between" }]}>
				<CustomText titiliumBold>{key}</CustomText>
				<CustomText titilium color={themeColors.black300}>{value}</CustomText>
			</View>
		)
	}

	return (
		<Modal
			onBackdropPress={() => setIsVisible(false)}
			animationIn={'slideInUp'}
			style={styles.bottomModal}
			isVisible={isVisible}>
			<View style={styles.container}>
				<CustomText titiliumBold body>Send Transaction</CustomText>
				<View style={styles.separator} />
				<ScrollView>
					<View style={styles.innerContainer}>
						<Image source={{ uri: requesterInfo.icon }} style={styles.image} />
						<CustomText titiliumSemiBold h6 style={{ marginVertical: 5, marginBottom: 20 }} >{requesterInfo.name}</CustomText>
						<View style={styles.dataBox}>
							{renderDataField({ key: "From", value: requestInfo.from })}
							{renderDataField({ key: "To", value: requestInfo.to })}
							{renderDataField({ key: "Estimated Gas", value: requestInfo.gas })}
							{renderDataField({ key: "Value", value: requestInfo.value })}
						</View>
						<CustomText titiliumSemiBold body style={{ alignSelf: "flex-start", marginVertical: 10 }}>Request Information</CustomText>
						<View style={[styles.dataBox, { marginBottom: 20 }]}>
							{renderDataField({ key: "Chain", value: requestInfo.chain?.name || "" })}
							{renderDataField({ key: "Method", value: requestInfo.method || "" })}
						</View>
					</View>
				</ScrollView>
				<View style={[styles.row, { marginBottom: 20 }]}>
					<Button onPress={reject} label={'Reject'} buttonContainerStyle={styles.rejectButton} />
					<Button onPress={approve} label={'Approve'} buttonContainerStyle={styles.approveButton} />
				</View>
			</View>
		</Modal>
	)
}

export const sendModalHandler = {
	show: ({ data }) => {
		global.sendModal({ show: true, data })
	}
}


const styles = StyleSheet.create({
	container: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.black300,
		borderBottomWidth: 0,
		backgroundColor: themeColors.black600,
		margin: 0,
		padding: 20,
		borderRadius: 20,
		maxHeight: "80%"
	},
	bottomModal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: themeColors.black300,
		marginVertical: 10
	},
	innerContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10
	},
	image: {
		height: 70,
		width: 70
	},
	row: {
		flexDirection: "row",
		alignItems: "center"
	},
	rejectButton: {
		flex: 1,
		marginRight: 10,
		backgroundColor: themeColors.dangerFlashBackground
	},
	approveButton: {
		flex: 1,
		backgroundColor: themeColors.success300
	},
	dataBox: {
		borderWidth: 1,
		borderColor: themeColors.black300,
		padding: 10,
		width: "100%",
		borderRadius: 10
	}
})

export default SendModal;