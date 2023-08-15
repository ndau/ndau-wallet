import { useSelector } from "react-redux";

import UserStore from "../stores/UserStore";
import DataFormatHelper from "../helpers/DataFormatHelper";
import MultiSafeHelper from "../helpers/MultiSafeHelper";
import AccountHelper from "../helpers/AccountHelper";
import FlashNotification from "../components/common/FlashNotification";

export default useWallet = () => {
  const { wallets } = useSelector(state => state.WalletReducer);

  const getNDauAccounts = () => {
    return UserStore.getNdauAccounts()
  }

  const addAccountsInNdau = (numbersOfAccount = 1) => {
    try {
      AccountHelper.createAccounts(UserStore.getActiveWallet(), numbersOfAccount).then(res => null);
    } catch (error) {
      FlashNotification.show(`Problem adding new account: ${error.message}`);
    }
  }

  const getActiveWallet = () => {
    return UserStore.getActiveWallet();
  }

  // this function only works for ERC tokens
  const addWalletWithAddress = (data) => {
    const password = UserStore.getPassword();
    MultiSafeHelper.getDefaultUser(password).then(user => {

      const walletAddresHash = DataFormatHelper.create8CharHash(data.address);
      user.wallets[walletAddresHash] = {
        type: "ERC",
        walletId: "Wallet " + Object.keys(user.wallets).length,
        address: data.address,
        accounts: {},
        keys: {
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          path: data.path,
        }
      }
      MultiSafeHelper.saveUser(
        user,
        password
      );

    })
  }

  return {
    wallets,
    isWalletSetup: !!wallets.length,

    addWalletWithAddress,
    getNDauAccounts,
    addAccountsInNdau,
    getActiveWallet
  }
}