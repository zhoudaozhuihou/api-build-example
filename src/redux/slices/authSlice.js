import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout,
  updateUserProfile
} = authSlice.actions;

// 异步action creator
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    // 这里应该是实际的API调用
    // const response = await api.login(credentials);
    
    // 模拟API成功响应
    const mockResponse = {
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        name: '管理员',
        avatar: null,
        role: 'admin',
      },
      token: 'mock-jwt-token-1234567890',
    };
    
    setTimeout(() => {
      dispatch(loginSuccess(mockResponse));
    }, 1000);
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

// 选择器
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer; 