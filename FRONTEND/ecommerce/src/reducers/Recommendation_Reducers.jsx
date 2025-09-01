import {
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAILURE,
} from "../constants/Recommendation_Constants";

const initialState = {
  uploadedImage: null,
  recommendation: null,
  loading: false,
  error: null,
};

const Recommendation_Reducers = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE_REQUEST:
    case GET_RECOMMENDATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        uploadedImage: action.payload,
        loading: false,
      };
    case GET_RECOMMENDATION_SUCCESS:
      return {
        ...state,
        recommendation: action.payload,
        loading: false,
      };
    case UPLOAD_IMAGE_FAILURE:
    case GET_RECOMMENDATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default Recommendation_Reducers;