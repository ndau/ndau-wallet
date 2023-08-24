import { Wallet, ethers } from "ethers";

import AppConstants from "../AppConstants";
import SetupStore from "../stores/SetupStore";
import { KeyAddr } from "../helpers/KeyAddrManager";
import EntropyHelper from "../helpers/EntropyHelper";

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
    const hexEntropy = ethers.utils.randomBytes(16);
    const mnemonic = ethers.utils.entropyToMnemonic(hexEntropy);
    onGenerate(mnemonic.split(" ").map((seed, index) => ({ seed, index })))
  }
}