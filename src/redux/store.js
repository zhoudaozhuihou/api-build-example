import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apiReducer from './slices/apiSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

// 权限管理相关reducer
import permissionReducer from './slices/auth/permissionSlice';
import userGroupReducer from './slices/auth/userGroupSlice';
import userReducer from './slices/auth/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    notification: notificationReducer,
    ui: uiReducer,
    // 添加权限管理相关reducer
    permissions: permissionReducer,
    userGroups: userGroupReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 