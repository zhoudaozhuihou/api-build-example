import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  ImportExport as ApiIcon,
  Storage as StorageIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreIcon,
  GetApp as GetAppIcon
} from '@material-ui/icons';

// Import new common components
import ManagementLayout from '../components/common/ManagementLayout';
import {
  apiFilterConfig,
  apiCategoryConfig,
  apiHeaderConfig,
  apiCardGridConfig,
} from '../config/apiPageConfig';

const useStyles = makeStyles((theme) => ({
  card: {
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardActions: {
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
  },
}));

// Mock data for demonstration
const mockItems = [
  {
    id: 1,
    name: '用户认证API',
    description: '提供用户登录、注册和权限验证的完整API服务',
    type: 'API',
    status: 'public',
    category: '用户管理',
    categories: ['用户认证'],
    accessLevel: 'public',
    dataFields: ['用户相关'],
    themes: ['用户认证'],
    isFavorite: true
  },
  {
    id: 2,
    name: '订单管理API',
    description: '完整的订单生命周期管理，包括创建、查询、更新和取消订单',
    type: 'API',
    status: 'restricted',
    category: '业务管理',
    categories: ['订单管理'],
    accessLevel: 'restricted',
    dataFields: ['订单相关'],
    themes: ['订单管理'],
    isFavorite: false
  },
  {
    id: 3,
    name: '用户数据集',
    description: '包含用户基本信息、偏好设置和行为数据的综合数据集',
    type: 'Dataset',
    status: 'public',
    category: '结构化数据',
    categories: ['用户数据'],
    accessLevel: 'public',
    dataFormat: 'JSON',
    updateFrequency: 'daily',
    isFavorite: true
  }
];

const ExampleManagementPage = () => {
  const classes = useStyles();
  const [items, setItems] = useState(mockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editMode, setEditMode] = useState(false);

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true;
      
      switch (key) {
        case 'accessLevel':
          return item.accessLevel === value;
        case 'dataFields':
          return Array.isArray(value) ? value.some(v => item.dataFields?.includes(v)) : item.dataFields?.includes(value);
        case 'themes':
          return Array.isArray(value) ? value.some(v => item.themes?.includes(v)) : item.themes?.includes(value);
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  // Initialize expanded categories
  useEffect(() => {
    const defaultExpanded = {};
    apiCategoryConfig.categories.forEach(category => {
      defaultExpanded[category.id] = true;
      if (category.children) {
        category.children.forEach(child => {
          defaultExpanded[child.id] = false;
        });
      }
    });
    setExpandedCategories(defaultExpanded);
  }, []);

  // Handlers
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Filter items by category here if needed
  };

  const handleCategoryToggle = (event, nodeIds) => {
    const expanded = {};
    nodeIds.forEach(id => {
      expanded[id] = true;
    });
    setExpandedCategories(expanded);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  // Render individual card
  const renderCard = (item) => (
    <Card key={item.id} className={classes.card}>
      {/* Gradient top bar */}
      <Box 
        style={{
          height: '4px',
          background: item.type === 'API' 
            ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
            : 'linear-gradient(90deg, #388e3c 0%, #66bb6a 100%)'
        }} 
      />
      
      <CardContent className={classes.cardContent}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.description}
            </Typography>
          </Box>
          <Chip 
            label={item.status}
            size="small"
            color={item.status === 'public' ? 'primary' : 'default'}
          />
        </Box>
        
        <Box mt={2}>
          {item.categories?.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              variant="outlined"
              style={{ marginRight: 4, marginBottom: 4 }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions className={classes.cardActions}>
        <IconButton size="small">
          {item.isFavorite ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Box>
          <IconButton size="small">
            <GetAppIcon />
          </IconButton>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );

  // Configuration for the layout
  const headerConfig = {
    ...apiHeaderConfig,
    title: '通用管理示例',
    subtitle: '展示如何使用通用组件构建API和数据集管理页面',
    searchQuery,
    onSearchChange: handleSearchChange,
    onSearchClear: handleSearchClear,
    searchPlaceholder: '搜索项目...',
    totalCount: filteredItems.length,
    importButtonText: '导入项目',
    onImportClick: () => console.log('Import clicked')
  };

  const filterConfig = {
    ...apiFilterConfig,
    onFilterClear: () => setActiveFilters({})
  };

  const categoryConfig = {
    ...apiCategoryConfig,
    selectedCategory,
    onCategorySelect: handleCategorySelect,
    expandedCategories,
    onToggleExpanded: handleCategoryToggle,
    editMode,
    onEditModeToggle: handleEditModeToggle,
    getItemCount: (category) => {
      return filteredItems.filter(item => 
        item.category === category.value || 
        item.categories?.includes(category.value)
      ).length;
    }
  };

  const cardGridConfig = {
    ...apiCardGridConfig,
    title: '项目列表',
    items: filteredItems,
    totalCount: filteredItems.length,
    publicCount: filteredItems.filter(item => item.status === 'public').length,
    searchQuery,
    onSearchClear: handleSearchClear,
    renderCard,
    emptyStateText: '没有找到符合条件的项目'
  };

  return (
    <ManagementLayout
      headerConfig={headerConfig}
      filterConfig={filterConfig}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      showFilters={true}
      categoryConfig={categoryConfig}
      showCategory={true}
      cardGridConfig={cardGridConfig}
      leftColumnWidth={3}
      rightColumnWidth={9}
      showFilterInLeftColumn={false}
    />
  );
};

export default ExampleManagementPage;