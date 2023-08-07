import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";

import PinHandler from "../components/PinHandler";
import ScreenContainer from "../components/Screen";
import MultiSafeHelper from "../helpers/MultiSafeHelper";
import UserStore from "../stores/UserStore";
import LogStore from "../stores/LogStore";
import UserData from "../model/UserData";
import Loading from "../components/Loading";
import { ScreenNames } from "./ScreenNames";
import FlashNotification from "../components/common/FlashNotification";
import Button from "../components/Button";

const Login = ({ }) => {

	const called = useRef(false);
	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);

	const checkingUser = async (passcode) => {
		called.current = true;
		try {
			let user = await MultiSafeHelper.getDefaultUser(passcode);
			if (user) {
				setLoading(true);
				UserStore.setUser(user);
				UserStore.setPassword(passcode);
				try {
					await UserData.loadUserData(user);
					setLoading(false);
					navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ScreenNames.TabNav }] }));
				} catch (error) {
					LogStore.log(error);
				}
			} else {
				setLoading(false);
			}
		} catch (error) {
			FlashNotification.show("Invalid passcode");
		}
	}

	const authenticating = (passcode) => {
		!called.current && checkingUser(passcode);
		setTimeout(() => {
			called.current = false;
		}, 500);
	}

	return (
		<ScreenContainer>
			{loading && <Loading label={'Connecting with blockchain...'} />}
			<View style={styles.center}>
				<PinHandler
					label={'Enter Passcode'}
					onPin={(pin) => authenticating(pin)}
				/>
			</View>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		// justifyContent: "center",
		alignItems: "center"
	}
})

export default Login;