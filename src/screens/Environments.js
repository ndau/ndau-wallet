import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { Check } from "../assets/svgs/components";
import SettingsStore from "../stores/SettingsStore";
import ServiceDiscovery from "../api/ServiceDiscovery";
import FlashNotification from "../components/common/FlashNotification";
import Loading from "../components/Loading";

const Environments = () => {

  const [env, setEnv] = useState([
    { id: 0, name: "Mainnet", selected: false },
    { id: 1, name: "Testnet", selected: false },
    { id: 2, name: "Devnet", selected: false }
  ])

  const [loading, setLoading] = useState("");

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

  const handleEnvPress = (loadingText = "Connecting with blockchain nodes") => {
    return new Promise((resolve, reject) => {
      setLoading(loadingText);
      ServiceDiscovery.invalidateCache();
      ServiceDiscovery.getNodeAddress().then(res => {
        setLoading("");
        resolve(res);
      }).catch(err => {
        setLoading("");
        FlashNotification.show(err.message, true);
        reject(err);
      })
    })
  }

  useEffect(() => {
    const selected = env.filter(e => e.selected)[0];
    if (selected) {
      if (selected.id === 0) {
        SettingsStore.useMainNet();
        handleEnvPress().catch(err => {

        });
      } else if (selected.id === 1) {
        SettingsStore.useTestNet();
        handleEnvPress().catch(err => {
          SettingsStore.useMainNet();
          handleEnvPress("Reverting back to Mainnet").then(res => {
            handleEnv({ id: 0 });
          });
        });
      } else if (selected.id === 2) {
        SettingsStore.useDevNet();
        handleEnvPress().catch(err => {
          SettingsStore.useMainNet();
          handleEnvPress("Reverting back to Mainnet").then(res => {
            handleEnv({ id: 0 });
          });
        });
      }
    } else {
      const mode = SettingsStore._settings?.applicationNetwork || "mainnet";
      if (mode == "mainnet") handleEnv({ id: 0 });
      else if (mode == "testnet") handleEnv({ id: 1 });
      if (mode == "devnet") handleEnv({ id: 2 });
    }
  }, [env])

  return (
    <ScreenContainer changeHandler={env}>
      <Spacer height={14} />
      <CustomText titilium style={styles.margin}>Select which node environments would you like to use.</CustomText>
      <Spacer height={20} />
      <View style={styles.container}>
        <FlatList
          data={env}
          keyExtractor={(i, _) => _.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity disabled={env[index].selected && item.id === env[index].id} activeOpacity={0.8} onPress={() => handleEnv(item)}>
                <View style={[styles.item, item.selected && styles.selected]}>
                  <CustomText titilium body style={[{ flex: 1 }]}>{item.name}</CustomText>
                  {item.selected && <Check />}
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      {!!loading && <Loading label={loading} />}
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
