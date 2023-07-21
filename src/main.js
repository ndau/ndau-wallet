import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthLoading from './screens/AuthLoading';

const ScreenOptions = { headerShown: false }

const Stack = createStackNavigator();
const MainStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name='CreateUser' component={AuthLoading} options={ScreenOptions} />
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
