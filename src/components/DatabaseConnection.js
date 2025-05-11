import React, { useState } from 'react';
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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowForward } from '@material-ui/icons';

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
}));

const databaseTypes = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlserver', label: 'SQL Server' },
  { value: 'oracle', label: 'Oracle' },
];

function DatabaseConnection({ onNext }) {
  const classes = useStyles();
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 模拟数据库连接成功
    setNotification({
      open: true,
      message: '数据库连接成功！',
      severity: 'success',
    });
    // 存储连接信息到 localStorage
    localStorage.setItem('dbConnection', JSON.stringify(formData));
    // 延迟一下再进入下一步，让用户看到成功消息
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        数据库连接
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <div className={classes.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
          >
            连接并继续
          </Button>
        </div>
      </form>
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