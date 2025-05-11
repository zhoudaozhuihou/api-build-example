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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowForward, ArrowBack, Search, TableChart } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  list: {
    marginTop: theme.spacing(2),
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
}));

// 模拟数据
const mockTables = [
  { id: 1, name: 'users', description: '用户信息表', rowCount: 1000, size: '1.2MB' },
  { id: 2, name: 'products', description: '产品信息表', rowCount: 500, size: '2.5MB' },
  { id: 3, name: 'orders', description: '订单信息表', rowCount: 2000, size: '3.8MB' },
  { id: 4, name: 'categories', description: '产品分类表', rowCount: 50, size: '0.5MB' },
];

function TableSelection({ onNext, onBack }) {
  const classes = useStyles();
  const history = useHistory();
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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
      localStorage.setItem('selectedTable', JSON.stringify(selectedTable));
      onNext();
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

  const filteredTables = mockTables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        选择表格
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

      {selectedTable && (
        <div className={classes.tableInfo}>
          <Typography variant="subtitle1" gutterBottom>
            已选择的表格：
          </Typography>
          <Chip
            icon={<TableChart />}
            label={`${selectedTable.name} (${selectedTable.description})`}
            color="primary"
            className={classes.chip}
          />
        </div>
      )}

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
                      {table.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      行数: {table.rowCount} | 大小: {table.size}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="select"
                  onClick={() => handleTableSelect(table)}
                >
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

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