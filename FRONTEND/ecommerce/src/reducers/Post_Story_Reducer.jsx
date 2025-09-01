import * as types from "../constants/Post_Constant";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const Post_Story_Reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_POSTS_SUCCESS:
      return { ...state, loading: false, posts: action.payload };
    case types.FETCH_POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };

    case types.LIKE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? { ...post, isLiked: action.payload.isLiked, likes: post.likes + (action.payload.isLiked ? 1 : -1) }
            : post
        ),
      };

    case types.ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? { ...post, comments: [...post.comments, action.payload.comment] }
            : post
        ),
      };

    case types.DELETE_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== action.payload.commentId) }
            : post
        ),
      };

    default:
      return state;
  }
};

export default Post_Story_Reducer;