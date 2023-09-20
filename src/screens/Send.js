import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { QRCode } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomTextInput from "../components/CustomTextInput";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import FlashNotification from "../components/common/FlashNotification";
import { themeColors } from "../config/colors";
import { useTransaction } from "../hooks";
import useNotification from "../hooks/useNotification";
import UserStore from "../stores/UserStore";
import { ScreenNames } from "./ScreenNames";

const Send = (props) => {
  const { item } = props?.route?.params ?? {};
  const { savedNotifications } = useNotification()
  const navigation = useNavigation();
  const {
    getTransactionFee,
    sendAmountToNdauAddress,
    sendFunds,
    estimateGasFeeFor
  } = useTransaction();
  const [section, setSection] = useState(0);
  const [ndauAddress, setNdauAddress] = useState("");
  const [ndauAmount, setNdauAmount] = useState("");
  const [loading, setLoading] = useState("");
  const [errors, setErrors] = useState([]);
  const [transaction, setTransaction] = useState({
    transactionFee: 0,
    sib: 0,
    total: 0
  })

  const renderDetail = ({ title, value }) => {
    return (
      value !== undefined ? (
        <View style={styles.detailContainer}>
          <CustomText titiliumSemiBold style={styles.textPara}>{title}</CustomText>
          <CustomText titiliumSemiBold style={styles.textPara}>{value}</CustomText>
        </View>
      ) : null
    )
  }

  const getName = () => {
    return item?.shortName || "Ndau";
  }

  const getRemainBalance = (amount) => {
    try {
      const toShow = parseFloat(item.totalFunds - (amount || transaction.total)).toFixed(3);
      return toShow < 0 ? 0 : toShow
    } catch (e) {
      return "0"
    }
  }

  const renderEnterAddress = () => {
    return (
      <>
        <Spacer height={16} />
        <CustomText titiliumSemiBold body>Who you are sending to?</CustomText>
        <Spacer height={10} />
        <CustomTextInput
          label={'Address'}
          placeholder={getName() + " address"}
          value={ndauAddress}
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
            onPress={() => {
              navigation.navigate(ScreenNames.Scanner, { onScan: (data) => setNdauAddress(data) })
            }}
            buttonContainerStyle={styles.qrCodeButton}
          />
          <Button
            disabled={ndauAddress.length === 0}
            label={"Next"}
            onPress={() => {
              if (ndauAddress === item.address) {
                return FlashNotification.show("You can't send funds within same account");
              }
              setSection(1)
            }}
          />
        </View>
      </>
    )
  };

  const renderEnterAmmount = () => {

    const getQuotes = () => {
      setLoading("Updating");
      if (item.shortName) {
        estimateGasFeeFor(item.shortName, ndauAddress, ndauAmount).then(res => {
          setLoading("");
          setTransaction({
            transactionFee: res.ethPrice,
            sib: undefined,
            total: parseFloat(res.ethPrice) + parseFloat(ndauAmount)
          });
          setSection(2);
        }).catch(err => {
          setLoading("");
          if (err.reason?.includes("ENS name not configured")) {
            FlashNotification.show("Address not found (" + ndauAddress + ")", true)
          } else if (err.body) {
            try {
              const body = JSON.parse(err.body);
              FlashNotification.show(body.error.message)
            } catch (e) {
              FlashNotification.show(err.reason, true)
            }
          } else {
            FlashNotification.show(err.message, true)
          }
        })
      } else {
        getTransactionFee(
          UserStore.getAccountDetail(item.address),
          ndauAddress,
          ndauAmount
        ).then(res => {
          setLoading("");
          setTransaction(res);
          setSection(2);
        }).catch(err => {
          FlashNotification.show(`${err.reason}`, true);
          setLoading("");
          console.log('error', JSON.stringify(err.message, null, 2));
        });
      }
    }

    return (
      <>
        <Spacer height={16} />
        <CustomText titiliumSemiBold body>How much are you sending?</CustomText>
        <Spacer height={10} />
        <CustomTextInput
          label={getName() + ' amount'}
          value={ndauAmount}
          placeholder={"Enter amount"}
          // placeholder={getName() + " amount"}
          errors={errors}
          onChangeText={(t) => {
            if (t[0] === "0" && t[1] === "0") return
            if (/^\d*\.?\d*$/.test(t)) {
              setNdauAmount(t)
              if (parseFloat(t) <= parseFloat(item.totalFunds)) {
                setErrors([]);
              } else if (t.length > 0 && t !== ".") {
                setErrors(["Insufficent balance"]);
              }
            } else {
              setErrors([]);
            }
          }}
          maxLength={10}
        // onBlur={getQuotes}
        />

        <Spacer height={10} />
        <View style={styles.remainngContainer}>
          <CustomText titilium style={{ flex: 1 }}>Remaining Balance</CustomText>
          <Image style={styles.icon} source={item.image} />
          <CustomText titilium style={{ marginHorizontal: 6 }}>{getRemainBalance(ndauAmount)}</CustomText>
        </View>
        <View style={styles.container}>
          <View style={[styles.separator, { flex: undefined, marginVertical: 20 }]} />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <CustomText titiliumSemiBold h6>Fees</CustomText>
              <Spacer height={10} />
              {renderDetail({ title: "Transaction Fee", value: transaction.transactionFee })}
              {!item?.shortName && renderDetail({ title: "SIB", value: transaction.sib })}
              {renderDetail({ title: "Total", value: parseFloat(transaction.total).toFixed(8) })}
            </View>
            <Button
              disabled={errors.length > 0 || ndauAmount.length === 0}
              label={"Next"}
              onPress={getQuotes}
            />
          </View>
        </View>
      </>
    )
  }

  const sendTheAmount = () => {
    setLoading("Sending...");

    if (item.shortName) {
      sendFunds(
        item.shortName,
        ndauAddress,
        ndauAmount
      ).then(res => {
        setLoading("");
        savedNotifications(`${ndauAmount} ${item?.shortName?.toUpperCase()} was successfully transfered `, true, item?.shortName, item?.address, ndauAddress)
        navigation.goBack();
      }).catch(err => {
        setLoading("");
        savedNotifications(err?.reason, false, item?.shortName, item?.address, ndauAddress)
        FlashNotification.show(err.reason, true)
      })
    } else {
      sendAmountToNdauAddress(
        UserStore.getAccountDetail(item.address),
        ndauAddress,
        ndauAmount
      ).then(response => {
        savedNotifications(`${ndauAmount} NDAU was successfully transfered `, true, 'ndau', item?.address, ndauAddress)
        setLoading("");
        navigation.goBack();
      }).catch(err => {
        savedNotifications(err.message, false, 'ndau', item?.address, ndauAddress)
        setLoading("")
        FlashNotification.show(`${err.message}`);
      })

    }

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
          <CustomText titilium style={{ marginHorizontal: 6 }}>{transaction.total}</CustomText>
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
              {renderDetail({ title: "Transaction Fee", value: transaction.transactionFee })}
              {renderDetail({ title: "SIB", value: transaction.sib })}
              {renderDetail({ title: "Total", value: parseFloat(transaction.total) })}
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
    if (section === 1) {
      setNdauAmount("");
      setTransaction({
        transactionFee: 0,
        sib: 0,
        total: 0
      })
    } else if (section === 2) {
      setTransaction({
        transactionFee: 0,
        sib: 0,
        total: 0
      })
    }
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
