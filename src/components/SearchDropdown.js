import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    position: 'relative',
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    maxWidth: 500,
    margin: '0 auto',
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
  },
  inputRoot: {
    color: theme.palette.text.primary,
    width: '100%',
  },
  searchInput: {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1rem',
  },
  dropdownPaper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxWidth: 600,
    margin: '8px auto 0',
    zIndex: 1000,
    maxHeight: '400px',
    overflow: 'auto',
    borderRadius: 16,
    border: '1px solid #e0e0e0'
  },
  resultHeader: {
    marginBottom: 12, 
    display: 'flex', 
    alignItems: 'center',
    fontWeight: 600,
    color: theme.palette.primary.main
  },
  resultItem: {
    borderRadius: 8,
    marginBottom: 4,
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      borderColor: theme.palette.primary.main
    }
  },
  viewAllButton: {
    fontSize: '0.8rem',
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1),
    borderTop: '1px solid #e0e0e0'
  }
}));

const SearchDropdown = ({
  searchQuery = '',
  onSearchChange,
  onSearchClear,
  searchResults = [],
  totalResults = 0,
  loading = false,
  placeholder = '搜索...',
  maxDisplayResults = 5,
  onResultClick,
  onViewAllResults,
  renderResultItem,
  resultIcon: ResultIcon,
  clearOnSelect = true,
  showViewAllButton = true,
  disabled = false,
  onKeyPress
}) => {
  const classes = useStyles();

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchQuery && !event.target.closest('[data-search-dropdown]')) {
        if (onSearchClear) {
          onSearchClear();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchQuery, onSearchClear]);

  const handleResultItemClick = (item) => {
    if (onResultClick) {
      onResultClick(item);
    }
    if (clearOnSelect && onSearchClear) {
      onSearchClear();
    }
  };

  const handleViewAllClick = () => {
    if (onViewAllResults) {
      onViewAllResults();
    }
    if (clearOnSelect && onSearchClear) {
      onSearchClear();
    }
  };

  const defaultRenderResultItem = (item, index) => (
    <ListItem
      key={item.id || index}
      button
      onClick={() => handleResultItemClick(item)}
      className={classes.resultItem}
    >
      {ResultIcon && (
        <ListItemIcon style={{ minWidth: 36 }}>
          <ResultIcon color="primary" fontSize="small" />
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontWeight: 600, marginBottom: 2 }}>
            {item.title || item.name || item.label}
          </Typography>
        }
        secondary={
          <Box>
            {item.description && (
              <Typography variant="caption" color="textSecondary" style={{ 
                display: '-webkit-box',
                '-webkit-line-clamp': 1,
                '-webkit-box-orient': 'vertical',
                overflow: 'hidden',
                marginBottom: 4
              }}>
                {item.description}
              </Typography>
            )}
            <Box display="flex" alignItems="center" gap={1}>
              {item.type && (
                <Chip 
                  label={item.type} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  style={{ fontSize: '0.65rem', height: 20 }}
                />
              )}
              {item.size && (
                <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.7rem' }}>
                  {item.size}
                </Typography>
              )}
            </Box>
          </Box>
        }
      />
      {item.status && (
        <ListItemSecondaryAction>
          <Chip 
            label={item.status} 
            size="small"
            color={item.status === 'public' || item.status === '公开' ? 'primary' : 'default'}
            variant="outlined"
            style={{ fontSize: '0.65rem', height: 20 }}
          />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );

  return (
    <Box className={classes.searchContainer} data-search-dropdown>
      <Paper elevation={3} style={{ borderRadius: 24, overflow: 'hidden' }}>
        <Box display="flex" alignItems="center" padding="4px 16px">
          <SearchIcon className={classes.searchIcon} />
          <InputBase
            placeholder={placeholder}
            classes={{
              root: classes.inputRoot,
              input: classes.searchInput,
            }}
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={onKeyPress}
            disabled={disabled}
            style={{ flex: 1 }}
          />
          {loading && <CircularProgress size={20} style={{ marginRight: 8 }} />}
          {searchQuery && onSearchClear && (
            <IconButton size="small" onClick={onSearchClear} disabled={disabled}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
      
      {/* 悬浮搜索结果 */}
      {searchQuery && searchResults.length > 0 && (
        <Paper elevation={8} className={classes.dropdownPaper}>
          <Box padding={2}>
            <Typography variant="subtitle1" className={classes.resultHeader}>
              <SearchIcon style={{ marginRight: 8, fontSize: 20 }} />
              搜索结果 ({totalResults} 个)
            </Typography>
            
            {/* 搜索结果列表 */}
            <List disablePadding>
              {searchResults.slice(0, maxDisplayResults).map((item, index) => 
                renderResultItem ? renderResultItem(item, index) : defaultRenderResultItem(item, index)
              )}
            </List>
            
            {showViewAllButton && searchResults.length > maxDisplayResults && (
              <Box display="flex" justifyContent="center" className={classes.viewAllButton}>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handleViewAllClick}
                >
                  查看全部 {totalResults} 个结果
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SearchDropdown; 