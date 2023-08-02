import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import PhraseHandler from "../components/PhraseHandler";
import ScreenContainer from "../components/Screen";
import StateButton from "../components/StateButton";
import { themeColors } from "../config/colors";


const Tab = createMaterialTopTabNavigator();

const Tabs = (params) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorContainerStyle: styles.tabs,
        tabBarLabelStyle: styles.tabsLabel,
        tabBarActiveTintColor: themeColors.font,
        tabBarInactiveTintColor: themeColors.fontLight,
        tabBarIndicatorStyle: { backgroundColor: themeColors.white }
      }}>
      <Tab.Screen name="Phrase" component={Phrase} initialParams={params} />
      <Tab.Screen name="Address" component={Address} initialParams={params} />
    </Tab.Navigator>
  );
}

const Phrase = ({ route: { params } }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <CustomTextInput
          label={"Wallet Name"}
          placeholder={"Wallet Name"}
        />
        <PhraseHandler
          label={"Phrase"}
          placeholder={"Enter or paste phrase here..."}
          onChangeText={(t) => handleInput(t, "lName")}
        />
      </View>
      <Button
        label={"Import"}
      />
    </View>
  )
}

const Address = ({ route: { params } }) => {
  const [address, setAddress] = useState("");
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View>
          <View style={styles.pasteButton}>
            <StateButton
              label={'Paste'}
              onButtonPress={() => Clipboard.getString().then(res => setAddress(res))}
              states={[
                <View style={styles.paste}>
                  <CustomText titilium caption color={themeColors.black}>Paste</CustomText>
                </View>
              ]}
            />
          </View>
          <CustomTextInput
            label={`${params?.name} Address`}
            placeholder={`Enter your ${params?.name} Address`}
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <CustomTextInput
          label={"Wallet Name"}
          placeholder={`Wallet name`}
        />
      </View>
      <Button
        label={"Import"}
      />
    </View>
  )
}

const ImportClassicWallet = ({ route: { params } }) => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>
          {`Import ${params?.name}`}
        </CustomText>
        <Tabs {...params} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {
    marginBottom: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: themeColors.background,
    padding: 10
  },
  outlineButton: {
    backgroundColor: undefined,
    borderWidth: 2,
    borderColor: themeColors.primary
  },
  tabs: {
    backgroundColor: themeColors.background,
    borderBottomWidth: 2,
    borderBlockColor: themeColors.lightBackground
  },
  tabsLabel: {
    fontFamily: 'TitiliumWeb-Regular',
    textTransform: "none",
    fontSize: 14
  },
  pasteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100
  },
  paste: {
    backgroundColor: themeColors.white,
    padding: 4,
    paddingHorizontal: 12,
    borderRadius: 10
  }
});

export default ImportClassicWallet;
