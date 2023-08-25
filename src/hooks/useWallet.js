import { useSelector } from "react-redux";
import { ethers } from "ethers";
import Base64 from 'base-64';

import SetupStore from "../stores/SetupStore";
import UserStore from "../stores/UserStore";
import DataFormatHelper from "../helpers/DataFormatHelper";
import MultiSafeHelper from "../helpers/MultiSafeHelper";
import AccountHelper from "../helpers/AccountHelper";
import FlashNotification from "../components/common/FlashNotification";
import User from "../model/User";
import AppConstants from "../AppConstants";
import { KeyAddr } from "../helpers/KeyAddrManager";
import KeyPathHelper from "../helpers/KeyPathHelper";
import KeyMaster from "../helpers/KeyMaster";

export default useWallet = () => {
  const { wallets } = useSelector(state => state.WalletReducer);

  const getNDauAccounts = () => {
    return UserStore.getNdauAccounts()
  }

  const getWallets = () => {
    return UserStore.getWallets()
  }

  const addAccountsInNdau = (numbersOfAccount = 1) => {
    try {
      AccountHelper.createAccounts(UserStore.getActiveWallet(), numbersOfAccount).then(res => null);
    } catch (error) {
      FlashNotification.show(`Problem adding new account: ${error.message}`);
    }
  }

  const setActiveWallet = (wallet, onSuccess) => {
    const key = wallet?.key;
    if (key) {
      UserStore.setActiveWalletId(key);
      onSuccess?.();
    }
    else FlashNotification.show("Unable to switch wallet");
  }

  const getActiveWallet = () => {
    return UserStore.getActiveWallet();
  }

  const addLegacyWallet = async (user) => {
    if (!user) {
      user = await AccountHelper.setupNewUser(
        user,
        DataFormatHelper.convertRecoveryArrayToString(SetupStore.recoveryPhrase),
        user?.walletName ? user.walletName : SetupStore.walletId ? SetupStore.walletId : SetupStore.userId,
        0,
        SetupStore.entropy,
        SetupStore.encryptionPassword,
        SetupStore.addressType
      );

    } else { // Already user is created
      user = await AccountHelper.addNewWallet(
        user,
        DataFormatHelper.convertRecoveryArrayToString(SetupStore.recoveryPhrase),
        user.walletName ? user.walletName : AppConstants.WALLET_NAME + " " + Object.keys(user.wallets).length,
        user.userId,
        0,
        SetupStore.encryptionPassword
      )
    }
    return user;
  }

  // 0 - Phrase -> entropy
  // 1 - where entropy = 0xab280ban1b212898721983
  // 2 - and then from "0xab280ba..." -> [12, 23, 33] with the help of arrayify method
  // 3 - convert byte array to base64
  const __getBase64VersionOfEntropyForNDAU = (phrase) => {
    const entropy = ethers.utils.mnemonicToEntropy(phrase);
    const randomBytesArray = ethers.utils.arrayify(entropy);
    const randomBytesArrayString = String.fromCharCode.apply(null, randomBytesArray);
    const base64Value = Base64.encode(randomBytesArrayString);
    console.log({ randomBytesArray, randomBytesArrayString, base64Value });
    return base64Value;
  }

  const __getNDAUFormatWalletKeys = (randomBytesBase64, onCreate) => {
    KeyAddr.newKey(randomBytesBase64).then(rootPrivateKey => {
      KeyAddr.deriveFrom(rootPrivateKey, "/", KeyPathHelper.accountCreationKeyPath()).then(deriveMasterKey => {
        KeyAddr.toPublic(deriveMasterKey).then(publicKey => {
          const keys = KeyMaster.createKey(
            deriveMasterKey,
            publicKey,
            KeyPathHelper.accountCreationKeyPath()
          );

          onCreate({
            accountCreationKeyHash: DataFormatHelper.create8CharHash(publicKey),
            keys: {
              [DataFormatHelper.create8CharHash(publicKey)]: keys
            }
          });
        }).catch(err => {
          console.log('Error: __getNDAUFormatWalletKeys toPublic', JSON.stringify(err.message, null, 2));
        })
      }).catch(err => {
        console.log('Error: __getNDAUFormatWalletKeys deriveFrom', JSON.stringify(err.message, null, 2));
      })
    }).catch(err => {
      console.log('Error: __getNDAUFormatWalletKeys newKey', JSON.stringify(err.message, null, 2));
    })
  }

  const _createNDAUWalletKeys = (phrase) => {
    return new Promise((resolve, reject) => {
      const base64Value = __getBase64VersionOfEntropyForNDAU(phrase)
      __getNDAUFormatWalletKeys(base64Value, data => resolve(data));
    })
  }

  // this function only works for ERC tokens
  const addWalletWithAddress = async (phrase, walletName) => {

    const data = ethers.utils.HDNode.fromMnemonic(phrase).derivePath("m/44'/60'/0'/0/0")

    if (walletName) data.walletName = walletName;

    const password = UserStore.getPassword();
    let user = await MultiSafeHelper.getDefaultUser(password)
    const createNewWalletName = (data) => {
      if (data.walletName) return data.walletName
      else return `${AppConstants.WALLET_NAME} ` + (Object.keys(user.wallets).length || "")
    }

    const walletAddresHash = DataFormatHelper.create8CharHash(data.address);

    if (!user) { // no user found, have to create
      user = new User();
      user.userId = `${AppConstants.WALLET_NAME}`
    }

    const wallet = {
      type: "ERC",
      walletId: createNewWalletName(data),
      walletName: createNewWalletName(data),
      ercAddress: data.address,
      accounts: {}, // this handled by previous app, they add ndau accounts in it. so means don't change
      ...await _createNDAUWalletKeys(phrase),
      ercKeys: {
        publicKey: data.publicKey,
        privateKey: data.privateKey,
        path: data.path,
      }
    }
    user.wallets[walletAddresHash] = wallet;

    UserStore.setUser(user);
    UserStore.setActiveWallet(walletAddresHash);
    await MultiSafeHelper.saveUser(
      user,
      password
    );
  }

  return {
    wallets,
    isWalletSetup: !!wallets.length,

    _createNDAUWalletKeys,
    addWalletWithAddress,
    getNDauAccounts,
    addAccountsInNdau,
    getActiveWallet,
    addLegacyWallet,
    getWallets,
    setActiveWallet
  }
}