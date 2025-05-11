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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  ArrowForward, 
  ArrowBack, 
  Search, 
  TableChart, 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Link as LinkIcon
} from '@material-ui/icons';

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

function JoinTablesBuilder({ onNext, onBack }) {
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

  const filteredTables = mockTables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    generateSqlPreview();
  }, [selectedTables, joins]);

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
        id: 1,
        mainTableId: mainTable.id,
        joinTableId: joinTable.id,
        mainTableColumn: null,
        joinTableColumn: null,
        joinType: 'INNER JOIN',
      }]);
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
        severity: 'error',
      });
      return;
    }

    const newJoin = {
      id: joins.length > 0 ? Math.max(...joins.map(j => j.id)) + 1 : 1,
      mainTableId: selectedTables[0].id,
      joinTableId: selectedTables[1].id,
      mainTableColumn: null,
      joinTableColumn: null,
      joinType: 'INNER JOIN',
    };

    setJoins([...joins, newJoin]);
  };

  const handleRemoveJoin = (joinId) => {
    setJoins(joins.filter(j => j.id !== joinId));
  };

  const handleJoinChange = (joinId, field, value) => {
    setJoins(joins.map(join => 
      join.id === joinId ? { ...join, [field]: value } : join
    ));
  };

  const generateSqlPreview = () => {
    if (selectedTables.length === 0) {
      setSqlPreview('');
      return;
    }

    // 主表
    const mainTable = selectedTables[0];
    
    let sql = `SELECT \n`;
    
    // 选择的字段
    const columns = selectedTables.flatMap(table => 
      table.columns.map(col => `  ${table.name}.${col.name} AS ${table.name}_${col.name}`)
    );
    
    sql += columns.join(',\n');
    sql += `\nFROM ${mainTable.name}`;
    
    // JOIN子句
    joins.forEach(join => {
      const mainTable = mockTables.find(t => t.id === join.mainTableId);
      const joinTable = mockTables.find(t => t.id === join.joinTableId);
      
      if (mainTable && joinTable && join.mainTableColumn && join.joinTableColumn) {
        const mainColumn = mainTable.columns.find(c => c.id === join.mainTableColumn);
        const joinColumn = joinTable.columns.find(c => c.id === join.joinTableColumn);
        
        if (mainColumn && joinColumn) {
          sql += `\n${join.joinType} ${joinTable.name} ON ${mainTable.name}.${mainColumn.name} = ${joinTable.name}.${joinColumn.name}`;
        }
      }
    });
    
    setSqlPreview(sql);
  };

  const handleNext = () => {
    if (selectedTables.length === 0) {
      setNotification({
        open: true,
        message: '请至少选择一个表格',
        severity: 'error',
      });
      return;
    }

    if (selectedTables.length > 1 && joins.length === 0) {
      setNotification({
        open: true,
        message: '多表查询需要设置JOIN条件',
        severity: 'error',
      });
      return;
    }

    // 验证所有JOIN条件是否完整
    const incompleteJoins = joins.filter(
      join => !join.mainTableColumn || !join.joinTableColumn
    );
    
    if (incompleteJoins.length > 0) {
      setNotification({
        open: true,
        message: '请完成所有JOIN条件的设置',
        severity: 'error',
      });
      return;
    }

    // 存储选择的表格和JOIN信息
    const joinData = {
      selectedTables,
      joins,
      sqlPreview
    };
    
    localStorage.setItem('joinTablesData', JSON.stringify(joinData));
    onNext();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        多表关联设置
      </Typography>

      <div className={classes.searchContainer}>
        <TextField
          fullWidth
          variant="outlined"
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            可用表格
          </Typography>
          <List>
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
                        <TableChart style={{ marginRight: 8 }} />
                        {table.name}
                      </div>
                    }
                    secondary={table.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="select"
                      onClick={() => handleTableSelect(table)}
                      disabled={selectedTables.some(t => t.id === table.id)}
                    >
                      <AddIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            已选择的表格
          </Typography>
          {selectedTables.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              还未选择任何表格
            </Typography>
          ) : (
            <div className={classes.tablesContainer}>
              {selectedTables.map((table, index) => (
                <Paper key={table.id} className={classes.tableItem} variant="outlined">
                  <ListItem>
                    <ListItemText
                      primary={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TableChart style={{ marginRight: 8 }} />
                          {index === 0 ? `${table.name} (主表)` : table.name}
                        </div>
                      }
                      secondary={table.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleRemoveTable(table.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </div>
          )}

          {selectedTables.length >= 2 && (
            <div>
              <Typography variant="h6" gutterBottom>
                表连接设置
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddJoin}
                  className={classes.addButton}
                  style={{ marginLeft: 16 }}
                >
                  添加连接
                </Button>
              </Typography>

              {joins.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  未设置表连接
                </Typography>
              ) : (
                joins.map((join) => {
                  const mainTable = selectedTables.find(t => t.id === join.mainTableId);
                  const joinTable = selectedTables.find(t => t.id === join.joinTableId);
                  
                  if (!mainTable || !joinTable) return null;
                  
                  return (
                    <div key={join.id} className={classes.joinContainer}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel>连接类型</InputLabel>
                            <Select
                              value={join.joinType}
                              onChange={(e) => handleJoinChange(join.id, 'joinType', e.target.value)}
                              className={classes.joinTypeSelect}
                            >
                              {joinTypes.map(type => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Typography variant="body2" align="center">
                            {mainTable.name} <LinkIcon /> {joinTable.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <FormControl fullWidth>
                            <InputLabel>{mainTable.name}表字段</InputLabel>
                            <Select
                              value={join.mainTableColumn || ''}
                              onChange={(e) => handleJoinChange(join.id, 'mainTableColumn', e.target.value)}
                              className={classes.columnSelect}
                            >
                              {mainTable.columns.map(column => (
                                <MenuItem key={column.id} value={column.id}>
                                  {column.name} ({column.type})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2} container justifyContent="center">
                          <Typography>=</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <FormControl fullWidth>
                            <InputLabel>{joinTable.name}表字段</InputLabel>
                            <Select
                              value={join.joinTableColumn || ''}
                              onChange={(e) => handleJoinChange(join.id, 'joinTableColumn', e.target.value)}
                              className={classes.columnSelect}
                            >
                              {joinTable.columns.map(column => (
                                <MenuItem key={column.id} value={column.id}>
                                  {column.name} ({column.type})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemoveJoin(join.id)}
                          >
                            移除连接
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </Grid>
      </Grid>

      {sqlPreview && (
        <div>
          <Typography variant="h6" gutterBottom>
            SQL预览
          </Typography>
          <pre className={classes.preview}>
            {sqlPreview}
          </pre>
        </div>
      )}

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