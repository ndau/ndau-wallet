import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import IntroCreateAccount from "./screens/IntroCreateAccount";
import CreateAccount from "./screens/CreateAccount";

import { ScreenNames } from "./screens/ScreenNames";
import SplashScreen from "react-native-splash-screen";

const ScreenOptions = { headerShown: false };

const Stack = createStackNavigator();
const MainStack = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  return (
    <Stack.Navigator screenOptions={ScreenOptions}>
      <Stack.Screen
        name={ScreenNames.IntroCreateAccount}
        component={IntroCreateAccount}
      />
      <Stack.Screen
        name={ScreenNames.CreateAccount}
        component={CreateAccount}
      />
    </Stack.Navigator>
  );
};

const Main = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default Main;
