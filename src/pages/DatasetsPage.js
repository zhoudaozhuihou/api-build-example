import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  List,
  ListItem,
  ListItemText,
  Switch,
  InputBase,
  Tooltip,
  LinearProgress
} from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Sort as SortIcon,
  Add as AddIcon,
  CloudDownload as DownloadIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  MoreVert as MoreIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  ExpandMore,
  ChevronRight as ChevronRightIcon,
  CloudUpload as CloudUploadIcon,
  Http as HttpIcon,
  People as PeopleIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Code as CodeIcon,
  Clear as ClearIcon,
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { apiCategories } from '../constants/apiCategories';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import FeatureGuard from '../components/FeatureGuard';
import DatasetUploadDialog from '../components/DatasetUploadDialog';
import DatasetFilter from '../components/DatasetFilter';
import DatasetDetailDialog from '../components/DatasetDetailDialog';
import DatasetGlobalSearch from '../components/DatasetGlobalSearch';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  pageTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  searchBar: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  searchInput: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  filterButton: {
    marginRight: theme.spacing(1),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
  },
  cardMedia: {
    height: 140,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
  },
  cardContent: {
    flexGrow: 1,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  datasetType: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  datasetIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
  },
  datasetTitle: {
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  cardActions: {
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
  },
  statusChip: {
    fontSize: '0.7rem',
  },
  categoryChip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[200],
  },
  headerSection: {
    height: 300,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.common.white,
    marginBottom: theme.spacing(3),
  },
  headerContent: {
    width: '100%',
    textAlign: 'center',
  },
  bannerTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 700,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  headerSubtitle: {
    opacity: 0.9,
    maxWidth: 600,
    margin: '0 auto',
    marginBottom: theme.spacing(3),
  },
  searchContainer: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.common.white,
    maxWidth: 500,
    margin: '0 auto',
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
  },
  inputRoot: {
    color: theme.palette.text.primary,
    width: '100%',
  },
  headerSearchInput: {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1rem',
  },
  importButtonHeader: {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 3),
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: theme.shadows[3],
  },
  leftPanel: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    position: 'sticky',
    top: theme.spacing(2),
    maxHeight: 'calc(100vh - 100px)',
  },
  stickyListHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  headerTitleText: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  editModeSwitch: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 1),
  },
  editModeLabel: {
    fontSize: '0.8rem',
    marginRight: theme.spacing(1),
    fontWeight: 500,
  },
  categoryListContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(1),
  },
  contentPanel: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    minHeight: 600,
  },
  rightPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  rightPanelTitle: {
    fontWeight: 600,
    fontSize: '1.2rem',
  },
  rightPanelStats: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  rightPanelStatChip: {
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.disabled,
    opacity: 0.5,
  },
  emptyStateText: {
    maxWidth: 400,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  datasetCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    borderRadius: theme.shape.borderRadius * 1.5,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
  },
  datasetDescription: {
    color: theme.palette.text.secondary,
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    minHeight: '3.6em',
    lineHeight: 1.2,
  },
  datasetGridContainer: {
    padding: theme.spacing(2),
  },
  datasetGridItem: {
    display: 'flex',
    height: '100%',
  },
}));

const DatasetsPage = () => {
  const classes = useStyles();
  const { MODULES, FEATURES } = useFeatureFlags();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedDataset, setSelectedDataset] = useState(null);
  
  // 上传对话框状态
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // 数据集详情对话框状态
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDatasetForDetail, setSelectedDatasetForDetail] = useState(null);
  
  // 筛选器状态
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilters, setTypeFilters] = useState([]);
  const [themeFilters, setThemeFilters] = useState([]);
  const [dataSizeFilter, setDataSizeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [page, setPage] = useState(1);

  // Mock data for datasets
  const datasets = [
    {
      id: 1,
      title: '用户行为数据集',
      description: '电商平台用户行为轨迹数据，包含浏览、收藏、购物车、购买等行为数据',
      type: '结构化数据',
      dataSize: '1.2 GB',
      updatedAt: '2023-06-15',
      categories: ['用户行为', '电子商务'],
      category: '用户服务',
      subCategory: '用户行为',
      fileCount: 5,
      status: 'public',
      popularity: 120,
      image: 'user_behavior.jpg'
    },
    {
      id: 2,
      title: '商品评论情感分析数据集',
      description: '商品评论文本及情感标签，适用于情感分析和文本分类任务',
      type: '文本数据',
      dataSize: '450 MB',
      updatedAt: '2023-05-22',
      categories: ['自然语言处理', '情感分析'],
      category: '产品相关',
      subCategory: '评论数据',
      fileCount: 3,
      status: 'public',
      popularity: 85,
      image: 'sentiment_analysis.jpg'
    },
    {
      id: 3,
      title: '销售趋势预测数据集',
      description: '历史销售数据，可用于时间序列分析和销售预测',
      type: '时间序列',
      dataSize: '780 MB',
      updatedAt: '2023-06-02',
      categories: ['时间序列分析', '预测建模'],
      category: '数据分析',
      subCategory: '销售报表',
      fileCount: 8,
      status: 'private',
      popularity: 65,
      image: 'sales_trend.jpg'
    },
    {
      id: 4,
      title: '产品图像识别数据集',
      description: '标记好的产品图像数据集，适用于计算机视觉和图像分类任务',
      type: '图像数据',
      dataSize: '4.5 GB',
      updatedAt: '2023-04-18',
      categories: ['计算机视觉', '图像分类'],
      category: '产品相关',
      subCategory: '产品图片',
      fileCount: 12,
      status: 'public',
      popularity: 210,
      image: 'product_images.jpg'
    },
    {
      id: 5,
      title: '客户信用风险评估数据',
      description: '金融客户信用数据及风险评级，适用于风险建模',
      type: '结构化数据',
      dataSize: '350 MB',
      updatedAt: '2023-05-30',
      categories: ['金融', '风险评估'],
      category: '金融服务',
      subCategory: '风险评估',
      fileCount: 4,
      status: 'private',
      popularity: 45,
      image: 'credit_risk.jpg'
    },
    {
      id: 6,
      title: '用户推荐系统数据',
      description: '用户-物品交互数据，适用于推荐系统训练和评估',
      type: '结构化数据',
      dataSize: '2.3 GB',
      updatedAt: '2023-06-10',
      categories: ['推荐系统', '协同过滤'],
      category: '用户服务',
      subCategory: '个性化推荐',
      fileCount: 6,
      status: 'public',
      popularity: 155,
      image: 'recommendation.jpg'
    }
  ];

  // 筛选后的数据集
  const [filteredDatasets, setFilteredDatasets] = useState(datasets);
  
  // 全局搜索状态
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalSearchResults, setTotalSearchResults] = useState(0);

  // 筛选处理函数
  const handleStatusFilterChange = (status) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  const handleFilterChange = (filter, filterType) => {
    let currentFilters;
    let setFilters;
    
    switch(filterType) {
      case 'type':
        currentFilters = typeFilters;
        setFilters = setTypeFilters;
        break;
      case 'theme':
        currentFilters = themeFilters;
        setFilters = setThemeFilters;
        break;
      default:
        return;
    }
    
    if (currentFilters.includes(filter)) {
      setFilters(currentFilters.filter(f => f !== filter));
    } else {
      setFilters([...currentFilters, filter]);
    }
  };

  const handleDataSizeFilterChange = (size) => {
    setDataSizeFilter(size);
  };

  const handleDateChange = (field, value) => {
    if (field === 'startDate') setStartDate(value);
    if (field === 'endDate') setEndDate(value);
  };

  const handleClearAllFilters = () => {
    setStatusFilter(null);
    setTypeFilters([]);
    setThemeFilters([]);
    setDataSizeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  // 数据转换辅助函数
  const parseSizeToMB = (sizeStr) => {
    const match = sizeStr.match(/^([\d.]+)\s*(MB|GB)$/);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit === 'GB' ? value * 1024 : value;
  };

  // 应用筛选逻辑
  useEffect(() => {
    let results = [...datasets];
    
    // 搜索筛选
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(dataset => 
        dataset.title.toLowerCase().includes(query) || 
        dataset.description.toLowerCase().includes(query) ||
        dataset.type.toLowerCase().includes(query) ||
        dataset.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }
    
    // 状态筛选
    if (statusFilter) {
      results = results.filter(dataset => dataset.status === statusFilter);
    }
    
    // 类型筛选
    if (typeFilters.length > 0) {
      results = results.filter(dataset => 
        typeFilters.includes(dataset.type)
      );
    }
    
    // 主题筛选 
    if (themeFilters.length > 0) {
      results = results.filter(dataset =>
        dataset.categories.some(cat => themeFilters.includes(cat))
      );
    }
    
    // 数据大小筛选
    if (dataSizeFilter !== 'all') {
      const sizeRanges = {
        'small': { max: 100 },
        'medium': { min: 100, max: 1024 },
        'large': { min: 1024, max: 10240 },
        'xlarge': { min: 10240 }
      };
      
      const range = sizeRanges[dataSizeFilter];
      if (range) {
        results = results.filter(dataset => {
          const sizeMB = parseSizeToMB(dataset.dataSize);
          if (range.min && range.max) {
            return sizeMB >= range.min && sizeMB <= range.max;
          } else if (range.min) {
            return sizeMB >= range.min;
          } else if (range.max) {
            return sizeMB <= range.max;
          }
          return true;
        });
      }
    }
    
    // 日期筛选
    if (startDate) {
      results = results.filter(dataset => 
        new Date(dataset.updatedAt) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      results = results.filter(dataset => 
        new Date(dataset.updatedAt) <= new Date(endDate)
      );
    }
    
    setFilteredDatasets(results);
    setPage(1); // 重置到第一页
    
    // 更新活跃筛选条件
    const newActiveFilters = [];
    
    if (statusFilter) {
      const statusLabels = {
        'public': '公开数据集',
        'private': '私有数据集',
        'restricted': '受限访问'
      };
      newActiveFilters.push({
        type: 'status',
        label: `状态: ${statusLabels[statusFilter]}`,
        onClear: () => setStatusFilter(null)
      });
    }
    
    if (typeFilters.length > 0) {
      newActiveFilters.push({
        type: 'type',
        label: `类型: ${typeFilters.join(', ')}`,
        onClear: () => setTypeFilters([])
      });
    }
    
    if (themeFilters.length > 0) {
      newActiveFilters.push({
        type: 'theme',
        label: `主题: ${themeFilters.join(', ')}`,
        onClear: () => setThemeFilters([])
      });
    }
    
    if (dataSizeFilter !== 'all') {
      const sizeLabels = {
        'small': '小型 (< 100MB)',
        'medium': '中型 (100MB - 1GB)',
        'large': '大型 (1GB - 10GB)',
        'xlarge': '超大型 (> 10GB)'
      };
      newActiveFilters.push({
        type: 'size',
        label: `大小: ${sizeLabels[dataSizeFilter]}`,
        onClear: () => setDataSizeFilter('all')
      });
    }
    
    if (startDate || endDate) {
      newActiveFilters.push({
        type: 'date',
        label: `更新日期: ${startDate || '开始'} - ${endDate || '结束'}`,
        onClear: () => {
          setStartDate('');
          setEndDate('');
        }
      });
    }
    
    setActiveFilters(newActiveFilters);
    
  }, [
    searchQuery, 
    statusFilter, 
    typeFilters, 
    themeFilters, 
    dataSizeFilter, 
    startDate, 
    endDate
  ]);

  // 处理搜索输入变化
  const handleMenuOpen = (event, cardId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCard(cardId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortMenuOpen = (event) => {
    setSortMenuAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  // Initialize expanded states for categories
  useEffect(() => {
    const defaultExpanded = {};
    apiCategories.forEach(category => {
      const categoryId = category.id || category.value;
      defaultExpanded[categoryId] = true;
    });
    setExpandedCategories(defaultExpanded);
  }, []);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const categoryId = category.id || category.value;
    
    // Toggle expansion state
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle node toggle in tree view
  const handleNodeToggle = (event, nodeIds) => {
    const newExpandedState = {};
    nodeIds.forEach(id => {
      if (!id.startsWith('dataset-') && id !== 'add-root-category') {
        newExpandedState[id] = true;
      }
    });
    setExpandedCategories(newExpandedState);
  };

  // Function to render the category tree
  const renderCategoryTree = (categories) => {
    const renderTreeItems = (items, level = 0) => {
      return items.map((category) => {
        const categoryId = category.id || category.value;
        const categoryName = category.name || category.label;
        const hasChildren = category.classifications && category.classifications.length > 0;
        
        // Get datasets related to this category
        const categoryDatasets = filteredDatasets.filter(dataset => 
          dataset.category === categoryName || dataset.subCategory === categoryName
        );
        
        // Calculate total datasets including nested categories
        const getNestedDatasetCount = (catList) => {
          if (!catList) return 0;
          let count = 0;
          
          catList.forEach(cat => {
            const catName = cat.name || cat.label;
            count += filteredDatasets.filter(dataset => 
              dataset.category === catName || dataset.subCategory === catName
            ).length;
            
            if (cat.classifications && cat.classifications.length > 0) {
              count += getNestedDatasetCount(cat.classifications);
            }
          });
          
          return count;
        };
        
        const totalDatasetCount = hasChildren 
          ? categoryDatasets.length + getNestedDatasetCount(category.classifications)
          : categoryDatasets.length;
        
        return (
          <TreeItem
            key={categoryId}
            nodeId={categoryId}
            label={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <Typography variant="body2" style={{ fontWeight: level === 0 ? 600 : 400 }}>
                  {categoryName}
                </Typography>
                <Chip 
                  size="small" 
                  label={totalDatasetCount} 
                  style={{ 
                    fontSize: '0.7rem', 
                    height: '20px',
                    backgroundColor: level === 0 ? '#e3f2fd' : '#f5f5f5'
                  }} 
                />
              </div>
            }
            onClick={() => handleCategorySelect(category)}
          >
            {hasChildren && renderTreeItems(category.classifications, level + 1)}
          </TreeItem>
        );
      });
    };

    return (
      <TreeView
        expanded={Object.keys(expandedCategories).filter(key => expandedCategories[key])}
        onNodeToggle={handleNodeToggle}
        style={{ padding: '8px' }}
      >
        {renderTreeItems(categories)}
      </TreeView>
    );
  };

  const renderDatasetCards = () => {
    return (
      <Grid container spacing={3} className={classes.datasetGridContainer}>
        {filteredDatasets.map((dataset) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={dataset.id} className={classes.datasetGridItem}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                title={dataset.title}
              >
                <StorageIcon style={{ fontSize: 60 }} />
              </CardMedia>
              <CardContent className={classes.cardContent}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div className={classes.datasetType}>
                    <DescriptionIcon className={classes.datasetIcon} />
                    <Typography variant="caption">{dataset.type}</Typography>
                  </div>
                  <Chip 
                    label={dataset.status === 'public' ? '公开' : '私有'} 
                    size="small"
                    color={dataset.status === 'public' ? 'primary' : 'default'}
                    variant="outlined"
                    className={classes.statusChip}
                  />
                </Box>
                <Typography variant="h6" className={classes.datasetTitle}>
                  {dataset.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: 12 }}>
                  {dataset.description}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <InfoIcon fontSize="small" style={{ marginRight: 8, color: '#757575' }} />
                  <Typography variant="caption" color="textSecondary">
                    {dataset.dataSize} {dataset.fileCount} 个文件 更新于 {dataset.updatedAt}
                  </Typography>
                </Box>
                <Box mt={1}>
                  {dataset.categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      className={classes.categoryChip}
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
              <Divider />
              <CardActions className={classes.cardActions}>
                <Button 
                  size="small" 
                  color="primary" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleDatasetDetailOpen(dataset)}
                >
                  查看
                </Button>
                <Box>
                  <IconButton size="small">
                    <Badge badgeContent={dataset.popularity} color="primary" max={99} overlap="rectangular">
                      <DownloadIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                  <IconButton size="small">
                    {dataset.id % 2 === 0 ? (
                      <BookmarkIcon fontSize="small" color="primary" />
                    ) : (
                      <BookmarkBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={(event) => handleMenuOpen(event, dataset.id)}
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filteredDatasets.length === 0 && (
          <Box width="100%" textAlign="center" py={5}>
            <Typography variant="h6" color="textSecondary">
              没有找到符合条件的数据集
            </Typography>
          </Box>
        )}
      </Grid>
    );
  };

  // 处理上传对话框
  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  const handleUploadSuccess = (result) => {
    console.log('数据集上传成功:', result);
    
    // 创建新的数据集对象
    const newDataset = {
      id: result.id || Date.now(),
      title: result.name || '新数据集',
      description: result.description || '数据集描述',
      type: result.format || '结构化数据',
      dataSize: result.files ? `${Math.round(result.files.reduce((total, f) => total + f.size, 0) / (1024 * 1024))} MB` : '未知',
      updatedAt: new Date().toLocaleDateString('zh-CN'),
      categories: result.tags || ['未分类'],
      category: result.category || '其他',
      subCategory: '',
      fileCount: result.files ? result.files.length : 1,
      status: result.isPublic ? 'public' : 'private',
      popularity: 0,
      image: 'new_dataset.jpg'
    };
    
    // 将新数据集添加到列表开头
    setFilteredDatasets(prevDatasets => [newDataset, ...prevDatasets]);
    
    // 显示成功提示（这里可以用snackbar或notification）
    console.log('新数据集已添加到列表');
  };

  // 处理数据集详情对话框
  const handleDatasetDetailOpen = (dataset) => {
    setSelectedDatasetForDetail(dataset);
    setDetailDialogOpen(true);
  };

  const handleDatasetDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedDatasetForDetail(null);
  };

  // 全局搜索处理函数
  const handleGlobalSearch = async (searchParams) => {
    setSearchLoading(true);
    
    try {
      // 模拟API调用
      console.log('执行全局搜索:', searchParams);
      
      // 在实际项目中，这里会调用后端API
      // const response = await fetch('/api/datasets/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(searchParams)
      // });
      // const results = await response.json();
      
      // 模拟搜索逻辑
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
      
      let results = [...datasets];
      
      // 基本搜索
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        
        if (searchParams.scope.includes('all')) {
          // 全字段搜索
          results = results.filter(dataset => 
            dataset.title.toLowerCase().includes(query) || 
            dataset.description.toLowerCase().includes(query) ||
            dataset.type.toLowerCase().includes(query) ||
            (dataset.categories && dataset.categories.some(cat => cat.toLowerCase().includes(query))) ||
            (dataset.category && dataset.category.toLowerCase().includes(query)) ||
            (dataset.subCategory && dataset.subCategory.toLowerCase().includes(query))
          );
        } else {
          // 指定字段搜索
          results = results.filter(dataset => {
            return searchParams.scope.some(scope => {
              switch (scope) {
                case 'title':
                  return dataset.title.toLowerCase().includes(query);
                case 'description':
                  return dataset.description.toLowerCase().includes(query);
                case 'categories':
                  return dataset.categories && dataset.categories.some(cat => cat.toLowerCase().includes(query));
                case 'tags':
                  return dataset.categories && dataset.categories.some(cat => cat.toLowerCase().includes(query));
                case 'author':
                  return dataset.author && dataset.author.toLowerCase().includes(query);
                default:
                  return false;
              }
            });
          });
        }
      }
      
      // 快速筛选
      if (searchParams.filters.type) {
        const typeMap = {
          'structured': '结构化数据',
          'text': '文本数据',
          'image': '图像数据',
          'timeseries': '时间序列'
        };
        const targetType = typeMap[searchParams.filters.type];
        if (targetType) {
          results = results.filter(dataset => dataset.type === targetType);
        }
      }
      
      if (searchParams.filters.status) {
        results = results.filter(dataset => dataset.status === searchParams.filters.status);
      }
      
      if (searchParams.filters.size) {
        results = results.filter(dataset => {
          const sizeInMB = parseSizeToMB(dataset.dataSize);
          switch (searchParams.filters.size) {
            case 'small':
              return sizeInMB < 100;
            case 'medium':
              return sizeInMB >= 100 && sizeInMB <= 1024;
            case 'large':
              return sizeInMB > 1024;
            default:
              return true;
          }
        });
      }
      
      if (searchParams.filters.popularity) {
        if (searchParams.filters.popularity === 'hot') {
          results = results.filter(dataset => dataset.popularity > 100);
        } else if (searchParams.filters.popularity === 'new') {
          // 按更新时间排序，取最新的
          results = results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
      }
      
      // 高级筛选
      if (searchParams.advanced.title) {
        const titleQuery = searchParams.advanced.title.toLowerCase();
        results = results.filter(dataset => dataset.title.toLowerCase().includes(titleQuery));
      }
      
      if (searchParams.advanced.description) {
        const descQuery = searchParams.advanced.description.toLowerCase();
        results = results.filter(dataset => dataset.description.toLowerCase().includes(descQuery));
      }
      
      if (searchParams.advanced.author) {
        const authorQuery = searchParams.advanced.author.toLowerCase();
        results = results.filter(dataset => dataset.author && dataset.author.toLowerCase().includes(authorQuery));
      }
      
      if (searchParams.advanced.dateRange.start || searchParams.advanced.dateRange.end) {
        const startDate = searchParams.advanced.dateRange.start ? new Date(searchParams.advanced.dateRange.start) : null;
        const endDate = searchParams.advanced.dateRange.end ? new Date(searchParams.advanced.dateRange.end) : null;
        
        results = results.filter(dataset => {
          const datasetDate = new Date(dataset.updatedAt);
          return (!startDate || datasetDate >= startDate) && (!endDate || datasetDate <= endDate);
        });
      }
      
      setGlobalSearchResults(results);
      setTotalSearchResults(results.length);
      setFilteredDatasets(results);
      
    } catch (error) {
      console.error('搜索失败:', error);
      setGlobalSearchResults([]);
      setTotalSearchResults(0);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      {/* Header Section with Search */}
      <Paper className={classes.headerSection} elevation={0}>
        <Container className={classes.headerContent}>
          <Typography variant="h3" className={classes.bannerTitle}>
            数据集管理
          </Typography>
          <Typography variant="subtitle1" className={classes.headerSubtitle}>
            探索和管理数据集资源，支持多种数据格式，为API构建提供数据支撑
          </Typography>
          <div className={classes.searchContainer}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="搜索数据集名称、类型或标签..."
              classes={{
                root: classes.inputRoot,
                input: classes.headerSearchInput,
              }}
              value={searchQuery}
              onChange={handleSearchChange}
              inputProps={{ 'aria-label': 'search datasets' }}
            />
          </div>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            className={classes.importButtonHeader}
            onClick={handleUploadDialogOpen}
          >
            上传数据集
          </Button>
        </Container>
      </Paper>

      <Container maxWidth="xl">
        {/* 全局搜索组件 */}
        <DatasetGlobalSearch
          onSearch={handleGlobalSearch}
          datasets={datasets}
          loading={searchLoading}
          searchResults={globalSearchResults}
          totalResults={totalSearchResults}
        />

        {/* 顶部筛选器区域 */}
        <Paper style={{ marginBottom: 24, padding: 0 }} elevation={2}>
          <DatasetFilter
            // 筛选状态
            statusFilter={statusFilter}
            typeFilters={typeFilters}
            themeFilters={themeFilters}
            dataSizeFilter={dataSizeFilter}
            startDate={startDate}
            endDate={endDate}
            activeFilters={activeFilters}
            
            // 筛选处理函数
            onStatusFilterChange={handleStatusFilterChange}
            onFilterChange={handleFilterChange}
            onDataSizeFilterChange={handleDataSizeFilterChange}
            onDateChange={handleDateChange}
            onClearAllFilters={handleClearAllFilters}
          />
        </Paper>

        <Grid container spacing={3}>
          {/* 左侧 - 数据集分类面板 */}
          <Grid item xs={12} md={3} lg={3}>
            <Paper className={classes.leftPanel}>
              <div className={classes.stickyListHeader}>
                <Typography className={classes.headerTitleText}>
                  <CategoryIcon style={{ marginRight: 8 }} /> 数据集分类
                </Typography>
                <div className={classes.editModeSwitch}>
                  <Typography className={classes.editModeLabel}>编辑</Typography>
                  <Switch
                    size="small"
                    checked={editMode}
                    onChange={handleEditModeToggle}
                    color="primary"
                  />
                </div>
              </div>
              <div className={classes.categoryListContainer}>
                {renderCategoryTree(apiCategories)}
              </div>
            </Paper>
          </Grid>

          {/* 右侧 - 数据集列表面板 */}
          <Grid item xs={12} md={9} lg={9}>
            <Paper className={classes.contentPanel}>
              <Box className={classes.rightPanelHeader}>
                <Typography variant="h6" className={classes.rightPanelTitle}>
                  数据集列表
                </Typography>
                <Box className={classes.rightPanelStats}>
                  <Chip 
                    icon={<StorageIcon />} 
                    label={`共 ${filteredDatasets.length} 个数据集`}
                    className={classes.rightPanelStatChip}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<VisibilityIcon />} 
                    label={`${filteredDatasets.filter(dataset => dataset.status === 'public').length} 个公开`}
                    className={classes.rightPanelStatChip}
                    color="secondary"
                    variant="outlined"
                  />
                  {searchQuery && (
                    <Chip 
                      icon={<SearchIcon />} 
                      label={`搜索: "${searchQuery}"`}
                      className={classes.rightPanelStatChip}
                      onDelete={() => setSearchQuery('')}
                      color="default"
                      variant="outlined"
                    />
                  )}
                  
                  {/* 受功能标志保护的上传按钮 */}
                  <FeatureGuard 
                    moduleId={MODULES.DATASET_MANAGEMENT} 
                    featureId={FEATURES[MODULES.DATASET_MANAGEMENT].UPLOAD_DATASET}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      style={{ marginLeft: 8 }}
                      size="small"
                      onClick={handleUploadDialogOpen}
                    >
                      上传数据集
                    </Button>
                  </FeatureGuard>
                </Box>
              </Box>
              
              <Divider />
              
              {/* 数据集卡片列表 */}
              {filteredDatasets.length > 0 ? (
                renderDatasetCards()
              ) : (
                <div className={classes.emptyState}>
                  <StorageIcon className={classes.emptyStateIcon} />
                  <Typography variant="h6">未找到匹配的数据集</Typography>
                  <Typography variant="body2" className={classes.emptyStateText}>
                    没有找到符合当前筛选条件的数据集。尝试调整筛选条件或清除所有筛选器
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ClearIcon />}
                    style={{ marginTop: 16 }}
                    onClick={handleClearAllFilters}
                  >
                    清除所有筛选器
                  </Button>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Dataset action menu */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>编辑数据集</MenuItem>
        <MenuItem onClick={handleMenuClose}>分享数据集</MenuItem>
        
        {/* 数据可视化功能，受功能标志保护 */}
        <FeatureGuard 
          moduleId={MODULES.DATASET_MANAGEMENT} 
          featureId={FEATURES[MODULES.DATASET_MANAGEMENT].DATA_VISUALIZATION}
        >
          <MenuItem onClick={handleMenuClose}>数据可视化预览</MenuItem>
        </FeatureGuard>
        
        <MenuItem onClick={handleMenuClose}>下载数据集</MenuItem>
        <MenuItem onClick={handleMenuClose}>查看使用情况</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} style={{ color: '#f44336' }}>删除数据集</MenuItem>
      </Menu>

      {/* 数据集上传对话框 */}
      <DatasetUploadDialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        onSuccess={handleUploadSuccess}
      />

      {/* 数据集详情对话框 */}
      <DatasetDetailDialog
        open={detailDialogOpen}
        onClose={handleDatasetDetailClose}
        dataset={selectedDatasetForDetail}
      />
    </div>
  );
};

export default DatasetsPage; 
