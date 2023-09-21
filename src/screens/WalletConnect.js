import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from "react-native";

import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { useWallet, useWalletConnect } from "../hooks";
import Button from "../components/Button";
import { themeColors } from "../config/colors";
import { Converters, EthersScanAPI, NetworkManager } from "../helpers/EthersScanAPI";
import { ndauUtils } from "../utils";
import { Delete, QRCode } from "../assets/svgs/components";
import moment from "moment";
import FlashNotification from "../components/common/FlashNotification";
import ApprovalModal, { ApprovalModalHandler } from "../components/wallectConnectModals/ApprovalModal";
import { ScreenNames } from "./ScreenNames";
import { ethers } from "ethers";

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
        NetworkManager.getBalance().then(res => {
          const eth = {
            accountAddress: getActiveWallet().ercAddress,
            totalFunds: parseFloat(ethers.utils.formatEther(res || 0)),
            usdAmount: Converters.ETH_USD(ethers.utils.formatEther(res || 0), ethusd)
          };
          setAccount(eth);

        })
      }
    });
  }, [])

  useEffect(() => {
    if (proposal) {
      ApprovalModalHandler.show({ data: { ...proposal, account } });
    }
  }, [proposal, account])

  const scanQR = (data) => {
    if (data.substring(0, 2) !== "wc") return FlashNotification.show("Invalid QR Code");
    connectWithURI(data)
  }

  return (
    <ScreenContainer
      preventBackPress={() => { reject(); props.navigation.goBack(); }}>
      <>
        <CustomText h6 titiliumBold>Scan & Connect</CustomText>
        <Spacer height={8} />
        <View style={styles.row}>
          <CustomText titilium>Scan QR Code with a </CustomText>
          <CustomText titiliumBold>WalletConnect</CustomText>
          <CustomText titilium> wallet.</CustomText>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Button
            onPress={() => {
              props.navigation.navigate(ScreenNames.Scanner, {
                onScan: (data) => {
                  scanQR(data);
                }
              })
            }}
            label={'Scan  '}
            rightIcon={<QRCode />}
            buttonContainerStyle={{ flexDirection: "row" }} />
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
            const address = item.namespaces['eip155'].accounts?.[0].split(':')?.[2] || "---";
            const peerMetadata = item.peer?.metadata || {};
            return (
              <View style={styles.pairedItem}>
                <Image source={{ uri: peerMetadata?.icons?.[0] }} style={styles.peerIcon} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <CustomText titiliumSemiBold numberOfLines={1}>{peerMetadata?.name}</CustomText>
                  <CustomText titilium caption color={themeColors.black300}>Expiry: {moment(item.expiry * 1000).format("MMM DD, yyyy hh:mm")}</CustomText>
                  <CustomText titiliumSemiBold color={themeColors.white} style={{ marginTop: 4 }} >{ndauUtils.truncateAddress(address)}</CustomText>
                </View>
                <TouchableOpacity onPress={() => disconnect(item.topic)} style={{ padding: 10 }}>
                  <Delete color={themeColors.dangerFlashBackground} />
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </>
      {!!loading && <Loading label={loading} />}
      <ApprovalModal
        onApprove={() => {
          ApprovalModalHandler.acceptLoading(true);
          approve(account.accountAddress).then(res => {

            console.log(res,'Approveres-----')
            ApprovalModalHandler.acceptLoading(false);
            ApprovalModalHandler.hide();
          }).catch(err => {
            ApprovalModalHandler.acceptLoading(false);
            FlashNotification.show(err.message);
          })
        }}
        onReject={() => {
          reject().then(() => {
            ApprovalModalHandler.rejectLoading(false);
            ApprovalModalHandler.hide();
          }).catch(err => {
            ApprovalModalHandler.rejectLoading(false);
            FlashNotification.show(err.message);
          })
        }}
      />
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
    borderColor: themeColors.warning400,
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
