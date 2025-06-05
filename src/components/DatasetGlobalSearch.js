import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Divider,
  Chip,
  Box,
  Typography,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Popover,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Button,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Grid,
  Badge
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Storage as StorageIcon,
  Category as CategoryIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Description as FileIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Sort as SortIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    position: 'relative',
    marginBottom: theme.spacing(3),
  },
  searchPaper: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.spacing(3),
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    '&:focus-within': {
      boxShadow: theme.shadows[8],
      borderColor: theme.palette.primary.dark,
    },
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: '1.1rem',
    '& input': {
      padding: theme.spacing(1.5, 0),
    },
  },
  searchIcon: {
    padding: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  clearButton: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  filterButton: {
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(2),
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  quickFilters: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  quickFilterChip: {
    borderRadius: theme.spacing(2),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  activeFilter: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  searchSuggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: theme.spacing(1),
    maxHeight: 400,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[8],
  },
  suggestionSection: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  suggestionItem: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5, 0),
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  suggestionText: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  suggestionSecondary: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  searchStats: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    padding: theme.spacing(1, 0),
  },
  statChip: {
    fontSize: '0.75rem',
    height: 24,
  },
  advancedSearchPopover: {
    padding: theme.spacing(3),
    maxWidth: 500,
  },
  advancedSearchTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  formRow: {
    marginBottom: theme.spacing(2),
  },
  searchHistory: {
    maxHeight: 200,
    overflow: 'auto',
  },
  recentSearchItem: {
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.5),
    margin: theme.spacing(0.25, 0),
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  searchResultPreview: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
  },
  previewCard: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  },
  previewTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  previewMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  highlightText: {
    backgroundColor: theme.palette.warning.light,
    padding: theme.spacing(0.25),
    borderRadius: theme.spacing(0.5),
    fontWeight: 600,
  },
  searchScope: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  scopeChip: {
    fontSize: '0.75rem',
    height: 24,
  },
}));

const DatasetGlobalSearch = ({ 
  onSearch, 
  onFilterChange, 
  datasets = [], 
  loading = false,
  searchResults = [],
  totalResults = 0 
}) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [quickFilters, setQuickFilters] = useState({
    type: '',
    status: '',
    size: '',
    popularity: '',
    recent: false,
  });
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    title: '',
    description: '',
    categories: [],
    author: '',
    dateRange: { start: '', end: '' },
    fileTypes: [],
    sizeRange: { min: '', max: '' },
    includeFields: ['title', 'description', 'categories', 'type', 'tags'],
  });
  const [searchScope, setSearchScope] = useState(['all']);
  
  const searchInputRef = useRef(null);
  const advancedSearchAnchorRef = useRef(null);

  // 搜索建议数据
  const [suggestions, setSuggestions] = useState({
    recent: [],
    popular: [],
    categories: [],
    types: [],
    authors: [],
  });

  // 快速筛选选项
  const quickFilterOptions = {
    type: [
      { label: '结构化数据', value: 'structured', icon: <StorageIcon /> },
      { label: '文本数据', value: 'text', icon: <LanguageIcon /> },
      { label: '图像数据', value: 'image', icon: <FileIcon /> },
      { label: '时间序列', value: 'timeseries', icon: <TrendingIcon /> },
    ],
    status: [
      { label: '公开', value: 'public', icon: <PublicIcon /> },
      { label: '私有', value: 'private', icon: <PrivateIcon /> },
    ],
    size: [
      { label: '小型 (<100MB)', value: 'small' },
      { label: '中型 (100MB-1GB)', value: 'medium' },
      { label: '大型 (>1GB)', value: 'large' },
    ],
    popularity: [
      { label: '热门', value: 'hot', icon: <StarIcon /> },
      { label: '最新', value: 'new', icon: <TimeIcon /> },
    ],
  };

  // 搜索范围选项
  const searchScopeOptions = [
    { label: '全部字段', value: 'all', icon: <SearchIcon /> },
    { label: '标题', value: 'title', icon: <FileIcon /> },
    { label: '描述', value: 'description', icon: <LanguageIcon /> },
    { label: '分类', value: 'categories', icon: <CategoryIcon /> },
    { label: '标签', value: 'tags', icon: <CategoryIcon /> },
    { label: '作者', value: 'author', icon: <PersonIcon /> },
  ];

  // 处理搜索输入
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setShowSuggestions(true);
      generateSuggestions(value);
    } else {
      setShowSuggestions(false);
    }
  };

  // 生成搜索建议
  const generateSuggestions = (query) => {
    const lowercaseQuery = query.toLowerCase();
    
    // 基于现有数据集生成建议
    const matchingCategories = [...new Set(
      datasets.flatMap(d => d.categories || [])
        .filter(cat => cat.toLowerCase().includes(lowercaseQuery))
    )].slice(0, 5);

    const matchingTypes = [...new Set(
      datasets.map(d => d.type)
        .filter(type => type.toLowerCase().includes(lowercaseQuery))
    )].slice(0, 3);

    const matchingDatasets = datasets
      .filter(d => 
        d.title.toLowerCase().includes(lowercaseQuery) ||
        d.description.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 5);

    setSuggestions({
      recent: searchHistory.filter(h => h.toLowerCase().includes(lowercaseQuery)).slice(0, 3),
      popular: ['用户行为', '商品评论', '销售预测', '图像识别'].filter(p => 
        p.toLowerCase().includes(lowercaseQuery)
      ).slice(0, 3),
      categories: matchingCategories,
      types: matchingTypes,
      datasets: matchingDatasets,
    });
  };

  // 执行搜索
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 添加到搜索历史
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(h => h !== searchQuery)].slice(0, 10);
        localStorage.setItem('datasetSearchHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      // 构建搜索参数
      const searchParams = {
        query: searchQuery,
        scope: searchScope,
        filters: quickFilters,
        advanced: advancedFilters,
      };

      onSearch && onSearch(searchParams);
      setShowSuggestions(false);
    }
  };

  // 处理快速筛选
  const handleQuickFilter = (filterType, value) => {
    setQuickFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: prev[filterType] === value ? '' : value
      };
      
      // 自动触发搜索
      const searchParams = {
        query: searchQuery,
        scope: searchScope,
        filters: newFilters,
        advanced: advancedFilters,
      };
      onSearch && onSearch(searchParams);
      
      return newFilters;
    });
  };

  // 清除搜索
  const handleClear = () => {
    setSearchQuery('');
    setQuickFilters({
      type: '',
      status: '',
      size: '',
      popularity: '',
      recent: false,
    });
    setShowSuggestions(false);
    onSearch && onSearch({ query: '', scope: searchScope, filters: {}, advanced: {} });
  };

  // 处理建议项点击
  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'dataset') {
      setSearchQuery(suggestion.title);
    } else {
      setSearchQuery(suggestion);
    }
    setShowSuggestions(false);
    
    // 延迟执行搜索以确保状态更新
    setTimeout(() => {
      const searchParams = {
        query: type === 'dataset' ? suggestion.title : suggestion,
        scope: searchScope,
        filters: quickFilters,
        advanced: advancedFilters,
      };
      onSearch && onSearch(searchParams);
    }, 100);
  };

  // 处理搜索范围变化
  const handleScopeChange = (scope) => {
    if (scope === 'all') {
      setSearchScope(['all']);
    } else {
      setSearchScope(prev => {
        const newScope = prev.includes('all') ? [scope] : 
          prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev.filter(s => s !== 'all'), scope];
        return newScope.length === 0 ? ['all'] : newScope;
      });
    }
  };

  // 高亮搜索结果
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={classes.highlightText}>
          {part}
        </span>
      ) : part
    );
  };

  // 初始化搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('datasetSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 键盘事件处理
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <Box className={classes.searchContainer}>
      {/* 搜索范围选择 */}
      <Box className={classes.searchScope}>
        {searchScopeOptions.map((option) => (
          <Chip
            key={option.value}
            icon={option.icon}
            label={option.label}
            size="small"
            variant={searchScope.includes(option.value) || (searchScope.includes('all') && option.value === 'all') ? 'default' : 'outlined'}
            color={searchScope.includes(option.value) || (searchScope.includes('all') && option.value === 'all') ? 'primary' : 'default'}
            onClick={() => handleScopeChange(option.value)}
            className={classes.scopeChip}
          />
        ))}
      </Box>

      {/* 主搜索框 */}
      <Paper className={classes.searchPaper} elevation={0}>
        <IconButton className={classes.searchIcon} onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <InputBase
          ref={searchInputRef}
          className={classes.searchInput}
          placeholder="搜索数据集名称、描述、分类、标签、作者..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
        />
        {loading && <CircularProgress size={20} />}
        {searchQuery && (
          <IconButton className={classes.clearButton} onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        )}
        <Divider orientation="vertical" flexItem />
        <Tooltip title="高级搜索">
          <IconButton
            ref={advancedSearchAnchorRef}
            className={classes.filterButton}
            onClick={() => setAdvancedSearchOpen(true)}
          >
            <FilterIcon />
            <ArrowDropDownIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* 搜索统计 */}
      {(searchQuery || Object.values(quickFilters).some(f => f)) && (
        <Box className={classes.searchStats}>
          <Chip
            icon={<SearchIcon />}
            label={`找到 ${totalResults} 个结果`}
            size="small"
            className={classes.statChip}
            color="primary"
            variant="outlined"
          />
          {searchQuery && (
            <Chip
              icon={<CloseIcon />}
              label={`搜索: "${searchQuery}"`}
              size="small"
              className={classes.statChip}
              onDelete={() => {
                setSearchQuery('');
                onSearch && onSearch({ query: '', scope: searchScope, filters: quickFilters, advanced: advancedFilters });
              }}
            />
          )}
        </Box>
      )}

      {/* 快速筛选器 */}
      <Box className={classes.quickFilters}>
        {Object.entries(quickFilterOptions).map(([filterType, options]) => (
          <Box key={filterType} display="flex" gap={1}>
            {options.map((option) => (
              <Chip
                key={option.value}
                icon={option.icon}
                label={option.label}
                size="small"
                variant={quickFilters[filterType] === option.value ? 'default' : 'outlined'}
                className={`${classes.quickFilterChip} ${
                  quickFilters[filterType] === option.value ? classes.activeFilter : ''
                }`}
                onClick={() => handleQuickFilter(filterType, option.value)}
              />
            ))}
          </Box>
        ))}
      </Box>

      {/* 搜索建议下拉框 */}
      {showSuggestions && (
        <Paper className={classes.searchSuggestions}>
          {/* 最近搜索 */}
          {suggestions.recent.length > 0 && (
            <Box className={classes.suggestionSection}>
              <Typography className={classes.suggestionHeader}>
                <HistoryIcon fontSize="small" style={{ marginRight: 8 }} />
                最近搜索
              </Typography>
              {suggestions.recent.map((item, index) => (
                <Box
                  key={index}
                  className={classes.suggestionItem}
                  onClick={() => handleSuggestionClick(item, 'recent')}
                >
                  <Typography className={classes.suggestionText}>
                    {highlightText(item, searchQuery)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* 热门搜索 */}
          {suggestions.popular.length > 0 && (
            <Box className={classes.suggestionSection}>
              <Typography className={classes.suggestionHeader}>
                <TrendingIcon fontSize="small" style={{ marginRight: 8 }} />
                热门搜索
              </Typography>
              {suggestions.popular.map((item, index) => (
                <Box
                  key={index}
                  className={classes.suggestionItem}
                  onClick={() => handleSuggestionClick(item, 'popular')}
                >
                  <Typography className={classes.suggestionText}>
                    {highlightText(item, searchQuery)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* 分类建议 */}
          {suggestions.categories.length > 0 && (
            <Box className={classes.suggestionSection}>
              <Typography className={classes.suggestionHeader}>
                <CategoryIcon fontSize="small" style={{ marginRight: 8 }} />
                相关分类
              </Typography>
              {suggestions.categories.map((item, index) => (
                <Box
                  key={index}
                  className={classes.suggestionItem}
                  onClick={() => handleSuggestionClick(item, 'category')}
                >
                  <Typography className={classes.suggestionText}>
                    <CategoryIcon fontSize="small" />
                    {highlightText(item, searchQuery)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* 数据集建议 */}
          {suggestions.datasets && suggestions.datasets.length > 0 && (
            <Box className={classes.suggestionSection}>
              <Typography className={classes.suggestionHeader}>
                <StorageIcon fontSize="small" style={{ marginRight: 8 }} />
                匹配数据集
              </Typography>
              {suggestions.datasets.map((dataset, index) => (
                <Box
                  key={index}
                  className={classes.suggestionItem}
                  onClick={() => handleSuggestionClick(dataset, 'dataset')}
                >
                  <Typography className={classes.suggestionText}>
                    <StorageIcon fontSize="small" />
                    <Box>
                      <Typography variant="body2">
                        {highlightText(dataset.title, searchQuery)}
                      </Typography>
                      <Typography className={classes.suggestionSecondary}>
                        {dataset.type} • {dataset.dataSize}
                      </Typography>
                    </Box>
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* 高级搜索弹出框 */}
      <Popover
        open={advancedSearchOpen}
        anchorEl={advancedSearchAnchorRef.current}
        onClose={() => setAdvancedSearchOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box className={classes.advancedSearchPopover}>
          <Typography className={classes.advancedSearchTitle}>
            高级搜索选项
          </Typography>
          
          <Box className={classes.formRow}>
            <TextField
              fullWidth
              label="标题"
              value={advancedFilters.title}
              onChange={(e) => setAdvancedFilters(prev => ({ ...prev, title: e.target.value }))}
              size="small"
            />
          </Box>
          
          <Box className={classes.formRow}>
            <TextField
              fullWidth
              label="描述"
              value={advancedFilters.description}
              onChange={(e) => setAdvancedFilters(prev => ({ ...prev, description: e.target.value }))}
              size="small"
            />
          </Box>
          
          <Box className={classes.formRow}>
            <TextField
              fullWidth
              label="作者"
              value={advancedFilters.author}
              onChange={(e) => setAdvancedFilters(prev => ({ ...prev, author: e.target.value }))}
              size="small"
            />
          </Box>
          
          <Box className={classes.formRow}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="开始日期"
                  type="date"
                  value={advancedFilters.dateRange.start}
                  onChange={(e) => setAdvancedFilters(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="结束日期"
                  type="date"
                  value={advancedFilters.dateRange.end}
                  onChange={(e) => setAdvancedFilters(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
          
          <Box className={classes.formRow} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => {
                setAdvancedFilters({
                  title: '', description: '', categories: [], author: '',
                  dateRange: { start: '', end: '' }, fileTypes: [], sizeRange: { min: '', max: '' },
                  includeFields: ['title', 'description', 'categories', 'type', 'tags'],
                });
              }}
            >
              重置
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const searchParams = {
                  query: searchQuery,
                  scope: searchScope,
                  filters: quickFilters,
                  advanced: advancedFilters,
                };
                onSearch && onSearch(searchParams);
                setAdvancedSearchOpen(false);
              }}
            >
              应用筛选
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default DatasetGlobalSearch; 