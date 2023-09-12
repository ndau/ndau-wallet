import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { Check } from "../assets/svgs/components";
import SettingsStore from "../stores/SettingsStore";

const Environments = () => {
  const navigation = useNavigation();

  const [env, setEnv] = useState([
    { id: 0, name: "Mainnet", selected: false },
    { id: 1, name: "Testnet", selected: false },
    { id: 2, name: "Devnet", selected: false }
  ])

  const handleEnv = (item) => {
    setEnv(_ => {
      const prev = [..._];
      prev.forEach(e => {
        e.selected = e.id === item.id;
        return e;
      })
      return prev;
    })
  }

  useEffect(() => {
    const selected = env.filter(e => e.selected)[0];
    if (selected) {
      if (selected.id === 0) SettingsStore.useMainNet();
      else if (selected.id === 1) SettingsStore.useTestNet();
      else if (selected.id === 2) SettingsStore.useDevNet();
    } else {
      const mode = SettingsStore._settings?.applicationNetwork || "mainnet";
      if (mode == "mainnet") handleEnv({ id: 0 });
      else if (mode == "testnet") handleEnv({ id: 1 });
      if (mode == "devnet") handleEnv({ id: 2 });
    }
  }, [env])

  return (
    <ScreenContainer>
      <Spacer height={14} />
      <CustomText titilium style={styles.margin}>Select which node environments would you like to use.</CustomText>
      <Spacer height={20} />
      <View style={styles.container}>
        <FlatList
          data={env}
          keyExtractor={(i, _) => _.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity activeOpacity={0.8} onPress={() => handleEnv(item)}>
                <View style={[styles.item, item.selected && styles.selected]}>
                  <CustomText titilium body style={[{ flex: 1 }]}>{item.name}</CustomText>
                  {item.selected && <Check />}
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 1,
    borderColor: themeColors.primary,
    borderRadius: 30,
    marginBottom: 14,
    alignItems: "center",
    flexDirection: "row"
  },
  selected: {
    backgroundColor: themeColors.primary
  }
});

export default Environments;
