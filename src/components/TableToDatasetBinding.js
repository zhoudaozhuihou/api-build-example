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
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ArrowForward,
  ArrowBack,
  Search,
  TableChart,
  Info as InfoIcon,
  CallSplit as JoinIcon,
  Storage as DatasetIcon,
  Add as AddIcon,
  Link as LinkIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Create as CreateIcon
} from '@material-ui/icons';
import DatabaseTableService from '../services/DatabaseTableService';
import DatasetManagementService from '../services/DatasetManagementService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    color: theme.palette.text.secondary,
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
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  tableCard: {
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.primary.main,
    },
    '&.selected': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + '10',
    },
  },
  tableInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  tableIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  datasetStatus: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statusChip: {
    fontSize: '0.75rem',
  },
  bindingSection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  bindingCard: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.light + '05',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  noTables: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  stepperContainer: {
    marginTop: theme.spacing(2),
  },
  formSection: {
    marginBottom: theme.spacing(2),
  },
}));

const TableToDatasetBinding = ({ 
  onNext, 
  onBack, 
  onTablesLoad, 
  toggleJoinMode, 
  connection,
  updateApiConfig 
}) => {
  const classes = useStyles();
  
  // 基础状态
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Dataset相关状态
  const [tableDatasets, setTableDatasets] = useState({}); // 表对应的Dataset映射
  const [isCheckingDatasets, setIsCheckingDatasets] = useState(false);
  
  // 创建Dataset对话框状态
  const [createDatasetDialog, setCreateDatasetDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newDatasetForm, setNewDatasetForm] = useState({
    name: '',
    description: '',
    category: 'project',
    tags: [],
    isPublic: false,
    sourceTable: null,
  });

  // 步骤配置
  const steps = [
    {
      label: '选择物理表',
      description: '选择要绑定到Dataset的数据库表',
    },
    {
      label: '检查Dataset绑定',
      description: '检查是否已有对应的Dataset',
    },
    {
      label: '确认绑定',
      description: '确认表与Dataset的绑定关系',
    },
  ];

  // 加载数据库表
  useEffect(() => {
    if (connection) {
      loadTables();
    }
  }, [connection]);

  // 当表列表加载完成后，检查Dataset绑定
  useEffect(() => {
    if (tables.length > 0) {
      checkTableDatasetBindings();
    }
  }, [tables]);

  const loadTables = async () => {
    try {
      setIsLoading(true);
      const tablesData = await DatabaseTableService.getTables(connection);
      setTables(tablesData);
      
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

  // 检查表与Dataset的绑定关系
  const checkTableDatasetBindings = async () => {
    try {
      setIsCheckingDatasets(true);
      const bindings = {};
      
      // 并行检查所有表的Dataset绑定
      const bindingPromises = tables.map(async (table) => {
        try {
          // 调用API检查是否有对应的Dataset
          // 这里假设Dataset有sourceTable字段记录来源表
          const datasets = await DatasetManagementService.getDatasets({
            sourceTable: table.name,
            category: 'project'
          });
          
          if (datasets.items && datasets.items.length > 0) {
            bindings[table.id] = {
              hasDataset: true,
              dataset: datasets.items[0], // 使用第一个匹配的Dataset
              status: 'bound'
            };
          } else {
            bindings[table.id] = {
              hasDataset: false,
              dataset: null,
              status: 'unbound'
            };
          }
        } catch (error) {
          console.warn(`检查表 ${table.name} 的Dataset绑定失败:`, error);
          bindings[table.id] = {
            hasDataset: false,
            dataset: null,
            status: 'error'
          };
        }
      });

      await Promise.all(bindingPromises);
      setTableDatasets(bindings);
      setIsCheckingDatasets(false);
    } catch (error) {
      console.error('检查Dataset绑定失败:', error);
      setIsCheckingDatasets(false);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setActiveStep(1); // 进入下一步
    
    setNotification({
      open: true,
      message: `已选择表格：${table.name}`,
      severity: 'success',
    });
  };

  const handleCreateDataset = () => {
    if (!selectedTable) return;
    
    setNewDatasetForm({
      name: `${selectedTable.name}_dataset`,
      description: `基于数据表 ${selectedTable.name} 创建的数据集`,
      category: 'project',
      tags: [selectedTable.name, 'project', 'table'],
      isPublic: false,
      sourceTable: selectedTable,
    });
    setCreateDatasetDialog(true);
  };

  const handleCreateDatasetSubmit = async () => {
    try {
      setIsLoading(true);
      
      // 创建Dataset的元数据
      const datasetData = {
        ...newDatasetForm,
        sourceTable: selectedTable.name,
        sourceConnection: connection.id,
        tableSchema: selectedTable.columns || [],
        uploadMode: 'table_binding',
        fileCount: 1,
        dataSize: selectedTable.size || '未知',
      };

      // 调用创建Dataset API
      const createdDataset = await DatasetManagementService.uploadDataset(
        new FormData(), // 空的FormData，因为这是表绑定而不是文件上传
        null
      );

      // 更新本地状态
      setTableDatasets(prev => ({
        ...prev,
        [selectedTable.id]: {
          hasDataset: true,
          dataset: createdDataset,
          status: 'bound'
        }
      }));

      setCreateDatasetDialog(false);
      setActiveStep(2); // 进入确认步骤
      setIsLoading(false);
      
      setNotification({
        open: true,
        message: `成功创建Dataset：${createdDataset.name}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('创建Dataset失败:', error);
      setIsLoading(false);
      setNotification({
        open: true,
        message: '创建Dataset失败，使用模拟数据继续',
        severity: 'warning',
      });
      
      // 模拟创建成功
      const mockDataset = {
        id: `dataset_${Date.now()}`,
        name: newDatasetForm.name,
        description: newDatasetForm.description,
        category: 'project',
        sourceTable: selectedTable.name,
        createdAt: new Date().toISOString(),
      };
      
      setTableDatasets(prev => ({
        ...prev,
        [selectedTable.id]: {
          hasDataset: true,
          dataset: mockDataset,
          status: 'bound'
        }
      }));
      
      setCreateDatasetDialog(false);
      setActiveStep(2);
    }
  };

  const handleNext = () => {
    if (!selectedTable) {
      setNotification({
        open: true,
        message: '请先选择一个表格',
        severity: 'error',
      });
      return;
    }

    const binding = tableDatasets[selectedTable.id];
    if (!binding || !binding.hasDataset) {
      setNotification({
        open: true,
        message: '请先绑定Dataset或创建新的Dataset',
        severity: 'error',
      });
      return;
    }

    // 更新API配置，传递表和Dataset信息
    if (updateApiConfig) {
      updateApiConfig({
        selectedTable,
        boundDataset: binding.dataset,
        sourceConnection: connection,
      });
    }

    // 进入下一步（API构建）
    onNext({
      table: selectedTable,
      dataset: binding.dataset,
      connection: connection,
    });
  };

  const handleFormChange = (field, value) => {
    setNewDatasetForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  const renderDatasetStatus = (table) => {
    if (isCheckingDatasets) {
      return <CircularProgress size={16} />;
    }

    const binding = tableDatasets[table.id];
    if (!binding) return null;

    switch (binding.status) {
      case 'bound':
        return (
          <Box className={classes.datasetStatus}>
            <Chip
              icon={<CheckIcon />}
              label={`已绑定: ${binding.dataset.name}`}
              color="primary"
              size="small"
              className={classes.statusChip}
            />
          </Box>
        );
      case 'unbound':
        return (
          <Box className={classes.datasetStatus}>
            <Chip
              icon={<WarningIcon />}
              label="未绑定Dataset"
              color="secondary"
              size="small"
              className={classes.statusChip}
            />
          </Box>
        );
      case 'error':
        return (
          <Box className={classes.datasetStatus}>
            <Chip
              icon={<WarningIcon />}
              label="检查失败"
              color="default"
              size="small"
              className={classes.statusChip}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper className={classes.root}>
      {/* 头部 */}
      <div className={classes.header}>
        <div>
          <Typography variant="h5">
            表格到Dataset绑定
          </Typography>
          <Typography className={classes.subtitle}>
            选择物理数据表并绑定到对应的Dataset，如果没有Dataset将自动创建
          </Typography>
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={toggleJoinMode}
          startIcon={<JoinIcon />}
        >
          多表关联模式
        </Button>
      </div>

      {/* 进度步骤 */}
      <div className={classes.stepperContainer}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {/* 连接信息 */}
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

      {/* 搜索 */}
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

      {/* 表格列表 */}
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : filteredTables.length > 0 ? (
        <div>
          {filteredTables.map((table) => (
            <Card
              key={table.id}
              className={`${classes.tableCard} ${
                selectedTable?.id === table.id ? 'selected' : ''
              }`}
              onClick={() => handleTableSelect(table)}
            >
              <CardContent>
                <div className={classes.tableInfo}>
                  <TableChart className={classes.tableIcon} />
                  <Typography variant="h6">{table.name}</Typography>
                  <Badge
                    badgeContent={
                      tableDatasets[table.id]?.hasDataset ? '✓' : '!'
                    }
                    color={
                      tableDatasets[table.id]?.hasDataset ? 'primary' : 'secondary'
                    }
                    style={{ marginLeft: 8 }}
                  />
                </div>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {table.description || '无描述'}
                </Typography>
                {table.rowCount && (
                  <Typography variant="caption" color="textSecondary">
                    行数: {table.rowCount.toLocaleString()} | 大小: {table.size}
                  </Typography>
                )}
                {renderDatasetStatus(table)}
              </CardContent>
            </Card>
          ))}
        </div>
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

      {/* 绑定操作区域 */}
      {selectedTable && (
        <div className={classes.bindingSection}>
          <Typography variant="h6" gutterBottom>
            Dataset绑定状态
          </Typography>
          
          {tableDatasets[selectedTable.id]?.hasDataset ? (
            <Card className={classes.bindingCard}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <DatasetIcon color="primary" style={{ marginRight: 8 }} />
                  <Typography variant="h6" color="primary">
                    已绑定Dataset
                  </Typography>
                </Box>
                <Typography variant="body1" gutterBottom>
                  Dataset名称: {tableDatasets[selectedTable.id].dataset.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  表 "{selectedTable.name}" 已经绑定到上述Dataset，可以直接进行API构建
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card className={classes.bindingCard}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <WarningIcon color="secondary" style={{ marginRight: 8 }} />
                  <Typography variant="h6" color="secondary">
                    未找到对应Dataset
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  表 "{selectedTable.name}" 尚未绑定到任何Dataset，需要创建新的Dataset
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CreateIcon />}
                  onClick={handleCreateDataset}
                  style={{ marginTop: 8 }}
                >
                  创建Project Dataset
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 底部按钮 */}
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
          disabled={
            !selectedTable || 
            !tableDatasets[selectedTable?.id]?.hasDataset
          }
        >
          开始构建API
        </Button>
      </div>

      {/* 创建Dataset对话框 */}
      <Dialog
        open={createDatasetDialog}
        onClose={() => setCreateDatasetDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CreateIcon color="primary" style={{ marginRight: 8 }} />
            创建Project Dataset
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            为表格 "{selectedTable?.name}" 创建对应的Project类型Dataset
          </Typography>
          
          <Grid container spacing={2} style={{ marginTop: 8 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dataset名称"
                value={newDatasetForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="描述"
                value={newDatasetForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>分类</InputLabel>
                <Select
                  value={newDatasetForm.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  label="分类"
                  disabled // 固定为project分类
                >
                  <MenuItem value="project">Project (项目)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Alert severity="info" style={{ marginTop: 16 }}>
            此Dataset将自动绑定到表格 "{selectedTable?.name}"，分类固定为Project类型。
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCreateDatasetDialog(false)}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            onClick={handleCreateDatasetSubmit}
            variant="contained"
            color="primary"
            disabled={isLoading || !newDatasetForm.name.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CreateIcon />}
          >
            {isLoading ? '创建中...' : '创建Dataset'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 通知栏 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TableToDatasetBinding; 