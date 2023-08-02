import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";
import { themeColors } from "../config/colors";
import { images } from "../assets/images";

const Dashboard = () => {
	const navigation = useNavigation();

	return (
		<ScreenContainer tabScreen>
			<ScrollView>
				<View style={styles.container}>
					<Image source={images.DashboardHeaderBack} />
					<View style={styles.imageContainer}>
						<Image source={images.buySellLanding} />
					</View>
					<View style={styles.imageContainer}>
						<Image source={images.buySellLanding} />
					</View>
				</View>
				<View style={styles.height} />
			</ScrollView>
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
	height: { height: 100 }
})

export default Dashboard;