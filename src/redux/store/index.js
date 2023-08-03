import { configureStore } from '@reduxjs/toolkit'

import {
  AuthReducer,
  WalletReducer
} from "../reducers";

export default configureStore({
  reducer: {
    AuthReducer,
    WalletReducer
  },
})