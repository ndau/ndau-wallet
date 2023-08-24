import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import { ethers } from "ethers";

import { Copy, ErrorIcon, WalletSuccessSVGComponent } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import SeedPhraseCapsule from "../components/SeedPhraseCapsule";
import Spacer from "../components/Spacer";
import StateButton from "../components/StateButton";
import { themeColors } from "../config/colors";
import { SeedPhrase as SeedPhraseGen } from "../utils/SeedPhrase";
import Loading from "../components/Loading";
import Modal, { ModalImage } from "../components/Modal";
import { ScreenNames } from "../screens/ScreenNames";
import SetupStore from "../stores/SetupStore";
import UserStore from "../stores/UserStore";
import { useWallet } from "../hooks";
import UserData from "../model/UserData";

const SeedPhrase = (props) => {

  const { forCreation, item } = props?.route?.params ?? {};
  const navigation = useNavigation();
  const { addLegacyWallet, addWalletWithAddress } = useWallet();

  const indeces = useRef([...Array(12)].map((_, i) => i)).current;
  const modalRef = useRef(null);
  const timeoutRef = useRef(null);
  const [invalid, setInvalid] = useState(false);
  const [seeds, setSeeds] = useState([]);
  const [choosed, setChoosed] = useState(indeces.reduce((prev, curr) => ({ ...prev, [curr]: { showIndex: true, selected: false, index: curr } }), []));

  const [seedWroteIt, setSeedWroteIt] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Continue");
  const [loading, setLoading] = useState(false);

  const hideNumbers = (flag = false) => {
    Object.keys(choosed).forEach((key) => {
      choosed[key].showIndex = flag;
    })
  }

  useEffect(() => {
    setTimeout(() => {
      SeedPhraseGen.generateSeed((data) => {
        SetupStore.recoveryPhrase = data.map(i => i.seed);
        setSeeds(data)
      }, item.type !== "LEGACY");
    }, 0);
  }, [])

  const resetSeed = () => {
    hideNumbers(true);
    setSeeds([...SeedPhraseGen.sortAsc(seeds)])
    setSeedWroteIt(false);
    setButtonDisabled(false);
    setButtonText("Continue");
  }

  const createWallet = () => {
    modalRef.current(true);
  }

  const handleContinue = () => {
    if (buttonText === "Create Wallet") return createWallet();
    hideNumbers();
    setSeeds([...SeedPhraseGen.shuffle(seeds)]);
    setSeedWroteIt(true);
    setButtonDisabled(true);
    setButtonText("Create Wallet");
  };

  const handleDone = async () => {
    modalRef.current(false);

    const isUserSetup = UserStore.isUserSetup();
    if (isUserSetup) {
      // user is already setup, no need send the user to the protect wallet
      // Let's save this wallet in the current user

      if (item.type === "LEGACY") {
        setLoading(true);
        let user = UserStore.getUser();
        user = await addLegacyWallet(user);
        await UserData.loadUserData(user);
        setLoading(false);
        navigateToDashboard();
        
      } else {
        await addEVMWallet();
      }

    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.ProtectWallet, params: { item } }],
        })
      );
    }
  };

  const addEVMWallet = async () => {
    setLoading(true);
    const data = ethers.Wallet.fromPhrase(SetupStore.recoveryPhrase.join(' '))
    await addWalletWithAddress(data);
    setLoading(false);
    navigateToDashboard();
  }

  const navigateToDashboard = () => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.TabNav }],
        })
      );
    }, 200);
  }

  const Phrase = useCallback(({ success, onIvalideSelect }) => {

    const cachedSelected = useRef([]).current;
    const seedPhrase = seeds;

    const selectingSeed = (selectedIndex) => {
      cachedSelected.push(selectedIndex);
      cachedSelected.length === Object.keys(choosed).length && success();
    }

    if (seeds.length == 0) return <ActivityIndicator />
    return (
      <View style={styles.seedContainer}>
        <View style={[styles.row, { flex: 1 }]}>
          {
            seedPhrase.map((item, index) => {
              return index < 2 && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                onIvalideSelect={onIvalideSelect}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={[styles.row, { flex: 1 }]}>
          {
            seedPhrase.map((item, index) => {
              return (index >= 2 && index < 5) && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                onIvalideSelect={onIvalideSelect}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={index == 3 && styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={[styles.row, { flex: 1 }]}>
          {
            seedPhrase.map((item, index) => {
              return (index >= 5 && index < 7) && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                onIvalideSelect={onIvalideSelect}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={[styles.row, { flex: 1 }]}>
          {
            seedPhrase.map((item, index) => {
              return (index >= 7 && index < 9) && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                onIvalideSelect={onIvalideSelect}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={[styles.row, { flex: 1 }]}>
          {
            seedPhrase.map((item, index) => {
              return index >= 9 && index < 12 && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                onIvalideSelect={onIvalideSelect}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={index == 9 && styles.flex}
                item={item} />
            })
          }
        </View>
      </View>
    )
  }, [seeds, choosed]);

  const headings = useMemo(() => {
    const headings = {
      before: ['Back up your wallet', 'Your secret recovery phrase is used to recover your crypto if you lose your phone or switch to a different wallet.'],
      after: ['Did you save it?', 'Please confirm by selecting all 12 words in sequence as mentioned on previous screen. This ensures secure account access in the future.'],
    }
    return seedWroteIt ? headings.after : headings.before
  }, [seedWroteIt])

  const renderError = () => {
    return invalid && !!seedWroteIt && (
      <View style={styles.msgBox}>
        <ErrorIcon />
        <CustomText titilium color={themeColors.dangerFlashBackground} style={{ marginLeft: 4 }}>{"Invalid order. Try again!"}</CustomText>
      </View>
    )
  }

  return (
    <ScreenContainer
      preventBackPress={seedWroteIt ? resetSeed : undefined}
      steps={{ total: 4, current: 3 }}>
      {!!loading && <Loading label={'Connecting with blockchain...'} />}
      <Spacer height={10} />
      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <CustomText h6 semiBold style={styles.margin}>{headings[0]}</CustomText>
          <CustomText titilium body2 style={styles.margin}>{headings[1]}</CustomText>
        </View>
        <Phrase
          success={() => setButtonDisabled(false)}
          onIvalideSelect={() => {
            setInvalid(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setInvalid(false), 2000);
          }} />
      </View>
      <View style={styles.lowerBar}>
        {
          !seedWroteIt ? (
            <View style={styles.row}>
              <CustomText titilium body2 style={{ flex: 1, paddingRight: 20 }}>
                Save these 12 words in a secure location, and never share them with anyone.
              </CustomText>
              <StateButton
                resetToPrevious
                onButtonPress={() => {
                  Clipboard.setString(seeds.map(({ seed }) => seed).join(' '))
                }}
                states={[
                  (
                    <View style={styles.buttonCopy}>
                      <CustomText titiliumSemiBolds body2 style={{ marginRight: 6 }}>Copy</CustomText>
                      <Copy />
                    </View>
                  ),
                  (
                    <View style={styles.buttonCopied}>
                      <CustomText titiliumSemiBolds body2>Copied</CustomText>
                    </View>
                  )
                ]}
              />
            </View>
          ) : renderError()
        }
      </View>
      <Button
        disabled={seeds.length == 0 || buttonDisabled}
        label={buttonText}
        onPress={handleContinue}
      />
      <Modal bridge={modalRef}>
        <View style={styles.modal}>
          <WalletSuccessSVGComponent/>
          <CustomText titiliumSemiBold body>Your wallet was successfully created</CustomText>
        </View>
        <Button label={'Done'} onPress={handleDone} />
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {
    marginBottom: 10,
  },
  buttonTerms: {
    backgroundColor: themeColors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20
  },
  seedContainer: {
    flex: 1,
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  buttonCopy: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: themeColors.white
  },
  buttonCopied: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: themeColors.primary
  },
  flex: {
    flex: 1
  },
  modal: {
    alignItems: "center",
    marginVertical: 20
  },
  msgBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  lowerBar: {
    marginTop: 10,
    height: 70
  }
});

export default SeedPhrase;
