import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Clipboard from "@react-native-clipboard/clipboard";

import { Copy } from "../assets/svgs/components";
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
import { useWallet } from "../redux/hooks";
import SetupStore from "../stores/SetupStore";

const SeedPhrase = () => {

  const { addWallet } = useWallet();
  const navigation = useNavigation();

  const indeces = useRef([...Array(12)].map((_, i) => i)).current;
  const modalRef = useRef(null);
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
    SeedPhraseGen.generateSeed((data) => {
      SetupStore.recoveryPhrase = data.map(i => i.seed);
      setSeeds(data)
    });
  }, [])

  const resetSeed = () => {
    hideNumbers(true);
    setSeeds([...SeedPhraseGen.sortAsc(seeds)])
    setSeedWroteIt(false);
    setButtonDisabled(false);
    setButtonText("Continue");
  }

  const createWallet = () => {
    setLoading(true);

    // SetupStore.walletId = "Main Wallet 1";
    // addWallet({ name: "Main Wallet", privateKey: "", publicKey: "" });

    setTimeout(() => {
      setLoading(false);
      modalRef.current(true);
    }, 2000);
  }

  const handleContinue = () => {
    if (buttonText === "Create Wallet") return createWallet();
    hideNumbers();
    setSeeds([...SeedPhraseGen.shuffle(seeds)]);
    setSeedWroteIt(true);
    setButtonDisabled(true);
    setButtonText("Create Wallet");
  };

  const handleDone = () => {
    modalRef.current(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreenNames.ProtectWallet }],
      })
    );
  };

  const Phrase = useCallback(({ success }) => {

    const cachedSelected = useRef([]).current;
    const seedPhrase = seeds;

    const selectingSeed = (selectedIndex) => {
      cachedSelected.push(selectedIndex);
      cachedSelected.length === Object.keys(choosed).length && success();
    }

    return (
      <View style={styles.seedContainer}>
        <View style={styles.row}>
          {
            seedPhrase.map((item, index) => {
              return index < 2 && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((item, index) => {
              return (index >= 2 && index < 5) && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={index == 3 && styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((item, index) => {
              return (index >= 5 && index < 7) && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((item, index) => {
              return (index >= 7 && index < 9) && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
                cachedSelected={cachedSelected}
                index={index}
                selected={choosed}
                style={styles.flex}
                item={item} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((item, index) => {
              return index >= 9 && index < 12 && <SeedPhraseCapsule
                key={index}
                disabled={!seedWroteIt}
                onSelect={selectingSeed}
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
      after: ['Did you save it?', 'Please confirm you saved your recovery phrase by selecting the 1st and 12th words. This ensures secure account access in the future.'],
    }
    return seedWroteIt ? headings.after : headings.before
  }, [seedWroteIt])

  return (
    <ScreenContainer
      preventBackPress={seedWroteIt ? resetSeed : undefined}
      steps={{ total: 4, current: 3 }}>
      {!!loading && <Loading label={'Creating Wallet'} />}
      <Spacer height={10} />
      <View style={styles.container}>
        <View style={{ height: 70 }}>
          <CustomText h6 semiBold style={styles.margin}>{headings[0]}</CustomText>
          <CustomText titilium body2 style={styles.margin}>{headings[1]}</CustomText>
        </View>
        <Spacer height={16} />
        <ScrollView style={{ paddingTop: 10, paddingLeft: 10 }} bounces={false}>
          <Phrase success={() => setButtonDisabled(false)} />
        </ScrollView>
      </View>
      {
        !seedWroteIt && (
          <View style={styles.row}>
            <CustomText titilium style={{ flex: 1 }}>
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
                    <CustomText titiliumSemiBolds>Copy</CustomText>
                    <Copy />
                  </View>
                ),
                (
                  <View style={styles.buttonCopied}>
                    <CustomText titiliumSemiBolds>Copied</CustomText>
                  </View>
                )
              ]}
            />
          </View>
        )
      }
      <Spacer height={10} />
      <Button
        // disabled={buttonDisabled}
        label={buttonText}
        onPress={handleContinue}
      />
      <Modal bridge={modalRef}>
        <View style={styles.modal}>
          <ModalImage />
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
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
  }
});

export default SeedPhrase;
