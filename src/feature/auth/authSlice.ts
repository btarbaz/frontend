import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';
import { AuthFormData, LoginData } from '../../utils/customTypes';

// Get user from local Storage
const user = {
  username: localStorage.getItem('username')!,
  token: localStorage.getItem('token')!,
};

const initialState = {
  user: {
    username: user ? user.username : null,
    token: user ? user.token : null,
  } as LoginData | null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

export const registerThunk = createAsyncThunk(
  'auth/POST/REGISTER',
  async (user: AuthFormData, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/POST/LOGIN',
  async (user: AuthFormData, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logoutUser', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: state => {
      state.user = null;
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(registerThunk.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) ||
          action.error.message ||
          'Something went wrong';
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null;
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = '';
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
