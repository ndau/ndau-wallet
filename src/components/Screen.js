import React, { useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { themeColors } from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import Button from "./Button";
import { BackSVGComponent } from "../assets/svgs/components";
import CustomText from "./CustomText";
import Spacer from "./Spacer";

const ScreenContainer = ({ children, style, steps }) => {
  const navigation = useNavigation();

  const Header = useCallback(() => {
    if (!navigation.canGoBack() || !steps) return null;
    return (
      <View style={styles.headerContainer}>
        {navigation.canGoBack() && (
          <TouchableOpacity style={styles.absolute} onPress={navigation.goBack}>
            <BackSVGComponent />
            <Spacer width={10} />
            <CustomText caption semiBold>
              Back
            </CustomText>
          </TouchableOpacity>
        )}
        <View style={styles.headerCenter}>
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
        </View>
      </View>
    );
  }, [steps]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <Header />
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
  },
  headerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
});

export default ScreenContainer;
