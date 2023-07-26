import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { terms } from "../config/termsPolicy";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";

const TermsPolicy = () => {
	return (
		<ScreenContainer>
			<ScrollView>
				<View style={styles.container}>
					<CustomText h6 semiBold titiliumSemiBold>Terms of Use</CustomText>
					<Spacer height={16} />
					<CustomText body titilium>{terms}</CustomText>
				</View>
			</ScrollView>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

export default TermsPolicy;