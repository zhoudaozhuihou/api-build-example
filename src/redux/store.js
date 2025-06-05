import { configureStore } from '@reduxjs/toolkit';
import apiReducer, { initialState as apiInitialState } from './slices/apiSlice';
import datasetReducer, { initialState as datasetInitialState } from './slices/datasetSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import connectionReducer, { initialState as connectionInitialState } from './slices/connectionSlice';

// 权限管理相关reducer
import permissionReducer from './slices/auth/permissionSlice';
import userGroupReducer from './slices/auth/userGroupSlice';
import userReducer from './slices/auth/userSlice';

// 初始化 localStorage 数据
const initializeLocalStorage = () => {
  // 初始化数据集
  if (!localStorage.getItem('datasets')) {
    localStorage.setItem('datasets', JSON.stringify(datasetInitialState.datasets));
  }
  
  // 初始化数据库连接
  if (!localStorage.getItem('connections')) {
    localStorage.setItem('connections', JSON.stringify(connectionInitialState.connections));
  }
  
  // 初始化API
  if (!localStorage.getItem('apis')) {
    localStorage.setItem('apis', JSON.stringify(apiInitialState.apis));
  }
};

// 初始化数据
initializeLocalStorage();

const store = configureStore({
  reducer: {
    api: apiReducer,
    datasets: datasetReducer,
    subscriptions: subscriptionReducer,
    ui: uiReducer,
    auth: authReducer,
    notifications: notificationReducer,
    connections: connectionReducer,
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