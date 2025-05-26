import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Grid
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import {
  CloudUpload as CloudUploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Folder as FolderIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Label as LabelIcon
} from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';
import datasetService from '../services/DatasetManagementService';
import { apiCategories } from '../constants/apiCategories';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      width: '80%',
      maxWidth: '900px',
      height: '80vh',
      overflow: 'hidden'
    }
  },
  dialogContent: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  dropzone: {
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.grey[50],
    '&:hover': {
      backgroundColor: theme.palette.primary.light + '15',
      borderColor: theme.palette.primary.dark,
    },
    '&.drag-active': {
      backgroundColor: theme.palette.primary.light + '25',
      borderColor: theme.palette.primary.dark,
      transform: 'scale(1.02)'
    }
  },
  dropzoneActive: {
    backgroundColor: theme.palette.primary.light + '25',
    borderColor: theme.palette.primary.dark,
    transform: 'scale(1.02)'
  },
  uploadIcon: {
    fontSize: '4rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2)
  },
  fileList: {
    maxHeight: '200px',
    overflow: 'auto',
    marginTop: theme.spacing(2)
  },
  fileItem: {
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  progressContainer: {
    marginTop: theme.spacing(2)
  },
  stepContent: {
    padding: theme.spacing(2),
    minHeight: '400px',
    overflow: 'auto'
  },
  formSection: {
    marginBottom: theme.spacing(3)
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center'
  },
  sectionIcon: {
    marginRight: theme.spacing(1)
  },
  tagInput: {
    '& .MuiChip-root': {
      margin: theme.spacing(0.5)
    }
  },
  previewCard: {
    marginTop: theme.spacing(2)
  },
  filePreview: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1)
  }
}));

const DatasetUploadDialog = ({ open, onClose, onSuccess }) => {
  const classes = useStyles();
  const fileInputRef = useRef(null);

  // 步骤状态
  const [activeStep, setActiveStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // 文件状态
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileValidationErrors, setFileValidationErrors] = useState([]);

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: [],
    isPublic: true,
    license: 'MIT',
    version: '1.0.0',
    format: 'auto',
    encoding: 'UTF-8'
  });

  // 标签输入
  const [tagInput, setTagInput] = useState('');

  // 支持的文件格式
  const supportedFormats = {
    'application/json': { ext: '.json', name: 'JSON', maxSize: 50 },
    'text/csv': { ext: '.csv', name: 'CSV', maxSize: 100 },
    'application/vnd.ms-excel': { ext: '.xls', name: 'Excel (XLS)', maxSize: 100 },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: '.xlsx', name: 'Excel (XLSX)', maxSize: 100 },
    'text/xml': { ext: '.xml', name: 'XML', maxSize: 50 },
    'application/x-sql': { ext: '.sql', name: 'SQL', maxSize: 20 },
    'text/plain': { ext: '.txt', name: 'Text', maxSize: 50 }
  };

  const steps = [
    {
      label: '选择文件',
      description: '上传数据集文件'
    },
    {
      label: '基本信息',
      description: '填写数据集基本信息'
    },
    {
      label: '配置设置',
      description: '设置访问权限和格式'
    },
    {
      label: '预览确认',
      description: '确认信息并上传'
    }
  ];

  // 验证文件
  const validateFile = (file) => {
    const errors = [];
    
    // 检查文件类型
    if (!supportedFormats[file.type] && !file.name.match(/\.(json|csv|xlsx?|xml|sql|txt)$/i)) {
      errors.push('不支持的文件格式');
    }
    
    // 检查文件大小
    const formatInfo = supportedFormats[file.type];
    const maxSizeBytes = (formatInfo?.maxSize || 50) * 1024 * 1024; // MB to bytes
    if (file.size > maxSizeBytes) {
      errors.push(`文件大小超过限制 (${formatInfo?.maxSize || 50}MB)`);
    }
    
    return errors;
  };

  // 拖拽上传处理
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const validFiles = [];
    const allErrors = [];

    acceptedFiles.forEach(file => {
      const errors = validateFile(file);
      if (errors.length === 0) {
        validFiles.push(file);
      } else {
        allErrors.push({ file: file.name, errors });
      }
    });

    rejectedFiles.forEach(({ file, errors }) => {
      allErrors.push({
        file: file.name,
        errors: errors.map(e => e.message)
      });
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setFileValidationErrors(allErrors);

    // 自动填充数据集名称
    if (validFiles.length > 0 && !formData.name) {
      const fileName = validFiles[0].name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, name: fileName }));
    }
  }, [formData.name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(supportedFormats).join(',') + ',.json,.csv,.xlsx,.xls,.xml,.sql,.txt',
    maxFiles: 5
  });

  // 删除文件
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 表单处理
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  // 步骤导航
  const handleNext = () => {
    if (activeStep === 0 && selectedFiles.length === 0) {
      setUploadError('请至少选择一个文件');
      return;
    }
    if (activeStep === 1 && !formData.name.trim()) {
      setUploadError('请填写数据集名称');
      return;
    }
    setUploadError(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // 上传处理
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      const uploadData = new FormData();
      
      // 添加文件
      selectedFiles.forEach(file => {
        uploadData.append('files', file);
      });
      
      // 添加元数据
      uploadData.append('metadata', JSON.stringify(formData));

      const result = await datasetService.uploadDataset(
        uploadData,
        (progress) => setUploadProgress(progress)
      );

      // 上传成功
      setTimeout(() => {
        setIsUploading(false);
        onSuccess && onSuccess(result);
        handleClose();
      }, 500);

    } catch (error) {
      setIsUploading(false);
      setUploadError(error.message || '上传失败');
    }
  };

  // 关闭对话框
  const handleClose = () => {
    if (!isUploading) {
      setActiveStep(0);
      setSelectedFiles([]);
      setFormData({
        name: '',
        description: '',
        category: '',
        tags: [],
        isPublic: true,
        license: 'MIT',
        version: '1.0.0',
        format: 'auto',
        encoding: 'UTF-8'
      });
      setTagInput('');
      setUploadProgress(0);
      setUploadError(null);
      setFileValidationErrors([]);
      onClose();
    }
  };

  // 渲染步骤内容
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Paper
              {...getRootProps()}
              className={`${classes.dropzone} ${isDragActive ? classes.dropzoneActive : ''}`}
              elevation={0}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              <CloudUploadIcon className={classes.uploadIcon} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? '松开鼠标上传文件' : '拖拽文件到这里或点击选择'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                支持 JSON, CSV, Excel, XML, SQL, TXT 格式，最大 100MB
              </Typography>
            </Paper>

            {/* 文件验证错误 */}
            {fileValidationErrors.length > 0 && (
              <Alert severity="warning" style={{ marginTop: 16 }}>
                <AlertTitle>文件验证警告</AlertTitle>
                {fileValidationErrors.map((error, index) => (
                  <Typography key={index} variant="body2">
                    {error.file}: {error.errors.join(', ')}
                  </Typography>
                ))}
              </Alert>
            )}

            {/* 已选择的文件列表 */}
            {selectedFiles.length > 0 && (
              <List className={classes.fileList}>
                {selectedFiles.map((file, index) => (
                  <ListItem key={index} className={classes.fileItem}>
                    <ListItemIcon>
                      <FileIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => removeFile(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <div className={classes.formSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <InfoIcon className={classes.sectionIcon} />
                基本信息
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="数据集名称 *"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="描述"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>分类</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      label="分类"
                    >
                      {apiCategories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="版本"
                    value={formData.version}
                    onChange={(e) => handleFormChange('version', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </div>

            <div className={classes.formSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <LabelIcon className={classes.sectionIcon} />
                标签
              </Typography>
              <Box display="flex" gap={1} marginBottom={2}>
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                  placeholder="输入标签后按回车"
                  variant="outlined"
                  size="small"
                  style={{ flex: 1 }}
                />
                <Button variant="outlined" onClick={handleTagAdd}>
                  添加
                </Button>
              </Box>
              <Box className={classes.tagInput}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </div>
          </Box>
        );

      case 2:
        return (
          <Box>
            <div className={classes.formSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <SecurityIcon className={classes.sectionIcon} />
                访问权限
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={(e) => handleFormChange('isPublic', e.target.checked)}
                    color="primary"
                  />
                }
                label="公开数据集"
              />
              <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                公开数据集可被所有用户查看和使用
              </Typography>
            </div>

            <div className={classes.formSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <StorageIcon className={classes.sectionIcon} />
                格式设置
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>数据格式</InputLabel>
                    <Select
                      value={formData.format}
                      onChange={(e) => handleFormChange('format', e.target.value)}
                      label="数据格式"
                    >
                      <MenuItem value="auto">自动检测</MenuItem>
                      <MenuItem value="json">JSON</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                      <MenuItem value="excel">Excel</MenuItem>
                      <MenuItem value="xml">XML</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>字符编码</InputLabel>
                    <Select
                      value={formData.encoding}
                      onChange={(e) => handleFormChange('encoding', e.target.value)}
                      label="字符编码"
                    >
                      <MenuItem value="UTF-8">UTF-8</MenuItem>
                      <MenuItem value="GBK">GBK</MenuItem>
                      <MenuItem value="GB2312">GB2312</MenuItem>
                      <MenuItem value="ISO-8859-1">ISO-8859-1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>许可证</InputLabel>
                    <Select
                      value={formData.license}
                      onChange={(e) => handleFormChange('license', e.target.value)}
                      label="许可证"
                    >
                      <MenuItem value="MIT">MIT License</MenuItem>
                      <MenuItem value="Apache-2.0">Apache License 2.0</MenuItem>
                      <MenuItem value="GPL-3.0">GPL v3</MenuItem>
                      <MenuItem value="BSD-3-Clause">BSD 3-Clause</MenuItem>
                      <MenuItem value="CC-BY-4.0">Creative Commons BY 4.0</MenuItem>
                      <MenuItem value="custom">自定义</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Card className={classes.previewCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  数据集预览
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">名称</Typography>
                    <Typography variant="body1">{formData.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">版本</Typography>
                    <Typography variant="body1">{formData.version}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">描述</Typography>
                    <Typography variant="body1">{formData.description || '无描述'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">分类</Typography>
                    <Typography variant="body1">
                      {apiCategories.find(cat => cat.id === formData.category)?.name || '未分类'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">访问权限</Typography>
                    <Typography variant="body1">{formData.isPublic ? '公开' : '私有'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">标签</Typography>
                    <Box>
                      {formData.tags.length > 0 ? formData.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" style={{ margin: '2px' }} />
                      )) : <Typography variant="body2" color="textSecondary">无标签</Typography>}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">文件列表</Typography>
                    <Box className={classes.filePreview}>
                      {selectedFiles.map((file, index) => (
                        <Typography key={index} variant="body2">
                          <FileIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                          {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 上传进度 */}
            {isUploading && (
              <Box className={classes.progressContainer}>
                <Typography variant="body2" gutterBottom>
                  上传进度: {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {/* 错误信息 */}
            {uploadError && (
              <Alert severity="error" style={{ marginTop: 16 }}>
                {uploadError}
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle>
        上传数据集
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <div className={classes.stepContent}>
                  {renderStepContent(index)}
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isUploading}>
          取消
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={isUploading}>
            上一步
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>
            下一步
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            startIcon={isUploading ? null : <CloudUploadIcon />}
          >
            {isUploading ? `上传中... ${uploadProgress}%` : '开始上传'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DatasetUploadDialog; 