import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { ScreenNames } from "./ScreenNames";
import { themeColors } from "../config/colors";

const ImportMultiCoinWallet = () => {

  const navigation = useNavigation()

  const [data, setData] = useState({
    fName: {
      value: "",
    },
    lName: {
      value: "",
    },
    email: {
      value: "",
    },
    password: {
      value: "",
      errors: [],
      success: [],
    },
  });
  const [loading, setLoading] = useState(false);

  const isValidated =
    data.fName.value.length &&
    data.lName.value.length &&
    data.email.value.length &&
    data.password.value.length >= 8;

  const handleInput = (t, tag) => {
    setData((prevState) => {
      const valueToSet = { value: "" };
      if (tag === "password") {
        valueToSet.value = t;
        if (t.length < 8) {
          valueToSet.success = [];
          valueToSet.errors = [
            "Weak Password",
            "Pasword must be at least 8 characters long",
          ];
        } else {
          valueToSet.errors = [];
          valueToSet.success = ["Looks Good!"];
        }
      } else {
        valueToSet.value = t;
      }
      return {
        ...prevState,
        [tag]: valueToSet,
      };
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        navigation.navigate(ScreenNames.IntroCreateWallet);
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
          onChangeText={(t) => handleInput(t, "fName")}
        />
        <CustomTextInput
          label={"Phrase"}
          placeholder={"Enter or paste phrase here..."}
          onChangeText={(t) => handleInput(t, "lName")}
        />
        <Button
          label={"Paste Secret Phrase"}
          onPress={handleSubmit}
          buttonContainerStyle={styles.outlineButton}
        />
      </View>
      <Button
        label={"Import"}
      />
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
  outlineButton: {
    backgroundColor: undefined,
    borderWidth: 2,
    borderColor: themeColors.primary
  }

});

export default ImportMultiCoinWallet;
