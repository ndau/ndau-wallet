import React, { useEffect, useMemo, useState } from "react";
import { NativeModules, StyleSheet, View } from "react-native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import CustomTextInput from "../components/CustomTextInput";
import Loading from "../components/Loading";
import Spacer from "../components/Spacer";
import NDAU from "@ndau/ndaujs"

const CreateAccount = () => {





  useEffect(() => {
     function fetchData() {
      // You can await here
  
      const x=NativeModules.KeyaddrManager
   console.log(x,'jjjjjj')

  
      
      // ...
    }
    fetchData();
  }, []); 



console.log(NDAU.APIAddressHelper,'hhhhhhhhhh')


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
    }, 4000);
  };







  return (
    <ScreenContainer steps={{ total: 4, current: 1 }}>
      <Spacer height={16} />

      {loading && <Loading label={"Creating Account"} />}
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>
          Create your account
        </CustomText>
        <CustomTextInput
          label={"First Name"}
          placeholder={"First Name"}
          onChangeText={(t) => handleInput(t, "fName")}
        />
        <CustomTextInput
          label={"Last Name"}
          placeholder={"Last Name"}
          onChangeText={(t) => handleInput(t, "lName")}
        />
        <CustomTextInput
          label={"Email"}
          placeholder={"Email Address"}
          onChangeText={(t) => handleInput(t, "email")}
        />
        <CustomTextInput
          label={"Password"}
          placeholder={"Minimum 8 characters"}
          onChangeText={(t) => handleInput(t, "password")}
          password
          errors={data.password.errors}
          success={data.password.success}
        />
      </View>
      <Button
        disabled={!isValidated}
        label={"Create Account"}
        onPress={handleSubmit}
      />
      <Button
        label={"Privacy Policy and Terms of Service apply"}
        textOnly
        caption
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
});

export default CreateAccount;
