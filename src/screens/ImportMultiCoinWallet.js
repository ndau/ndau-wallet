import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import CustomModal, { ModalImage } from "../components/Modal";
import PhraseHandler from "../components/PhraseHandler";

const ImportMultiCoinWallet = () => {

  const modalRef = useRef(null);
  const navigation = useNavigation()

  const [data, setData] = useState({
    fName: {
      value: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleDone = () => {
    modalRef.current(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        modalRef.current(true);
      }, 400);
    }, 4000);
  };

  return (
    <ScreenContainer>
      <Spacer height={16} />

      {loading && <Loading label={"Creating Account"} />}
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>
          Import Multi-Coin Wallet
        </CustomText>
        <CustomTextInput
          label={"Wallet Name"}
          placeholder={"Wallet Name"}
          // onChangeText={(t) => handleInput(t, "fName")}
          onChangeText={(t) => {}}
        />
        <PhraseHandler
          label={"Phrase"}
          placeholder={"Enter or paste phrase here..."}
          // onChangeText={(t) => handleInput(t, "lName")}
          onChangeText={(t) =>{}}
        />
      </View>
      <Button
        label={"Import"}
        onPress={handleSubmit}
      />

      <CustomModal bridge={modalRef}>
        <View style={styles.modal}>
          <ModalImage />
          <CustomText titiliumSemiBold body>Your wallet was successfully imported</CustomText>
        </View>
        <Button label={'Done'} onPress={handleDone} />
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
    marginVertical: 20
  }
});

export default ImportMultiCoinWallet;
