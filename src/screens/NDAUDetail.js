import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import CopyAddressButton from "../components/CopyAddressButton";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import IconButton from "../components/IconButton";
import { Buy, Convert, Delete, DollarSign, EAI, Lock, Receive, Send, Swap, UnLocked } from "../assets/svgs/components";
import Spacer from "../components/Spacer";
import Button from "../components/Button";

const NDAUDetail = (props) => {
	const { item } = props?.route?.params ?? {};

	return (
		<ScreenContainer headerTitle={item.name} headerRight={<CopyAddressButton />}>
			<ScrollView>
				<View style={styles.headerContainer}>
					<Image style={styles.icon} source={item.image} />
					<CustomText semiBold h4 style={styles.balance}>{item.balance || "0.00"}</CustomText>

					<View style={styles.buttonContainer}>
						<View style={styles.row}>
							<IconButton label="Buy" icon={<Buy />} />
							<IconButton label="Send" icon={<Send />} />
							<IconButton label="Receive" icon={<Receive />} />
						</View>
						<View style={styles.row}>
							<IconButton label="Swap" icon={<Swap />} />
							<IconButton label="Convert" icon={<Convert />} />
							<IconButton label="Lock" icon={<Lock />} />
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
	}
})

export default NDAUDetail;