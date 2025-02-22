import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import cartReducer from '../feature/cart/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

export default rootReducer;
