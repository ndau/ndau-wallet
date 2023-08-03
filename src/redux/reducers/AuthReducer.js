import { ACTION_AUTH_SET_USER } from "../actions";

const initialState = {
  user: {}
}

export default AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_AUTH_SET_USER:
      const user = action.payload;
      return {
        ...state,
        user
      }

    default: return initialState
  }
}