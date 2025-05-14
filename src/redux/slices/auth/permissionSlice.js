import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../uiSlice';

// 模拟API调用
const mockFetchPermissions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        permissionGroups: [
          {
            id: 'pg1',
            name: '系统管理',
            description: '系统管理相关权限',
            permissions: ['user_view', 'user_create', 'user_edit', 'user_delete']
          },
          {
            id: 'pg2',
            name: 'API管理',
            description: 'API相关权限',
            permissions: ['api_view', 'api_create', 'api_edit', 'api_delete']
          },
          {
            id: 'pg3',
            name: '低代码平台',
            description: '低代码平台相关权限',
            permissions: ['lowcode_view', 'lowcode_create', 'lowcode_edit', 'lowcode_deploy']
          },
        ],
        permissions: [
          { id: 'user_view', name: '查看用户', description: '允许查看用户列表' },
          { id: 'user_create', name: '创建用户', description: '允许创建新用户' },
          { id: 'user_edit', name: '编辑用户', description: '允许编辑用户信息' },
          { id: 'user_delete', name: '删除用户', description: '允许删除用户' },
          { id: 'api_view', name: '查看API', description: '允许查看API列表' },
          { id: 'api_create', name: '创建API', description: '允许创建新API' },
          { id: 'api_edit', name: '编辑API', description: '允许编辑API信息' },
          { id: 'api_delete', name: '删除API', description: '允许删除API' },
          { id: 'lowcode_view', name: '查看低代码', description: '允许查看低代码应用' },
          { id: 'lowcode_create', name: '创建低代码', description: '允许创建低代码应用' },
          { id: 'lowcode_edit', name: '编辑低代码', description: '允许编辑低代码应用' },
          { id: 'lowcode_deploy', name: '部署低代码', description: '允许部署低代码应用' },
        ]
      });
    }, 500);
  });
};

// Async Thunks
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockFetchPermissions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPermissionGroup = createAsyncThunk(
  'permissions/createPermissionGroup',
  async (permissionGroup, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限组创建成功', 'success'));
      return {
        id: `pg${Date.now()}`,
        ...permissionGroup
      };
    } catch (error) {
      dispatch(displayToast('权限组创建失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const updatePermissionGroup = createAsyncThunk(
  'permissions/updatePermissionGroup',
  async (permissionGroup, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限组更新成功', 'success'));
      return permissionGroup;
    } catch (error) {
      dispatch(displayToast('权限组更新失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const deletePermissionGroup = createAsyncThunk(
  'permissions/deletePermissionGroup',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限组删除成功', 'success'));
      return id;
    } catch (error) {
      dispatch(displayToast('权限组删除失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (permission, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限创建成功', 'success'));
      return {
        id: `perm_${Date.now()}`,
        ...permission
      };
    } catch (error) {
      dispatch(displayToast('权限创建失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async (permission, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限更新成功', 'success'));
      return permission;
    } catch (error) {
      dispatch(displayToast('权限更新失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限删除成功', 'success'));
      return id;
    } catch (error) {
      dispatch(displayToast('权限删除失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  permissionGroups: [],
  permissions: [],
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    resetPermissionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 获取所有权限
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissionGroups = action.payload.permissionGroups;
        state.permissions = action.payload.permissions;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 创建权限组
      .addCase(createPermissionGroup.fulfilled, (state, action) => {
        state.permissionGroups.push(action.payload);
      })

      // 更新权限组
      .addCase(updatePermissionGroup.fulfilled, (state, action) => {
        const index = state.permissionGroups.findIndex(group => group.id === action.payload.id);
        if (index !== -1) {
          state.permissionGroups[index] = action.payload;
        }
      })

      // 删除权限组
      .addCase(deletePermissionGroup.fulfilled, (state, action) => {
        state.permissionGroups = state.permissionGroups.filter(group => group.id !== action.payload);
      })

      // 创建权限
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })

      // 更新权限
      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.permissions.findIndex(perm => perm.id === action.payload.id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        }
      })

      // 删除权限
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(perm => perm.id !== action.payload);
      });
  },
});

export const { resetPermissionState } = permissionSlice.actions;

// Selectors
export const selectAllPermissions = (state) => state.permissions.permissions;
export const selectAllPermissionGroups = (state) => state.permissions.permissionGroups;
export const selectPermissionLoading = (state) => state.permissions.loading;
export const selectPermissionError = (state) => state.permissions.error;

export default permissionSlice.reducer; 