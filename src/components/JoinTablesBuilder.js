import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Snackbar,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  ArrowForward, 
  ArrowBack, 
  Search, 
  TableChart, 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Link as LinkIcon,
  Autorenew as AutorenewIcon,
  Info as InfoIcon
} from '@material-ui/icons';
import DatabaseTableService from '../services/DatabaseTableService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  tablesContainer: {
    marginBottom: theme.spacing(3),
  },
  tableItem: {
    marginBottom: theme.spacing(1),
  },
  joinContainer: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  columnSelect: {
    minWidth: 150,
  },
  joinTypeSelect: {
    minWidth: 120,
  },
  joinTable: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  preview: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  connectionInfo: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
  },
  connectionIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  suggestJoinButton: {
    marginTop: theme.spacing(1),
  },
  joinSuggestionConfidence: {
    marginLeft: theme.spacing(1),
    opacity: 0.7,
    fontSize: '0.8rem',
  },
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  tableGrid: {
    height: '400px',
    overflow: 'auto',
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

const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'];

function JoinTablesBuilder({ onConfigure, onBack, toggleJoinMode, connection }) {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTables, setSelectedTables] = useState([]);
  const [joins, setJoins] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [sqlPreview, setSqlPreview] = useState('');
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [tables, setTables] = useState([]);
  const [isSuggestingJoins, setIsSuggestingJoins] = useState(false);
  const [suggestedJoins, setSuggestedJoins] = useState([]);
  const [errors, setErrors] = useState({});

  // 加载数据库表
  useEffect(() => {
    if (connection) {
      loadTables();
    }
  }, [connection]);

  // 当选中的表格或连接关系更改时，生成SQL预览
  useEffect(() => {
    generateSqlPreview();
  }, [selectedTables, joins]);

  const loadTables = async () => {
    try {
      setIsLoadingTables(true);
      const tablesData = await DatabaseTableService.getTables(connection);
      setTables(tablesData);
      setIsLoadingTables(false);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || '获取数据库表失败',
        severity: 'error',
      });
      setIsLoadingTables(false);
    }
  };

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (table.description && table.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTableSelect = (table) => {
    // 检查是否已经选择过
    if (selectedTables.some(t => t.id === table.id)) {
      setNotification({
        open: true,
        message: `表格 ${table.name} 已经被选择`,
        severity: 'warning',
      });
      return;
    }

    // 添加到已选表格
    const updatedTables = [...selectedTables, table];
    setSelectedTables(updatedTables);

    // 如果这是第二个表，自动添加一个JOIN条件
    if (updatedTables.length === 2) {
      const mainTable = updatedTables[0];
      const joinTable = updatedTables[1];
      setJoins([{
        id: Date.now(),
        mainTableId: mainTable.id,
        joinTableId: joinTable.id,
        mainTableColumn: null,
        joinTableColumn: null,
        joinType: 'INNER JOIN',
      }]);
      
      // 自动推荐连接条件
      suggestJoins();
    }

    setNotification({
      open: true,
      message: `已选择表格：${table.name}`,
      severity: 'success',
    });
  };

  const handleRemoveTable = (tableId) => {
    // 移除表格
    const updatedTables = selectedTables.filter(t => t.id !== tableId);
    setSelectedTables(updatedTables);

    // 移除相关的JOIN条件
    const updatedJoins = joins.filter(
      j => j.mainTableId !== tableId && j.joinTableId !== tableId
    );
    setJoins(updatedJoins);

    // 更新SQL预览
    generateSqlPreview();
  };

  const handleAddJoin = () => {
    if (selectedTables.length < 2) {
      setNotification({
        open: true,
        message: '请先选择至少两个表格',
        severity: 'warning',
      });
      return;
    }

    // 创建新的JOIN条件
    const newJoin = {
      id: Date.now(),
      mainTableId: selectedTables[0].id,
      joinTableId: selectedTables.length > 1 ? selectedTables[1].id : null,
      mainTableColumn: null,
      joinTableColumn: null,
      joinType: 'INNER JOIN',
    };

    setJoins([...joins, newJoin]);
  };

  const handleRemoveJoin = (joinId) => {
    const updatedJoins = joins.filter(j => j.id !== joinId);
    setJoins(updatedJoins);
  };

  const handleJoinChange = (joinId, field, value) => {
    const updatedJoins = joins.map(join => {
      if (join.id === joinId) {
        return { ...join, [field]: value };
      }
      return join;
    });
    setJoins(updatedJoins);
  };

  const generateSqlPreview = () => {
    if (selectedTables.length === 0) {
      setSqlPreview('-- 请先选择表格');
      return;
    }

    // 验证连接配置
    const errors = {};
    const validJoins = joins.filter(join => {
      const isValid = 
        join.mainTableId && 
        join.joinTableId && 
        join.mainTableColumn && 
        join.joinTableColumn;
      
      if (!isValid) {
        if (!join.mainTableId) errors[`join_${join.id}_mainTableId`] = '请选择主表';
        if (!join.joinTableId) errors[`join_${join.id}_joinTableId`] = '请选择关联表';
        if (!join.mainTableColumn) errors[`join_${join.id}_mainTableColumn`] = '请选择主表列';
        if (!join.joinTableColumn) errors[`join_${join.id}_joinTableColumn`] = '请选择关联表列';
      }
      
      return isValid;
    });
    
    setErrors(errors);

    // 如果没有有效的连接配置，则只显示主表
    if (validJoins.length === 0 && selectedTables.length > 0) {
      const mainTable = selectedTables[0];
      const sql = `SELECT * FROM ${mainTable.name}`;
      setSqlPreview(sql);
      return;
    }

    // 生成含有JOIN的SQL
    let sql = 'SELECT\n  ';
    
    // 添加选择的字段
    const selectFields = selectedTables.map(table => 
      `${table.name}.*`
    ).join(',\n  ');
    
    sql += selectFields;
    
    // 添加主表
    const mainTable = selectedTables[0];
    sql += `\nFROM ${mainTable.name}`;
    
    // 添加JOIN子句
    if (validJoins.length > 0) {
      sql += '\n';
      validJoins.forEach(join => {
        const joinTable = selectedTables.find(t => t.id === join.joinTableId);
        const mainTableName = selectedTables.find(t => t.id === join.mainTableId)?.name;
        
        if (joinTable && mainTableName) {
          sql += `${join.joinType} ${joinTable.name} ON ${mainTableName}.${join.mainTableColumn} = ${joinTable.name}.${join.joinTableColumn}\n`;
        }
      });
    }
    
    setSqlPreview(sql);
  };

  const suggestJoins = async () => {
    if (selectedTables.length < 2) {
      setNotification({
        open: true,
        message: '请先选择至少两个表格',
        severity: 'warning',
      });
      return;
    }

    try {
      setIsSuggestingJoins(true);
      let suggested = [];

      // 对每对表进行连接建议
      for (let i = 0; i < selectedTables.length; i++) {
        for (let j = i + 1; j < selectedTables.length; j++) {
          const sourceTable = selectedTables[i];
          const targetTable = selectedTables[j];
          
          // 使用服务获取推荐连接
          const recommendations = await DatabaseTableService.recommendJoins(
            connection, 
            sourceTable.name, 
            targetTable.name
          );
          
          if (recommendations.length > 0) {
            suggested = [...suggested, ...recommendations];
          }
        }
      }
      
      setSuggestedJoins(suggested);
      setIsSuggestingJoins(false);
      
      if (suggested.length === 0) {
        setNotification({
          open: true,
          message: '未找到建议的连接关系',
          severity: 'info',
        });
      }
    } catch (error) {
      console.error('Error suggesting joins:', error);
      setNotification({
        open: true,
        message: error.message || '获取连接建议失败',
        severity: 'error',
      });
      setIsSuggestingJoins(false);
    }
  };

  const applySuggestedJoins = () => {
    if (suggestedJoins.length === 0) {
      return;
    }

    // 创建新的连接配置
    const newJoins = suggestedJoins.map((suggestion, index) => {
      const mainTable = selectedTables.find(t => t.name === suggestion.sourceTable);
      const joinTable = selectedTables.find(t => t.name === suggestion.targetTable);
      
      if (!mainTable || !joinTable) return null;
      
      return {
        id: Date.now() + index,
        mainTableId: mainTable.id,
        joinTableId: joinTable.id,
        mainTableColumn: suggestion.sourceColumn,
        joinTableColumn: suggestion.targetColumn,
        joinType: suggestion.joinType + ' JOIN',
      };
    }).filter(Boolean);

    if (newJoins.length > 0) {
      setJoins(newJoins);
      setSuggestedJoins([]);
      
      setNotification({
        open: true,
        message: `已应用 ${newJoins.length} 个连接建议`,
        severity: 'success',
      });
    }
  };

  const handleNext = () => {
    // 表单验证
    if (selectedTables.length === 0) {
      setNotification({
        open: true,
        message: '请至少选择一个表格',
        severity: 'error',
      });
      return;
    }

    // 验证连接配置
    const errors = {};
    joins.forEach(join => {
      if (!join.mainTableId) errors[`join_${join.id}_mainTableId`] = '请选择主表';
      if (!join.joinTableId) errors[`join_${join.id}_joinTableId`] = '请选择关联表';
      if (!join.mainTableColumn) errors[`join_${join.id}_mainTableColumn`] = '请选择主表列';
      if (!join.joinTableColumn) errors[`join_${join.id}_joinTableColumn`] = '请选择关联表列';
    });
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setNotification({
        open: true,
        message: '请完成所有连接配置',
        severity: 'error',
      });
      return;
    }

    // 将表格信息传递给父组件
    const mainTable = selectedTables[0];
    onConfigure(selectedTables, mainTable, joins);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getDbTypeName = (type) => {
    const dbTypes = {
      mysql: 'MySQL',
      postgresql: 'PostgreSQL',
      sqlserver: 'SQL Server',
      oracle: 'Oracle'
    };
    return dbTypes[type] || type;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5">
          表格关联配置
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={toggleJoinMode}
        >
          切换到单表模式
        </Button>
      </div>

      {connection && (
        <Box className={classes.connectionInfo}>
          <InfoIcon className={classes.connectionIcon} />
          <div>
            <Typography variant="subtitle2">
              当前数据库连接
            </Typography>
            <Typography variant="body2">
              {connection.name} ({getDbTypeName(connection.type)}) - {connection.host}:{connection.port}/{connection.database}
            </Typography>
          </div>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* 左侧表格选择 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" gutterBottom>
            选择表格
          </Typography>
          
          <div className={classes.searchContainer}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="搜索表格..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {isLoadingTables ? (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          ) : (
            <Paper variant="outlined" className={classes.tableGrid}>
              <List dense>
                {filteredTables.map((table) => (
                  <React.Fragment key={table.id}>
                    <ListItem
                      button
                      onClick={() => handleTableSelect(table)}
                      disabled={selectedTables.some(t => t.id === table.id)}
                    >
                      <ListItemText
                        primary={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TableChart style={{ marginRight: 8 }} fontSize="small" />
                            {table.name}
                          </div>
                        }
                        secondary={table.description || '无描述'}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="select"
                          onClick={() => handleTableSelect(table)}
                          disabled={selectedTables.some(t => t.id === table.id)}
                          size="small"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        {/* 右侧配置区域 */}
        <Grid item xs={8}>
          <Typography variant="subtitle1" gutterBottom>
            已选择的表格
          </Typography>

          {selectedTables.length > 0 ? (
            <Box mb={3}>
              <Grid container spacing={1}>
                {selectedTables.map((table) => (
                  <Grid item key={table.id}>
                    <Chip
                      icon={<TableChart />}
                      label={table.name}
                      onDelete={() => handleRemoveTable(table.id)}
                      color="primary"
                      variant="outlined"
                      className={classes.chip}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary" paragraph>
              请从左侧列表选择表格
            </Typography>
          )}

          {selectedTables.length >= 2 && (
            <>
              <Box mt={3} mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  表格连接关系
                </Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<AutorenewIcon />}
                    color="primary"
                    onClick={suggestJoins}
                    disabled={isSuggestingJoins || selectedTables.length < 2}
                    className={classes.suggestJoinButton}
                  >
                    {isSuggestingJoins ? "推荐中..." : "自动推荐连接"}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    color="primary"
                    onClick={handleAddJoin}
                    className={classes.suggestJoinButton}
                  >
                    添加连接
                  </Button>
                </Box>
              </Box>

              {suggestedJoins.length > 0 && (
                <Box mt={2} mb={3} p={2} border={1} borderColor="divider" borderRadius="borderRadius">
                  <Typography variant="subtitle2" gutterBottom>
                    推荐的连接关系
                  </Typography>
                  <List dense>
                    {suggestedJoins.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={
                            <span>
                              {suggestion.sourceTable}.{suggestion.sourceColumn} = {suggestion.targetTable}.{suggestion.targetColumn}
                              <span className={classes.joinSuggestionConfidence}>
                                (置信度: {(suggestion.confidence * 100).toFixed(0)}%)
                              </span>
                            </span>
                          }
                          secondary={`推荐连接类型: ${suggestion.joinType} JOIN`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={applySuggestedJoins}
                    style={{ marginTop: 8 }}
                  >
                    应用推荐
                  </Button>
                </Box>
              )}

              <TableContainer component={Paper} variant="outlined">
                <Table className={classes.joinTable} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>连接类型</TableCell>
                      <TableCell>主表.列</TableCell>
                      <TableCell align="center">=</TableCell>
                      <TableCell>关联表.列</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {joins.map((join) => {
                      const mainTable = selectedTables.find(t => t.id === join.mainTableId);
                      const joinTable = selectedTables.find(t => t.id === join.joinTableId);
                      
                      return (
                        <TableRow key={join.id}>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={join.joinType}
                                onChange={(e) => handleJoinChange(join.id, 'joinType', e.target.value)}
                              >
                                {joinTypes.map(type => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <FormControl fullWidth size="small" error={!!errors[`join_${join.id}_mainTableId`]}>
                                  <Select
                                    value={join.mainTableId || ''}
                                    onChange={(e) => {
                                      handleJoinChange(join.id, 'mainTableId', e.target.value);
                                      handleJoinChange(join.id, 'mainTableColumn', null);
                                    }}
                                  >
                                    {selectedTables.map(table => (
                                      <MenuItem key={table.id} value={table.id}>
                                        {table.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors[`join_${join.id}_mainTableId`] && (
                                    <FormHelperText>{errors[`join_${join.id}_mainTableId`]}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControl fullWidth size="small" error={!!errors[`join_${join.id}_mainTableColumn`]}>
                                  <Select
                                    value={join.mainTableColumn || ''}
                                    onChange={(e) => handleJoinChange(join.id, 'mainTableColumn', e.target.value)}
                                    disabled={!join.mainTableId}
                                  >
                                    {mainTable?.columns?.map(column => (
                                      <MenuItem key={column.id} value={column.name}>
                                        {column.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors[`join_${join.id}_mainTableColumn`] && (
                                    <FormHelperText>{errors[`join_${join.id}_mainTableColumn`]}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell align="center">=</TableCell>
                          <TableCell>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <FormControl fullWidth size="small" error={!!errors[`join_${join.id}_joinTableId`]}>
                                  <Select
                                    value={join.joinTableId || ''}
                                    onChange={(e) => {
                                      handleJoinChange(join.id, 'joinTableId', e.target.value);
                                      handleJoinChange(join.id, 'joinTableColumn', null);
                                    }}
                                  >
                                    {selectedTables.map(table => (
                                      <MenuItem key={table.id} value={table.id}>
                                        {table.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors[`join_${join.id}_joinTableId`] && (
                                    <FormHelperText>{errors[`join_${join.id}_joinTableId`]}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControl fullWidth size="small" error={!!errors[`join_${join.id}_joinTableColumn`]}>
                                  <Select
                                    value={join.joinTableColumn || ''}
                                    onChange={(e) => handleJoinChange(join.id, 'joinTableColumn', e.target.value)}
                                    disabled={!join.joinTableId}
                                  >
                                    {joinTable?.columns?.map(column => (
                                      <MenuItem key={column.id} value={column.name}>
                                        {column.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors[`join_${join.id}_joinTableColumn`] && (
                                    <FormHelperText>{errors[`join_${join.id}_joinTableColumn`]}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleRemoveJoin(join.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* SQL预览 */}
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              SQL预览
            </Typography>
            <Paper variant="outlined" className={classes.preview}>
              <pre>{sqlPreview}</pre>
            </Paper>
          </Box>
        </Grid>
      </Grid>

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
          disabled={selectedTables.length === 0}
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

export default JoinTablesBuilder; 