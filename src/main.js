import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import SplashScreen from "react-native-splash-screen";

import CustomTabBar from "./components/CustomTabBar";
import CreateWallet from './screens/CreateWallet';
import CreateWalletStarted from './screens/CreateWalletStarted';
import DApps from "./screens/DApps";
import Dashboard from "./screens/Dashboard";
import ImportClassicWallet from './screens/ImportClassicWallet';
import ImportMultiCoinWallet from './screens/ImportMultiCoinWallet';
import ImportWallet from './screens/ImportWallet';
import IntroCreateWallet from './screens/IntroCreateWallet';
import Notifications from "./screens/Notifications";
import ProtectWallet from "./screens/ProtectWallet";
import { ScreenNames } from './screens/ScreenNames';
import SeedPhrase from './screens/SeedPhrase';
import Setting from "./screens/Setting";
import TermsPolicy from './screens/TermsPolicy';
import store from './redux/store';
import AuthLoading from './screens/AuthLoading';


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

      {/* <Stack.Screen name={ScreenNames.IntroCreateAccount} component={IntroCreateAccount} />
      <Stack.Screen name={ScreenNames.CreateAccount} component={CreateAccount} /> */}

      <Stack.Screen name={ScreenNames.AuthLoading} component={AuthLoading} />
      <Stack.Screen name={ScreenNames.IntroCreateWallet} component={IntroCreateWallet} />
      <Stack.Screen name={ScreenNames.CreateWallet} component={CreateWallet} />
      <Stack.Screen name={ScreenNames.CreateWalletStarted} component={CreateWalletStarted} />
      <Stack.Screen name={ScreenNames.SeedPhrase} component={SeedPhrase} />
      <Stack.Screen name={ScreenNames.TermsPolicy} component={TermsPolicy} options={{ presentation: "modal", cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
      <Stack.Screen name={ScreenNames.ImportWallet} component={ImportWallet} />
      <Stack.Screen name={ScreenNames.ImportMultiCoinWallet} component={ImportMultiCoinWallet} />
      <Stack.Screen name={ScreenNames.ImportClassicWallet} component={ImportClassicWallet} />
      <Stack.Screen name={ScreenNames.ProtectWallet} component={ProtectWallet} />
      <Stack.Screen name={ScreenNames.TabNav} component={MainTabs} />
    </Stack.Navigator>
  )
}

const Main = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
};

export default Main;
