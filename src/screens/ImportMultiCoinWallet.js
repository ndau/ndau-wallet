import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, NativeModules, StyleSheet, View } from "react-native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import CustomModal, { ModalImage } from "../components/Modal";
import PhraseHandler from "../components/PhraseHandler";
import AppConstants from "../AppConstants";
import SetupStore from "../stores/SetupStore";
import UserStore from "../stores/UserStore";
import LogStore from "../stores/LogStore";
import AccountHelper from "../helpers/AccountHelper";
import UserData from "../model/UserData";
import DataFormatHelper from "../helpers/DataFormatHelper";
import RecoveryPhraseHelper from "../helpers/RecoveryPhraseHelper";
import FlashNotification from "../components/common/FlashNotification";
import OfflineError from "../errors/OfflineError";
import MultiSafeHelper from "../helpers/MultiSafeHelper";
import { WalletSuccessSVGComponent } from "../assets/svgs/components";
import { ScreenNames } from "./ScreenNames";
// import { useWallet } from "../redux/hooks";

const ImportMultiCoinWallet = () => {
  const modalRef = useRef(null);
  const navigation = useNavigation();
  // const { addWallet } = useWallet();
  const [recoverdPhrase, setRecoverdPhrase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletCount, setWalletCount] = useState(1);
  const [errors, setErrors] = useState([]);
  const [walletNameValue, setWalletNameValue] = useState("");
  const [defaultWalletId, setDefaultWalletId] = useState("Wallet 1");

  useEffect(() => {
    const user = UserStore.getUser();

    if (user) {
      let count = Object.keys(user.wallets).length;
      setWalletCount(count);
    }
    let walletId = `Wallet ${walletCount}`;
    setDefaultWalletId(walletId);
    SetupStore.walletId = defaultWalletId;
  }, []);

  checkIfWalletAlreadyExists = async () => {
    try {
      const password = await UserStore.getPassword();
      const user = await MultiSafeHelper.getDefaultUser(password);

      if (
        DataFormatHelper.checkIfWalletAlreadyExists(user, SetupStore.walletId)
      ) {
        FlashNotification.show(
          `There is already a wallet named "${SetupStore.walletId}". Please choose another name.`
        );
        return true;
      }
    } catch (error) {}

    return false;
  };

  const showNextSetup = async () => {
    const user = UserStore.getUser();

    if (await checkIfWalletAlreadyExists()) {
      return;
    }

    if (user) {
      // get it out of AppConstants.TEMP_ID if we have to
      // and into the new walletId
      DataFormatHelper.moveTempUserToWalletName(user, SetupStore.walletId);
    }

    UserStore.setUser(user);
    // if we have an application password in
    // cache then there is no need to show
    // this screen, so go to terms & conditions
    const password = await UserStore.getPassword();
    if (password) {
      SetupStore.encryptionPassword = password;
      navigation.navigate(ScreenNames.TermsPolicy, {
        user,
      });
    } else {
      if (user) {
        if (!user.userId) {
          user.userId = SetupStore.walletId;
        }
        if (!user.wallets) {
          user.wallets = [{ walletId: SetupStore.walletId }];
        }
      }

      navigation.navigate(ScreenNames.ProtectWallet, {
        user,
      });
    }
  };

  const handleDone = () => {
    //   finishSetup();
    modalRef.current(false);
  };

  //   const finishSetup = async () => {
  //     setLoading(true);

  //     try {
  //       LogStore.log("Finishing Setup...");
  //       let user = UserStore.getUser();

  //       if (user) {
  //         let password = await UserStore.getPassword();
  //         if (!password) {
  //           password = SetupStore.encryptionPassword;
  //         }
  //         user = await MultiSafeHelper.saveUser(
  //           user,
  //           password,
  //           DataFormatHelper.convertRecoveryArrayToString(
  //             SetupStore.recoveryPhrase
  //           )
  //         );
  //       } else {
  //         user = await AccountHelper.setupNewUser(
  //           user,
  //           DataFormatHelper.convertRecoveryArrayToString(
  //             SetupStore.recoveryPhrase
  //           ),
  //           SetupStore.walletId ? SetupStore.walletId : SetupStore.userId,
  //           SetupStore.numberOfAccounts,
  //           SetupStore.entropy,
  //           SetupStore.encryptionPassword,
  //           SetupStore.addressType
  //         );
  //       }
  //       console.log(user, "after setup new user");
  //       await UserData.loadUserData(user);
  //       UserStore.setPassword(SetupStore.encryptionPassword);
  //       setLoading(false);
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: ScreenNames.TabNav }],
  //         })
  //       );
  //       // this.setState({spinner: false}, () => {
  //       //   this.props.navigation.replace('Drawer', {screen: 'DashboardNav'});
  //       // });
  //     } catch (error) {
  //       console.log("console .. 76", error);
  //       FlashNotification.showError(
  //         new OfflineError(
  //           error.message
  //             ? error.message
  //             : "Error occurred communicating with the blockchian"
  //         )
  //       );
  //       setLoading(false);
  //     }
  //   };

  const recoverUser = async () => {
    return await RecoveryPhraseHelper.recoverUser(
      DataFormatHelper.convertRecoveryArrayToString(recoverdPhrase),
      UserStore.getUser()
    );
  };

  const recoverWallet = async () => {
    setLoading(true);

    try {
      if (AppConstants.NORMAL_MODE === AppConstants.PASSWORD_RESET_MODE) {
        navigation.navigate(ScreenNames.ProtectWallet, {
          user: user,
          mode: AppConstants.PASSWORD_RESET_MODE,
          recoveryPhraseString:
            DataFormatHelper.convertRecoveryArrayToString(recoverdPhrase),
        });

        setLoading(false);
        return;
      }
      const user = await recoverUser();
      if (user) {
        if (
          await MultiSafeHelper.recoveryPhraseAlreadyExists(
            user.userId,
            recoverdPhrase
          )
        ) {
          FlashNotification.showError(
            "This recovery phrase already exists in the wallet."
          );
          return;
        }

        UserStore.setUser(user);

        SetupStore.recoveryPhrase = recoverdPhrase;
        setLoading(false);
        showNextSetup();
      } else {
        // this.setState({
        //   textColor: AppConstants.WARNING_ICON_COLOR,
        //   confirmationError: true
        // })
        FlashNotification.show(
          "We tried to find matching accounts " +
            "on the blockchain and found none. Please confirm " +
            "you entered the correct phrase, and try again.",
          true
        );
      }
    } catch (error) {
      setLoading(false);
      FlashNotification.show(
        !error.message
          ? "We tried to find matching accounts " +
              "on the blockchain and found none. Please confirm " +
              "you entered the correct phrase, and try again."
          : error.message,
        true
      );

      LogStore.log(error);
    }
  };

  const handleSubmit = async () => {
    if (walletNameValue) {
      await recoverWallet();
      setErrors([]);
    } else {
      setErrors(["Wallet Name is required"]);
    }
  };

  return (
    <ScreenContainer>
      <Spacer height={16} />

      {loading && <Loading label={"Connect to BlockChain"} />}
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>
          Import Multi-Coin Wallet
        </CustomText>

        <CustomTextInput
          label={"Wallet Name"}
          value={walletNameValue}
          placeholder={"Wallet Name"}
          errors={errors}
          // onChangeText={(t) => handleInput(t, "fName")}
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
          // onChangeText={(t) => handleInput(t, "lName")}
          onChangeText={(t) => {
            setRecoverdPhrase(t);
          }}
        />
      </View>
      <Button
        label={"Import"}
        onPress={handleSubmit}
        // disabled={recoverdPhrase.length===12?false:true}
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
