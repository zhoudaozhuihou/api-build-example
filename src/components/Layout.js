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
  Help as HelpIcon,
  Home as HomeIcon,
  MenuBook as CatalogIcon,
  Code as LowCodeIcon,
  Category as CategoryIcon,
  AccountCircle as AccountIcon,
  ImportExport as ApiIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@material-ui/icons';
import { useLocation, useHistory } from 'react-router-dom';
import clsx from 'clsx';

// Redux 
import { setDrawerOpen, toggleDrawer, setLanguage } from '../redux/slices/uiSlice';
import { logout } from '../redux/slices/authSlice';
import { 
  fetchNotifications, 
  markAsSeen, 
  markAllAsSeen, 
  selectNotifications, 
  selectUnseenCount 
} from '../redux/slices/notificationSlice';

const drawerWidth = 240;

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
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: theme.spacing(1),
    fontSize: '1.8rem',
  },
  teamName: {
    fontWeight: 600,
    marginRight: theme.spacing(1),
  },
  serviceAccount: {
    fontSize: '0.75rem',
    opacity: 0.8,
    marginLeft: theme.spacing(1),
  },
  avatarButton: {
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  activeListItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: theme.spacing(2),
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
    backgroundColor: theme.palette.secondary.main,
  }
}));

function Layout({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  
  // Redux状态
  const drawerOpen = useSelector(state => state.ui.drawerOpen);
  const notifications = useSelector(selectNotifications);
  const unseenCount = useSelector(selectUnseenCount);
  const language = useSelector(state => state.ui.language);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // 菜单配置
  const menuItems = [
    { text: '首页', icon: <HomeIcon />, path: '/' },
    { text: 'API 目录', icon: <CatalogIcon />, path: '/catalog' },
    { text: '低代码构建', icon: <LowCodeIcon />, path: '/lowcode' },
    { text: '分类选择器', icon: <CategoryIcon />, path: '/category-demo' },
    // 首页变体作为子菜单
    { text: '营销首页', icon: <HomeIcon />, path: '/marketing' },
    { text: '开发者首页', icon: <HomeIcon />, path: '/developer' },
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
              API 平台
            </Typography>
            <Typography variant="caption" className={classes.serviceAccount} noWrap>
              服务账号: api-service
            </Typography>
          </div>
          
          <div className={classes.headerActions}>
            {/* 消息提醒中心 */}
            <Tooltip title="消息提醒">
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
                  消息通知
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
                      暂无消息通知
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
              <Box display="flex" justifyContent="center" p={1}>
                <Button size="small" color="primary" onClick={() => history.push('/notifications')}>
                  查看全部
                </Button>
              </Box>
            </Popover>
            
            {/* 国际化切换 */}
            <Tooltip title="切换语言">
              <IconButton 
                color="inherit" 
                className={classes.headerIcon}
                onClick={handleLanguageMenuOpen}
              >
                <TranslateIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={languageAnchorEl}
              keepMounted
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
            >
              <MenuItem 
                onClick={() => handleLanguageSelect('zh')} 
                selected={language === 'zh'}
              >
                中文
              </MenuItem>
              <MenuItem 
                onClick={() => handleLanguageSelect('en')}
                selected={language === 'en'}
              >
                English
              </MenuItem>
            </Menu>
            
            {/* 帮助按钮 */}
            <Tooltip title="帮助中心">
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
                <Typography variant="inherit">个人信息</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); history.push('/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">账号设置</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">登出</Typography>
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
          {menuItems.map((item, index) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              className={clsx({
                [classes.activeListItem]: isActive(item.path)
              })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
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