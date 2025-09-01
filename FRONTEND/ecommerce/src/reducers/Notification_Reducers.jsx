import * as types from "../constants/Notification_Constant";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const Notification_Reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications: action.payload };
    case types.FETCH_NOTIFICATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case types.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };
    default:
      return state;
  }
};

export default Notification_Reducer;

