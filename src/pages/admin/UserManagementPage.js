import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  makeStyles,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { 
  fetchUsers, 
  selectAllUsers, 
  selectUserLoading, 
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus,
  assignUserGroups,
} from '../../redux/slices/auth/userSlice';
import { 
  fetchUserGroups, 
  selectAllUserGroups 
} from '../../redux/slices/auth/userGroupSlice';
import PermissionButton from '../../components/auth/PermissionButton';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  searchContainer: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  userGroups: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  statusActive: {
    backgroundColor: theme.palette.success.main,
  },
  statusInactive: {
    backgroundColor: theme.palette.error.main,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

const UserManagementPage = ({ isEmbedded = false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Redux状态
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectUserLoading);
  const userGroups = useSelector(selectAllUserGroups);
  
  // 组件状态
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    name: '',
    email: '',
    userGroups: [],
    directPermissions: [],
    status: 'active',
  });
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  
  // 初始化数据
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserGroups());
  }, [dispatch]);
  
  // 过滤用户
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });
  
  // 分页处理
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // 对话框处理
  const handleOpenDialog = (mode, user = null) => {
    setFormMode(mode);
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        userGroups: user.userGroups || [],
        directPermissions: user.directPermissions || [],
        status: user.status,
      });
    } else {
      setFormData({
        id: '',
        username: '',
        name: '',
        email: '',
        userGroups: [],
        directPermissions: [],
        status: 'active',
      });
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // 表单处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleUserGroupChange = (e) => {
    setFormData({
      ...formData,
      userGroups: e.target.value,
    });
  };
  
  const handleSubmit = () => {
    if (formMode === 'create') {
      dispatch(createUser(formData));
    } else {
      dispatch(updateUser(formData));
    }
    handleCloseDialog();
  };
  
  // 状态切换
  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    dispatch(toggleUserStatus({ id: user.id, status: newStatus }));
  };
  
  // 删除处理
  const handleOpenConfirmDialog = (user) => {
    setUserToDelete(user);
    setConfirmDialogOpen(true);
  };
  
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };
  
  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
    }
    handleCloseConfirmDialog();
  };
  
  return (
    <div className={isEmbedded ? '' : classes.root}>
      {!isEmbedded && (
        <div className={classes.header}>
          <Typography variant="h4" component="h1">
            用户管理
          </Typography>
          <PermissionButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
            permissions="user_create"
          >
            添加用户
          </PermissionButton>
        </div>
      )}
      
      <Paper className={classes.searchContainer}>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <TextField
          className={classes.searchInput}
          placeholder="搜索用户..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
        />
        {isEmbedded && (
          <PermissionButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
            permissions="user_create"
            style={{ marginLeft: 'auto' }}
          >
            添加用户
          </PermissionButton>
        )}
      </Paper>
      
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户信息</TableCell>
              <TableCell>用户名</TableCell>
              <TableCell>用户组</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>最后登录</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className={classes.userInfo}>
                      {user.avatar ? (
                        <Avatar src={user.avatar} className={classes.avatar} />
                      ) : (
                        <Avatar className={classes.avatar}>
                          <PersonIcon />
                        </Avatar>
                      )}
                      <div>
                        <Typography variant="subtitle2">{user.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className={classes.userGroups}>
                      {user.userGroups && user.userGroups.length > 0 ? (
                        user.userGroups.map((groupId) => {
                          const group = userGroups.find((g) => g.id === groupId);
                          return (
                            <Chip
                              key={groupId}
                              label={group ? group.name : groupId}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          );
                        })
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          无用户组
                        </Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? '已激活' : '已禁用'}
                      className={
                        user.status === 'active'
                          ? classes.statusActive
                          : classes.statusInactive
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : '从未登录'}
                  </TableCell>
                  <TableCell align="right">
                    <div className={classes.actions}>
                      <PermissionButton
                        permissions="user_edit"
                        component={IconButton}
                        color="primary"
                        onClick={() => handleOpenDialog('edit', user)}
                        size="small"
                      >
                        <EditIcon />
                      </PermissionButton>
                      <PermissionButton
                        permissions="user_edit"
                        component={IconButton}
                        color={user.status === 'active' ? 'secondary' : 'primary'}
                        onClick={() => handleToggleStatus(user)}
                        size="small"
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </PermissionButton>
                      <PermissionButton
                        permissions="user_delete"
                        component={IconButton}
                        color="secondary"
                        onClick={() => handleOpenConfirmDialog(user)}
                        size="small"
                      >
                        <DeleteIcon />
                      </PermissionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      {/* 用户表单对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formMode === 'create' ? '添加用户' : '编辑用户'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.formField}
                name="username"
                label="用户名"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={formMode === 'edit'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.formField}
                name="name"
                label="姓名"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.formField}
                name="email"
                label="邮箱"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formField} fullWidth>
                <InputLabel>用户组</InputLabel>
                <Select
                  name="userGroups"
                  multiple
                  value={formData.userGroups}
                  onChange={handleUserGroupChange}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap">
                      {selected.map((groupId) => {
                        const group = userGroups.find((g) => g.id === groupId);
                        return (
                          <Chip
                            key={groupId}
                            label={group ? group.name : groupId}
                            style={{ margin: 2 }}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {userGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formField} fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">已激活</MenuItem>
                  <MenuItem value="inactive">已禁用</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="default">
            取消
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {formMode === 'create' ? '创建' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 确认删除对话框 */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除用户 <strong>{userToDelete?.name}</strong> 吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="default">
            取消
          </Button>
          <Button onClick={handleDeleteUser} color="secondary" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagementPage; 