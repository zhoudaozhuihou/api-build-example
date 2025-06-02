import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Button,
  TextField,
  Snackbar,
  Grid,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  ArrowBack, 
  ArrowForward, 
  Code as CodeIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  sqlEditor: {
    width: '100%',
    fontFamily: 'monospace',
    marginBottom: theme.spacing(3),
  },
  sqlPreviewSection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  sqlPreview: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    borderRadius: theme.shape.borderRadius,
  },
  hintCard: {
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  paramSection: {
    marginBottom: theme.spacing(3),
  },
  paramTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  paramChip: {
    margin: theme.spacing(0.5),
  },
  sectionDivider: {
    margin: theme.spacing(3, 0),
  },
  validationSection: {
    marginTop: theme.spacing(2),
  },
  validationSuccess: {
    backgroundColor: theme.palette.success.light,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  validationError: {
    backgroundColor: theme.palette.error.light,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  validationPending: {
    backgroundColor: theme.palette.warning.light,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
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
];

function SqlEditor({ onNext, onBack, apiConfig, updateApiConfig }) {
  const classes = useStyles();
  const [sql, setSql] = useState('');
  const [originalSql, setOriginalSql] = useState('');
  const [inputParams, setInputParams] = useState([]);
  const [outputParams, setOutputParams] = useState([]);
  const [validation, setValidation] = useState({
    status: 'pending',
    message: '修改SQL后需重新验证',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // 初始化
  useEffect(() => {
    if (apiConfig.sql) {
      setSql(apiConfig.sql);
      setOriginalSql(apiConfig.sql);
      
      // 加载参数信息
      const inputParameters = apiConfig.inputParameters || [];
      const outputParameters = apiConfig.outputParameters || [];
      
      // 获取参数详细信息
      const getColumnDetails = (param) => {
        // 检查 param 是否已经是对象格式
        if (typeof param === 'object' && param.name) {
          // 新的参数对象结构，直接返回
          return {
            id: param.id,
            name: param.name,
            type: param.type,
            description: param.description || '',
          };
        } else if (typeof param === 'string' && param.includes('_')) {
          // 旧的字符串ID结构
          try {
            const [tableId, colId] = param.split('_');
            const table = mockTables.find(t => t.id.toString() === tableId);
            if (table) {
              const column = table.columns.find(c => c.id.toString() === colId);
              if (column) {
                return {
                  id: param,
                  name: `${table.name}.${column.name}`,
                  type: column.type,
                  description: column.description,
                };
              }
            }
          } catch (error) {
            console.warn('无法解析参数ID:', param);
          }
        }
        
        // 后备处理：无法解析的情况
        const paramName = param?.name || param?.id || param || `unknown_param_${Math.random().toString(36).substr(2, 9)}`;
        return { 
          id: param?.id || paramName, 
          name: paramName, 
          type: param?.type || 'UNKNOWN', 
          description: param?.description || '未知字段' 
        };
      };
      
      setInputParams(inputParameters.map(getColumnDetails));
      setOutputParams(outputParameters.map(getColumnDetails));
      
      // 初始SQL验证
      validateSql(apiConfig.sql);
    }
  }, [apiConfig]);
  
  // SQL验证函数
  const validateSql = (sqlQuery) => {
    // 这里只是简单模拟验证
    // 实际应用中应该发送到后端服务进行验证
    
    try {
      if (!sqlQuery.trim()) {
        setValidation({
          status: 'error',
          message: 'SQL语句不能为空',
        });
        return false;
      }
      
      // 检查基本语法
      const sqlLower = sqlQuery.toLowerCase();
      if (!sqlLower.includes('select')) {
        setValidation({
          status: 'error',
          message: 'SQL必须包含SELECT语句',
        });
        return false;
      }
      
      if (!sqlLower.includes('from')) {
        setValidation({
          status: 'error',
          message: 'SQL必须包含FROM子句',
        });
        return false;
      }
      
      // 检查选择的输出参数是否在SQL中
      const missingOutputParams = outputParams.filter(param => {
        const columnName = param.name.split('.')[1];
        return !sqlLower.includes(columnName.toLowerCase());
      });
      
      if (missingOutputParams.length > 0) {
        setValidation({
          status: 'warning',
          message: `SQL中可能缺少以下输出字段: ${missingOutputParams.map(p => p.name).join(', ')}`,
        });
        return true; // 允许继续但显示警告
      }
      
      // 检查是否使用了请求参数
      const hasInputParams = inputParams.length > 0;
      const hasWhere = sqlLower.includes('where');
      
      if (hasInputParams && !hasWhere) {
        setValidation({
          status: 'warning',
          message: '你有输入参数但SQL中没有WHERE子句',
        });
        return true;
      }
      
      setValidation({
        status: 'success',
        message: 'SQL验证通过',
      });
      return true;
    } catch (error) {
      setValidation({
        status: 'error',
        message: `SQL验证错误: ${error.message}`,
      });
      return false;
    }
  };
  
  // 重置为原始SQL
  const handleResetSql = () => {
    setSql(originalSql);
    validateSql(originalSql);
  };
  
  // 处理SQL变更
  const handleSqlChange = (e) => {
    const newSql = e.target.value;
    setSql(newSql);
    setValidation({
      status: 'pending',
      message: '修改SQL后需重新验证',
    });
  };
  
  // 验证当前SQL
  const handleValidateSql = () => {
    const isValid = validateSql(sql);
    if (isValid) {
      setNotification({
        open: true,
        message: '验证通过，可以继续',
        severity: 'success',
      });
    } else {
      setNotification({
        open: true,
        message: validation.message,
        severity: 'error',
      });
    }
  };
  
  // 下一步
  const handleNext = () => {
    if (validation.status === 'error') {
      setNotification({
        open: true,
        message: '请先修复SQL错误后再继续',
        severity: 'error',
      });
      return;
    }
    
    // 更新API配置
    updateApiConfig({
      sql: sql
    });
    
    onNext();
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };
  
  const renderValidationStatus = () => {
    if (validation.status === 'success') {
      return (
        <div className={classes.validationSuccess}>
          <Typography variant="body1">✅ {validation.message}</Typography>
        </div>
      );
    } else if (validation.status === 'error') {
      return (
        <div className={classes.validationError}>
          <Typography variant="body1">❌ {validation.message}</Typography>
        </div>
      );
    } else if (validation.status === 'warning') {
      return (
        <div className={classes.validationPending}>
          <Typography variant="body1">⚠️ {validation.message}</Typography>
        </div>
      );
    } else {
      return (
        <div className={classes.validationPending}>
          <Typography variant="body1">⏳ {validation.message}</Typography>
        </div>
      );
    }
  };
  
  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        <CodeIcon className={classes.titleIcon} />
        SQL 编辑
      </Typography>
      
      <Card className={classes.hintCard}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <InfoIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 8 }} />
            这里是根据你选择的参数生成的SQL查询。你可以根据需要进行修改，确保SQL语法正确并包含所有必要的字段。
          </Typography>
        </CardContent>
      </Card>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} className={classes.paramSection}>
          <div className={classes.paramTitle}>
            <Typography variant="subtitle1">输入参数</Typography>
            <Tooltip title="这些是用户将提供值的字段，通常用在WHERE子句中">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            {inputParams.length > 0 ? (
              inputParams.map((param) => (
                <Tooltip 
                  key={param.id} 
                  title={`${param.type} - ${param.description}`}
                >
                  <Chip 
                    label={param.name} 
                    color="primary" 
                    variant="outlined" 
                    className={classes.paramChip} 
                  />
                </Tooltip>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                没有选择输入参数
              </Typography>
            )}
          </div>
        </Grid>
        
        <Grid item xs={12} md={6} className={classes.paramSection}>
          <div className={classes.paramTitle}>
            <Typography variant="subtitle1">输出参数</Typography>
            <Tooltip title="这些是API将返回的字段，应出现在SELECT子句中">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            {outputParams.length > 0 ? (
              outputParams.map((param) => (
                <Tooltip 
                  key={param.id} 
                  title={`${param.type} - ${param.description}`}
                >
                  <Chip 
                    label={param.name} 
                    color="secondary" 
                    variant="outlined" 
                    className={classes.paramChip} 
                  />
                </Tooltip>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                没有选择输出参数
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
      
      <Divider className={classes.sectionDivider} />
      
      <div className={classes.sqlPreviewSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Typography variant="subtitle1">SQL 语句</Typography>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<RefreshIcon />} 
            onClick={handleResetSql}
          >
            重置为原始SQL
          </Button>
        </div>
        
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={sql}
          onChange={handleSqlChange}
          className={classes.sqlEditor}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleValidateSql}
        >
          验证SQL
        </Button>
        
        <div className={classes.validationSection}>
          {renderValidationStatus()}
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
          onClick={handleNext}
          disabled={validation.status === 'error'}
        >
          下一步
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

export default SqlEditor; 