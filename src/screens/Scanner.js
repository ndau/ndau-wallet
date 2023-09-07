import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';

import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";

const Scanner = (props) => {

  const { onScan } = props?.route?.params ?? {};

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
