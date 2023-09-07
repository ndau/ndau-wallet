import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
import CustomTextInput from "../components/CustomTextInput";
import FlashNotification from "../components/common/FlashNotification";

const EditWallet = (props) => {
  const { item } = props.route?.params ?? {};
  const refAddWalletSheet = useRef();
  const navigation = useNavigation();
  const { changeWalletName } = useWallet();

  const [walletName, setWalletName] = useState(item.walletId || "");

  return (
    <ScreenContainer>
      <Spacer height={16} />
      <CustomText bold h6 style={styles.margin}>{item.walletId}</CustomText>
      <Spacer height={16} />
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <CustomTextInput
            label={'Wallet Name'}
            value={walletName}
            placeholder={'Enter wallet name...'}
            onChangeText={(t) => {
              if (t === "") setWalletName(t);
              if (/^[\w\-\s]+$/.test(t)) setWalletName(t)
            }}
            maxLength={32}
          />
        </View>
        <Button
          disabled={walletName === ""}
          label={"Save changes"}
          onPress={() => {
            changeWalletName(walletName, item.key).then(res => {
              navigation.goBack();
            }).catch(err => {
              FlashNotification.show(err.message);
            })
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

export default EditWallet;
