import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  makeStyles 
} from '@material-ui/core';
import { 
  SentimentDissatisfied as SadIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@material-ui/icons';
import useI18n from '../hooks/useI18n';
import { colorPalette } from '../theme';

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
  errorCode: {
    fontSize: 72,
    fontWeight: 700,
    color: colorPalette.red.main,
    marginBottom: theme.spacing(2),
    fontFamily: '"Roboto Mono", monospace',
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.type === 'dark' ? colorPalette.white.main : colorPalette.black.main,
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
    '&::before': {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? colorPalette.black.grey : colorPalette.white.dark}`,
      marginRight: theme.spacing(2),
    },
    '&::after': {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? colorPalette.black.grey : colorPalette.white.dark}`,
      marginLeft: theme.spacing(2),
    },
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
  },
  suggestionText: {
    color: theme.palette.type === 'dark' ? colorPalette.black.lightGrey : colorPalette.black.grey,
  }
}));

const NotFoundPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { translate } = useI18n();
  
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
        <SadIcon className={classes.icon} />
        
        <Typography variant="h1" className={classes.errorCode}>
          404
        </Typography>
        
        <Typography variant="h4" className={classes.title}>
          {translate('notFound.title')}
        </Typography>
        
        <Typography variant="body1" className={classes.message}>
          {translate('notFound.message')}
        </Typography>
        
        <div className={classes.divider}>
          <Typography variant="body2" className={classes.suggestionText}>
            {translate('notFound.suggestion')}
          </Typography>
        </div>
        
        <Box className={classes.actionButtons}>
          <Button
            variant="outlined"
            className={classes.goBackButton}
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            {translate('notFound.goBack')}
          </Button>
          <Button
            variant="contained"
            className={classes.goHomeButton}
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            {translate('notFound.goHome')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage; 