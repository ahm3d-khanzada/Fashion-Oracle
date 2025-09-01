import axios from 'axios';
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE
} from '../constants/Create_Post_Constant';

// Remove the hardcoded token and get it fresh for each request
const getToken = () => localStorage.getItem('accessToken');

export const createPost = (postData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_POST_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.post('http://127.0.0.1:8000/api/user/create/', postData, config);

    dispatch({
      type: CREATE_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error.response) {
      // Handle different error response formats
      if (error.response.data) {
        errorMessage = typeof error.response.data === 'object'
          ? JSON.stringify(error.response.data)
          : error.response.data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: CREATE_POST_FAILURE,
      payload: errorMessage,
    });
    
    // Optionally re-throw the error if you want components to handle it
    throw error;
  }
};