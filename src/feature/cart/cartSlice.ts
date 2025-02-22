import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductsType } from '../../utils/customTypes';

import axios from '../../utils/axios';

const initialState = {
  products: [] as ProductsType[] | [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

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

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: state => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: builder => {
    builder
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
      });
  },
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;
