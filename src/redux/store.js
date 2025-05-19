import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './slices/apiSlice';
import datasetReducer from './slices/datasetSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

// 权限管理相关reducer
import permissionReducer from './slices/auth/permissionSlice';
import userGroupReducer from './slices/auth/userGroupSlice';
import userReducer from './slices/auth/userSlice';

const store = configureStore({
  reducer: {
    api: apiReducer,
    datasets: datasetReducer,
    subscriptions: subscriptionReducer,
    ui: uiReducer,
    auth: authReducer,
    notifications: notificationReducer,
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