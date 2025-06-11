import React from 'react';
import {
  Container,
  Grid,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ManagementPageHeader from './ManagementPageHeader';
import FilterPanel from './FilterPanel';
import CategoryTreePanel from './CategoryTreePanel';
import CardGridPanel from './CardGridPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingTop: theme.spacing(2),
  },
  contentContainer: {
    marginTop: theme.spacing(3),
  },
  filterSection: {
    marginBottom: theme.spacing(3),
  },
  mainContentContainer: {
    height: 'calc(100vh - 300px - 48px)',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  categorySection: {
    flex: 1,
  },
  rightColumn: {
    height: '100%',
  },
}));

const ManagementLayout = ({
  // Header props
  headerConfig = {},
  
  // Filter props
  filterConfig = {},
  activeFilters = {},
  onFilterChange,
  showFilters = true,
  
  // Category props
  categoryConfig = {},
  showCategory = true,
  
  // Card grid props
  cardGridConfig = {},
  
  // Layout props
  leftColumnWidth = 3,
  rightColumnWidth = 9,
  showFilterInLeftColumn = false,
}) => {
  const classes = useStyles();

  const renderFilterPanel = () => {
    if (!showFilters || !filterConfig.sections || filterConfig.sections.length === 0) {
      return null;
    }

    return (
      <FilterPanel
        title={filterConfig.title}
        sections={filterConfig.sections}
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
        onFilterClear={filterConfig.onFilterClear}
      />
    );
  };

  const renderCategoryPanel = () => {
    if (!showCategory) {
      return null;
    }

    return (
      <div className={classes.categorySection}>
        <CategoryTreePanel
          title={categoryConfig.title}
          icon={categoryConfig.icon}
          categories={categoryConfig.categories}
          selectedCategory={categoryConfig.selectedCategory}
          onCategorySelect={categoryConfig.onCategorySelect}
          expandedCategories={categoryConfig.expandedCategories}
          onToggleExpanded={categoryConfig.onToggleExpanded}
          editMode={categoryConfig.editMode}
          onEditModeToggle={categoryConfig.onEditModeToggle}
          showEditMode={categoryConfig.showEditMode}
          onEditCategory={categoryConfig.onEditCategory}
          onAddCategory={categoryConfig.onAddCategory}
          getItemCount={categoryConfig.getItemCount}
          renderCustomActions={categoryConfig.renderCustomActions}
          itemIcon={categoryConfig.itemIcon}
          openItemIcon={categoryConfig.openItemIcon}
        />
      </div>
    );
  };

  const renderCardGrid = () => {
    return (
      <CardGridPanel
        title={cardGridConfig.title}
        items={cardGridConfig.items}
        totalCount={cardGridConfig.totalCount}
        publicCount={cardGridConfig.publicCount}
        searchQuery={cardGridConfig.searchQuery}
        onSearchClear={cardGridConfig.onSearchClear}
        renderCard={cardGridConfig.renderCard}
        page={cardGridConfig.page}
        onPageChange={cardGridConfig.onPageChange}
        itemsPerPage={cardGridConfig.itemsPerPage}
        totalItems={cardGridConfig.totalItems}
        customStats={cardGridConfig.customStats}
        emptyStateIcon={cardGridConfig.emptyStateIcon}
        emptyStateText={cardGridConfig.emptyStateText}
        cardGridProps={cardGridConfig.cardGridProps}
        showPagination={cardGridConfig.showPagination}
      />
    );
  };

  return (
    <div className={classes.root}>
      {/* 页面头部 */}
      <ManagementPageHeader
        title={headerConfig.title}
        subtitle={headerConfig.subtitle}
        searchQuery={headerConfig.searchQuery}
        onSearchChange={headerConfig.onSearchChange}
        onSearchClear={headerConfig.onSearchClear}
        searchResults={headerConfig.searchResults}
        totalResults={headerConfig.totalResults}
        searchLoading={headerConfig.searchLoading}
        searchPlaceholder={headerConfig.searchPlaceholder}
        importButtonText={headerConfig.importButtonText}
        onImportClick={headerConfig.onImportClick}
        totalCount={headerConfig.totalCount}
        countLabel={headerConfig.countLabel}
        countIcon={headerConfig.countIcon}
        // SearchDropdown props
        onSearchResultClick={headerConfig.onSearchResultClick}
        onSearchViewAll={headerConfig.onSearchViewAll}
        transformedSearchResults={headerConfig.transformedSearchResults}
        maxDisplayResults={headerConfig.maxDisplayResults}
        clearOnSelect={headerConfig.clearOnSelect}
        showViewAllButton={headerConfig.showViewAllButton}
        disabled={headerConfig.disabled}
        onKeyPress={headerConfig.onKeyPress}
        renderResultItem={headerConfig.renderResultItem}
      />

      <Container maxWidth="xl">
        {/* 筛选器区域 - 如果不在左列显示，则在这里显示 */}
        {!showFilterInLeftColumn && (
          <div className={classes.filterSection}>
            {renderFilterPanel()}
          </div>
        )}

        {/* 主要内容区域 */}
        <div className={classes.contentContainer}>
          <Grid container spacing={3} className={classes.mainContentContainer}>
            {/* 左侧列 - 分类树和可选的筛选器 */}
            <Grid item xs={12} md={leftColumnWidth}>
              <div className={classes.leftColumn}>
                {/* 筛选器 - 如果配置为在左列显示 */}
                {showFilterInLeftColumn && renderFilterPanel()}
                
                {/* 分类树 */}
                {renderCategoryPanel()}
              </div>
            </Grid>

            {/* 右侧列 - 卡片网格 */}
            <Grid item xs={12} md={rightColumnWidth} className={classes.rightColumn}>
              {renderCardGrid()}
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default ManagementLayout; 