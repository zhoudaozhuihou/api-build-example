import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import {
  Code as CodeIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  rightPanel: {
    height: 'calc(100vh - 64px - 48px - 16px)',
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  rightPanelTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  rightPanelStats: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  rightPanelStatChip: {
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  cardGridContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  cardGridItem: {
    display: 'flex',
    height: '100%',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  paginationInfo: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
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
}));

const CardGridPanel = ({
  title = "列表",
  items = [],
  totalCount,
  publicCount,
  searchQuery,
  onSearchClear,
  renderCard,
  page = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
  customStats = [],
  emptyStateIcon: EmptyIcon,
  emptyStateText = "没有找到符合条件的项目",
  cardGridProps = {},
  showPagination = true
}) => {
  const classes = useStyles();

  // 计算分页信息
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems || items.length);
  const totalPages = Math.ceil((totalItems || items.length) / itemsPerPage);

  // 渲染统计芯片
  const renderStats = () => {
    const stats = [];

    // 基础统计
    if (totalCount !== undefined) {
      stats.push(
        <Chip 
          key="total"
          icon={<CodeIcon />} 
          label={`共 ${totalCount} 个`}
          className={classes.rightPanelStatChip}
          color="primary"
          variant="outlined"
        />
      );
    }

    if (publicCount !== undefined) {
      stats.push(
        <Chip 
          key="public"
          icon={<VisibilityIcon />} 
          label={`${publicCount} 个公开`}
          className={classes.rightPanelStatChip}
          color="secondary"
          variant="outlined"
        />
      );
    }

    // 搜索查询芯片
    if (searchQuery) {
      stats.push(
        <Chip 
          key="search"
          icon={<SearchIcon />} 
          label={`搜索: "${searchQuery}"`}
          className={classes.rightPanelStatChip}
          onDelete={onSearchClear}
          color="default"
          variant="outlined"
        />
      );
    }

    // 自定义统计
    customStats.forEach((stat, index) => {
      stats.push(
        <Chip
          key={`custom-${index}`}
          icon={stat.icon}
          label={stat.label}
          className={classes.rightPanelStatChip}
          color={stat.color || 'default'}
          variant={stat.variant || 'outlined'}
          onDelete={stat.onDelete}
        />
      );
    });

    return stats;
  };

  // 渲染空状态
  const renderEmptyState = () => (
    <div className={classes.emptyState}>
      {EmptyIcon && <EmptyIcon className={classes.emptyStateIcon} />}
      <Typography variant="h6" color="textSecondary" className={classes.emptyStateText}>
        {emptyStateText}
      </Typography>
    </div>
  );

  // 渲染卡片网格
  const renderCardGrid = () => {
    if (items.length === 0) {
      return renderEmptyState();
    }

    return (
      <Grid container spacing={3} {...cardGridProps}>
        {items.map((item, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={6} 
            lg={4} 
            key={item.id || index} 
            className={classes.cardGridItem}
          >
            {renderCard(item, index)}
          </Grid>
        ))}
      </Grid>
    );
  };

  // 渲染分页信息
  const renderPaginationInfo = () => {
    const total = totalItems || items.length;
    if (total === 0) return null;

    return (
      <Typography className={classes.paginationInfo}>
        显示 {startIndex + 1} - {endIndex} 项，共 {total} 项
      </Typography>
    );
  };

  return (
    <Paper className={classes.rightPanel}>
      {/* 头部统计信息栏 */}
      <Box className={classes.rightPanelHeader}>
        <Typography variant="h6" className={classes.rightPanelTitle}>
          {title}
        </Typography>
        <Box className={classes.rightPanelStats}>
          {renderStats()}
        </Box>
      </Box>
      
      {/* 卡片网格区域 */}
      <div className={classes.cardGridContainer}>
        {renderCardGrid()}
      </div>

      {/* 分页区域 */}
      {showPagination && totalPages > 1 && (
        <div className={classes.paginationContainer}>
          {renderPaginationInfo()}
          <Pagination 
            count={totalPages} 
            page={page}
            onChange={onPageChange}
            color="primary" 
            showFirstButton 
            showLastButton
          />
        </div>
      )}
    </Paper>
  );
};

export default CardGridPanel; 