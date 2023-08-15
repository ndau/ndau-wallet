import { ethers } from "ethers";

import AppConstants from "../AppConstants";
import SetupStore from "../stores/SetupStore";
import { KeyAddr } from "../helpers/KeyAddrManager";

export const SeedPhrase = {

  shuffle: (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  },

  getChooseIndecies: (min, max) => {
    return parseInt(Math.random() * (max - min) + min);
  },

  sortAsc: seed => seed.sort((itemA, itemB) => itemA.index < itemB.index ? -1 : 1),

  generateSeed: (onGenerate) => {
    // if (usingEtherLibrary) {
    //   const mnemonic = ethers.Wallet.createRandom().mnemonic;
    //   SetupStore.entropy = mnemonic.entropy;
    //   return onGenerate(mnemonic.phrase.split(" ").map((seed, index) => ({ seed, index })))
    // }

    KeyAddr.wordsFromBytes(AppConstants.APP_LANGUAGE, SetupStore.entropy).then(seeds => {
      try {
        onGenerate(seeds.split(" ").map((seed, index) => ({ seed, index })))
      } catch (e) { onGenerate([]) }
    });

    return [
      { seed: 'ridge', index: 0 },
      { seed: 'during', index: 1 },
      { seed: 'describe', index: 2 },
      { seed: 'idle', index: 3 },
      { seed: 'dynamic', index: 4 },
      { seed: 'minor', index: 5 },
      { seed: 'discover', index: 6 },
      { seed: 'obtain', index: 7 },
      { seed: 'taxi', index: 8 },
      { seed: 'banana', index: 9 },
      { seed: 'high', index: 10 },
      { seed: 'universe', index: 11 }
    ];
  }
}