import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Button, 
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip
} from '@material-ui/core';
import { 
  Link as LinkIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Storage as StorageIcon,
  Api as ApiIcon,
  Visibility as VisibilityIcon
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectDatasetById, 
  selectDatasetApis, 
  linkApiToDataset 
} from '../redux/slices/datasetSlice';
import { 
  selectApiById, 
  selectAllApis, 
  bindDatasetToApi, 
  API_TYPES 
} from '../redux/slices/apiSlice';
import ApiDetailDialog from './ApiDetailDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  relationshipContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  datasetCard: {
    width: 300,
    height: '100%',
    border: `1px solid ${theme.palette.primary.main}`,
    position: 'relative',
  },
  apiCard: {
    width: 300,
    height: '100%',
    border: `1px solid ${theme.palette.secondary.main}`,
    position: 'relative',
  },
  connectionLine: {
    height: 2,
    backgroundColor: theme.palette.grey[400],
    width: 100,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: -4,
      width: 10,
      height: 10,
      borderRight: `2px solid ${theme.palette.grey[400]}`,
      borderTop: `2px solid ${theme.palette.grey[400]}`,
      transform: 'rotate(45deg)',
    },
  },
  relationshipText: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    margin: theme.spacing(0, 2),
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(1, 2),
  },
  apiCardHeader: {
    backgroundColor: theme.palette.secondary.main,
  },
  itemContainer: {
    marginTop: theme.spacing(2),
  },
  listItem: {
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
    borderRadius: 4,
  },
  apiChip: {
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
  dropZone: {
    padding: theme.spacing(2),
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    minHeight: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  relationshipList: {
    maxHeight: 300,
    overflow: 'auto',
  },
  noContent: {
    textAlign: 'center',
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }
}));

const DatasetApiRelationship = ({ datasetId, apiId, mode = 'show' }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // 状态
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [filterText, setFilterText] = useState('');
  const [apiDetailOpen, setApiDetailOpen] = useState(false);
  const [currentApiDetail, setCurrentApiDetail] = useState(null);
  
  // 从Redux获取数据
  const dataset = useSelector(state => selectDatasetById(state, datasetId));
  const api = useSelector(state => selectApiById(state, apiId));
  const apis = useSelector(selectAllApis);
  const linkedApis = useSelector(state => datasetId ? selectDatasetApis(state, datasetId) : []);
  
  // 根据模式设置初始选择
  useEffect(() => {
    if (mode === 'dataset' && datasetId) {
      setSelectedDataset(datasetId);
    } else if (mode === 'api' && apiId) {
      setSelectedApi(apiId);
    }
  }, [mode, datasetId, apiId]);
  
  // 过滤可用于链接的API（排除已关联的和非低代码构建的API）
  const availableApis = apis.filter(api => 
    (!api.isDatasetBound || (api.isDatasetBound && api.datasetId === datasetId)) && 
    api.type !== API_TYPES.UPLOADED
  );
  
  // 过滤显示的API
  const filteredApis = filterText 
    ? availableApis.filter(api => 
        api.name.toLowerCase().includes(filterText.toLowerCase()) ||
        api.description?.toLowerCase().includes(filterText.toLowerCase())
      )
    : availableApis;
  
  // 打开关联对话框
  const handleOpenLinkDialog = () => {
    setLinkDialogOpen(true);
  };
  
  // 关闭关联对话框
  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
  };
  
  // 打开API详情
  const handleOpenApiDetail = (api) => {
    setCurrentApiDetail(api);
    setApiDetailOpen(true);
  };
  
  // 关闭API详情
  const handleCloseApiDetail = () => {
    setApiDetailOpen(false);
  };
  
  // 关联API与数据集
  const handleLinkApiToDataset = async () => {
    if (selectedApi && selectedDataset) {
      try {
        // 更新数据集中的API关联
        await dispatch(linkApiToDataset({
          datasetId: selectedDataset,
          apiId: selectedApi
        }));
        
        // 更新API中的数据集绑定
        await dispatch(bindDatasetToApi({
          apiId: selectedApi,
          datasetId: selectedDataset,
          datasetName: dataset?.name
        }));
        
        // 关闭对话框并显示成功消息
        handleCloseLinkDialog();
        
        // 清空选择
        setSelectedApi('');
      } catch (error) {
        console.error('Failed to link API to dataset:', error);
        // 显示错误提示
      }
    }
  };
  
  // 渲染API列表项
  const renderApiListItem = (api) => (
    <ListItem key={api.id} className={classes.listItem}>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center">
            <ApiIcon fontSize="small" style={{ marginRight: 8 }} />
            {api.name}
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2" color="textSecondary">
              {api.description?.substring(0, 100)}
              {api.description?.length > 100 ? '...' : ''}
            </Typography>
            <Box mt={1}>
              <Chip 
                size="small"
                label={api.type === API_TYPES.LOWCODE_DB ? '数据库构建' : '数据集构建'}
                className={classes.apiChip}
                color={api.type === API_TYPES.LOWCODE_DS ? 'primary' : 'default'}
                variant="outlined"
              />
              <Chip 
                size="small"
                label={`方法: ${api.method || 'GET'}`}
                className={classes.apiChip}
              />
              <Chip 
                size="small"
                label={`路径: ${api.path || '/api'}`}
                className={classes.apiChip}
              />
            </Box>
          </>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="查看API详情">
          <IconButton edge="end" aria-label="查看详情" onClick={() => handleOpenApiDetail(api)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        {mode === 'dataset' && (
          <Tooltip title="关联API">
            <IconButton edge="end" aria-label="关联">
              <LinkIcon />
            </IconButton>
          </Tooltip>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
  
  // 渲染数据集信息
  const renderDatasetInfo = () => (
    <Card className={classes.datasetCard}>
      <Box className={classes.cardHeader}>
        <Typography variant="subtitle1">
          <StorageIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          数据集
        </Typography>
      </Box>
      <CardContent>
        {dataset ? (
          <>
            <Typography variant="h6">{dataset.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {dataset.description}
            </Typography>
            <Box mt={1}>
              <Chip 
                size="small"
                label={`类型: ${dataset.type || 'structured'}`}
                style={{ marginRight: 4, marginBottom: 4 }}
              />
              <Chip 
                size="small"
                label={`来源: ${dataset.source || 'internal'}`}
                style={{ marginRight: 4, marginBottom: 4 }}
              />
              <Chip 
                size="small"
                label={`关联API: ${linkedApis.length}`}
                color="primary"
                style={{ marginRight: 4, marginBottom: 4 }}
              />
            </Box>
          </>
        ) : (
          <Typography className={classes.noContent}>
            没有选择数据集
          </Typography>
        )}
      </CardContent>
    </Card>
  );
  
  // 渲染API信息
  const renderApiInfo = () => (
    <Card className={`${classes.apiCard}`}>
      <Box className={`${classes.cardHeader} ${classes.apiCardHeader}`}>
        <Typography variant="subtitle1">
          <ApiIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          API
        </Typography>
      </Box>
      <CardContent>
        {api ? (
          <>
            <Typography variant="h6">{api.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {api.description}
            </Typography>
            <Box mt={1}>
              <Chip 
                size="small"
                label={`类型: ${api.type === API_TYPES.LOWCODE_DB ? '数据库构建' : 
                  api.type === API_TYPES.LOWCODE_DS ? '数据集构建' : '已上传'}`}
                style={{ marginRight: 4, marginBottom: 4 }}
                color={api.isDatasetBound ? 'primary' : 'default'}
              />
              <Chip 
                size="small"
                label={`方法: ${api.method || 'GET'}`}
                style={{ marginRight: 4, marginBottom: 4 }}
              />
              <Chip 
                size="small"
                label={`路径: ${api.path || '/api'}`}
                style={{ marginRight: 4, marginBottom: 4 }}
              />
            </Box>
            {api.datasetId && (
              <Box mt={1}>
                <Chip 
                  size="small"
                  icon={<StorageIcon />}
                  label={`绑定数据集: ${api.datasetName || api.datasetId}`}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Typography className={classes.noContent}>
            没有选择API
          </Typography>
        )}
      </CardContent>
    </Card>
  );
  
  // 根据不同模式渲染不同内容
  const renderContent = () => {
    if (mode === 'show') {
      return (
        <Paper className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            数据集与API关系
          </Typography>
          
          <div className={classes.relationshipContainer}>
            {renderDatasetInfo()}
            
            <div className={classes.connectionLine} />
            <div className={classes.relationshipText}>一对多关系</div>
            <div className={classes.connectionLine} />
            
            {renderApiInfo()}
          </div>
          
          <Divider className={classes.divider} />
          
          <Typography variant="subtitle1" gutterBottom>
            关联的API（{linkedApis.length}）
          </Typography>
          
          <div className={classes.itemContainer}>
            {linkedApis.length > 0 ? (
              <div className={classes.relationshipList}>
                {linkedApis.map(api => renderApiListItem(api))}
              </div>
            ) : (
              <div className={classes.dropZone}>
                <Typography color="textSecondary">
                  没有关联的API
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  color="primary" 
                  variant="outlined"
                  style={{ marginTop: 8 }}
                  onClick={handleOpenLinkDialog}
                >
                  关联API
                </Button>
              </div>
            )}
          </div>
        </Paper>
      );
    } else if (mode === 'dataset') {
      return (
        <Paper className={classes.root}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" className={classes.title}>
              {dataset?.name} - 关联的API
            </Typography>
            
            <Button 
              startIcon={<AddIcon />} 
              color="primary" 
              variant="contained"
              onClick={handleOpenLinkDialog}
            >
              关联新API
            </Button>
          </Box>
          
          <Divider className={classes.divider} />
          
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="搜索API"
              placeholder="输入API名称或描述过滤"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Box>
          
          <div className={classes.itemContainer}>
            {linkedApis.length > 0 ? (
              <div className={classes.relationshipList}>
                {linkedApis.map(api => renderApiListItem(api))}
              </div>
            ) : (
              <div className={classes.dropZone}>
                <Typography color="textSecondary">
                  此数据集没有关联的API
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  color="primary" 
                  variant="outlined"
                  style={{ marginTop: 8 }}
                  onClick={handleOpenLinkDialog}
                >
                  关联API
                </Button>
              </div>
            )}
          </div>
        </Paper>
      );
    } else if (mode === 'api') {
      return (
        <Paper className={classes.root}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" className={classes.title}>
              {api?.name} - 数据集绑定
            </Typography>
            
            {!api?.isDatasetBound && (
              <Button 
                startIcon={<LinkIcon />} 
                color="primary" 
                variant="contained"
                onClick={handleOpenLinkDialog}
              >
                绑定数据集
              </Button>
            )}
          </Box>
          
          <Divider className={classes.divider} />
          
          <div className={classes.itemContainer}>
            {api?.isDatasetBound ? (
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">
                    已绑定数据集
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <StorageIcon style={{ marginRight: 8 }} />
                    <Typography variant="body1">
                      {api.datasetName || '未知数据集'}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                    >
                      解除绑定
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <div className={classes.dropZone}>
                <Typography color="textSecondary">
                  此API未绑定到任何数据集
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  只有低代码构建的API可以绑定到数据集
                </Typography>
                <Button 
                  startIcon={<LinkIcon />} 
                  color="primary" 
                  variant="outlined"
                  style={{ marginTop: 8 }}
                  onClick={handleOpenLinkDialog}
                  disabled={api?.type === API_TYPES.UPLOADED}
                >
                  绑定数据集
                </Button>
              </div>
            )}
          </div>
        </Paper>
      );
    }
    
    return null;
  }
  
  // 渲染链接对话框
  const renderLinkDialog = () => {
    if (mode === 'api') {
      return (
        <Dialog
          open={linkDialogOpen}
          onClose={handleCloseLinkDialog}
          aria-labelledby="link-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="link-dialog-title">将API绑定到数据集</DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              选择一个数据集与API <strong>{api?.name}</strong> 绑定。
              API只能绑定到一个数据集，绑定后此API将作为数据集的对外接口。
            </Typography>
            
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="dataset-select-label">选择数据集</InputLabel>
              <Select
                labelId="dataset-select-label"
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                label="选择数据集"
              >
                <MenuItem value="">
                  <em>请选择一个数据集</em>
                </MenuItem>
                {/* 这里需要获取所有数据集进行选择 */}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLinkDialog} color="default">
              取消
            </Button>
            <Button 
              onClick={handleLinkApiToDataset} 
              color="primary" 
              disabled={!selectedDataset}
            >
              绑定
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return (
        <Dialog
          open={linkDialogOpen}
          onClose={handleCloseLinkDialog}
          aria-labelledby="link-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="link-dialog-title">为数据集关联API</DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              选择一个API与数据集 <strong>{dataset?.name}</strong> 关联。
              API只能关联到一个数据集，关联后此API将作为数据集的对外接口。
            </Typography>
            
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="api-select-label">选择API</InputLabel>
              <Select
                labelId="api-select-label"
                value={selectedApi}
                onChange={(e) => setSelectedApi(e.target.value)}
                label="选择API"
              >
                <MenuItem value="">
                  <em>请选择一个API</em>
                </MenuItem>
                {filteredApis.map((api) => (
                  <MenuItem key={api.id} value={api.id}>
                    {api.name} - {api.type === API_TYPES.LOWCODE_DB ? '数据库构建' : '数据集构建'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLinkDialog} color="default">
              取消
            </Button>
            <Button 
              onClick={handleLinkApiToDataset} 
              color="primary" 
              disabled={!selectedApi}
            >
              关联
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  };
  
  return (
    <>
      {renderContent()}
      
      {/* API详情对话框 - 统一放在这里避免重复 */}
      {currentApiDetail && (
        <ApiDetailDialog 
          open={apiDetailOpen} 
          onClose={handleCloseApiDetail} 
          api={currentApiDetail} 
        />
      )}
      
      {/* 链接对话框 */}
      {renderLinkDialog()}
    </>
  );
};

export default DatasetApiRelationship; 