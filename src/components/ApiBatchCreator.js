import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@material-ui/icons';
import CategoryCascader from './CategoryCascader';
import { apiCategories } from '../constants/apiCategories';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper': {
      minWidth: '80vw',
      maxWidth: '90vw',
      minHeight: '80vh',
    },
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxHeight: 400,
  },
  configSection: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
  },
  progressContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  statusChip: {
    marginLeft: theme.spacing(1),
  },
  previewContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    maxHeight: 300,
    overflowY: 'auto',
  },
  apiItem: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
  },
  warningBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function ApiBatchCreator({ 
  open, 
  onClose, 
  onBatchCreate, 
  availableTables = [], 
  availableDatasets = [],
  sourceType = 'database' // 'database' or 'dataset'
}) {
  const classes = useStyles();
  const [selectedItems, setSelectedItems] = useState([]);
  const [batchConfig, setBatchConfig] = useState({
    nameTemplate: '{tableName}_api',
    pathTemplate: '/api/{tableName}',
    method: 'GET',
    description: 'Auto-generated API for {tableName}',
    categories: [],
    generateCRUD: false,
    includeFilter: true,
    includePagination: true,
    autoGenerateParams: true,
  });
  const [creationProgress, setCreationProgress] = useState({
    isCreating: false,
    current: 0,
    total: 0,
    status: 'idle', // 'idle', 'creating', 'completed', 'error'
    results: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewApis, setPreviewApis] = useState([]);

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

  const handleItemSelect = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    const sourceItems = sourceType === 'database' ? availableTables : availableDatasets;
    if (selectedItems.length === sourceItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...sourceItems]);
    }
  };

  const handleConfigChange = (field, value) => {
    setBatchConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categories) => {
    setBatchConfig(prev => ({
      ...prev,
      categories
    }));
  };

  const generateApiName = (item) => {
    return batchConfig.nameTemplate
      .replace(/{tableName}/g, item.name)
      .replace(/{datasetName}/g, item.name)
      .replace(/{itemName}/g, item.name);
  };

  const generateApiPath = (item) => {
    return batchConfig.pathTemplate
      .replace(/{tableName}/g, item.name)
      .replace(/{datasetName}/g, item.name)
      .replace(/{itemName}/g, item.name);
  };

  const generateApiDescription = (item) => {
    return batchConfig.description
      .replace(/{tableName}/g, item.name)
      .replace(/{datasetName}/g, item.name)
      .replace(/{itemName}/g, item.name);
  };

  const generateApiPreview = () => {
    const previews = selectedItems.map(item => {
      const apiConfig = {
        name: generateApiName(item),
        path: generateApiPath(item),
        method: batchConfig.method,
        description: generateApiDescription(item),
        sourceItem: item,
        categories: batchConfig.categories,
        generateCRUD: batchConfig.generateCRUD,
        includeFilter: batchConfig.includeFilter,
        includePagination: batchConfig.includePagination,
        autoGenerateParams: batchConfig.autoGenerateParams,
      };

      // 如果启用CRUD，生成多个API
      if (batchConfig.generateCRUD) {
        return [
          { ...apiConfig, method: 'GET', name: `${apiConfig.name}_list`, path: `${apiConfig.path}` },
          { ...apiConfig, method: 'GET', name: `${apiConfig.name}_get`, path: `${apiConfig.path}/{id}` },
          { ...apiConfig, method: 'POST', name: `${apiConfig.name}_create`, path: `${apiConfig.path}` },
          { ...apiConfig, method: 'PUT', name: `${apiConfig.name}_update`, path: `${apiConfig.path}/{id}` },
          { ...apiConfig, method: 'DELETE', name: `${apiConfig.name}_delete`, path: `${apiConfig.path}/{id}` },
        ];
      } else {
        return [apiConfig];
      }
    }).flat();

    setPreviewApis(previews);
    setShowPreview(true);
  };

  const handleBatchCreate = async () => {
    try {
      setCreationProgress({
        isCreating: true,
        current: 0,
        total: previewApis.length,
        status: 'creating',
        results: [],
      });

      const results = [];
      
      for (let i = 0; i < previewApis.length; i++) {
        const apiConfig = previewApis[i];
        
        try {
          // 调用创建API的函数
          const result = await onBatchCreate(apiConfig);
          results.push({
            api: apiConfig,
            success: true,
            result: result,
          });
        } catch (error) {
          results.push({
            api: apiConfig,
            success: false,
            error: error.message || '创建失败',
          });
        }

        setCreationProgress(prev => ({
          ...prev,
          current: i + 1,
          results: results,
        }));

        // 添加延迟以避免过快请求
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setCreationProgress(prev => ({
        ...prev,
        status: 'completed',
        isCreating: false,
      }));

    } catch (error) {
      setCreationProgress(prev => ({
        ...prev,
        status: 'error',
        isCreating: false,
      }));
    }
  };

  const handleClose = () => {
    if (!creationProgress.isCreating) {
      setSelectedItems([]);
      setShowPreview(false);
      setPreviewApis([]);
      setCreationProgress({
        isCreating: false,
        current: 0,
        total: 0,
        status: 'idle',
        results: [],
      });
      onClose();
    }
  };

  const sourceItems = sourceType === 'database' ? availableTables : availableDatasets;
  const isAllSelected = selectedItems.length === sourceItems.length && sourceItems.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < sourceItems.length;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" className={classes.root}>
      <DialogTitle>
        批量创建API
        <Typography variant="body2" color="textSecondary">
          从{sourceType === 'database' ? '数据库表' : '数据集'}批量生成API接口
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {/* 选择源数据 */}
        <Typography variant="h6" className={classes.sectionTitle}>
          1. 选择{sourceType === 'database' ? '数据表' : '数据集'}
        </Typography>
        
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>名称</TableCell>
                <TableCell>描述</TableCell>
                {sourceType === 'database' && <TableCell>列数</TableCell>}
                {sourceType === 'dataset' && <TableCell>类型</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sourceItems.map(item => (
                <TableRow key={item.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.some(selected => selected.id === item.id)}
                      onChange={() => handleItemSelect(item)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
                  {sourceType === 'database' && (
                    <TableCell>{item.columns?.length || 0}</TableCell>
                  )}
                  {sourceType === 'dataset' && (
                    <TableCell>{item.type || '-'}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 批量配置 */}
        <Typography variant="h6" className={classes.sectionTitle}>
          2. 配置生成规则
        </Typography>

        <div className={classes.configSection}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API名称模板"
                value={batchConfig.nameTemplate}
                onChange={(e) => handleConfigChange('nameTemplate', e.target.value)}
                placeholder="例如：{tableName}_api"
                helperText="可用变量：{tableName}, {datasetName}, {itemName}"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API路径模板"
                value={batchConfig.pathTemplate}
                onChange={(e) => handleConfigChange('pathTemplate', e.target.value)}
                placeholder="例如：/api/{tableName}"
                helperText="可用变量：{tableName}, {datasetName}, {itemName}"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>HTTP方法</InputLabel>
                <Select
                  value={batchConfig.method}
                  onChange={(e) => handleConfigChange('method', e.target.value)}
                >
                  {httpMethods.map(method => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="描述模板"
                value={batchConfig.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                placeholder="例如：Auto-generated API for {tableName}"
              />
            </Grid>

            <Grid item xs={12}>
              <CategoryCascader
                value={batchConfig.categories}
                onChange={handleCategoryChange}
                categories={apiCategories}
                placeholder="选择API分类（所有生成的API将使用相同分类）"
                multiple
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={batchConfig.generateCRUD}
                    onChange={(e) => handleConfigChange('generateCRUD', e.target.checked)}
                  />
                }
                label="生成完整CRUD操作 (GET, POST, PUT, DELETE)"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={batchConfig.includeFilter}
                    onChange={(e) => handleConfigChange('includeFilter', e.target.checked)}
                  />
                }
                label="包含筛选参数"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={batchConfig.includePagination}
                    onChange={(e) => handleConfigChange('includePagination', e.target.checked)}
                  />
                }
                label="包含分页参数"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={batchConfig.autoGenerateParams}
                    onChange={(e) => handleConfigChange('autoGenerateParams', e.target.checked)}
                  />
                }
                label="自动生成参数"
              />
            </Grid>
          </Grid>
        </div>

        {/* 预览和创建进度 */}
        {selectedItems.length > 0 && (
          <>
            <Typography variant="h6" className={classes.sectionTitle}>
              3. 预览和创建
            </Typography>

            {!showPreview ? (
              <Box textAlign="center" className={classes.warningBox}>
                <Alert severity="info">
                  已选择 {selectedItems.length} 个{sourceType === 'database' ? '表' : '数据集'}，
                  将生成 {batchConfig.generateCRUD ? selectedItems.length * 5 : selectedItems.length} 个API
                </Alert>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PreviewIcon />}
                    onClick={generateApiPreview}
                  >
                    生成预览
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <div className={classes.previewContainer}>
                  <Typography variant="subtitle1" gutterBottom>
                    将创建以下API ({previewApis.length}个)：
                  </Typography>
                  {previewApis.slice(0, 10).map((api, index) => (
                    <div key={index} className={classes.apiItem}>
                      <Typography variant="body2">
                        <strong>{api.method}</strong> {api.path} - {api.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {api.description}
                      </Typography>
                    </div>
                  ))}
                  {previewApis.length > 10 && (
                    <Typography variant="caption" color="textSecondary">
                      ... 还有 {previewApis.length - 10} 个API
                    </Typography>
                  )}
                </div>

                {creationProgress.status === 'creating' && (
                  <div className={classes.progressContainer}>
                    <Typography variant="body2" gutterBottom>
                      正在创建API ({creationProgress.current}/{creationProgress.total})
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(creationProgress.current / creationProgress.total) * 100} 
                    />
                  </div>
                )}

                {creationProgress.results.length > 0 && (
                  <div className={classes.progressContainer}>
                    <Typography variant="subtitle2" gutterBottom>
                      创建结果：
                    </Typography>
                    {creationProgress.results.map((result, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" style={{ flex: 1 }}>
                          {result.api.name}
                        </Typography>
                        <Chip
                          icon={result.success ? <CheckCircleIcon /> : <CancelIcon />}
                          label={result.success ? '成功' : '失败'}
                          color={result.success ? 'primary' : 'secondary'}
                          size="small"
                          className={classes.statusChip}
                        />
                      </Box>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={creationProgress.isCreating}>
          {creationProgress.status === 'completed' ? '完成' : '取消'}
        </Button>
        {showPreview && creationProgress.status !== 'completed' && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleBatchCreate}
            disabled={creationProgress.isCreating || previewApis.length === 0}
            startIcon={<AddIcon />}
          >
            {creationProgress.isCreating ? '创建中...' : `创建 ${previewApis.length} 个API`}
          </Button>
        )}
        {!showPreview && selectedItems.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => setShowPreview(false)}
          >
            重新配置
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ApiBatchCreator; 