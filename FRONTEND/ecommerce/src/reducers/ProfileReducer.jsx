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

const initialState = {
  profile: null, // Store the user's profile
  userPosts: {}, // Store posts by user ID
  loading: false, // Loading state for profile
  postsLoading: false, // Loading state for posts
  error: null
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case FOLLOW_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload, // Store the profile data
        error: null
      };

    case FOLLOW_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          is_following: action.payload.is_following, // Update follow status
          followersCount: action.payload.followersCount // Update followers count
        },
        error: null
      };

    case FETCH_USER_POSTS_REQUEST:
      return {
        ...state,
        postsLoading: true,
        error: null
      };

    case FETCH_USER_POSTS_SUCCESS:
      return {
        ...state,
        postsLoading: false,
        userPosts: {
          ...state.userPosts,
          [action.payload.userId]: action.payload.posts // Store posts by user ID
        }
      };

    case FETCH_PROFILE_FAILURE:
    case UPDATE_PROFILE_FAILURE:
    case FOLLOW_USER_FAILURE:
    case FETCH_USER_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        postsLoading: false,
        error: action.payload,
        profile: action.type === FETCH_PROFILE_FAILURE ? null : state.profile
      };

    default:
      return state;
  }
};