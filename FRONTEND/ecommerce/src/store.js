// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Use localStorage
// import { userReducer } from "./reducers/userReducer"; // Your user reduce
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';  // Import without curly braces
import { composeWithDevTools } from 'redux-devtools-extension';
import { productsListReducers, productDetailsReducers } from './reducers/productReducer';
import { userSignupReducer, userSigninReducer, forgotPasswordReducer, resetPasswordReducer } from './reducers/UserReducer';
import { cartReducer } from './reducers/CartReducer';
import {profileReducer} from './reducers/ProfileReducer';
import { createPostReducer } from './reducers/Create_Post_Reducer';
import Post_Story_Reducer from './reducers/Post_Story_Reducer';
import {searchReducer} from './reducers/Search_Reducer';
import Recommendation_Reducers from './reducers/Recommendation_Reducers'
import Notification_Reducer from './reducers/Notification_Reducers';
import {VTON_Reducer} from './reducers/VTON_Reducer';
import { imageGenerationReducer } from "./reducers/imageGenerationReducer"
import {
  donationListReducer,
  donationDetailsReducer,
  donationSubmitReducer,
  donationUpdateReducer,
  donationDeleteReducer,
  donationRequestListReducer,
  donationRequestSubmitReducer,
  donationRequestUpdateReducer,
  donationRequestDeleteReducer,
  fileUploadReducer,
  donorRatingSubmitReducer,
  donorRatingsListReducer,
  doneeRatingSubmitReducer,
  doneeRatingsListReducer,
  donationApproveReducer,
  donationRejectReducer,
  donationExpireReducer,
  requestExpireReducer,
} from "./reducers/donationReducers"


// const persistConfig = {
//   key: "root",
//   storage,
// };

// const rootReducer = combineReducers({
//   user: persistReducer(persistConfig, userReducer),
// });


const reducers = combineReducers({
  productsList: productsListReducers,       // products
  productDetails: productDetailsReducers,   // product
  userSignin: userSigninReducer,            // user signin
  userSignup: userSignupReducer,            // user signup
  cart: cartReducer,                        // cart
  userForgotPassword: forgotPasswordReducer, // forgot password
  resetPassword: resetPasswordReducer,      // reset password
  profile: profileReducer,                   // profile
  createPost: createPostReducer,            // create post
  posts: Post_Story_Reducer, // post story reducer
  search: searchReducer, // search reducer
  clothing: Recommendation_Reducers,  // recommendation main reducer
  notifications: Notification_Reducer, // notifications reducer
  vton: VTON_Reducer, // vton reducer
  imageGeneration: imageGenerationReducer,

  // Donation Part
  // Donation reducers
  donationList: donationListReducer,
  donationDetails: donationDetailsReducer,
  donationSubmit: donationSubmitReducer,
  donationUpdate: donationUpdateReducer,
  donationDelete: donationDeleteReducer,

  // Donation request reducers
  donationRequestList: donationRequestListReducer,
  donationRequestSubmit: donationRequestSubmitReducer,
  donationRequestUpdate: donationRequestUpdateReducer,
  donationRequestDelete: donationRequestDeleteReducer,

  // File upload reducer
  fileUpload: fileUploadReducer,

  // Rating reducers
  donorRatingSubmit: donorRatingSubmitReducer,
  donorRatingsList: donorRatingsListReducer,
  doneeRatingSubmit: doneeRatingSubmitReducer,
  doneeRatingsList: doneeRatingsListReducer,

  // Status change reducers
  donationApprove: donationApproveReducer,
  donationReject: donationRejectReducer,
  donationExpire: donationExpireReducer,
  requestExpire: requestExpireReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
  cart: { cartItems: cartItemsFromStorage },  // cart items from local storage or initial state
};

const middleware = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
