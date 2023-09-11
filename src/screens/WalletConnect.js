import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from "react-native";

import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { useWallet, useWalletConnect } from "../hooks";
import Button from "../components/Button";
import { themeColors } from "../config/colors";
import { Converters, EthersScanAPI } from "../helpers/EthersScanAPI";
import { ndauUtils } from "../utils";
import { Delete, QRCode } from "../assets/svgs/components";
import moment from "moment";

const WalletConnect = (props) => {
  const { item } = props.route?.params ?? {};
  const {
    loading,
    proposal,
    paired,
    connectWithURI,
    clientInitialized,
    approve,
    reject,
    disconnect
  } = useWalletConnect();

  const { getActiveWallet } = useWallet();

  const [account, setAccount] = useState({
    accountAddress: "",
    totalFunds: "",
    usdAmount: ""
  })

  useEffect(() => {
    EthersScanAPI.getEthPriceInUSD().then(res => {
      if (res.message === "OK") {
        const { result: { ethusd } } = res;
        EthersScanAPI.getAddressBalance(getActiveWallet().ercAddress).then(res => {
          if (res.message === "OK") {
            const { result } = res;
            const eth = {
              accountAddress: getActiveWallet().ercAddress,
              totalFunds: Converters.WEI_ETH(result),
              usdAmount: Converters.ETH_USD(Converters.WEI_ETH(result), ethusd)
            };
            setAccount(eth);
          }
        })
      }
    });
  }, [])

  const renderProposal = () => {
    const {
      params: {
        proposer: {
          metadata: { icons, name, description }
        }
      }
    } = proposal;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.proposalContainer}>
          <Image style={styles.image} source={{ uri: icons[1] || icons[0] }} />
          <CustomText titiliumBold h6 style={{ marginVertical: 20 }}>{name}</CustomText>
          <CustomText titiliumBold caption style={{ textAlign: "center" }}>{description}</CustomText>
        </View>
        <View style={styles.accountsContainer}>
          <View style={styles.account}>
            {renderData("Account", ndauUtils.truncateAddress(account.accountAddress))}
            {renderData("Total Eth", parseFloat(account.totalFunds || 0).toFixed(8))}
            {renderData("USD", account.usdAmount)}
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            label={'Approve'}
            onPress={() => approve(account.accountAddress)}
          />
          <Spacer height={10} />
          <Button
            label={'Reject'}
            buttonContainerStyle={styles.rejectButton}
            onPress={() => {
              reject().then(() => {
                props.navigation.goBack();
              });
            }}
          />
        </View>
      </View>
    )
  }

  const renderData = (key, value) => {
    if (!value) return;
    return (
      <View style={{ marginVertical: 5, marginBottom: 10 }}>
        <CustomText titiliumSemiBold body style={{ marginBottom: 4 }}>{key}</CustomText>
        <CustomText titilium color={themeColors.black200}>{value}</CustomText>
      </View>
    )
  }

  const scanQR = () => {
    connectWithURI("wc:a3297083b8127d1eb335fba62b8406fd067f3fb6810736e694a05d5fa0e183d5@2?relay-protocol=irn&symKey=625b2aee6035db595eac66074819cd39fa9b4f643ede3962a0acf1dcd0fba48d")
  }

  return (
    <ScreenContainer
      preventBackPress={() => { reject(); props.navigation.goBack(); }}>
      {
        proposal ? renderProposal() : (
          <>
            <CustomText h6 titiliumBold>Scan & Connect</CustomText>
            <Spacer height={8} />
            <View style={styles.row}>
              <CustomText titilium>Scan QR Code with a </CustomText>
              <CustomText titiliumBold>WalletConnect</CustomText>
              <CustomText titilium> wallet.</CustomText>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Button onPress={scanQR} label={'Scan  '} rightIcon={<QRCode />} buttonContainerStyle={{ flexDirection: "row" }} />
            </View>
            <Spacer height={20} />
            <FlatList
              data={paired}
              ListHeaderComponent={(
                <View style={{ marginVertical: 10 }}>
                  <CustomText titiliumSemiBold h6>Connected DApps</CustomText>
                </View>
              )}
              ListEmptyComponent={(
                <View style={{ alignItems: "center", marginTop: 100 }}>
                  <CustomText titiliumSemiBold body2>No connection yet</CustomText>
                </View>
              )}
              renderItem={({ item }) => {
                const peerMetadata = item.peer?.metadata || {};
                return (
                  <View style={styles.pairedItem}>
                    <Image source={{ uri: peerMetadata?.icons?.[0] }} style={styles.peerIcon} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <CustomText titiliumSemiBold>{peerMetadata?.name}</CustomText>
                      <CustomText titilium color={themeColors.black300}>Expiry: {moment(item.expiry * 1000).format("MMM DD, yyyy hh:mm")}</CustomText>
                    </View>
                    <TouchableOpacity onPress={() => disconnect(item.topic)} style={{ padding: 10 }}>
                      <Delete color={themeColors.dangerFlashBackground} />
                    </TouchableOpacity>
                  </View>
                )
              }}
            />
          </>
        )
      }
      {!!loading && <Loading label={loading} />}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  proposalContainer: {
    marginBottom: 20,
    alignItems: "center"
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  buttonsContainer: {

  },
  accountsContainer: {
    flex: 1,
    justifyContent: "center"
  },
  rejectButton: {
    backgroundColor: themeColors.dangerFlashBackground
  },
  account: {
    padding: 10,
    borderWidth: 1,
    borderColor: themeColors.black300,
    borderRadius: 10
  },
  pairedItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: themeColors.black300,
    backgroundColor: themeColors.black500,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10
  },
  peerIcon: {
    height: 50,
    width: 50
  }
});

export default WalletConnect;
