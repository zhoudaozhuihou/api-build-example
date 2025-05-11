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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ArrowBack,
  Category,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { apiCategories } from '../constants/apiCategories';
import CategoryCascader from './CategoryCascader';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  list: {
    marginTop: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  methodChip: {
    marginRight: theme.spacing(1),
  },
  dialogContent: {
    minWidth: '500px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(3),
  },
  categoryContainer: {
    marginBottom: theme.spacing(2),
  },
  categoryChip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  apiItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(1),
  },
  categoriesSection: {
    marginTop: theme.spacing(2),
  },
  filterSection: {
    marginBottom: theme.spacing(3),
  },
  apiPath: {
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1),
  },
  emptyMessage: {
    textAlign: 'center',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  categoryDisplayWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  dialogSection: {
    marginBottom: theme.spacing(3),
  },
}));

const methodColors = {
  GET: 'primary',
  POST: 'secondary',
  PUT: 'default',
  DELETE: 'error',
};

// 从apiCategories中构建分类映射
const buildCategoryMap = (categories, map = {}, parentPath = '') => {
  categories.forEach(category => {
    const path = parentPath ? `${parentPath} > ${category.label}` : category.label;
    map[category.value] = { 
      label: category.label,
      path: path
    };
    
    if (category.children && category.children.length > 0) {
      buildCategoryMap(category.children, map, path);
    }
  });
  
  return map;
};

function ApiList({ onBack }) {
  const classes = useStyles();
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryMap, setCategoryMap] = useState({});
  
  useEffect(() => {
    // 构建分类映射
    const map = buildCategoryMap(apiCategories);
    setCategoryMap(map);
    
    // 获取已保存的API列表
    const savedApis = JSON.parse(localStorage.getItem('apis') || '[]');
    setApis(savedApis);
  }, []);

  const handleViewApi = (api) => {
    setSelectedApi(api);
    setDialogOpen(true);
  };

  const handleDeleteApi = (api) => {
    const updatedApis = apis.filter((a) => a !== api);
    setApis(updatedApis);
    localStorage.setItem('apis', JSON.stringify(updatedApis));
    setNotification({
      open: true,
      message: 'API 删除成功！',
      severity: 'success',
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApi(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCategoryChange = (api, categories) => {
    // 确保categories是数组
    if (!Array.isArray(categories)) {
      console.error('Categories should be an array', categories);
      return;
    }
    
    // 提取主分类
    const mainCategory = categories.length > 0 ? categories[0].value.split('-')[0] : '';
    
    console.log('API categories updated:', categories);
    
    const updatedApis = apis.map((a) => {
      if (a === api) {
        return { 
          ...a, 
          category: mainCategory,
          categories: categories
        };
      }
      return a;
    });
    
    setApis(updatedApis);
    localStorage.setItem('apis', JSON.stringify(updatedApis));
    setNotification({
      open: true,
      message: 'API 分类已更新！',
      severity: 'success',
    });
    setSelectedApi({
      ...api,
      category: mainCategory,
      categories: categories
    });
  };

  // 根据选择的分类筛选API
  const filteredApis = selectedCategory === 'all'
    ? apis
    : apis.filter(api => {
        // 检查API所属分类是否匹配
        if (api.category === selectedCategory) return true;
        
        // 检查API所有分类中是否包含选定的分类或其子分类
        if (api.categories && api.categories.length > 0) {
          return api.categories.some(cat => cat.value.startsWith(selectedCategory + '-') || cat.value === selectedCategory);
        }
        
        return false;
      });

  // 获取API的HTTP方法对应的颜色
  const getMethodColor = (method) => {
    return methodColors[method] || 'default';
  };

  // 渲染API的分类标签
  const renderCategoryChips = (categories) => {
    if (!categories || categories.length === 0) return null;
    
    return (
      <div className={classes.categoryDisplayWrapper}>
        {categories.map((category) => (
          <Chip
            key={category.value}
            size="small"
            icon={<Category fontSize="small" />}
            label={category.label}
            className={classes.chip}
            color="primary"
            variant="outlined"
          />
        ))}
      </div>
    );
  };

  // 获取分类筛选选项
  const getCategoryOptions = () => {
    return apiCategories.map(category => ({
      value: category.value,
      label: category.label
    }));
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        API 列表
      </Typography>

      <div className={classes.filterSection}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="category-filter-label">按分类筛选</InputLabel>
              <Select
                labelId="category-filter-label"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="按分类筛选"
              >
                <MenuItem value="all">全部分类</MenuItem>
                {getCategoryOptions().map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      {filteredApis.length === 0 ? (
        <div className={classes.emptyMessage}>
          <Typography variant="body1">
            {selectedCategory === 'all' ? '暂无API' : '该分类下暂无API'}
          </Typography>
        </div>
      ) : (
        <List className={classes.list}>
          {filteredApis.map((api, index) => (
            <ListItem
              key={index}
              className={classes.apiItem}
              button
              onClick={() => handleViewApi(api)}
            >
              <ListItemText
                primary={
                  <div>
                    <Chip
                      label={api.method}
                      color={getMethodColor(api.method)}
                      size="small"
                      className={classes.methodChip}
                    />
                    <Typography variant="subtitle1" component="span">
                      {api.name}
                    </Typography>
                    <Typography variant="body2" component="span" className={classes.apiPath}>
                      {api.path}
                    </Typography>
                  </div>
                }
                secondary={renderCategoryChips(api.categories)}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleViewApi(api)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteApi(api)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          返回
        </Button>
      </div>

      {selectedApi && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md">
          <DialogTitle>API 详情: {selectedApi.name}</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <div className={classes.dialogSection}>
              <Typography variant="subtitle1" gutterBottom>
                基本信息
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="body2" color="textSecondary">HTTP 方法</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Chip
                    label={selectedApi.method}
                    color={getMethodColor(selectedApi.method)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="textSecondary">API 路径</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">{selectedApi.path}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="textSecondary">描述</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">{selectedApi.description || '无'}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="textSecondary">创建时间</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">
                    {new Date(selectedApi.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </div>

            <Divider />
            
            <div className={classes.dialogSection}>
              <Typography variant="subtitle1" gutterBottom>
                API 分类
              </Typography>
              <CategoryCascader
                value={selectedApi.categories || []}
                onChange={(categories) => handleCategoryChange(selectedApi, categories)}
                title="API 分类"
                placeholder="请选择 API 分类"
                categoriesData={apiCategories}
              />
            </div>

            <Divider />

            <div className={classes.dialogSection}>
              <Typography variant="subtitle1" gutterBottom>
                数据源
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="body2" color="textSecondary">表格</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">{selectedApi.table}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="textSecondary">SQL 查询</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">{selectedApi.sqlQuery}</Typography>
                </Grid>
              </Grid>
            </div>

            {selectedApi.parameters && selectedApi.parameters.length > 0 && (
              <>
                <Divider />
                <div className={classes.dialogSection}>
                  <Typography variant="subtitle1" gutterBottom>
                    参数列表
                  </Typography>
                  <List dense>
                    {selectedApi.parameters.map((param, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              <strong>{param.name}</strong>
                              {param.required && <span style={{ color: 'red' }}> *</span>}
                              <span style={{ color: 'grey' }}> ({param.type})</span>
                            </Typography>
                          }
                          secondary={param.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ApiList; 