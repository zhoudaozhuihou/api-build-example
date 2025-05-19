import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Divider,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@material-ui/core';
import {
  CloudUpload as UploadIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createApi, API_TYPES } from '../redux/slices/apiSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  formContainer: {
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  infoCard: {
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  categorySelect: {
    minWidth: 200,
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  headerTitle: {
    fontWeight: 600,
  },
  successIcon: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
    fontSize: 20,
  }
}));

const steps = ['基本信息', '接口参数', '文档与提交'];

const ApiUploadForm = ({ onSuccess }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // 获取分类列表
  const categories = useSelector(state => state.api.categories || []);
  
  // 表单数据
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    method: 'GET',
    path: '',
    categories: [],
    requestParameters: [],
    responseParameters: [],
    authType: 'none',
    documentationUrl: '',
    contactEmail: '',
    tags: [],
    type: API_TYPES.UPLOADED, // 这是一个上传的API
    isDatasetBound: false,    // 不绑定数据集
  });
  
  // 临时状态
  const [newTag, setNewTag] = useState('');
  const [tempRequestParam, setTempRequestParam] = useState({ 
    name: '', 
    type: 'string', 
    required: false, 
    description: '' 
  });
  const [tempResponseParam, setTempResponseParam] = useState({ 
    name: '', 
    type: 'string', 
    description: '' 
  });
  
  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理方法变化
  const handleMethodChange = (e) => {
    setFormData(prev => ({
      ...prev,
      method: e.target.value
    }));
  };
  
  // 处理分类变化
  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      categories: e.target.value
    }));
  };
  
  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // 删除标签
  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };
  
  // 处理请求参数输入
  const handleRequestParamChange = (e) => {
    const { name, value } = e.target;
    setTempRequestParam(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理响应参数输入
  const handleResponseParamChange = (e) => {
    const { name, value } = e.target;
    setTempResponseParam(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 添加请求参数
  const handleAddRequestParam = () => {
    if (tempRequestParam.name.trim()) {
      setFormData(prev => ({
        ...prev,
        requestParameters: [...prev.requestParameters, tempRequestParam]
      }));
      setTempRequestParam({ name: '', type: 'string', required: false, description: '' });
    }
  };
  
  // 添加响应参数
  const handleAddResponseParam = () => {
    if (tempResponseParam.name.trim()) {
      setFormData(prev => ({
        ...prev,
        responseParameters: [...prev.responseParameters, tempResponseParam]
      }));
      setTempResponseParam({ name: '', type: 'string', description: '' });
    }
  };
  
  // 删除请求参数
  const handleDeleteRequestParam = (index) => {
    setFormData(prev => ({
      ...prev,
      requestParameters: prev.requestParameters.filter((_, i) => i !== index)
    }));
  };
  
  // 删除响应参数
  const handleDeleteResponseParam = (index) => {
    setFormData(prev => ({
      ...prev,
      responseParameters: prev.responseParameters.filter((_, i) => i !== index)
    }));
  };
  
  // 处理下一步
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  // 处理上一步
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // 提交表单
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // 上传的API直接设置为已发布状态，不需要审核
      const result = await dispatch(createApi({
        ...formData,
        type: API_TYPES.UPLOADED,
        status: 'published',
      })).unwrap();
      
      // 通知成功
      if (onSuccess) {
        onSuccess(result);
      }
      
      // 重置表单或跳转到下一步
      setActiveStep(prevStep => prevStep + 1);
    } catch (error) {
      console.error('API上传失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 渲染当前步骤内容
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Card className={classes.infoCard} elevation={0}>
              <CardContent>
                <Box display="flex" alignItems="flex-start">
                  <InfoIcon style={{ marginRight: 8, color: '#1976d2' }} />
                  <Typography variant="body2">
                    此表单用于上传<strong>已有API的信息</strong>，仅用于展示和文档目的。
                    上传的API信息不需要审核，不支持订阅申请和白名单绑定流程。
                    如需构建需要权限控制的API，请使用低代码构建器。
                  </Typography>
                </Box>
              </CardContent>
            </Card>
                
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="API名称"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="API描述"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="API版本"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="例如: 1.0.0"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>请求方法</InputLabel>
                  <Select
                    value={formData.method}
                    onChange={handleMethodChange}
                    label="请求方法"
                  >
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                    <MenuItem value="PUT">PUT</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
                    <MenuItem value="PATCH">PATCH</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="API路径"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="例如: /api/users"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>API分类</InputLabel>
                  <Select
                    multiple
                    value={formData.categories}
                    onChange={handleCategoryChange}
                    label="API分类"
                    renderValue={(selected) => (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {selected.map((value) => {
                          const category = categories.find(cat => cat.id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={category ? category.name : value} 
                              className={classes.chip} 
                            />
                          );
                        })}
                      </div>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="flex-start">
                  <TextField
                    label="添加标签"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    variant="outlined"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    style={{ marginRight: 8 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleAddTag}
                  >
                    添加
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" marginTop={1}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      className={classes.chip}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              请求参数
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="参数名"
                  name="name"
                  value={tempRequestParam.name}
                  onChange={handleRequestParamChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>类型</InputLabel>
                  <Select
                    name="type"
                    value={tempRequestParam.type}
                    onChange={handleRequestParamChange}
                    label="类型"
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="object">Object</MenuItem>
                    <MenuItem value="array">Array</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>是否必填</InputLabel>
                  <Select
                    name="required"
                    value={tempRequestParam.required}
                    onChange={handleRequestParamChange}
                    label="是否必填"
                  >
                    <MenuItem value={true}>是</MenuItem>
                    <MenuItem value={false}>否</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="描述"
                  name="description"
                  value={tempRequestParam.description}
                  onChange={handleRequestParamChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAddRequestParam}
                >
                  添加
                </Button>
              </Grid>
            </Grid>
            
            <Box mt={2}>
              {formData.requestParameters.length > 0 ? (
                <Grid container spacing={2}>
                  {formData.requestParameters.map((param, index) => (
                    <Grid item xs={12} key={index}>
                      <Box display="flex" alignItems="center" border={1} borderColor="divider" borderRadius={4} p={1}>
                        <Typography variant="body2" style={{ flex: 3 }}>
                          <strong>{param.name}</strong>
                        </Typography>
                        <Typography variant="body2" style={{ flex: 2 }}>
                          类型: {param.type}
                        </Typography>
                        <Typography variant="body2" style={{ flex: 2 }}>
                          必填: {param.required ? '是' : '否'}
                        </Typography>
                        <Typography variant="body2" style={{ flex: 4 }}>
                          {param.description}
                        </Typography>
                        <Button 
                          color="secondary" 
                          size="small"
                          onClick={() => handleDeleteRequestParam(index)}
                        >
                          删除
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  暂无请求参数
                </Typography>
              )}
            </Box>
            
            <Divider className={classes.divider} />
            
            <Typography variant="h6" gutterBottom>
              响应参数
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="参数名"
                  name="name"
                  value={tempResponseParam.name}
                  onChange={handleResponseParamChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>类型</InputLabel>
                  <Select
                    name="type"
                    value={tempResponseParam.type}
                    onChange={handleResponseParamChange}
                    label="类型"
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="object">Object</MenuItem>
                    <MenuItem value="array">Array</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="描述"
                  name="description"
                  value={tempResponseParam.description}
                  onChange={handleResponseParamChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAddResponseParam}
                >
                  添加
                </Button>
              </Grid>
            </Grid>
            
            <Box mt={2}>
              {formData.responseParameters.length > 0 ? (
                <Grid container spacing={2}>
                  {formData.responseParameters.map((param, index) => (
                    <Grid item xs={12} key={index}>
                      <Box display="flex" alignItems="center" border={1} borderColor="divider" borderRadius={4} p={1}>
                        <Typography variant="body2" style={{ flex: 3 }}>
                          <strong>{param.name}</strong>
                        </Typography>
                        <Typography variant="body2" style={{ flex: 2 }}>
                          类型: {param.type}
                        </Typography>
                        <Typography variant="body2" style={{ flex: 6 }}>
                          {param.description}
                        </Typography>
                        <Button 
                          color="secondary" 
                          size="small"
                          onClick={() => handleDeleteResponseParam(index)}
                        >
                          删除
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  暂无响应参数
                </Typography>
              )}
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="文档URL"
                  name="documentationUrl"
                  value={formData.documentationUrl}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="例如: https://example.com/api-docs"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="联系邮箱"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="例如: api-support@example.com"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>认证类型</InputLabel>
                  <Select
                    name="authType"
                    value={formData.authType}
                    onChange={handleInputChange}
                    label="认证类型"
                  >
                    <MenuItem value="none">无认证</MenuItem>
                    <MenuItem value="apiKey">API Key</MenuItem>
                    <MenuItem value="oauth2">OAuth 2.0</MenuItem>
                    <MenuItem value="jwt">JWT</MenuItem>
                    <MenuItem value="basic">Basic Auth</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                API信息预览
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{formData.name}</Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {formData.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="textSecondary">方法:</Typography>
                      <Typography variant="body1">{formData.method}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="textSecondary">路径:</Typography>
                      <Typography variant="body1">{formData.path}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="textSecondary">版本:</Typography>
                      <Typography variant="body1">{formData.version}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="textSecondary">认证:</Typography>
                      <Typography variant="body1">{formData.authType}</Typography>
                    </Grid>
                  </Grid>
                  
                  <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">分类:</Typography>
                    <Box display="flex" flexWrap="wrap">
                      {formData.categories.map((catId) => {
                        const category = categories.find(cat => cat.id === catId);
                        return (
                          <Chip
                            key={catId}
                            label={category ? category.name : catId}
                            size="small"
                            className={classes.chip}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                  
                  <Box mt={1}>
                    <Typography variant="body2" color="textSecondary">标签:</Typography>
                    <Box display="flex" flexWrap="wrap">
                      {formData.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          className={classes.chip}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </>
        );
      case 3: // 成功页面
        return (
          <Box textAlign="center" py={4}>
            <SuccessIcon style={{ fontSize: 60, color: '#4caf50', marginBottom: 16 }} />
            <Typography variant="h5" gutterBottom>
              API信息上传成功！
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              您上传的API信息已经成功保存，现在可以在API目录中查看。
            </Typography>
            <Box mt={3}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.href = '/catalog'}
              >
                前往API目录
              </Button>
              <Button 
                variant="outlined" 
                style={{ marginLeft: 16 }} 
                onClick={() => {
                  // 重置表单
                  setFormData({
                    name: '',
                    description: '',
                    version: '1.0.0',
                    method: 'GET',
                    path: '',
                    categories: [],
                    requestParameters: [],
                    responseParameters: [],
                    authType: 'none',
                    documentationUrl: '',
                    contactEmail: '',
                    tags: [],
                    type: API_TYPES.UPLOADED,
                    isDatasetBound: false,
                  });
                  setActiveStep(0);
                }}
              >
                上传新API
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.headerTitle}>
        <UploadIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
        上传API信息
      </Typography>
      
      <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <div className={classes.formContainer}>
        {getStepContent(activeStep)}
      </div>
      
      {activeStep < steps.length && (
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            上一步
          </Button>
          
          <div>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={classes.submitButton}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? '提交中...' : '提交'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                下一步
              </Button>
            )}
          </div>
        </Box>
      )}
    </Paper>
  );
};

export default ApiUploadForm; 