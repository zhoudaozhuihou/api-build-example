import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Tabs,
  Tab,
  Paper,
  Snackbar,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  CloudUpload as UploadIcon,
  Code as CodeIcon,
  Description as FormIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ApiImportDialog({ open, onClose, onImportSuccess }) {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    path: '',
    method: 'GET',
    parameters: [],
    responses: {},
    upstreamSystems: [],
    downstreamSystems: [],
    users: [],
  });
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [upstreamInput, setUpstreamInput] = useState({ name: '', description: '' });
  const [userInput, setUserInput] = useState({ name: '', role: '', department: '' });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    setError('');
  };

  const handleAddUpstream = () => {
    if (upstreamInput.name.trim()) {
      setFormData({
        ...formData,
        upstreamSystems: [
          ...formData.upstreamSystems,
          { ...upstreamInput, id: Date.now() }
        ],
      });
      setUpstreamInput({ name: '', description: '' });
    }
  };

  const handleRemoveUpstream = (id) => {
    setFormData({
      ...formData,
      upstreamSystems: formData.upstreamSystems.filter(item => item.id !== id),
    });
  };

  const handleAddUser = () => {
    if (userInput.name.trim()) {
      setFormData({
        ...formData,
        users: [
          ...formData.users,
          { ...userInput, id: Date.now() }
        ],
      });
      setUserInput({ name: '', role: '', department: '' });
    }
  };

  const handleRemoveUser = (id) => {
    setFormData({
      ...formData,
      users: formData.users.filter(user => user.id !== id),
    });
  };

  const handleImport = () => {
    if (tabValue === 0) {
      // Form import validation
      if (!formData.name || !formData.path) {
        setNotification({
          open: true,
          message: 'API名称和路径是必填项',
          severity: 'error',
        });
        return;
      }

      // Add the form data as a new API
      const apis = JSON.parse(localStorage.getItem('apis') || '[]');
      const newApi = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Save API and its lineage data
      localStorage.setItem('apis', JSON.stringify([...apis, newApi]));
      
      // Save lineage data separately
      const lineageData = {
        upstream: formData.upstreamSystems || [],
        downstream: [],
        users: formData.users || [],
      };
      localStorage.setItem(`apiLineage_${newApi.id}`, JSON.stringify(lineageData));

      setNotification({
        open: true,
        message: 'API已成功导入',
        severity: 'success',
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        path: '',
        method: 'GET',
        parameters: [],
        responses: {},
        upstreamSystems: [],
        downstreamSystems: [],
        users: [],
      });

      // Notify parent
      onImportSuccess && onImportSuccess();
    } else {
      // JSON import validation
      try {
        const parsed = JSON.parse(jsonData);
        
        // Basic validation for Swagger/OpenAPI format
        if (!parsed.paths) {
          throw new Error('Invalid Swagger/OpenAPI format: missing paths object');
        }

        // Extract APIs from Swagger JSON
        const apis = [];
        Object.entries(parsed.paths).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, details]) => {
            const api = {
              id: Date.now() + apis.length, // Ensure unique IDs
              name: details.summary || details.operationId || `${method.toUpperCase()} ${path}`,
              description: details.description || '',
              path: path,
              method: method.toUpperCase(),
              parameters: details.parameters || [],
              responses: details.responses || {},
              createdAt: new Date().toISOString(),
              upstreamSystems: [],
              users: [],
            };
            apis.push(api);
          });
        });

        // Save all extracted APIs
        const existingApis = JSON.parse(localStorage.getItem('apis') || '[]');
        const updatedApis = [...existingApis, ...apis];
        localStorage.setItem('apis', JSON.stringify(updatedApis));

        setNotification({
          open: true,
          message: `成功导入 ${apis.length} 个API`,
          severity: 'success',
        });

        // Reset form
        setJsonData('');

        // Notify parent
        onImportSuccess && onImportSuccess();
      } catch (err) {
        setError(err.message);
        setNotification({
          open: true,
          message: `解析JSON失败: ${err.message}`,
          severity: 'error',
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>导入 API 文档</DialogTitle>
      <DialogContent>
        <Paper square>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<FormIcon />} label="表单导入" {...a11yProps(0)} />
            <Tab icon={<CodeIcon />} label="Swagger JSON" {...a11yProps(1)} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API 名称"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>HTTP 方法</InputLabel>
                <Select
                  name="method"
                  value={formData.method}
                  onChange={handleFormChange}
                >
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API 路径"
                name="path"
                value={formData.path}
                onChange={handleFormChange}
                placeholder="/api/v1/resource"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API 描述"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                上游系统/API
              </Typography>
              {formData.upstreamSystems.length > 0 && (
                <Paper variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
                  {formData.upstreamSystems.map((system, index) => (
                    <Grid container spacing={2} key={system.id} alignItems="center" style={{ marginBottom: 8 }}>
                      <Grid item xs={5}>
                        <Typography variant="body2">{system.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">{system.description}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Button 
                          size="small" 
                          color="secondary" 
                          onClick={() => handleRemoveUpstream(system.id)}
                        >
                          删除
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </Paper>
              )}
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="上游系统名称"
                    value={upstreamInput.name}
                    onChange={(e) => setUpstreamInput({ ...upstreamInput, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="描述"
                    value={upstreamInput.description}
                    onChange={(e) => setUpstreamInput({ ...upstreamInput, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddUpstream}
                    fullWidth
                  >
                    添加
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                API 使用者
              </Typography>
              {formData.users.length > 0 && (
                <Paper variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
                  {formData.users.map((user, index) => (
                    <Grid container spacing={2} key={user.id} alignItems="center" style={{ marginBottom: 8 }}>
                      <Grid item xs={3}>
                        <Typography variant="body2">{user.name}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="textSecondary">{user.role}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="textSecondary">{user.department}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Button 
                          size="small" 
                          color="secondary" 
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          删除
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </Paper>
              )}
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="用户名"
                    value={userInput.name}
                    onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="角色"
                    value={userInput.role}
                    onChange={(e) => setUserInput({ ...userInput, role: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="部门"
                    value={userInput.department}
                    onChange={(e) => setUserInput({ ...userInput, department: e.target.value })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddUser}
                    fullWidth
                  >
                    添加
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TextField
            fullWidth
            label="Swagger/OpenAPI JSON"
            multiline
            rows={15}
            variant="outlined"
            value={jsonData}
            onChange={handleJsonChange}
            error={!!error}
            helperText={error}
            placeholder='{
  "swagger": "2.0",
  "info": { "title": "API Documentation", "version": "1.0.0" },
  "paths": {
    "/api/example": {
      "get": {
        "summary": "Example API",
        "description": "This is an example API",
        "responses": { "200": { "description": "Success" } }
      }
    }
  }
}'
          />
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
            请输入有效的Swagger/OpenAPI JSON格式数据
          </Typography>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="default">
          取消
        </Button>
        <Button 
          onClick={handleImport} 
          color="primary" 
          variant="contained"
          startIcon={<UploadIcon />}
        >
          导入
        </Button>
      </DialogActions>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default ApiImportDialog; 