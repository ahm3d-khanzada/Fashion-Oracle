import axios from 'axios';
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  FETCH_USER_POSTS_REQUEST,
  FETCH_USER_POSTS_SUCCESS,
  FETCH_USER_POSTS_FAILURE
} from '../constants/ProfileConstant';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token found. Please log in.');
  }
  try {
    const response = await axios.post(`${API_URL}/user/token/refresh/`, {
      refresh: refreshToken
    });
    const newAccessToken = response.data.access;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('Session expired. Please log in again.');
  }
};

export const fetchProfile = (userId = null) => async (dispatch) => {
  dispatch({ type: FETCH_PROFILE_REQUEST });
  try {
    let headers = getAuthHeaders();
    const url = userId 
      ? `${API_URL}/user/profile/${userId}/`
      : `${API_URL}/user/user/profile/`;

    try {
      const response = await axios.get(url, headers);
      dispatch({ type: FETCH_PROFILE_SUCCESS, payload: response.data });
      dispatch({
        type: FETCH_USER_POSTS_SUCCESS,
        payload: {
          userId: userId || response.data.user_id,
          posts: response.data.posts || []
        }
      });
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        const newToken = await refreshToken();
        headers = {
          headers: {
            Authorization: `Bearer ${newToken}`,
            'Content-Type': 'application/json'
          }
        };
        const response = await axios.get(url, headers);
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: response.data });
        dispatch({
          type: FETCH_USER_POSTS_SUCCESS,
          payload: {
            userId: userId || response.data.user_id,
            posts: response.data.posts || []
          }
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    dispatch({ 
      type: FETCH_PROFILE_FAILURE, 
      payload: error.response?.data?.error || error.message 
    });
  }
};

export const fetchUserPosts = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_USER_POSTS_REQUEST });
  try {
    const response = await axios.get(
      `${API_URL}/user/profile/${userId}/`,
      getAuthHeaders()
    );
    dispatch({
      type: FETCH_USER_POSTS_SUCCESS,
      payload: {
        userId,
        posts: response.data.posts || []
      }
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_POSTS_FAILURE,
      payload: error.response?.data?.error || error.message
    });
  }
};

export const updateProfile = (profileData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const formData = new FormData();
    if (profileData.bio) formData.append('bio', profileData.bio);
    if (profileData.image) formData.append('profile_pic', profileData.image);
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.put(
      `${API_URL}/user/profile/update/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ 
      type: UPDATE_PROFILE_FAILURE, 
      payload: error.response?.data?.profile_pic?.[0] || error.response?.data?.error || error.message 
    });
  }
};

export const followUser = (userId, action) => async (dispatch) => {
  console.log("userId:", userId);  // Debugging: Check userId value

  if (!userId || !action) {
    console.error("UserId or action is missing");
    return; // Stop if userId or action is undefined
  }

  dispatch({ type: FOLLOW_USER_REQUEST });

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await axios.post(
      `http://localhost:8000/api/user/profile/follow/${userId}/${action}/`, // FIXED: use backticks ` for template string
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED: Add backticks and ${token}
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch({ type: FOLLOW_USER_SUCCESS, payload: response.data });
    dispatch(fetchProfile(userId)); // Refresh the profile
  } catch (error) {
    console.error("Follow error:", error); // Helpful for backend error too
    dispatch({
      type: FOLLOW_USER_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};