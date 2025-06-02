import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Hidden,
  useMediaQuery,
  useTheme,
  Button,
  Badge,
  Popover,
  Card,
  CardContent,
  CardHeader,
  CardActions
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as LogoutIcon,
  Translate as TranslateIcon,
  Language as LanguageIcon,
  Flag as FlagIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  MenuBook as CatalogIcon,
  Code as LowCodeIcon,
  Category as CategoryIcon,
  AccountCircle as AccountIcon,
  ImportExport as ApiIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Group as GroupIcon,
  Storage as DatasetIcon,
  Assessment as AnalyticsIcon,
  Assignment as OrderIcon,
  SupervisorAccount as AdminIcon,
  CheckCircle as ReviewIcon
} from '@material-ui/icons';
import { useLocation, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';
import FeatureGuard from '../FeatureGuard';
import MarketSwitcher from '../MarketSwitcher';

// 引入自定义hook
import useI18n from '../../hooks/useI18n';
import usePermission from '../../hooks/usePermission';

// Redux 
import { setDrawerOpen, toggleDrawer, setLanguage } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { 
  fetchNotifications, 
  markAsSeen, 
  markAllAsSeen, 
  selectNotifications, 
  selectUnseenCount 
} from '../../redux/slices/notificationSlice';

// 语言图标组件，根据当前语言显示不同图标
const LanguageToggleIcon = ({ currentLanguage }) => {
  const theme = useTheme();
  
  // 自定义样式用于图标
  const iconStyle = {
    position: 'relative',
    transition: 'transform 0.3s ease',
    transform: currentLanguage === 'zh' ? 'rotateY(0deg)' : 'rotateY(180deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  // 圆形背景样式
  const circleStyle = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
  };
  
  return (
    <div style={iconStyle}>
      <div style={circleStyle}>
        {currentLanguage === 'zh' ? (
          // 中文显示"中"字
          <Typography variant="caption" style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
            中
          </Typography>
        ) : (
          // 英文显示"EN"
          <Typography variant="caption" style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
            EN
          </Typography>
        )}
      </div>
    </div>
  );
};

const drawerWidth = 240;

import { colorPalette } from '../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: colorPalette.black.main,
    boxShadow: `0 4px 10px ${colorPalette.black.dark}50`,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    color: colorPalette.white.main,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: colorPalette.black.dark,
    borderRight: `1px solid ${colorPalette.black.light}`,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: colorPalette.black.dark,
    borderRight: `1px solid ${colorPalette.black.light}`,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: theme.palette.type === 'dark' ? colorPalette.black.main : colorPalette.white.off,
    minHeight: '100vh',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: theme.spacing(1),
    fontSize: '1.8rem',
    color: colorPalette.red.main,
  },
  teamName: {
    fontWeight: 600,
    marginRight: theme.spacing(1),
    color: colorPalette.white.main,
  },
  serviceAccount: {
    fontSize: '0.75rem',
    opacity: 0.8,
    marginLeft: theme.spacing(1),
    color: colorPalette.white.dark,
  },
  avatarButton: {
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  avatar: {
    backgroundColor: colorPalette.red.main,
  },
  activeListItem: {
    backgroundColor: `${colorPalette.red.main}15`,
    '& .MuiListItemIcon-root': {
      color: colorPalette.red.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: colorPalette.red.main,
    },
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: theme.spacing(2),
    color: colorPalette.white.main,
    '&:hover': {
      color: colorPalette.red.light,
    },
  },
  notificationPopover: {
    width: 360,
    maxHeight: 450,
  },
  notificationCard: {
    margin: theme.spacing(1),
    '&:last-child': {
      marginBottom: theme.spacing(1),
    },
  },
  notificationHeader: {
    padding: theme.spacing(1, 2),
  },
  notificationContent: {
    padding: theme.spacing(1, 2),
    paddingTop: 0,
  },
  notificationActions: {
    padding: theme.spacing(0, 1, 1, 1),
    justifyContent: 'flex-end',
  },
  notificationItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  noNotifications: {
    textAlign: 'center',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  notificationTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
  },
  unseenBadge: {
    backgroundColor: colorPalette.red.main,
  },
  listItem: {
    borderRadius: 4,
    margin: theme.spacing(0.5, 1),
    '& .MuiListItemIcon-root': {
      color: colorPalette.white.dark,
    },
    '&:hover': {
      backgroundColor: `${colorPalette.red.main}15`,
      '& .MuiListItemIcon-root': {
        color: colorPalette.red.light,
      },
    },
  },
  listItemText: {
    color: colorPalette.white.main,
  },
  drawerDivider: {
    backgroundColor: colorPalette.black.light,
    margin: theme.spacing(1, 0),
  },
  grow: {
    flexGrow: 1,
  },
  langSwitcher: {
    marginLeft: theme.spacing(2),
  },
}));

function Layout({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { translate, changeLanguage, currentLanguage, LOCALES } = useI18n();
  const { checkPermission, isAdmin } = usePermission();
  const { isModuleEnabled, MODULES } = useFeatureFlags();
  
  // Redux状态
  const drawerOpen = useSelector(state => state.ui.drawerOpen);
  const notifications = useSelector(selectNotifications);
  const unseenCount = useSelector(selectUnseenCount);
  const categories = useSelector(state => state.api.categories || []);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // 菜单配置
  const menuItems = [
    { text: '首页', icon: <HomeIcon />, path: '/' },
    { 
      text: 'API管理', 
      icon: <ApiIcon />, 
      path: '/catalog',
      description: '浏览和管理所有API',
      module: MODULES.API_MANAGEMENT
    },
    { 
      text: '数据集', 
      icon: <DatasetIcon />, 
      path: '/datasets',
      description: '管理可用于创建API的数据集',
      module: MODULES.DATASET_MANAGEMENT
    },
    { 
      text: '低代码构建器', 
      icon: <LowCodeIcon />, 
      path: '/lowcode',
      description: '使用低代码方式创建API',
      module: MODULES.LOWCODE_BUILDER
    },
    { 
      text: '审核与订单', 
      icon: <OrderIcon />, 
      path: '/review-orders',
      description: '处理API审核请求和管理订阅订单',
      module: MODULES.REVIEW_ORDERS
    },
    { 
      text: '统计分析', 
      icon: <AnalyticsIcon />, 
      path: '/analytics',
      description: 'API使用统计和性能分析',
      module: MODULES.ANALYTICS
    },
  ];

  // 过滤掉当前市场不支持的模块
  const filteredMenuItems = menuItems.filter(item => 
    !item.module || isModuleEnabled(item.module)
  );

  // 权限管理菜单
  const adminMenuItems = [
    { 
      text: '管理控制台', 
      icon: <AdminIcon />, 
      path: '/admin',
      permission: 'admin_view',
      description: '统一管理平台：用户、权限、API、系统设置' 
    }
  ];

  // 初始化加载通知
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // 根据移动设备状态调整抽屉
  useEffect(() => {
    if (isMobile && drawerOpen) {
      dispatch(setDrawerOpen(false));
    }
  }, [isMobile, drawerOpen, dispatch]);

  const handleDrawerOpen = () => {
    dispatch(setDrawerOpen(true));
  };

  const handleDrawerClose = () => {
    dispatch(setDrawerOpen(false));
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    dispatch(setLanguage(lang));
    handleLanguageMenuClose();
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    if (unseenCount > 0) {
      dispatch(markAllAsSeen());
    }
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    history.push('/');
  };

  const handleEditProfile = () => {
    handleMenuClose();
    // 这里可以调用Redux action或导航到个人资料页面
    history.push('/profile');
  };

  const handleNavigate = (path) => {
    history.push(path);
    if (isMobile) {
      dispatch(setDrawerOpen(false));
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // 处理分类选择
  const handleCategorySelect = (category) => {
    const categoryId = category.id || category.value;
    const categoryName = category.name || category.label;
    
    // 切换当前分类的展开状态
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
    
    // 这里可以添加额外的分类选择逻辑，如过滤API列表等
  };

  // 点击左侧菜单，处理导航
  const handleAdminNavigate = (path, permission) => {
    if (!permission || checkPermission(permission) || isAdmin()) {
      history.push(path);
    } else {
      history.push('/unauthorized');
    }
  };

  useEffect(() => {
    // 初始化展开状态，默认展开根级分类
    const defaultExpanded = {};
    categories.forEach(category => {
      const categoryId = category.id || category.value;
      defaultExpanded[categoryId] = true;
    });
    setExpandedCategories(defaultExpanded);
  }, [categories]); // 只在categories变化时执行

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen && !isMobile,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: drawerOpen && !isMobile,
            })}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            <ApiIcon className={classes.logo} />
            <Typography variant="h6" className={classes.teamName} noWrap>
              {translate('app.title')}
            </Typography>
            <Typography variant="caption" className={classes.serviceAccount} noWrap>
              {translate('app.serviceAccount', { account: 'api-service' })}
            </Typography>
          </div>
          
          <div className={classes.headerActions}>
            {/* 消息提醒中心 */}
            <Tooltip title={translate('header.notifications')}>
              <IconButton 
                color="inherit" 
                className={classes.headerIcon}
                onClick={handleNotificationMenuOpen}
              >
                <Badge color="secondary" badgeContent={unseenCount} invisible={unseenCount === 0} overlap="rectangular">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Popover
              id="notification-popover"
              anchorEl={notificationAnchorEl}
              keepMounted
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                className: classes.notificationPopover
              }}
            >
              <div className={classes.notificationTitle}>
                <Typography variant="subtitle1" style={{ padding: theme.spacing(2) }}>
                  {translate('notifications.title')}
                </Typography>
              </div>
              <Divider />
              <Box style={{ maxHeight: 380, overflow: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <Box key={notification.id} className={classes.notificationItem}>
                      <Card className={classes.notificationCard} elevation={0}>
                        <CardHeader
                          className={classes.notificationHeader}
                          title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2">
                                {notification.title}
                              </Typography>
                              {!notification.seen && (
                                <Box 
                                  width={8} 
                                  height={8} 
                                  borderRadius="50%" 
                                  className={classes.unseenBadge} 
                                />
                              )}
                            </Box>
                          }
                          subheader={notification.time}
                        />
                        <CardContent className={classes.notificationContent}>
                          <Typography variant="body2">
                            {notification.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))
                ) : (
                  <Box className={classes.noNotifications}>
                    <Typography variant="body1">
                      {translate('notifications.empty')}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
              <Box display="flex" justifyContent="center" p={1}>
                <Button size="small" color="primary" onClick={() => history.push('/notifications')}>
                  {translate('notifications.viewAll')}
                </Button>
              </Box>
            </Popover>
            
            {/* 添加市场切换器 */}
            <MarketSwitcher />
            
            {/* 国际化切换 */}
            <Tooltip title={translate('header.language')}>
              <IconButton 
                color="inherit" 
                className={classes.headerIcon}
                onClick={handleLanguageMenuOpen}
              >
                <LanguageToggleIcon currentLanguage={currentLanguage} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={languageAnchorEl}
              keepMounted
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
              PaperProps={{
                style: {
                  width: 180,
                  padding: '4px 0',
                }
              }}
            >
              <MenuItem 
                onClick={() => handleLanguageSelect(LOCALES.CHINESE)} 
                selected={currentLanguage === LOCALES.CHINESE}
                style={{ 
                  padding: '10px 16px',
                  borderLeft: currentLanguage === LOCALES.CHINESE ? '3px solid #1976d2' : '3px solid transparent' 
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <Box 
                    mr={1.5} 
                    width={24} 
                    height={24} 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    style={{ 
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Typography variant="caption" style={{ fontWeight: 'bold' }}>中</Typography>
                  </Box>
                  <Box flex={1}>
                    {translate('language.chinese')}
                  </Box>
                  {currentLanguage === LOCALES.CHINESE && (
                    <Box ml={1} display="flex" alignItems="center">
                      <CheckIcon fontSize="small" color="primary" />
                    </Box>
                  )}
                </Box>
              </MenuItem>
              <MenuItem 
                onClick={() => handleLanguageSelect(LOCALES.ENGLISH)}
                selected={currentLanguage === LOCALES.ENGLISH}
                style={{ 
                  padding: '10px 16px',
                  borderLeft: currentLanguage === LOCALES.ENGLISH ? '3px solid #1976d2' : '3px solid transparent' 
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <Box 
                    mr={1.5} 
                    width={24} 
                    height={24} 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    style={{ 
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Typography variant="caption" style={{ fontWeight: 'bold' }}>EN</Typography>
                  </Box>
                  <Box flex={1}>
                    {translate('language.english')}
                  </Box>
                  {currentLanguage === LOCALES.ENGLISH && (
                    <Box ml={1} display="flex" alignItems="center">
                      <CheckIcon fontSize="small" color="primary" />
                    </Box>
                  )}
                </Box>
              </MenuItem>
            </Menu>
            
            {/* 帮助按钮 */}
            <Tooltip title={translate('header.help')}>
              <IconButton 
                color="inherit"
                className={classes.headerIcon}
                onClick={() => history.push('/help')}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            {/* 个人头像 */}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className={classes.avatarButton}
            >
              <Avatar className={classes.avatar}>
                <AccountIcon />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">{translate('profile.info')}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); history.push('/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">{translate('profile.settings')}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">{translate('profile.logout')}</Typography>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              className={clsx(classes.listItem, {
                [classes.activeListItem]: isActive(item.path)
              })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                secondary={drawerOpen && item.description ? item.description : null}
                primaryTypographyProps={{ 
                  className: classes.listItemText,
                  style: { fontWeight: isActive(item.path) ? 600 : 400 }
                }}
                secondaryTypographyProps={{
                  style: { 
                    fontSize: '0.7rem', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider className={classes.drawerDivider} />
        <List>
          {adminMenuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => handleAdminNavigate(item.path, item.permission)}
              className={clsx(classes.listItem, {
                [classes.activeListItem]: isActive(item.path)
              })}
              disabled={item.permission && !checkPermission(item.permission) && !isAdmin()}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                secondary={drawerOpen && item.description ? item.description : null}
                primaryTypographyProps={{ 
                  className: classes.listItemText,
                  style: { fontWeight: isActive(item.path) ? 600 : 400 }
                }}
                secondaryTypographyProps={{
                  style: { 
                    fontSize: '0.7rem', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

export default Layout; 