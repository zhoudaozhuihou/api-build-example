import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Switch,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpandMore,
  ChevronRight as ChevronRightIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  leftPanel: {
    height: 'calc(100vh - 64px - 48px - 16px)',
    display: 'flex',
    flexDirection: 'column',
  },
  stickyListHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  headerTitleText: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
  editModeSwitch: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 1.5),
  },
  editModeLabel: {
    fontSize: '0.8rem',
    marginRight: theme.spacing(1),
    fontWeight: 500,
  },
  categoryListContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  categoryTreeItem: {
    '& > .MuiTreeItem-content': {
      padding: theme.spacing(0.5, 1),
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
      },
      '&.Mui-selected': {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      },
    },
    '& .MuiTreeItem-label': {
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  categoryItemText: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    color: theme.palette.text.secondary,
  },
  categoryCount: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: theme.spacing(0.1, 0.8),
    marginLeft: theme.spacing(1),
    minWidth: '22px',
    height: '20px',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryActions: {
    display: 'flex',
    opacity: 0,
    transition: 'opacity 0.2s',
    '$categoryTreeItem:hover &': {
      opacity: 1,
    },
  },
  categoryActionButton: {
    padding: 2,
    fontSize: '0.8rem',
  },
  subCategory: {
    marginLeft: theme.spacing(2),
    '& .MuiTreeItem-content': {
      paddingLeft: theme.spacing(1),
    },
  },
}));

const CategoryTreePanel = ({
  title = "分类",
  icon: TitleIcon = CategoryIcon,
  categories = [],
  selectedCategory,
  onCategorySelect,
  expandedCategories = {},
  onToggleExpanded,
  editMode = false,
  onEditModeToggle,
  showEditMode = true,
  onEditCategory,
  onAddCategory,
  getItemCount,
  renderCustomActions,
  itemIcon: ItemIcon = FolderIcon,
  openItemIcon: OpenItemIcon = FolderOpenIcon
}) => {
  const classes = useStyles();

  // 渲染分类树项目
  const renderTreeItems = (items, level = 0) => {
    if (!Array.isArray(items)) return null;

    return items.map((item) => {
      const itemId = item.id || item.value;
      const isExpanded = expandedCategories[itemId];
      const hasChildren = item.children && item.children.length > 0;
      const itemCount = getItemCount ? getItemCount(item) : null;

      return (
        <TreeItem
          key={itemId}
          nodeId={itemId}
          className={classes.categoryTreeItem}
          label={
            <div className={classes.categoryItemText}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {hasChildren ? (
                  isExpanded ? <OpenItemIcon className={classes.categoryIcon} /> : <ItemIcon className={classes.categoryIcon} />
                ) : (
                  <ItemIcon className={classes.categoryIcon} />
                )}
                <span>{item.label || item.name}</span>
                {itemCount !== null && itemCount !== undefined && (
                  <span className={classes.categoryCount}>{itemCount}</span>
                )}
              </div>
              
              {editMode && (
                <div className={classes.categoryActions}>
                  {onEditCategory && (
                    <IconButton
                      size="small"
                      className={classes.categoryActionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(item);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onAddCategory && (
                    <IconButton
                      size="small"
                      className={classes.categoryActionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddCategory(item);
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                  {renderCustomActions && renderCustomActions(item)}
                </div>
              )}
            </div>
          }
          onClick={() => onCategorySelect && onCategorySelect(item)}
        >
          {hasChildren && renderTreeItems(item.children, level + 1)}
        </TreeItem>
      );
    });
  };

  return (
    <Paper className={classes.leftPanel}>
      <div className={classes.stickyListHeader}>
        <Typography className={classes.headerTitleText}>
          <TitleIcon style={{ marginRight: 8 }} /> {title}
        </Typography>
        {showEditMode && (
          <div className={classes.editModeSwitch}>
            <Typography className={classes.editModeLabel}>编辑</Typography>
            <Switch
              size="small"
              checked={editMode}
              onChange={onEditModeToggle}
              color="primary"
            />
          </div>
        )}
      </div>
      <div className={classes.categoryListContainer}>
        <TreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={Object.keys(expandedCategories).filter(key => expandedCategories[key])}
          onNodeToggle={onToggleExpanded}
          selected={selectedCategory ? (selectedCategory.id || selectedCategory.value) : ''}
        >
          {renderTreeItems(categories)}
        </TreeView>
      </div>
    </Paper>
  );
};

export default CategoryTreePanel; 