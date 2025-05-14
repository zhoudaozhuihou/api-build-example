import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../uiSlice';

// 模拟API调用
const mockFetchUserGroups = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'ug1',
          name: '管理员',
          description: '系统管理员，拥有所有权限',
          permissionGroups: ['pg1', 'pg2', 'pg3'],
          permissions: ['user_view', 'user_create', 'user_edit', 'user_delete',
                      'api_view', 'api_create', 'api_edit', 'api_delete',
                      'lowcode_view', 'lowcode_create', 'lowcode_edit', 'lowcode_deploy']
        },
        {
          id: 'ug2',
          name: 'API开发者',
          description: 'API开发人员，可以管理API',
          permissionGroups: ['pg2'],
          permissions: ['api_view', 'api_create', 'api_edit', 'api_delete']
        },
        {
          id: 'ug3',
          name: '低代码用户',
          description: '低代码平台用户，可以使用低代码功能',
          permissionGroups: ['pg3'],
          permissions: ['lowcode_view', 'lowcode_create', 'lowcode_edit']
        },
        {
          id: 'ug4',
          name: '只读用户',
          description: '只读用户，只能查看不能修改',
          permissionGroups: [],
          permissions: ['user_view', 'api_view', 'lowcode_view']
        }
      ]);
    }, 500);
  });
};

// Async Thunks
export const fetchUserGroups = createAsyncThunk(
  'userGroups/fetchUserGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockFetchUserGroups();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUserGroup = createAsyncThunk(
  'userGroups/createUserGroup',
  async (userGroup, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户组创建成功', 'success'));
      return {
        id: `ug${Date.now()}`,
        ...userGroup
      };
    } catch (error) {
      dispatch(displayToast('用户组创建失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserGroup = createAsyncThunk(
  'userGroups/updateUserGroup',
  async (userGroup, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户组更新成功', 'success'));
      return userGroup;
    } catch (error) {
      dispatch(displayToast('用户组更新失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserGroup = createAsyncThunk(
  'userGroups/deleteUserGroup',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户组删除成功', 'success'));
      return id;
    } catch (error) {
      dispatch(displayToast('用户组删除失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const assignPermissions = createAsyncThunk(
  'userGroups/assignPermissions',
  async ({ userGroupId, permissions }, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限分配成功', 'success'));
      return { userGroupId, permissions };
    } catch (error) {
      dispatch(displayToast('权限分配失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const assignPermissionGroups = createAsyncThunk(
  'userGroups/assignPermissionGroups',
  async ({ userGroupId, permissionGroups }, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限组分配成功', 'success'));
      return { userGroupId, permissionGroups };
    } catch (error) {
      dispatch(displayToast('权限组分配失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userGroups: [],
  loading: false,
  error: null,
};

const userGroupSlice = createSlice({
  name: 'userGroups',
  initialState,
  reducers: {
    resetUserGroupState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 获取所有用户组
      .addCase(fetchUserGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.userGroups = action.payload;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 创建用户组
      .addCase(createUserGroup.fulfilled, (state, action) => {
        state.userGroups.push(action.payload);
      })

      // 更新用户组
      .addCase(updateUserGroup.fulfilled, (state, action) => {
        const index = state.userGroups.findIndex(group => group.id === action.payload.id);
        if (index !== -1) {
          state.userGroups[index] = action.payload;
        }
      })

      // 删除用户组
      .addCase(deleteUserGroup.fulfilled, (state, action) => {
        state.userGroups = state.userGroups.filter(group => group.id !== action.payload);
      })

      // 分配权限
      .addCase(assignPermissions.fulfilled, (state, action) => {
        const { userGroupId, permissions } = action.payload;
        const index = state.userGroups.findIndex(group => group.id === userGroupId);
        if (index !== -1) {
          state.userGroups[index].permissions = permissions;
        }
      })

      // 分配权限组
      .addCase(assignPermissionGroups.fulfilled, (state, action) => {
        const { userGroupId, permissionGroups } = action.payload;
        const index = state.userGroups.findIndex(group => group.id === userGroupId);
        if (index !== -1) {
          state.userGroups[index].permissionGroups = permissionGroups;
        }
      });
  },
});

export const { resetUserGroupState } = userGroupSlice.actions;

// Selectors
export const selectAllUserGroups = (state) => state.userGroups.userGroups;
export const selectUserGroupById = (state, id) => state.userGroups.userGroups.find(group => group.id === id);
export const selectUserGroupLoading = (state) => state.userGroups.loading;
export const selectUserGroupError = (state) => state.userGroups.error;

export default userGroupSlice.reducer; 