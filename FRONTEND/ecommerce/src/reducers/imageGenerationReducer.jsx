import {
    IMAGE_GENERATION_REQUEST,
    IMAGE_GENERATION_SUCCESS,
    IMAGE_GENERATION_FAILURE,
    IMAGE_GENERATION_RESET,
    USER_IMAGES_REQUEST,
    USER_IMAGES_SUCCESS,
    USER_IMAGES_FAILURE
  } from "../constants/Image_Gen_Constants"
  
  const initialState = {
    loading: false,
    image: null,
    error: null,
    history: [],
    historyLoading: false,
    historyError: null
  }
  
  export const imageGenerationReducer = (state = initialState, action) => {
    switch (action.type) {
      case IMAGE_GENERATION_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        }
  
      case IMAGE_GENERATION_SUCCESS:
        return {
          ...state,
          loading: false,
          image: action.payload,
          error: null,
        }
  
      case IMAGE_GENERATION_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
  
      case IMAGE_GENERATION_RESET:
        return {
          ...state,
          loading: false,
          image: null,
          error: null,
        }
  
      case USER_IMAGES_REQUEST:
        return {
          ...state,
          historyLoading: true,
          historyError: null,
        }
  
      case USER_IMAGES_SUCCESS:
        return {
          ...state,
          historyLoading: false,
          history: action.payload,
          historyError: null,
        }
  
      case USER_IMAGES_FAILURE:
        return {
          ...state,
          historyLoading: false,
          historyError: action.payload,
        }
  
      default:
        return state
    }
  }