import React from "react";
import { StyleSheet, View } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import StateButton from "./StateButton";
import { Copy } from "../assets/svgs/components";

const CopyAddressButton = ({ onPress,label,customStyles }) => {
	return (
		<StateButton
			resetToPrevious
			onButtonPress={onPress}
			states={[
				(
					<View style={[styles.buttonCopy,customStyles]}>
						<CustomText titiliumSemiBolds body2 style={{ marginRight: 6 }}>{label || "Address"}</CustomText>
						<Copy />
					</View>
				),
				(
					<View style={styles.buttonCopied}>
						<CustomText titiliumSemiBolds body2 style={{ marginRight: 6 }}>Copied</CustomText>
					</View>
				)
			]}
		/>
	)
}

const styles = StyleSheet.create({
	buttonCopy: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 33,
		width: 100,
		borderWidth: 1,
		borderRadius: 20,
		borderColor: themeColors.white
	},
	buttonCopied: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 33,
		width: 100,
		borderWidth: 1,
		borderRadius: 20,
		backgroundColor: themeColors.primary
	},
})

export default CopyAddressButton;