import {
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_PASSWORD_RESET_REQUEST,
  USER_PASSWORD_RESET_SUCCESS,
  USER_PASSWORD_RESET_FAIL,
} from "../constants/UserConstants";

// Initial state for the signup reducer
const userSignupInitialState = {
  loading: false,
  userInfo: null,
  error: null,
};

// Initial state for the signin reducer
const userSigninInitialState = {
  loading: false,
  userInfo: null,
  error: null,
};

export const userSignupReducer = (state = userSignupInitialState, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return { loading: true };
    case USER_SIGNUP_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SIGNUP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userSigninReducer = (state = userSigninInitialState, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return { loading: true };
    case USER_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {}; // Reset to initial state on logout
    default:
      return state;
  }
};


export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
      case USER_FORGOT_PASSWORD_REQUEST:
          return { loading: true };
      case USER_FORGOT_PASSWORD_SUCCESS:
          return { loading: false, success: true };
      case USER_FORGOT_PASSWORD_FAIL:
          return { loading: false, error: action.payload };
      default:
          return state;
  }
};

export const resetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
      case USER_PASSWORD_RESET_REQUEST:
          return { loading: true };
      case USER_PASSWORD_RESET_SUCCESS:
          return { loading: false, success: true };
      case USER_PASSWORD_RESET_FAIL:
          return { loading: false, error: action.payload };
      default:
          return state;
  }
};