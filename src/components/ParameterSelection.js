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
  IconButton,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ArrowBack,
  ArrowForward,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
} from '@material-ui/icons';
import ParameterDemoService from '../services/ParameterDemoService';

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
  tabs: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  validationChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  infoIcon: {
    fontSize: '1rem',
    marginLeft: theme.spacing(0.5),
    color: theme.palette.info.main,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  tablePaper: {
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  paramTypeLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  propertyGroup: {
    marginBottom: theme.spacing(2),
  },
  exampleValue: {
    fontFamily: 'monospace',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
  },
}));

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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function ParameterSelection({ onNext, onBack, apiConfig, updateApiConfig }) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [inputParams, setInputParams] = useState([]);
  const [outputParams, setOutputParams] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedParam, setSelectedParam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newParam, setNewParam] = useState({
    name: '',
    type: 'string',
    location: 'query',
    required: false,
    description: '',
    defaultValue: '',
    validationRules: [],
  });

  // 从服务获取参数类型选项
  const paramTypes = ParameterDemoService.parameterTypes;
  const paramLocations = ParameterDemoService.parameterLocations;
  const validationRules = ParameterDemoService.validationRules;
  
  // 加载初始参数
  useEffect(() => {
    console.log('ParameterSelection useEffect triggered, apiConfig:', apiConfig);
    loadDemoParameters();
  }, [apiConfig]);

  // 加载演示参数数据
  const loadDemoParameters = async () => {
    console.log('开始加载参数，当前 apiConfig:', apiConfig);
    setIsLoading(true);
    
    try {
      // 基于表结构生成建议的参数
      if (apiConfig.selectedTable || (apiConfig.tables && apiConfig.tables.length > 0)) {
        console.log('找到表信息，开始生成参数');
        // 减少延迟时间并使用 Promise 替代 setTimeout
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let paramSuggestions;
        
        // 检查是否是多表连接
        if (apiConfig.joins && apiConfig.joins.length > 0 && apiConfig.tables && apiConfig.tables.length > 1) {
          console.log('生成多表连接参数');
          paramSuggestions = ParameterDemoService.generateJoinParameters(apiConfig.tables, apiConfig.joins);
        } else if (apiConfig.selectedTable) {
          // 单表模式
          console.log('生成单表参数，表:', apiConfig.selectedTable.name);
          paramSuggestions = ParameterDemoService.generateParameterSuggestions(apiConfig.selectedTable);
        } else if (apiConfig.tables && apiConfig.tables.length > 0) {
          // 如果没有selectedTable但有tables数组，使用第一个表
          console.log('使用tables数组第一个表生成参数，表:', apiConfig.tables[0].name);
          paramSuggestions = ParameterDemoService.generateParameterSuggestions(apiConfig.tables[0]);
        } else {
          // 没有表信息时返回空参数
          console.log('没有表信息，返回空参数');
          paramSuggestions = { inputs: [], outputs: [] };
        }
        
        console.log('生成的参数建议:', paramSuggestions);
        
        // 确保参数数组存在
        const inputs = paramSuggestions.inputs || [];
        const outputs = paramSuggestions.outputs || [];
        
        setInputParams(inputs);
        setOutputParams(outputs);
        
        // 更新API配置
        if (updateApiConfig) {
          updateApiConfig({
            inputParameters: inputs,
            outputParameters: outputs
          });
        }
        
        // 显示成功消息
        if (inputs.length > 0 || outputs.length > 0) {
          setNotification({
            open: true,
            message: `成功加载 ${inputs.length} 个输入参数和 ${outputs.length} 个输出参数`,
            severity: 'success',
          });
        } else {
          setNotification({
            open: true,
            message: '未生成任何参数，请检查表结构',
            severity: 'warning',
          });
        }
      } else {
        console.log('没有表信息，显示警告');
        // 没有表信息时显示警告
        setNotification({
          open: true,
          message: '无法加载参数，请先选择表格',
          severity: 'warning',
        });
        // 设置空参数
        setInputParams([]);
        setOutputParams([]);
        if (updateApiConfig) {
          updateApiConfig({
            inputParameters: [],
            outputParameters: []
          });
        }
      }
    } catch (error) {
      console.error('Error loading parameters:', error);
      setNotification({
        open: true,
        message: error.message || '加载参数时出错',
        severity: 'error',
      });
      // 设置空参数作为后备
      setInputParams([]);
      setOutputParams([]);
      if (updateApiConfig) {
        updateApiConfig({
          inputParameters: [],
          outputParameters: []
        });
      }
    } finally {
      // 确保无论如何都会结束加载状态
      setIsLoading(false);
      console.log('参数加载完成');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedParam(null);
  };

  const handleSelectParameter = (param) => {
    setSelectedParam(param);
    setIsEditing(false);
  };

  const handleEditParameter = () => {
    if (selectedParam) {
      setNewParam({ ...selectedParam });
      setIsEditing(true);
    }
  };

  const handleDeleteParameter = () => {
    if (!selectedParam) return;

    // 根据选项卡删除参数
    if (tabValue === 0) {
      // 删除输入参数
      const updatedParams = inputParams.filter((p) => p.id !== selectedParam.id);
      setInputParams(updatedParams);
      
      // 更新API配置
      if (updateApiConfig) {
        updateApiConfig({
          inputParameters: updatedParams
        });
      }
    } else {
      // 删除输出参数
      const updatedParams = outputParams.filter((p) => p.id !== selectedParam.id);
      setOutputParams(updatedParams);
      
      // 更新API配置
      if (updateApiConfig) {
        updateApiConfig({
          outputParameters: updatedParams
        });
      }
    }

    setSelectedParam(null);
    setNotification({
      open: true,
      message: '参数已删除',
      severity: 'success',
    });
  };

  const handleAddParameter = () => {
    // 创建新参数
    setNewParam({
      id: `param_${Date.now()}`,
      name: '',
      type: 'string',
      location: tabValue === 0 ? 'query' : undefined,
      required: false,
      description: '',
      defaultValue: '',
      validationRules: [],
    });
    setIsEditing(true);
    setSelectedParam(null);
  };

  const handleSaveParameter = () => {
    // 验证参数
    if (!newParam.name || newParam.name.trim() === '') {
      setNotification({
        open: true,
        message: '参数名称不能为空',
        severity: 'error',
      });
      return;
    }

    // 检查参数名称是否重复
    const currentParams = tabValue === 0 ? inputParams : outputParams;
    const isDuplicate = currentParams.some(param => 
      param.name === newParam.name.trim() && 
      (!isEditing || param.id !== newParam.id)
    );

    if (isDuplicate) {
      setNotification({
        open: true,
        message: '参数名称已存在，请使用不同的名称',
        severity: 'error',
      });
      return;
    }

    // 验证必要字段
    if (tabValue === 0 && !newParam.location) {
      setNotification({
        open: true,
        message: '请选择参数位置',
        severity: 'error',
      });
      return;
    }

    try {
      // 确保id存在
      const paramToSave = {
        ...newParam,
        name: newParam.name.trim(),
        id: newParam.id || `param_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      if (tabValue === 0) {
        // 保存输入参数
        const updatedParams = isEditing
          ? inputParams.map((p) => (p.id === paramToSave.id ? paramToSave : p))
          : [...inputParams, paramToSave];
          
        setInputParams(updatedParams);
        
        // 更新API配置
        if (updateApiConfig) {
          updateApiConfig({
            inputParameters: updatedParams
          });
        }
      } else {
        // 保存输出参数
        const updatedParams = isEditing
          ? outputParams.map((p) => (p.id === paramToSave.id ? paramToSave : p))
          : [...outputParams, paramToSave];
          
        setOutputParams(updatedParams);
        
        // 更新API配置
        if (updateApiConfig) {
          updateApiConfig({
            outputParameters: updatedParams
          });
        }
      }

      // 重置编辑状态
      setIsEditing(false);
      setSelectedParam(paramToSave);
      setNewParam({
        name: '',
        type: 'string',
        location: 'query',
        required: false,
        description: '',
        defaultValue: '',
        validationRules: [],
      });

      setNotification({
        open: true,
        message: isEditing ? '参数已更新' : '参数已添加',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error saving parameter:', error);
      setNotification({
        open: true,
        message: '保存参数时发生错误',
        severity: 'error',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChangeNewParam = (field, value) => {
    setNewParam({
      ...newParam,
      [field]: value,
    });
  };

  const handleToggleRequired = (event) => {
    handleChangeNewParam('required', event.target.checked);
  };

  const handleAddValidationRule = (ruleType) => {
    // 检查是否已经存在该规则
    if (newParam.validationRules.some(rule => rule.type === ruleType)) {
      return;
    }
    
    // 根据规则类型设置默认值
    let defaultValue;
    switch (ruleType) {
      case 'required':
        defaultValue = true;
        break;
      case 'min':
      case 'max':
        defaultValue = 0;
        break;
      case 'minLength':
      case 'maxLength':
        defaultValue = 1;
        break;
      case 'enum':
        defaultValue = ['选项1', '选项2'];
        break;
      case 'pattern':
        defaultValue = '.*';
        break;
      default:
        defaultValue = true;
    }
    
    const updatedRules = [
      ...newParam.validationRules,
      { type: ruleType, value: defaultValue }
    ];
    
    handleChangeNewParam('validationRules', updatedRules);
  };

  const handleRemoveValidationRule = (ruleType) => {
    const updatedRules = newParam.validationRules.filter(
      rule => rule.type !== ruleType
    );
    handleChangeNewParam('validationRules', updatedRules);
  };

  const handleUpdateValidationRule = (ruleType, value) => {
    const updatedRules = newParam.validationRules.map(rule => {
      if (rule.type === ruleType) {
        return { ...rule, value };
      }
      return rule;
    });
    handleChangeNewParam('validationRules', updatedRules);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleNext = () => {
    // 更新API配置
    if (updateApiConfig) {
      updateApiConfig({
        inputParameters: inputParams,
        outputParameters: outputParams
      });
    }
    onNext();
  };

  // 过滤参数
  const filteredInputParams = inputParams.filter(
    (param) =>
      param.name.toLowerCase().includes(filterText.toLowerCase()) ||
      param.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredOutputParams = outputParams.filter(
    (param) =>
      param.name.toLowerCase().includes(filterText.toLowerCase()) ||
      param.description.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        参数配置
      </Typography>

      <div className={classes.searchContainer}>
        <TextField
          className={classes.filterField}
          variant="outlined"
          size="small"
          label="搜索参数"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ width: 300 }}
        />
        <Box>
          <Button
            variant="outlined"
            onClick={loadDemoParameters}
            disabled={isLoading}
            style={{ marginRight: 8 }}
            startIcon={isLoading ? <CircularProgress size={14} /> : <InfoIcon />}
          >
            {isLoading ? '加载中...' : '重新加载参数'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddParameter}
          >
            添加参数
          </Button>
        </Box>
      </div>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className={classes.tabs}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label={`输入参数 (${inputParams.length})`} />
        <Tab label={`输出参数 (${outputParams.length})`} />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.tablePaper} variant="outlined">
            {isLoading && (
              <div className={classes.loading}>
                <CircularProgress />
              </div>
            )}
            <TableContainer>
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headerCell}>参数名称</TableCell>
                    <TableCell className={classes.headerCell}>类型</TableCell>
                    {tabValue === 0 && (
                      <>
                        <TableCell className={classes.headerCell}>位置</TableCell>
                        <TableCell className={classes.headerCell} align="center">必填</TableCell>
                      </>
                    )}
                    <TableCell className={classes.headerCell}>描述</TableCell>
                    <TableCell className={classes.headerCell} align="center">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tabValue === 0 ? filteredInputParams : filteredOutputParams).map((param) => (
                    <TableRow
                      key={param.id}
                      hover
                      selected={selectedParam?.id === param.id}
                      onClick={() => handleSelectParameter(param)}
                    >
                      <TableCell component="th" scope="row">
                        {param.name}
                      </TableCell>
                      <TableCell>{param.type}</TableCell>
                      {tabValue === 0 && (
                        <>
                          <TableCell>{param.location}</TableCell>
                          <TableCell align="center">
                            {param.required ? (
                              <CheckCircleIcon color="primary" fontSize="small" />
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </>
                      )}
                      <TableCell>{param.description}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          className={classes.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectParameter(param);
                            handleEditParameter();
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectParameter(param);
                            handleDeleteParameter();
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(tabValue === 0 ? filteredInputParams.length === 0 : filteredOutputParams.length === 0) && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={tabValue === 0 ? 6 : 4} align="center" style={{ padding: '40px 16px' }}>
                        {(tabValue === 0 ? inputParams.length === 0 : outputParams.length === 0) ? (
                          <Box>
                            <InfoIcon style={{ fontSize: 48, color: '#bdbdbd', marginBottom: 16 }} />
                            <Typography variant="h6" color="textSecondary">
                              暂无{tabValue === 0 ? '输入' : '输出'}参数
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                              {apiConfig.selectedTable || (apiConfig.tables && apiConfig.tables.length > 0) 
                                ? '点击"重新加载参数"按钮重试，或手动添加参数'
                                : '请先选择数据表，然后系统会自动生成参数建议'
                              }
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="body1" color="textSecondary">
                              没有找到匹配 "{filterText}" 的参数
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                              尝试更改搜索条件或清空搜索框
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {isEditing ? (
            // 参数编辑表单
            <Paper className={classes.parameterDetails} variant="outlined">
              <Typography variant="h6" gutterBottom>
                {isEditing ? '编辑参数' : '添加参数'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="参数名称"
                    value={newParam.name}
                    onChange={(e) => handleChangeNewParam('name', e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>参数类型</InputLabel>
                    <Select
                      value={newParam.type}
                      onChange={(e) => handleChangeNewParam('type', e.target.value)}
                    >
                      {paramTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {tabValue === 0 && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>参数位置</InputLabel>
                      <Select
                        value={newParam.location || ''}
                        onChange={(e) => handleChangeNewParam('location', e.target.value)}
                      >
                        {paramLocations.map((loc) => (
                          <MenuItem key={loc.value} value={loc.value}>
                            {loc.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="描述"
                    value={newParam.description}
                    onChange={(e) => handleChangeNewParam('description', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                {tabValue === 0 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="默认值"
                        value={newParam.defaultValue || ''}
                        onChange={(e) => handleChangeNewParam('defaultValue', e.target.value)}
                        placeholder="默认值"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!newParam.required}
                            onChange={handleToggleRequired}
                            color="primary"
                          />
                        }
                        label="必填参数"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        验证规则
                      </Typography>
                      
                      <Box mb={1}>
                        {newParam.validationRules.map((rule) => (
                          <Chip
                            key={rule.type}
                            label={`${validationRules.find(r => r.value === rule.type)?.label}: ${rule.value}`}
                            onDelete={() => handleRemoveValidationRule(rule.type)}
                            className={classes.validationChip}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <FormControl fullWidth size="small">
                        <InputLabel>添加验证规则</InputLabel>
                        <Select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddValidationRule(e.target.value);
                              e.target.value = ''; // 重置选择
                            }
                          }}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            选择规则类型
                          </MenuItem>
                          {validationRules
                            .filter(rule => !newParam.validationRules.some(r => r.type === rule.value))
                            .map((rule) => (
                              <MenuItem key={rule.value} value={rule.value}>
                                {rule.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {tabValue === 1 && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="示例值"
                      value={newParam.example || ''}
                      onChange={(e) => handleChangeNewParam('example', e.target.value)}
                      placeholder="示例值"
                    />
                  </Grid>
                )}
              </Grid>

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  onClick={handleCancelEdit}
                  style={{ marginRight: 8 }}
                >
                  取消
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveParameter}
                >
                  保存
                </Button>
              </Box>
            </Paper>
          ) : selectedParam ? (
            // 参数详情视图
            <Paper className={classes.parameterDetails} variant="outlined">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">参数详情</Typography>
                <Box>
                  <IconButton
                    size="small"
                    className={classes.actionButton}
                    onClick={handleEditParameter}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleDeleteParameter}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <div className={classes.propertyGroup}>
                <Typography variant="subtitle2" color="textSecondary">
                  参数名称
                </Typography>
                <Typography variant="body1">{selectedParam.name}</Typography>
              </div>

              <div className={classes.propertyGroup}>
                <Typography variant="subtitle2" color="textSecondary">
                  参数类型
                </Typography>
                <Typography variant="body1" className={classes.paramTypeLabel}>
                  {paramTypes.find(t => t.value === selectedParam.type)?.label || selectedParam.type}
                </Typography>
              </div>

              {tabValue === 0 && selectedParam.location && (
                <div className={classes.propertyGroup}>
                  <Typography variant="subtitle2" color="textSecondary">
                    参数位置
                  </Typography>
                  <Typography variant="body1">
                    {paramLocations.find(l => l.value === selectedParam.location)?.label || selectedParam.location}
                  </Typography>
                </div>
              )}

              <div className={classes.propertyGroup}>
                <Typography variant="subtitle2" color="textSecondary">
                  描述
                </Typography>
                <Typography variant="body1">
                  {selectedParam.description || '(无描述)'}
                </Typography>
              </div>

              {tabValue === 0 && (
                <>
                  <div className={classes.propertyGroup}>
                    <Typography variant="subtitle2" color="textSecondary">
                      是否必填
                    </Typography>
                    <Typography variant="body1">
                      {selectedParam.required ? '是' : '否'}
                    </Typography>
                  </div>

                  {selectedParam.defaultValue && (
                    <div className={classes.propertyGroup}>
                      <Typography variant="subtitle2" color="textSecondary">
                        默认值
                      </Typography>
                      <Typography variant="body1">
                        {selectedParam.defaultValue}
                      </Typography>
                    </div>
                  )}

                  {selectedParam.validationRules && selectedParam.validationRules.length > 0 && (
                    <div className={classes.propertyGroup}>
                      <Typography variant="subtitle2" color="textSecondary">
                        验证规则
                      </Typography>
                      <Box mt={1}>
                        {selectedParam.validationRules.map((rule) => (
                          <Chip
                            key={rule.type}
                            label={`${validationRules.find(r => r.value === rule.type)?.label}: ${rule.value}`}
                            className={classes.validationChip}
                            size="small"
                          />
                        ))}
                      </Box>
                    </div>
                  )}
                </>
              )}

              {tabValue === 1 && selectedParam.example && (
                <div className={classes.propertyGroup}>
                  <Typography variant="subtitle2" color="textSecondary">
                    示例值
                  </Typography>
                  <Box mt={1} className={classes.exampleValue}>
                    {selectedParam.example}
                  </Box>
                </div>
              )}
            </Paper>
          ) : (
            // 未选择参数时的提示
            <Paper className={classes.parameterDetails} variant="outlined">
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
                <HelpIcon style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                <Typography variant="body1" align="center" color="textSecondary">
                  选择一个参数查看详情，或点击"添加参数"按钮创建新参数
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="default"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          上一步
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