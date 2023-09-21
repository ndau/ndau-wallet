import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";

const NFTDetail = (props) => {
  const { item } = props.route?.params ?? {};

  const renderKeyValue = (key, value) => {
    return (
      <View style={styles.keyValueContainer}>
        <CustomText titiliumBold body style={{ marginRight: 10 }}>{key}</CustomText>
        <CustomText titilium body color={themeColors.white} style={{ flex: 1, textAlign: "right" }} numberOfLines={1}>{value}</CustomText>
      </View>
    )
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomText titiliumSemiBold h6>{item.name || item.title}</CustomText>
        <Spacer height={16} />
        <Image
          source={{ uri: item.media?.[0]?.thumbnail }}
          style={styles.icon}
        />
        <View style={styles.separator} />
        <CustomText h5 titiliumBold>Details</CustomText>
        <Spacer height={10} />
        {renderKeyValue("Token Id", item.tokenId)}
        {renderKeyValue("Token Type", item.tokenType)}
        {renderKeyValue("Network", item.network)}
        <CustomText style={{ marginTop: 20 }}>{item.description}</CustomText>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderWidth: 1,
    borderRadius: 10,
    height: 320,
    width: "100%",
    backgroundColor: themeColors.black50
  },
  keyValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: themeColors.black300,
    marginTop: 20,
    marginVertical: 10
  }
});

export default NFTDetail;
