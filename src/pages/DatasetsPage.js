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
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  InputBase,
  Tooltip,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select
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
  Event as EventIcon,
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
  ChevronLeft as ChevronLeftIcon,
  AccountTree as LineageIcon,
  Category as CategoryOutlinedIcon,
  Label as LabelIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { apiCategories } from '../constants/apiCategories';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import FeatureGuard from '../components/FeatureGuard';
import DatasetUploadDialog from '../components/DatasetUploadDialog';
import DatasetFilter from '../components/DatasetFilter';
import DatasetDetailDialog from '../components/DatasetDetailDialog';
import SearchDropdown from '../components/SearchDropdown';
import DatasetSearchResultDialog from '../components/DatasetSearchResultDialog';

// Import new common components
import ManagementLayout from '../components/common/ManagementLayout';
import {
  datasetFilterConfig,
  datasetCategoryConfig,
  datasetHeaderConfig,
  datasetCardGridConfig,
} from '../config/datasetPageConfig';

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
    color: theme.palette.text.primary,
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardActions: {
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
  },
  statusChip: {
    fontSize: '0.7rem',
  },
  categoryChip: {
    fontSize: '0.65rem',
    height: '22px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0,0,0,0.04)',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: theme.spacing(0, 0.5, 0, 0),
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
    minHeight: '320px', // 增加最小高度以适应更多内容
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    borderRadius: theme.shape.borderRadius * 1.5,
    overflow: 'visible', // 允许内容可见
    border: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    [theme.breakpoints.down('xs')]: {
      minHeight: '300px', // 小屏幕下最小高度
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      '& $datasetCardTopBar': {
        height: '8px',
      },
    },
  },
  datasetCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'height 0.3s ease',
  },
  datasetCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(2, 3, 1),
    backgroundColor: theme.palette.background.paper,
    minHeight: '80px', // 改为最小高度，允许自适应
    maxHeight: '120px', // 设置最大高度防止过高
  },
  datasetCardContent: {
    padding: theme.spacing(0),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  datasetCardDetails: {
    display: 'flex',
    flexWrap: 'wrap', // 允许换行以适应内容
    padding: theme.spacing(1, 3),
    marginBottom: theme.spacing(1),
    minHeight: '40px', // 改为最小高度
    flex: '1 1 auto', // 自动填充可用空间
  },
  datasetCardDetailItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
    whiteSpace: 'nowrap', // 防止文本换行
    minWidth: 'fit-content', // 确保内容能正常显示
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.secondary,
    },
    '& .MuiTypography-root': {
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
    }
  },
  datasetCardFooter: {
    marginTop: 'auto', // 将footer推到底部
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'rgba(0,0,0,0.02)',
    minHeight: '65px', // 调整高度以适应两行内容
    flexShrink: 0, // 防止被压缩
  },
  datasetCardCategories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  datasetCardActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(0.5),
  },
  datasetCardAction: {
    padding: 4,
  },
  datasetDescription: {
    color: theme.palette.text.secondary,
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    height: '2.4em', // 固定高度
    lineHeight: 1.2,
    fontSize: '0.85rem',
    marginTop: theme.spacing(0.5),
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
  
  // 搜索结果对话框状态
  const [searchResultDialogOpen, setSearchResultDialogOpen] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  
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

  // 分类编辑相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('0');
  const [isAddMode, setIsAddMode] = useState(false);
  
  // 全局搜索状态
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalSearchResults, setTotalSearchResults] = useState(0);
  
  // 高级搜索状态
  const [searchScope, setSearchScope] = useState(['all']);
  const [quickFilters, setQuickFilters] = useState({
    type: '',
    status: '',
    size: '',
    popularity: ''
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    title: '',
    description: '',
    author: '',
    dateRange: { start: '', end: '' }
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 搜索处理函数
  const handleSearchQueryChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // 实时搜索
    if (value.trim()) {
      performGlobalSearch({
        query: value,
        scope: searchScope,
        filters: quickFilters,
        advanced: advancedFilters
      });
    } else {
      setGlobalSearchResults([]);
      setTotalSearchResults(0);
      setFilteredDatasets(datasets);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setGlobalSearchResults([]);
    setTotalSearchResults(0);
    setShowSearchResults(false);
    setFilteredDatasets(datasets);
  };

  const handleSearchResultClick = (dataset) => {
    handleDatasetDetailOpen(dataset);
  };

  const handleSearchViewAll = () => {
    handleSearchResultDialogOpen(searchQuery);
  };

  // 转换数据集格式以适配SearchDropdown组件
  const transformedSearchResults = globalSearchResults.map(dataset => ({
    id: dataset.id,
    title: dataset.title,
    description: dataset.description,
    type: dataset.type,
    size: dataset.dataSize,
    status: dataset.status === 'public' ? '公开' : '私有'
  }));

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


  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      handleEnhancedSearch();
    }
  };
  
  const handleEnhancedSearch = () => {
    if (searchQuery.trim()) {
      performGlobalSearch({
        query: searchQuery,
        scope: searchScope,
        filters: quickFilters,
        advanced: advancedFilters
      });
      setShowSearchResults(true);
    }
  };
  
  const handleQuickFilterChange = (filterType, value) => {
    const newQuickFilters = {
      ...quickFilters,
      [filterType]: quickFilters[filterType] === value ? '' : value
    };
    setQuickFilters(newQuickFilters);
    
    // 如果有搜索词，重新搜索
    if (searchQuery.trim()) {
      performGlobalSearch({
        query: searchQuery,
        scope: searchScope,
        filters: newQuickFilters,
        advanced: advancedFilters
      });
    }
  };
  
  const performGlobalSearch = async (searchParams) => {
    setSearchLoading(true);
    try {
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

  // 分类编辑处理函数
  const handleEditDialogOpen = (category, isAdd = false) => {
    setCurrentCategory(category);
    setIsAddMode(isAdd);
    
    if (!isAdd && category) {
      setCategoryName(category.name || category.label);
      setParentCategory(category.parentId || '0');
    } else {
      setCategoryName('');
      setParentCategory(category ? (category.id || category.value) : '0');
    }
    
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentCategory(null);
    setCategoryName('');
    setParentCategory('0');
  };

  const handleDeleteDialogOpen = (category) => {
    setCurrentCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentCategory(null);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;
    
    // TODO: 实现分类保存逻辑
    console.log('保存分类:', { categoryName, parentCategory, isAddMode });
    
    handleEditDialogClose();
  };

  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    
    // TODO: 实现分类删除逻辑
    console.log('删除分类:', currentCategory);
    
    handleDeleteDialogClose();
  };

  const getAllCategoriesFlat = (categories, level = 0, result = []) => {
    categories.forEach(category => {
      const categoryData = {
        id: category.id || category.value,
        name: category.name || category.label,
        level: level
      };
      result.push(categoryData);
      
      if (category.classifications && category.classifications.length > 0) {
        getAllCategoriesFlat(category.classifications, level + 1, result);
      }
    });
    
    return result;
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
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Typography variant="body2" style={{ fontWeight: level === 0 ? 600 : 400 }}>
                    {categoryName}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={totalDatasetCount} 
                    style={{ 
                      fontSize: '0.7rem', 
                      height: '20px',
                      backgroundColor: level === 0 ? '#e3f2fd' : '#f5f5f5',
                      marginLeft: '8px'
                    }} 
                  />
                </div>
                {editMode && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="编辑">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDialogOpen(category);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDialogOpen(category);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="添加子分类">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDialogOpen(category, true);
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
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
            <Card className={classes.datasetCard}>
              <div className={classes.datasetCardTopBar}></div>
              <CardContent className={classes.datasetCardContent}>
                <div className={classes.datasetCardHeader}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" className={classes.datasetTitle}>
                      {dataset.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className={classes.datasetDescription}>
                      {dataset.description}
                    </Typography>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 8 }}>
                    <Chip 
                      label={dataset.status === 'public' ? '公开' : '私有'} 
                      size="small"
                      color={dataset.status === 'public' ? 'primary' : 'default'}
                      variant="outlined"
                      className={classes.statusChip}
                    />
                  </div>
                </div>
                
                <div className={classes.datasetCardDetails}>
                  <div className={classes.datasetCardDetailItem}>
                    <StorageIcon />
                    <Typography variant="body2">{dataset.dataSize}</Typography>
                  </div>
                  <div className={classes.datasetCardDetailItem}>
                    <DescriptionIcon />
                    <Typography variant="body2">{dataset.fileCount} 个文件</Typography>
                  </div>
                  <div className={classes.datasetCardDetailItem}>
                    <EventIcon />
                    <Typography variant="body2">{dataset.updatedAt}</Typography>
                  </div>
                </div>
                
                <div className={classes.datasetCardFooter}>
                  {/* 第一行：分类标签 */}
                  <div className={classes.datasetCardCategories}>
                    <Chip 
                      size="small" 
                      label={dataset.type} 
                      className={classes.categoryChip}
                      color="primary"
                      variant="outlined"
                    />
                    {dataset.categories.slice(0, 2).map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        className={classes.categoryChip}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {dataset.categories.length > 2 && (
                      <Chip
                        label={`+${dataset.categories.length - 2}个`}
                        size="small"
                        className={classes.categoryChip}
                        color="default"
                      />
                    )}
                  </div>
                  
                  {/* 第二行：操作按钮 */}
                  <div className={classes.datasetCardActions}>
                    <Tooltip title="查看详情">
                      <IconButton 
                        size="small" 
                        className={classes.datasetCardAction}
                        onClick={() => handleDatasetDetailOpen(dataset)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="下载">
                      <IconButton size="small" className={classes.datasetCardAction}>
                        <Badge badgeContent={dataset.popularity} color="primary" max={99} overlap="rectangular">
                          <DownloadIcon fontSize="small" />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="收藏">
                      <IconButton size="small" className={classes.datasetCardAction}>
                        {dataset.id % 2 === 0 ? (
                          <BookmarkIcon fontSize="small" color="primary" />
                        ) : (
                          <BookmarkBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="更多操作">
                      <IconButton 
                        size="small" 
                        className={classes.datasetCardAction}
                        onClick={(event) => handleMenuOpen(event, dataset.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
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

  // 搜索结果对话框处理函数
  const handleSearchResultDialogOpen = (searchQuery) => {
    setCurrentSearchQuery(searchQuery);
    setSearchResultDialogOpen(true);
  };

  const handleSearchResultDialogClose = () => {
    setSearchResultDialogOpen(false);
    setCurrentSearchQuery('');
  };

  const handleDatasetClickFromSearch = (dataset) => {
    setSelectedDatasetForDetail(dataset);
    setDetailDialogOpen(true);
  };

  const handleDatasetDownloadFromSearch = (dataset) => {
    console.log('下载数据集:', dataset);
    // 实现下载逻辑
  };

  const handleDatasetFavoriteFromSearch = (datasetId, isFavorite) => {
    console.log('收藏数据集:', datasetId, isFavorite);
    // 实现收藏逻辑
  };

  const handleSearchResultPageChange = (newPage) => {
    // 实现分页逻辑
    console.log('切换页面:', newPage);
  };



  // 配置数据集页面的各个部分
  const headerConfigData = {
    ...datasetHeaderConfig,
    searchQuery,
    onSearchChange: handleSearchQueryChange,
    onSearchClear: handleSearchClear,
    searchResults: transformedSearchResults,
    totalResults: totalSearchResults,
    searchLoading,
    onImportClick: handleUploadDialogOpen,
    totalCount: filteredDatasets.length,
    // SearchDropdown specific props
    onSearchResultClick: handleSearchResultClick,
    onSearchViewAll: handleSearchViewAll,
    transformedSearchResults,
    onKeyPress: handleKeyPress,
    renderResultItem: (item) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StorageIcon style={{ marginRight: 8, fontSize: '1rem' }} />
        <div>
          <div style={{ fontWeight: 500 }}>{item.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.type}</div>
        </div>
      </div>
    )
  };

  const filterConfigData = {
    ...datasetFilterConfig,
    onFilterClear: handleClearAllFilters
  };

  const categoryConfigData = {
    ...datasetCategoryConfig,
    categories: apiCategories,
    selectedCategory: selectedCategory,
    onCategorySelect: handleCategorySelect,
    expandedCategories: expandedCategories,
    onToggleExpanded: handleNodeToggle,
    editMode: editMode,
    onEditModeToggle: handleEditModeToggle,
    onEditCategory: handleEditDialogOpen,
    onDeleteCategory: handleDeleteDialogOpen,
    onAddCategory: (category) => handleEditDialogOpen(category, true),
    getItemCount: (category) => {
      const getNestedDatasetCount = (catList) => {
        let count = 0;
        catList.forEach(cat => {
          const categoryMatch = filteredDatasets.filter(dataset => 
            dataset.category === cat.value || 
            (dataset.categories && dataset.categories.includes(cat.value))
          );
          count += categoryMatch.length;
          if (cat.children) {
            count += getNestedDatasetCount(cat.children);
          }
        });
        return count;
      };

      if (category.children) {
        return getNestedDatasetCount(category.children);
      } else {
        return filteredDatasets.filter(dataset => 
          dataset.category === category.value || 
          (dataset.categories && dataset.categories.includes(category.value))
        ).length;
      }
    }
  };

  const cardGridConfigData = {
    ...datasetCardGridConfig,
    items: filteredDatasets,
    totalCount: filteredDatasets.length,
    publicCount: filteredDatasets.filter(dataset => dataset.status === 'public').length,
    searchQuery,
    onSearchClear: handleSearchClear,
    renderCard: (dataset) => renderDatasetCard(dataset),
    customStats: [
      // 可以添加额外的统计信息芯片
    ]
  };

  // 将当前的 activeFilters 转换为新格式
  const currentActiveFilters = {
    accessLevel: statusFilter,
    categories: typeFilters,
    dataFormat: themeFilters,
    updateFrequency: null, // TODO: 添加更新频率状态
    dataSize: dataSizeFilter !== 'all' ? [0, 1000] : null // 简化数据大小范围
  };

  const handleNewFilterChange = (filterKey, value) => {
    console.log('Filter change:', filterKey, value);
    
    switch (filterKey) {
      case 'accessLevel':
        setStatusFilter(value);
        break;
      case 'categories':
        // 数据类型筛选
        if (Array.isArray(value)) {
          setTypeFilters(value);
        } else if (value === null) {
          setTypeFilters([]);
        } else {
          setTypeFilters([value]);
        }
        break;
      case 'dataFormat':
        // 数据格式筛选
        if (Array.isArray(value)) {
          setThemeFilters(value);
        } else if (value === null) {
          setThemeFilters([]);
        } else {
          setThemeFilters([value]);
        }
        break;
      case 'updateFrequency':
        // 更新频率筛选（新增）
        if (Array.isArray(value)) {
          // 处理多选
          // TODO: 添加更新频率状态
        } else {
          // 处理单选
          // TODO: 添加更新频率状态
        }
        break;
      case 'dataSize':
        if (Array.isArray(value) && value.length === 2) {
          setDataSizeFilter(value[1]);
        } else if (value === null) {
          setDataSizeFilter('all');
        }
        break;
      default:
        console.warn('Unknown filter key:', filterKey);
        break;
    }
  };

  // 渲染单个数据集卡片的函数
  const renderDatasetCard = (dataset) => {
    const safeDataset = {
      id: dataset?.id || 'unknown',
      name: dataset?.name || '未知数据集',
      description: dataset?.description || '暂无描述',
      type: dataset?.type || '未知类型',
      status: dataset?.status || 'private',
      size: dataset?.size || '0MB',
      lastUpdated: dataset?.lastUpdated || '未知',
      downloadCount: dataset?.downloadCount || 0,
      categories: dataset?.categories || [],
      tags: dataset?.tags || [],
      owner: dataset?.owner || '未知',
      format: dataset?.format || '未知格式',
      isFavorite: dataset?.isFavorite || false,
      ...dataset
    };

    return (
      <Card key={safeDataset.id} className={classes.card} onClick={() => handleDatasetDetailOpen(safeDataset)}>
        {/* 顶部渐变条 */}
        <Box 
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
          }} 
        />
        
        {/* 卡片头部 - 标题和状态 */}
        <CardContent style={{ 
          padding: '16px 16px 0px 16px',
          minHeight: '80px',
          maxHeight: '120px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box flex={1} mr={1}>
              <Typography className={classes.datasetTitle}>
                {safeDataset.name}
              </Typography>
              <Typography className={classes.datasetType}>
                <StorageIcon className={classes.datasetIcon} />
                {safeDataset.type}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Chip 
                label={safeDataset.status === 'public' ? '公开' : safeDataset.status === 'private' ? '私有' : '受限'}
                size="small"
                className={classes.statusChip}
                color={safeDataset.status === 'public' ? 'primary' : safeDataset.status === 'private' ? 'default' : 'secondary'}
              />
            </Box>
          </Box>
        </CardContent>

        {/* 卡片详情 - 描述和信息 */}
        <CardContent style={{ 
          padding: '8px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 描述 */}
          <Typography 
            variant="body2" 
            color="textSecondary"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.4em',
              lineHeight: '1.2em',
              marginBottom: '8px',
              flex: 1
            }}
          >
            {safeDataset.description}
          </Typography>

          {/* 数据集信息 */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" color="textSecondary">
              大小: {safeDataset.size}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              下载: {safeDataset.downloadCount}次
            </Typography>
          </Box>
          <Typography variant="caption" color="textSecondary">
            更新: {safeDataset.lastUpdated}
          </Typography>
        </CardContent>

        {/* 卡片底部 - 分类标签和操作按钮，分两行显示 */}
        <CardActions style={{ 
          padding: '8px 16px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          minHeight: '75px'
        }}>
          {/* 第一行：分类标签 */}
          <Box mb={1} style={{ 
            minHeight: '26px', 
            display: 'flex', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {/* 数据类型标签 */}
            <Chip
              label={safeDataset.type}
              size="small"
              color="primary"
              variant="outlined"
              icon={<CategoryOutlinedIcon fontSize="small" />}
              style={{ 
                fontSize: '0.65rem',
                height: '22px'
              }}
            />
            
            {/* 数据格式标签 */}
            {safeDataset.format && (
              <Chip
                label={safeDataset.format}
                size="small"
                color="secondary"
                variant="outlined"
                icon={<LabelIcon fontSize="small" />}
                style={{ 
                  fontSize: '0.65rem',
                  height: '22px'
                }}
              />
            )}
            
            {/* 其他分类标签 */}
            {safeDataset.categories && safeDataset.categories.length > 0 && (
              safeDataset.categories.slice(0, 1).map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  variant="outlined"
                  style={{ 
                    fontSize: '0.65rem',
                    height: '22px',
                    maxWidth: '80px'
                  }}
                />
              ))
            )}
            
            {/* 显示更多分类 */}
            {safeDataset.categories && safeDataset.categories.length > 1 && (
              <Tooltip title={safeDataset.categories.slice(1).join(', ')}>
                <Chip
                  label={`+${safeDataset.categories.length - 1}`}
                  size="small"
                  variant="outlined"
                  style={{ 
                    fontSize: '0.65rem',
                    height: '22px',
                    minWidth: '30px'
                  }}
                />
              </Tooltip>
            )}
          </Box>
          
          {/* 第二行：操作按钮 */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={0.5}>
            <Tooltip title="查看详情">
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDatasetDetailOpen(safeDataset);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="查看数据血缘">
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: 实现数据血缘功能
                  console.log('查看数据血缘:', safeDataset.name);
                }}
              >
                <LineageIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={safeDataset.isFavorite ? "取消收藏" : "收藏"}>
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  // 处理收藏逻辑
                }}
              >
                {safeDataset.isFavorite ? <FavoriteIcon color="secondary" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="下载数据集">
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  // 处理下载逻辑
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="更多操作">
              <IconButton 
                size="small"
                onClick={(e) => handleMenuOpen(e, safeDataset.id)}
              >
                <MoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    );
  };

  return (
    <div className={classes.root}>
      <ManagementLayout
        headerConfig={headerConfigData}
        filterConfig={filterConfigData}
        activeFilters={currentActiveFilters}
        onFilterChange={handleNewFilterChange}
        showFilters={true}
        categoryConfig={categoryConfigData}
        showCategory={true}
        cardGridConfig={cardGridConfigData}
        leftColumnWidth={3}
        rightColumnWidth={9}
        showFilterInLeftColumn={false}
      />

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

      {/* 搜索结果对话框 */}
      <DatasetSearchResultDialog
        open={searchResultDialogOpen}
        onClose={handleSearchResultDialogClose}
        searchQuery={currentSearchQuery}
        searchResults={globalSearchResults}
        totalResults={totalSearchResults}
        loading={searchLoading}
        onDatasetClick={handleDatasetClickFromSearch}
        onDatasetDownload={handleDatasetDownloadFromSearch}
        onDatasetFavorite={handleDatasetFavoriteFromSearch}
        onPageChange={handleSearchResultPageChange}
        page={1}
        pageSize={10}
      />

      {/* 分类编辑对话框 */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>{isAddMode ? '添加分类' : '编辑分类'}</DialogTitle>
        <DialogContent>
          <TextField
            label="分类名称"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          {isAddMode && (
            <FormControl fullWidth margin="normal">
              <InputLabel>父分类</InputLabel>
              <Select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
              >
                <MenuItem value="0">
                  <em>顶级分类</em>
                </MenuItem>
                {getAllCategoriesFlat(apiCategories).map((cat) => (
                  <MenuItem key={cat.id} value={cat.id} disabled={cat.id === (currentCategory?.id || currentCategory?.value)}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleSaveCategory} color="primary" variant="contained" disabled={!categoryName.trim()}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除分类 "{currentCategory?.name || currentCategory?.label}" 吗？
            {currentCategory?.classifications?.length > 0 && (
              <span> 此操作也将删除所有子分类。</span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteCategory} color="secondary">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DatasetsPage; 
