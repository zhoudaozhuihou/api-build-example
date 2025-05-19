import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { API_TYPES } from './apiSlice';

// 订阅状态枚举
export const SUBSCRIPTION_STATUS = {
  PENDING: 'pending',           // 待处理
  APPROVED: 'approved',         // 已批准
  REJECTED: 'rejected',         // 已拒绝
  ACTIVE: 'active',             // 已激活（已绑定白名单）
  EXPIRED: 'expired',           // 已过期
  CANCELED: 'canceled',         // 已取消
};

// 订阅适配器
const subscriptionsAdapter = createEntityAdapter({
  selectId: subscription => subscription.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

// 初始状态
const initialState = subscriptionsAdapter.getInitialState({
  status: 'idle',
  error: null,
  // 白名单绑定信息
  whitelistBindings: [],
  loading: false,
  selectedSubscription: null,
});

// 获取所有订阅
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async () => {
    try {
      // 从localStorage获取订阅数据
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
      return subscriptions;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 创建订阅
export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (subscriptionData, { getState }) => {
    try {
      const { api } = getState();
      const apiData = api.entities[subscriptionData.apiId];
      
      // 创建订阅对象
      const newSubscription = {
        ...subscriptionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: SUBSCRIPTION_STATUS.PENDING,
        // 根据API类型确定是否需要白名单绑定
        needsWhitelist: apiData.type !== API_TYPES.UPLOADED,
        // 如果是上传的API，直接设置为已批准状态
        ...(apiData.type === API_TYPES.UPLOADED && { 
          status: SUBSCRIPTION_STATUS.APPROVED,
          approvedAt: new Date().toISOString()
        })
      };
      
      // 保存到localStorage
      const existingSubscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
      localStorage.setItem('subscriptions', JSON.stringify([...existingSubscriptions, newSubscription]));
      
      return newSubscription;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 更新订阅状态
export const updateSubscriptionStatus = createAsyncThunk(
  'subscriptions/updateSubscriptionStatus',
  async ({ id, status, reason }) => {
    try {
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
      const updatedSubscriptions = subscriptions.map(sub => {
        if (sub.id === id) {
          const changes = { status };
          
          // 添加时间戳
          if (status === SUBSCRIPTION_STATUS.APPROVED) {
            changes.approvedAt = new Date().toISOString();
          } else if (status === SUBSCRIPTION_STATUS.REJECTED) {
            changes.rejectedAt = new Date().toISOString();
            changes.rejectionReason = reason;
          } else if (status === SUBSCRIPTION_STATUS.ACTIVE) {
            changes.activatedAt = new Date().toISOString();
          } else if (status === SUBSCRIPTION_STATUS.EXPIRED) {
            changes.expiredAt = new Date().toISOString();
          } else if (status === SUBSCRIPTION_STATUS.CANCELED) {
            changes.canceledAt = new Date().toISOString();
          }
          
          return { ...sub, ...changes };
        }
        return sub;
      });
      
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
      
      // 找到更新后的订阅对象
      const updatedSubscription = updatedSubscriptions.find(sub => sub.id === id);
      
      return { 
        id, 
        changes: { 
          status, 
          ...(updatedSubscription.approvedAt && { approvedAt: updatedSubscription.approvedAt }),
          ...(updatedSubscription.rejectedAt && { 
            rejectedAt: updatedSubscription.rejectedAt,
            rejectionReason: updatedSubscription.rejectionReason
          }),
          ...(updatedSubscription.activatedAt && { activatedAt: updatedSubscription.activatedAt }),
          ...(updatedSubscription.expiredAt && { expiredAt: updatedSubscription.expiredAt }),
          ...(updatedSubscription.canceledAt && { canceledAt: updatedSubscription.canceledAt }),
        } 
      };
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 绑定白名单
export const bindWhitelist = createAsyncThunk(
  'subscriptions/bindWhitelist',
  async ({ subscriptionId, serviceAccountId, permissions }, { getState }) => {
    try {
      // 创建白名单绑定对象
      const binding = {
        id: Date.now().toString(),
        subscriptionId,
        serviceAccountId,
        permissions: permissions || ['read'],
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // 保存到localStorage
      const existingBindings = JSON.parse(localStorage.getItem('whitelistBindings')) || [];
      localStorage.setItem('whitelistBindings', JSON.stringify([...existingBindings, binding]));
      
      // 同时更新订阅状态为激活
      await updateSubscriptionStatus({ 
        id: subscriptionId, 
        status: SUBSCRIPTION_STATUS.ACTIVE 
      });
      
      return binding;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 获取所有白名单绑定
export const fetchWhitelistBindings = createAsyncThunk(
  'subscriptions/fetchWhitelistBindings',
  async () => {
    try {
      const bindings = JSON.parse(localStorage.getItem('whitelistBindings')) || [];
      return bindings;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setSelectedSubscription: (state, action) => {
      state.selectedSubscription = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        subscriptionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create Subscription
      .addCase(createSubscription.fulfilled, (state, action) => {
        subscriptionsAdapter.addOne(state, action.payload);
      })
      // Update Subscription Status
      .addCase(updateSubscriptionStatus.fulfilled, (state, action) => {
        subscriptionsAdapter.updateOne(state, action.payload);
      })
      // Fetch Whitelist Bindings
      .addCase(fetchWhitelistBindings.fulfilled, (state, action) => {
        state.whitelistBindings = action.payload;
      })
      // Bind Whitelist
      .addCase(bindWhitelist.fulfilled, (state, action) => {
        state.whitelistBindings.push(action.payload);
      });
  }
});

export const { setSelectedSubscription } = subscriptionSlice.actions;

// 导出适配器选择器
export const {
  selectAll: selectAllSubscriptions,
  selectById: selectSubscriptionById,
  selectIds: selectSubscriptionIds
} = subscriptionsAdapter.getSelectors(state => state.subscriptions);

// 自定义选择器
export const selectSubscriptionsByApiId = createSelector(
  [
    selectAllSubscriptions,
    (state, apiId) => apiId
  ],
  (subscriptions, apiId) => {
    return subscriptions.filter(sub => sub.apiId === apiId);
  }
);

export const selectSubscriptionsByUserId = createSelector(
  [
    selectAllSubscriptions,
    (state, userId) => userId
  ],
  (subscriptions, userId) => {
    return subscriptions.filter(sub => sub.userId === userId);
  }
);

export const selectWhitelistBindingsBySubscriptionId = createSelector(
  [
    state => state.subscriptions.whitelistBindings,
    (state, subscriptionId) => subscriptionId
  ],
  (bindings, subscriptionId) => {
    return bindings.filter(binding => binding.subscriptionId === subscriptionId);
  }
);

export const selectSubscriptionStats = createSelector(
  [selectAllSubscriptions],
  (subscriptions) => {
    const total = subscriptions.length;
    const byStatus = {
      [SUBSCRIPTION_STATUS.PENDING]: subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.PENDING).length,
      [SUBSCRIPTION_STATUS.APPROVED]: subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.APPROVED).length,
      [SUBSCRIPTION_STATUS.REJECTED]: subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.REJECTED).length,
      [SUBSCRIPTION_STATUS.ACTIVE]: subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.ACTIVE).length,
      [SUBSCRIPTION_STATUS.EXPIRED]: subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.EXPIRED).length,
      [SUBSCRIPTION_STATUS.CANCELED]: subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.CANCELED).length,
    };
    const needsWhitelist = subscriptions.filter(sub => sub.needsWhitelist).length;
    const withWhitelist = subscriptions.filter(sub => 
      sub.status === SUBSCRIPTION_STATUS.ACTIVE
    ).length;
    
    return {
      total,
      byStatus,
      needsWhitelist,
      withWhitelist
    };
  }
);

export default subscriptionSlice.reducer; 