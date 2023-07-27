import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { images } from "../assets/images";
import { ScreenNames } from "./ScreenNames";

const ImportWallet = () => {

  const navigation = useNavigation();
  const [walletItems, setWalletItems] = useState([]);

  useEffect(() => {
    setWalletItems([
      { type: "NDAU", name: "Multi-Coin Wallet", image: images.walletIcon },
      { type: "ERC-20", name: "Ethereum Classic", image: images.bitcoinIcon },
      { type: "ERC-20", name: "Bitcoin", image: images.dogecoinIcon },
      { type: "ERC-20", name: "Polygon", image: images.ethereumIcon },
      { type: "ERC-20", name: "Solana", image: images.polygonIcon },
      { type: "ERC-20", name: "Dogecoin", image: images.solanaIcon },
    ])
  }, [])

  const WalletItem = useCallback(({ item, showSeparator, onPress }) => {
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
    if (item.type === "NDAU") navigation.navigate(ScreenNames.ImportMultiCoinWallet)
    else if (item.type === "ERC-20") navigation.navigate(ScreenNames.ImportClassicWallet, { name: item.name })
  }

  return (
    <ScreenContainer>
      <Spacer height={16} />
      <CustomText h6 semiBold style={styles.margin}>
        Import Wallet
      </CustomText>
      <Spacer height={16} />
      <FlatList
        data={walletItems}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => <WalletItem item={item} showSeparator={index === 0} onPress={handlePress}/>}
        ListFooterComponent={
          <Button
            label={'Show More'}
            buttonContainerStyle={styles.outlineButton}
          />
        }
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
    marginRight: 15
  }
});

export default ImportWallet;
