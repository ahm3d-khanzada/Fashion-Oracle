import axios from "axios";
import {
  UPLOAD_CLOTH_IMAGE_REQUEST,
  UPLOAD_CLOTH_IMAGE_SUCCESS,
  UPLOAD_CLOTH_IMAGE_FAILURE,
  UPLOAD_HUMAN_IMAGE_REQUEST,
  UPLOAD_HUMAN_IMAGE_SUCCESS,
  UPLOAD_HUMAN_IMAGE_FAILURE,
  PERFORM_VIRTUAL_TRY_ON_REQUEST,
  PERFORM_VIRTUAL_TRY_ON_SUCCESS,
  PERFORM_VIRTUAL_TRY_ON_FAILURE,
  FETCH_VTON_HISTORY_REQUEST,
  FETCH_VTON_HISTORY_SUCCESS,
  FETCH_VTON_HISTORY_FAILURE,
} from "../constants/VTON_Constant";

const getToken = () => localStorage.getItem('accessToken');

export const uploadClothImage = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPLOAD_CLOTH_IMAGE_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post("http://127.0.0.1:8000/api/vton/upload-cloth/", formData, config);

    dispatch({ type: UPLOAD_CLOTH_IMAGE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: UPLOAD_CLOTH_IMAGE_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const uploadHumanImage = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPLOAD_HUMAN_IMAGE_REQUEST });
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post("http://127.0.0.1:8000/api/vton/upload-human/", formData, config);

    dispatch({ type: UPLOAD_HUMAN_IMAGE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: UPLOAD_HUMAN_IMAGE_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const performVirtualTryOn = (clothImage, humanImage) => async (dispatch, getState) => {
  try {
    dispatch({ type: PERFORM_VIRTUAL_TRY_ON_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("clothImage", clothImage);
    formData.append("humanImage", humanImage);

    const response = await axios.post("http://127.0.0.1:8000/api/vton/virtual-try-on/", formData, config);

    dispatch({ type: PERFORM_VIRTUAL_TRY_ON_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: PERFORM_VIRTUAL_TRY_ON_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const fetchVTONHistory = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_VTON_HISTORY_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get("http://127.0.0.1:8000/api/vton/vton-history/", config);

    dispatch({ type: FETCH_VTON_HISTORY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_VTON_HISTORY_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};