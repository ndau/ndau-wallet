import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

import { themeColors } from "../../config/colors";
import CustomText from "../CustomText";
import Button from "../Button";
import { ndauUtils } from "../../utils";

const ApprovalModal = ({ onApprove, onReject }) => {

	const [isVisible, setIsVisible] = useState(false);
	const [fullData, setData] = useState({});
	const [loading, setLoading] = useState({
		isAcceptLoading: false,
		isRejectLoading: false
	});

	useEffect(() => {
		global.ApprovalModal = innerFunc
	}, [])

	const innerFunc = ({ show, data, loading }) => {
		if (data) setData(data);
		if (typeof show === "boolean") setIsVisible(show);
		if (typeof loading === "string") {
			setLoading({
				isAcceptLoading: loading === "accept",
				isRejectLoading: loading === "reject",
			});
		}
	}

	const renderDataField = ({ key, value }) => {
		return (
			<View style={[styles.row, { justifyContent: "space-between" }]}>
				<CustomText titiliumBold>{key}</CustomText>
				<CustomText titilium color={themeColors.black300}>{value}</CustomText>
			</View>
		)
	}

	const requester = useMemo(() => {
		const info = {
			icons: [],
			name: "",
			description: "",
			address: fullData?.account?.accountAddress,
			totalFunds: fullData?.account?.totalFunds || 0,
			usdAmount: fullData?.account?.usdAmount || 0
		};
		if (fullData?.params?.proposer?.metadata) {
			const { icons, name, description } = fullData?.params?.proposer?.metadata;
			info.icons = icons;
			info.name = name;
			info.description = description;
		}
		return info;
	}, [fullData])

	return (
		<Modal
			onBackdropPress={() => setIsVisible(false)}
			animationIn={'slideInUp'}
			style={styles.bottomModal}
			isVisible={isVisible}>
			<View style={styles.container}>
				<CustomText titiliumBold body>Approval</CustomText>
				<View style={styles.separator} />
				<View style={{ marginVertical: 20, justifyContent: "center", alignItems: "center" }}>
					<Image style={styles.image} source={{ uri: requester.icons?.[0] || requester.icons?.[1] }} />
					<CustomText titiliumBold h6 style={{ marginVertical: 20 }}>{requester.name}</CustomText>
					<CustomText titiliumBold caption>{requester.description}</CustomText>
				</View>

				<View style={styles.innerContainer}>
					<CustomText titiliumSemiBold body style={{ alignSelf: "flex-start", marginVertical: 10 }}>Request to access</CustomText>
					<View style={[styles.dataBox, { marginBottom: 20 }]}>
						{renderDataField({ key: "Account", value: ndauUtils.truncateAddress(requester.address) })}
						{renderDataField({ key: "Total Eth", value: parseFloat(requester.totalFunds || 0).toFixed(8) })}
						{renderDataField({ key: "USD", value: requester.usdAmount })}
					</View>
				</View>
				<View style={[styles.row, { marginBottom: 20 }]}>
					<Button
						loading={loading?.isRejectLoading}
						disabled={loading?.isAcceptLoading}
						onPress={onReject}
						label={'Reject'}
						buttonContainerStyle={styles.rejectButton} />
					<Button
						loading={loading?.isAcceptLoading}
						disabled={loading?.isRejectLoading}
						onPress={onApprove}
						label={'Approve'}
						buttonContainerStyle={styles.approveButton} />
				</View>
			</View>
		</Modal>
	)
}

export const ApprovalModalHandler = {
	show: ({ data }) => {
		global.ApprovalModal({ show: true, data })
	},
	hide: () => {
		global.ApprovalModal({ show: false, data: {} })
	},
	acceptLoading: (isLoading) => {
		global.ApprovalModal({ loading: isLoading ? "accept" : "" });
	},
	rejectLoading: (isLoading) => {
		global.ApprovalModal({ loading: isLoading ? "reject" : "" });
	},
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

export default ApprovalModal;