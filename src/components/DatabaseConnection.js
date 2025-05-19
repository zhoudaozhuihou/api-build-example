import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  ArrowForward, 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  PlayArrow as TestIcon
} from '@material-ui/icons';
import DatabaseConnectionService from '../services/DatabaseConnectionService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  connectionsList: {
    marginTop: theme.spacing(3),
    maxHeight: '400px',
    overflow: 'auto',
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  selectedConnection: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  noConnections: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  connectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  testingProgress: {
    marginRight: theme.spacing(1),
  },
  connectionFormTitle: {
    marginBottom: theme.spacing(2),
  },
  listItemConnectionType: {
    display: 'inline-block',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    marginRight: theme.spacing(1),
  },
}));

const databaseTypes = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlserver', label: 'SQL Server' },
  { value: 'oracle', label: 'Oracle' },
];

function DatabaseConnection({ onNext, onSelect }) {
  const classes = useStyles();
  const [connections, setConnections] = useState([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'mysql',
    host: '',
    port: '3306',
    database: '',
    username: '',
    password: '',
    ssl: false,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // 加载已保存的数据库连接
  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = () => {
    const savedConnections = DatabaseConnectionService.getAllConnections();
    setConnections(savedConnections);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // 清除该字段的错误
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = '请输入连接名称';
    if (!formData.host) errors.host = '请输入主机地址';
    if (!formData.port) errors.port = '请输入端口号';
    if (!formData.database) errors.database = '请输入数据库名称';
    if (!formData.username) errors.username = '请输入用户名';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (isEdit = false) => {
    if (isEdit && selectedConnectionId) {
      const connection = DatabaseConnectionService.getConnectionById(selectedConnectionId);
      if (connection) {
        setFormData({
          ...connection,
          password: connection.password || '',
        });
        setIsEditing(true);
      }
    } else {
      setFormData({
        name: '',
        type: 'mysql',
        host: '',
        port: '3306',
        database: '',
        username: '',
        password: '',
        ssl: false,
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormErrors({});
  };

  const handleSaveConnection = () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        DatabaseConnectionService.updateConnection(selectedConnectionId, formData);
        setNotification({
          open: true,
          message: '数据库连接已更新！',
          severity: 'success',
        });
      } else {
        const newConnection = DatabaseConnectionService.saveConnection(formData);
        setSelectedConnectionId(newConnection.id);
        setNotification({
          open: true,
          message: '数据库连接已保存！',
          severity: 'success',
        });
      }
      
      loadConnections();
      handleCloseDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || '保存连接时出错',
        severity: 'error',
      });
    }
  };

  const handleDeleteConnection = () => {
    if (selectedConnectionId) {
      try {
        DatabaseConnectionService.deleteConnection(selectedConnectionId);
        setSelectedConnectionId(null);
        loadConnections();
        setNotification({
          open: true,
          message: '数据库连接已删除！',
          severity: 'success',
        });
      } catch (error) {
        setNotification({
          open: true,
          message: error.message || '删除连接时出错',
          severity: 'error',
        });
      }
    }
  };

  const handleSelectConnection = (connectionId) => {
    setSelectedConnectionId(connectionId);
    if (onSelect) {
      const connection = DatabaseConnectionService.getConnectionById(connectionId);
      onSelect(connection);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      const success = await DatabaseConnectionService.testConnection(
        isEditing ? formData : DatabaseConnectionService.getConnectionById(selectedConnectionId)
      );
      
      setNotification({
        open: true,
        message: success ? '连接测试成功！' : '连接测试失败',
        severity: success ? 'success' : 'error',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || '连接测试失败',
        severity: 'error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleContinue = () => {
    if (!selectedConnectionId) {
      setNotification({
        open: true,
        message: '请先选择或创建一个数据库连接',
        severity: 'warning',
      });
      return;
    }

    // 标记连接为已使用
    DatabaseConnectionService.markConnectionAsUsed(selectedConnectionId);
    
    // 继续到下一步
    if (onNext) {
      const connection = DatabaseConnectionService.getConnectionById(selectedConnectionId);
      onNext(connection);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getDbTypeName = (typeValue) => {
    const type = databaseTypes.find(t => t.value === typeValue);
    return type ? type.label : typeValue;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.connectionHeader}>
        <Typography variant="h5">数据库连接</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
        >
          新建连接
        </Button>
      </div>
      
      {connections.length > 0 ? (
        <List className={classes.connectionsList}>
          {connections.map((connection) => (
            <ListItem 
              key={connection.id} 
              className={`${classes.listItem} ${connection.id === selectedConnectionId ? classes.selectedConnection : ''}`}
              onClick={() => handleSelectConnection(connection.id)}
            >
              <ListItemText 
                primary={
                  <Box display="flex" alignItems="center">
                    <span className={classes.listItemConnectionType}>
                      {getDbTypeName(connection.type)}
                    </span>
                    {connection.name}
                  </Box>
                }
                secondary={`${connection.host}:${connection.port} / ${connection.database}`}
              />
              <ListItemSecondaryAction>
                <Tooltip title="测试连接">
                  <IconButton 
                    edge="end" 
                    className={classes.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConnectionId(connection.id);
                      handleTestConnection();
                    }}
                  >
                    <TestIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="编辑连接">
                  <IconButton 
                    edge="end" 
                    className={classes.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConnectionId(connection.id);
                      handleOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="删除连接">
                  <IconButton 
                    edge="end" 
                    className={classes.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConnectionId(connection.id);
                      handleDeleteConnection();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box className={classes.noConnections}>
          <Typography>没有保存的数据库连接</Typography>
          <Typography variant="body2">
            请创建新的数据库连接以开始构建API
          </Typography>
        </Box>
      )}

      <Divider className={classes.divider} />
      
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForward />}
          onClick={handleContinue}
          disabled={!selectedConnectionId}
        >
          继续下一步
        </Button>
      </div>

      {/* 连接创建/编辑对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className={classes.connectionFormTitle}>
          {isEditing ? '编辑数据库连接' : '创建新的数据库连接'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="连接名称"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>数据库类型</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {databaseTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="主机"
                name="host"
                value={formData.host}
                onChange={handleChange}
                placeholder="localhost"
                error={!!formErrors.host}
                helperText={formErrors.host}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="端口"
                name="port"
                value={formData.port}
                onChange={handleChange}
                type="number"
                error={!!formErrors.port}
                helperText={formErrors.port}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="数据库名称"
                name="database"
                value={formData.database}
                onChange={handleChange}
                error={!!formErrors.database}
                helperText={formErrors.database}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="用户名"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="密码"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="default">
            取消
          </Button>
          <Button
            onClick={handleTestConnection}
            color="primary"
            disabled={isTesting}
            startIcon={isTesting ? <CircularProgress size={20} className={classes.testingProgress} /> : <TestIcon />}
          >
            测试连接
          </Button>
          <Button 
            onClick={handleSaveConnection} 
            color="primary" 
            variant="contained"
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 通知提示 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default DatabaseConnection; 