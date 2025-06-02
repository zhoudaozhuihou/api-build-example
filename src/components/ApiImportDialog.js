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
  createTheme,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
  Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  CloudUpload as UploadIcon,
  Code as CodeIcon,
  Description as FormIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TableChart as TableChartIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FileCopy as CopyIcon
} from '@material-ui/icons';
import MUIRichTextEditor from 'mui-rte';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { makeStyles } from '@material-ui/core/styles';

// Create a theme for the rich text editor
const defaultTheme = createTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper': {
      maxWidth: '90vw',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  dialogContent: {
    padding: 0,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },
  tabContent: {
    padding: theme.spacing(2),
    flex: 1,
  },
  formSection: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  jsonTable: {
    marginTop: theme.spacing(2),
    '& .MuiTableCell-root': {
      padding: '8px 16px',
      fontSize: '0.875rem',
    },
    '& .MuiTableCell-head': {
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
    },
  },
  jsonTableContainer: {
  },
  jsonKey: {
    fontWeight: 500,
    fontFamily: 'monospace',
    color: theme.palette.primary.main,
  },
  jsonValue: {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
  viewModeSwitch: {
    marginBottom: theme.spacing(2),
  },
  parameterTableContainer: {
  },
  swaggerTextArea: {
    '& .MuiInputBase-root': {
      minHeight: '400px',
      maxHeight: 'none',
    },
  },
}));

// 简化的JSON结构表格组件
const JsonStructureTable = ({ data, title, onDataChange, editable = false }) => {
  const classes = useStyles();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 将JSON数据扁平化为表格行
  const flattenJsonToRows = (obj, parentKey = '', level = 0) => {
    const rows = [];
    
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];
        const isObject = value && typeof value === 'object' && !Array.isArray(value);
        const isArray = Array.isArray(value);
        
        rows.push({
          id: fullKey,
          key: key,
          fullKey: fullKey,
          value: value,
          type: isArray ? 'array' : isObject ? 'object' : typeof value,
          level: level,
          hasChildren: isObject || isArray,
          parentKey: parentKey
        });

        if (expandedRows.has(fullKey) && (isObject || isArray)) {
          if (isArray) {
            value.forEach((item, index) => {
              const arrayKey = `${fullKey}[${index}]`;
              if (typeof item === 'object') {
                rows.push(...flattenJsonToRows({ [index]: item }, fullKey, level + 1));
              } else {
                rows.push({
                  id: arrayKey,
                  key: `[${index}]`,
                  fullKey: arrayKey,
                  value: item,
                  type: typeof item,
                  level: level + 1,
                  hasChildren: false,
                  parentKey: fullKey
                });
              }
            });
          } else {
            rows.push(...flattenJsonToRows(value, fullKey, level + 1));
          }
        }
      });
    }
    
    return rows;
  };

  const rows = flattenJsonToRows(data);

  const toggleExpand = (rowId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const formatValue = (value, type) => {
    if (type === 'object' || type === 'array') {
      return `{${Object.keys(value || {}).length} ${type === 'array' ? 'items' : 'properties'}}`;
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return String(value);
  };

  const getTypeColor = (type) => {
    const colors = {
      string: '#1976d2',
      number: '#388e3c',
      boolean: '#7b1fa2',
      object: '#f57c00',
      array: '#d32f2f',
      null: '#616161',
      undefined: '#616161'
    };
    return colors[type] || '#616161';
  };

  return (
    <Paper variant="outlined" style={{ marginTop: 16 }}>
      <Box p={2} bgcolor="#f5f5f5" display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{title}</Typography>
      </Box>
      
      <TableContainer className={classes.jsonTableContainer}>
        <Table className={classes.jsonTable} size="small">
          <TableHead>
            <TableRow>
              <TableCell width="40%">字段名</TableCell>
              <TableCell width="40%">值</TableCell>
              <TableCell width="20%">类型</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" style={{ paddingLeft: row.level * 20 }}>
                    {row.hasChildren && (
                      <IconButton 
                        size="small" 
                        onClick={() => toggleExpand(row.fullKey)}
                      >
                        {expandedRows.has(row.fullKey) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    )}
                    <Typography className={classes.jsonKey}>
                      {row.key}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography className={classes.jsonValue}>
                    {formatValue(row.value, row.type)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.type} 
                    size="small" 
                    style={{ 
                      backgroundColor: getTypeColor(row.type), 
                      color: 'white',
                      fontSize: '0.7rem' 
                    }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// 简化的参数编辑器
const ParameterEditor = ({ parameters, onChange }) => {
  const classes = useStyles();
  const [paramList, setParamList] = useState(parameters || []);

  React.useEffect(() => {
    if (Array.isArray(parameters)) {
      setParamList(parameters.map((param, index) => ({ ...param, id: param.id || index })));
    }
  }, [parameters]);

  const addParameter = () => {
    const newParam = {
      id: Date.now(),
      name: '',
      type: 'string',
      required: false,
      description: '',
      example: ''
    };
    const newList = [...paramList, newParam];
    setParamList(newList);
    onChange && onChange(newList);
  };

  const removeParameter = (id) => {
    const newList = paramList.filter(p => p.id !== id);
    setParamList(newList);
    onChange && onChange(newList);
  };

  const updateParameter = (id, field, value) => {
    const newList = paramList.map(p => p.id === id ? { ...p, [field]: value } : p);
    setParamList(newList);
    onChange && onChange(newList);
  };

  return (
    <Paper variant="outlined" style={{ marginTop: 16 }}>
      <Box p={2} bgcolor="#f5f5f5" display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">请求参数</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addParameter}>
          添加参数
        </Button>
      </Box>
      
      <TableContainer className={classes.parameterTableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="25%">参数名</TableCell>
              <TableCell width="15%">类型</TableCell>
              <TableCell width="10%">必填</TableCell>
              <TableCell width="35%">描述</TableCell>
              <TableCell width="15%">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paramList.map((param) => (
              <TableRow key={param.id}>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={param.name || ''}
                    onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                    placeholder="参数名"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    fullWidth
                    size="small"
                    value={param.type || 'string'}
                    onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="integer">Integer</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="array">Array</MenuItem>
                    <MenuItem value="object">Object</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={param.required || false}
                    onChange={(e) => updateParameter(param.id, 'required', e.target.checked)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={param.description || ''}
                    onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
                    placeholder="参数描述"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => removeParameter(param.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {paramList.length === 0 && (
        <Box p={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            暂无参数信息，点击"添加参数"开始添加
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

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
      {value === index && <Box className={props.className}>{children}</Box>}
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
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'json'
  
  // 基本信息
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    path: '',
    method: 'GET',
    category: '',
    version: '1.0.0',
  });

  // 请求/响应数据
  const [requestData, setRequestData] = useState({
    parameters: [],
    body: {
      username: 'example_user',
      filters: {
        status: 'active',
        type: 'premium'
      }
    }
  });

  const [responseData, setResponseData] = useState({
    body: {
      success: true,
      data: {
        user: {
          id: 'user123',
          name: '张三',
          email: 'zhang@example.com'
        }
      },
      message: '请求成功'
    }
  });

  // JSON导入
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

  const handleEditorChange = (state) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    setFormData({
      ...formData,
      description: rawContent,
    });
  };

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    setError('');
  };

  const parseSwaggerJson = (jsonText) => {
    try {
      const parsed = JSON.parse(jsonText);
      
      if (!parsed.paths) {
        throw new Error('Invalid Swagger/OpenAPI format: missing paths object');
      }

      const apis = [];
      Object.entries(parsed.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, details]) => {
          const api = {
            id: Date.now() + apis.length,
            name: details.summary || details.operationId || `${method.toUpperCase()} ${path}`,
            description: details.description || '',
            path: path,
            method: method.toUpperCase(),
            category: details.tags ? details.tags[0] : '未分类',
            version: parsed.info?.version || '1.0.0',
            parameters: details.parameters || [],
            createdAt: new Date().toISOString(),
          };
          apis.push(api);
        });
      });

      return apis;
    } catch (err) {
      throw new Error(`解析JSON失败: ${err.message}`);
    }
  };

  const handleImport = () => {
    if (tabValue === 0) {
      // 表单导入验证
      if (!formData.name || !formData.path) {
        setNotification({
          open: true,
          message: 'API名称和路径是必填项',
          severity: 'error',
        });
        return;
      }

      // 构建完整的API数据
      const newApi = {
        ...formData,
        id: Date.now(),
        requestBody: requestData.body,
        responseBody: responseData.body,
        parameters: requestData.parameters,
        createdAt: new Date().toISOString(),
      };

      // 保存API
      const apis = JSON.parse(localStorage.getItem('apis') || '[]');
      localStorage.setItem('apis', JSON.stringify([...apis, newApi]));
      
      setNotification({
        open: true,
        message: 'API已成功导入',
        severity: 'success',
      });

      // 重置表单
      resetForm();
      onImportSuccess && onImportSuccess();
    } else {
      // JSON导入
      try {
        const apis = parseSwaggerJson(jsonData);
        
        // 保存所有提取的API
        const existingApis = JSON.parse(localStorage.getItem('apis') || '[]');
        const updatedApis = [...existingApis, ...apis];
        localStorage.setItem('apis', JSON.stringify(updatedApis));

        setNotification({
          open: true,
          message: `成功导入 ${apis.length} 个API`,
          severity: 'success',
        });

        setJsonData('');
        onImportSuccess && onImportSuccess();
      } catch (err) {
        setError(err.message);
        setNotification({
          open: true,
          message: err.message,
          severity: 'error',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      path: '',
      method: 'GET',
      category: '',
      version: '1.0.0',
    });
    setRequestData({
      parameters: [],
      body: {}
    });
    setResponseData({
      body: {}
    });
    setEditorState(EditorState.createEmpty());
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      className={classes.root}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">导入 API 文档</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'table'}
                onChange={(e) => setViewMode(e.target.checked ? 'table' : 'json')}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center">
                <TableChartIcon style={{ marginRight: 4 }} />
                <Typography variant="body2">
                  表格视图
                </Typography>
              </Box>
            }
            className={classes.viewModeSwitch}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent dividers className={classes.dialogContent}>
        <Paper square>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<FormIcon />} label="详细表单导入" {...a11yProps(0)} />
            <Tab icon={<CodeIcon />} label="Swagger JSON导入" {...a11yProps(1)} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0} className={classes.tabContent}>
          <Grid container spacing={3}>
            {/* 基本信息 */}
            <Grid item xs={12}>
              <Paper className={classes.formSection}>
                <Typography variant="h6" className={classes.sectionTitle}>基本信息</Typography>
                
                <Grid container spacing={2}>
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
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>HTTP 方法</InputLabel>
                      <Select
                        name="method"
                        value={formData.method}
                        onChange={handleFormChange}
                      >
                        {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map(method => (
                          <MenuItem key={method} value={method}>{method}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="版本"
                      name="version"
                      value={formData.version}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="API 路径"
                      name="path"
                      value={formData.path}
                      onChange={handleFormChange}
                      placeholder="/api/v1/users/{id}"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="分类"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>API 描述</Typography>
                    <Paper variant="outlined" style={{ padding: '2px', minHeight: '200px' }}>
                      <ThemeProvider theme={defaultTheme}>
                        <MUIRichTextEditor
                          label="输入API详细描述..."
                          onChange={handleEditorChange}
                          inlineToolbar={true}
                          controls={[
                            'title', 'bold', 'italic', 'underline', 'strikethrough', 
                            'highlight', 'undo', 'redo', 'link', 'numberList', 
                            'bulletList', 'quote', 'code', 'clear'
                          ]}
                        />
                      </ThemeProvider>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 请求信息 */}
            <Grid item xs={12}>
              <Paper className={classes.formSection}>
                <Typography variant="h6" className={classes.sectionTitle}>请求信息</Typography>
                
                {/* 请求参数 */}
                <ParameterEditor
                  parameters={requestData.parameters}
                  onChange={(parameters) => setRequestData({ ...requestData, parameters })}
                />

                {/* 请求体 */}
                <Box mt={2}>
                  {viewMode === 'table' ? (
                    <JsonStructureTable
                      data={requestData.body}
                      title="请求体 (Request Body)"
                      onDataChange={(body) => setRequestData({ ...requestData, body })}
                      editable={true}
                    />
                  ) : (
                    <Paper variant="outlined">
                      <Box p={2} bgcolor="#f5f5f5">
                        <Typography variant="h6">请求体 (Request Body)</Typography>
                      </Box>
                      <Box p={2}>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          variant="outlined"
                          value={JSON.stringify(requestData.body, null, 2)}
                          onChange={(e) => {
                            try {
                              const body = JSON.parse(e.target.value);
                              setRequestData({ ...requestData, body });
                            } catch (err) {
                              // 允许输入无效JSON，稍后验证
                            }
                          }}
                          placeholder='{ "key": "value" }'
                        />
                      </Box>
                    </Paper>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* 响应信息 */}
            <Grid item xs={12}>
              <Paper className={classes.formSection}>
                <Typography variant="h6" className={classes.sectionTitle}>响应信息</Typography>

                {/* 响应体 */}
                <Box mt={2}>
                  {viewMode === 'table' ? (
                    <JsonStructureTable
                      data={responseData.body}
                      title="响应体 (Response Body)"
                      onDataChange={(body) => setResponseData({ ...responseData, body })}
                      editable={true}
                    />
                  ) : (
                    <Paper variant="outlined">
                      <Box p={2} bgcolor="#f5f5f5">
                        <Typography variant="h6">响应体 (Response Body)</Typography>
                      </Box>
                      <Box p={2}>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          variant="outlined"
                          value={JSON.stringify(responseData.body, null, 2)}
                          onChange={(e) => {
                            try {
                              const body = JSON.parse(e.target.value);
                              setResponseData({ ...responseData, body });
                            } catch (err) {
                              // 允许输入无效JSON，稍后验证
                            }
                          }}
                          placeholder='{ "success": true, "data": {} }'
                        />
                      </Box>
                    </Paper>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1} className={classes.tabContent}>
          <TextField
            fullWidth
            label="Swagger/OpenAPI JSON"
            multiline
            variant="outlined"
            value={jsonData}
            onChange={handleJsonChange}
            error={!!error}
            helperText={error}
            className={classes.swaggerTextArea}
            placeholder={`{
  "swagger": "2.0",
  "info": { "title": "API Documentation", "version": "1.0.0" },
  "paths": {
    "/api/users": {
      "get": {
        "summary": "获取用户列表",
        "description": "返回用户列表",
        "responses": { "200": { "description": "Success" } }
      }
    }
  }
}`}
            InputProps={{
              style: { 
                minHeight: '400px',
                alignItems: 'flex-start'
              }
            }}
          />
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
            请输入有效的Swagger/OpenAPI JSON格式数据。支持自动解析参数、请求体、响应体等信息。
          </Typography>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="default">
          取消
        </Button>
        <Button onClick={resetForm} color="default" variant="outlined">
          重置
        </Button>
        <Button 
          onClick={handleImport} 
          color="primary" 
          variant="contained"
          startIcon={<UploadIcon />}
        >
          导入API
        </Button>
      </DialogActions>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
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