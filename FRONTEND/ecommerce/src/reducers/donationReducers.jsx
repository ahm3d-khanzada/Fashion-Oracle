import {
  DONATION_LIST_REQUEST,
  DONATION_LIST_SUCCESS,
  DONATION_LIST_FAIL,
  DONATION_DETAILS_REQUEST,
  DONATION_DETAILS_SUCCESS,
  DONATION_DETAILS_FAIL,
  DONATION_SUBMIT_REQUEST,
  DONATION_SUBMIT_SUCCESS,
  DONATION_SUBMIT_FAIL,
  DONATION_SUBMIT_RESET,
  DONATION_UPDATE_REQUEST,
  DONATION_UPDATE_SUCCESS,
  DONATION_UPDATE_FAIL,
  DONATION_UPDATE_RESET,
  DONATION_DELETE_REQUEST,
  DONATION_DELETE_SUCCESS,
  DONATION_DELETE_FAIL,
  DONATION_DELETE_RESET,
  DONATION_REQUEST_LIST_REQUEST,
  DONATION_REQUEST_LIST_SUCCESS,
  DONATION_REQUEST_LIST_FAIL,
  DONATION_REQUEST_SUBMIT_REQUEST,
  DONATION_REQUEST_SUBMIT_SUCCESS,
  DONATION_REQUEST_SUBMIT_FAIL,
  DONATION_REQUEST_SUBMIT_RESET,
  DONATION_REQUEST_UPDATE_REQUEST,
  DONATION_REQUEST_UPDATE_SUCCESS,
  DONATION_REQUEST_UPDATE_FAIL,
  DONATION_REQUEST_UPDATE_RESET,
  DONATION_REQUEST_DELETE_REQUEST,
  DONATION_REQUEST_DELETE_SUCCESS,
  DONATION_REQUEST_DELETE_FAIL,
  DONATION_REQUEST_DELETE_RESET,
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAIL,
  FILE_UPLOAD_RESET,
  DONOR_RATING_SUBMIT_REQUEST,
  DONOR_RATING_SUBMIT_SUCCESS,
  DONOR_RATING_SUBMIT_FAIL,
  DONOR_RATING_SUBMIT_RESET,
  DONOR_RATINGS_LIST_REQUEST,
  DONOR_RATINGS_LIST_SUCCESS,
  DONOR_RATINGS_LIST_FAIL,
  DONEE_RATING_SUBMIT_REQUEST,
  DONEE_RATING_SUBMIT_SUCCESS,
  DONEE_RATING_SUBMIT_FAIL,
  DONEE_RATING_SUBMIT_RESET,
  DONEE_RATINGS_LIST_REQUEST,
  DONEE_RATINGS_LIST_SUCCESS,
  DONEE_RATINGS_LIST_FAIL,
  DONATION_APPROVE_REQUEST,
  DONATION_APPROVE_SUCCESS,
  DONATION_APPROVE_FAIL,
  DONATION_APPROVE_RESET,
  DONATION_REJECT_REQUEST,
  DONATION_REJECT_SUCCESS,
  DONATION_REJECT_FAIL,
  DONATION_REJECT_RESET,
  DONATION_EXPIRE_REQUEST,
  DONATION_EXPIRE_SUCCESS,
  DONATION_EXPIRE_FAIL,
  DONATION_EXPIRE_RESET,
  REQUEST_EXPIRE_REQUEST,
  REQUEST_EXPIRE_SUCCESS,
  REQUEST_EXPIRE_FAIL,
  REQUEST_EXPIRE_RESET,
} from "../constants/donationConstants"

// ===============================================
// DONATION REDUCERS
// ===============================================

/**
 * Reducer for managing the list of donations.
 * Handles fetching/listing all donations.
 */
export const donationListReducer = (state = { donations: [] }, action) => {
  switch (action.type) {
    case DONATION_LIST_REQUEST:
      return { loading: true, donations: [] }
    case DONATION_LIST_SUCCESS:
      return { loading: false, donations: action.payload }
    case DONATION_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Reducer for managing the details of a specific donation.
 * Used when viewing a single donation's details.
 */
export const donationDetailsReducer = (state = { donation: {} }, action) => {
  switch (action.type) {
    case DONATION_DETAILS_REQUEST:
      return { loading: true, ...state }
    case DONATION_DETAILS_SUCCESS:
      return { loading: false, donation: action.payload }
    case DONATION_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Reducer for managing the submission of a new donation.
 * Handles creating and submitting a new donation.
 */
export const donationSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_SUBMIT_REQUEST:
      return { loading: true }
    case DONATION_SUBMIT_SUCCESS:
      return { loading: false, success: true, donation: action.payload }
    case DONATION_SUBMIT_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_SUBMIT_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing updates to an existing donation.
 * Handles editing/updating donation details.
 */
export const donationUpdateReducer = (state = { donation: {} }, action) => {
  switch (action.type) {
    case DONATION_UPDATE_REQUEST:
      return { loading: true }
    case DONATION_UPDATE_SUCCESS:
      return { loading: false, success: true, donation: action.payload }
    case DONATION_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_UPDATE_RESET:
      return { donation: {} }
    default:
      return state
  }
}

/**
 * Reducer for managing donation deletion.
 * Handles the process of deleting a donation.
 */
export const donationDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_DELETE_REQUEST:
      return { loading: true }
    case DONATION_DELETE_SUCCESS:
      return { loading: false, success: true }
    case DONATION_DELETE_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_DELETE_RESET:
      return {}
    default:
      return state
  }
}

// ===============================================
// DONATION REQUEST REDUCERS
// ===============================================

/**
 * Reducer for managing the list of donation requests.
 * Handles fetching/listing all requests for donations.
 */
export const donationRequestListReducer = (state = { requests: [] }, action) => {
  switch (action.type) {
    case DONATION_REQUEST_LIST_REQUEST:
      return { loading: true, requests: [] }
    case DONATION_REQUEST_LIST_SUCCESS:
      return { loading: false, requests: action.payload }
    case DONATION_REQUEST_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Reducer for managing the submission of a donation request.
 * Handles creating and submitting a new request for a donation.
 */
export const donationRequestSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_REQUEST_SUBMIT_REQUEST:
      return { loading: true }
    case DONATION_REQUEST_SUBMIT_SUCCESS:
      return { loading: false, success: true, request: action.payload }
    case DONATION_REQUEST_SUBMIT_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_REQUEST_SUBMIT_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing updates to an existing donation request.
 * Handles editing/updating request details.
 */
export const donationRequestUpdateReducer = (state = { request: {} }, action) => {
  switch (action.type) {
    case DONATION_REQUEST_UPDATE_REQUEST:
      return { loading: true }
    case DONATION_REQUEST_UPDATE_SUCCESS:
      return { loading: false, success: true, request: action.payload }
    case DONATION_REQUEST_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_REQUEST_UPDATE_RESET:
      return { request: {} }
    default:
      return state
  }
}

/**
 * Reducer for managing donation request deletion.
 * Handles the process of deleting a donation request.
 */
export const donationRequestDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_REQUEST_DELETE_REQUEST:
      return { loading: true }
    case DONATION_REQUEST_DELETE_SUCCESS:
      return { loading: false, success: true }
    case DONATION_REQUEST_DELETE_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_REQUEST_DELETE_RESET:
      return {}
    default:
      return state
  }
}

// ===============================================
// FILE UPLOAD REDUCER
// ===============================================

/**
 * Reducer for managing file uploads.
 * Handles uploading images and documents.
 */
export const fileUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case FILE_UPLOAD_REQUEST:
      return { loading: true }
    case FILE_UPLOAD_SUCCESS:
      return { loading: false, success: true, fileUrls: action.payload }
    case FILE_UPLOAD_FAIL:
      return { loading: false, error: action.payload }
    case FILE_UPLOAD_RESET:
      return {}
    default:
      return state
  }
}

// ===============================================
// RATING REDUCERS
// ===============================================

/**
 * Reducer for managing donor ratings submission.
 * Handles creating and submitting a new rating for a donor.
 */
export const donorRatingSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case DONOR_RATING_SUBMIT_REQUEST:
      return { loading: true }
    case DONOR_RATING_SUBMIT_SUCCESS:
      return { loading: false, success: true, rating: action.payload }
    case DONOR_RATING_SUBMIT_FAIL:
      return { loading: false, error: action.payload }
    case DONOR_RATING_SUBMIT_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing the list of donor ratings.
 * Handles fetching all ratings for a specific donor.
 */
export const donorRatingsListReducer = (state = { ratings: [] }, action) => {
  switch (action.type) {
    case DONOR_RATINGS_LIST_REQUEST:
      return { loading: true, ratings: [] }
    case DONOR_RATINGS_LIST_SUCCESS:
      return { loading: false, ratings: action.payload }
    case DONOR_RATINGS_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Reducer for managing donee ratings submission.
 * Handles creating and submitting a new rating for a donee.
 */
export const doneeRatingSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case DONEE_RATING_SUBMIT_REQUEST:
      return { loading: true }
    case DONEE_RATING_SUBMIT_SUCCESS:
      return { loading: false, success: true, rating: action.payload }
    case DONEE_RATING_SUBMIT_FAIL:
      return { loading: false, error: action.payload }
    case DONEE_RATING_SUBMIT_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing the list of donee ratings.
 * Handles fetching all ratings for a specific donee.
 */
export const doneeRatingsListReducer = (state = { ratings: [] }, action) => {
  switch (action.type) {
    case DONEE_RATINGS_LIST_REQUEST:
      return { loading: true, ratings: [] }
    case DONEE_RATINGS_LIST_SUCCESS:
      return { loading: false, ratings: action.payload }
    case DONEE_RATINGS_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// ===============================================
// STATUS CHANGE REDUCERS
// ===============================================

/**
 * Reducer for managing the approval of a donation.
 * Handles the process of approving a donation by an admin.
 */
export const donationApproveReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_APPROVE_REQUEST:
      return { loading: true }
    case DONATION_APPROVE_SUCCESS:
      return { loading: false, success: true, donation: action.payload }
    case DONATION_APPROVE_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_APPROVE_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing the rejection of a donation.
 * Handles the process of rejecting a donation by an admin.
 */
export const donationRejectReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_REJECT_REQUEST:
      return { loading: true }
    case DONATION_REJECT_SUCCESS:
      return { loading: false, success: true, donation: action.payload }
    case DONATION_REJECT_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_REJECT_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing the expiration of a donation.
 * Handles marking a donation as expired.
 */
export const donationExpireReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_EXPIRE_REQUEST:
      return { loading: true }
    case DONATION_EXPIRE_SUCCESS:
      return { loading: false, success: true, donation: action.payload }
    case DONATION_EXPIRE_FAIL:
      return { loading: false, error: action.payload }
    case DONATION_EXPIRE_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for managing the expiration of a donation request.
 * Handles marking a request as expired.
 */
export const requestExpireReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_EXPIRE_REQUEST:
      return { loading: true }
    case REQUEST_EXPIRE_SUCCESS:
      return { loading: false, success: true, request: action.payload }
    case REQUEST_EXPIRE_FAIL:
      return { loading: false, error: action.payload }
    case REQUEST_EXPIRE_RESET:
      return {}
    default:
      return state
  }
}

