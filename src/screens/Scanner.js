import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';

import ScreenContainer from "../components/Screen";

const Scanner = ({ }) => {
  const navigation = useNavigation();

  useEffect(() => {

  }, []);

  return (
    <ScreenContainer>
      <QRCodeScanner
        onRead={(e) => {
          console.log('e', JSON.stringify(e, null, 2));
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
