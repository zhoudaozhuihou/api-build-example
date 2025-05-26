import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Code as ApiIcon,
  Storage as StorageIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  tabPanel: {
    padding: theme.spacing(3, 0),
  },
  statsCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statsNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statsLabel: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  userCard: {
    marginBottom: theme.spacing(1),
  },
  statusChip: {
    minWidth: 60,
  },
  permissionsList: {
    maxHeight: 400,
    overflow: 'auto',
  },
  settingsSection: {
    marginBottom: theme.spacing(3),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    width: 32,
    height: 32,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  groupCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  groupIcon: {
    color: theme.palette.primary.main,
    fontSize: 40,
    marginBottom: theme.spacing(1),
  },
  permissionChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  formDialog: {
    minWidth: 500,
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`management-tabpanel-${index}`}
      aria-labelledby={`management-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="tabPanel">
          {children}
        </Box>
      )}
    </div>
  );
}

const UnifiedManagementPage = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  
  // 用户管理状态
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // 用户组管理状态
  const [userGroups, setUserGroups] = useState([]);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  
  // API所有权管理状态
  const [apiOwnerships, setApiOwnerships] = useState([]);
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [apiPage, setApiPage] = useState(0);
  const [apiRowsPerPage, setApiRowsPerPage] = useState(10);
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [editingApi, setEditingApi] = useState(null);
  
  // 对话框状态
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Mock data
  const stats = {
    totalUsers: 156,
    totalGroups: 12,
    totalApis: 42,
    totalDatasets: 28,
    dailyVisits: 1240,
    activeUsers: 89
  };

  const mockUsers = [
    { 
      id: 1, 
      username: 'admin',
      name: '系统管理员', 
      email: 'admin@example.com', 
      role: '超级管理员', 
      status: 'active', 
      lastLogin: '2023-06-15',
      groups: ['管理员组', '系统组']
    },
    { 
      id: 2, 
      username: 'zhangsan',
      name: '张三', 
      email: 'zhangsan@example.com', 
      role: '开发者', 
      status: 'active', 
      lastLogin: '2023-06-14',
      groups: ['开发者组']
    },
    { 
      id: 3, 
      username: 'lisi',
      name: '李四', 
      email: 'lisi@example.com', 
      role: '用户', 
      status: 'inactive', 
      lastLogin: '2023-06-10',
      groups: ['普通用户组']
    },
    { 
      id: 4, 
      username: 'wangwu',
      name: '王五', 
      email: 'wangwu@example.com', 
      role: '审核员', 
      status: 'active', 
      lastLogin: '2023-06-15',
      groups: ['审核员组', '开发者组']
    },
  ];

  const mockUserGroups = [
    {
      id: 1,
      name: '管理员组',
      description: '系统最高权限组，拥有所有管理功能',
      memberCount: 3,
      permissions: ['user_manage', 'system_config', 'api_manage', 'dataset_manage', 'audit_view'],
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: '开发者组',
      description: 'API开发人员，可以创建和管理API',
      memberCount: 25,
      permissions: ['api_create', 'api_edit', 'dataset_view', 'api_test'],
      createdAt: '2023-02-10'
    },
    {
      id: 3,
      name: '审核员组',
      description: '负责审核API和数据集的发布',
      memberCount: 8,
      permissions: ['api_review', 'dataset_review', 'publish_approve'],
      createdAt: '2023-03-05'
    },
    {
      id: 4,
      name: '普通用户组',
      description: '标准用户权限，可以浏览和使用已发布的API',
      memberCount: 120,
      permissions: ['api_view', 'api_call', 'dataset_view'],
      createdAt: '2023-01-20'
    }
  ];

  const systemPermissions = [
    { id: 'user_manage', name: '用户管理', description: '创建、编辑、删除用户' },
    { id: 'user_view', name: '查看用户', description: '查看用户列表和详情' },
    { id: 'group_manage', name: '用户组管理', description: '管理用户组和权限分配' },
    { id: 'system_config', name: '系统配置', description: '修改系统设置和参数' },
    { id: 'api_manage', name: 'API管理', description: '管理所有API' },
    { id: 'api_create', name: 'API创建', description: '创建新的API' },
    { id: 'api_edit', name: 'API编辑', description: '编辑API配置' },
    { id: 'api_view', name: 'API查看', description: '查看API列表和详情' },
    { id: 'api_call', name: 'API调用', description: '调用API接口' },
    { id: 'api_test', name: 'API测试', description: '测试API接口' },
    { id: 'api_review', name: 'API审核', description: '审核API发布申请' },
    { id: 'dataset_manage', name: '数据集管理', description: '管理所有数据集' },
    { id: 'dataset_view', name: '数据集查看', description: '查看数据集' },
    { id: 'dataset_review', name: '数据集审核', description: '审核数据集发布' },
    { id: 'publish_approve', name: '发布审批', description: '审批资源发布申请' },
    { id: 'audit_view', name: '审计查看', description: '查看系统审计日志' },
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setUserGroups(mockUserGroups);
    
    // 初始化API所有权数据
    const mockApiOwnerships = [
      {
        id: 1,
        name: '用户认证API',
        description: '提供用户登录、注册、验证功能',
        owner: 1,
        accessLevel: 'public',
        authorizedUsers: [1, 2],
        authorizedGroups: [1, 2]
      },
      {
        id: 2,
        name: '数据分析API',
        description: '提供数据统计和分析功能',
        owner: 2,
        accessLevel: 'restricted',
        authorizedUsers: [1, 2, 4],
        authorizedGroups: [1, 3]
      },
      {
        id: 3,
        name: '文件上传API',
        description: '处理文件上传和存储',
        owner: 1,
        accessLevel: 'private',
        authorizedUsers: [1],
        authorizedGroups: [1]
      },
      {
        id: 4,
        name: '消息推送API',
        description: '发送系统通知和消息',
        owner: 4,
        accessLevel: 'public',
        authorizedUsers: [1, 2, 3, 4],
        authorizedGroups: [1, 2, 3, 4]
      }
    ];
    setApiOwnerships(mockApiOwnerships);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // 用户管理相关函数
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleUserPageChange = (event, newPage) => {
    setUserPage(newPage);
  };

  const handleUserRowsPerPageChange = (event) => {
    setUserRowsPerPage(parseInt(event.target.value, 10));
    setUserPage(0);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setConfirmAction(() => () => {
      setUsers(users.filter(u => u.id !== user.id));
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleToggleUserStatus = (user) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  // 用户组管理相关函数
  const filteredUserGroups = userGroups.filter(group =>
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setGroupDialogOpen(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setGroupDialogOpen(true);
  };

  const handleDeleteGroup = (group) => {
    setConfirmAction(() => () => {
      setUserGroups(userGroups.filter(g => g.id !== group.id));
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  // API所有权管理相关函数
  const filteredApiOwnerships = apiOwnerships.filter(api =>
    api.name.toLowerCase().includes(apiSearchQuery.toLowerCase()) ||
    api.description.toLowerCase().includes(apiSearchQuery.toLowerCase())
  );

  const handleApiPageChange = (event, newPage) => {
    setApiPage(newPage);
  };

  const handleApiRowsPerPageChange = (event) => {
    setApiRowsPerPage(parseInt(event.target.value, 10));
    setApiPage(0);
  };

  const handleEditApi = (api) => {
    setEditingApi(api);
    setApiDialogOpen(true);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : '未知用户';
  };

  const getGroupName = (groupId) => {
    const group = userGroups.find(g => g.id === groupId);
    return group ? group.name : '未知组';
  };

  const renderAccessLevelChip = (accessLevel) => {
    const config = {
      public: { label: '公开', color: 'primary' },
      private: { label: '私有', color: 'secondary' },
      restricted: { label: '受限', color: 'default' }
    };
    const { label, color } = config[accessLevel] || config.public;
    return <Chip label={label} color={color} size="small" />;
  };

  const renderDashboard = () => (
    <div>
      <Typography variant="h5" gutterBottom>
        系统概览
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={2}>
          <Card className={classes.statsCard}>
            <CardContent>
              <PeopleIcon style={{ fontSize: 40, marginBottom: 8 }} />
              <Typography className={classes.statsNumber}>
                {stats.totalUsers}
              </Typography>
              <Typography className={classes.statsLabel}>
                总用户数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card className={classes.statsCard}>
            <CardContent>
              <GroupIcon style={{ fontSize: 40, marginBottom: 8 }} />
              <Typography className={classes.statsNumber}>
                {stats.totalGroups}
              </Typography>
              <Typography className={classes.statsLabel}>
                用户组数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card className={classes.statsCard}>
            <CardContent>
              <ApiIcon style={{ fontSize: 40, marginBottom: 8 }} />
              <Typography className={classes.statsNumber}>
                {stats.totalApis}
              </Typography>
              <Typography className={classes.statsLabel}>
                API总数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card className={classes.statsCard}>
            <CardContent>
              <StorageIcon style={{ fontSize: 40, marginBottom: 8 }} />
              <Typography className={classes.statsNumber}>
                {stats.totalDatasets}
              </Typography>
              <Typography className={classes.statsLabel}>
                数据集总数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card className={classes.statsCard}>
            <CardContent>
              <TrendingUpIcon style={{ fontSize: 40, marginBottom: 8 }} />
              <Typography className={classes.statsNumber}>
                {stats.dailyVisits}
              </Typography>
              <Typography className={classes.statsLabel}>
                今日访问量
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card className={classes.statsCard}>
            <CardContent>
              <CheckCircleIcon style={{ fontSize: 40, marginBottom: 8 }} />
              <Typography className={classes.statsNumber}>
                {stats.activeUsers}
              </Typography>
              <Typography className={classes.statsLabel}>
                活跃用户
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

  const renderUserManagement = () => (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          用户管理
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateUser}
        >
          添加用户
        </Button>
      </Box>
      
      <TextField
        className={classes.searchField}
        fullWidth
        placeholder="搜索用户..."
        value={userSearchQuery}
        onChange={(e) => setUserSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户</TableCell>
              <TableCell>用户名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>用户组</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>最后登录</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage)
              .map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box className={classes.userInfo}>
                    <Avatar className={classes.avatar}>
                      <PersonIcon />
                    </Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.groups.map((group, index) => (
                    <Chip
                      key={index}
                      label={group}
                      size="small"
                      style={{ margin: '2px' }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status === 'active' ? '活跃' : '非活跃'}
                    color={user.status === 'active' ? 'primary' : 'default'}
                    size="small"
                    className={classes.statusChip}
                  />
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleToggleUserStatus(user)}
                    color={user.status === 'active' ? 'secondary' : 'primary'}
                  >
                    {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteUser(user)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={userRowsPerPage}
          page={userPage}
          onPageChange={handleUserPageChange}
          onRowsPerPageChange={handleUserRowsPerPageChange}
        />
      </TableContainer>
    </div>
  );

  const renderUserGroupManagement = () => (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          用户组管理
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateGroup}
        >
          创建用户组
        </Button>
      </Box>
      
      <TextField
        className={classes.searchField}
        fullWidth
        placeholder="搜索用户组..."
        value={groupSearchQuery}
        onChange={(e) => setGroupSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Grid container spacing={3}>
        {filteredUserGroups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card className={classes.groupCard}>
              <CardContent style={{ flexGrow: 1 }}>
                <Box textAlign="center" mb={2}>
                  <GroupIcon className={classes.groupIcon} />
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {group.description}
                  </Typography>
                </Box>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    成员数量: {group.memberCount}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    权限数量: {group.permissions.length}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  权限列表:
                </Typography>
                <Box className={classes.permissionChips}>
                  {group.permissions.slice(0, 3).map((permission) => (
                    <Chip
                      key={permission}
                      label={systemPermissions.find(p => p.id === permission)?.name || permission}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {group.permissions.length > 3 && (
                    <Chip
                      label={`+${group.permissions.length - 3}个`}
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              </CardContent>
              
              <Box p={2} pt={0}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditGroup(group)}
                  style={{ marginBottom: 8 }}
                >
                  编辑
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteGroup(group)}
                >
                  删除
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );

  const renderApiOwnershipManagement = () => (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          API所有权管理
        </Typography>
      </Box>
      
      <TextField
        className={classes.searchField}
        fullWidth
        placeholder="搜索API..."
        value={apiSearchQuery}
        onChange={(e) => setApiSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API名称</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>所有者</TableCell>
              <TableCell>访问级别</TableCell>
              <TableCell>授权用户</TableCell>
              <TableCell>授权组</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApiOwnerships
              .slice(apiPage * apiRowsPerPage, apiPage * apiRowsPerPage + apiRowsPerPage)
              .map((api) => (
              <TableRow key={api.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <ApiIcon style={{ marginRight: 8, color: '#1976d2' }} />
                    {api.name}
                  </Box>
                </TableCell>
                <TableCell>{api.description}</TableCell>
                <TableCell>
                  <Box className={classes.userInfo}>
                    <Avatar className={classes.avatar}>
                      <PersonIcon />
                    </Avatar>
                    {getUserName(api.owner)}
                  </Box>
                </TableCell>
                <TableCell>
                  {renderAccessLevelChip(api.accessLevel)}
                </TableCell>
                <TableCell>
                  {api.authorizedUsers.map((userId) => (
                    <Chip
                      key={userId}
                      label={getUserName(userId)}
                      size="small"
                      style={{ margin: '2px' }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {api.authorizedGroups.map((groupId) => (
                    <Chip
                      key={groupId}
                      label={getGroupName(groupId)}
                      size="small"
                      style={{ margin: '2px' }}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditApi(api)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredApiOwnerships.length}
          rowsPerPage={apiRowsPerPage}
          page={apiPage}
          onPageChange={handleApiPageChange}
          onRowsPerPageChange={handleApiRowsPerPageChange}
        />
      </TableContainer>
    </div>
  );

  const renderPermissions = () => (
    <div>
      <Typography variant="h5" gutterBottom>
        权限管理
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              系统权限列表
            </Typography>
            <List className={classes.permissionsList}>
              {systemPermissions.map((permission) => (
                <ListItem key={permission.id} divider>
                  <ListItemText
                    primary={permission.name}
                    secondary={permission.description}
                  />
                  <ListItemSecondaryAction>
                    <Switch defaultChecked />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              权限分析
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="总权限数" 
                  secondary={`${systemPermissions.length} 个权限`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="用户管理权限" 
                  secondary={`${systemPermissions.filter(p => p.id.includes('user')).length} 个`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="API相关权限" 
                  secondary={`${systemPermissions.filter(p => p.id.includes('api')).length} 个`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="数据集相关权限" 
                  secondary={`${systemPermissions.filter(p => p.id.includes('dataset')).length} 个`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  const renderSystemSettings = () => (
    <div>
      <Typography variant="h5" gutterBottom>
        系统设置
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.settingsSection} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              基础设置
            </Typography>
            <TextField
              fullWidth
              label="系统名称"
              defaultValue="API管理平台"
              margin="normal"
            />
            <TextField
              fullWidth
              label="系统描述"
              defaultValue="企业级API管理和开发平台"
              margin="normal"
              multiline
              rows={3}
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用用户注册"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用邮件通知"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用API自动审核"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.settingsSection} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              安全设置
            </Typography>
            <TextField
              fullWidth
              label="会话超时时间（分钟）"
              defaultValue="30"
              type="number"
              margin="normal"
            />
            <TextField
              fullWidth
              label="密码最小长度"
              defaultValue="8"
              type="number"
              margin="normal"
            />
            <TextField
              fullWidth
              label="登录失败锁定次数"
              defaultValue="5"
              type="number"
              margin="normal"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用双重认证"
            />
            <FormControlLabel
              control={<Switch />}
              label="强制HTTPS"
            />
          </Paper>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Button variant="contained" color="primary" style={{ marginRight: 8 }}>
          保存设置
        </Button>
        <Button variant="outlined">
          重置为默认
        </Button>
      </Box>
    </div>
  );

  return (
    <Container maxWidth="xl" className={classes.root}>
      <Typography variant="h4" gutterBottom>
        统一管理控制台
      </Typography>
      
      <Paper>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<DashboardIcon />} label="仪表板" />
          <Tab icon={<PeopleIcon />} label="用户管理" />
          <Tab icon={<GroupIcon />} label="用户组管理" />
          <Tab icon={<ApiIcon />} label="API所有权" />
          <Tab icon={<SecurityIcon />} label="权限管理" />
          <Tab icon={<SettingsIcon />} label="系统设置" />
        </Tabs>
        
        <Box className={classes.tabPanel}>
          <TabPanel value={currentTab} index={0}>
            {renderDashboard()}
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            {renderUserManagement()}
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            {renderUserGroupManagement()}
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            {renderApiOwnershipManagement()}
          </TabPanel>
          <TabPanel value={currentTab} index={4}>
            {renderPermissions()}
          </TabPanel>
          <TabPanel value={currentTab} index={5}>
            {renderSystemSettings()}
          </TabPanel>
        </Box>
      </Paper>

      {/* 确认删除对话框 */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            此操作不可撤销，确定要删除吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={confirmAction} color="secondary">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UnifiedManagementPage; 