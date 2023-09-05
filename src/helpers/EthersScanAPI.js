import { ethers } from "ethers";
import APICommunicationHelper from "./APICommunicationHelper"

import UserStore from "../stores/UserStore";

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

  rpcUrl: {
    MAIN: "https://mainnet.era.zksync.io",
    TESTNET: "https://testnet.era.zksync.dev"
  },

  actions: {
    BALANCE: "balance",
    ETH_PRICE: "ethprice",
    TOKEN_BALANCE: "tokenbalance",
    TOKEN_BALANCE_HISTORY: "tokenbalancehistory"
  },

  contractaddress: {
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    NPAY: "0x1ab43093F4b3f8E5E4666d2062768ACCe67c9920",
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
  getZksyncAddressBalance: () => {
    return new Promise((resolve, reject) => {
      const provider = new ethers.providers.JsonRpcProvider(EthersScanAPI.rpcUrl.TESTNET);
      new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider).getBalance().then(res => {
        resolve(res);
      }).catch(err => {
        console.log('err', JSON.stringify(err.message, null, 2));
        reject(err);
      })
    })
  }
}