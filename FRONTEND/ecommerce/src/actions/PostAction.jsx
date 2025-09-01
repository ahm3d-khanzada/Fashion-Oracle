import axios from "axios";
import * as types from "../constants/Post_Constant";

const getToken = () => localStorage.getItem('accessToken');

// Fetch all posts
export const fetchPosts = () => async (dispatch) => {
  dispatch({ type: types.FETCH_POSTS_REQUEST });
  try {
    const response = await axios.get("http://localhost:8000/api/user/posts/");
    dispatch({ type: types.FETCH_POSTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: types.FETCH_POSTS_FAILURE, payload: error.message });
  }
};

// Fetch a single post by ID
export const fetchPostById = (postId) => async (dispatch) => {
  dispatch({ type: types.FETCH_POST_REQUEST });
  try {
    const response = await axios.get(`/api/posts/${postId}/`);
    dispatch({ type: types.FETCH_POST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: types.FETCH_POST_FAILURE, payload: error.message });
  }
};

// Delete a post by ID

export const deletePost = (postId) => async (dispatch) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`http://127.0.0.1:8000/api/user/delete/${postId}/`, config);

    dispatch({ type: types.DELETE_POST, payload: postId });
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
  }
};


// Like a post by ID
export const likePost = (postId, isLiked) => async (dispatch) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // POST with null as body, config as 3rd param
    const res = await axios.post(
      `http://localhost:8000/api/user/posts/${postId}/like/`,
      null,
      config
    );

    dispatch({
      type: types.LIKE_POST,
      payload: {
        postId,
        isLiked: res.data.liked,
        likes: res.data.likes,
      },
    });
  } catch (error) {
    console.error("Error liking post:", error?.response?.data || error.message);
  }
};


export const addComment = (postId, text) => async (dispatch) => {
  try {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/api/user/comments/create/",
      { post: postId, text },
      config
    );

    dispatch({ type: types.ADD_COMMENT, payload: { postId, comment: response.data } });
  } catch (error) {
    console.error("Error creating comment:", error.response?.data || error.message);
  }
};


// Delete a comment by ID
// Delete a comment by ID
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`http://localhost:8000/api/user/comments/${commentId}/delete/`, config);

    dispatch({ type: types.DELETE_COMMENT, payload: { postId, commentId } });
  } catch (error) {
    console.error("Error deleting comment:", error?.response?.data || error.message);
  }
};

// Update a post's caption
export const updatePost = (postId, updates) => async (dispatch) => {
  try {
    const response = await axios.patch(`/api/posts/${postId}/`, updates);
    dispatch({ type: types.UPDATE_POST, payload: { postId, updates: response.data } });
  } catch (error) {
    console.error("Error updating post:", error);
  }
};