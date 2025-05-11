import React, { useState, useEffect, useRef } from 'react';
import {
  Button, List, ListItem, Checkbox, ListItemText, 
  Chip, Box, Typography, makeStyles, Paper,
  Dialog, DialogContent, DialogActions
} from '@material-ui/core';
import { ArrowRight, Category, Close, KeyboardArrowDown } from '@material-ui/icons';
import { apiCategories } from '../constants/apiCategories';

const useStyles = makeStyles((theme) => ({
  selectedBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    minHeight: 32,
    maxHeight: 150,
    overflowY: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.selected': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  button: {
    textAlign: 'left',
    justifyContent: 'space-between',
    textTransform: 'none',
    border: `1px solid ${theme.palette.divider}`,
    width: '100%',
  },
  cascaderContainer: {
    position: 'relative',
  },
  menuContainer: {
    display: 'flex',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    maxHeight: 450,
    overflow: 'hidden',
    boxShadow: theme.shadows[3],
  },
  menuLevel: {
    width: 220,
    height: 450,
    maxHeight: 450,
    overflowY: 'auto',
    borderRight: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderRight: 'none',
    },
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.default,
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.divider,
      borderRadius: 4,
      '&:hover': {
        backgroundColor: theme.palette.grey[400],
      },
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  categoryLabel: {
    color: theme.palette.text.primary,
    fontWeight: 500
  },
  caretContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  indentedLabel: {
    paddingLeft: theme.spacing(3),
  },
  dialogContent: {
    padding: theme.spacing(2),
    minWidth: '660px',
    minHeight: '500px',
  },
  dialogRoot: {
    '& .MuiDialog-paper': {
      overflow: 'visible',
    },
  },
  helperText: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  listsContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

// 递归查找所有子级
const findAllChildren = (category, allCategories = []) => {
  if (!category) return [];
  allCategories.push(category);
  
  // 检查是否有子分类，并处理不同格式
  const childrenArray = category.classifications || [];
  if (childrenArray && childrenArray.length > 0) {
    childrenArray.forEach(child => {
      findAllChildren(child, allCategories);
    });
  }
  return allCategories;
};

// 递归查找父级
const findParentCategory = (idOrValue, categories, parent = null) => {
  for (const cat of categories) {
    // 处理不同格式的ID
    const catId = cat.id || cat.value;
    if (catId === idOrValue) {
      return parent;
    }
    
    // 处理不同格式的子分类
    const childrenArray = cat.classifications || [];
    if (childrenArray && childrenArray.length > 0) {
      const result = findParentCategory(idOrValue, childrenArray, cat);
      if (result) return result;
    }
  }
  return null;
};

// 按路径查找所有父级
const findAllParents = (idOrValue, categories, result = []) => {
  const parent = findParentCategory(idOrValue, categories);
  if (parent) {
    // 处理不同格式的ID
    const parentId = parent.id || parent.value;
    result.unshift(parent);
    findAllParents(parentId, categories, result);
  }
  return result;
};

// 标准化不同格式的分类对象，确保至少有基本属性
const normalizeCategory = (category) => {
  // 如果已经是标准格式，直接返回
  if (category.id) return category;
  
  // 处理只有value/label格式的对象
  if (category.value) {
    return {
      ...category,
      id: category.value,
      name: category.label,
      classifications: category.classifications || [],
    };
  }
  
  // 如果格式不符合预期，提供默认值
  return {
    id: category.id || 'unknown',
    name: category.name || category.label || 'Unknown',
    classifications: category.classifications || [],
  };
};

export default function CategoryCascader({ value = [], onChange, title = "API 分类", placeholder = "请选择分类", categoriesData = apiCategories }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [activePath, setActivePath] = useState([]);
  const buttonRef = useRef(null);
  const levelRefs = useRef([]);
  
  // 初始化选中项
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // 使用Dialog替代Popover
  const handleOpenDialog = () => {
    console.log("Opening dialog");
    setOpen(true);
    setActivePath([]);
    levelRefs.current = [];
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog");
    setOpen(false);
  };

  // 处理点击目录时展开下一级
  const handleCategoryClick = (category, level) => {
    const normalizedCategory = normalizeCategory(category);
    
    const newPath = [...activePath];
    newPath[level] = normalizedCategory;
    // 移除后续层级
    if (level < newPath.length - 1) {
      newPath.splice(level + 1);
    }
    setActivePath(newPath);
    
    setTimeout(() => {
      if (level + 1 < levelRefs.current.length && levelRefs.current[level + 1]) {
        levelRefs.current[level + 1].scrollTop = 0;
      }
    }, 50);
  };

  // 处理选择/取消选择
  const handleSelect = (category, isSelect, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    const normalizedCategory = normalizeCategory(category);
    
    let newSelected = [...selected];
    const allChildren = findAllChildren(normalizedCategory);
    
    if (isSelect) {
      // 父级被选中，所有子级也选中
      allChildren.forEach(item => {
        const normalizedItem = normalizeCategory(item);
        const id = normalizedItem.id;
        if (!newSelected.some(s => (s.id || s.value) === id)) {
          newSelected.push(normalizedItem);
        }
      });
    } else {
      // 父级被取消，所有子级也取消
      newSelected = newSelected.filter(
        item => !allChildren.some(c => (c.id || c.value) === (item.id || item.value))
      );
    }
    
    setSelected(newSelected);
    onChange(newSelected);
  };

  // 完成选择，关闭菜单
  const handleDoneSelection = () => {
    setOpen(false);
  };

  // 检查一个分类是否被选中
  const isSelected = (category) => {
    const categoryId = category.id || category.value;
    return selected.some(item => (item.id || item.value) === categoryId);
  };

  // 检查一个分类的所有子项是否全部被选中
  const areAllChildrenSelected = (category) => {
    const childrenArray = category.classifications || [];
    if (!childrenArray || childrenArray.length === 0) {
      return true;
    }
    
    return childrenArray.every(child => {
      if (isSelected(child)) {
        return areAllChildrenSelected(child);
      }
      return false;
    });
  };

  // 检查一个分类的部分子项是否被选中
  const areSomeChildrenSelected = (category) => {
    const childrenArray = category.classifications || [];
    if (!childrenArray || childrenArray.length === 0) {
      return false;
    }
    
    return childrenArray.some(child => {
      return isSelected(child) || areSomeChildrenSelected(child);
    });
  };

  // 获取checkbox状态
  const getCheckboxState = (category) => {
    const checked = isSelected(category);
    const indeterminate = !checked && areSomeChildrenSelected(category);
    return { checked, indeterminate };
  };

  // 设置列表引用
  const setLevelRef = (ref, level) => {
    if (ref && !levelRefs.current[level]) {
      levelRefs.current[level] = ref;
    }
  };

  // 渲染每一级菜单
  const renderMenuLevel = (categories, level) => {
    return (
      <List 
        dense 
        className={classes.menuLevel} 
        key={`level-${level}`}
        ref={(ref) => setLevelRef(ref, level)}
      >
        {categories.map((category) => {
          // 确保分类对象有标准化的属性
          const normalizedCategory = normalizeCategory(category);
          const { checked, indeterminate } = getCheckboxState(normalizedCategory);
          
          // 处理不同格式的子分类数组
          const childrenArray = normalizedCategory.classifications || [];
          const hasChildren = childrenArray && childrenArray.length > 0;
          
          const isActive = activePath[level] && 
            (activePath[level].id || activePath[level].value) === 
            (normalizedCategory.id || normalizedCategory.value);
          
          return (
            <ListItem
              key={normalizedCategory.id || normalizedCategory.value}
              button
              className={`${classes.menuItem} ${isActive ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(normalizedCategory, level)}
            >
              <Checkbox
                edge="start"
                checked={checked}
                indeterminate={indeterminate}
                tabIndex={-1}
                disableRipple
                onClick={(e) => handleSelect(normalizedCategory, !checked, e)}
              />
              <ListItemText
                primary={
                  <Typography className={classes.categoryLabel}>
                    {normalizedCategory.name}
                  </Typography>
                }
              />
              {hasChildren && (
                <div className={classes.caretContainer}>
                  <ArrowRight />
                </div>
              )}
            </ListItem>
          );
        })}
      </List>
    );
  };

  // 递归渲染所有级别
  const renderAllLevels = () => {
    // 从激活路径确定要显示的层级
    const levels = [];
    
    // 添加第一级菜单
    levels.push(renderMenuLevel(categoriesData, 0));
    
    // 根据激活路径添加后续级别
    for (let i = 0; i < activePath.length; i++) {
      if (activePath[i]) {
        const childrenArray = activePath[i].classifications || [];
        if (childrenArray && childrenArray.length > 0) {
          levels.push(renderMenuLevel(childrenArray, i + 1));
        }
      }
    }
    
    return levels;
  };

  // 处理删除已选项
  const handleDelete = (category, event) => {
    if (event) {
      event.stopPropagation();
    }
    handleSelect(category, false);
  };

  // 清空所有已选项
  const handleClearAll = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelected([]);
    onChange([]);
  };

  // 渲染已选择的分类
  const renderSelectedItems = () => {
    return (
      <Box className={classes.selectedBox}>
        {selected.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            未选择任何分类
          </Typography>
        ) : (
          <>
            {selected.map((cat) => {
              const normalizedCat = normalizeCategory(cat);
              return (
                <Chip
                  key={normalizedCat.id || normalizedCat.value}
                  icon={<Category fontSize="small" />}
                  label={normalizedCat.name}
                  onDelete={(e) => handleDelete(normalizedCat, e)}
                  color="primary"
                  variant="outlined"
                  className={classes.chip}
                  deleteIcon={<Close fontSize="small" />}
                  size="small"
                />
              );
            })}
            {selected.length > 1 && (
              <Chip
                label="清空"
                onDelete={handleClearAll}
                onClick={handleClearAll}
                color="secondary"
                variant="outlined"
                className={classes.chip}
                size="small"
              />
            )}
          </>
        )}
      </Box>
    );
  };

  return (
    <div className={classes.cascaderContainer}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      
      <Button 
        variant="outlined" 
        onClick={handleOpenDialog}
        className={classes.button}
        fullWidth
        endIcon={<KeyboardArrowDown />}
        ref={buttonRef}
      >
        {selected.length === 0 
          ? placeholder 
          : `已选择 ${selected.length} 个分类`}
      </Button>
      
      {renderSelectedItems()}
      
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        className={classes.dialogRoot}
      >
        <DialogContent className={classes.dialogContent}>
          <Typography variant="subtitle2" gutterBottom className={classes.helperText}>
            请选择分类（可选择任意级别，选择父级将自动包含所有子级）
          </Typography>
          <div className={classes.listsContainer}>
            <Paper className={classes.menuContainer}>
              {renderAllLevels()}
            </Paper>
          </div>
        </DialogContent>
        <DialogActions>
          <Button 
            color="primary" 
            onClick={handleDoneSelection}
            variant="contained"
          >
            完成
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 