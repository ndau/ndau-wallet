import { ethers } from "ethers";
import * as zkSync from "zksync-web3";

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

  actions: {
    BALANCE: "balance",
    ETH_PRICE: "ethprice",
    TOKEN_BALANCE: "tokenbalance",
    TOKEN_BALANCE_HISTORY: "tokenbalancehistory"
  },

  contractaddress: {
    USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    // USDC: "0x5425890298aed601595a70AB815c96711a31Bc65",
    NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
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

      // Create an instance of the USDC token contract
      const usdcContract = new ethers.Contract(
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', //usdc token address
        new ethers.providers.getDefaultProvider('goerli')
      );
      console.log('new ethers.providers.getDefaultProvider', JSON.stringify(usdcContract, null, 2));

      // Call the balanceOf function to get the USDC balance
      const balance = await usdcContract.balanceOf(UserStore.getActiveWallet().ercAddress);

      console.log(`USDC Balance: ${ethers.utils.formatUnits(balance, 6)}`); // Assuming 6 decimals for USDC
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
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