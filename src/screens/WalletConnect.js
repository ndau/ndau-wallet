import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";

import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { useWallet, useWalletConnect } from "../hooks";
import Button from "../components/Button";
import { themeColors } from "../config/colors";
import { Converters, EthersScanAPI } from "../helpers/EthersScanAPI";
import { ndauUtils } from "../utils";

const WalletConnect = (props) => {
  const { item } = props.route?.params ?? {};
  const {
    loading,
    proposal,
    connectWithURI,
    clientInitialized
  } = useWalletConnect();

  const { getActiveWallet } = useWallet();

  const [account, setAccount] = useState({
    accountAddress: "",
    totalFunds: "",
    usdAmount: ""
  })

  useEffect(() => {
    if (clientInitialized) {
      connectWithURI("wc:dac3c7e2fc3ca7d06d2a8e2cf613ea2377bd38805dc6090f1c06ee33b23c4a37@2?relay-protocol=irn&symKey=fb240ae78afe8ef5fd3e12850274acc67b56f10f1adb0fb195a7961a2cb3f321")
    }
  }, [clientInitialized])

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
          />
          <Spacer height={10} />
          <Button
            label={'Reject'}
            buttonContainerStyle={styles.rejectButton}
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

  return (
    <ScreenContainer>
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
  }
});

export default WalletConnect;
