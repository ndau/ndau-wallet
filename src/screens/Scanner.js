import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';

import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";

const Scanner = (props) => {

  const { onScan } = props?.route?.params ?? {};

  useEffect(() => {
    // setTimeout(() => {
    //   onScan?.("wc:22bb6a1e62a5e147cf5f7dffd4de76836404a944a73f919154a570f5860c4f90@2?relay-protocol=irn&symKey=047162e439d4d66b3704310ba5450deda04d904691848e6321053d860f2ec090");
    //   props.navigation.goBack();
    // }, 2000);
  }, [])

  return (
    <ScreenContainer>
      <QRCodeScanner
        onRead={(e) => {
          if (e?.data) {
            onScan?.(e?.data);
            props.navigation.goBack();
          }
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
