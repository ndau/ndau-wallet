import { configureStore } from '@reduxjs/toolkit'

import {
  AuthReducer,
  NotificationReducer,
  WalletReducer
} from "../reducers";



 

export default configureStore({
  reducer: {
    AuthReducer,
    WalletReducer,
    NotificationReducer
  },
})