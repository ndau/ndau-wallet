import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

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

const SeedPhrase = () => {

  const indeces = useRef([SeedPhraseGen.getChooseIndecies(0, 6), SeedPhraseGen.getChooseIndecies(7, 12)]).current;
  const [seeds, setSeeds] = useState(SeedPhraseGen.generateSeed())
  const [choosed, setChoosed] = useState({
    [indeces[0]]: { showIndex: true, selected: false, index: indeces[0] },
    [indeces[1]]: { showIndex: true, selected: false, index: indeces[1] }
  });
  const [seedWroteIt, setSeedWroteIt] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Continue");
  const [loading, setLoading] = useState(false);

  const hideNumbers = (flag = false) => {
    choosed[indeces[0]].showIndex = flag;
    choosed[indeces[1]].showIndex = flag;
  }

  const resetSeed = () => {
    hideNumbers(true);
    setSeeds([...SeedPhraseGen.sortAsc(seeds)])
    setSeedWroteIt(false);
    setButtonDisabled(false);
    setButtonText("Continue");
  }

  const createWallet = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
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

  const Phrase = useCallback(({ success }) => {

    const cachedSelected = useRef([]).current;
    const seedPhrase = seeds;

    const selectingSeed = (selectedIndex) => {
      cachedSelected.push(selectedIndex);
      const choosedKeyArray = Object.keys(choosed);
      let isSequenced = true;
      cachedSelected.map((key, index) => isSequenced = (key.index == choosedKeyArray[index]));
      cachedSelected.length === 2 && isSequenced && success();
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
      {!!loading && <Loading label={'Creating Wallet'}/>}
      <Spacer height={16} />
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>{headings[0]}</CustomText>
        <CustomText titilium body2 style={styles.margin}>{headings[1]}</CustomText>
        <Spacer height={16} />
        <Phrase success={() => setButtonDisabled(false)} />
      </View>
      <View style={styles.row}>
        <CustomText titilium style={{ flex: 1 }}>
          Save these 12 words in a secure location, and never share them with anyone.
        </CustomText>
        <StateButton
          resetToPrevious
          onButtonPress={() => null}
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
      <Spacer height={20} />
      <Button
        disabled={buttonDisabled}
        label={buttonText}
        onPress={handleContinue}
      />
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
    borderRadius: 20,
    borderColor: themeColors.fontLight,
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
  }
});

export default SeedPhrase;
