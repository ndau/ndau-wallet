import { act } from "react-test-renderer";
import { ADD_NOTIFICATION, CLEAR_NOTIFICATION, MARK_AS_READ, UPDATE_NOTIFICATIONS } from "../actions";


const initialState = {
    notifications: [],
}

export default NotificationReducer = (state = initialState, action) => {



    switch (action.type) {

        case ADD_NOTIFICATION:

            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };

        case CLEAR_NOTIFICATION:

            return {
                ...state,
                notifications: state.notifications.filter(
                    (notification) => notification.id !== action.payload
                ),
            };

        case UPDATE_NOTIFICATIONS: // Handle the action to update notifications

            return {
                ...state,
                notifications: action.payload,
            };

        default:
            return state;
    }
}






