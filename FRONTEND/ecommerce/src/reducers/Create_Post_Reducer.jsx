import {
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE
  } from '../constants/Create_Post_Constant';
  
  const initialState = {
    loading: false,
    success: false,
    error: null,
    post: null,
  };
  
  export const createPostReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_POST_REQUEST:
        return { ...state, loading: true };
      case CREATE_POST_SUCCESS:
        return { loading: false, success: true, post: action.payload };
      case CREATE_POST_FAILURE:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  