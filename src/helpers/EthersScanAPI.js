import { ethers } from "ethers";
import * as zkSync from "zksync-web3";

import APICommunicationHelper from "./APICommunicationHelper"
import UserStore from "../stores/UserStore";
import SettingsStore from "../stores/SettingsStore";

export const Converters = {
  WEI_ETH: (wei) => wei / Math.pow(10, 18),
  ETH_USD: (eth, usd) => (eth * usd).toFixed(4)
}

export const EthersScanAPI = {

  networks: {
    MAIN: "mainnet",
    goerli: "goerli"
  },

  // endpoint: "https://api.etherscan.io/api?",
  endpoint: "https://api-goerli.etherscan.io/api?",
  // apiKey: "JT1CHNSEQUDB3XMHZ9BNQPB6Y3QKRAWSWB", // 
  apiKey: "RMY86WJ2479F3RH4UB26D17CR9MPXAR3SK",

  modules: {
    ACCOUNT: "account",
    STATS: "stats",
  },

  actions: {
    BALANCE: "balance",
    ETH_PRICE: "ethprice",
    TOKEN_BALANCE: "tokenbalance",
    TOKEN_BALANCE_HISTORY: "tokenbalancehistory"
  },

  contractaddress: {
    mainnet: {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
    },
    goerli: {
      USDC: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
      MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
    }
  },

  getContractAddress: () => {
    let contracts = { ...EthersScanAPI.contractaddress.mainnet }
    if (SettingsStore._settings.applicationNetwork === "testnet") contracts = { ...EthersScanAPI.contractaddress.goerli };
    return contracts;
  },

  __getFormattedEndpoint: ({ module, action, params }) => {
    return `${EthersScanAPI.endpoint}module=${module}&action=${action}&apiKey=${EthersScanAPI.apiKey}&tag=latest&${EthersScanAPI.__params(params)}`
  },

  __params: (params) => {
    if (!params) return "";
    let paramsStr = "";
    Object.keys(params).forEach((key, index, arr) => {
      if (params[key]) {
        paramsStr += `${key}=${params[key]}`
      }
      if (index < arr.length - 1) paramsStr += "&"
    });
    return paramsStr;
  },

  getEthPriceInUSD: () => {
    return new Promise((resolve, reject) => {
      const apiToCall = EthersScanAPI.__getFormattedEndpoint({
        module: EthersScanAPI.modules.STATS,
        action: EthersScanAPI.actions.ETH_PRICE,
        params: {}
      })
      APICommunicationHelper.get(apiToCall).then(res => {
        if (res.message === "OK") resolve(res);
        else reject(res);
      }).catch(err => reject(err))
    })
  },

  getAddressBalance: (address, contractaddress = undefined) => {

    return new Promise((resolve, reject) => {
      const apiToCall = EthersScanAPI.__getFormattedEndpoint({
        module: EthersScanAPI.modules.ACCOUNT,
        action: contractaddress ? EthersScanAPI.actions.TOKEN_BALANCE : EthersScanAPI.actions.BALANCE,
        params: { address, contractaddress }
      })

      APICommunicationHelper.get(apiToCall).then(res => {
        if (res.message === "OK") resolve(res);
        else reject(res);
      }).catch(err => reject(err))
    })
  },

  getCheck: async () => {
    try {
      const providerUrl = 'https://polygon-mumbai.g.alchemy.com/v2/Z_G5HhyiXdXZ9j0-uJ4B7SZr_oCk4xSN';
      const userAddress = '0xF54C7538Fbdd77FAe4085a422CeAf3AcA37596Fd';

      const provider = new ethers.providers.EtherscanProvider('goerli', EthersScanAPI.apiKey)

      // Define the MATIC token contract ABI
      const tokenAbi = [
        "function balanceOf(address) view returns (uint256)",
      ];

      // Create an instance of the MATIC token contract
      const maticTokenContract = new ethers.Contract(EthersScanAPI.contractaddress.USDC, tokenAbi, provider);
      const balance = await maticTokenContract.balanceOf("0xF54C7538Fbdd77FAe4085a422CeAf3AcA37596Fd");
      const tokenSymbol = await maticTokenContract.symbol();
      console.log(`MATIC Balance for ${userAddress}: ${ethers.utils.formatUnits(balance, 18)} ${tokenSymbol}`);

    } catch (error) {
      console.error('Error fetching:', error);
    }
  }
}

export const ZkSkyncApi = {

  url: "https://block-explorer-api.testnets.zksync.dev",

  getZksyncAddressBalance: () => {
    return new Promise((resolve, reject) => {
      const address = UserStore.getActiveWallet().ercAddress;
      APICommunicationHelper.get(`${ZkSkyncApi.url}/address/${address}`).then(res => {
        if (res.balances) {
          const availabeBalances = [];
          Object.keys(res.balances).forEach(key => {
            const obj = res.balances[key];
            if (obj.token.symbol === "NPAY") {
              obj.totalFunds = ethers.utils.formatUnits(obj.balance, obj.token.decimals);
              availabeBalances.push(obj);
            }
          })
          resolve(availabeBalances);
        }
      }).catch(err => reject(err));
    })
  }
}