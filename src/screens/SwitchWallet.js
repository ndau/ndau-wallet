import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { InfoIcon, WalletIcon } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { useWallet } from "../hooks";

const SwitchWallet = () => {
  const navigation = useNavigation();
  const { getWallets, setActiveWallet } = useWallet();

  const RenderItem = useCallback(({ item }) => {
    const { walletId, type } = item;
    return (
      <TouchableOpacity onPress={() => setActiveWallet(item, navigation.goBack())}>
        <View style={styles.walletContainer}>
          <View style={styles.icon}>
            <WalletIcon />
          </View>
          <View style={{ justifyContent: "space-between", padding: 4, flex: 1 }}>
            <CustomText titilium body>{walletId}</CustomText>
            <CustomText titilium body2>{type || "nDau Legacy Wallet"}</CustomText>
          </View>
          <View style={{ justifyContent: "center" }}>
            <InfoIcon />
          </View>
        </View>
      </TouchableOpacity>
    )
  }, [])

  console.log(JSON.stringify(getWallets(),null,2),'wallet00000000')

  return (
    <ScreenContainer>
      <Spacer height={16} />
      <CustomText bold h3 style={styles.margin}>Wallets</CustomText>
      <Spacer height={16} />
      <View style={styles.container}>
        <FlatList
          data={getWallets()}
          keyExtractor={(_, i) => i.toString()}
          renderItem={RenderItem}
        />
        <Button
          label={"Add New Wallet"}
          onPress={() => {

          }}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  walletContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  buttonTerms: {
    backgroundColor: themeColors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  icon: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    borderColor: themeColors.primary,
    marginRight: 8
  }
});

export default SwitchWallet;
