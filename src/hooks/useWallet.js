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
import APIAddressHelper from "../helpers/APIAddressHelper";
import APICommunicationHelper from "../helpers/APICommunicationHelper";
import UserData from "../model/UserData";

export default useWallet = () => {
  const { wallets } = useSelector(state => state.WalletReducer);

  const getNDauAccounts = () => {
    return UserStore.getNdauAccounts()
  }

  const getWallets = () => {
    return UserStore.getWallets()
  }
  const getActiveWalletId = () => {
    return UserStore.getActiveWalletId()
  }

  const addAccountsInNdau = (numbersOfAccount = 1) => {
    return new Promise((resolve, reject) => {
      try {
        AccountHelper.createAccounts(UserStore.getActiveWallet(), numbersOfAccount).then(res => resolve(res));
      } catch (error) {
        FlashNotification.show(`Problem adding new account: ${error.message}`);
      }
    })
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

    const walletId = DataFormatHelper.createRandomWord();

    if (!user) { // no user found, have to create
      user = new User();
      user.userId = `Anonymous`
    }

    const wallet = {
      type: "ERC",
      walletId: walletId,
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
    const walletAddresHash = DataFormatHelper.create8CharHash(walletId);
    user.wallets[walletAddresHash] = wallet;

    UserStore.setUser(user);
    UserStore.setActiveWallet(walletAddresHash);
    await MultiSafeHelper.saveUser(
      user,
      password
    );
  }

  const getNdauAccountsDetails = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const accountsArray = getNDauAccounts().map(account => account.address)
        const accountAPI = await APIAddressHelper.getAccountsAPIAddress()
        const accountData = await APICommunicationHelper.post(accountAPI, JSON.stringify(accountsArray))
        UserStore.setNdauAccounts(accountData);
        resolve(accountData);
      } catch (e) {
        reject(e)
      }

    })
  }

  const getNdauAccountDetail = (ndauAddress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accountsArray = [ndauAddress];
        const accountAPI = await APIAddressHelper.getAccountsAPIAddress()
        const accountData = await APICommunicationHelper.post(accountAPI, JSON.stringify(accountsArray))
        resolve(accountData);
      } catch (e) {
        reject(e)
      }

    })
  }

  const removeWallet = (walletId) => {
    return new Promise(async (resolve, reject) => {
      const user = UserStore.removeWallet(walletId)
      await MultiSafeHelper.saveUser(
        user,
        UserStore.getPassword()
      );
      resolve();
    })
  }

  const removeAccount = (accountAddress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const account = UserStore.getAccountDetail(accountAddress)
        const walletId = UserStore.getActiveWallet().walletId
        const user = UserStore.getUser()
        for (let walletKey in user.wallets) {
          const wallet = user.wallets[walletKey]
          if (wallet.walletId === walletId) {
            delete wallet.keys[account.ownershipKey]
            account.validationKeys.forEach(k => {
              delete wallet.keys[k]
            })
            delete wallet.accounts[account.address]
            user.wallets[walletKey] = wallet
            await UserData.loadUserData(user)
            UserStore.setUser(user)
            resolve(user);
          }
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  const changeWalletName = (name, walletId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = UserStore.getUser()
        const wallet = user.wallets[walletId]
        wallet.walletName = name;
        user.wallets[walletId] = wallet
        await MultiSafeHelper.saveUser(user, UserStore.getPassword());
        UserStore.setUser(user)
        resolve(user);
      } catch (e) {
        reject(e)
      }
    })
  }

  const checkWalletExistence = (phrase) => {
    return new Promise(async (resolve, reject) => {
      const keys = await _createNDAUWalletKeys(phrase);
      const filteredWalletForNDAU = getWallets().filter(wallet => wallet.keys[keys.accountCreationKeyHash]);
      resolve(filteredWalletForNDAU.length !== 0)
    })
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
    setActiveWallet,
    getNdauAccountsDetails,
    getNdauAccountDetail,
    removeWallet,
    removeAccount,
    changeWalletName,
    getActiveWalletId,
    checkWalletExistence
  }
}