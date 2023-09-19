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
          value: ethers.utils.parseEther(amount)
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
    });
  }
}

export const NetworkManager = {

  __urls: {
    zkMainnet: "https://mainnet.era.zksync.io",
    zkGoerli: "https://testnet.era.zksync.dev",
  },
  __providers: {
    Alchemy: {
      ethMainnet: "https://eth-mainnet.g.alchemy.com/v2/t3L6Ib7KIIT7FfNbeU6rkhKxHlNtjIWf",
      ethGoerli: "https://eth-goerli.g.alchemy.com/v2/LbVbPhgj9p_f8cND9SYyUyZUq0_L9Bp1",
      polygonMainnet: "https://polygon-mainnet.g.alchemy.com/v2/Lqj1T0OqjfRRPhIXL8LXOlkaMFMpRQaJ",
      polygonMumbai: "https://polygon-mumbai.g.alchemy.com/v2/Z_G5HhyiXdXZ9j0-uJ4B7SZr_oCk4xSN"
    }
  },

  __contractAddresses: {
    Mainnet: {
      L1: {
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
      },
      L2: {
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
      }
    },
    Testnet: {
      L1: {
        USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
      },
      L2: {
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        NPAY: "0xd7afcb470bcF8d07E3A4dCBa0Ec7D9f5D8C6a05a"
      }
    },
  },

  Coins: () => ({
    USDC: {
      contractAddress: NetworkManager.contractsResolver().L1.USDC,
      network: NetworkManager.getEnv().eth
    },
    NPAY: {
      contractAddress: NetworkManager.contractsResolver().L2.NPAY,
      network: NetworkManager.getEnv().zkSyncEra
    },
    Matic: {
      contractAddress: NetworkManager.contractsResolver().L2.MATIC,
      network: NetworkManager.getEnv().polygon
    }
  }),

  __isTestnet: () => {
    const env = SettingsStore._settings.applicationNetwork;
    return env === "testnet" || env === "devnet";
  },

  __getDefaultWalletSetting: () => {
    const provider = new ethers.providers.JsonRpcProvider(NetworkManager.getEnv().eth);
    const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider);
    return wallet;
  },

  getEnv: () => {
    const urls = {
      eth: "",
      zkSyncEra: "",
      polygon: ""
    }

    if (NetworkManager.__isTestnet()) {
      urls.zkSyncEra = NetworkManager.__urls.zkGoerli;
      urls.eth = NetworkManager.__providers.Alchemy.ethGoerli;
      urls.polygon = NetworkManager.__providers.Alchemy.polygonMumbai;
    } else {
      urls.zkSyncEra = NetworkManager.__urls.zkMainnet;
      urls.eth = NetworkManager.__providers.Alchemy.ethMainnet;
      urls.polygon = NetworkManager.__providers.Alchemy.polygonMainnet;
    }

    return urls;
  },

  contractsResolver: () => {
    return NetworkManager.__isTestnet() ?
      { ...NetworkManager.__contractAddresses.Testnet } :
      { ...NetworkManager.__contractAddresses.Mainnet }
  },

  getBalance: () => {
    return new Promise((resolve, reject) => {
      NetworkManager.__getDefaultWalletSetting().getBalance().then(resolve).catch(reject)
    })
  },
  estimateGas: (toAddress, amount) => {
    return new Promise((resolve, reject) => {
      NetworkManager.__getDefaultWalletSetting().estimateGas({
        to: toAddress,
        value: ethers.utils.parseEther(amount)
      }).then(resolve).catch(reject);
    })
  },
  transfer: (toAddress, amount) => {
    return new Promise((resolve, reject) => {
      NetworkManager.__getDefaultWalletSetting().sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(amount)
      }).then(resolve).catch(reject);
    })
  },

  getContractFor: (token) => {
    const provider = new ethers.providers.JsonRpcProvider(token.network);
    const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider);

    const abi = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: 'success', type: 'bool' }],
        type: 'function',
      }
    ];

    const contract = new ethers.Contract(token.contractAddress, abi, provider).connect(wallet);

    return {
      getBalance: () => {
        return new Promise((resolve, reject) => {
          contract.balanceOf(UserStore.getActiveWallet().ercAddress).then(resolve).catch(reject);
        })
      },
      estimateGas: (toAddress, amount) => {
        return new Promise((resolve, reject) => {
          contract.estimateGas.transfer(toAddress, amount).then(resolve).catch(reject);
        })
      },
      transfer: (toAddress, amount) => {
        return new Promise((resolve, reject) => {
          contract.transfer(toAddress, amount).then(resolve).catch(reject);
        })
      }
    }
  }
}