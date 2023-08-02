import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ScreenNames } from './screens/ScreenNames';
import IntroCreateAccount from './screens/IntroCreateAccount';
import CreateAccount from './screens/CreateAccount';
import CreateWallet from './screens/CreateWallet';
import IntroCreateWallet from './screens/IntroCreateWallet';
import TermsPolicy from './screens/TermsPolicy';
import CreateWalletStarted from './screens/CreateWalletStarted';
import SeedPhrase from './screens/SeedPhrase';
import ImportWallet from './screens/ImportWallet';
import ImportMultiCoinWallet from './screens/ImportMultiCoinWallet';
import ImportClassicWallet from './screens/ImportClassicWallet';
import SplashScreen from "react-native-splash-screen";
import ProtectWallet from "./screens/ProtectWallet";
import Dashboard from "./screens/Dashboard";
import DApps from "./screens/DApps";
import Notifications from "./screens/Notifications";
import Setting from "./screens/Setting";
import { StyleSheet, View } from "react-native";
import { themeColors } from "./config/colors";
import CustomTabBar from "./components/CustomTabBar";


const ScreenOptions = { headerShown: false };

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={ScreenOptions}>
      <Tab.Screen
        name={ScreenNames.Dashboard}
        component={Dashboard} />
      <Tab.Screen
        name={ScreenNames.DApps}
        component={DApps} />
      <Tab.Screen
        name={ScreenNames.Notifications}
        component={Notifications} />
      <Tab.Screen
        name={ScreenNames.Setting}
        component={Setting} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
const MainStack = () => {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  return (
    <Stack.Navigator screenOptions={ScreenOptions}>

      <Stack.Screen name={ScreenNames.TabNav} component={MainTabs} />
      {/* <Stack.Screen name={ScreenNames.IntroCreateAccount} component={IntroCreateAccount} />
      <Stack.Screen name={ScreenNames.CreateAccount} component={CreateAccount} /> */}

      <Stack.Screen name={ScreenNames.IntroCreateWallet} component={IntroCreateWallet} />
      <Stack.Screen name={ScreenNames.CreateWallet} component={CreateWallet} />
      <Stack.Screen name={ScreenNames.CreateWalletStarted} component={CreateWalletStarted} />
      <Stack.Screen name={ScreenNames.SeedPhrase} component={SeedPhrase} />
      <Stack.Screen name={ScreenNames.TermsPolicy} component={TermsPolicy} options={{ presentation: "modal", cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
      <Stack.Screen name={ScreenNames.ImportWallet} component={ImportWallet} />
      <Stack.Screen name={ScreenNames.ImportMultiCoinWallet} component={ImportMultiCoinWallet} />
      <Stack.Screen name={ScreenNames.ImportClassicWallet} component={ImportClassicWallet} />
      <Stack.Screen name={ScreenNames.ProtectWallet} component={ProtectWallet} />
    </Stack.Navigator>
  )
}

const Main = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default Main;
