import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import IntroCreateAccount from './screens/IntroCreateAccount';
import CreateAccount from './screens/CreateAccount';

import { ScreenNames } from './screens/ScreenNames';

const ScreenOptions = { headerShown: false }

const Stack = createStackNavigator();
const MainStack = () => {
	return (
		<Stack.Navigator screenOptions={ScreenOptions}>
			<Stack.Screen name={ScreenNames.IntroCreateAccount} component={IntroCreateAccount} />
			<Stack.Screen name={ScreenNames.CreateAccount} component={CreateAccount} />
		</Stack.Navigator>
	)
}

const Main = () => {
	return (
		<NavigationContainer>
			<MainStack />
		</NavigationContainer>
	)
}

export default Main;
