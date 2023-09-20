import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import NFT from "../components/NFT";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { useNFTS } from "../hooks";
import { ScreenNames } from "./ScreenNames";
import FlashNotification from "../components/common/FlashNotification";
import Loading from "../components/Loading";
import CustomText from "../components/CustomText";

const NFTList = (props) => {
  const { item } = props.route?.params ?? {};
  const navigation = useNavigation();
  const { getNftOfCollection } = useNFTS();

  const [loading, setLoading] = useState("");
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    setLoading("Getting NFT");
    getNftOfCollection(item.address).then(res => {
      setLoading("");
      setNfts(res);
    }).catch(err => {
      setLoading("");
      FlashNotification.show(err.message);
    })
  }, [])

  const renderItem = ({ item, index, }) => {
    return (
      <NFT
        {...item}
        index={index}
        isLast={(nfts.length - 1) === index}
        onPress={() => navigation.navigate(ScreenNames.NFTDetail, { item })} />
    )
  }

  return (
    <ScreenContainer>
      <CustomText titiliumSemiBold h6>{item.openSea?.collectionName || item.name || "Unknown Collection"}</CustomText>
      <Spacer height={16} />
      <FlatList
        data={nfts}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {!!loading && <Loading label={loading} />}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  walletContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  buttonTerms: {
    backgroundColor: themeColors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  icon: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    borderColor: themeColors.primary,
    marginRight: 8
  }
});

export default NFTList;
