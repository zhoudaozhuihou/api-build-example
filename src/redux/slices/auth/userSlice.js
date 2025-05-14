import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../uiSlice';

// 模拟API调用
const mockFetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'user1',
          username: 'admin',
          name: '系统管理员',
          email: 'admin@example.com',
          avatar: 'https://mui.com/static/images/avatar/1.jpg',
          userGroups: ['ug1'], // 管理员组
          directPermissions: [], // 直接分配的权限
          status: 'active',
          lastLogin: '2023-10-01T10:00:00Z',
          createdAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 'user2',
          username: 'apidev',
          name: 'API开发者',
          email: 'apidev@example.com',
          avatar: 'https://mui.com/static/images/avatar/2.jpg',
          userGroups: ['ug2'], // API开发者组
          directPermissions: ['lowcode_view'], // 可以查看低代码应用
          status: 'active',
          lastLogin: '2023-10-05T14:30:00Z',
          createdAt: '2023-02-15T00:00:00Z'
        },
        {
          id: 'user3',
          username: 'lowcodeuser',
          name: '低代码用户',
          email: 'lowcode@example.com',
          avatar: 'https://mui.com/static/images/avatar/3.jpg',
          userGroups: ['ug3'], // 低代码用户组
          directPermissions: ['api_view'], // 可以查看API
          status: 'active',
          lastLogin: '2023-10-10T09:15:00Z',
          createdAt: '2023-03-20T00:00:00Z'
        },
        {
          id: 'user4',
          username: 'readonly',
          name: '只读用户',
          email: 'readonly@example.com',
          avatar: 'https://mui.com/static/images/avatar/4.jpg',
          userGroups: ['ug4'], // 只读用户组
          directPermissions: [],
          status: 'active',
          lastLogin: '2023-10-12T16:45:00Z',
          createdAt: '2023-04-10T00:00:00Z'
        },
        {
          id: 'user5',
          username: 'inactive',
          name: '已禁用用户',
          email: 'inactive@example.com',
          avatar: 'https://mui.com/static/images/avatar/5.jpg',
          userGroups: [],
          directPermissions: [],
          status: 'inactive',
          lastLogin: '2023-08-01T11:20:00Z',
          createdAt: '2023-05-05T00:00:00Z'
        }
      ]);
    }, 500);
  });
};

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockFetchUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (user, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户创建成功', 'success'));
      return {
        id: `user${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'active',
        ...user
      };
    } catch (error) {
      dispatch(displayToast('用户创建失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户更新成功', 'success'));
      return user;
    } catch (error) {
      dispatch(displayToast('用户更新失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户删除成功', 'success'));
      return id;
    } catch (error) {
      dispatch(displayToast('用户删除失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast(`用户${status === 'active' ? '激活' : '禁用'}成功`, 'success'));
      return { id, status };
    } catch (error) {
      dispatch(displayToast('操作失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const assignUserGroups = createAsyncThunk(
  'users/assignUserGroups',
  async ({ userId, userGroups }, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('用户组分配成功', 'success'));
      return { userId, userGroups };
    } catch (error) {
      dispatch(displayToast('用户组分配失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

export const assignDirectPermissions = createAsyncThunk(
  'users/assignDirectPermissions',
  async ({ userId, permissions }, { dispatch, rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(displayToast('权限分配成功', 'success'));
      return { userId, permissions };
    } catch (error) {
      dispatch(displayToast('权限分配失败', 'error'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentUser: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: () => initialState,
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取所有用户
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 创建用户
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // 更新用户
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // 删除用户
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })

      // 切换用户状态
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index].status = action.payload.status;
        }
      })

      // 分配用户组
      .addCase(assignUserGroups.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.userId);
        if (index !== -1) {
          state.users[index].userGroups = action.payload.userGroups;
        }
      })

      // 分配直接权限
      .addCase(assignDirectPermissions.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.userId);
        if (index !== -1) {
          state.users[index].directPermissions = action.payload.permissions;
        }
      });
  },
});

export const { resetUserState, setCurrentUser } = userSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, id) => state.users.users.find(user => user.id === id);
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUserLoading = (state) => state.users.loading;
export const selectUserError = (state) => state.users.error;

// 获取用户的所有权限（包括用户组权限和直接分配的权限）
export const selectUserPermissions = (state, userId) => {
  const user = state.users.users.find(user => user.id === userId);
  if (!user) return [];
  
  // 获取直接分配的权限
  const directPermissions = user.directPermissions || [];
  
  // 获取用户组关联的权限
  let groupPermissions = [];
  if (user.userGroups && user.userGroups.length > 0) {
    user.userGroups.forEach(groupId => {
      const group = state.userGroups.userGroups.find(g => g.id === groupId);
      if (group) {
        // 添加用户组直接关联的权限
        groupPermissions = [...groupPermissions, ...(group.permissions || [])];
        
        // 添加权限组关联的权限
        if (group.permissionGroups && group.permissionGroups.length > 0) {
          group.permissionGroups.forEach(pgId => {
            const permGroup = state.permissions.permissionGroups.find(pg => pg.id === pgId);
            if (permGroup && permGroup.permissions) {
              groupPermissions = [...groupPermissions, ...permGroup.permissions];
            }
          });
        }
      }
    });
  }
  
  // 合并所有权限并去重
  return [...new Set([...directPermissions, ...groupPermissions])];
};

// 检查用户是否有特定权限
export const hasPermission = (permissions, permissionId) => {
  return permissions.includes(permissionId);
};

export default userSlice.reducer; 