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
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { 
  fetchUserGroups, 
  selectAllUserGroups, 
  selectUserGroupLoading, 
  createUserGroup, 
  updateUserGroup, 
  deleteUserGroup,
  assignPermissions,
  assignPermissionGroups,
} from '../../redux/slices/auth/userGroupSlice';
import { 
  fetchPermissions, 
  selectAllPermissions,
  selectAllPermissionGroups,
} from '../../redux/slices/auth/permissionSlice';
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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: theme.spacing(1, 2),
    marginTop: 'auto',
  },
  cardContent: {
    flexGrow: 1,
  },
  groupIcon: {
    color: theme.palette.primary.main,
    fontSize: 40,
    marginBottom: theme.spacing(1),
  },
  permissionsContainer: {
    marginTop: theme.spacing(2),
  },
  permissionChips: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  permissionGroups: {
    marginTop: theme.spacing(1),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  gridContainer: {
    marginBottom: theme.spacing(3),
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  cardTitle: {
    fontWeight: 500,
  },
  cardSubtitle: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5),
  },
  permissionCount: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.75rem',
    marginLeft: theme.spacing(1),
  },
}));

const UserGroupManagementPage = ({ isEmbedded = false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Redux状态
  const userGroups = useSelector(selectAllUserGroups);
  const loading = useSelector(selectUserGroupLoading);
  const permissions = useSelector(selectAllPermissions);
  const permissionGroups = useSelector(selectAllPermissionGroups);
  
  // 组件状态
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    permissions: [],
    permissionGroups: [],
  });
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  
  // 初始化数据
  useEffect(() => {
    dispatch(fetchUserGroups());
    dispatch(fetchPermissions());
  }, [dispatch]);
  
  // 过滤用户组
  const filteredUserGroups = userGroups.filter((group) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower)
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
  const handleOpenDialog = (mode, group = null) => {
    setFormMode(mode);
    if (group) {
      setFormData({
        id: group.id,
        name: group.name,
        description: group.description,
        permissions: group.permissions || [],
        permissionGroups: group.permissionGroups || [],
      });
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        permissions: [],
        permissionGroups: [],
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
  
  const handlePermissionsChange = (e) => {
    setFormData({
      ...formData,
      permissions: e.target.value,
    });
  };
  
  const handlePermissionGroupsChange = (e) => {
    setFormData({
      ...formData,
      permissionGroups: e.target.value,
    });
  };
  
  const handleSubmit = () => {
    if (formMode === 'create') {
      dispatch(createUserGroup(formData));
    } else {
      dispatch(updateUserGroup(formData));
      // 如果更新了用户组的权限，则同时更新权限分配
      dispatch(assignPermissions({ 
        userGroupId: formData.id, 
        permissions: formData.permissions 
      }));
      // 如果更新了用户组的权限组，则同时更新权限组分配
      dispatch(assignPermissionGroups({ 
        userGroupId: formData.id, 
        permissionGroups: formData.permissionGroups 
      }));
    }
    handleCloseDialog();
  };
  
  // 删除处理
  const handleOpenConfirmDialog = (group) => {
    setGroupToDelete(group);
    setConfirmDialogOpen(true);
  };
  
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setGroupToDelete(null);
  };
  
  const handleDeleteUserGroup = () => {
    if (groupToDelete) {
      dispatch(deleteUserGroup(groupToDelete.id));
    }
    handleCloseConfirmDialog();
  };
  
  // 获取权限名称
  const getPermissionName = (permissionId) => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };
  
  // 获取权限组名称
  const getPermissionGroupName = (groupId) => {
    const group = permissionGroups.find((g) => g.id === groupId);
    return group ? group.name : groupId;
  };
  
  // 计算用户组的总权限数（包括直接权限和权限组中的权限）
  const calculateTotalPermissions = (group) => {
    // 直接分配的权限
    const directPermissions = group.permissions || [];
    
    // 权限组中的权限
    let groupPermissions = [];
    if (group.permissionGroups && group.permissionGroups.length > 0) {
      group.permissionGroups.forEach(pgId => {
        const permGroup = permissionGroups.find(pg => pg.id === pgId);
        if (permGroup && permGroup.permissions) {
          groupPermissions = [...groupPermissions, ...permGroup.permissions];
        }
      });
    }
    
    // 合并去重后的权限数量
    return [...new Set([...directPermissions, ...groupPermissions])].length;
  };
  
  return (
    <div className={isEmbedded ? '' : classes.root}>
      {!isEmbedded && (
        <div className={classes.header}>
          <Typography variant="h4" component="h1">
            用户组管理
          </Typography>
          <PermissionButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
            permissions="user_create"
          >
            添加用户组
          </PermissionButton>
        </div>
      )}
      
      <Paper className={classes.searchContainer}>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <TextField
          className={classes.searchInput}
          placeholder="搜索用户组..."
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
            添加用户组
          </PermissionButton>
        )}
      </Paper>
      
      <Grid container spacing={3} className={classes.gridContainer}>
        {filteredUserGroups
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <div className={classes.cardHeader}>
                    <GroupIcon className={classes.groupIcon} />
                    <div style={{ flex: 1 }}>
                      <Typography variant="h6" className={classes.cardTitle}>
                        {group.name}
                      </Typography>
                      <Typography variant="body2" className={classes.cardSubtitle}>
                        {group.description || '无描述'}
                      </Typography>
                    </div>
                    <div className={classes.permissionCount}>
                      {calculateTotalPermissions(group)} 权限
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div className={classes.permissionsContainer}>
                    <Typography variant="subtitle2">
                      <SecurityIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      直接权限
                    </Typography>
                    <div className={classes.permissionChips}>
                      {group.permissions && group.permissions.length > 0 ? (
                        group.permissions.map((permId) => (
                          <Chip
                            key={permId}
                            label={getPermissionName(permId)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          无直接权限
                        </Typography>
                      )}
                    </div>
                  </div>
                  
                  <div className={classes.permissionGroups}>
                    <Typography variant="subtitle2">
                      权限组
                    </Typography>
                    <div className={classes.permissionChips}>
                      {group.permissionGroups && group.permissionGroups.length > 0 ? (
                        group.permissionGroups.map((pgId) => (
                          <Chip
                            key={pgId}
                            label={getPermissionGroupName(pgId)}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          无权限组
                        </Typography>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <PermissionButton
                    permissions="user_edit"
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog('edit', group)}
                  >
                    编辑
                  </PermissionButton>
                  <PermissionButton
                    permissions="user_delete"
                    size="small"
                    color="secondary"
                    onClick={() => handleOpenConfirmDialog(group)}
                  >
                    删除
                  </PermissionButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      
      <TablePagination
        rowsPerPageOptions={[9, 18, 36]}
        component="div"
        count={filteredUserGroups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      {/* 用户组表单对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {formMode === 'create' ? '添加用户组' : '编辑用户组'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className={classes.formField}
                name="name"
                label="用户组名称"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.formField}
                name="description"
                label="描述"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formField} fullWidth>
                <InputLabel>权限组</InputLabel>
                <Select
                  name="permissionGroups"
                  multiple
                  value={formData.permissionGroups}
                  onChange={handlePermissionGroupsChange}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap">
                      {selected.map((groupId) => (
                        <Chip
                          key={groupId}
                          label={getPermissionGroupName(groupId)}
                          style={{ margin: 2 }}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {permissionGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formField} fullWidth>
                <InputLabel>直接权限</InputLabel>
                <Select
                  name="permissions"
                  multiple
                  value={formData.permissions}
                  onChange={handlePermissionsChange}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap">
                      {selected.map((permId) => (
                        <Chip
                          key={permId}
                          label={getPermissionName(permId)}
                          style={{ margin: 2 }}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {permissions.map((perm) => (
                    <MenuItem key={perm.id} value={perm.id}>
                      {perm.name}
                    </MenuItem>
                  ))}
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
            您确定要删除用户组 <strong>{groupToDelete?.name}</strong> 吗？此操作可能会影响已分配此用户组的用户权限。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="default">
            取消
          </Button>
          <Button onClick={handleDeleteUserGroup} color="secondary" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserGroupManagementPage; 