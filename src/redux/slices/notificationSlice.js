import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unseenCount: 0,
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.notifications = action.payload;
      state.unseenCount = action.payload.filter(n => !n.seen).length;
      state.loading = false;
    },
    fetchNotificationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.seen) {
        state.unseenCount += 1;
      }
    },
    markAsSeen: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.seen) {
        notification.seen = true;
        state.unseenCount -= 1;
      }
    },
    markAllAsSeen: (state) => {
      state.notifications.forEach(notification => {
        notification.seen = true;
      });
      state.unseenCount = 0;
    },
    deleteNotification: (state, action) => {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
      if (notificationIndex !== -1) {
        const wasUnseen = !state.notifications[notificationIndex].seen;
        state.notifications.splice(notificationIndex, 1);
        if (wasUnseen) {
          state.unseenCount -= 1;
        }
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unseenCount = 0;
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markAsSeen,
  markAllAsSeen,
  deleteNotification,
  clearAllNotifications,
} = notificationSlice.actions;

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    title: 'API更新通知',
    content: '您关注的支付API已更新到v2.0版本，请及时查看变更日志。',
    time: '10分钟前',
    type: 'update',
    seen: false
  },
  {
    id: 2,
    title: '系统维护公告',
    content: '系统将于今晚22:00-23:00进行例行维护，期间服务可能会有短暂中断。',
    time: '2小时前',
    type: 'system',
    seen: true
  },
  {
    id: 3,
    title: '新功能上线',
    content: 'API监控功能已上线，您可以实时查看API调用情况和性能数据。',
    time: '昨天',
    type: 'feature',
    seen: true
  }
];

// 异步action creator
export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    // 真实环境中应该从API获取数据
    // const response = await notificationService.getNotifications();
    
    setTimeout(() => {
      dispatch(fetchNotificationsSuccess(mockNotifications));
    }, 1000);
  } catch (error) {
    dispatch(fetchNotificationsFailure(error.message));
  }
};

// 添加新通知
export const createNotification = (notification) => (dispatch) => {
  const newNotification = {
    id: Date.now(),
    time: '刚刚',
    seen: false,
    ...notification,
  };
  dispatch(addNotification(newNotification));
};

// 选择器
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnseenCount = (state) => state.notifications.unseenCount;
export const selectNotificationLoading = (state) => state.notifications.loading;
export const selectNotificationError = (state) => state.notifications.error;

export default notificationSlice.reducer; 