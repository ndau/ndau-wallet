import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ethers } from "ethers";

import AppConstants from "../AppConstants";
import { WalletSuccessSVGComponent } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import Loading from "../components/Loading";
import CustomModal from "../components/Modal";
import PhraseHandler from "../components/PhraseHandler";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import FlashNotification from "../components/common/FlashNotification";
import DataFormatHelper from "../helpers/DataFormatHelper";
import { KeyAddr } from "../helpers/KeyAddrManager";
import RecoveryPhraseHelper from "../helpers/RecoveryPhraseHelper";
import { useWallet } from "../hooks";
import UserData from "../model/UserData";
import SetupStore from "../stores/SetupStore";
import UserStore from "../stores/UserStore";
import { ScreenNames } from "./ScreenNames";


const ImportMultiCoinWallet = (props) => {
  const { item } = props?.route?.params ?? {};
  const modalRef = useRef(null);
  const navigation = useNavigation();
  const [recoverdPhrase, setRecoverdPhrase] = useState([]);
  const [loading, setLoading] = useState("");
  const [walletCount, setWalletCount] = useState(1);
  const [errors, setErrors] = useState([]);
  const [walletNameValue, setWalletNameValue] = useState("");
  const [defaultWalletId, setDefaultWalletId] = useState("Wallet 1");
  const { addWalletWithAddress, addLegacyWallet } = useWallet()

  const checkIfWalletAlreadyExists = () => {

    try {
      const user = UserStore.getUser();
      if (DataFormatHelper.checkIfWalletAlreadyExists(user, SetupStore.walletId)) {
        FlashNotification.show(`There is already a wallet named "${SetupStore.walletId}". Please choose another name.`);
        return true;
      }
    } catch (error) { }

    return false;
  };


  const handleDone = () => {
    modalRef.current(false);
    navigateToDashboard()
  };

  const recoverUser = async () => {
    return await RecoveryPhraseHelper.recoverUser(
      DataFormatHelper.convertRecoveryArrayToString(recoverdPhrase),
      UserStore.getUser()
    );
  };

  const recoverWallet = async () => {
    if (item.type === "LEGACY") {
      const bytes = await KeyAddr.wordsToBytes(AppConstants.APP_LANGUAGE, SetupStore.recoveryPhrase.join(" "))
      if (!bytes) {
        return FlashNotification.show("Phrase does not belongs to Ndau Legacy wallet");
      }
    } else {
      try {
        ethers.utils.mnemonicToEntropy(SetupStore.recoveryPhrase.join(" "))
      } catch (e) {
        return FlashNotification.show("Phrase does not support for ERC");
      }
    }

    if (UserStore.isUserSetup()) {
      //Todo
      // const isExist = await MultiSafeHelper.recoveryPhraseAlreadyExists(UserStore.getUser().userId, UserStore.getPassword())
      // if (isExist) return FlashNotification.show("This recovery phrase already exists in the wallet.");
      if (checkIfWalletAlreadyExists()) return;

      if (item.type === "LEGACY") {
        setLoading("Importing a Wallet");
        let user = UserStore.getUser();
        UserStore.setUser(user);
        user.walletName = walletNameValue;
        user = await addLegacyWallet(user);
        await UserData.loadUserData(user);
        setLoading("");
        // navigateToDashboard();
        modalRef.current(true)
      } else {
        await addEVMWallet();
      }

    } else {
      /**
       * Set the recovery phrase in setup store, 
       * and navigate to ProtectWallet, 
       * its automatically handles and create the wallet against the phrases
       */
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.ProtectWallet, params: { item } }],
        })
      );
    }
  };
  const navigateToDashboard = () => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.TabNav }],
        })
      );
    }, 200);
  }

  const handleSubmit = async () => {
    if (recoverdPhrase.length === 12 || recoverdPhrase.length === 14 || recoverdPhrase.length === 24) {
      if (walletNameValue) {
        await recoverWallet();
        setErrors([]);
      } else {
        setErrors(["Wallet Name is required"]);
      }
    } else {
      FlashNotification.show("Please enter valid seed phrase");
    }
  };

  const addEVMWallet = async () => {
    setLoading("Importing a Wallet");
    setTimeout(async () => {
      await addWalletWithAddress(recoverdPhrase.join(' '), walletNameValue);
      setTimeout(() => {
        setLoading("");
        modalRef.current(true)
      }, 500);
    }, 0);
  }

  return (
    <ScreenContainer>
      <Spacer height={16} />
      {loading && <Loading label={loading} />}
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>
          {`Import ${item?.name}`}
        </CustomText>

        <CustomTextInput
          label={"Wallet Name"}
          value={walletNameValue}
          placeholder={"Wallet Name"}
          errors={errors}
          onChangeText={(value) => {
            if (value) {
              SetupStore.walletId = value;
            } else {
              SetupStore.walletId = defaultWalletId;
            }
            setWalletNameValue(value);
          }}
        />
        <PhraseHandler
          label={"Phrase"}
          placeholder={"Enter or paste phrase here..."}
          onChangeText={(t) => {
            setRecoverdPhrase(t);
            SetupStore.recoveryPhrase = t;
          }}
        />
      </View>
      <Button
        label={"Import"}
        onPress={handleSubmit}
      />

      <CustomModal bridge={modalRef}>
        <View style={styles.modal}>
          <WalletSuccessSVGComponent />
          <CustomText titiliumSemiBold body>
            Your wallet was successfully imported
          </CustomText>
        </View>
        <Button label={"Done"} onPress={handleDone} />
      </CustomModal>

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
  modal: {
    alignItems: "center",
    marginVertical: 20,
  },
});

export default ImportMultiCoinWallet;