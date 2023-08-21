/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

class UserStore {
  constructor() {
    if (!UserStore.instance) {
      this.activeWalletId = [];
      this.activeWallet = [];
      this._user = []
      this._password = []
      UserStore.instance = this
    }

    return UserStore.instance
  }

  setUser(user) {
    this._user[0] = user;
    return this.getActiveWallet();
  }

  getUser() {
    return this._user[0]
  }

  isUserSetup() {
    return this._user[0]?.wallets
  }

  setActiveWalletId(walletId) {
    this.activeWalletId[0] = walletId;
  }

  getActiveWalletId() {
    if (!this.activeWalletId[0]) {
      const [firstKey] = Object.keys(this._user[0].wallets);
      this.activeWalletId[0] = firstKey;
    }
    return this.activeWalletId[0];
  }

  setActiveWallet(walletId) {
    this.setActiveWalletId(walletId);
  }

  getActiveWallet() {
    try {
      const currentWalletId = this.getActiveWalletId();
      const currentWallet = this._user[0].wallets[currentWalletId];
      return currentWallet;
    } catch (e) {
      return {};
    }
  }

  getNdauAccounts() {
    const currentWalletId = this.getActiveWalletId();
    const currentWallet = this._user[0].wallets[currentWalletId];
    const accounts = []
    if (currentWallet?.accounts) {
      Object.keys(currentWallet.accounts).forEach(key => {
        accounts.push(currentWallet.accounts[key]);
      })
    }
    return accounts;
  }

  setPassword(password) {
    this._password[0] = password
  }

  getPassword() {
    return this._password[0]
  }

  getWallets() {
    if (this._user[0]) {
      const wallets = [];
      Object.keys(this._user[0].wallets).forEach(key => {
        wallets.push({ key, ...this._user[0].wallets[key] });
      })
      return wallets;
    } else return []
  }
}

const instance = new UserStore()
Object.freeze(instance)

export default instance