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
  disabledCategoryLabel: {
    color: theme.palette.text.secondary,
    fontWeight: 400
  },
  caretContainer: {
    display: 'flex',
    alignItems: 'center',
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

// 检查是否是叶子节点（没有子节点的类别）
const isLeafCategory = (category) => {
  const normalizedCategory = normalizeCategory(category);
  const childrenArray = normalizedCategory.classifications || [];
  return !childrenArray || childrenArray.length === 0;
};

// 获取所有叶子节点
const getAllLeafCategories = (categories, result = []) => {
  if (!categories || !Array.isArray(categories)) return result;
  
  categories.forEach(category => {
    const normalizedCategory = normalizeCategory(category);
    
    if (isLeafCategory(normalizedCategory)) {
      result.push(normalizedCategory);
    } else {
      const childrenArray = normalizedCategory.classifications || [];
      if (childrenArray && childrenArray.length > 0) {
        getAllLeafCategories(childrenArray, result);
      }
    }
  });
  
  return result;
};

// 检查分类是否在路径中
const isCategoryInPath = (category, path) => {
  const categoryId = category.id || category.value;
  return path.some(item => (item.id || item.value) === categoryId);
};

export default function LeafCategoryCascader({ value = [], onChange, title = "API 分类", placeholder = "请选择分类", categoriesData = apiCategories }) {
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

  // 打开对话框
  const handleOpenDialog = () => {
    console.log("Opening dialog");
    setOpen(true);
    setActivePath([]);
    levelRefs.current = [];
  };

  // 关闭对话框
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

    // 只处理叶子节点的选择
    if (!isLeafCategory(normalizedCategory)) {
      return;
    }
    
    let newSelected = [...selected];
    
    if (isSelect) {
      // 添加到选中项
      const categoryId = normalizedCategory.id || normalizedCategory.value;
      if (!newSelected.some(item => (item.id || item.value) === categoryId)) {
        newSelected.push(normalizedCategory);
      }
    } else {
      // 从选中项中移除
      const categoryId = normalizedCategory.id || normalizedCategory.value;
      newSelected = newSelected.filter(item => (item.id || item.value) !== categoryId);
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
    const normalizedCategory = normalizeCategory(category);
    const categoryId = normalizedCategory.id || normalizedCategory.value;
    return selected.some(item => (item.id || item.value) === categoryId);
  };

  // 检查一个非叶子分类是否有被选中的子分类
  const hasSelectedChildren = (category) => {
    const normalizedCategory = normalizeCategory(category);
    
    if (isLeafCategory(normalizedCategory)) {
      return false;
    }
    
    const allLeaves = getAllLeafCategories([normalizedCategory]);
    return allLeaves.some(leaf => isSelected(leaf));
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
          const normalizedCategory = normalizeCategory(category);
          const childrenArray = normalizedCategory.classifications || [];
          const hasChildren = childrenArray && childrenArray.length > 0;
          const isLeaf = isLeafCategory(normalizedCategory);
          const checked = isSelected(normalizedCategory);
          
          const categoryId = normalizedCategory.id || normalizedCategory.value;
          const activeId = activePath[level] && (activePath[level].id || activePath[level].value);
          const isActive = activeId === categoryId;
          
          const hasSelectedChild = hasSelectedChildren(normalizedCategory);
          
          return (
            <ListItem
              key={categoryId}
              button
              className={`${classes.menuItem} ${isActive ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(normalizedCategory, level)}
            >
              {isLeaf ? (
                <Checkbox
                  edge="start"
                  checked={checked}
                  tabIndex={-1}
                  disableRipple
                  onClick={(e) => handleSelect(normalizedCategory, !checked, e)}
                />
              ) : (
                <div style={{ width: 42 }} />
              )}
              <ListItemText
                primary={
                  <Typography className={isLeaf ? classes.categoryLabel : classes.disabledCategoryLabel}>
                    {normalizedCategory.name}
                    {hasSelectedChild && ' (已选)'}
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
            请选择具体的分类项（只能选择最后一级分类）
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