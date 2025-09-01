import axios from "axios";
import {
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAILURE,
} from "../constants/Recommendation_Constants";

const API_BASE_URL = "http://localhost:8000/api/recommendation";

export const uploadImage = (image) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_IMAGE_REQUEST });

    const formData = new FormData();
    formData.append("image", image);

    const { data } = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: UPLOAD_IMAGE_SUCCESS,
      payload: data, // Directly pass the API response
    });

    return data; // Return the data for immediate access

  } catch (error) {
    dispatch({
      type: UPLOAD_IMAGE_FAILURE,
      payload: error.response?.data?.message || "Image upload failed",
    });
    throw error; // Propagate the error
  }
};

export const getRecommendation = (imageId) => async (dispatch) => {
  try {
    dispatch({ type: GET_RECOMMENDATION_REQUEST });

    const { data } = await axios.post(
      `${API_BASE_URL}/recommend/`,
      { imageId }, // Send as plain object
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: GET_RECOMMENDATION_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: GET_RECOMMENDATION_FAILURE,
      payload: error.response?.data?.message || "Recommendation failed",
    });
    throw error;
  }
};