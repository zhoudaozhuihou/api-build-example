import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Divider,
  Snackbar,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  headerCell: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  filterField: {
    marginBottom: theme.spacing(2),
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  parameterColumn: {
    width: 120,
    textAlign: 'center',
  },
  optionsColumn: {
    width: 150,
  },
  parameterDetails: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  sectionDivider: {
    margin: theme.spacing(3, 0),
  },
  sectionTitle: {
    margin: theme.spacing(2, 0, 1, 0),
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

function ParameterSelection({ onNext, onBack, apiConfig, updateApiConfig }) {
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // 初始化时获取列数据
  useEffect(() => {
    let availableColumns = [];
    const joinMode = apiConfig.joinMode;
    
    if (joinMode && apiConfig.joinData) {
      // 多表模式，收集所有选定表的列
      apiConfig.joinData.selectedTables.forEach(table => {
        const tableData = mockTables.find(t => t.id === table.id);
        if (tableData) {
          const tableColumns = tableData.columns.map(col => ({
            id: `${tableData.id}_${col.id}`,
            name: `${tableData.name}.${col.name}`,
            tableId: tableData.id,
            columnId: col.id,
            tableName: tableData.name,
            columnName: col.name,
            type: col.type,
            description: col.description,
            isInput: apiConfig.inputParameters?.includes(`${tableData.id}_${col.id}`) || false,
            isOutput: apiConfig.outputParameters?.includes(`${tableData.id}_${col.id}`) || false,
          }));
          availableColumns.push(...tableColumns);
        }
      });
    } else if (apiConfig.selectedTable) {
      // 单表模式
      const tableData = mockTables.find(t => t.id === apiConfig.selectedTable.id);
      if (tableData) {
        availableColumns = tableData.columns.map(col => ({
          id: `${tableData.id}_${col.id}`,
          name: `${tableData.name}.${col.name}`,
          tableId: tableData.id,
          columnId: col.id,
          tableName: tableData.name,
          columnName: col.name,
          type: col.type,
          description: col.description,
          isInput: apiConfig.inputParameters?.includes(`${tableData.id}_${col.id}`) || false,
          isOutput: apiConfig.outputParameters?.includes(`${tableData.id}_${col.id}`) || false,
        }));
      }
    } else {
      // 从localStorage获取选定的表
      const selectedTable = JSON.parse(localStorage.getItem('selectedTable'));
      if (selectedTable) {
        const tableData = mockTables.find(t => t.id === selectedTable.id);
        if (tableData) {
          availableColumns = tableData.columns.map(col => ({
            id: `${tableData.id}_${col.id}`,
            name: `${tableData.name}.${col.name}`,
            tableId: tableData.id,
            columnId: col.id,
            tableName: tableData.name,
            columnName: col.name,
            type: col.type,
            description: col.description,
            isInput: apiConfig.inputParameters?.includes(`${tableData.id}_${col.id}`) || false,
            isOutput: apiConfig.outputParameters?.includes(`${tableData.id}_${col.id}`) || false,
          }));
        }
      }
    }
    
    setColumns(availableColumns);
  }, [apiConfig]);

  // 过滤列
  const filteredColumns = columns.filter(column => {
    if (showSelectedOnly) {
      return (column.isInput || column.isOutput) && 
             column.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return column.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 处理输入参数切换
  const handleInputToggle = (columnId) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId ? { ...col, isInput: !col.isInput } : col
      )
    );
  };

  // 处理输出参数切换
  const handleOutputToggle = (columnId) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId ? { ...col, isOutput: !col.isOutput } : col
      )
    );
  };

  // 处理选择所有输入参数
  const handleSelectAllInputs = () => {
    setColumns(prevColumns => 
      prevColumns.map(col => ({ ...col, isInput: true }))
    );
  };

  // 处理选择所有输出参数
  const handleSelectAllOutputs = () => {
    setColumns(prevColumns => 
      prevColumns.map(col => ({ ...col, isOutput: true }))
    );
  };

  // 处理取消选择所有输入参数
  const handleClearAllInputs = () => {
    setColumns(prevColumns => 
      prevColumns.map(col => ({ ...col, isInput: false }))
    );
  };

  // 处理取消选择所有输出参数
  const handleClearAllOutputs = () => {
    setColumns(prevColumns => 
      prevColumns.map(col => ({ ...col, isOutput: false }))
    );
  };

  // 下一步
  const handleNext = () => {
    // 收集所有选定的输入和输出参数
    const inputParams = columns.filter(col => col.isInput).map(col => col.id);
    const outputParams = columns.filter(col => col.isOutput).map(col => col.id);
    
    // 检查是否至少选择了一个输出参数
    if (outputParams.length === 0) {
      setNotification({
        open: true,
        message: '请至少选择一个输出参数',
        severity: 'error',
      });
      return;
    }
    
    // 生成初步的SQL
    let sqlQuery = '';
    let whereClause = '';
    
    // 筛选输出列
    const outputColumns = columns.filter(col => col.isOutput);
    const selectedOutputNames = outputColumns.map(col => col.name).join(', ');
    
    // 如果有输入参数，构建WHERE子句
    if (inputParams.length > 0) {
      const inputClauses = columns
        .filter(col => col.isInput)
        .map(col => `${col.name} = :${col.columnName}`)
        .join(' AND ');
      
      whereClause = `WHERE ${inputClauses}`;
    }
    
    // 单表或多表SQL构建
    if (apiConfig.joinMode && apiConfig.joinData) {
      // 使用JOIN数据构建SQL
      const joinTables = apiConfig.joinData.selectedTables;
      const mainTable = joinTables[0]?.name || '';
      
      const joinClauses = apiConfig.joinData.joins.map(join => {
        const mainTable = joinTables.find(t => t.id === join.mainTableId)?.name || '';
        const joinTable = joinTables.find(t => t.id === join.joinTableId)?.name || '';
        const mainColumn = mainTable && joinTables.find(t => t.id === join.mainTableId)?.columns.find(c => c.id === join.mainTableColumn)?.name || '';
        const joinColumn = joinTable && joinTables.find(t => t.id === join.joinTableId)?.columns.find(c => c.id === join.joinTableColumn)?.name || '';
        
        return `${join.joinType} JOIN ${joinTable} ON ${mainTable}.${mainColumn} = ${joinTable}.${joinColumn}`;
      }).join(' ');
      
      sqlQuery = `SELECT ${selectedOutputNames} FROM ${mainTable} ${joinClauses} ${whereClause}`;
    } else {
      // 单表模式
      const tableName = columns[0]?.tableName || apiConfig.selectedTable?.name || '';
      sqlQuery = `SELECT ${selectedOutputNames} FROM ${tableName} ${whereClause}`;
    }
    
    // 更新API配置
    updateApiConfig({
      inputParameters: inputParams,
      outputParameters: outputParams,
      sql: sqlQuery
    });
    
    onNext();
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        参数选择
      </Typography>
      
      <div className={classes.searchContainer}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="搜索字段"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={classes.filterField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={showSelectedOnly}
                  onChange={(e) => setShowSelectedOnly(e.target.checked)}
                  color="primary"
                />
              }
              label="只显示已选择的参数"
            />
          </Grid>
        </Grid>
        
        <div>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small" 
            onClick={handleSelectAllInputs}
            style={{ marginRight: 8 }}
          >
            选择所有输入
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="small" 
            onClick={handleClearAllInputs}
            style={{ marginRight: 8 }}
          >
            清除输入
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small" 
            onClick={handleSelectAllOutputs}
            style={{ marginRight: 8 }}
          >
            选择所有输出
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="small" 
            onClick={handleClearAllOutputs}
          >
            清除输出
          </Button>
        </div>
      </div>
      
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>字段名</TableCell>
              <TableCell className={classes.headerCell}>类型</TableCell>
              <TableCell className={classes.headerCell}>描述</TableCell>
              <TableCell className={`${classes.headerCell} ${classes.parameterColumn}`}>
                请求参数
              </TableCell>
              <TableCell className={`${classes.headerCell} ${classes.parameterColumn}`}>
                返回参数
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredColumns.map((column) => (
              <TableRow key={column.id} hover>
                <TableCell component="th" scope="row">
                  {column.name}
                </TableCell>
                <TableCell>{column.type}</TableCell>
                <TableCell>{column.description}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={column.isInput}
                    onChange={() => handleInputToggle(column.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={column.isOutput}
                    onChange={() => handleOutputToggle(column.id)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
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

export default ParameterSelection; 