import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, ProductsType } from '../../utils/customTypes';
import cartService from './cartService';
import axios from '../../utils/axios';
import { RootState } from '../../app/store';
import {
  clearCartLocal,
  getCartLocal,
  saveOrUpdateCartLocal,
} from '../../utils/db';
import { combineCartItems } from '../../utils/combinedCartItems';

const initialState = {
  products: [] as ProductsType[] | [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  cartQuantity: 0,
  cartItems: [] as CartItem[] | [],
};

export const addCartThunk = createAsyncThunk<
  any,
  void,
  { state: RootState; rejectValue: unknown } // Proper typing for getState and rejectWithValue
>('cart/POST/UPDATECART', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    return await cartService.addCart(state.cart.cartItems);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getCartThunk = createAsyncThunk(
  'cart/GET/ALLCART',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getProducts = createAsyncThunk<ProductsType[]>(
  'product/GET/ALLPRODUCT',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get<ProductsType[]>('/api/product/');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Async thunk to save or update the cart in IndexedDB
export const saveCartInLocal = createAsyncThunk<
  any,
  void,
  { state: RootState; rejectValue: unknown }
>('db/cart/saveCart', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    await saveOrUpdateCartLocal(state.cart.cartItems);
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Async thunk to load the cart from IndexedDB
export const loadCartFromLocal = createAsyncThunk<
  any,
  void,
  { state: RootState; rejectValue: unknown }
>('cart/loadCart', async (_, { getState, rejectWithValue }) => {
  try {
    const items = await getCartLocal();
    return items;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Async thunk to clear the cart in IndexedDB
export const clearCartInLocal = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await clearCartLocal();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: state => {
      state.cartItems = [];
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.cartQuantity = 0;
    },
    increaseCartQuantity: (state, action) => {
      state.cartItems =
        state.cartItems.find(item => item._id === action.payload._id) == null
          ? [
              ...state.cartItems,
              {
                _id: action.payload._id,
                quantity: 1,
                title: action.payload.title,
                price: action.payload.price,
              },
            ]
          : state.cartItems.map(item => {
              if (item._id === action.payload._id)
                return { ...item, quantity: item.quantity + 1 };
              else {
                return item;
              }
            });
      state.cartQuantity = state.cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
      );
    },
    decreaseCartQuantity: (state, action) => {
      state.cartItems =
        state.cartItems.find(item => item._id === action.payload._id)
          ?.quantity === 1
          ? state.cartItems.filter(item => item._id !== action.payload._id)
          : state.cartItems.map(item => {
              if (item._id === action.payload._id)
                return { ...item, quantity: item.quantity - 1 };
              else {
                return item;
              }
            });
      state.cartQuantity = state.cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item._id !== action.payload
      );

      state.cartQuantity = state.cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addCartThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(addCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload as string;
      })
      .addCase(addCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(getCartThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.cartItems = combineCartItems(
          action.payload as CartItem[] | [],
          state.cartItems
        );
        state.cartQuantity = state.cartItems
          .map(item => item.quantity) // Extract quantities
          .reduce((total, qty) => total + qty, 0); // Sum them
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(getProducts.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<ProductsType[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.products = action.payload;
        }
      )
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(saveCartInLocal.pending, state => {
        state.isLoading = true;
      })
      .addCase(saveCartInLocal.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(saveCartInLocal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(loadCartFromLocal.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadCartFromLocal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload;
        state.cartQuantity = state.cartItems
          .map(item => item.quantity) // Extract quantities
          .reduce((total, qty) => total + qty, 0); // Sum them
      })
      .addCase(loadCartFromLocal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(clearCartInLocal.pending, state => {
        state.isLoading = true;
      })
      .addCase(clearCartInLocal.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(clearCartInLocal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      });
  },
});

export const {
  reset,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
