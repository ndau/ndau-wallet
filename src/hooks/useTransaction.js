
import AppConfig from "../AppConfig";
import AccountAPIHelper from "../helpers/AccountAPIHelper";
import DataFormatHelper from "../helpers/DataFormatHelper";
import UserStore from "../stores/UserStore";
import { Transaction } from "../transactions/Transaction";
import { TransferTransaction } from "../transactions/TransferTransaction";

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

  return {
    getTransactionFee,
    sendAmountToNdauAddress
  }
}