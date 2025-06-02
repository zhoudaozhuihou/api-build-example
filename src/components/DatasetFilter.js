import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider,
  Collapse,
  IconButton,
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIconCollapse,
  Storage as StorageIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    padding: theme.spacing(3),
    margin: 0,
    backgroundColor: theme.palette.background.paper,
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  filterIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  filterSection: {
    marginBottom: theme.spacing(2.5),
  },
  filterSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.03)',
    },
  },
  filterSectionTitle: {
    fontWeight: 500,
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },
  filterSectionIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
  },
  filterChipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.shape.borderRadius,
    minHeight: '40px',
  },
  filterChip: {
    fontSize: '0.8rem',
    height: '28px',
    '&.MuiChip-clickable:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  },
  selectedFilterChip: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&.MuiChip-clickable:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  filterControls: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterFormControl: {
    minWidth: 150,
  },
  activeFiltersSection: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid rgba(25, 118, 210, 0.2)`,
  },
  activeFilterLabel: {
    fontWeight: 500,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  activeFilterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  clearAllButton: {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
  },
  dateFilterContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateField: {
    minWidth: 140,
  },
}));

// 数据集类型选项
const datasetTypes = [
  { value: '结构化数据', label: '结构化数据', count: 15 },
  { value: '文本数据', label: '文本数据', count: 8 },
  { value: '图像数据', label: '图像数据', count: 12 },
  { value: '时间序列', label: '时间序列', count: 6 },
  { value: '音频数据', label: '音频数据', count: 4 },
  { value: '视频数据', label: '视频数据', count: 3 },
];

// 数据集状态选项
const datasetStatus = [
  { value: 'public', label: '公开数据集', count: 25 },
  { value: 'private', label: '私有数据集', count: 18 },
  { value: 'restricted', label: '受限访问', count: 5 },
];

// 数据集大小范围
const dataSizeRanges = [
  { label: '全部', value: 'all' },
  { label: '小型 (< 100MB)', value: 'small', max: 100 },
  { label: '中型 (100MB - 1GB)', value: 'medium', min: 100, max: 1024 },
  { label: '大型 (1GB - 10GB)', value: 'large', min: 1024, max: 10240 },
  { label: '超大型 (> 10GB)', value: 'xlarge', min: 10240 },
];

// 数据集主题分类
const datasetThemes = [
  { value: '机器学习', label: '机器学习', count: 20 },
  { value: '自然语言处理', label: '自然语言处理', count: 12 },
  { value: '计算机视觉', label: '计算机视觉', count: 15 },
  { value: '推荐系统', label: '推荐系统', count: 8 },
  { value: '时间序列分析', label: '时间序列分析', count: 6 },
  { value: '网络分析', label: '网络分析', count: 4 },
];

const DatasetFilter = ({
  // 筛选状态
  statusFilter,
  typeFilters,
  themeFilters,
  dataSizeFilter,
  startDate,
  endDate,
  activeFilters,
  
  // 筛选处理函数
  onStatusFilterChange,
  onFilterChange,
  onDataSizeFilterChange,
  onDateChange,
  onClearAllFilters,
}) => {
  const classes = useStyles();
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    status: true,
    theme: false,
    size: false,
    date: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderFilterSection = (
    sectionKey,
    title,
    icon,
    items,
    selectedItems,
    onItemToggle,
    showCounts = true
  ) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className={classes.filterSection}>
        <div 
          className={classes.filterSectionHeader}
          onClick={() => toggleSection(sectionKey)}
        >
          <Typography className={classes.filterSectionTitle}>
            {icon}
            {title}
          </Typography>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIconCollapse />}
          </IconButton>
        </div>
        <Collapse in={isExpanded}>
          <div className={classes.filterChipsContainer}>
            {items.map((item) => (
              <Chip
                key={item.value}
                label={showCounts ? `${item.label} (${item.count})` : item.label}
                clickable
                size="small"
                className={`${classes.filterChip} ${
                  selectedItems.includes(item.value) ? classes.selectedFilterChip : ''
                }`}
                onClick={() => onItemToggle(item.value, sectionKey)}
              />
            ))}
          </div>
        </Collapse>
      </div>
    );
  };

  return (
    <div className={classes.filterContainer}>
      <div className={classes.filterHeader}>
        <Typography variant="h6" className={classes.filterTitle}>
          <FilterListIcon className={classes.filterIcon} />
          数据集筛选
        </Typography>
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={onClearAllFilters}
          className={classes.clearAllButton}
        >
          清除全部
        </Button>
      </div>

      {/* 数据集状态筛选 */}
      {renderFilterSection(
        'status',
        '访问状态',
        <PublicIcon className={classes.filterSectionIcon} />,
        datasetStatus,
        statusFilter ? [statusFilter] : [],
        (value) => onStatusFilterChange(statusFilter === value ? null : value),
        true
      )}

      {/* 数据集类型筛选 */}
      {renderFilterSection(
        'type',
        '数据类型',
        <StorageIcon className={classes.filterSectionIcon} />,
        datasetTypes,
        typeFilters,
        onFilterChange,
        true
      )}

      {/* 主题分类筛选 */}
      {renderFilterSection(
        'theme',
        '主题分类',
        <DescriptionIcon className={classes.filterSectionIcon} />,
        datasetThemes,
        themeFilters,
        onFilterChange,
        true
      )}

      {/* 数据大小筛选 */}
      <div className={classes.filterSection}>
        <div 
          className={classes.filterSectionHeader}
          onClick={() => toggleSection('size')}
        >
          <Typography className={classes.filterSectionTitle}>
            <StorageIcon className={classes.filterSectionIcon} />
            数据大小
          </Typography>
          <IconButton size="small">
            {expandedSections.size ? <ExpandLessIcon /> : <ExpandMoreIconCollapse />}
          </IconButton>
        </div>
        <Collapse in={expandedSections.size}>
          <div className={classes.filterControls}>
            <FormControl className={classes.filterFormControl} size="small">
              <InputLabel>数据大小</InputLabel>
              <Select
                value={dataSizeFilter}
                onChange={(e) => onDataSizeFilterChange(e.target.value)}
              >
                {dataSizeRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Collapse>
      </div>

      {/* 日期筛选 */}
      <div className={classes.filterSection}>
        <div 
          className={classes.filterSectionHeader}
          onClick={() => toggleSection('date')}
        >
          <Typography className={classes.filterSectionTitle}>
            <ScheduleIcon className={classes.filterSectionIcon} />
            更新日期
          </Typography>
          <IconButton size="small">
            {expandedSections.date ? <ExpandLessIcon /> : <ExpandMoreIconCollapse />}
          </IconButton>
        </div>
        <Collapse in={expandedSections.date}>
          <div className={classes.dateFilterContainer}>
            <TextField
              label="开始日期"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => onDateChange('startDate', e.target.value)}
              className={classes.dateField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="结束日期"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => onDateChange('endDate', e.target.value)}
              className={classes.dateField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </Collapse>
      </div>

      {/* 显示当前活跃的筛选条件 */}
      {activeFilters.length > 0 && (
        <div className={classes.activeFiltersSection}>
          <Typography variant="body2" className={classes.activeFilterLabel}>
            <FilterListIcon fontSize="small" style={{ marginRight: 8 }} />
            当前筛选条件
          </Typography>
          <div className={classes.activeFilterChips}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                size="small"
                onDelete={filter.onClear}
                color="primary"
                variant="outlined"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetFilter; 