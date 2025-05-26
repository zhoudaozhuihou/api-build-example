import React from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  Chip,
  Button,
  Grid
} from '@material-ui/core';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  filterSection: {
    marginBottom: theme.spacing(2),
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
  filterCategoryRow: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  filterCategoryLabel: {
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1),
  },
  filterCategoryOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  filterCategoryChip: {
    fontSize: '0.75rem',
    height: '28px',
    borderRadius: '14px',
    '&.MuiChip-clickable:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  },
  filterCategoryChipSelected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&.MuiChip-clickable:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  activeFiltersSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  activeFilterLabel: {
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
  },
  filterChip: {
    margin: theme.spacing(0.25),
    fontSize: '0.7rem',
  },
}));

const ApiFilter = ({
  // 筛选状态
  accessLevelFilter,
  dataFieldFilters,
  themeFilters,
  serviceFilters,
  industryFilters,
  methodFilters,
  responseTimeFilter,
  startDate,
  endDate,
  activeFilters,
  allApiMethods,
  
  // 筛选处理函数
  onAccessLevelFilterChange,
  onFilterChange,
  onMethodFilterChange,
  onResponseTimeFilterChange,
  onDateChange,
  onClearAllFilters,
  
  // 筛选选项配置
  filterOptions = {
    accessLevels: [
      { value: 'login', label: '登录开放' },
      { value: 'restricted', label: '受限开放' },
      { value: 'public', label: '完全开放' }
    ],
    dataFields: [
      { value: '用户相关', label: '用户数据', count: 3 },
      { value: '订单相关', label: '订单数据', count: 2 },
      { value: '产品相关', label: '产品数据', count: 1 }
    ],
    themes: [
      { value: '用户认证', label: '认证服务', count: 1 },
      { value: '用户信息', label: '用户信息', count: 1 },
      { value: '订单管理', label: '订单管理', count: 1 },
      { value: '支付管理', label: '支付服务', count: 1 },
      { value: '产品列表', label: '产品目录', count: 1 }
    ]
  }
}) => {
  const classes = useStyles();

  return (
    <div>
      {/* 筛选区 */}
      <Paper className={classes.filterSection} elevation={2}>
        {/* 筛选标题 */}
        <div className={classes.filterTitle}>
          <FilterListIcon className={classes.filterIcon} />
          <Typography variant="h6">筛选选项</Typography>
        </div>

        {/* 开放等级筛选 */}
        <div className={classes.filterCategoryRow}>
          <Typography className={classes.filterCategoryLabel}>开放等级</Typography>
          <div className={classes.filterCategoryOptions}>
            {filterOptions.accessLevels.map((level) => (
              <Chip
                key={level.value}
                label={level.label}
                className={`${classes.filterCategoryChip} ${accessLevelFilter === level.value ? classes.filterCategoryChipSelected : ''}`}
                onClick={() => onAccessLevelFilterChange(level.value)}
                clickable
              />
            ))}
          </div>
        </div>

        {/* 数据领域筛选 */}
        <div className={classes.filterCategoryRow}>
          <Typography className={classes.filterCategoryLabel}>数据领域</Typography>
          <div className={classes.filterCategoryOptions}>
            {filterOptions.dataFields.map((field) => (
              <Chip
                key={field.value}
                label={`${field.label} (${field.count})`}
                className={`${classes.filterCategoryChip} ${dataFieldFilters.includes(field.value) ? classes.filterCategoryChipSelected : ''}`}
                onClick={() => onFilterChange(field.value, 'dataField')}
                clickable
              />
            ))}
          </div>
        </div>

        {/* 主题分类筛选 */}
        <div className={classes.filterCategoryRow}>
          <Typography className={classes.filterCategoryLabel}>主题分类</Typography>
          <div className={classes.filterCategoryOptions}>
            {filterOptions.themes.map((theme) => (
              <Chip
                key={theme.value}
                label={`${theme.label} (${theme.count})`}
                className={`${classes.filterCategoryChip} ${themeFilters.includes(theme.value) ? classes.filterCategoryChipSelected : ''}`}
                onClick={() => onFilterChange(theme.value, 'theme')}
                clickable
              />
            ))}
          </div>
        </div>

        {/* API方法筛选 */}
        <div className={classes.filterCategoryRow} style={{ borderBottom: 'none' }}>
          <Typography className={classes.filterCategoryLabel}>API方法</Typography>
          <div className={classes.filterCategoryOptions}>
            {allApiMethods.map(method => (
              <Chip
                key={method}
                label={method}
                className={`${classes.filterCategoryChip} ${methodFilters[method] ? classes.filterCategoryChipSelected : ''}`}
                onClick={() => onMethodFilterChange(method)}
                clickable
              />
            ))}
          </div>
        </div>
      </Paper>

      {/* 活跃筛选器显示 */}
      {activeFilters.length > 0 && (
        <div className={classes.activeFiltersSection} style={{ marginTop: 16 }}>
          <Typography className={classes.activeFilterLabel}>
            已选筛选条件:
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                onDelete={filter.onClear}
                className={classes.filterChip}
                size="small"
              />
            ))}
          </div>
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearAllFilters}
            variant="outlined"
            fullWidth
            style={{ marginTop: 8 }}
          >
            清除所有筛选器
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApiFilter; 