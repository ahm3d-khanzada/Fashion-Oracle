import axios from "axios"
import {
  IMAGE_GENERATION_REQUEST,
  IMAGE_GENERATION_SUCCESS,
  IMAGE_GENERATION_FAILURE,
  IMAGE_GENERATION_RESET,
  USER_IMAGES_REQUEST,
  USER_IMAGES_SUCCESS,
  USER_IMAGES_FAILURE
} from "../constants/Image_Gen_Constants"

// Action creator for generating images
export const generateImage = (prompt) => async (dispatch, getState) => {
  try {
    dispatch({ type: IMAGE_GENERATION_REQUEST })

      const token = localStorage.getItem('accessToken');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

    const { data } = await axios.post(
      "http://127.0.0.1:8000/api/images/generate/",
      { prompt },
      config
    )

    const imageUrl = `data:image/png;base64,${data.image_data}`

    dispatch({
      type: IMAGE_GENERATION_SUCCESS,
      payload: imageUrl,
    })
  } catch (error) {
    dispatch({
      type: IMAGE_GENERATION_FAILURE,
      payload:
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message,
    })
  }
}

// Action to fetch user's generation history
export const fetchUserImages = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_IMAGES_REQUEST })

    const token = localStorage.getItem('accessToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/json'
      },
    };

    const { data } = await axios.get("http://127.0.0.1:8000/api/images/history/", config)

    const imagesWithUrls = data.map(item => ({
      ...item,
      imageUrl: `data:image/png;base64,${item.image_data}`
    }))

    dispatch({
      type: USER_IMAGES_SUCCESS,
      payload: imagesWithUrls,
    })
  } catch (error) {
    dispatch({
      type: USER_IMAGES_FAILURE,
      payload:
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message,
    })
  }
}

// Reset the image generation state
export const resetImageGeneration = () => (dispatch) => {
  dispatch({ type: IMAGE_GENERATION_RESET })
}