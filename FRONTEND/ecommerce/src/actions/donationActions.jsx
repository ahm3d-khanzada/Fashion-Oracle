import axios from "axios";
import {
  // Donation submission constants
  DONATION_SUBMIT_REQUEST,
  DONATION_SUBMIT_SUCCESS,
  DONATION_SUBMIT_FAIL,
  // Donation list constants
  DONATION_LIST_REQUEST,
  DONATION_LIST_SUCCESS,
  DONATION_LIST_FAIL,
  // Donation details constants
  DONATION_DETAILS_REQUEST,
  DONATION_DETAILS_SUCCESS,
  DONATION_DETAILS_FAIL,
  // Donation update constants
  DONATION_UPDATE_REQUEST,
  DONATION_UPDATE_SUCCESS,
  DONATION_UPDATE_FAIL,
  // Donation delete constants
  DONATION_DELETE_REQUEST,
  DONATION_DELETE_SUCCESS,
  DONATION_DELETE_FAIL,
  // Donation request constants
  DONATION_REQUEST_SUBMIT_REQUEST,
  DONATION_REQUEST_SUBMIT_SUCCESS,
  DONATION_REQUEST_SUBMIT_FAIL,
  // Donation request list constants
  DONATION_REQUEST_LIST_REQUEST,
  DONATION_REQUEST_LIST_SUCCESS,
  DONATION_REQUEST_LIST_FAIL,
  // Donation request update constants
  DONATION_REQUEST_UPDATE_REQUEST,
  DONATION_REQUEST_UPDATE_SUCCESS,
  DONATION_REQUEST_UPDATE_FAIL,
  // Donation request delete constants
  DONATION_REQUEST_DELETE_REQUEST,
  DONATION_REQUEST_DELETE_SUCCESS,
  DONATION_REQUEST_DELETE_FAIL,
  // File upload constants
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAIL,
  // Rating constants
  DONOR_RATING_SUBMIT_REQUEST,
  DONOR_RATING_SUBMIT_SUCCESS,
  DONOR_RATING_SUBMIT_FAIL,
  DONOR_RATINGS_LIST_REQUEST,
  DONOR_RATINGS_LIST_SUCCESS,
  DONOR_RATINGS_LIST_FAIL,
  DONEE_RATING_SUBMIT_REQUEST,
  DONEE_RATING_SUBMIT_SUCCESS,
  DONEE_RATING_SUBMIT_FAIL,
  DONEE_RATINGS_LIST_REQUEST,
  DONEE_RATINGS_LIST_SUCCESS,
  DONEE_RATINGS_LIST_FAIL,
  // Status change constants for donations
  DONATION_APPROVE_REQUEST,
  DONATION_APPROVE_SUCCESS,
  DONATION_APPROVE_FAIL,
  DONATION_REJECT_REQUEST,
  DONATION_REJECT_SUCCESS,
  DONATION_REJECT_FAIL,
  DONATION_EXPIRE_REQUEST,
  DONATION_EXPIRE_SUCCESS,
  DONATION_EXPIRE_FAIL,
  // Status change constants for requests
  REQUEST_EXPIRE_REQUEST,
  REQUEST_EXPIRE_SUCCESS,
  REQUEST_EXPIRE_FAIL,
} from "../constants/donationConstants";

// API base URL - Change this to your actual API URL in production
const API_URL = "http://localhost:8000/api";

const getToken = () => localStorage.getItem('accessToken');

const handleApiError = (error, dispatch, actionType) => {
  const message = error.response && error.response.data.message ? error.response.data.message : error.message;
  dispatch({
    type: actionType,
    payload: message,
  });
};


export const uploadFiles = (files) => async (dispatch) => {
  try {
    dispatch({ type: FILE_UPLOAD_REQUEST });

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
    files.forEach((file) => formData.append("file", file));

    const { data } = await axios.post(`${API_URL}/donations/upload/`, formData, config);

    dispatch({
      type: FILE_UPLOAD_SUCCESS,
      payload: data,
    });

    return data.fileUrls;
  } catch (error) {
    handleApiError(error, dispatch, FILE_UPLOAD_FAIL);
    throw error;
  }
};

// 🚨 FIXED: Content-Type is now application/json
export const submitDonation = (donationData) => async (dispatch) => {
  try {
    dispatch({ type: DONATION_SUBMIT_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    let imageUrls = [];
    if (donationData.images && donationData.images.length > 0) {
      imageUrls = await dispatch(uploadFiles(donationData.images));
    }

    const preparedData = {
      ...donationData,
      images: imageUrls,
    };

    const config = {
      headers: {
        "Content-Type": "application/json", // ✅ JSON now!
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/donations/create/`, preparedData, config);

    dispatch({
      type: DONATION_SUBMIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_SUBMIT_FAIL);
  }
};
/**
 * Get list of donations, optionally filtered by city
 * @param {String} city - Optional city filter
 */
export const listDonations = (city = "", myDonations = false) => async (dispatch) => {
  try {
    dispatch({ type: DONATION_LIST_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        city: city || undefined,
        my_donations: myDonations ? 'true' : undefined,
      },
    };

    const { data } = await axios.get(`${API_URL}/donations/`, config);

    dispatch({
      type: DONATION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_LIST_FAIL);
  }
};

/**
 * Get details of a specific donation
 * @param {String} id - ID of the donation
 */
export const getDonationDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_DETAILS_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/donations/${id}`, config);

    dispatch({
      type: DONATION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_DETAILS_FAIL);
  }
};

/**
 * Update an existing donation
 * @param {String} id - ID of the donation to update
 * @param {Object} donationData - Updated donation data
 */
export const updateDonation = (id, donationData) => async (dispatch) => {
  try {
    dispatch({ type: DONATION_UPDATE_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        "Content-Type": "application/json", // ✅ JSON, not multipart!
        Authorization: `Bearer ${token}`,
      },
    };

    // ✅ Separate already-uploaded URLs from new image files
    let imageUrls = [];
    if (donationData.images && donationData.images.length > 0) {
      const newImages = donationData.images.filter(
        (img) => !(typeof img === "string" && img.startsWith("http"))
      );

      const existingImages = donationData.images.filter(
        (img) => typeof img === "string" && img.startsWith("http")
      );

      if (newImages.length > 0) {
        const uploaded = await dispatch(uploadFiles(newImages));
        imageUrls = [...existingImages, ...uploaded];
      } else {
        imageUrls = existingImages;
      }
    }

    const preparedData = {
      ...donationData,
      images: imageUrls,
    };

    const { data } = await axios.put(`${API_URL}/donations/${id}/update/`, preparedData, config);

    dispatch({
      type: DONATION_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_UPDATE_FAIL);
  }
};

/**
 * Delete a donation
 * @param {String} id - ID of the donation to delete
 */
export const deleteDonation = (id) => async (dispatch) => {
  try {
    dispatch({ type: DONATION_DELETE_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${API_URL}/donations/${id}/delete/`, config);

    dispatch({
      type: DONATION_DELETE_SUCCESS,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_DELETE_FAIL);
  }
};

/**
 * Submit a request for a donation
 * @param {String} donationId - ID of the donation being requested
 * @param {Object} requestData - Data for the request
 */
export const submitDonationRequest = (donationId, requestData) => async (dispatch) => {
  try {
    dispatch({ type: DONATION_REQUEST_SUBMIT_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/donations/${donationId}/request/`, requestData, config);

    dispatch({
      type: DONATION_REQUEST_SUBMIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred while submitting the request";
    dispatch({
      type: DONATION_REQUEST_SUBMIT_FAIL,
      payload: message,
    });
    throw new Error(message);
  }
};

/**
 * Get list of donation requests for the current donor
//  */
// export const listDonorDonationRequests = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: DONATION_REQUEST_LIST_REQUEST });

//     const token = getToken();
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     const { data } = await axios.get(`${API_URL}/donations/requests/user/`, config);

//     dispatch({
//       type: DONATION_REQUEST_LIST_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     handleApiError(error, dispatch, DONATION_REQUEST_LIST_FAIL);
//   }
// };

/**
 * Get list of all donation requests
 */
export const listDonorDonationRequests = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_REQUEST_LIST_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/donations/requests/donor/`, config);

    dispatch({
      type: DONATION_REQUEST_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_REQUEST_LIST_FAIL);
  }
};

/**
 * Get list of donation requests for the current user
 */
export const listUserDonationRequests = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_REQUEST_LIST_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/donations/requests/user/`, config);

    dispatch({
      type: DONATION_REQUEST_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_REQUEST_LIST_FAIL);
  }
};

/**
 * Update a donation request
 * @param {String} id - ID of the request to update
 * @param {Object} requestData - Updated request data
 */
export const updateDonationRequest = (id, requestData) => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_REQUEST_UPDATE_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }


    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const endpoint = requestData.status === "approved" 
      ? `${API_URL}/donations/requests/${id}/approve/` 
      : `${API_URL}/donations/requests/${id}/reject/`;

    const { data } = await axios.post(endpoint, requestData, config);

    dispatch({
      type: DONATION_REQUEST_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_REQUEST_UPDATE_FAIL);
  }
};

/**
 * Delete a donation request
 * @param {String} id - ID of the request to delete
 */
export const deleteDonationRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: DONATION_REQUEST_DELETE_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${API_URL}/donations/requests/${id}/delete/`, config);

    dispatch({
      type: DONATION_REQUEST_DELETE_SUCCESS,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_REQUEST_DELETE_FAIL);
  }
};

/**
 * Submit a rating for a donor
 * @param {String} donorId - ID of the donor being rated
 * @param {Object} ratingData - Rating data
 */
export const submitDonorRating = (donorId, ratingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: DONOR_RATING_SUBMIT_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/ratings/donor/${donorId}`, ratingData, config);

    dispatch({
      type: DONOR_RATING_SUBMIT_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    handleApiError(error, dispatch, DONOR_RATING_SUBMIT_FAIL);
    throw error;
  }
};

/**
 * Get ratings for a donor
 * @param {String} donorId - ID of the donor
 */
export const getDonorRatings = (donorId) => async (dispatch) => {
  try {
    dispatch({ type: DONOR_RATINGS_LIST_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/donations/ratings/donor/${donorId}/list/`, config);

    dispatch({
      type: DONOR_RATINGS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONOR_RATINGS_LIST_FAIL);
  }
};

/**
 * Submit a rating for a donee
 * @param {Number} doneeId - Integer ID of the donee being rated
 * @param {Object} ratingData - Rating data
 */
export const submitDoneeRating = (doneeId, ratingData) => async (dispatch) => {
  try {
    dispatch({ type: DONEE_RATING_SUBMIT_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate doneeId is an integer
    const parsedId = parseInt(doneeId);
    if (!Number.isInteger(parsedId)) {
      throw new Error(`Invalid doneeId: Must be an integer, received ${doneeId}`);
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/donations/ratings/donee/${parsedId}/`,
      ratingData,
      config
    );

    dispatch({
      type: DONEE_RATING_SUBMIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Submit Donee Rating Error:", error.response || error.message);
    dispatch({
      type: DONEE_RATING_SUBMIT_FAIL,
      payload:
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message,
    });
  }
};

export const getDoneeRatings = (doneeId) => async (dispatch) => {
  try {
    dispatch({ type: DONEE_RATINGS_LIST_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate doneeId is an integer
    const parsedId = parseInt(doneeId);
    if (!Number.isInteger(parsedId)) {
      throw new Error(`Invalid doneeId: Must be an integer, received ${doneeId}`);
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/donations/ratings/donee/${parsedId}/list/`,
      config
    );

    dispatch({
      type: DONEE_RATINGS_LIST_SUCCESS,
      payload: data,
    });
    return { type: DONEE_RATINGS_LIST_SUCCESS, payload: data }; // Return action for promise
  } catch (error) {
    console.error("Get Donee Ratings Error:", error.response || error.message);
    dispatch({
      type: DONEE_RATINGS_LIST_FAIL,
      payload:
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message,
    });
    throw error; // Throw error for promise rejection
  }
};

/**
 * Approve a donation
 * @param {String} id - ID of the donation to approve
 */
export const approveDonation = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_APPROVE_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/donations/${id}/approve`, {}, config);

    dispatch({
      type: DONATION_APPROVE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_APPROVE_FAIL);
  }
};

/**
 * Reject a donation
 * @param {String} id - ID of the donation to reject
 * @param {String} reason - Reason for rejection
 */
export const rejectDonation = (id, reason) => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_REJECT_REQUEST });

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/donations/${id}/reject`, { reason }, config);

    dispatch({
      type: DONATION_REJECT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_REJECT_FAIL);
  }
};

/**
 * Mark a donation as expired
 * @param {String} id - ID of the donation to expire
 */
export const expireDonation = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DONATION_EXPIRE_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/donations/${id}/expire`, {}, config);

    dispatch({
      type: DONATION_EXPIRE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, DONATION_EXPIRE_FAIL);
  }
};

/**
 * Mark a donation request as expired
 * @param {String} id - ID of the request to expire
 */
export const expireRequest = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_EXPIRE_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/donations/requests/${id}/expire`, {}, config);

    dispatch({
      type: REQUEST_EXPIRE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    handleApiError(error, dispatch, REQUEST_EXPIRE_FAIL);
  }
};