import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';

import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";

const Scanner = (props) => {
  const navigation = useNavigation();

  useEffect(() => {

  }, []);

  return (
    <ScreenContainer>
      <QRCodeScanner
        onRead={(e) => {
          props.navigation.navigate(ScreenNames.Send, { address:e?.data })
        }}
      />
    </ScreenContainer>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Scanner;
