// Naming convertion
// - actions -> ACTION_{REDUCER}_{ACTUAL_NAME}

// AuthReducer
export const ACTION_AUTH_SET_USER = "ACTION_AUTH_SET_USER";

export const authSetUser = () => ({
  type: ACTION_AUTH_SET_USER,
  payload: ({})
});

// WalletReducer
export const ACTION_WALLET_SET_CURRENT_WALLET = "ACTION_WALLET_SET_CURRENT_WALLET";
export const ACTION_WALLET_ADD_WALLET = "ACTION_WALLET_ADD_WALLET";

export const setCurrentWallet = () => ({
  type: ACTION_WALLET_SET_CURRENT_WALLET,
  payload: ({})
});

export const addWalletDetail = ({ name, privateKey, publicKey }) => ({
  type: ACTION_WALLET_ADD_WALLET,
  payload: ({
    wallet: {
      name,
      privateKey,
      publicKey
    }
  })
});

