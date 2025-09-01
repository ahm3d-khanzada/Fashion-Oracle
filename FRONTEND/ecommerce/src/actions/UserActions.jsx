import axios from "axios";
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

// Load User from localStorage on Refresh
// export const loadUserFromStorage = () => (dispatch) => {
//   const userInfo = localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : null;

//   if (userInfo) {
//     dispatch({
//       type: USER_SIGNIN_SUCCESS,
//       payload: userInfo,
//     });
//   }
// };


export const loadUserFromStorage = () => (dispatch) => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  if (userInfo && userInfo.access) {
    // Set default authorization header for axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.access}`;

    // Dispatch user data to Redux store
    dispatch({
      type: USER_SIGNIN_SUCCESS,
      payload: userInfo,
    });
  }
};

// Axios instance with token handling
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Axios Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          localStorage.setItem("accessToken", data.access);
          originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Session expired. Please log in again.");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // ✅ Redirect to correct login route with hash
          window.location.href = "/#/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Signup Action
export const signup = (first_name, last_name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/user/register/`,
      { first_name, last_name, email, password },
      config
    );

    dispatch({
      type: USER_SIGNUP_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload:
        error.response && error.response.data.details
          ? error.response.data.details
          : error.message,
    });
  }
};

export const signin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/user/login/`,
      { email, password },
      config
    );

    dispatch({
      type: USER_SIGNIN_SUCCESS,
      payload: data,
    });

    // Save user info and tokens in localStorage
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
  } catch (error) {
    console.log("Error details:", error.response); // Log the full error to the console

    // Check error structure and display it properly
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload: error.response?.data?.error || error.message,
    });
    
  }
};


// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  dispatch({ type: USER_LOGOUT });
};

// Forgot Password Action
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/user/password-reset/`,
      { email },
      config
    );

    dispatch({
      type: USER_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Reset Password Action
export const resetPassword = (uid, token, password) => async (dispatch) => {
  try {
      dispatch({ type: USER_PASSWORD_RESET_REQUEST });

      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      };

      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/user/password-reset-confirm/${uid}/${token}/`, 
        { password, password2: password }, 
        config
      );

      dispatch({ type: USER_PASSWORD_RESET_SUCCESS, payload: data });
  } catch (error) {
      dispatch({
          type: USER_PASSWORD_RESET_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
};