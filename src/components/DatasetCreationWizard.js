import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ArrowBack,
  ArrowForward,
  TableChart,
  Storage as DatasetIcon,
  Info as InfoIcon,
  Add as AddIcon
} from '@material-ui/icons';
import DatabaseTableService from '../services/DatabaseTableService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
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
  formSection: {
    marginBottom: theme.spacing(3),
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
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
  infoBox: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
}));

const DatasetCreationWizard = ({
  onNext,
  onBack,
  onComplete,
  connection,
  step,
  selectedTable,
  onTableSelect,
  metadata,
  onMetadataChange,
  isSubmitting,
}) => {
  const classes = useStyles();
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTag, setNewTag] = useState('');

  // 加载数据库表
  useEffect(() => {
    if (connection && step === 1) {
      loadTables();
    }
  }, [connection, step]);

  const loadTables = async () => {
    try {
      setIsLoading(true);
      const tablesData = await DatabaseTableService.getTables(connection);
      setTables(tablesData);
      setIsLoading(false);
    } catch (error) {
      console.error('获取数据库表失败:', error);
      setIsLoading(false);
    }
  };

  const handleTableSelect = (table) => {
    onTableSelect(table);
  };

  const handleMetadataChange = (field, value) => {
    onMetadataChange(field, value);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      handleMetadataChange('tags', [...metadata.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleMetadataChange('tags', metadata.tags.filter(tag => tag !== tagToRemove));
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

  const renderTableSelection = () => (
    <div>
      <div className={classes.header}>
        <Typography variant="h5" gutterBottom>
          选择数据表
        </Typography>
        <Typography variant="body2" color="textSecondary">
          从数据库 "{connection.name}" 中选择一个表来创建Dataset
        </Typography>
      </div>

      {/* 连接信息 */}
      <Box className={classes.infoBox}>
        <Box display="flex" alignItems="center">
          <InfoIcon color="primary" style={{ marginRight: 8 }} />
          <div>
            <Typography variant="subtitle2">
              当前数据库连接
            </Typography>
            <Typography variant="body2">
              {connection.name} ({getDbTypeName(connection.type)}) - {connection.host}:{connection.port}/{connection.database}
            </Typography>
          </div>
        </Box>
      </Box>

      {/* 搜索 */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="搜索表格..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16 }}
      />

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
                </div>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {table.description || '无描述'}
                </Typography>
                {table.rowCount && (
                  <Typography variant="caption" color="textSecondary">
                    行数: {table.rowCount.toLocaleString()} | 大小: {table.size}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            没有找到匹配的表格
          </Typography>
        </Box>
      )}
    </div>
  );

  const renderMetadataForm = () => (
    <div>
      <div className={classes.header}>
        <Typography variant="h5" gutterBottom>
          配置Dataset元数据
        </Typography>
        <Typography variant="body2" color="textSecondary">
          为基于表格 "{selectedTable.name}" 的Dataset配置元数据信息
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dataset名称"
            value={metadata.name}
            onChange={(e) => handleMetadataChange('name', e.target.value)}
            required
            variant="outlined"
            helperText="Dataset的唯一标识名称"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="描述"
            value={metadata.description}
            onChange={(e) => handleMetadataChange('description', e.target.value)}
            variant="outlined"
            helperText="详细描述Dataset的内容和用途"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>分类</InputLabel>
            <Select
              value={metadata.category}
              onChange={(e) => handleMetadataChange('category', e.target.value)}
              label="分类"
              disabled // 固定为project分类
            >
              <MenuItem value="project">Project (项目)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>访问权限</InputLabel>
            <Select
              value={metadata.isPublic ? 'public' : 'private'}
              onChange={(e) => handleMetadataChange('isPublic', e.target.value === 'public')}
              label="访问权限"
            >
              <MenuItem value="private">私有</MenuItem>
              <MenuItem value="public">公开</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            标签
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <TextField
              size="small"
              label="添加标签"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddTag}
              startIcon={<AddIcon />}
            >
              添加
            </Button>
          </Box>
          <div className={classes.tagsContainer}>
            {metadata.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );

  const renderConfirmation = () => (
    <div>
      <div className={classes.header}>
        <Typography variant="h5" gutterBottom>
          确认创建Dataset
        </Typography>
        <Typography variant="body2" color="textSecondary">
          请确认以下信息，点击创建完成Dataset创建
        </Typography>
      </div>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <DatasetIcon color="primary" style={{ marginRight: 8 }} />
            <Typography variant="h6">Dataset信息</Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Dataset名称" 
                secondary={metadata.name} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="描述" 
                secondary={metadata.description || '无描述'} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="数据源表" 
                secondary={`${selectedTable.name} (${selectedTable.description || '无描述'})`} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="分类" 
                secondary="Project (项目)" 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="访问权限" 
                secondary={metadata.isPublic ? '公开' : '私有'} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="标签" 
                secondary={
                  <div className={classes.tagsContainer}>
                    {metadata.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </div>
                } 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Alert severity="info" style={{ marginTop: 16 }}>
        创建后，此Dataset将可用于构建API。您可以在数据集管理页面中查看和管理所有Dataset。
      </Alert>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case 1: // 选择数据表
        return renderTableSelection();
      case 2: // 配置元数据
        return renderMetadataForm();
      case 3: // 确认创建
        return renderConfirmation();
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedTable;
      case 2:
        return !metadata.name.trim();
      case 3:
        return false;
      default:
        return true;
    }
  };

  return (
    <Paper className={classes.root}>
      {getStepContent()}
      
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="default"
          startIcon={<ArrowBack />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          返回
        </Button>
        
        {step < 3 ? (
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            onClick={onNext}
            disabled={isNextDisabled() || isSubmitting}
          >
            下一步
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={onComplete}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <DatasetIcon />}
          >
            {isSubmitting ? '创建中...' : '创建Dataset'}
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default DatasetCreationWizard; 