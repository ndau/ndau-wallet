import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import StateButton from "../components/StateButton";
import { Copy } from "../assets/svgs/components";
import { SeedPhrase as SeedPhraseGen } from "../utils/SeedPhrase";
import SeedPhraseCapsule from "../components/SeedPhraseCapsule";

const SeedPhrase = () => {

  const [choosed, setChoosed] = useState({
    [SeedPhraseGen.getChooseIndecies(0, 6)]: true,
    [SeedPhraseGen.getChooseIndecies(7, 12)]: true
  });
  const [seeds, setSeeds] = useState(SeedPhraseGen.generateSeed())

  const handleContinue = () => {
    setSeeds([...SeedPhraseGen.shuffle(seeds)]);
  };

  const Phrase = useCallback(() => {
    const seedPhrase = seeds;
    return (
      <View style={styles.seedContainer}>
        <View style={styles.row}>
          {
            seedPhrase.map((seed, index) => {
              return index < 2 && <SeedPhraseCapsule
                key={index}
                index={index}
                selected={choosed[index]}
                style={styles.flex}
                label={seed} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((seed, index) => {
              return (index >= 2 && index < 5) && <SeedPhraseCapsule
                key={index}
                index={index}
                selected={choosed[index]}
                style={index == 3 && styles.flex}
                label={seed} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((seed, index) => {
              return (index >= 5 && index < 7) && <SeedPhraseCapsule
                key={index}
                index={index}
                selected={choosed[index]}
                style={styles.flex}
                label={seed} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((seed, index) => {
              return (index >= 7 && index < 9) && <SeedPhraseCapsule
                key={index}
                index={index}
                selected={choosed[index]}
                style={styles.flex}
                label={seed} />
            })
          }
        </View>
        <View style={styles.row}>
          {
            seedPhrase.map((seed, index) => {
              return index >= 9 && index < 12 && <SeedPhraseCapsule
                key={index}
                index={index}
                selected={choosed[index]}
                style={index == 9 && styles.flex}
                label={seed} />
            })
          }
        </View>
      </View>
    )
  }, [seeds, choosed]);

  return (
    <ScreenContainer steps={{ total: 4, current: 3 }}>
      <Spacer height={16} />
      <View style={styles.container}>
        <CustomText h6 semiBold style={styles.margin}>Back up your wallet</CustomText>
        <CustomText titilium body2 style={styles.margin}>
          Your secret recovery phrase is used to recover your crypto if you lose your phone or switch to a different wallet.
        </CustomText>
        <Spacer height={16} />
        <Phrase />
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
        label={"Continue"}
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
    marginBottom: 20
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
