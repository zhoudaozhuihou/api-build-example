import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowBack, ArrowForward, Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import CategoryCascader from './CategoryCascader';
import { apiCategories } from '../constants/apiCategories';
import { convertJoinDataToApiBuilder } from '../utils/apiBuilderAdapter';
import apiBuilderService from '../services/ApiBuilderService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  parameterContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  sectionDivider: {
    margin: theme.spacing(3, 0),
  },
  sectionTitle: {
    margin: theme.spacing(2, 0, 1, 0),
  },
  categorySection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  sqlPreview: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  lineageSection: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

// 模拟数据
const mockTables = [
  { id: 1, name: 'users', description: '用户信息表', columns: [
    { id: 1, name: 'id', type: 'INT', description: '主键ID' },
    { id: 2, name: 'name', type: 'VARCHAR', description: '用户名称' },
    { id: 3, name: 'email', type: 'VARCHAR', description: '用户邮箱' },
    { id: 4, name: 'created_at', type: 'DATETIME', description: '创建时间' },
  ]},
  { id: 2, name: 'products', description: '产品信息表', columns: [
    { id: 1, name: 'id', type: 'INT', description: '主键ID' },
    { id: 2, name: 'name', type: 'VARCHAR', description: '产品名称' },
    { id: 3, name: 'price', type: 'DECIMAL', description: '产品价格' },
    { id: 4, name: 'category_id', type: 'INT', description: '分类ID' },
  ]},
  { id: 3, name: 'orders', description: '订单信息表', columns: [
    { id: 1, name: 'id', type: 'INT', description: '主键ID' },
    { id: 2, name: 'user_id', type: 'INT', description: '用户ID' },
    { id: 3, name: 'product_id', type: 'INT', description: '产品ID' },
    { id: 4, name: 'quantity', type: 'INT', description: '数量' },
    { id: 5, name: 'total', type: 'DECIMAL', description: '总金额' },
    { id: 6, name: 'created_at', type: 'DATETIME', description: '创建时间' },
  ]},
  { id: 4, name: 'categories', description: '产品分类表', columns: [
    { id: 1, name: 'id', type: 'INT', description: '主键ID' },
    { id: 2, name: 'name', type: 'VARCHAR', description: '分类名称' },
    { id: 3, name: 'parent_id', type: 'INT', description: '父级分类ID' },
  ]},
];

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
const parameterTypes = ['string', 'number', 'boolean', 'date'];

function ApiBuilder({ onNext, onBack, tableDatasetBinding }) {
  const classes = useStyles();
  const [apiConfig, setApiConfig] = useState({
    name: '',
    method: 'GET',
    path: '',
    description: '',
    selectedColumns: [],
    parameters: [],
    categories: [],
    upstreamSystems: [],
    selectedTable: null,
    boundDataset: null,
    sourceConnection: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [joinMode, setJoinMode] = useState(false);
  const [joinData, setJoinData] = useState(null);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [upstreamInput, setUpstreamInput] = useState({ name: '', description: '' });

  // 初始化时检查是否有JOIN模式的数据或Table-Dataset绑定数据
  useEffect(() => {
    // 优先检查新的Table-Dataset绑定数据
    if (tableDatasetBinding) {
      console.log('使用Table-Dataset绑定数据:', tableDatasetBinding);
      setApiConfig(prev => ({
        ...prev,
        selectedTable: tableDatasetBinding.table,
        boundDataset: tableDatasetBinding.dataset,
        sourceConnection: tableDatasetBinding.connection,
        name: `${tableDatasetBinding.table.name}_api`,
        description: `基于数据集 ${tableDatasetBinding.dataset.name} 的API`,
      }));

      // 根据表结构生成可用列
      if (tableDatasetBinding.table.columns) {
        const tableColumns = tableDatasetBinding.table.columns.map(col => ({
          id: `${tableDatasetBinding.table.id}_${col.id}`,
          name: `${tableDatasetBinding.table.name}.${col.name}`,
          tableId: tableDatasetBinding.table.id,
          columnId: col.id,
          tableName: tableDatasetBinding.table.name,
          columnName: col.name,
          type: col.type,
          description: col.description
        }));
        setAvailableColumns(tableColumns);
      }
      return;
    }

    // 检查JOIN模式数据（兼容旧流程）
    const storedJoinData = localStorage.getItem('joinTablesData');
    if (storedJoinData) {
      try {
        const parsedData = JSON.parse(storedJoinData);
        setJoinData(parsedData);
        setJoinMode(true);
        
        // 如果是JOIN模式，收集所有可用列
        if (parsedData.selectedTables && parsedData.selectedTables.length > 0) {
          const allColumns = [];
          parsedData.selectedTables.forEach(table => {
            const tableColumns = table.columns.map(col => ({
              id: `${table.id}_${col.id}`,
              name: `${table.name}.${col.name}`,
              tableId: table.id,
              columnId: col.id,
              tableName: table.name,
              columnName: col.name,
              type: col.type,
              description: col.description
            }));
            allColumns.push(...tableColumns);
          });
          setAvailableColumns(allColumns);
        }
      } catch (e) {
        console.error('解析JOIN数据失败', e);
      }
    } else {
      // 单表模式（兼容旧流程）
      const selectedTable = JSON.parse(localStorage.getItem('selectedTable'));
      if (selectedTable) {
        const tableData = mockTables.find(t => t.id === selectedTable.id);
        if (tableData) {
          const tableColumns = tableData.columns.map(col => ({
            id: `${tableData.id}_${col.id}`,
            name: `${tableData.name}.${col.name}`,
            tableId: tableData.id,
            columnId: col.id,
            tableName: tableData.name,
            columnName: col.name,
            type: col.type,
            description: col.description
          }));
          setAvailableColumns(tableColumns);
        }
      }
    }
  }, [tableDatasetBinding]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColumnChange = (columnId) => {
    setApiConfig((prev) => {
      const selectedColumns = prev.selectedColumns.includes(columnId)
        ? prev.selectedColumns.filter((id) => id !== columnId)
        : [...prev.selectedColumns, columnId];
      return { ...prev, selectedColumns };
    });
  };

  const handleAddParameter = () => {
    setApiConfig((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        { name: '', type: 'string', required: false, description: '' },
      ],
    }));
  };

  const handleParameterChange = (index, field, value) => {
    setApiConfig((prev) => {
      const newParameters = [...prev.parameters];
      newParameters[index] = {
        ...newParameters[index],
        [field]: value,
      };
      return { ...prev, parameters: newParameters };
    });
  };

  const handleRemoveParameter = (index) => {
    setApiConfig((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (categories) => {
    // 确保categories是数组
    if (!Array.isArray(categories)) {
      console.error('Categories should be an array', categories);
      return;
    }
    
    // 提取最顶层分类值
    let mainCategory = '';
    if (categories.length > 0) {
      // 假设value格式为 "1-2-3"，我们提取最顶级的数字作为主分类
      const valueSegments = categories[0].value.split('-');
      mainCategory = valueSegments[0];
    }
    
    console.log('Categories selected:', categories);
    
    setApiConfig((prev) => ({
      ...prev,
      category: mainCategory,
      categories: categories,
    }));
  };

  const handleAddUpstream = () => {
    if (upstreamInput.name.trim()) {
      setApiConfig((prev) => ({
        ...prev,
        upstreamSystems: [
          ...prev.upstreamSystems,
          { ...upstreamInput, id: Date.now() }
        ],
      }));
      setUpstreamInput({ name: '', description: '' });
    }
  };

  const handleRemoveUpstream = (id) => {
    setApiConfig((prev) => ({
      ...prev,
      upstreamSystems: prev.upstreamSystems.filter(system => system.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (!apiConfig.name) {
      setNotification({
        open: true,
        message: '请输入 API 名称',
        severity: 'error',
      });
      return;
    }

    if (!apiConfig.path) {
      setNotification({
        open: true,
        message: '请输入 API 路径',
        severity: 'error',
      });
      return;
    }

    if (apiConfig.selectedColumns.length === 0) {
      setNotification({
        open: true,
        message: '请至少选择一个字段',
        severity: 'error',
      });
      return;
    }

    let sqlQuery = '';
    let tableInfo = {};

    try {
      if (joinMode && joinData) {
        // 多表模式 - 使用适配器转换连接数据
        const apiBuilder = convertJoinDataToApiBuilder(
          apiConfig.name,
          apiConfig.description,
          joinData,
          apiConfig.selectedColumns
        );
        
        // 验证API配置
        const validation = apiBuilder.validateConfig();
        if (!validation.isValid) {
          setNotification({
            open: true,
            message: `API配置无效: ${validation.errors.join(', ')}`,
            severity: 'error',
          });
          return;
        }

        // 生成SQL查询
        sqlQuery = apiBuilder.generateSql();
        
        // 表信息
        tableInfo = {
          joinMode: true,
          tables: joinData.selectedTables.map(t => t.name).join(', '),
          joinData: joinData,
          apiBuilderConfig: apiBuilder.apiConfig
        };
      } else {
        // 单表模式
        const selectedTable = JSON.parse(localStorage.getItem('selectedTable')) || { name: 'default_table' };
        
        // 初始化API构建器
        apiBuilderService.initApiConfig(
          apiConfig.name,
          'query',
          apiConfig.description,
          selectedTable.name
        );
        
        // 准备字段列表
        const fields = apiConfig.selectedColumns
          .map(id => {
            const column = availableColumns.find(col => col.id === id);
            if (!column) return null;
            
            return {
              table: column.tableName || selectedTable.name,
              name: column.columnName,
              alias: column.alias || null,
              type: column.type || 'string'
            };
          })
          .filter(Boolean);
        
        // 添加字段到API配置
        apiBuilderService.addFields(fields);
        
        // 生成SQL查询
        sqlQuery = apiBuilderService.generateSql();
        
        // 表信息
        tableInfo = {
          joinMode: false,
          table: selectedTable.name,
          apiBuilderConfig: apiBuilderService.apiConfig
        };
      }

      const apiData = {
        ...apiConfig,
        ...tableInfo,
        sqlQuery,
        createdAt: new Date().toISOString(),
      };

      const existingApis = JSON.parse(localStorage.getItem('apis') || '[]');
      localStorage.setItem('apis', JSON.stringify([...existingApis, apiData]));

      // 保存API血缘关系数据
      if (apiConfig.upstreamSystems && apiConfig.upstreamSystems.length > 0) {
        const lineageData = {
          upstream: apiConfig.upstreamSystems,
          downstream: [],
          users: [],
        };
        localStorage.setItem(`apiLineage_${apiData.id}`, JSON.stringify(lineageData));
      }

      setNotification({
        open: true,
        message: 'API 创建成功！',
        severity: 'success',
      });

      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error) {
      console.error('API创建失败:', error);
      setNotification({
        open: true,
        message: `API创建失败: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        构建 API
      </Typography>

      <div className={classes.form}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="API 名称"
              name="name"
              value={apiConfig.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>HTTP 方法</InputLabel>
              <Select
                name="method"
                value={apiConfig.method}
                onChange={handleChange}
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
              fullWidth
              label="API 路径"
              name="path"
              value={apiConfig.path}
              onChange={handleChange}
              placeholder="/api/v1/resource"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="API 描述"
              name="description"
              value={apiConfig.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        {joinMode && joinData && (
          <div className={classes.tableContainer}>
            <Typography variant="h6" className={classes.sectionTitle}>
              表连接设置
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>主表</TableCell>
                    <TableCell>连接类型</TableCell>
                    <TableCell>连接表</TableCell>
                    <TableCell>连接条件</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {joinData.joins.map((join, index) => {
                    const mainTable = joinData.selectedTables.find(t => t.id === join.mainTableId);
                    const joinTable = joinData.selectedTables.find(t => t.id === join.joinTableId);
                    const mainColumn = mainTable?.columns.find(c => c.id === join.mainTableColumn);
                    const joinColumn = joinTable?.columns.find(c => c.id === join.joinTableColumn);
                    
                    return (
                      <TableRow key={join.id}>
                        <TableCell>{mainTable?.name || '-'}</TableCell>
                        <TableCell>{join.joinType}</TableCell>
                        <TableCell>{joinTable?.name || '-'}</TableCell>
                        <TableCell>
                          {mainTable?.name}.{mainColumn?.name} = {joinTable?.name}.{joinColumn?.name}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="subtitle2" style={{ marginTop: '8px' }}>
              SQL预览:
            </Typography>
            <pre className={classes.sqlPreview}>
              {joinData.sqlPreview}
            </pre>
          </div>
        )}

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" className={classes.sectionTitle}>
          字段选择
        </Typography>
        <FormGroup>
          <Grid container spacing={2}>
            {availableColumns.map((column) => (
              <Grid item xs={12} sm={6} md={4} key={column.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={apiConfig.selectedColumns.includes(column.id)}
                      onChange={() => handleColumnChange(column.id)}
                      color="primary"
                    />
                  }
                  label={
                    <div>
                      <Typography variant="body2">{column.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {column.type} - {column.description}
                      </Typography>
                    </div>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" className={classes.sectionTitle}>
          请求参数
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddParameter}
            style={{ marginLeft: 16 }}
          >
            添加参数
          </Button>
        </Typography>

        {apiConfig.parameters.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            未设置请求参数
          </Typography>
        ) : (
          apiConfig.parameters.map((param, index) => (
            <div key={index} className={classes.parameterContainer}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="参数名称"
                    value={param.name}
                    onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>参数类型</InputLabel>
                    <Select
                      value={param.type}
                      onChange={(e) => handleParameterChange(index, 'type', e.target.value)}
                    >
                      {parameterTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.required}
                        onChange={(e) => handleParameterChange(index, 'required', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="必填"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="参数描述"
                    value={param.description}
                    onChange={(e) => handleParameterChange(index, 'description', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleRemoveParameter(index)}
                  >
                    移除
                  </Button>
                </Grid>
              </Grid>
            </div>
          ))
        )}

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" className={classes.sectionTitle}>
          API 血缘关系
        </Typography>
        <div className={classes.lineageSection}>
          <Typography variant="subtitle1" gutterBottom>
            上游系统/API
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddUpstream}
              style={{ marginLeft: 16 }}
            >
              添加上游系统
            </Button>
          </Typography>

          {apiConfig.upstreamSystems.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              未设置上游依赖
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined" style={{ marginTop: 16, marginBottom: 16 }}>
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
          )}

          <Grid container spacing={2} style={{ marginTop: 8 }}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                label="上游系统名称"
                value={upstreamInput.name}
                onChange={(e) => setUpstreamInput({ ...upstreamInput, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                size="small"
                label="描述"
                value={upstreamInput.description}
                onChange={(e) => setUpstreamInput({ ...upstreamInput, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </div>

        <Divider className={classes.sectionDivider} />

        <div className={classes.categorySection}>
          <Typography variant="h6" gutterBottom>
            API 分类
          </Typography>
          <CategoryCascader
            options={apiCategories}
            onChange={handleCategoryChange}
            multiple
          />
          <div className={classes.chips}>
            {apiConfig.categories.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                className={classes.chip}
                color="primary"
                variant="outlined"
              />
            ))}
          </div>
        </div>

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
            endIcon={<ArrowForward />}
            onClick={handleSubmit}
          >
            创建 API
          </Button>
        </div>
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

export default ApiBuilder; 