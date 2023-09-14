import { ethers } from "ethers";
import * as zkSync from "zksync-web3";

import APICommunicationHelper from "./APICommunicationHelper"
import UserStore from "../stores/UserStore";
import SettingsStore from "../stores/SettingsStore";
import FlashNotification from "../components/common/FlashNotification";

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
  apiKey: "RMY86WJ2479F3RH4UB26D17CR9MPXAR3SK",
  alchemyApiKey: "LbVbPhgj9p_f8cND9SYyUyZUq0_L9Bp1",

  modules: {
    ACCOUNT: "account",
    STATS: "stats",
  },

  rpcUrl: {
    alchemy: {
      goerli: `https://eth-goerli.g.alchemy.com/v2/LbVbPhgj9p_f8cND9SYyUyZUq0_L9Bp1`
    },
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
    mainnet: {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
    },
    goerli: {
      USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
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
      const provider = new ethers.providers.EtherscanProvider(EthersScanAPI.networks.goerli, EthersScanAPI.apiKey);
      const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider);

      wallet.sendTransaction({
        to: "0xA74d1D5C01208F90840dddCBEF738ecd41eC7a46",
        from: UserStore.getActiveWallet().ercAddress,
        value: ethers.utils.formatBytes32String("10")
      }).then((res) => {
        console.log("res", JSON.stringify(res, null, 2));
      });
    } catch (error) {
      FlashNotification.show(error.reason);
      console.log('err check', JSON.stringify(error.reason, null, 2));
      console.log('err code', JSON.stringify(error.code, null, 2));
      console.log('err error', JSON.stringify(error.error, null, 2));
      console.log('err tx', error.tx);
    }
  }
}

export const PolygonApi = {

  url: "https://polygon-mumbai.g.alchemy.com/v2/Z_G5HhyiXdXZ9j0-uJ4B7SZr_oCk4xSN",

  getPolygonAddressBalance: () => {
    return new Promise((resolve, reject) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(PolygonApi.url);
        const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider);

        APICommunicationHelper.get("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd").then((res) => {
          const usdAmount = res?.['matic-network']?.usd;
          wallet.getBalance().then(res => {
            resolve({
              totalFunds: ethers.utils.formatUnits(res._hex, 18),
              usdAmount: ((ethers.utils.formatUnits(res._hex, 18) * usdAmount) || 0)
            })
          }).catch(err => reject(err));
        }).catch(err => {
          wallet.getBalance().then(res => {
            resolve({
              totalFunds: ethers.utils.formatUnits(res._hex, 18),
              usdAmount: 0
            })
          }).catch(err => reject(err));
          reject(err)
        });
      } catch (error) {
        FlashNotification.show(error.reason);
        console.log('err check', JSON.stringify(error.reason, null, 2));
        console.log('err code', JSON.stringify(error.code, null, 2));
        console.log('err error', JSON.stringify(error.error, null, 2));
        console.log('err tx', error.tx);
        reject(err)
      }
    })
  }
}

export const ZkSkyncApi = {

  addresses: {
    NPAY_L2_ADDRESS: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
  },

  __getWallet: () => {
    const PRIVATE_KEY = UserStore.getActiveWallet().ercKeys.privateKey;;
    const zkSyncProvider = new zkSync.Provider("https://testnet.era.zksync.dev");
    const ethereumProvider = ethers.getDefaultProvider("goerli");
    return new zkSync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);
  },

  getZksyncAddressBalance: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = ZkSkyncApi.__getWallet();
        const totalFunds = ethers.utils.formatEther((await wallet.getBalance(ZkSkyncApi.addresses.NPAY_L2_ADDRESS))._hex)
        resolve({ totalFunds, usdAmount: 0 })
      } catch (e) {
        reject(e);
      }
    })
  },

  estimateGas: (toAddress, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = ZkSkyncApi.__getWallet();
        wallet.estimateGas({
          to: toAddress,
          value: ethers.utils.parseEther(amount)._hex
        }).then(res => {
          console.log('estimating gas information', JSON.stringify(res, null, 2));
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      } catch (e) {
        reject(e);
      }
    })
  },

  send: (toAddress, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = ZkSkyncApi.__getWallet();
        wallet.transfer({
          to: toAddress,
          value: ethers.utils.parseEther(amount)._hex,
          // token: "NPAY"
        }).then(res => {
          console.log('sending information', JSON.stringify(res, null, 2));
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      } catch (e) {
        reject(e);
      }
    })
  }
}