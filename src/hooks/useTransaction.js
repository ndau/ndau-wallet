
import { ethers } from "ethers";
import AppConfig from "../AppConfig";
import AccountAPIHelper from "../helpers/AccountAPIHelper";
import DataFormatHelper from "../helpers/DataFormatHelper";
import UserStore from "../stores/UserStore";
import { Transaction } from "../transactions/Transaction";
import { TransferTransaction } from "../transactions/TransferTransaction";
import { EthersScanAPI } from "../helpers/EthersScanAPI";
import { LockTransaction } from "../transactions/LockTransaction";
import NdauNumber from "../helpers/NdauNumber";
import { NotifyTransaction } from "../transactions/NotifyTransaction";
import { SetRewardsDestinationTransaction } from "../transactions/SetRewardsDestinationTransaction";
import APIAddressHelper from "../helpers/APIAddressHelper";
import APICommunicationHelper from "../helpers/APICommunicationHelper";
import TransactionAPI from "../api/TransactionAPI";

export default useTransaction = () => {

  const getTransactionFee = async (account, address, amount) => {
    return new Promise(async (resolve, reject) => {
      let transactionFee = 0;
      let sibFee = 0;
      let transactionFeeNapu = 0;
      let sibFeeNapu = 0;
      let total = 0;

      try {
        Object.assign(TransferTransaction.prototype, Transaction);
        const transferTransaction = new TransferTransaction(
          UserStore.getActiveWallet(),
          account,
          address,
          amount
        );

        await transferTransaction.create();
        await transferTransaction.sign();
        const prevalidateData = await transferTransaction.prevalidate();

        if (prevalidateData.fee_napu) {
          transactionFee = DataFormatHelper.getNdauFromNapu(
            prevalidateData.fee_napu,
            AppConfig.NDAU_DETAIL_PRECISION,
          );
          transactionFeeNapu = prevalidateData.fee_napu;
        }
        if (prevalidateData.sib_napu) {
          sibFee = DataFormatHelper.getNdauFromNapu(
            prevalidateData.sib_napu,
            AppConfig.NDAU_DETAIL_PRECISION,
          );
          sibFeeNapu = prevalidateData.sib_napu;
        }

        total = AccountAPIHelper.getTotalNdauForSend(
          amount,
          prevalidateData.fee_napu,
          prevalidateData.sib_napu,
        );
        resolve({
          transactionFee: transactionFee,
          sib: prevalidateData.sib_napu,
          total: total
        });
      } catch (error) {
        // Check to see if fee and sib info are passed back so they can be displayed.
        if (error.error.response && error.error.response.data) {
          const resp = error.error.response.data;
          if (resp.sib_napu) {
            sibFee = DataFormatHelper.getNdauFromNapu(resp.sib_napu);
            sibFeeNapu = resp.sib_napu;
          }
          if (resp.fee_napu) {
            transactionFee = DataFormatHelper.getNdauFromNapu(resp.fee_napu);
            transactionFeeNapu = resp.fee_napu;
          }
          if (resp.sib_napu && resp.fee_napu) {
            total = AccountAPIHelper.getTotalNdauForSend(
              amount,
              resp.fee_napu,
              resp.sib_napu,
            );
            sibFeeNapu = resp.sib_napu;
            transactionFeeNapu = resp.fee_napu;
          }
        }
        reject(error)
      }
    })
  }

  const sendAmountToNdauAddress = (account, addressToSend, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        Object.assign(TransferTransaction.prototype, Transaction)
        const transferTransaction = new TransferTransaction(
          UserStore.getActiveWallet(),
          account,
          addressToSend,
          amount
        );
        await transferTransaction.createSignPrevalidateSubmit();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    })
  }

  const getTransactionFeeForERC = (toAddress, ethAmount) => {
    return new Promise((resolve, reject) => {
      const provider = new ethers.providers.EtherscanProvider(EthersScanAPI.networks.goerli, EthersScanAPI.apiKey);
      const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider);

      wallet.estimateGas({
        to: toAddress,
        value: ethers.utils.parseEther(ethAmount)
      }).then(res => {
        resolve({
          ethPrice: ethers.utils.formatEther(res._hex),
          hex: res._hex
        })
      }).catch(err => {
        reject(err)
        console.log('err	', JSON.stringify(err, null, 2));
      })
    })
  }

  const sendERCFunds = (toAddress, ethAmount) => {
    return new Promise((resolve, reject) => {
      const provider = new ethers.providers.EtherscanProvider(EthersScanAPI.networks.goerli, EthersScanAPI.apiKey);
      const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider);

      wallet.sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(ethAmount)
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('err	', JSON.stringify(err, null, 2));
      })
    })
  }

  const getERCTransactionHistory = (address) => {
    return new Promise((resolve, reject) => {
      const provider = new ethers.providers.EtherscanProvider(EthersScanAPI.networks.goerli, EthersScanAPI.apiKey);
      provider.getHistory(address).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('err	', JSON.stringify(err, null, 2));
      })
    })
  }

  const getNDAULockFee = (account, lockISO) => {
    return new Promise(async (resolve, reject) => {
      try {
        Object.assign(LockTransaction.prototype, Transaction)
        const lockTransaction = new LockTransaction(
          UserStore.getActiveWallet(),
          account,
          lockISO
        )
        await lockTransaction.create()
        await lockTransaction.sign()
        const data = await lockTransaction.prevalidate()
        resolve(new NdauNumber(data.fee_napu).toDetail())
      } catch (err) {
        reject(err)
        console.log('error: Getting NDAU Lock fee', JSON.stringify(err, null, 2));
      }
    })
  }

  const lockNDAUAccount = (account, lockISO, accountAddressForEAI = "") => {
    return new Promise(async (resolve, reject) => {
      try {

        const wallet = UserStore.getActiveWallet();

        Object.assign(NotifyTransaction.prototype, Transaction)
        const notifyTransaction = new NotifyTransaction(
          wallet,
          account
        )

        Object.assign(SetRewardsDestinationTransaction.prototype, Transaction)
        const setRewardsDestinationTransaction = new SetRewardsDestinationTransaction(
          wallet,
          account,
          accountAddressForEAI
        )

        Object.assign(LockTransaction.prototype, Transaction)
        const lockTransaction = new LockTransaction(
          wallet,
          account,
          lockISO
        )

        await lockTransaction.createSignPrevalidateSubmit()

        await notifyTransaction.createSignPrevalidateSubmit()

        // Now make sure we send the EAI where it belongs if it is different
        // than the account address
        if (account.address !== accountAddressForEAI) {
          await setRewardsDestinationTransaction.createSignPrevalidateSubmit()
        }

        resolve(true);
      } catch (err) {
        reject(err)
        console.log('error: Getting NDAU Lock fee', JSON.stringify(err, null, 2));
      }
    })
  }

  const notifyForNDAU = (account) => {
    return new Promise(async (resolve, reject) => {
      try {

        const wallet = UserStore.getActiveWallet();

        Object.assign(NotifyTransaction.prototype, Transaction)
        const notifyTransaction = new NotifyTransaction(
          wallet,
          account
        )
        const response = await notifyTransaction.createSignPrevalidateSubmit();
        resolve(response)
      } catch (e) {
        reject(e)
      }
    });
  }

  const setEAI = (account, accountAddressForEAI = "") => {
    return new Promise(async (resolve, reject) => {
      try {
        Object.assign(SetRewardsDestinationTransaction.prototype, Transaction)
        const setRewardsDestinationTransaction = new SetRewardsDestinationTransaction(
          UserStore.getActiveWallet(),
          account,
          accountAddressForEAI || account.address
        )
        const response = await setRewardsDestinationTransaction.createSignPrevalidateSubmit();
        resolve(response);
      } catch (e) {
        reject(e)
      }
    })
  }

  const getTransactions = (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accountAPI = await APIAddressHelper.getAccountHistoryAPIAddress(address)
        const accountData = await APICommunicationHelper.get(accountAPI)
        resolve(accountData);
      } catch (e) {
        reject(e)
      }

    })
  }

  const getTransactionByHash = (TxHash) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = TransactionAPI.transactionByHash(TxHash)
        resolve(response);
      } catch (e) {
        reject(e)
      }

    })
  }

  return {
    getTransactionFee,
    sendAmountToNdauAddress,
    getTransactionFeeForERC,
    sendERCFunds,
    getERCTransactionHistory,
    getNDAULockFee,
    lockNDAUAccount,
    notifyForNDAU,
    setEAI,
    getTransactions,
    getTransactionByHash
  }
}