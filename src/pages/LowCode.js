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
  CircularProgress
} from '@material-ui/core';
import { 
  ArrowBack, 
  ArrowForward, 
  Storage as StorageIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  PublishOutlined as PublishIcon
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatabaseConnection from '../components/DatabaseConnection';
import TableSelection from '../components/TableSelection';
import ParameterSelection from '../components/ParameterSelection';
import SqlEditor from '../components/SqlEditor';
import ApiDetailsEditor from '../components/ApiDetailsEditor';
import ApiList from '../components/ApiList';
import JoinTablesBuilder from '../components/JoinTablesBuilder';
import { API_TYPES, createApi } from '../redux/slices/apiSlice';
import { selectAllDatasets, linkApiToDataset } from '../redux/slices/datasetSlice';

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

// API构建工作流步骤配置
const databaseSteps = [
  { label: '数据库连接', key: 'connection' },
  { label: '表格选择', key: 'tables' },
  { label: '参数选择', key: 'parameters' },
  { label: 'SQL 编辑', key: 'sql' },
  { label: 'API 详情', key: 'details' },
];

const datasetSteps = [
  { label: '数据集选择', key: 'dataset' },
  { label: '数据接口配置', key: 'interface' },
  { label: '参数映射', key: 'parameters' },
  { label: 'API 详情', key: 'details' },
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
  
  const [buildMode, setBuildMode] = useState(null); // 'database' or 'dataset'
  const [activeStep, setActiveStep] = useState(0);
  const [useJoinTables, setUseJoinTables] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetsFilter, setDatasetsFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  
  // 从Redux获取数据集数据
  const datasets = useSelector(selectAllDatasets) || [];
  
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
    const steps = buildMode === 'database' ? databaseSteps : datasetSteps;
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
      setBuildMode(null);
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

  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
    updateApiConfig({
      datasetId: dataset.id,
      name: `${dataset.name} API`,
      description: `基于${dataset.name}的API接口`,
      sourceType: 'dataset',
      type: API_TYPES.LOWCODE_DS,
      isDatasetBound: true,
    });
  };

  const handleBuildModeSelect = (mode) => {
    setBuildMode(mode);
    setActiveStep(0);
    
    // 设置API类型
    if (mode === 'database') {
      updateApiConfig({
        sourceType: 'database',
        type: API_TYPES.LOWCODE_DB,
        isDatasetBound: false,
        datasetId: null
      });
    } else if (mode === 'dataset') {
      updateApiConfig({
        sourceType: 'dataset',
        type: API_TYPES.LOWCODE_DS,
        isDatasetBound: true,
        datasetId: null
      });
    }
  };

  const handleFilterChange = (event) => {
    setDatasetsFilter(event.target.value);
  };

  const handleConnectionSelect = (connection) => {
    setSelectedConnection(connection);
    // 更新API配置，添加数据库连接信息
    updateApiConfig({
      connectionId: connection.id,
      connectionConfig: {
        type: connection.type,
        host: connection.host,
        port: connection.port,
        database: connection.database
      }
    });
  };
  
  const handleConnectionNext = (connection) => {
    // 确保我们有所选的连接
    if (connection) {
      setSelectedConnection(connection);
      // 更新API配置，添加数据库连接信息
      updateApiConfig({
        connectionId: connection.id,
        connectionConfig: {
          type: connection.type,
          host: connection.host,
          port: connection.port,
          database: connection.database
        }
      });
    }
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

  const filteredDatasets = datasetsFilter === 'all' 
    ? datasets 
    : datasets.filter(ds => ds.type === datasetsFilter);

  const getStepContent = (step) => {
    // 如果没有选择构建方式，显示选择界面
    if (buildMode === null) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              选择API构建方式
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card 
              className={classes.choiceCard} 
              elevation={3}
              onClick={() => handleBuildModeSelect('dataset')}
            >
              <CardContent style={{ textAlign: 'center' }}>
                <StorageIcon className={classes.cardIcon} />
                <Typography variant="h5" gutterBottom>
                  基于数据集构建
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  从已有数据集构建API，快速创建数据接口，支持内部平台数据集和外部接入数据集
                </Typography>
                <Box mt={2}>
                  <Chip 
                    icon={<LinkIcon />} 
                    label="支持数据集绑定" 
                    color="primary" 
                    variant="outlined"
                    className={classes.apiTypeChip}
                  />
                  <Chip 
                    icon={<EditIcon />} 
                    label="需要审核发布" 
                    color="secondary" 
                    variant="outlined"
                    className={classes.apiTypeChip}
                  />
                </Box>
              </CardContent>
              <CardActions style={{ justifyContent: 'center', paddingBottom: 16 }}>
                <Button variant="contained" color="primary">
                  选择此方式
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card 
              className={classes.choiceCard} 
              elevation={3}
              onClick={() => handleBuildModeSelect('database')}
            >
              <CardContent style={{ textAlign: 'center' }}>
                <DatabaseIcon className={classes.cardIcon} />
                <Typography variant="h5" gutterBottom>
                  基于数据库构建
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  连接数据库构建API，支持复杂查询和自定义SQL，适合需要直接访问数据库的场景
                </Typography>
                <Box mt={2}>
                  <Chip 
                    icon={<DatabaseIcon />} 
                    label="使用SQL查询" 
                    color="primary" 
                    variant="outlined"
                    className={classes.apiTypeChip}
                  />
                  <Chip 
                    icon={<EditIcon />} 
                    label="需要审核发布" 
                    color="secondary" 
                    variant="outlined"
                    className={classes.apiTypeChip}
                  />
                </Box>
              </CardContent>
              <CardActions style={{ justifyContent: 'center', paddingBottom: 16 }}>
                <Button variant="contained" color="primary">
                  选择此方式
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} mt={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  API类型说明
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>基于数据集构建的API：</strong> 此类API与数据集绑定，需要进行审核发布流程，订阅后需要绑定service account白名单才能访问。
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>基于数据库构建的API：</strong> 此类API直接从数据库构建，需要进行审核发布流程，订阅后需要绑定service account白名单才能访问。
                </Typography>
                <Typography variant="body2">
                  <strong>已上传API信息：</strong> 在"API目录"页面可以上传已有API的信息，此类API不需要审核和白名单绑定，仅用于展示API信息。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }

    // 根据不同构建方式和步骤渲染内容
    if (buildMode === 'database') {
      switch (step) {
        case 0:
          return <DatabaseConnection 
            onNext={handleConnectionNext}
            onSelect={handleConnectionSelect}
          />;
        case 1:
          // 确保我们有数据库连接信息
          if (!selectedConnection) {
            setActiveStep(0);
            setNotification({
              open: true,
              message: '请先选择或创建一个数据库连接',
              severity: 'warning',
            });
            return null;
          }
          
          return useJoinTables ? (
            <JoinTablesBuilder
              onConfigure={(tables, mainTable, joins) => {
                updateApiConfig({
                  tables,
                  selectedTable: mainTable,
                  joins,
                });
                handleNext();
              }}
              connection={selectedConnection}
              toggleJoinMode={toggleJoinMode}
            />
          ) : (
            <TableSelection
              onSelect={(table) => {
                updateApiConfig({
                  selectedTable: table,
                  tables: [table],
                });
                handleNext();
              }}
              toggleJoinMode={toggleJoinMode}
              connection={selectedConnection}
            />
          );
        case 2:
          return <ParameterSelection 
            onNext={handleNext} 
            onBack={handleBack} 
            apiConfig={apiConfig}
            updateApiConfig={updateApiConfig} 
          />;
        case 3:
          return <SqlEditor 
            onNext={handleNext} 
            onBack={handleBack} 
            apiConfig={apiConfig}
            updateApiConfig={updateApiConfig} 
          />;
        case 4:
          return <ApiDetailsEditor 
            onFinish={handleCreateApi}
            onBack={handleBack} 
            apiConfig={apiConfig}
            updateApiConfig={updateApiConfig}
            isDatasetBased={false}
            isSubmitting={isSubmitting}
          />;
        default:
          return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Typography variant="h6">未知步骤</Typography>
            </div>
          );
      }
    } else if (buildMode === 'dataset') {
      switch (step) {
        case 0:
          // 数据集选择步骤
          return (
            <div>
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

                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNext}
                  disabled={!selectedDataset}
                >
                  下一步
                </Button>
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
                        <Typography variant="body1">
                          暂无数据集，请先创建或导入数据集
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          style={{ marginTop: 16 }}
                          onClick={() => history.push('/datasets/new')}
                        >
                          创建数据集
                        </Button>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="body1">我的数据集（暂无数据）</Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="body1">外部数据集（暂无数据）</Typography>
              </TabPanel>
            </div>
          );
        case 1:
          // 数据接口配置步骤 - 这里需要实现数据集接口配置的组件
          return (
            <div>
              <Typography variant="h5" gutterBottom>数据接口配置</Typography>
              <Typography variant="body1" paragraph>
                为{selectedDataset?.name}配置接口属性
              </Typography>
              
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  返回
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                  下一步
                </Button>
              </Box>
            </div>
          );
        case 2:
          // 参数映射步骤 - 这里需要实现参数映射的组件
          return (
            <div>
              <Typography variant="h5" gutterBottom>参数映射</Typography>
              <Typography variant="body1" paragraph>
                配置API输入参数与数据集字段的映射关系
              </Typography>
              
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  返回
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                  下一步
                </Button>
              </Box>
            </div>
          );
        case 3:
          // API详情步骤
          return (
            <ApiDetailsEditor 
              onFinish={handleCreateApi}
              onBack={handleBack} 
              apiConfig={apiConfig}
              updateApiConfig={updateApiConfig} 
              isDatasetBased={true}
              datasetInfo={selectedDataset}
              isSubmitting={isSubmitting}
            />
          );
        default:
          return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Typography variant="h6">未知步骤</Typography>
            </div>
          );
      }
    }
  };

  // 根据构建方式获取步骤
  const getSteps = () => {
    if (buildMode === 'database') {
      return databaseSteps;
    } else if (buildMode === 'dataset') {
      return datasetSteps;
    }
    return [];
  };

  return (
    <Container maxWidth="lg">
      {buildMode && (
        <Paper className={classes.stepperContainer}>
          <Typography variant="h4" align="center" gutterBottom>
            API工坊 - {buildMode === 'database' ? '数据库' : '数据集'}API构建
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {getSteps().map((step, index) => (
              <Step key={step.key} onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <div className={classes.contentContainer}>
        {getStepContent(activeStep)}
      </div>
    </Container>
  );
}

export default LowCode; 