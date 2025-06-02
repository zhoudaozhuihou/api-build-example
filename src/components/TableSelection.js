import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
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
  CircularProgress,
  Box,
  Tooltip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  ArrowForward, 
  ArrowBack, 
  Search, 
  TableChart,
  Info as InfoIcon,
  CallSplit as JoinIcon
} from '@material-ui/icons';
import DatabaseTableService from '../services/DatabaseTableService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  list: {
    marginTop: theme.spacing(2),
    maxHeight: '500px',
    overflow: 'auto'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  tableInfo: {
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
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
  noTables: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  joinModeButton: {
    marginTop: theme.spacing(1),
  }
}));

function TableSelection({ onSelect, onBack, onTablesLoad, toggleJoinMode, connection }) {
  const classes = useStyles();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isLoading, setIsLoading] = useState(false);

  // 加载数据库表
  useEffect(() => {
    if (connection) {
      loadTables();
    }
  }, [connection]);

  const loadTables = async () => {
    try {
      setIsLoading(true);
      const tablesData = await DatabaseTableService.getTables(connection);
      setTables(tablesData);
      
      // 调用回调函数传递表数据
      if (onTablesLoad) {
        onTablesLoad(tablesData);
      }
      
      setIsLoading(false);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || '获取数据库表失败',
        severity: 'error',
      });
      setIsLoading(false);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setNotification({
      open: true,
      message: `已选择表格：${table.name}`,
      severity: 'success',
    });
  };

  const handleNext = () => {
    if (selectedTable) {
      onSelect(selectedTable);
    } else {
      setNotification({
        open: true,
        message: '请先选择一个表格',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (table.description && table.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          选择表格
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={toggleJoinMode}
          startIcon={<JoinIcon />}
        >
          切换到多表关联模式
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

      {selectedTable && (
        <div className={classes.tableInfo}>
          <Typography variant="subtitle1" gutterBottom>
            已选择的表格：
          </Typography>
          <Chip
            icon={<TableChart />}
            label={`${selectedTable.name} (${selectedTable.description || '无描述'})`}
            color="primary"
            className={classes.chip}
          />
        </div>
      )}

      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : filteredTables.length > 0 ? (
        <List className={classes.list}>
          {filteredTables.map((table) => (
            <React.Fragment key={table.id}>
              <ListItem
                button
                selected={selectedTable?.id === table.id}
                onClick={() => handleTableSelect(table)}
              >
                <ListItemText
                  primary={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TableChart style={{ marginRight: 8 }} />
                      {table.name}
                    </div>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {table.description || '无描述'}
                      </Typography>
                      {table.rowCount && (
                        <Typography variant="caption" color="textSecondary">
                          行数: {table.rowCount.toLocaleString()} | 大小: {table.size}
                        </Typography>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="选择此表">
                    <IconButton
                      edge="end"
                      aria-label="select"
                      onClick={() => handleTableSelect(table)}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box className={classes.noTables}>
          <Typography variant="body1">
            没有找到匹配的表格
          </Typography>
          {searchQuery && (
            <Typography variant="body2">
              尝试使用不同的搜索关键词
            </Typography>
          )}
        </Box>
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
          disabled={!selectedTable}
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

export default TableSelection; 