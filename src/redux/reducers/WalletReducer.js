import { ACTION_WALLET_ADD_WALLET, ACTION_WALLET_SET_CURRENT_WALLET } from "../actions";

const initialState = {
  wallets: {},
  currentWallet: {}
}

export default WalletReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_WALLET_SET_CURRENT_WALLET: {
      const currentWallet = action.payload;
      return {
        ...state,
        currentWallet
      }
    }

    case ACTION_WALLET_ADD_WALLET: {
      const wallet = action.payload.wallet;
      const wallets = { ...state.wallets };
      wallets[wallet.name] = wallet;
      return {
        ...state,
        currentWallet: wallet,
        wallets
      }
    }

    default: return initialState
  }
}