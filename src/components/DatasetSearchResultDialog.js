import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Tooltip,
  InputBase,
  Paper,
  LinearProgress,
  Collapse,
  Tab,
  Tabs,
  TablePagination,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Storage as StorageIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  TrendingUp as TrendingIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
  Apps as GridViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  Description as FileIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '1200px',
      borderRadius: theme.spacing(2),
    },
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  searchIcon: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  dialogContent: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(90vh - 140px)',
  },
  searchHeader: {
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
  },
  searchSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  resultStats: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  viewControls: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  searchTabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 48,
  },
  tabPanel: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(0),
  },
  resultsContainer: {
    padding: theme.spacing(2, 3),
    flex: 1,
    overflow: 'auto',
  },
  datasetCard: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.primary.main,
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  datasetTitle: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  datasetDescription: {
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),
  },
  datasetMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  categoryChips: {
    display: 'flex',
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1),
  },
  categoryChip: {
    height: 24,
    fontSize: '0.75rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  cardActions: {
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  statusChip: {
    height: 24,
    fontSize: '0.75rem',
  },
  publicChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  privateChip: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  gridView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: theme.spacing(2),
  },
  listView: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(6),
  },
  emptyIcon: {
    fontSize: '4rem',
    color: theme.palette.grey[400],
    marginBottom: theme.spacing(2),
  },
  loadingContainer: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  paginationContainer: {
    padding: theme.spacing(1, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
  },
  highlightText: {
    backgroundColor: theme.palette.warning.light,
    padding: '2px 4px',
    borderRadius: 2,
    fontWeight: 'bold',
  },
  detailsSection: {
    marginTop: theme.spacing(1),
  },
  expandButton: {
    padding: theme.spacing(0.5),
  },
}));

const DatasetSearchResultDialog = ({
  open,
  onClose,
  searchQuery = '',
  searchResults = [],
  totalResults = 0,
  loading = false,
  onDatasetClick,
  onDatasetDownload,
  onDatasetFavorite,
  onPageChange,
  page = 1,
  pageSize = 10,
}) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCards, setExpandedCards] = useState({});
  const [favorites, setFavorites] = useState(new Set());

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleCardExpand = (datasetId) => {
    setExpandedCards(prev => ({
      ...prev,
      [datasetId]: !prev[datasetId]
    }));
  };

  const handleFavoriteToggle = (datasetId) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(datasetId)) {
      newFavorites.delete(datasetId);
    } else {
      newFavorites.add(datasetId);
    }
    setFavorites(newFavorites);
    onDatasetFavorite && onDatasetFavorite(datasetId, !favorites.has(datasetId));
  };

  const highlightSearchTerm = (text, query) => {
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

  const renderDatasetCard = (dataset) => (
    <Card key={dataset.id} className={classes.datasetCard}>
      <CardContent>
        <Box className={classes.cardHeader}>
          <Box flex={1}>
            <Typography 
              className={classes.datasetTitle}
              onClick={() => onDatasetClick && onDatasetClick(dataset)}
            >
              {highlightSearchTerm(dataset.title, searchQuery)}
            </Typography>
            <Typography className={classes.datasetDescription}>
              {highlightSearchTerm(dataset.description, searchQuery)}
            </Typography>
          </Box>
          <IconButton
            className={classes.expandButton}
            onClick={() => handleCardExpand(dataset.id)}
            size="small"
          >
            {expandedCards[dataset.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Box className={classes.datasetMeta}>
          <Box className={classes.metaItem}>
            <StorageIcon fontSize="small" />
            <span>{dataset.dataSize}</span>
          </Box>
          <Box className={classes.metaItem}>
            <FileIcon fontSize="small" />
            <span>{dataset.fileCount} 个文件</span>
          </Box>
          <Box className={classes.metaItem}>
            <CalendarIcon fontSize="small" />
            <span>{dataset.updatedAt}</span>
          </Box>
          <Box className={classes.metaItem}>
            <TrendingIcon fontSize="small" />
            <span>{dataset.popularity} 次使用</span>
          </Box>
        </Box>

        <Box className={classes.categoryChips}>
          {dataset.categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              className={classes.categoryChip}
            />
          ))}
        </Box>

        <Collapse in={expandedCards[dataset.id]}>
          <Box className={classes.detailsSection}>
            <Divider style={{ margin: '8px 0' }} />
            <Typography variant="body2" color="textSecondary">
              <strong>数据类型:</strong> {dataset.type}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>分类:</strong> {dataset.category} / {dataset.subCategory}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>创建者:</strong> 数据团队
            </Typography>
          </Box>
        </Collapse>
      </CardContent>

      <Box className={classes.cardActions}>
        <Box className={classes.actionButtons}>
          <Tooltip title="查看详情">
            <IconButton 
              size="small"
              onClick={() => onDatasetClick && onDatasetClick(dataset)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="下载数据集">
            <IconButton 
              size="small"
              onClick={() => onDatasetDownload && onDatasetDownload(dataset)}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={favorites.has(dataset.id) ? "取消收藏" : "收藏"}>
            <IconButton 
              size="small"
              onClick={() => handleFavoriteToggle(dataset.id)}
            >
              {favorites.has(dataset.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="分享">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Chip
          icon={dataset.status === 'public' ? <PublicIcon /> : <PrivateIcon />}
          label={dataset.status === 'public' ? '公开' : '私有'}
          size="small"
          className={`${classes.statusChip} ${
            dataset.status === 'public' ? classes.publicChip : classes.privateChip
          }`}
        />
      </Box>
    </Card>
  );

  const renderEmptyState = () => (
    <Box className={classes.emptyState}>
      <SearchIcon className={classes.emptyIcon} />
      <Typography variant="h6" gutterBottom>
        未找到相关数据集
      </Typography>
      <Typography variant="body2" color="textSecondary">
        尝试使用不同的关键词或调整搜索条件
      </Typography>
    </Box>
  );

  const renderLoadingState = () => (
    <Box className={classes.loadingContainer}>
      <LinearProgress style={{ marginBottom: 16 }} />
      <Typography variant="body2" color="textSecondary">
        正在搜索数据集...
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
      maxWidth={false}
    >
      <Box className={classes.dialogTitle}>
        <Box className={classes.titleSection}>
          <SearchIcon className={classes.searchIcon} />
          <Typography variant="h6">
            搜索结果
          </Typography>
          {searchQuery && (
            <Chip 
              label={`"${searchQuery}"`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        <IconButton onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className={classes.dialogContent}>
        <Box className={classes.searchHeader}>
          <Box className={classes.searchSummary}>
            <Box className={classes.resultStats}>
              <Typography variant="body1">
                共找到 <strong>{totalResults}</strong> 个数据集
              </Typography>
              {searchQuery && (
                <Chip 
                  label={`关键词: ${searchQuery}`} 
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
            <Box className={classes.viewControls}>
              <Tooltip title="网格视图">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="列表视图">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ListViewIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className={classes.searchTabs}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`全部结果 (${totalResults})`} />
          <Tab label="最相关" />
          <Tab label="最新发布" />
          <Tab label="最受欢迎" />
        </Tabs>

        <Box className={classes.tabPanel}>
          {loading ? (
            renderLoadingState()
          ) : searchResults.length === 0 ? (
            renderEmptyState()
          ) : (
            <Box className={classes.resultsContainer}>
              <Box className={viewMode === 'grid' ? classes.gridView : classes.listView}>
                {searchResults.map(renderDatasetCard)}
              </Box>
            </Box>
          )}
        </Box>

        {!loading && searchResults.length > 0 && (
          <Box className={classes.paginationContainer}>
            <TablePagination
              component="div"
              count={totalResults}
              page={page - 1}
              onPageChange={(event, newPage) => onPageChange && onPageChange(newPage + 1)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={() => {}}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} 共 ${count} 条`
              }
              labelRowsPerPage=""
            />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default DatasetSearchResultDialog; 