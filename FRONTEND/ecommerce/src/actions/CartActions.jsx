import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/CartConstants";
import axios from "axios";

// Action to add item to cart
export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/product/${id}`);

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data.id,
        productname: data.productname,
        image: data.image,
        price: data.price,
        stockcount: data.stockcount,
        qty,
      },
    });

    // Save cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
};

// Action to remove item from cart
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  // Save updated cart items to localStorage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Action to load cart items from localStorage into Redux store
export const loadCartFromLocalStorage = () => (dispatch) => {
  const cartItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

  cartItems.forEach((item) => {
    dispatch({
      type: CART_ADD_ITEM,
      payload: item,
    });
  });
};
