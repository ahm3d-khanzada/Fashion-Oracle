import {
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAIL,
  ADD_RECENT_SEARCH,
  CLEAR_RECENT_SEARCHES
} from "../constants/Search_Constants";

const initialState = {
  users: [],
  recentSearches: [],
  loading: false,
  error: null,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };
    case SEARCH_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_RECENT_SEARCH:
      return {
        ...state,
        recentSearches: [action.payload, ...state.recentSearches.filter(user => user.id !== action.payload.id)].slice(0, 5), // Keep only 5 recent searches
      };
    case CLEAR_RECENT_SEARCHES:
      return {
        ...state,
        recentSearches: [],
      };
    default:
      return state;
  }
};