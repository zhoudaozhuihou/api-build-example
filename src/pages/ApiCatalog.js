import React, { useState, useEffect } from 'react';
import { 
  makeStyles, 
  Paper, 
  Grid, 
  Typography, 
  InputBase, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Container,
  Chip,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Switch,
  Fade
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { 
  Search as SearchIcon, 
  ExpandMore, 
  ExpandLess,
  Code as CodeIcon,
  Http as HttpIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccessTime as AccessTimeIcon,
  Update as UpdateIcon,
  Label as LabelIcon,
  CategoryOutlined as CategoryOutlinedIcon
} from '@material-ui/icons';
import { apiCategories } from '../constants/apiCategories';

// 背景图URL，您可以替换为自己的图片
const headerBgImage = 'https://source.unsplash.com/random/1600x400/?api,technology,digital';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
  },
  headerSection: {
    height: 380,
    backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.8), rgba(0, 0, 0, 0.8)), url(${headerBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.common.white,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(5),
    borderRadius: 0,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.shadows[10],
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  },
  headerContent: {
    textAlign: 'center',
    maxWidth: 800,
    zIndex: 2,
    animation: '$fadeIn 1s ease-out',
  },
  bannerTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 800,
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.4)',
    letterSpacing: '1px',
    position: 'relative',
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: '30%',
      width: '40%',
      height: 4,
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 2,
    },
  },
  headerSubtitle: {
    marginBottom: theme.spacing(5),
    fontWeight: 300,
    textAlign: 'center',
    opacity: 0.9,
    maxWidth: 800,
    lineHeight: 1.5,
  },
  searchContainer: {
    position: 'relative',
    borderRadius: '50px',
    backgroundColor: theme.palette.common.white,
    width: '100%',
    maxWidth: 650,
    display: 'flex',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
      transform: 'translateY(-2px)',
    },
    animation: '$slideUp 0.7s ease-out 0.3s both',
  },
  searchIcon: {
    padding: theme.spacing(0, 3),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
  },
  searchInput: {
    padding: theme.spacing(1.8, 1, 1.8, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
    '&::placeholder': {
      opacity: 0.7,
      fontStyle: 'italic',
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes slideUp': {
    from: {
      opacity: 0,
      transform: 'translateY(40px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  contentSection: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  leftPanel: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
    height: '100%',
  },
  rightPanel: {
    width: '100%',
    paddingBottom: theme.spacing(4),
  },
  nestedItem: {
    paddingLeft: theme.spacing(4),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  doubleNestedItem: {
    paddingLeft: theme.spacing(8),
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  apiCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.1), 0 8px 15px rgba(0,0,0,0.1)',
      '& $apiCardTopBar': {
        height: '8px',
      },
    },
  },
  apiCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'height 0.3s ease',
  },
  apiCardHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 3, 1),
    backgroundColor: theme.palette.background.paper,
  },
  apiIcon: {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontSize: '2rem',
    background: 'rgba(25, 118, 210, 0.1)',
    padding: theme.spacing(1),
    borderRadius: '50%',
  },
  apiTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
  },
  apiDescription: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 3),
    lineHeight: 1.6,
  },
  apiCardContent: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  apiEndpointsContainer: {
    flexGrow: 1,
    margin: theme.spacing(2, 3),
    '& h6': {
      marginBottom: theme.spacing(1.5),
      fontSize: '0.9rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  apiChip: {
    margin: theme.spacing(0.5),
    borderRadius: '50px',
    fontFamily: 'monospace',
    fontWeight: 500,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    '& .MuiChip-icon': {
      color: theme.palette.primary.main,
    },
  },
  apiStats: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5, 3),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  apiStatText: {
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      opacity: 0.7,
    },
  },
  listTitle: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  expandIcon: {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px dashed ${theme.palette.divider}`,
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
  },
  filterSection: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  filterIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  filterGroup: {
    marginBottom: theme.spacing(2),
  },
  filterLabel: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  filterFormControl: {
    minWidth: 120,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  filterChip: {
    margin: theme.spacing(0.5),
  },
  filterActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
  },
  dateFilter: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  dateField: {
    marginRight: theme.spacing(2),
    width: 150,
  },
  filterAccordion: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    '&::before': {
      display: 'none',
    },
    border: '1px solid rgba(0,0,0,0.05)',
  },
  filterAccordionSummary: {
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: theme.shape.borderRadius * 1.5,
    borderTopRightRadius: theme.shape.borderRadius * 1.5,
    '&.Mui-expanded': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  activeFiltersSection: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  activeFilterLabel: {
    marginRight: theme.spacing(1),
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  categoryListContainer: {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 300px)',
    scrollbarWidth: 'thin',
    borderTop: `1px solid ${theme.palette.divider}`,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.default,
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.light,
      borderRadius: 20,
      border: `2px solid transparent`,
      backgroundClip: 'padding-box',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    flexGrow: 1,
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    transition: 'all 0.2s ease',
    borderLeft: '3px solid transparent',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
      borderLeftColor: theme.palette.primary.light,
    },
    '&.selected': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      borderLeftColor: theme.palette.primary.main,
    },
  },
  categoryTextPrimary: {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  categoryActions: {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 1,
    },
  },
  actionButton: {
    padding: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.08)',
    },
  },
  addCategoryButton: {
    margin: theme.spacing(1),
  },
  dialogForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: 300,
  },
  paginationContainer: {
    padding: theme.spacing(4, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paginationInfo: {
    marginBottom: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: theme.spacing(0.5, 2),
    borderRadius: 20,
  },
  apiGridContainer: {
    marginBottom: theme.spacing(2),
  },
  stickyListHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2, 2.5),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitleText: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
  editModeSwitch: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 1.5),
  },
  editModeLabel: {
    fontSize: '0.8rem',
    marginRight: theme.spacing(1),
    fontWeight: 500,
  },
}));

// 模拟API数据
const mockApis = [
  {
    id: 'api-1',
    name: '用户认证API',
    description: '提供用户登录、注册和认证功能的API',
    category: '用户相关',
    subCategory: '用户认证',
    endpoints: ['/auth/login', '/auth/register', '/auth/verify'],
    method: 'POST',
    responseTime: '120ms',
    popularity: 4.8,
    lastUpdated: '2023-05-15',
  },
  {
    id: 'api-2',
    name: '用户资料API',
    description: '获取和更新用户资料信息',
    category: '用户相关',
    subCategory: '用户信息',
    endpoints: ['/users/profile', '/users/update', '/users/avatar'],
    method: 'GET/PUT',
    responseTime: '85ms',
    popularity: 4.5,
    lastUpdated: '2023-06-10',
  },
  {
    id: 'api-3',
    name: '订单管理API',
    description: '创建、查询和管理订单的API',
    category: '订单相关',
    subCategory: '订单管理',
    endpoints: ['/orders/create', '/orders/get', '/orders/cancel'],
    method: 'POST/GET',
    responseTime: '150ms',
    popularity: 4.3,
    lastUpdated: '2023-04-28',
  },
  {
    id: 'api-4',
    name: '支付处理API',
    description: '处理支付、退款和交易记录',
    category: '订单相关',
    subCategory: '支付管理',
    endpoints: ['/payments/process', '/payments/refund', '/payments/records'],
    method: 'POST',
    responseTime: '200ms',
    popularity: 4.7,
    lastUpdated: '2023-07-02',
  },
  {
    id: 'api-5',
    name: '产品目录API',
    description: '获取产品列表、详情和分类信息',
    category: '产品相关',
    subCategory: '产品列表',
    endpoints: ['/products/list', '/products/detail', '/products/categories'],
    method: 'GET',
    responseTime: '95ms',
    popularity: 4.4,
    lastUpdated: '2023-06-22',
  },
];

// 提取所有可用的API方法
const allApiMethods = [...new Set(mockApis.flatMap(api => api.method.split('/')))];

// 响应时间范围
const responseTimeRanges = [
  { label: '全部', value: 'all' },
  { label: '极快 (< 50ms)', value: 'very-fast', max: 50 },
  { label: '快速 (50-100ms)', value: 'fast', min: 50, max: 100 },
  { label: '中等 (100-150ms)', value: 'medium', min: 100, max: 150 },
  { label: '慢速 (> 150ms)', value: 'slow', min: 150 }
];

const ApiCatalog = () => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedApi, setSelectedApi] = useState(null);
  const [filteredApis, setFilteredApis] = useState(mockApis);
  // 分页相关状态
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  // 筛选相关状态
  const [methodFilters, setMethodFilters] = useState({});
  const [responseTimeFilter, setResponseTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // 分类编辑相关状态
  const [categories, setCategories] = useState(apiCategories);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('0');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [contextCategory, setContextCategory] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // 编辑模式状态
  const [editMode, setEditMode] = useState(false);

  // 设置初始方法筛选状态
  useEffect(() => {
    const initialMethodFilters = {};
    allApiMethods.forEach(method => {
      initialMethodFilters[method] = false;
    });
    setMethodFilters(initialMethodFilters);
  }, []);
  
  // 处理筛选和搜索
  useEffect(() => {
    let results = [...mockApis];
    
    // 搜索筛选
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(api => 
        api.name.toLowerCase().includes(query) || 
        api.description.toLowerCase().includes(query) ||
        api.category.toLowerCase().includes(query) ||
        api.subCategory.toLowerCase().includes(query) ||
        api.endpoints.some(endpoint => endpoint.toLowerCase().includes(query))
      );
    }
    
    // 方法筛选
    const activeMethodFilters = Object.entries(methodFilters)
      .filter(([_, isActive]) => isActive)
      .map(([method]) => method);
    
    if (activeMethodFilters.length > 0) {
      results = results.filter(api => 
        activeMethodFilters.some(method => api.method.includes(method))
      );
    }
    
    // 响应时间筛选
    if (responseTimeFilter !== 'all') {
      const range = responseTimeRanges.find(r => r.value === responseTimeFilter);
      if (range) {
        results = results.filter(api => {
          const responseTime = parseInt(api.responseTime);
          if (range.min && range.max) {
            return responseTime >= range.min && responseTime <= range.max;
          } else if (range.min) {
            return responseTime >= range.min;
          } else if (range.max) {
            return responseTime <= range.max;
          }
          return true;
        });
      }
    }
    
    // 日期筛选
    if (startDate) {
      results = results.filter(api => 
        new Date(api.lastUpdated) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      results = results.filter(api => 
        new Date(api.lastUpdated) <= new Date(endDate)
      );
    }
    
    setFilteredApis(results);
    
    // 当搜索或筛选条件改变时，重置到第一页
    setPage(1);
    
    // 更新活跃筛选条件
    const newActiveFilters = [];
    
    if (activeMethodFilters.length > 0) {
      newActiveFilters.push({
        type: 'method',
        label: `方法: ${activeMethodFilters.join(', ')}`,
        onClear: () => {
          const resetFilters = {...methodFilters};
          activeMethodFilters.forEach(method => {
            resetFilters[method] = false;
          });
          setMethodFilters(resetFilters);
        }
      });
    }
    
    if (responseTimeFilter !== 'all') {
      const range = responseTimeRanges.find(r => r.value === responseTimeFilter);
      newActiveFilters.push({
        type: 'responseTime',
        label: `响应时间: ${range.label}`,
        onClear: () => setResponseTimeFilter('all')
      });
    }
    
    if (startDate || endDate) {
      newActiveFilters.push({
        type: 'date',
        label: `更新日期: ${startDate ? startDate : '始至'} - ${endDate ? endDate : '现在'}`,
        onClear: () => {
          setStartDate('');
          setEndDate('');
        }
      });
    }
    
    setActiveFilters(newActiveFilters);
    
  }, [searchQuery, methodFilters, responseTimeFilter, startDate, endDate]);

  // 处理方法筛选变更
  const handleMethodFilterChange = (method) => {
    setMethodFilters(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };
  
  // 清除所有筛选
  const clearAllFilters = () => {
    // 重置方法筛选
    const resetMethodFilters = {};
    allApiMethods.forEach(method => {
      resetMethodFilters[method] = false;
    });
    setMethodFilters(resetMethodFilters);
    
    // 重置其他筛选
    setResponseTimeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  // 方法筛选渲染
  const renderMethodFilters = () => {
    return (
      <FormGroup row>
        {allApiMethods.map(method => (
          <FormControlLabel
            key={method}
            control={
              <Checkbox
                checked={methodFilters[method] || false}
                onChange={() => handleMethodFilterChange(method)}
                color="primary"
                size="small"
              />
            }
            label={method}
          />
        ))}
      </FormGroup>
    );
  };

  // 响应时间筛选渲染
  const renderResponseTimeFilter = () => {
    return (
      <FormControl className={classes.filterFormControl}>
        <InputLabel id="response-time-filter-label">响应时间</InputLabel>
        <Select
          labelId="response-time-filter-label"
          id="response-time-filter"
          value={responseTimeFilter}
          onChange={(e) => setResponseTimeFilter(e.target.value)}
        >
          {responseTimeRanges.map(range => (
            <MenuItem key={range.value} value={range.value}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // 日期筛选渲染
  const renderDateFilter = () => {
    return (
      <div className={classes.dateFilter}>
        <TextField
          label="开始日期"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={classes.dateField}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="结束日期"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={classes.dateField}
          InputLabelProps={{ shrink: true }}
        />
      </div>
    );
  };

  // 渲染活跃筛选条件
  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null;
    
    return (
      <Fade in={activeFilters.length > 0}>
        <div className={classes.activeFiltersSection}>
          <Typography variant="body2" className={classes.activeFilterLabel}>
            活跃筛选:
          </Typography>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              label={filter.label}
              onDelete={filter.onClear}
              className={classes.filterChip}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
          {activeFilters.length > 1 && (
            <Chip
              label="清除全部"
              onClick={clearAllFilters}
              className={classes.filterChip}
              size="small"
              color="secondary"
              variant="outlined"
              deleteIcon={<ClearIcon />}
              onDelete={clearAllFilters}
            />
          )}
        </div>
      </Fade>
    );
  };

  // 处理分类展开/收起
  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // 选择API进行展示
  const handleSelectApi = (api) => {
    setSelectedApi(api);
  };

  // 渲染API卡片
  const renderApiCard = (api) => {
    return (
      <Card 
        key={api.id} 
        className={classes.apiCard}
        onClick={() => handleSelectApi(api)}
      >
        <div className={classes.apiCardTopBar} />
        <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div className={classes.apiCardHeader}>
            <HttpIcon className={classes.apiIcon} />
            <Typography variant="h6" className={classes.apiTitle}>{api.name}</Typography>
          </div>
          <Typography variant="body2" className={classes.apiDescription}>
            {api.description}
          </Typography>
          <CardContent className={classes.apiCardContent}>
            <div className={classes.apiEndpointsContainer}>
              <Typography variant="subtitle2">
                可用端点
              </Typography>
              <Box>
                {api.endpoints.map((endpoint, index) => (
                  <Chip 
                    key={index}
                    label={endpoint}
                    size="small"
                    className={classes.apiChip}
                    icon={<CodeIcon />}
                    variant="outlined"
                  />
                ))}
              </Box>
            </div>
            <div className={classes.apiStats}>
              <Typography variant="body2" className={classes.apiStatText}>
                <AccessTimeIcon />
                响应时间: {api.responseTime}
              </Typography>
              <Typography variant="body2" className={classes.apiStatText}>
                <UpdateIcon />
                更新于: {api.lastUpdated}
              </Typography>
            </div>
          </CardContent>
        </CardContent>
      </Card>
    );
  };

  // 打开分类菜单
  const handleCategoryMenuOpen = (event, category) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setContextCategory(category);
  };

  // 关闭分类菜单
  const handleCategoryMenuClose = () => {
    setMenuAnchorEl(null);
    setContextCategory(null);
  };

  // 打开编辑对话框
  const handleEditDialogOpen = (category, isAdd = false) => {
    setCurrentCategory(category);
    setIsAddMode(isAdd);
    
    if (!isAdd) {
      setCategoryName(category.name || category.label);
      setParentCategory(category.parentId || '0');
    } else {
      setCategoryName('');
      setParentCategory(category ? (category.id || category.value) : '0');
    }
    
    setEditDialogOpen(true);
    handleCategoryMenuClose();
  };

  // 关闭编辑对话框
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentCategory(null);
    setCategoryName('');
    setParentCategory('0');
  };

  // 打开删除确认对话框
  const handleDeleteDialogOpen = (category) => {
    setCurrentCategory(category);
    setDeleteDialogOpen(true);
    handleCategoryMenuClose();
  };

  // 关闭删除确认对话框
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentCategory(null);
  };

  // 保存分类编辑
  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;
    
    // 创建新的分类数组
    let updatedCategories = [...categories];
    
    if (isAddMode) {
      // 添加新分类
      const newCategory = {
        id: `new-${Date.now()}`,
        name: categoryName,
        parentId: parentCategory,
        sort: 1,
        type: 1,
        typeName: '分类',
        classifications: []
      };
      
      if (parentCategory === '0') {
        // 添加到顶层
        updatedCategories.push(newCategory);
      } else {
        // 添加到子分类
        const addToParent = (cats) => {
          return cats.map(cat => {
            const catId = cat.id || cat.value;
            if (catId === parentCategory) {
              // 找到父分类，将新分类添加到其子分类中
              const childrenArray = cat.classifications || [];
              return {
                ...cat,
                classifications: [...childrenArray, newCategory]
              };
            } else if (cat.classifications && cat.classifications.length > 0) {
              // 递归查找子分类
              return {
                ...cat,
                classifications: addToParent(cat.classifications)
              };
            }
            return cat;
          });
        };
        
        updatedCategories = addToParent(updatedCategories);
      }
    } else {
      // 编辑现有分类
      const updateCategory = (cats) => {
        return cats.map(cat => {
          const catId = cat.id || cat.value;
          if (catId === (currentCategory.id || currentCategory.value)) {
            // 更新分类名称
            return {
              ...cat,
              name: categoryName,
              label: categoryName, // 兼容value/label格式
            };
          } else if (cat.classifications && cat.classifications.length > 0) {
            // 递归查找子分类
            return {
              ...cat,
              classifications: updateCategory(cat.classifications)
            };
          }
          return cat;
        });
      };
      
      updatedCategories = updateCategory(updatedCategories);
    }
    
    setCategories(updatedCategories);
    handleEditDialogClose();
  };

  // 删除分类
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    
    const categoryId = currentCategory.id || currentCategory.value;
    
    // 创建新的分类数组
    let updatedCategories = [...categories];
    
    // 删除分类的函数
    const deleteFromCategories = (cats) => {
      return cats.filter(cat => {
        const catId = cat.id || cat.value;
        if (catId === categoryId) {
          return false; // 排除要删除的分类
        }
        
        // 递归处理子分类
        if (cat.classifications && cat.classifications.length > 0) {
          cat.classifications = deleteFromCategories(cat.classifications);
        }
        
        return true;
      });
    };
    
    updatedCategories = deleteFromCategories(updatedCategories);
    setCategories(updatedCategories);
    handleDeleteDialogClose();
  };

  // 获取所有分类的扁平列表（用于下拉选择父分类）
  const getAllCategoriesFlat = (categories, level = 0, result = []) => {
    categories.forEach(category => {
      const categoryId = category.id || category.value;
      const categoryName = category.name || category.label;
      
      result.push({
        id: categoryId,
        name: '—'.repeat(level) + (level > 0 ? ' ' : '') + categoryName,
        level
      });
      
      if (category.classifications && category.classifications.length > 0) {
        getAllCategoriesFlat(category.classifications, level + 1, result);
      }
    });
    
    return result;
  };

  // 切换编辑模式
  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  // 递归渲染分类和子分类
  const renderCategories = (categories, level = 0) => {
    if (!categories) return null;
    
    return categories.map((category) => {
      const categoryId = category.id || category.value;
      const categoryName = category.name || category.label;
      const hasChildren = category.classifications && category.classifications.length > 0;
      const isExpanded = expandedCategories[categoryId];
      
      // 获取与此分类相关的API
      const categoryApis = filteredApis.filter(api => 
        api.category === categoryName || api.subCategory === categoryName
      );
      
      // 如果没有子分类且没有相关API，不显示
      if (!hasChildren && categoryApis.length === 0) return null;
      
      let listItemClass = '';
      if (level === 1) listItemClass = classes.nestedItem;
      if (level === 2) listItemClass = classes.doubleNestedItem;
      
      return (
        <React.Fragment key={categoryId}>
          <ListItem 
            button 
            className={`${listItemClass} ${classes.categoryItem} ${categoryApis.some(api => selectedApi && api.id === selectedApi.id) ? 'selected' : ''}`}
          >
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryToggle(categoryId);
                  }}
                >
                  {isExpanded ? <ExpandLess color="primary" /> : <ExpandMore />}
                </IconButton>
              )}
              <ListItemText 
                primary={categoryName}
                primaryTypographyProps={{ className: classes.categoryTextPrimary }}
                onClick={() => handleCategoryToggle(categoryId)}
              />
            </div>
            {editMode && (
              <div className={classes.categoryActions}>
                <Tooltip title="编辑">
                  <IconButton 
                    className={classes.actionButton}
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
                    className={classes.actionButton}
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
                    className={classes.actionButton}
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
          </ListItem>
          
          {/* 显示此分类的相关API */}
          {categoryApis.length > 0 && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {categoryApis.map(api => (
                <ListItem 
                  button 
                  key={api.id}
                  onClick={() => handleSelectApi(api)}
                  className={`${level === 0 ? classes.nestedItem : classes.doubleNestedItem} ${selectedApi && selectedApi.id === api.id ? 'selected' : ''}`}
                >
                  <ListItemText 
                    primary={api.name} 
                    secondary={`${api.method} | ${api.responseTime}`}
                    primaryTypographyProps={{ style: { fontWeight: selectedApi && selectedApi.id === api.id ? 600 : 400 } }}
                  />
                </ListItem>
              ))}
            </Collapse>
          )}
          
          {/* 递归渲染子分类 */}
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {renderCategories(category.classifications, level + 1)}
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  // 处理分页变化
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // 当切换页面时，取消选中的API
    setSelectedApi(null);
  };

  // 计算当前页应该显示的API
  const getCurrentPageApis = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredApis.slice(startIndex, endIndex);
  };

  return (
    <div className={classes.root}>
      {/* 头部搜索区 */}
      <Paper className={classes.headerSection} elevation={0}>
        <div className={classes.headerContent}>
          <Typography variant="h3" className={classes.bannerTitle}>
            API 目录中心
          </Typography>
          <Typography variant="h6" className={classes.headerSubtitle}>
            探索我们完整的API生态系统，找到适合您项目需求的接口，加速您的开发过程并提升应用功能
          </Typography>
          <div className={classes.searchContainer}>
            <div className={classes.searchIcon}>
              <SearchIcon fontSize="large" />
            </div>
            <InputBase
              placeholder="搜索API名称、描述或端点..."
              classes={{
                root: classes.inputRoot,
                input: classes.searchInput,
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
        </div>
      </Paper>
      
      {/* 内容区 */}
      <Container>
        {/* 筛选部分 */}
        <Accordion 
          className={classes.filterAccordion}
          expanded={isFilterAccordionOpen}
          onChange={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            className={classes.filterAccordionSummary}
          >
            <div className={classes.filterTitle}>
              <FilterListIcon className={classes.filterIcon} />
              <Typography variant="h6">筛选选项</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.filterLabel}>API 方法</Typography>
                {renderMethodFilters()}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.filterLabel}>响应时间</Typography>
                {renderResponseTimeFilter()}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.filterLabel}>更新日期</Typography>
                {renderDateFilter()}
              </Grid>
              <Grid item xs={12}>
                <div className={classes.filterActions}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={clearAllFilters}
                  >
                    清除所有筛选
                  </Button>
                </div>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* 显示活跃筛选条件 */}
        {renderActiveFilters()}

        <Grid container spacing={4} className={classes.contentSection}>
          {/* 左侧API列表 */}
          <Grid item xs={12} md={4}>
            <Paper className={classes.leftPanel}>
              <div className={classes.stickyListHeader}>
                <Typography variant="subtitle1" className={classes.headerTitleText}>
                  <CategoryOutlinedIcon /> API 分类
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={classes.editModeSwitch}>
                    <Typography variant="caption" className={classes.editModeLabel}>
                      编辑模式
                    </Typography>
                    <Switch
                      size="small"
                      checked={editMode}
                      onChange={handleEditModeToggle}
                      color="default"
                    />
                    {editMode ? (
                      <VisibilityIcon fontSize="small" style={{ marginLeft: 4, color: 'white' }} />
                    ) : (
                      <VisibilityOffIcon fontSize="small" style={{ marginLeft: 4, color: 'white' }} />
                    )}
                  </div>
                  {editMode && (
                    <Tooltip title="添加顶级分类">
                      <IconButton 
                        size="small"
                        color="inherit"
                        onClick={() => handleEditDialogOpen(null, true)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className={classes.categoryListContainer}>
                <List component="nav" aria-label="api categories">
                  {renderCategories(categories)}
                </List>
              </div>
            </Paper>
          </Grid>
          
          {/* 右侧API详情 */}
          <Grid item xs={12} md={8}>
            <div className={classes.rightPanel}>
              {selectedApi ? (
                // 显示选中的API
                <Box mb={2}>
                  {renderApiCard(selectedApi)}
                </Box>
              ) : filteredApis.length > 0 ? (
                // 分页显示API
                <>
                  <Grid container spacing={3} className={classes.apiGridContainer}>
                    {getCurrentPageApis().map(api => (
                      <Grid item xs={12} sm={6} key={api.id}>
                        {renderApiCard(api)}
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* 分页控件 */}
                  <div className={classes.paginationContainer}>
                    <Typography variant="body2" className={classes.paginationInfo}>
                      显示 {Math.min((page - 1) * rowsPerPage + 1, filteredApis.length)} - {Math.min(page * rowsPerPage, filteredApis.length)} 条，共 {filteredApis.length} 条记录
                    </Typography>
                    <Pagination 
                      count={Math.ceil(filteredApis.length / rowsPerPage)} 
                      page={page} 
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                      size="large"
                    />
                  </div>
                </>
              ) : (
                // 没有找到API
                <Paper className={classes.emptyState}>
                  <SearchIcon className={classes.emptyStateIcon} />
                  <div className={classes.emptyStateText}>
                    <Typography variant="h6" gutterBottom>
                      没有找到符合条件的API
                    </Typography>
                    <Typography variant="body2">
                      请尝试不同的搜索关键词或调整筛选条件，以查找所需的API
                    </Typography>
                  </div>
                </Paper>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
      
      {/* 编辑分类对话框 */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isAddMode ? "添加分类" : "编辑分类"}</DialogTitle>
        <DialogContent>
          <div className={classes.dialogForm}>
            <TextField
              label="分类名称"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              autoFocus
              margin="dense"
              variant="outlined"
            />
            {isAddMode && (
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>父分类</InputLabel>
                <Select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  label="父分类"
                >
                  <MenuItem value="0">顶级分类</MenuItem>
                  {getAllCategoriesFlat(categories).map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            取消
          </Button>
          <Button 
            onClick={handleSaveCategory} 
            color="primary" 
            variant="contained"
            disabled={!categoryName.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除分类 "{currentCategory ? (currentCategory.name || currentCategory.label) : ''}" 吗？
            {currentCategory && currentCategory.classifications && currentCategory.classifications.length > 0 && (
              <Box mt={1} style={{ color: 'red', fontWeight: 'bold' }}>
                注意：所有子分类也将被删除！
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteCategory} color="secondary" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApiCatalog; 