import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Tabs,
  Tab,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fab
} from '@material-ui/core';
import { 
  ArrowBack, 
  ArrowForward, 
  Storage as StorageIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  PublishOutlined as PublishIcon,
  PlaylistAdd as BatchIcon
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatabaseConnection from '../components/DatabaseConnection';
import TableSelection from '../components/TableSelection';
import TableToDatasetBinding from '../components/TableToDatasetBinding';
import DatasetCreationWizard from '../components/DatasetCreationWizard';
import ParameterSelection from '../components/ParameterSelection';
import SqlEditor from '../components/SqlEditor';
import ApiDetailsEditor from '../components/ApiDetailsEditor';
import ApiList from '../components/ApiList';
import JoinTablesBuilder from '../components/JoinTablesBuilder';
import ApiBatchCreator from '../components/ApiBatchCreator';
import { API_TYPES, createApi } from '../redux/slices/apiSlice';
import { selectAllDatasets, linkApiToDataset } from '../redux/slices/datasetSlice';
import ParameterDemoService from '../services/ParameterDemoService';
import DatasetManagementService from '../services/DatasetManagementService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  stepperContainer: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  contentContainer: {
    marginTop: theme.spacing(2),
  },
  choiceCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8]
    }
  },
  cardSelected: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: 'rgba(25, 118, 210, 0.05)'
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main
  },
  tabsRoot: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3)
  },
  datasetCard: {
    cursor: 'pointer',
    transition: 'transform 0.2s',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[4]
    }
  },
  datasetCardSelected: {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    borderStyle: 'solid'
  },
  datasetMedia: {
    height: 140,
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  apiTypeChip: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
}));

// API构建工作流步骤配置 - 统一为基于Dataset的流程
const apiBuilderSteps = [
  { label: '选择数据集', key: 'dataset-selection' },
  { label: '参数配置', key: 'parameters' },
  { label: 'SQL 编辑', key: 'sql' },
  { label: 'API 详情', key: 'details' },
];

// Dataset创建步骤
const datasetCreationSteps = [
  { label: '数据库连接', key: 'connection' },
  { label: '选择数据表', key: 'table-selection' },
  { label: 'Dataset 元数据', key: 'metadata' },
  { label: '确认创建', key: 'confirmation' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function LowCode() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  
  // 主要状态 - 简化为单一流程
  const [activeStep, setActiveStep] = useState(0);
  const [datasetCreationMode, setDatasetCreationMode] = useState(false); // 是否在创建Dataset模式
  const [tabValue, setTabValue] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetsFilter, setDatasetsFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dataset创建相关状态
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newDatasetMetadata, setNewDatasetMetadata] = useState({
    name: '',
    description: '',
    category: 'project',
    tags: [],
    isPublic: false,
  });
  
  // 其他状态
  const [useJoinTables, setUseJoinTables] = useState(false);
  const [showBatchCreator, setShowBatchCreator] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  
  // 从Redux获取数据集数据
  const datasets = useSelector(state => state.datasets.datasets) || [];
  
  const [apiConfig, setApiConfig] = useState({
    name: '',
    method: 'GET',
    path: '',
    description: '',
    selectedTable: null,
    inputParameters: [],
    outputParameters: [],
    sql: '',
    categories: [],
    requestHeaders: [],
    requestBody: {},
    responseHeaders: [],
    responseBody: {},
    upstreamSystems: [],
    datasetId: null,
    sourceType: null, // 'database', 'dataset', or 'upload'
    type: null, // API_TYPES.LOWCODE_DB, API_TYPES.LOWCODE_DS, or API_TYPES.UPLOADED
    isDatasetBound: false,
  });

  const handleNext = () => {
    const steps = datasetCreationMode ? datasetCreationSteps : apiBuilderSteps;
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      setActiveStep(prevStep);
    } else if (prevStep === -1) {
      // 返回到构建方式选择
      setDatasetCreationMode(false);
    }
  };

  // 点击步骤标签导航
  const handleStepClick = (index) => {
    // 只允许点击已完成的步骤或下一个步骤
    if (index <= activeStep + 1) {
      setActiveStep(index);
    }
  };

  const toggleJoinMode = () => {
    setUseJoinTables(!useJoinTables);
  };

  // 更新API配置
  const updateApiConfig = (newData) => {
    setApiConfig(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 处理Dataset选择 - 如果选择了现有Dataset
  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
    updateApiConfig({
      datasetId: dataset.id,
      name: `${dataset.name}_api`,
      description: `基于数据集 ${dataset.name} 的API`,
      sourceType: 'dataset',
      type: API_TYPES.LOWCODE_DS,
      isDatasetBound: true,
    });
  };

  const handleFilterChange = (event) => {
    setDatasetsFilter(event.target.value);
  };

  // 数据库连接选择完成
  const handleConnectionNext = (connection) => {
    setSelectedConnection(connection);
    handleNext();
  };

  // 创建API并关联数据集
  const handleCreateApi = async () => {
    try {
      setIsSubmitting(true);
      
      // 创建API
      const result = await dispatch(createApi(apiConfig)).unwrap();
      
      // 如果基于数据集构建，关联API到数据集
      if (apiConfig.isDatasetBound && apiConfig.datasetId) {
        await dispatch(linkApiToDataset({
          datasetId: apiConfig.datasetId,
          apiId: result.id
        })).unwrap();
      }
      
      // 导航到API目录
      history.push('/catalog');
    } catch (error) {
      console.error('Error creating API:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 批量创建API处理函数
  const handleBatchCreate = async (apiConfig) => {
    try {
      // 构建完整的API配置
      const fullApiConfig = {
        name: apiConfig.name,
        method: apiConfig.method,
        path: apiConfig.path,
        description: apiConfig.description,
        categories: apiConfig.categories,
        sourceType: apiConfig.sourceType,
        type: apiConfig.type,
        isDatasetBound: apiConfig.isDatasetBound,
        datasetId: apiConfig.isDatasetBound ? apiConfig.sourceItem.id : null,
        connectionId: selectedConnection?.id,
        selectedTable: apiConfig.sourceType === 'database' ? apiConfig.sourceItem : null,
      };

      // 如果启用自动生成参数
      if (apiConfig.autoGenerateParams && apiConfig.sourceType === 'database') {
        const paramSuggestions = ParameterDemoService.generateParameterSuggestions(apiConfig.sourceItem);
        fullApiConfig.inputParameters = paramSuggestions.inputs || [];
        fullApiConfig.outputParameters = paramSuggestions.outputs || [];
      }

      // 创建API
      const result = await dispatch(createApi(fullApiConfig)).unwrap();
      
      // 如果基于数据集构建，关联API到数据集
      if (fullApiConfig.isDatasetBound && fullApiConfig.datasetId) {
        await dispatch(linkApiToDataset({
          datasetId: fullApiConfig.datasetId,
          apiId: result.id
        })).unwrap();
      }
      
      return result;
    } catch (error) {
      console.error('Error creating API:', error);
      throw error;
    }
  };

  // 打开批量创建对话框
  const handleOpenBatchCreator = () => {
    setShowBatchCreator(true);
  };

  // 关闭批量创建对话框
  const handleCloseBatchCreator = () => {
    setShowBatchCreator(false);
  };

  const filteredDatasets = datasets.filter(dataset => {
    if (datasetsFilter === 'all') return true;
    return dataset.type === datasetsFilter;
  });

  const getStepContent = (step) => {
    // Dataset创建模式
    if (datasetCreationMode) {
      switch (step) {
        case 0: // 数据库连接
          return <DatabaseConnection 
            onNext={handleConnectionNext}
          />;
        case 1: // 选择数据表
        case 2: // Dataset元数据
        case 3: // 确认创建
          return <DatasetCreationWizard
            onNext={handleNext}
            onBack={step === 1 ? handleExitDatasetCreation : handleBack}
            onComplete={handleCompleteDatasetCreation}
            connection={selectedConnection}
            step={step}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            metadata={newDatasetMetadata}
            onMetadataChange={handleMetadataChange}
            isSubmitting={isSubmitting}
          />;
        default:
          return null;
      }
    }

    // API构建模式 - 基于Dataset
    switch (step) {
      case 0: // 数据集选择
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Typography variant="h5" gutterBottom>
                选择数据集
              </Typography>
              <Typography variant="body2" color="textSecondary">
                选择一个现有的数据集来构建API，或创建新的数据集
              </Typography>
            </div>

            <Box className={classes.tabsRoot}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="全部数据集" />
                <Tab label="我的数据集" />
                <Tab label="外部数据集" />
              </Tabs>
            </Box>

            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <FormControl variant="outlined" size="small" style={{ width: 200 }}>
                <InputLabel id="dataset-filter-label">数据类型</InputLabel>
                <Select
                  labelId="dataset-filter-label"
                  value={datasetsFilter}
                  onChange={handleFilterChange}
                  label="数据类型"
                >
                  <MenuItem value="all">全部类型</MenuItem>
                  <MenuItem value="structured">结构化数据</MenuItem>
                  <MenuItem value="unstructured">非结构化数据</MenuItem>
                  <MenuItem value="semi_structured">半结构化数据</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Button 
                  variant="outlined"
                  color="primary" 
                  onClick={handleCreateDataset}
                  style={{ marginRight: 16 }}
                >
                  创建新数据集
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNext}
                  disabled={!selectedDataset}
                >
                  下一步
                </Button>
              </Box>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <Grid item xs={12} sm={6} md={4} key={dataset.id}>
                      <Card 
                        className={`${classes.datasetCard} ${selectedDataset?.id === dataset.id ? classes.datasetCardSelected : ''}`}
                        onClick={() => handleDatasetSelect(dataset)}
                      >
                        <CardMedia className={classes.datasetMedia}>
                          {dataset.icon || <StorageIcon style={{ fontSize: 60 }} />}
                        </CardMedia>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>{dataset.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{dataset.description}</Typography>
                          <Box mt={1} display="flex" flexWrap="wrap">
                            <Chip 
                              label={dataset.type || 'structured'} 
                              size="small" 
                              style={{ margin: '2px' }}
                            />
                            <Chip 
                              label={dataset.source || 'internal'} 
                              size="small" 
                              style={{ margin: '2px' }}
                            />
                            <Chip 
                              label={`${dataset.linkedApis?.length || 0} 个关联API`} 
                              size="small" 
                              style={{ margin: '2px' }}
                              color={dataset.linkedApis?.length ? 'primary' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper style={{ padding: 16, textAlign: 'center' }}>
                      <Typography variant="body1" gutterBottom>
                        暂无数据集
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        您可以创建新的数据集来开始构建API
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        style={{ marginTop: 16 }}
                        onClick={handleCreateDataset}
                      >
                        创建数据集
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="body1">我的数据集（开发中）</Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1">外部数据集（开发中）</Typography>
            </TabPanel>
          </div>
        );
      case 1: // 参数配置
        return <ParameterSelection 
          onNext={handleNext} 
          onBack={handleBack} 
          apiConfig={apiConfig}
          updateApiConfig={updateApiConfig}
          selectedDataset={selectedDataset}
        />;
      case 2: // SQL编辑
        return <SqlEditor 
          onNext={handleNext} 
          onBack={handleBack} 
          apiConfig={apiConfig}
          updateApiConfig={updateApiConfig}
          selectedDataset={selectedDataset}
        />;
      case 3: // API详情
        return <ApiDetailsEditor 
          onFinish={handleCreateApi}
          onBack={handleBack} 
          apiConfig={apiConfig}
          updateApiConfig={updateApiConfig}
          isDatasetBased={true}
          datasetInfo={selectedDataset}
          isSubmitting={isSubmitting}
        />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Typography variant="h6">未知步骤</Typography>
          </div>
        );
    }
  };

  // 根据构建方式获取步骤
  const getSteps = () => {
    if (datasetCreationMode) {
      return datasetCreationSteps;
    } else {
      return apiBuilderSteps;
    }
  };

  // 进入Dataset创建模式
  const handleCreateDataset = () => {
    setDatasetCreationMode(true);
    setActiveStep(0);
  };

  // 退出Dataset创建模式，回到Dataset选择
  const handleExitDatasetCreation = () => {
    setDatasetCreationMode(false);
    setActiveStep(0);
    setSelectedConnection(null);
    setSelectedTable(null);
    setNewDatasetMetadata({
      name: '',
      description: '',
      category: 'project',
      tags: [],
      isPublic: false,
    });
  };

  // 数据表选择完成
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    // 自动填充Dataset元数据
    setNewDatasetMetadata(prev => ({
      ...prev,
      name: prev.name || `${table.name}_dataset`,
      description: prev.description || `基于数据表 ${table.name} 创建的数据集`,
      tags: [...new Set([...prev.tags, table.name, 'project', 'table'])],
    }));
    handleNext();
  };

  // Dataset元数据更新
  const handleMetadataChange = (field, value) => {
    setNewDatasetMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 完成Dataset创建
  const handleCompleteDatasetCreation = async () => {
    try {
      setIsSubmitting(true);
      
      // 创建Dataset
      const datasetData = {
        ...newDatasetMetadata,
        sourceTable: selectedTable.name,
        sourceConnection: selectedConnection.id,
        tableSchema: selectedTable.columns || [],
        uploadMode: 'table_binding',
        fileCount: 1,
        dataSize: selectedTable.size || '未知',
      };

      // 调用创建Dataset API
      const createdDataset = await DatasetManagementService.uploadDataset(
        new FormData(),
        null
      );

      // 自动选择刚创建的Dataset，并退出创建模式
      setSelectedDataset(createdDataset);
      setDatasetCreationMode(false);
      setActiveStep(0);
      
      updateApiConfig({
        datasetId: createdDataset.id,
        name: `${createdDataset.name}_api`,
        description: `基于数据集 ${createdDataset.name} 的API`,
        sourceType: 'dataset',
        type: API_TYPES.LOWCODE_DS,
        isDatasetBound: true,
      });

      setIsSubmitting(false);
    } catch (error) {
      console.error('创建Dataset失败:', error);
      
      // 使用模拟数据
      const mockDataset = {
        id: `dataset_${Date.now()}`,
        name: newDatasetMetadata.name,
        description: newDatasetMetadata.description,
        category: 'project',
        sourceTable: selectedTable.name,
        createdAt: new Date().toISOString(),
      };
      
      setSelectedDataset(mockDataset);
      setDatasetCreationMode(false);
      setActiveStep(0);
      
      updateApiConfig({
        datasetId: mockDataset.id,
        name: `${mockDataset.name}_api`,
        description: `基于数据集 ${mockDataset.name} 的API`,
        sourceType: 'dataset',
        type: API_TYPES.LOWCODE_DS,
        isDatasetBound: true,
      });

      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper className={classes.stepperContainer}>
        <Typography variant="h4" align="center" gutterBottom>
          API工坊 - {datasetCreationMode ? 'Dataset创建' : '基于数据集构建API'}
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {getSteps().map((step, index) => (
            <Step key={step.key} onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <div className={classes.contentContainer}>
        {getStepContent(activeStep)}
      </div>

      {/* 批量创建API的浮动按钮 - 只在API构建模式显示 */}
      {!datasetCreationMode && datasets.length > 0 && (
        <Tooltip title="批量创建API" placement="left">
          <Fab
            color="secondary"
            aria-label="batch-create"
            onClick={handleOpenBatchCreator}
            style={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <BatchIcon />
          </Fab>
        </Tooltip>
      )}

      {/* 批量创建API对话框 */}
      <ApiBatchCreator
        open={showBatchCreator}
        onClose={handleCloseBatchCreator}
        onBatchCreate={handleBatchCreate}
        availableTables={availableTables}
        availableDatasets={datasets}
        sourceType="dataset"
      />
    </Container>
  );
}

export default LowCode;
