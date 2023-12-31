import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { themeColors } from "../config/colors";
import { useNavigation } from "@react-navigation/native";

import { BackSVGComponent } from "../assets/svgs/components";
import CustomText from "./CustomText";
import Spacer from "./Spacer";
import SettingsStore from "../stores/SettingsStore";

const ScreenContainer = ({ children, style, steps, preventBackPress, tabScreen = false, headerRight, headerTitle = "", changeHandler }) => {
  const navigation = useNavigation();

  const [change, setChange] = useState(false);
  useEffect(() => setChange(!change), [changeHandler])

  const Header = useCallback(() => {
    if (!steps?.total && !navigation.canGoBack()) return null;
    return (
      <View style={styles.headerContainer}>
        {navigation.canGoBack() && (
          <TouchableOpacity style={styles.absolute} onPress={() => preventBackPress ? preventBackPress() : navigation.goBack()}>
            <BackSVGComponent />
            <Spacer width={10} />
            <CustomText caption semiBold>
              Back
            </CustomText>
          </TouchableOpacity>
        )}
        <View style={styles.headerCenter}>
          {!!headerTitle && <CustomText titiliumSemiBold style={styles.headerTitle}>{headerTitle}</CustomText>}
          {steps?.total && (
            <View style={styles.row}>
              {Array(steps.total)
                .fill("")
                .map((_, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.slide,
                        {
                          borderColor:
                            index < steps?.current
                              ? themeColors.primary
                              : themeColors.white,
                        },
                      ]}
                    ></View>
                  );
                })}
            </View>
          )}
          <View style={[styles.absolute, { right: 0 }]}>
            {headerRight}
          </View>
        </View>
      </View>
    );
  }, [steps, preventBackPress, headerRight]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      {
        (SettingsStore._settings?.applicationNetwork == "testnet" || SettingsStore._settings?.applicationNetwork == "devnet") && (
          <View style={styles.mode}>
            <CustomText titilium>{`You are in ${SettingsStore._settings?.applicationNetwork} Mode`}</CustomText>
          </View>
        )
      }
      {tabScreen ? <View style={{ height: 20 }} /> : <Header />}
      <View style={[{ flex: 1 }, style, styles.fixedStyle]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  fixedStyle: {
    paddingHorizontal: 14,
    paddingBottom: 16
  },
  headerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  absolute: {
    position: "absolute",
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
    top: 0,
    bottom: 0
  },
  row: {
    flexDirection: "row",
  },
  slide: {
    borderWidth: 1,
    width: 30,
    borderWidth: 2,
    marginRight: 4,
    borderRadius: 10,
  },
  headerTitle: {

  },
  mode: {
    padding: 5,
    backgroundColor: themeColors.success500,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ScreenContainer;
