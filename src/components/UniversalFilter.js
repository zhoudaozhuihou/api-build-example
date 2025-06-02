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
    borderRadius: theme.shape.borderRadius,
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
    transition: 'all 0.2s ease',
    '&.MuiChip-clickable:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'translateY(-1px)',
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

/**
 * 通用筛选组件
 * @param {Object} props
 * @param {string} props.title - 筛选器标题
 * @param {Array} props.filterSections - 筛选区域配置数组
 * @param {Object} props.filterStates - 当前筛选状态
 * @param {Function} props.onFilterChange - 筛选变化回调
 * @param {Function} props.onClearAll - 清除所有筛选回调
 * @param {Array} props.activeFilters - 当前激活的筛选条件
 */
const UniversalFilter = ({
  title = '筛选选项',
  filterSections = [],
  filterStates = {},
  onFilterChange,
  onClearAll,
  activeFilters = [],
}) => {
  const classes = useStyles();
  const [expandedSections, setExpandedSections] = useState(
    filterSections.reduce((acc, section) => {
      acc[section.key] = section.defaultExpanded !== false;
      return acc;
    }, {})
  );

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // 渲染Chip类型的筛选选项
  const renderChipFilterSection = (section) => {
    const isExpanded = expandedSections[section.key];
    const selectedItems = filterStates[section.key] || [];
    const isMultiSelect = section.multiSelect !== false;

    return (
      <div className={classes.filterSection} key={section.key}>
        <div 
          className={classes.filterSectionHeader}
          onClick={() => toggleSection(section.key)}
        >
          <Typography className={classes.filterSectionTitle}>
            {section.icon && <span className={classes.filterSectionIcon}>{section.icon}</span>}
            {section.title}
          </Typography>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        <Collapse in={isExpanded}>
          <div className={classes.filterChipsContainer}>
            {section.options.map((option) => {
              const isSelected = isMultiSelect 
                ? selectedItems.includes(option.value)
                : selectedItems === option.value;
              
              return (
                <Chip
                  key={option.value}
                  label={section.showCounts !== false && option.count !== undefined 
                    ? `${option.label} (${option.count})` 
                    : option.label}
                  clickable
                  size="small"
                  className={`${classes.filterChip} ${
                    isSelected ? classes.selectedFilterChip : ''
                  }`}
                  onClick={() => onFilterChange(section.key, option.value, section.type)}
                />
              );
            })}
          </div>
        </Collapse>
      </div>
    );
  };

  // 渲染下拉选择器类型的筛选选项
  const renderSelectFilterSection = (section) => {
    const isExpanded = expandedSections[section.key];
    const selectedValue = filterStates[section.key] || section.defaultValue || '';

    return (
      <div className={classes.filterSection} key={section.key}>
        <div 
          className={classes.filterSectionHeader}
          onClick={() => toggleSection(section.key)}
        >
          <Typography className={classes.filterSectionTitle}>
            {section.icon && <span className={classes.filterSectionIcon}>{section.icon}</span>}
            {section.title}
          </Typography>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        <Collapse in={isExpanded}>
          <div className={classes.filterControls}>
            <FormControl className={classes.filterFormControl} size="small">
              <InputLabel>{section.placeholder || section.title}</InputLabel>
              <Select
                value={selectedValue}
                onChange={(e) => onFilterChange(section.key, e.target.value, section.type)}
              >
                {section.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Collapse>
      </div>
    );
  };

  // 渲染日期筛选选项
  const renderDateFilterSection = (section) => {
    const isExpanded = expandedSections[section.key];
    const startDate = filterStates[`${section.key}Start`] || '';
    const endDate = filterStates[`${section.key}End`] || '';

    return (
      <div className={classes.filterSection} key={section.key}>
        <div 
          className={classes.filterSectionHeader}
          onClick={() => toggleSection(section.key)}
        >
          <Typography className={classes.filterSectionTitle}>
            {section.icon && <span className={classes.filterSectionIcon}>{section.icon}</span>}
            {section.title}
          </Typography>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        <Collapse in={isExpanded}>
          <div className={classes.dateFilterContainer}>
            <TextField
              type="date"
              label={section.startLabel || "开始日期"}
              value={startDate}
              onChange={(e) => onFilterChange(`${section.key}Start`, e.target.value, 'date')}
              className={classes.dateField}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography variant="body2" color="textSecondary">至</Typography>
            <TextField
              type="date"
              label={section.endLabel || "结束日期"}
              value={endDate}
              onChange={(e) => onFilterChange(`${section.key}End`, e.target.value, 'date')}
              className={classes.dateField}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </Collapse>
      </div>
    );
  };

  // 根据类型渲染不同的筛选区域
  const renderFilterSection = (section) => {
    switch (section.type) {
      case 'chips':
      case 'chip':
        return renderChipFilterSection(section);
      case 'select':
      case 'dropdown':
        return renderSelectFilterSection(section);
      case 'date':
      case 'dateRange':
        return renderDateFilterSection(section);
      default:
        return renderChipFilterSection(section);
    }
  };

  return (
    <div className={classes.filterContainer}>
      <div className={classes.filterHeader}>
        <Typography variant="h6" className={classes.filterTitle}>
          <FilterListIcon className={classes.filterIcon} />
          {title}
        </Typography>
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={onClearAll}
          className={classes.clearAllButton}
        >
          清除全部
        </Button>
      </div>

      {/* 渲染所有筛选区域 */}
      {filterSections.map(renderFilterSection)}

      {/* 显示活跃的筛选条件 */}
      {activeFilters.length > 0 && (
        <div className={classes.activeFiltersSection}>
          <Typography className={classes.activeFilterLabel}>
            <FilterListIcon style={{ marginRight: 4, fontSize: '1rem' }} />
            当前筛选条件
          </Typography>
          <div className={classes.activeFilterChips}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                size="small"
                onDelete={filter.onClear}
                deleteIcon={<ClearIcon />}
                className={classes.filterChip}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalFilter; 