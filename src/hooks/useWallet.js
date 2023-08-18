import { useSelector } from "react-redux";

import SetupStore from "../stores/SetupStore";
import UserStore from "../stores/UserStore";
import DataFormatHelper from "../helpers/DataFormatHelper";
import MultiSafeHelper from "../helpers/MultiSafeHelper";
import AccountHelper from "../helpers/AccountHelper";
import FlashNotification from "../components/common/FlashNotification";
import User from "../model/User";
import AppConstants from "../AppConstants";

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

  const addLegacyWallet = async (user) => {
    if (!user) {
      user = await AccountHelper.setupNewUser(
        user,
        DataFormatHelper.convertRecoveryArrayToString(SetupStore.recoveryPhrase),
        SetupStore.walletId ? SetupStore.walletId : SetupStore.userId,
        0,
        SetupStore.entropy,
        SetupStore.encryptionPassword,
        SetupStore.addressType
      );

    } else { // Already user is created
      user = await AccountHelper.addNewWallet(
        user,
        DataFormatHelper.convertRecoveryArrayToString(SetupStore.recoveryPhrase),
        AppConstants.WALLET_NAME + " " + Object.keys(user.wallets).length,
        user.userId,
        0,
        SetupStore.encryptionPassword
      )
    }
    return user;
  }

  // this function only works for ERC tokens
  const addWalletWithAddress = async (data) => {

    const password = UserStore.getPassword();
    let user = await MultiSafeHelper.getDefaultUser(password)
    const createNewWalletName = (data) => {
      if (data.walletName) return data.walletName
      else return`${AppConstants.WALLET_NAME} ` + Object.keys(user.wallets).length
    }

    const walletAddresHash = DataFormatHelper.create8CharHash(data.address);
    if (user) { // Already account setup. found user
      user.wallets[walletAddresHash] = {
        type: "ERC",
        walletId: createNewWalletName(data),
        walletName: createNewWalletName(data), 
        address: data.address,
        accounts: {},
        keys: {
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          path: data.path,
        }
      }
    } else { // need to setup new account
      user = new User();
      user.userId = `${AppConstants.WALLET_NAME}`
      const wallet = {
        type: "ERC",
        walletId: createNewWalletName(data),
        walletName: createNewWalletName(data),
        address: data.address,
        accounts: {},
        keys: {
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          path: data.path,
        }
      }
      user.wallets[walletAddresHash] = wallet;
    }

    UserStore.setUser(user);
    await MultiSafeHelper.saveUser(
      user,
      password
    );
  }

  return {
    wallets,
    isWalletSetup: !!wallets.length,

    addWalletWithAddress,
    getNDauAccounts,
    addAccountsInNdau,
    getActiveWallet,
    addLegacyWallet
  }
}