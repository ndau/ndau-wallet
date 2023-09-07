import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { InfoIcon, WalletIcon } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { useWallet } from "../hooks";
import { ScreenNames } from "./ScreenNames";
import BottomSheetModal from "../components/BottomSheetModal";
import AddWalletsPopup from "./components/dashboard/AddWalletsPopup";

const SwitchWallet = () => {
  const refAddWalletSheet = useRef();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getWallets, setActiveWallet, removeWallet, getActiveWallet } = useWallet();

  const [refresh, setRefresh] = useState(false);
  const [wallets, setWallets] = useState(getWallets());

  useEffect(() => {
    setWallets([...getWallets()])
  }, [refresh, isFocused])

  const confirm = (onYes) => {
    Alert.alert(
      'Delete wallet',
      'Are you sure that you want to delete wallet?',
      [
        { text: "Yes", onPress: onYes },
        { text: "No", onPress: () => null },
      ]
    )
  }

  const RenderItem = useCallback(({ item }) => {
    const { walletId, type } = item;
    return (
      <TouchableOpacity
        disabled={getActiveWallet().walletId === walletId}
        onLongPress={() => confirm(() => {
          removeWallet(item.key).then(() => {
            setRefresh(!refresh);
          })
        })}
        onPress={() => setActiveWallet(item, navigation.goBack())}>
        <View style={styles.walletContainer}>
          <View style={[styles.icon, getActiveWallet().walletId !== walletId && { borderColor: themeColors.black300 }]}>
            <WalletIcon />
          </View>
          <View style={{ justifyContent: "space-between", padding: 4, flex: 1 }}>
            <CustomText titilium body>{walletId}</CustomText>
            <CustomText titilium body2>{type || "nDau Legacy Wallet"}</CustomText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(ScreenNames.EditWallet, { item })}>
            <View style={{ justifyContent: "center" }}>
              <InfoIcon />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }, [])

  return (
    <ScreenContainer>
      <Spacer height={16} />
      <CustomText bold h3 style={styles.margin}>Wallets</CustomText>
      <Spacer height={16} />
      <View style={styles.container}>
        <FlatList
          data={wallets}
          keyExtractor={(_, i) => i.toString()}
          renderItem={RenderItem}
        />
        <Button
          label={"Add New Wallet"}
          onPress={() => {
            refAddWalletSheet.current.open();
          }}
        />
      </View>
      <BottomSheetModal
        refRBSheet={refAddWalletSheet}
        setIsVisible={() => {
          refAddWalletSheet.current.close();
        }}
        height={Dimensions.get('window').height * 0.55}
      >
        <AddWalletsPopup
          onClose={() => {
            refAddWalletSheet.current.close()
          }}
          onItemClick={(index) => {
            if (index == 0) navigation.navigate(ScreenNames.ImportWallet, { forCreation: true })
            else if (index == 1) navigation.navigate(ScreenNames.CreateWallet, { isAlreadyWallet: true })
            refAddWalletSheet.current.close();
          }}
        />

      </BottomSheetModal>
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
