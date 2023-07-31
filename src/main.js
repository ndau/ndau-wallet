import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

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
      <Stack.Screen name={ScreenNames.IntroCreateAccount} component={IntroCreateAccount} />
      <Stack.Screen name={ScreenNames.CreateAccount} component={CreateAccount} />
      <Stack.Screen name={ScreenNames.IntroCreateWallet} component={IntroCreateWallet} />
      <Stack.Screen name={ScreenNames.CreateWallet} component={CreateWallet} />
      <Stack.Screen name={ScreenNames.CreateWalletStarted} component={CreateWalletStarted} />
      <Stack.Screen name={ScreenNames.SeedPhrase} component={SeedPhrase} />
      <Stack.Screen name={ScreenNames.TermsPolicy} component={TermsPolicy} options={{ presentation: "modal", cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
      <Stack.Screen name={ScreenNames.ImportWallet} component={ImportWallet} />
      <Stack.Screen name={ScreenNames.ImportMultiCoinWallet} component={ImportMultiCoinWallet} />
      <Stack.Screen name={ScreenNames.ImportClassicWallet} component={ImportClassicWallet} />
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
