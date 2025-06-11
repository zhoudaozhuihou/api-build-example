import React from 'react';
import {
  Paper,
  Typography,
  Container,
  Button,
  InputBase,
  Box,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon
} from '@material-ui/icons';
import SearchDropdown from '../SearchDropdown';

const useStyles = makeStyles((theme) => ({
  headerSection: {
    height: 300,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.common.white,
    marginBottom: theme.spacing(3),
  },
  headerContent: {
    width: '100%',
    textAlign: 'center',
  },
  bannerTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 700,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  headerSubtitle: {
    opacity: 0.9,
    maxWidth: 600,
    margin: '0 auto',
    marginBottom: theme.spacing(3),
  },
  searchContainer: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 3,
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
  headerSearchInput: {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1rem',
  },
  importButtonHeader: {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 3),
    boxShadow: theme.shadows[3],
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  },
  totalStats: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    backdropFilter: 'blur(10px)',
  },
  statsIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
  },
  statsText: {
    fontSize: '0.9rem',
    fontWeight: 500,
  },
}));

const ManagementPageHeader = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onSearchClear,
  searchResults,
  totalResults,
  searchLoading,
  searchPlaceholder,
  importButtonText,
  onImportClick,
  totalCount,
  countLabel,
  countIcon: CountIcon,
  // SearchDropdown props
  onSearchResultClick,
  onSearchViewAll,
  transformedSearchResults,
  maxDisplayResults = 5,
  clearOnSelect = false,
  showViewAllButton = true,
  disabled = false,
  onKeyPress,
  renderResultItem
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.headerSection} elevation={0}>
      <Container className={classes.headerContent}>
        <Typography variant="h3" className={classes.bannerTitle}>
          {title}
        </Typography>
        <Typography variant="subtitle1" className={classes.headerSubtitle}>
          {subtitle}
        </Typography>
        
        {/* 使用SearchDropdown替代简单的搜索框 */}
        <SearchDropdown
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchClear={onSearchClear}
          searchResults={transformedSearchResults || searchResults}
          totalResults={totalResults}
          loading={searchLoading}
          placeholder={searchPlaceholder}
          maxDisplayResults={maxDisplayResults}
          onResultClick={onSearchResultClick}
          onViewAllResults={onSearchViewAll}
          renderResultItem={renderResultItem}
          clearOnSelect={clearOnSelect}
          showViewAllButton={showViewAllButton}
          disabled={disabled}
          onKeyPress={onKeyPress}
        />
        
        {importButtonText && onImportClick && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            className={classes.importButtonHeader}
            onClick={onImportClick}
          >
            {importButtonText}
          </Button>
        )}
      </Container>
      
      {/* 总数统计 - 左下角 */}
      {totalCount !== undefined && countLabel && CountIcon && (
        <div className={classes.totalStats}>
          <CountIcon className={classes.statsIcon} />
          <Typography variant="body2" className={classes.statsText}>
            {countLabel}: {totalCount}
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default ManagementPageHeader; 