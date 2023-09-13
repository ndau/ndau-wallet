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


export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';


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

export const addNotification = (notification) => ({

  type: ADD_NOTIFICATION,
  payload: notification,
});

export const clearNotification = (id) => ({
  type: CLEAR_NOTIFICATION,
  payload: id,
});


export const updateNotifications = (notifications) => (

  {

    type: UPDATE_NOTIFICATIONS,
    payload: notifications,
  }
);