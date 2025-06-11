import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  makeStyles,
  CircularProgress,
  Fade,
  useTheme,
  Hidden
} from '@material-ui/core';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Group as GroupIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Error as ErrorIcon
} from '@material-ui/icons';
import { login, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../../redux/slices/authSlice';
import useI18n from '../../hooks/useI18n';

// 定义新的黑红白配色方案
const colorPalette = {
  red: {
    main: '#e53935',     // 主红色
    light: '#ff6f60',    // 浅红色
    dark: '#ab000d',     // 深红色
  },
  black: {
    main: '#212121',     // 主黑色
    light: '#484848',    // 浅黑色
    dark: '#000000',     // 深黑色
  },
  white: {
    main: '#ffffff',     // 主白色
    off: '#f5f5f5',      // 灰白色
    dark: '#e0e0e0',     // 暗白色
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.black.main,
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `linear-gradient(135deg, ${colorPalette.black.main} 0%, ${colorPalette.black.light} 100%)`,
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      minHeight: '100vh',
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    backgroundImage: 
      `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e53935' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    zIndex: 0,
  },
  '@keyframes floatBackground': {
    '0%': {
      backgroundPosition: '0% 0%',
    },
    '100%': {
      backgroundPosition: '100% 100%',
    },
  },
  container: {
    maxWidth: 1200,
    padding: theme.spacing(2),
    position: 'relative',
    zIndex: 1,
  },
  paper: {
    display: 'flex',
    borderRadius: 20,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 80px rgba(229, 57, 53, 0.15)',
    position: 'relative',
    overflow: 'hidden',
    background: colorPalette.white.main,
    border: `1px solid ${colorPalette.black.light}10`,
    minHeight: '550px',
    maxHeight: '90vh',
    backdropFilter: 'blur(5px)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5), 0 0 100px rgba(229, 57, 53, 0.2)',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      maxHeight: 'none',
    },
  },
  promoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    backgroundColor: colorPalette.red.main,
    color: colorPalette.white.main,
    position: 'relative',
    backgroundImage: `linear-gradient(135deg, ${colorPalette.red.main} 0%, ${colorPalette.red.dark} 100%)`,
    overflow: 'hidden',
    boxShadow: 'inset -10px 0 30px -10px rgba(0,0,0,0.3)',
  },
  promoPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '60px 60px',
    zIndex: 0,
    animation: '$movingBackground 60s infinite linear',
  },
  '@keyframes movingBackground': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '100%': {
      backgroundPosition: '600px 600px',
    },
  },
  promoContent: {
    textAlign: 'left',
    width: '100%',
    zIndex: 1,
    maxWidth: 400,
    position: 'relative',
    overflowY: 'auto',
    maxHeight: '100%',
    paddingRight: theme.spacing(1),
  },
  promoTitle: {
    fontWeight: 800,
    marginBottom: theme.spacing(3),
    fontSize: '2.3rem',
    textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -12,
      left: 0,
      width: 60,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: 2,
    }
  },
  promoSubtitle: {
    marginBottom: theme.spacing(4),
    opacity: 0.9,
    fontWeight: 300,
    fontSize: '1.1rem',
    lineHeight: 1.5,
  },
  featureList: {
    marginTop: theme.spacing(6),
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateX(10px)',
    }
  },
  featureIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: theme.spacing(1),
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    '& svg': {
      fontSize: '1.2rem',
    },
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
    }
  },
  featureText: {
    fontWeight: 600,
    fontSize: '1.1rem',
    letterSpacing: 0.5,
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  clientList: {
    marginTop: theme.spacing(5),
  },
  clientTitle: {
    opacity: 0.8,
    marginBottom: theme.spacing(3),
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 600,
  },
  clientLogos: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  clientLogo: {
    padding: theme.spacing(1),
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    width: 60,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px) rotate(5deg)',
      boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
      backgroundColor: 'rgba(255,255,255,0.35)',
    }
  },
  loginSection: {
    flex: 1,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(135deg, ${colorPalette.white.main} 0%, ${colorPalette.white.dark} 100%)`,
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
    },
  },
  loginPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.02,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.8'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22.24H0v-1.41zM0 3.06l2.83-2.83 1.41 1.41L1.41 4.47H0V3.06zm20 0l2.83-2.83 1.41 1.41L21.41 4.47h-1.41V3.06zm0 17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0 17.77l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41zM17.18 0l2.83 2.83-1.41 1.41L15.77 1.41V0h1.41zM38.59 0l2.83 2.83-1.41 1.41L37.18 1.41V0h1.41zM20.83 0l2.83 2.83-1.41 1.41L19.42 1.41V0h1.41zM36.01 20.83l2.83 2.83-1.41 1.41-2.83-2.83v-1.41h1.41zm0-17.77l2.83 2.83-1.41 1.41-2.83-2.83V1.41h1.41zm0 35.54l2.83 2.83-1.41 1.41-2.83-2.83v-1.41h1.41zM0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zm0-17.76l2.83-2.83 1.41 1.41L1.41 22.24H0v-1.41zM0 3.06l2.83-2.83 1.41 1.41L1.41 4.47H0V3.06zm18.17 0l2.83-2.83 1.41 1.41L19.58 4.47h-1.41V3.06zM39 38.59l2.83-2.83 1.41 1.41L40.41 40H39v-1.41zm-20.83 0l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM37.18 20.83l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V3.06zm0 17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM20.83 20.83l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V3.06zm0 17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    zIndex: 0,
  },
  loginContent: {
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    zIndex: 2,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  title: {
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    fontSize: '2.2rem',
    background: `linear-gradient(45deg, ${colorPalette.black.main}, ${colorPalette.red.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(0,0,0,0.05)',
    color: colorPalette.black.main, // Fallback for browsers not supporting gradient text
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 60,
      height: 3,
      background: `linear-gradient(90deg, ${colorPalette.red.dark}, ${colorPalette.red.main})`,
      borderRadius: 2,
    }
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
    height: 54,
    borderRadius: 27,
    boxShadow: '0 8px 20px rgba(229, 57, 53, 0.28)',
    background: `linear-gradient(45deg, ${colorPalette.red.dark} 0%, ${colorPalette.red.main} 100%)`,
    color: colorPalette.white.main,
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    letterSpacing: 1,
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 25px rgba(229, 57, 53, 0.4)',
      background: `linear-gradient(45deg, ${colorPalette.red.main} 0%, ${colorPalette.red.light} 100%)`,
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '0 5px 15px rgba(229, 57, 53, 0.3)',
    }
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 16,
      transition: 'all 0.3s ease',
      height: 55,
      '&.Mui-focused': {
        boxShadow: `0 0 0 3px ${colorPalette.red.main}30`
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${colorPalette.black.light}30`,
      borderWidth: 1.5,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: `${colorPalette.black.light}50`,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colorPalette.red.main,
      borderWidth: 2,
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
      color: colorPalette.red.main,
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 18px) scale(1)',
      fontSize: '1rem',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
  },
  errorMessage: {
    color: colorPalette.red.main,
    textAlign: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    backgroundColor: `${colorPalette.red.main}15`,
    border: `1px solid ${colorPalette.red.main}30`,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    }
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  divider: {
    flexGrow: 1,
    backgroundColor: `${colorPalette.black.light}20`,
    height: 1.5,
  },
  dividerText: {
    margin: theme.spacing(0, 2),
    color: colorPalette.black.light,
    fontWeight: 500,
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: theme.spacing(1),
    '& a': {
      color: colorPalette.red.main,
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      position: 'relative',
      display: 'inline-block',
      '&:hover': {
        color: colorPalette.red.dark,
        transform: 'translateY(-1px)',
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: 1,
        bottom: -2,
        left: 0,
        background: colorPalette.red.light,
        transform: 'scaleX(0)',
        transformOrigin: 'bottom right',
        transition: 'transform 0.3s ease',
      },
      '&:hover:after': {
        transform: 'scaleX(1)',
        transformOrigin: 'bottom left',
      }
    }
  },
  progress: {
    marginRight: theme.spacing(1),
    color: colorPalette.white.main,
  },
  ssoButton: {
    borderRadius: 27,
    height: 54,
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    background: colorPalette.white.main,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: `${colorPalette.black.light}20`,
    color: colorPalette.black.main,
    transition: 'all 0.3s ease',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      background: colorPalette.white.off,
      borderColor: `${colorPalette.black.light}40`,
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    }
  },
  contactAdmin: {
    color: colorPalette.red.main,
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  '@media (max-height: 700px)': {
    title: {
      fontSize: '1.8rem',
      marginBottom: theme.spacing(2),
    },
    form: {
      marginTop: theme.spacing(2),
    },
    textField: {
      marginBottom: theme.spacing(1.5),
    },
    submit: {
      margin: theme.spacing(2, 0, 1.5),
      height: 48,
    },
    ssoButton: {
      height: 48,
    },
    promoTitle: {
      fontSize: '2rem',
      marginBottom: theme.spacing(2),
    },
    promoSubtitle: {
      fontSize: '1rem',
      marginBottom: theme.spacing(3),
    },
    featureItem: {
      marginBottom: theme.spacing(2),
    },
    clientList: {
      marginTop: theme.spacing(3),
    },
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { translate } = useI18n();
  
  // 获取重定向地址，作为useEffect依赖的一部分使用
  const from = (() => {
    const pathname = location.state?.from?.pathname;
    // 确保路径格式正确，以/开头且不包含协议
    if (pathname && typeof pathname === 'string' && pathname.startsWith('/') && !pathname.includes('://')) {
      return pathname;
    }
    return '/';
  })();
  
  // Redux 状态
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // 本地状态
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // 如果已经登录，则重定向
  useEffect(() => {
    if (isAuthenticated) {
      try {
        // 验证URL是否为有效的路径
        if (from && from !== '/' && !from.includes('://')) {
          // 检查路径是否存在于我们的路由中
          const validPaths = [
            '/marketing', '/developer', '/catalog', '/datasets', 
            '/review-orders', '/analytics', '/lowcode', '/category-demo',
            '/json-table-demo', '/json-component-demo', '/dataset-search-demo',
            '/visual-join-builder', '/table-joiner-flow', '/interactive-table-demo',
            '/search-dropdown-demo', '/admin', '/unauthorized'
          ];
          
          const isValidPath = validPaths.some(path => from.startsWith(path)) || from === '/';
          
          if (isValidPath) {
            history.replace(from);
          } else {
            history.replace('/');
          }
        } else {
          history.replace('/');
        }
      } catch (error) {
        console.warn('Error during redirect:', error);
        history.replace('/');
      }
    }
  }, [isAuthenticated, history, from]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    dispatch(login(credentials));
  };
  
  // 宣传内容-主要功能列表
  const features = [
    { icon: <SecurityIcon />, text: "API安全管理与权限控制" },
    { icon: <SpeedIcon />, text: "高性能API调用与监控" },
    { icon: <GroupIcon />, text: "团队协作与API共享" },
    { icon: <AssignmentIcon />, text: "完整的API文档管理" }
  ];
  
  // 宣传内容-客户列表
  const clients = ["TechCorp", "DataSys", "CloudNet", "InfoTech"];
  
  return (
    <div className={classes.root}>
      <div className={classes.backgroundPattern} />
      <Container className={classes.container}>
        <Fade in={true} timeout={800}>
          <Paper className={classes.paper} elevation={6}>
            {/* 左侧宣传区域 */}
            <Hidden smDown>
              <div className={classes.promoSection}>
                <div className={classes.promoPattern} />
                <div className={classes.promoContent}>
                  <Typography variant="h3" className={classes.promoTitle}>
                    API 管理平台
                  </Typography>
                  <Typography variant="subtitle1" className={classes.promoSubtitle}>
                    一站式API管理解决方案，助力企业高效管理和共享API资源，提升开发效率与协作能力。
                  </Typography>
                  
                  <div className={classes.featureList}>
                    {features.map((feature, index) => (
                      <Fade key={index} in={true} timeout={800} style={{ transitionDelay: `${200 + (index * 100)}ms` }}>
                        <div className={classes.featureItem}>
                          <div className={classes.featureIcon}>
                            {feature.icon}
                          </div>
                          <Typography variant="body1" className={classes.featureText}>
                            {feature.text}
                          </Typography>
                        </div>
                      </Fade>
                    ))}
                  </div>
                  
                  <div className={classes.clientList}>
                    <Typography variant="body2" className={classes.clientTitle}>
                      值得信赖的企业选择
                    </Typography>
                    <div className={classes.clientLogos}>
                      {clients.map((client, index) => (
                        <Fade key={index} in={true} timeout={800} style={{ transitionDelay: `${600 + (index * 100)}ms` }}>
                          <div className={classes.clientLogo}>
                            {client.charAt(0)}
                          </div>
                        </Fade>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Hidden>
            
            {/* 右侧登录区域 */}
            <div className={classes.loginSection}>
              <div className={classes.loginPattern} />
              <div className={classes.loginContent}>
                <Fade in={true} timeout={800} style={{ transitionDelay: '500ms' }}>
                  <Typography component="h1" variant="h4" className={classes.title}>
                    {translate('login.title')}
                  </Typography>
                </Fade>
                
                {error && (
                  <Fade in={true}>
                    <Typography variant="body2" className={classes.errorMessage}>
                      <ErrorIcon fontSize="small" />
                      {translate('login.error')}
                    </Typography>
                  </Fade>
                )}
                
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Fade in={true} timeout={800} style={{ transitionDelay: '600ms' }}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label={translate('login.username')}
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={credentials.username}
                      onChange={handleChange}
                      disabled={loading}
                      className={classes.textField}
                    />
                  </Fade>
                  
                  <Fade in={true} timeout={800} style={{ transitionDelay: '700ms' }}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label={translate('login.password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={credentials.password}
                      onChange={handleChange}
                      disabled={loading}
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                  
                  <Fade in={true} timeout={800} style={{ transitionDelay: '800ms' }}>
                    <Box className={classes.forgotPassword}>
                      <Link href="#" variant="body2">
                        {translate('login.forgotPassword')}
                      </Link>
                    </Box>
                  </Fade>
                  
                  <Fade in={true} timeout={800} style={{ transitionDelay: '900ms' }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} className={classes.progress} /> : 
                                formSubmitted && !error && !loading ? <CheckCircleIcon /> : null}
                    >
                      {loading ? translate('login.loggingIn') : translate('login.signIn')}
                    </Button>
                  </Fade>
                  
                  <Fade in={true} timeout={800} style={{ transitionDelay: '1000ms' }}>
                    <div className={classes.dividerContainer}>
                      <Divider className={classes.divider} />
                      <Typography variant="body2" className={classes.dividerText}>
                        {translate('login.or')}
                      </Typography>
                      <Divider className={classes.divider} />
                    </div>
                  </Fade>
                  
                  <Fade in={true} timeout={800} style={{ transitionDelay: '1100ms' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      className={classes.ssoButton}
                      startIcon={<VpnKeyIcon />}
                      disabled={loading}
                    >
                      {translate('login.ssoSignIn')}
                    </Button>
                  </Fade>
                  
                  <Fade in={true} timeout={800} style={{ transitionDelay: '1200ms' }}>
                    <Grid container justifyContent="center" style={{ marginTop: theme.spacing(3) }}>
                      <Grid item>
                        <Typography variant="body2" style={{ color: colorPalette.black.light }}>
                          {translate('login.noAccount')}{' '}
                          <Link href="#" className={classes.contactAdmin}>
                            {translate('login.contactAdmin')}
                          </Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Fade>
                </form>
              </div>
            </div>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default LoginPage; 