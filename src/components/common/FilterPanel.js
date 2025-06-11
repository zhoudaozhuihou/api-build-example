import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  InputAdornment
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    fontWeight: 500,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
  },
  filterHeaderIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  accordion: {
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: 0,
    },
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  accordionSummary: {
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 40,
    padding: theme.spacing(0.5, 1),
    '&.Mui-expanded': {
      minHeight: 40,
    },
    '& .MuiAccordionSummary-content': {
      margin: `${theme.spacing(0.5)}px 0`,
      '&.Mui-expanded': {
        margin: `${theme.spacing(0.5)}px 0`,
      },
    },
  },
  accordionDetails: {
    padding: theme.spacing(1.5),
    paddingTop: theme.spacing(1),
    flexDirection: 'column',
  },
  sectionTitle: {
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  sectionIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    color: theme.palette.text.secondary,
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  filterChip: {
    fontSize: '0.75rem',
    height: 28,
    '&.MuiChip-clickable:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  selectedChip: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  sliderContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  countBadge: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.5),
  },
}));

const FilterPanel = ({
  title = "筛选器",
  sections = [],
  activeFilters = {},
  onFilterChange,
  onFilterClear
}) => {
  const classes = useStyles();

  // 处理筛选项变化
  const handleFilterChange = (sectionKey, value, isMultiSelect = false) => {
    if (isMultiSelect) {
      const currentValues = activeFilters[sectionKey] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFilterChange(sectionKey, newValues);
    } else {
      const currentValue = activeFilters[sectionKey];
      const newValue = currentValue === value ? null : value;
      onFilterChange(sectionKey, newValue);
    }
  };

  // 渲染芯片筛选器
  const renderChipFilter = (section) => {
    const selectedValues = activeFilters[section.key] || (section.multiSelect ? [] : null);
    
    return (
      <div className={classes.chipContainer}>
        {section.options.map((option) => {
          const isSelected = section.multiSelect 
            ? selectedValues.includes(option.value)
            : selectedValues === option.value;

          return (
            <Chip
              key={option.value}
              label={
                <span>
                  {option.label}
                  {section.showCounts && option.count !== undefined && (
                    <span className={classes.countBadge}>({option.count})</span>
                  )}
                </span>
              }
              onClick={() => handleFilterChange(section.key, option.value, section.multiSelect)}
              className={`${classes.filterChip} ${isSelected ? classes.selectedChip : ''}`}
              variant={isSelected ? "default" : "outlined"}
              size="small"
              clickable
            />
          );
        })}
      </div>
    );
  };

  // 渲染复选框筛选器
  const renderCheckboxFilter = (section) => {
    const selectedValues = activeFilters[section.key] || [];
    
    return (
      <FormControl component="fieldset">
        <FormGroup>
          {section.options.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleFilterChange(section.key, option.value, true)}
                  size="small"
                />
              }
              label={
                <span>
                  {option.label}
                  {section.showCounts && option.count !== undefined && (
                    <span className={classes.countBadge}>({option.count})</span>
                  )}
                </span>
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  };

  // 渲染单选按钮筛选器
  const renderRadioFilter = (section) => {
    const selectedValue = activeFilters[section.key] || '';
    
    return (
      <FormControl component="fieldset">
        <RadioGroup
          value={selectedValue}
          onChange={(e) => handleFilterChange(section.key, e.target.value, false)}
        >
          {section.options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              label={
                <span>
                  {option.label}
                  {section.showCounts && option.count !== undefined && (
                    <span className={classes.countBadge}>({option.count})</span>
                  )}
                </span>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  };

  // 渲染滑块筛选器
  const renderSliderFilter = (section) => {
    const value = activeFilters[section.key] || section.defaultValue || [section.min || 0, section.max || 100];
    
    return (
      <div className={classes.sliderContainer}>
        <Slider
          value={value}
          onChange={(event, newValue) => onFilterChange(section.key, newValue)}
          valueLabelDisplay="auto"
          min={section.min || 0}
          max={section.max || 100}
          step={section.step || 1}
          marks={section.marks}
        />
      </div>
    );
  };

  // 渲染文本输入筛选器
  const renderTextFilter = (section) => {
    const value = activeFilters[section.key] || '';
    
    return (
      <TextField
        fullWidth
        size="small"
        placeholder={section.placeholder}
        value={value}
        onChange={(e) => onFilterChange(section.key, e.target.value)}
        InputProps={section.startAdornment ? {
          startAdornment: (
            <InputAdornment position="start">
              {section.startAdornment}
            </InputAdornment>
          )
        } : undefined}
      />
    );
  };

  // 根据类型渲染筛选器
  const renderFilterContent = (section) => {
    switch (section.type) {
      case 'chips':
        return renderChipFilter(section);
      case 'checkbox':
        return renderCheckboxFilter(section);
      case 'radio':
        return renderRadioFilter(section);
      case 'slider':
        return renderSliderFilter(section);
      case 'text':
        return renderTextFilter(section);
      default:
        return renderChipFilter(section);
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={classes.filterContainer}>
      <div className={classes.filterHeader}>
        <FilterIcon className={classes.filterHeaderIcon} />
        <Typography variant="h6">{title}</Typography>
      </div>
      
      {sections.map((section) => (
        <Accordion
          key={section.key}
          defaultExpanded={section.defaultExpanded}
          className={classes.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classes.accordionSummary}
          >
            <Typography className={classes.sectionTitle}>
              {section.icon && <span className={classes.sectionIcon}>{section.icon}</span>}
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            {renderFilterContent(section)}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default FilterPanel;