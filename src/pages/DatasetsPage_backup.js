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
  InputBase
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
  Visibility as ViewIcon,
  Description as DescriptionIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  ExpandMore,
  ChevronRight as ChevronRightIcon,
  CloudUpload as CloudUploadIcon,
  Http as HttpIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { apiCategories } from '../constants/apiCategories';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import FeatureGuard from '../components/FeatureGuard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 0,
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
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
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
  // Added styles for left panel and category navigation
  headerSection: {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(4, 0),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    padding: theme.spacing(0, 3),
    position: 'relative',
    zIndex: 2,
  },
  bannerTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    maxWidth: 600,
    marginBottom: theme.spacing(3),
    opacity: 0.9,
  },
  searchContainer: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    width: '100%',
    maxWidth: 600,
    marginBottom: theme.spacing(2),
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  searchInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  importButtonHeader: {
    marginTop: theme.spacing(1),
  },
  leftPanel: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  categoryListContainer: {
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(1, 0),
    height: 'calc(100vh - 200px)',
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
  },
  editModeSwitch: {
    display: 'flex',
    alignItems: 'center',
  },
  editModeLabel: {
    fontSize: '0.75rem',
    marginRight: theme.spacing(0.5),
  },
  categoryTreeView: {
    padding: theme.spacing(1),
    '& .MuiTreeItem-root': {
      marginBottom: theme.spacing(0.5),
    },
  },
  treeItem: {
    borderRadius: 4,
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
    '& .MuiTreeItem-content': {
      padding: theme.spacing(0.5, 1),
    },
  },
  apiTreeItem: {
    paddingLeft: theme.spacing(2),
  },
  treeItemSelected: {
    backgroundColor: 'rgba(25, 118, 210, 0.08) !important',
  },
  categoryCountBadge: {
    fontSize: '0.7rem',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'inherit',
    borderRadius: 10,
    padding: theme.spacing(0, 0.5),
    marginLeft: theme.spacing(1),
    minWidth: 20,
    height: 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentPanel: {
    borderRadius: theme.spacing(1),
    height: '100%',
  },
  datasetGridContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  datasetGridItem: {
    display: 'flex',
    height: '100%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(2),
    },
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
  
  // Mock data for datasets
  const datasets = [
    {
      id: 1,
      title: '用户行为数据�?,
      description: '电商平台用户行为轨迹数据，包含浏览、收藏、购物车、购买等行为数据',
      type: '结构化数�?,
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
      title: '商品评论情感分析数据�?,
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
      description: '历史销售数据，可用于时间序列分析和销售预�?,
      type: '时间序列',
      dataSize: '780 MB',
      updatedAt: '2023-06-02',
      categories: ['时间序列分析', '预测建模'],
      category: '数据分析',
      subCategory: '销售报�?,
      fileCount: 8,
      status: 'private',
      popularity: 65,
      image: 'sales_trend.jpg'
    },
    {
      id: 4,
      title: '产品图像识别数据�?,
      description: '标记好的产品图像数据集，适用于计算机视觉和图像分类任�?,
      type: '图像数据',
      dataSize: '4.5 GB',
      updatedAt: '2023-04-18',
      categories: ['计算机视�?, '图像分类'],
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
      description: '金融客户信用数据及风险评级，适用于风险建�?,
      type: '结构化数�?,
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
      type: '结构化数�?,
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

  const filteredDatasets = datasets.filter(dataset => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by selected category
    const matchesCategory = !selectedCategory || 
      dataset.category === selectedCategory.name || 
      dataset.subCategory === selectedCategory.name;
    
    return matchesSearch && matchesCategory;
  });

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
    const categoryId = category.id || category.value;
    
    setSelectedCategory(category);
    
    // Toggle expansion state
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle node toggle in tree view
  const handleNodeToggle = (event, nodeIds) => {
    // Convert toggled node IDs to expanded state object
    const newExpandedState = {};
    nodeIds.forEach(id => {
      // Skip dataset nodes
      if (!id.startsWith('dataset-') && id !== 'add-root-category') {
        newExpandedState[id] = true;
      }
    });
    
    // Update expanded state
    setExpandedCategories(newExpandedState);
  };

  // Function to render the category tree
  const renderCategoryTree = (categories) => {
    // Recursive function to build tree items
    const renderTreeItems = (items, level = 0) => {
      if (!items) return null;

      return items.map((category) => {
        const categoryId = category.id || category.value;
        const categoryName = category.name || category.label;
        const hasChildren = category.classifications && category.classifications.length > 0;
        
        // Get datasets related to this category
        const categoryDatasets = datasets.filter(dataset => 
          dataset.category === categoryName || dataset.subCategory === categoryName
        );
        
        // Calculate total datasets including nested categories
        const getNestedDatasetCount = (catList) => {
          if (!catList) return 0;
          let count = 0;
          
          catList.forEach(cat => {
            const catName = cat.name || cat.label;
            // Add current category's dataset count
            count += datasets.filter(dataset => 
              dataset.category === catName || dataset.subCategory === catName
            ).length;
            
            // Recursively add child categories' dataset counts
            if (cat.classifications && cat.classifications.length > 0) {
              count += getNestedDatasetCount(cat.classifications);
            }
          });
          
          return count;
        };
        
        const totalDatasetCount = hasChildren 
          ? categoryDatasets.length + getNestedDatasetCount(category.classifications)
          : categoryDatasets.length;
        
        // Skip categories with no datasets
        if (totalDatasetCount === 0 && !hasChildren) return null;
        
        // Create label content with count badge
        const labelContent = (
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center">
              {categoryName}
            </Box>
            <span className={classes.categoryCountBadge}>{totalDatasetCount}</span>
          </Box>
        );
        
        return (
          <TreeItem 
            key={categoryId} 
            nodeId={categoryId.toString()} 
            label={labelContent}
            className={classes.treeItem}
            classes={{
              selected: classes.treeItemSelected
            }}
            onClick={() => handleCategorySelect(category)}
          >
            {/* Show datasets in this category */}
            {categoryDatasets.length > 0 && categoryDatasets.map(dataset => (
              <TreeItem
                key={`dataset-${dataset.id}`}
                nodeId={`dataset-${dataset.id}`}
                label={
                  <Box display="flex" alignItems="center">
                    <StorageIcon fontSize="small" style={{ marginRight: 8 }} />
                    <span>{dataset.title}</span>
                  </Box>
                }
                className={`${classes.treeItem} ${classes.apiTreeItem}`}
                classes={{
                  selected: classes.treeItemSelected
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDataset(dataset);
                }}
              />
            ))}
            
            {/* Recursively render child categories */}
            {hasChildren && renderTreeItems(category.classifications, level + 1)}
          </TreeItem>
        );
      }).filter(Boolean); // Filter out null items
    };

    return (
      <TreeView
        className={classes.categoryTreeView}
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={Object.keys(expandedCategories).filter(key => expandedCategories[key])}
        selected={selectedDataset ? `dataset-${selectedDataset.id}` : ''}
        onNodeToggle={handleNodeToggle}
      >
        {renderTreeItems(categories)}
        {editMode && (
          <TreeItem 
            nodeId="add-root-category" 
            label={
              <Box display="flex" alignItems="center" style={{ color: '#1976d2' }}>
                <AddIcon style={{ marginRight: 8 }} />
                <span>添加根分�?/span>
              </Box>
            }
            className={classes.treeItem}
          />
        )}
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
                    {dataset.dataSize} �?{dataset.fileCount} 个文�?�?更新�?{dataset.updatedAt}
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
                  startIcon={<ViewIcon />}
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

  return (
    <div className={classes.root}>
      {/* Main content area with grid layout */}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Left panel - Category navigation */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={classes.leftPanel}>
              <div className={classes.stickyListHeader}>
                <Typography className={classes.headerTitleText}>
                  <CategoryIcon style={{ marginRight: 8 }} /> 数据集分�?
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

          {/* Right panel - Content area */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={classes.contentPanel}>
              <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {selectedCategory ? selectedCategory.name : '所有数据集'}
                  <Typography variant="caption" color="textSecondary" style={{ marginLeft: 8 }}>
                    ({filteredDatasets.length} 个数据集)
                  </Typography>
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={handleFilterMenuOpen}
                    style={{ marginRight: 8 }}
                    size="small"
                  >
                    筛�?
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<SortIcon />}
                    onClick={handleSortMenuOpen}
                    size="small"
                  >
                    排序
                  </Button>
                  
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
                    >
                      上传数据�?
                    </Button>
                  </FeatureGuard>
                  
                  <Menu
                    anchorEl={sortMenuAnchorEl}
                    keepMounted
                    open={Boolean(sortMenuAnchorEl)}
                    onClose={handleSortMenuClose}
                  >
                    <MenuItem onClick={handleSortMenuClose}>最新发�?/MenuItem>
                    <MenuItem onClick={handleSortMenuClose}>使用量从高到�?/MenuItem>
                    <MenuItem onClick={handleSortMenuClose}>数据量从大到�?/MenuItem>
                    <MenuItem onClick={handleSortMenuClose}>名称（A-Z�?/MenuItem>
                  </Menu>
                  
                  <Menu
                    anchorEl={filterMenuAnchorEl}
                    keepMounted
                    open={Boolean(filterMenuAnchorEl)}
                    onClose={handleFilterMenuClose}
                  >
                    <MenuItem onClick={handleFilterMenuClose}>所有数据集</MenuItem>
                    <MenuItem onClick={handleFilterMenuClose}>公开数据�?/MenuItem>
                    <MenuItem onClick={handleFilterMenuClose}>私有数据�?/MenuItem>
                    <MenuItem onClick={handleFilterMenuClose}>我创建的</MenuItem>
                    <MenuItem onClick={handleFilterMenuClose}>我收藏的</MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Divider />
              {renderDatasetCards()}
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
        <MenuItem onClick={handleMenuClose}>编辑数据�?/MenuItem>
        <MenuItem onClick={handleMenuClose}>分享数据�?/MenuItem>
        
        {/* 数据可视化功能，受功能标志保�?*/}
        <FeatureGuard 
          moduleId={MODULES.DATASET_MANAGEMENT} 
          featureId={FEATURES[MODULES.DATASET_MANAGEMENT].DATA_VISUALIZATION}
        >
          <MenuItem onClick={handleMenuClose}>可视化预�?/MenuItem>
        </FeatureGuard>
        
        <MenuItem onClick={handleMenuClose}>下载数据�?/MenuItem>
        <MenuItem onClick={handleMenuClose}>查看使用情况</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} style={{ color: '#f44336' }}>删除数据�?/MenuItem>
      </Menu>
    </div>
  );
};

export default DatasetsPage; 
