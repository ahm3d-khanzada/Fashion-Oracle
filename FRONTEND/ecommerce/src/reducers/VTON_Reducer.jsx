// VTON_Reducer.jsx (Update to handle VTON history)
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

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  clothImage: null,
  humanImage: null,
  result: null,
  history: [],
  historyLoading: false,
  historyError: null,
};

export const VTON_Reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_CLOTH_IMAGE_REQUEST:
    case UPLOAD_HUMAN_IMAGE_REQUEST:
    case PERFORM_VIRTUAL_TRY_ON_REQUEST:
      return { ...state, loading: true, error: null };

    case UPLOAD_CLOTH_IMAGE_SUCCESS:
      return { ...state, loading: false, clothImage: action.payload, error: null };

    case UPLOAD_HUMAN_IMAGE_SUCCESS:
      return { ...state, loading: false, humanImage: action.payload, error: null };

    case PERFORM_VIRTUAL_TRY_ON_SUCCESS:
      return { ...state, loading: false, result: action.payload, error: null };

    case UPLOAD_CLOTH_IMAGE_FAILURE:
    case UPLOAD_HUMAN_IMAGE_FAILURE:
    case PERFORM_VIRTUAL_TRY_ON_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_VTON_HISTORY_REQUEST:
      return { ...state, historyLoading: true, historyError: null };

    case FETCH_VTON_HISTORY_SUCCESS:
      return { ...state, historyLoading: false, history: action.payload, historyError: null };

    case FETCH_VTON_HISTORY_FAILURE:
      return { ...state, historyLoading: false, historyError: action.payload };

    default:
      return state;
  }
};