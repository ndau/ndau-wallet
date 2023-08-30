import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { QRCode } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import Loading from "../components/Loading";
import AppConstants from "../AppConstants";

const Send = (props) => {
  const { item } = props?.route?.params ?? {};

  const navigation = useNavigation();

  const [section, setSection] = useState(0);
  const [ndauAddress, setNdauAddress] = useState("");
  const [ndauAmount, setNdauAmount] = useState("");
  const [loading, setLoading] = useState("");

  const renderDetail = ({ title, value }) => {
    return (
      <View style={styles.detailContainer}>
        <CustomText titiliumSemiBold style={styles.textPara}>{title}</CustomText>
        <CustomText titiliumSemiBold style={styles.textPara}>{value}</CustomText>
      </View>
    )
  }

  const getRemainBalance = () => {
    try {
      const toShow = parseFloat(item.totalFunds - ndauAmount).toFixed(3);
      return toShow < 0 ? 0 : toShow
    } catch (e) {
      return "0"
    }
  }

  const renderEnterAddress = () => {
    return (
      <>
        <Spacer height={16} />
        <CustomText titiliumSemiBold body>Who are you send to?</CustomText>
        <Spacer height={10} />
        <CustomTextInput
          label={'Address'}
          placeholder={"ndau address"}
          onChangeText={setNdauAddress}
        />
        <View style={styles.container}>
          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <CustomText titiliumSemiBold body style={{ marginHorizontal: 10 }}>OR</CustomText>
            <View style={styles.separator} />
          </View>
          <Button
            label={"Scan QR Code  "}
            rightIcon={<QRCode />}
            onPress={() => { }}
            buttonContainerStyle={styles.qrCodeButton}
          />
          <Button
            disabled={ndauAddress.length === 0}
            label={"Next"}
            onPress={() => setSection(1)}
          />
        </View>
      </>
    )
  };

  const renderEnterAmmount = () => {

    const getQuotes = () => {
      setLoading("Updating");
      setTimeout(() => {
        setLoading("");
      }, 2000);
    }

    return (
      <>
        <Spacer height={16} />
        <CustomText titiliumSemiBold body>How much are you sending?</CustomText>
        <Spacer height={10} />
        <CustomTextInput
          label={'Ndau amount'}
          value={ndauAmount}
          placeholder={"ndau address"}
          onChangeText={setNdauAmount}
          onBlur={getQuotes}
        />

        <Spacer height={10} />
        <View style={styles.remainngContainer}>
          <CustomText titilium style={{ flex: 1 }}>Remaining Balance</CustomText>
          <Image style={styles.icon} source={item.image} />
          <CustomText titilium style={{ marginHorizontal: 6 }}>{getRemainBalance()}</CustomText>
        </View>
        <View style={styles.container}>
          <View style={[styles.separator, { flex: undefined, marginVertical: 20 }]} />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <CustomText titiliumSemiBold h6>Fees</CustomText>
              <Spacer height={10} />
              {renderDetail({ title: "Transaction Fee", value: AppConstants.TRANSACTION_FEE })}
              {renderDetail({ title: "SIB", value: "0" })}
              {renderDetail({ title: "Total", value: parseFloat(AppConstants.TRANSACTION_FEE + parseFloat(ndauAmount || 0)).toFixed(8) })}
            </View>
            <Button
              disabled={ndauAmount.length === 0}
              label={"Next"}
              onPress={() => setSection(2)}
            />
          </View>
        </View>
      </>
    )
  }

  const sendTheAmount = () => {
    setLoading("Sending...");
    setTimeout(() => {
      setLoading("");
      setTimeout(() => {
        navigation.goBack();
      }, 200);
    }, 2000);
  }

  const renderConfirmation = () => {

    return (
      <>
        <Spacer height={16} />
        <CustomText titiliumSemiBold body>Please confirm the order details below.</CustomText>
        <Spacer height={10} />
        <View style={styles.sendingToContainer}>
          <CustomText titiliumSemiBold body>Sending to</CustomText>
          <CustomText titilium caption style={{ marginTop: 10 }}>{ndauAddress}</CustomText>
        </View>

        <Spacer height={10} />
        <View style={styles.remainngContainer}>
          <CustomText titilium style={{ flex: 1 }}>Amount to be sent</CustomText>
          <Image style={styles.icon} source={item.image} />
          <CustomText titilium style={{ marginHorizontal: 6 }}>{ndauAmount}</CustomText>
        </View>
        <View style={styles.remainngContainer}>
          <CustomText titilium style={{ flex: 1 }}>Remaining Balance</CustomText>
          <Image style={styles.icon} source={item.image} />
          <CustomText titilium style={{ marginHorizontal: 6 }}>{getRemainBalance()}</CustomText>
        </View>
        <View style={styles.container}>
          <View style={[styles.separator, { flex: undefined, marginVertical: 20 }]} />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <CustomText titiliumSemiBold h6>Fees</CustomText>
              <Spacer height={10} />
              {renderDetail({ title: "Transaction Fee", value: AppConstants.TRANSACTION_FEE })}
              {renderDetail({ title: "SIB", value: "0" })}
              {renderDetail({ title: "Total", value: parseFloat(AppConstants.TRANSACTION_FEE + parseFloat(ndauAmount || 0)).toFixed(8) })}
            </View>
            <Button
              label={"Confirm & Send"}
              onPress={sendTheAmount}
            />
          </View>
        </View>
      </>
    )
  }

  const renderSection = () => {
    return (
      <>
        {
          section === 0 ?
            renderEnterAddress() :
            section === 1 ?
              renderEnterAmmount() :
              section === 2 ?
                renderConfirmation() :
                null
        }
      </>
    )
  };

  const handleBack = () => {
    if (section > 0) setSection(_ => _ -= 1);
    else navigation.goBack()
  }


  return (
    <ScreenContainer headerTitle="Send" preventBackPress={() => handleBack()}>
      {!!loading && <Loading label={loading} />}
      {renderSection()}
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
  qrCodeButton: {
    backgroundColor: undefined,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: themeColors.primary,
    marginBottom: 14
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  separator: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.black300
  },
  detailContainer: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: themeColors.white,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
    justifyContent: "space-between",
    backgroundColor: themeColors.black400 + "bb"
  },
  textPara: {
    marginVertical: 6,
    textAlign: "center"
  },
  remainngContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  icon: {
    height: 20,
    width: 20,
    borderRadius: 10
  },
  sendingToContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: themeColors.white,
    padding: 10,
    marginVertical: 10
  }
});

export default Send;
