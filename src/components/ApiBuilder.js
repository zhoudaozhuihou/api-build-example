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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowBack, ArrowForward, Add as AddIcon } from '@material-ui/icons';
import CategoryCascader from './CategoryCascader';
import { apiCategories } from '../constants/apiCategories';

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
  }
}));

// 模拟数据
const mockColumns = [
  { id: 1, name: 'id', type: 'INT', description: '主键ID' },
  { id: 2, name: 'name', type: 'VARCHAR', description: '名称' },
  { id: 3, name: 'created_at', type: 'DATETIME', description: '创建时间' },
  { id: 4, name: 'updated_at', type: 'DATETIME', description: '更新时间' },
];

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
const parameterTypes = ['string', 'number', 'boolean', 'date'];

function ApiBuilder({ onNext, onBack }) {
  const classes = useStyles();
  const [apiConfig, setApiConfig] = useState({
    name: '',
    method: 'GET',
    path: '',
    description: '',
    selectedColumns: [],
    parameters: [],
    categories: [],
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColumnChange = (column) => {
    setApiConfig((prev) => {
      const selectedColumns = prev.selectedColumns.includes(column.id)
        ? prev.selectedColumns.filter((id) => id !== column.id)
        : [...prev.selectedColumns, column.id];
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

    const selectedTable = JSON.parse(localStorage.getItem('selectedTable')) || { name: 'default_table' };
    const selectedColumnNames = apiConfig.selectedColumns
      .map((id) => mockColumns.find((col) => col.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    const sqlQuery = `SELECT ${selectedColumnNames} FROM ${selectedTable.name}`;

    const apiData = {
      ...apiConfig,
      table: selectedTable.name,
      sqlQuery,
      createdAt: new Date().toISOString(),
    };

    const existingApis = JSON.parse(localStorage.getItem('apis') || '[]');
    localStorage.setItem('apis', JSON.stringify([...existingApis, apiData]));

    setNotification({
      open: true,
      message: 'API 创建成功！',
      severity: 'success',
    });

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
              placeholder="/api/resource"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="描述"
              name="description"
              value={apiConfig.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
        
        <div className={classes.categorySection}>
          <CategoryCascader 
            value={apiConfig.categories} 
            onChange={handleCategoryChange}
            title="API 分类"
            placeholder="请选择 API 分类" 
            categoriesData={apiCategories}
          />
        </div>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" className={classes.sectionTitle}>
          选择表格字段
        </Typography>

        <FormGroup>
          {mockColumns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={apiConfig.selectedColumns.includes(column.id)}
                  onChange={() => handleColumnChange(column)}
                />
              }
              label={`${column.name} (${column.type}) - ${column.description}`}
            />
          ))}
        </FormGroup>

        <Divider className={classes.sectionDivider} />

        <Typography variant="h6" className={classes.sectionTitle}>
          参数设置
        </Typography>

        {apiConfig.parameters.map((param, index) => (
          <div key={index} className={classes.parameterContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="参数名"
                  value={param.name}
                  onChange={(e) =>
                    handleParameterChange(index, 'name', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>类型</InputLabel>
                  <Select
                    value={param.type}
                    onChange={(e) =>
                      handleParameterChange(index, 'type', e.target.value)
                    }
                  >
                    {parameterTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={param.required}
                      onChange={(e) =>
                        handleParameterChange(
                          index,
                          'required',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="必填"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveParameter(index)}
                  fullWidth
                >
                  删除
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="描述"
                  value={param.description}
                  onChange={(e) =>
                    handleParameterChange(index, 'description', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </div>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddParameter}
          variant="outlined"
          style={{ marginTop: '1rem' }}
        >
          添加参数
        </Button>

        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={onBack}
            startIcon={<ArrowBack />}
          >
            返回
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            endIcon={<ArrowForward />}
          >
            创建 API
          </Button>
        </div>
      </div>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ApiBuilder; 