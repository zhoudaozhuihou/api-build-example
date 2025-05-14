import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drawerOpen: window.innerWidth > 960, // 在大屏幕上默认打开抽屉
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
  language: localStorage.getItem('language') || 'zh',
  dialogs: {
    apiImport: false,
    apiDetails: false,
    confirmDelete: false,
    userProfile: false,
  },
  activeTab: 0,
  currentTheme: localStorage.getItem('theme') || 'blue',
  toast: {
    open: false,
    message: '',
    type: 'info', // 'info', 'success', 'warning', 'error'
    duration: 3000,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    openDialog: (state, action) => {
      state.dialogs[action.payload] = true;
    },
    closeDialog: (state, action) => {
      state.dialogs[action.payload] = false;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    showToast: (state, action) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
  },
});

export const {
  setDrawerOpen,
  toggleDrawer,
  setDarkMode,
  toggleDarkMode,
  setLanguage,
  openDialog,
  closeDialog,
  setActiveTab,
  setTheme,
  showToast,
  hideToast,
} = uiSlice.actions;

// 显示消息提示
export const displayToast = (message, type = 'info', duration = 3000) => (dispatch) => {
  dispatch(showToast({ message, type, duration }));
  setTimeout(() => {
    dispatch(hideToast());
  }, duration);
};

// 选择器
export const selectDrawerOpen = (state) => state.ui.drawerOpen;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectLanguage = (state) => state.ui.language;
export const selectDialogs = (state) => state.ui.dialogs;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectCurrentTheme = (state) => state.ui.currentTheme;
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer; 