# ndau Wallet V2
### Crypto wallet application

This app is build using React-native

## Libraries are used.
- [Ethers.js ver. 5](https://docs.ethers.org/v5/)
- [Zksync-web3](https://www.npmjs.com/package/zksync-web3)
- [Wallet Connect](https://www.npmjs.com/package/@walletconnect/modal-react-native)

## Features
- Import Multicoin Wallet using ERC secret phrase.
- Import Legacy Wallet
- Send/Receive Funds
- Handle ndau accounts
- Conversion ndau to npay
- Wallet connect for Dapps
- NFT's


> The purpose of this app to Create/Import multi-coin wallet
> having ndau and ERC-20 at same.

## Installation

React-Native - _version 0.72.3_
[Node.js](https://nodejs.org/) v18.16.1 to run.
[npm](https://www.npmjs.com/) v9.5.1
[yarn](https://yarnpkg.com/) v1.22.19 (preferred)

## Steps - for running the project
### git-clone (ndau-wallet) repository

### ios
```sh
cd ndau-wallet
yarn install
yarn pods -> will run these commands at same time (cd ios, pods install, cd .., yarn ios)
```

### android
```sh
cd ndau-wallet
yarn install
yarn android
```
