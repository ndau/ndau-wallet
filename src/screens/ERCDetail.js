import React from "react";
import { Image, StyleSheet, View } from "react-native";

import CopyAddressButton from "../components/CopyAddressButton";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { themeColors } from "../config/colors";
import IconButton from "../components/IconButton";
import { Buy, Receive, Send } from "../assets/svgs/components";

const ERCDetail = (props) => {
	const { item } = props?.route?.params ?? {};

	return (
		<ScreenContainer headerTitle={item.name} headerRight={<CopyAddressButton />}>
			<View style={styles.headerContainer}>
				<Image style={styles.icon} source={item.image} />
				<CustomText semiBold h4 style={styles.balance}>{item.balance || "0.00"}</CustomText>

				<View style={styles.buttonContainer}>
					<View style={styles.row}>
						<IconButton label="Buy" icon={<Buy />} />
						<IconButton label="Send" icon={<Send />} />
						<IconButton label="Receive" icon={<Receive />} />
					</View>
				</View>
			</View>
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
		padding: 10,
		justifyContent: "center",
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
		flexDirection: "row"
	},
	balance: {
		margin: 20
	}
})

export default ERCDetail;