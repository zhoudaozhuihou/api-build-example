import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Grid,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ArrowBack,
  Save,
  Add as AddIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Http as HttpIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';
import CategoryCascader from './CategoryCascader';
import { apiCategories } from '../constants/apiCategories';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabsRoot: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
  },
  tabContent: {
    padding: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  addButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  codeBlock: {
    backgroundColor: theme.palette.grey[100],
    fontFamily: 'monospace',
    padding: theme.spacing(2),
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    marginTop: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  tabPanel: {
    marginTop: theme.spacing(2),
  },
  infoCard: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  sectionDivider: {
    margin: theme.spacing(3, 0),
  },
  lineageSection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  methodDropdown: {
    width: '100%',
  },
}));

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
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const parameterTypes = ['string', 'number', 'boolean', 'date', 'object', 'array'];
const contentTypes = [
  'application/json',
  'application/xml',
  'text/plain',
  'text/html',
  'multipart/form-data',
  'application/x-www-form-urlencoded',
];

function ApiDetailsEditor({ onFinish, onBack, apiConfig, updateApiConfig }) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [newHeader, setNewHeader] = useState({ name: '', value: '', description: '' });
  const [upstreamInput, setUpstreamInput] = useState({ name: '', description: '' });

  // 处理基本信息变更
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    updateApiConfig({
      [name]: value,
    });
  };

  // 处理请求头添加
  const handleAddRequestHeader = () => {
    if (newHeader.name.trim()) {
      const updatedHeaders = [...(apiConfig.requestHeaders || []), { ...newHeader, id: Date.now() }];
      updateApiConfig({ requestHeaders: updatedHeaders });
      setNewHeader({ name: '', value: '', description: '' });
    }
  };

  // 处理请求头删除
  const handleRemoveRequestHeader = (id) => {
    const updatedHeaders = (apiConfig.requestHeaders || []).filter(header => header.id !== id);
    updateApiConfig({ requestHeaders: updatedHeaders });
  };

  // 处理新请求头输入变更
  const handleHeaderChange = (field, value) => {
    setNewHeader(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理分类变更
  const handleCategoryChange = (categories) => {
    updateApiConfig({ categories });
  };

  // 处理选项卡变更
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 添加上游系统
  const handleAddUpstream = () => {
    if (upstreamInput.name.trim()) {
      const updatedUpstream = [...(apiConfig.upstreamSystems || []), { ...upstreamInput, id: Date.now() }];
      updateApiConfig({ upstreamSystems: updatedUpstream });
      setUpstreamInput({ name: '', description: '' });
    }
  };

  // 删除上游系统
  const handleRemoveUpstream = (id) => {
    const updatedUpstream = (apiConfig.upstreamSystems || []).filter(system => system.id !== id);
    updateApiConfig({ upstreamSystems: updatedUpstream });
  };

  // 处理上游系统输入变更
  const handleUpstreamChange = (field, value) => {
    setUpstreamInput(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理请求体变更
  const handleRequestBodyChange = (e) => {
    updateApiConfig({ requestBody: e.target.value });
  };

  // 处理响应体变更
  const handleResponseBodyChange = (e) => {
    updateApiConfig({ responseBody: e.target.value });
  };

  // 完成API构建
  const handleFinish = () => {
    // 验证必填字段
    if (!apiConfig.name || !apiConfig.path) {
      setNotification({
        open: true,
        message: 'API名称和路径是必填项',
        severity: 'error',
      });
      return;
    }

    // 通知父组件完成
    onFinish();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // 生成请求示例
  const generateRequestExample = () => {
    const method = apiConfig.method || 'GET';
    const path = apiConfig.path || '/api/resource';
    const headers = apiConfig.requestHeaders || [];
    
    let example = `${method} ${path} HTTP/1.1\n`;
    example += `Host: example.com\n`;
    
    headers.forEach(header => {
      example += `${header.name}: ${header.value}\n`;
    });

    if (apiConfig.requestBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      example += `\n${apiConfig.requestBody}`;
    }
    
    return example;
  };

  // 生成响应示例
  const generateResponseExample = () => {
    // 响应头
    let example = `HTTP/1.1 200 OK\n`;
    example += `Content-Type: application/json\n`;
    
    // 根据输出参数构建响应体示例
    const outputParams = apiConfig.outputParameters || [];
    let responseBody = {};
    
    if (outputParams.length > 0) {
      outputParams.forEach(paramId => {
        const [tableId, colId] = paramId.split('_');
        // 为了简化，这里假设所有参数都返回一个值
        responseBody[paramId] = "示例值";
      });
    } else {
      responseBody = { message: "操作成功" };
    }
    
    // 如果有自定义响应体，使用自定义的
    if (apiConfig.responseBody) {
      example += `\n${apiConfig.responseBody}`;
    } else {
      example += `\n${JSON.stringify(responseBody, null, 2)}`;
    }
    
    return example;
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        API 详情设置
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabsRoot}
      >
        <Tab 
          icon={<DescriptionIcon />} 
          label="基本信息" 
          {...a11yProps(0)} 
        />
        <Tab 
          icon={<HttpIcon />} 
          label="请求内容" 
          {...a11yProps(1)} 
        />
        <Tab 
          icon={<CodeIcon />} 
          label="响应内容" 
          {...a11yProps(2)} 
        />
      </Tabs>

      <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
        <Card className={classes.infoCard}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              设置API的基本信息，包括名称、路径、描述和分类。这些信息将帮助其他开发者理解和使用您的API。
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="API 名称"
              name="name"
              value={apiConfig.name || ''}
              onChange={handleBasicInfoChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>HTTP 方法</InputLabel>
              <Select
                name="method"
                value={apiConfig.method || 'GET'}
                onChange={handleBasicInfoChange}
                className={classes.methodDropdown}
              >
                {httpMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="API 路径"
              name="path"
              value={apiConfig.path || ''}
              onChange={handleBasicInfoChange}
              placeholder="/api/v1/resource"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="API 描述"
              name="description"
              value={apiConfig.description || ''}
              onChange={handleBasicInfoChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>API 分类</Typography>
        <CategoryCascader
          options={apiCategories}
          onChange={handleCategoryChange}
          value={apiConfig.categories || []}
          multiple
        />
        <div className={classes.chips}>
          {(apiConfig.categories || []).map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              className={classes.chip}
              color="primary"
              variant="outlined"
              icon={<CategoryIcon />}
            />
          ))}
        </div>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>上游系统/依赖</Typography>
        <div className={classes.lineageSection}>
          {apiConfig.upstreamSystems && apiConfig.upstreamSystems.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>系统名称</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell width="10%">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiConfig.upstreamSystems.map((system) => (
                    <TableRow key={system.id}>
                      <TableCell>{system.name}</TableCell>
                      <TableCell>{system.description}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveUpstream(system.id)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary" gutterBottom>
              未设置上游依赖
            </Typography>
          )}

          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                label="上游系统名称"
                value={upstreamInput.name}
                onChange={(e) => handleUpstreamChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                label="描述"
                value={upstreamInput.description}
                onChange={(e) => handleUpstreamChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddUpstream}
              >
                添加
              </Button>
            </Grid>
          </Grid>
        </div>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>SQL 查询</Typography>
        <div className={classes.codeBlock}>
          {apiConfig.sql || '未设置 SQL 查询'}
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
        <Card className={classes.infoCard}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              设置API请求的HTTP头和请求体。这些信息描述了客户端调用API时需要提供的信息。
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>请求头 (Headers)</Typography>
        <TableContainer>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>值</TableCell>
                <TableCell>描述</TableCell>
                <TableCell width="10%">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(apiConfig.requestHeaders || []).map((header) => (
                <TableRow key={header.id}>
                  <TableCell>{header.name}</TableCell>
                  <TableCell>{header.value}</TableCell>
                  <TableCell>{header.description}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveRequestHeader(header.id)}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} className={classes.addButton}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="名称"
              value={newHeader.name}
              onChange={(e) => handleHeaderChange('name', e.target.value)}
              placeholder="Content-Type"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="值"
              value={newHeader.value}
              onChange={(e) => handleHeaderChange('value', e.target.value)}
              placeholder="application/json"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="描述"
              value={newHeader.description}
              onChange={(e) => handleHeaderChange('description', e.target.value)}
              placeholder="指定请求内容类型"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddRequestHeader}
            >
              添加
            </Button>
          </Grid>
        </Grid>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>请求体 (Body)</Typography>
        <FormControl fullWidth style={{ marginBottom: 16 }}>
          <InputLabel>内容类型</InputLabel>
          <Select
            name="requestContentType"
            value={apiConfig.requestContentType || 'application/json'}
            onChange={handleBasicInfoChange}
          >
            {contentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label="请求体示例"
          value={apiConfig.requestBody || ''}
          onChange={handleRequestBodyChange}
          placeholder={
            apiConfig.method === 'POST' || apiConfig.method === 'PUT' || apiConfig.method === 'PATCH'
              ? '{\n  "key": "value"\n}'
              : '// GET请求通常不需要请求体'
          }
        />

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>请求示例</Typography>
        <div className={classes.codeBlock}>
          {generateRequestExample()}
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
        <Card className={classes.infoCard}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              设置API响应的HTTP头和响应体。这些信息描述了客户端调用API后将收到的内容。
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>响应头 (Headers)</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="响应头示例"
          value={apiConfig.responseHeaders || "Content-Type: application/json\nX-API-Version: 1.0"}
          onChange={(e) => updateApiConfig({ responseHeaders: e.target.value })}
          style={{ marginBottom: 16 }}
        />

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>响应体 (Body)</Typography>
        <FormControl fullWidth style={{ marginBottom: 16 }}>
          <InputLabel>内容类型</InputLabel>
          <Select
            name="responseContentType"
            value={apiConfig.responseContentType || 'application/json'}
            onChange={handleBasicInfoChange}
          >
            {contentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label="响应体示例"
          value={apiConfig.responseBody || ''}
          onChange={handleResponseBodyChange}
          placeholder='{\n  "data": [\n    {\n      "id": 1,\n      "name": "示例数据"\n    }\n  ],\n  "success": true\n}'
        />

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" gutterBottom>响应示例</Typography>
        <div className={classes.codeBlock}>
          {generateResponseExample()}
        </div>
      </TabPanel>

      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="default"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          返回
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleFinish}
        >
          完成创建
        </Button>
      </div>

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

export default ApiDetailsEditor; 