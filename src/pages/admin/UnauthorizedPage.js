import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  makeStyles 
} from '@material-ui/core';
import { 
  ErrorOutline as ErrorIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@material-ui/icons';
import useI18n from '../../hooks/useI18n';
import { colorPalette } from '../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: 600,
    textAlign: 'center',
    border: `1px solid ${theme.palette.type === 'dark' ? colorPalette.black.light : colorPalette.white.dark}`,
    backgroundColor: theme.palette.type === 'dark' ? colorPalette.black.light : colorPalette.white.main,
  },
  icon: {
    fontSize: 80,
    color: colorPalette.red.main,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    color: colorPalette.red.main,
    fontWeight: 600,
  },
  message: {
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'dark' ? colorPalette.white.dark : colorPalette.black.light,
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  permissionBox: {
    backgroundColor: theme.palette.type === 'dark' ? colorPalette.black.main : colorPalette.white.off,
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
    color: theme.palette.type === 'dark' ? colorPalette.red.light : colorPalette.red.main,
    fontFamily: '"Roboto Mono", monospace',
    fontSize: '0.9rem',
    fontWeight: 500,
    letterSpacing: 0.5,
    border: `1px solid ${theme.palette.type === 'dark' ? colorPalette.red.dark : colorPalette.red.lighter}20`,
  },
  permissionTitle: {
    fontWeight: 500,
    color: theme.palette.type === 'dark' ? colorPalette.white.main : colorPalette.black.main,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(0.5),
      fontSize: '1rem',
      color: colorPalette.red.main,
    }
  },
  goBackButton: {
    color: theme.palette.type === 'dark' ? colorPalette.white.main : colorPalette.black.main,
    borderColor: theme.palette.type === 'dark' ? colorPalette.white.main : colorPalette.black.main,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    }
  },
  goHomeButton: {
    background: `linear-gradient(45deg, ${colorPalette.red.dark} 0%, ${colorPalette.red.main} 100%)`,
    color: colorPalette.white.main,
    boxShadow: '0 4px 10px rgba(229, 57, 53, 0.25)',
    '&:hover': {
      background: `linear-gradient(45deg, ${colorPalette.red.main} 0%, ${colorPalette.red.light} 100%)`,
      boxShadow: '0 6px 15px rgba(229, 57, 53, 0.35)',
    }
  }
}));

const UnauthorizedPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { translate } = useI18n();
  
  // 获取重定向前的页面路径
  const { from } = location.state || { from: { pathname: '/' } };
  const requiredPermissions = location.state?.requiredPermissions || [];
  
  // 处理返回首页
  const handleGoHome = () => {
    history.push('/');
  };
  
  // 处理返回上一页
  const handleGoBack = () => {
    history.goBack();
  };
  
  return (
    <Container className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <ErrorIcon className={classes.icon} />
        
        <Typography variant="h4" className={classes.title} color="error">
          {translate('unauthorized.title')}
        </Typography>
        
        <Typography variant="body1" className={classes.message}>
          {translate('unauthorized.message')}
        </Typography>
        
        {Array.isArray(requiredPermissions) && requiredPermissions.length > 0 && (
          <Box my={2}>
            <Typography variant="subtitle2" className={classes.permissionTitle}>
              <ErrorIcon fontSize="small" /> {translate('unauthorized.requiredPermissions')}
            </Typography>
            <Box className={classes.permissionBox}>
              {Array.isArray(requiredPermissions) ? 
                requiredPermissions.join(', ') : 
                requiredPermissions
              }
            </Box>
          </Box>
        )}
        
        <Box className={classes.actionButtons}>
          <Button
            variant="outlined"
            className={classes.goBackButton}
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            {translate('unauthorized.goBack')}
          </Button>
          <Button
            variant="contained"
            className={classes.goHomeButton}
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            {translate('unauthorized.goHome')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage; 