import APICommunicationHelper from "./APICommunicationHelper"

export const Converters = {
  WEI_ETH: (wei) => wei / Math.pow(10, 18),
  ETH_USD: (eth, usd) => (eth * usd).toFixed(4)
}

export const EthersScanAPI = {
  endpoint: "https://api-goerli.etherscan.io/api?",
  apiKey: "JT1CHNSEQUDB3XMHZ9BNQPB6Y3QKRAWSWB",

  modules: {
    ACOUNT: "account",
    STATS: "stats",
  },

  actions: {
    BALANCE: "balance",
    ETH_PRICE: "ethprice",
  },

  __getFormattedEndpoint: ({ module, action, params }) => {
    return `${EthersScanAPI.endpoint}module=${module}&action=${action}&apiKey=${EthersScanAPI.apiKey}&tag=latest&${EthersScanAPI.__params(params)}`
  },
  __params: (params) => {
    if (!params) return "";
    let paramsStr = "";
    Object.keys(params).forEach((key, index, arr) => {
      paramsStr += `${key}=${params[key]}`
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
  getAddressBalance: (address) => {
    return new Promise((resolve, reject) => {
      const apiToCall = EthersScanAPI.__getFormattedEndpoint({
        module: EthersScanAPI.modules.ACOUNT,
        action: EthersScanAPI.actions.BALANCE,
        params: { address: address }
      })
      APICommunicationHelper.get(apiToCall).then(res => {
        if (res.message === "OK") resolve(res);
        else reject(res);
      }).catch(err => reject(err))
    })
  },
}