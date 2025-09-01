import axios from 'axios';
import {
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAIL,
  ADD_RECENT_SEARCH,
  CLEAR_RECENT_SEARCHES
} from '../constants/Search_Constants';

const API_BASE_URL = 'http://127.0.0.1:8000/api/user';

export const searchUsers = (query) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_USERS_REQUEST });

    const response = await axios.get(`${API_BASE_URL}/search`, {

      params: { username: query },

      headers: {
        'Content-Type': 'application/json',
      }
    });

    dispatch({
      type: SEARCH_USERS_SUCCESS,
      payload: response.data
    });

    // Add the searched user to recent searches
    if (response.data.length > 0) {
      dispatch({
        type: ADD_RECENT_SEARCH,
        payload: response.data[0] // Add the first result to recent searches
      });
    }
  } catch (error) {
    dispatch({
      type: SEARCH_USERS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

export const addRecentSearch = (user) => (dispatch) => {
  dispatch({
    type: ADD_RECENT_SEARCH,
    payload: user
  });
};

export const clearRecentSearches = () => (dispatch) => {
  dispatch({
    type: CLEAR_RECENT_SEARCHES
  });
};