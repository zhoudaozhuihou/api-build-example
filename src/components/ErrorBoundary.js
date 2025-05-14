import React, { Component } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  withStyles 
} from '@material-ui/core';
import { 
  Error as ErrorIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon
} from '@material-ui/icons';
import { IntlProvider, injectIntl } from 'react-intl';
import { messages, LOCALES } from '../i18n';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: 600,
    textAlign: 'center',
  },
  icon: {
    fontSize: 64,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  message: {
    marginBottom: theme.spacing(3),
  },
  errorDetails: {
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
    color: theme.palette.error.dark,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    overflow: 'auto',
    maxHeight: 150,
    textAlign: 'left',
    marginBottom: theme.spacing(3),
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error', error, errorInfo);
    
    // 这里可以添加错误日志上报逻辑
    // logErrorToMyService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { classes, children } = this.props;
    const { hasError, error, errorInfo } = this.state;
    
    if (hasError) {
      // 强制使用中文显示错误信息，以防止国际化上下文崩溃
      const locale = LOCALES.CHINESE;
      
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <ErrorDisplay 
            classes={classes} 
            error={error} 
            errorInfo={errorInfo} 
            onRefresh={this.handleRefresh}
            onGoHome={this.handleGoHome}
          />
        </IntlProvider>
      );
    }

    return children;
  }
}

// 分离出错误显示组件，以便可以注入IntlProvider
const ErrorDisplay = injectIntl(({ classes, intl, error, errorInfo, onRefresh, onGoHome }) => {
  const translate = (id) => intl.formatMessage({ id });
  
  return (
    <Container className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <ErrorIcon className={classes.icon} />
        
        <Typography variant="h4" className={classes.title}>
          {translate('error.title')}
        </Typography>
        
        <Typography variant="body1" className={classes.message}>
          {translate('error.message')}
        </Typography>
        
        {process.env.NODE_ENV === 'development' && error && (
          <Box mt={3} mb={2}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              {translate('error.details')}
            </Typography>
            <div className={classes.errorDetails}>
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </div>
          </Box>
        )}
        
        <Box className={classes.actionButtons}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
          >
            {translate('error.refresh')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={onGoHome}
          >
            {translate('error.goHome')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
});

export default withStyles(styles)(ErrorBoundary); 