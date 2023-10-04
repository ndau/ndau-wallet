import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { images } from "../assets/images";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { ScreenNames } from "./ScreenNames";

const ImportWallet = (props) => {

  const { forCreation } = props?.route?.params ?? {};

  const navigation = useNavigation();
  const [walletItems, setWalletItems] = useState([]);

  useEffect(() => {
      setWalletItems([
        { type: "LEGACY", name: "ndau Legacy Wallet", image: images.nDau },
        { type: "MULTI-COIN", name: "Multi-Coin Wallet", image: images.walletIcon },
        // { type: "ERC-20", name: "NPAY", image: images.nPay },
        // { type: "ERC-20", name: "Ethereum", image: images.ethereum },
        // { type: "ERC-20", name: "Polygon", image: images.polygonIcon }
      ])
  }, [])

  const WalletItem = useCallback(({ item, showSeparator, onPress }) => {
    if (forCreation && item.type === "LEGACY") return null;
    return (
      <>
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
          <View style={[styles.walletItem]}>
            <Image source={item.image} style={styles.image} />
            <CustomText titilium body>{item.name}</CustomText>
          </View>
        </TouchableOpacity>
        {!!showSeparator && <View style={styles.separator} />}
      </>
    )
  }, [])

  const handlePress = (item) => {
    if (forCreation) {
      navigation.navigate(ScreenNames.CreateWallet, { item, forCreation })
    } else {
      if (item.type === "ERC-20") navigation.navigate(ScreenNames.ImportClassicWallet, { ...item, name: item.name })
      else navigation.navigate(ScreenNames.ImportMultiCoinWallet, { item })
    }
  }

  return (
    <ScreenContainer>
      <Spacer height={16} />
      <CustomText h6 semiBold style={styles.margin}>
        {`${forCreation ? "Create" : "Import"} Wallet`}
      </CustomText>
      <Spacer height={16} />
      <FlatList
        data={walletItems}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => <WalletItem item={item} showSeparator={index <= 1} onPress={handlePress} />}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  outlineButton: {
    marginTop: 20,
    backgroundColor: undefined,
    borderWidth: 2,
    borderColor: themeColors.primary
  },
  margin: {
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBlockColor: themeColors.white,
    marginVertical: 10
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  image: {
    marginRight: 15,
    height: 50,
    width: 50,
    borderRadius: 25
  }
});

export default ImportWallet;
