import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Category as CategoryIcon,
  Http as HttpIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  categoryItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  categoryStats: {
    marginLeft: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  categoryIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ApiCategoryItem = ({ category, level = 0 }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const hasChildren = category.classifications && category.classifications.length > 0;

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem
        button
        className={classes.categoryItem}
        style={{ paddingLeft: level * 24 }}
        onClick={hasChildren ? handleToggle : undefined}
      >
        <div className={classes.categoryHeader}>
          <div className={classes.categoryInfo}>
            <ListItemIcon className={classes.categoryIcon}>
              {hasChildren ? <CategoryIcon /> : <HttpIcon />}
            </ListItemIcon>
            <ListItemText
              primary={category.name}
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {category.typeName}
                </Typography>
              }
            />
          </div>
          <div className={classes.categoryStats}>
            <Typography variant="caption" display="block">
              API数量: {category.apiAmount}
            </Typography>
            {hasChildren && (
              <Typography variant="caption" display="block">
                子分类: {category.childAmount}
              </Typography>
            )}
          </div>
          {hasChildren && (
            <IconButton size="small">
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </div>
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.classifications.map((childCategory) => (
              <ApiCategoryItem
                key={childCategory.id}
                category={childCategory}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

ApiCategoryItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    typeName: PropTypes.string.isRequired,
    apiAmount: PropTypes.number.isRequired,
    childAmount: PropTypes.number.isRequired,
    classifications: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  level: PropTypes.number,
};

const ApiCategoryList = ({ categories }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <List component="nav">
        {categories.map((category) => (
          <ApiCategoryItem key={category.id} category={category} />
        ))}
      </List>
    </Box>
  );
};

ApiCategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      typeName: PropTypes.string.isRequired,
      apiAmount: PropTypes.number.isRequired,
      childAmount: PropTypes.number.isRequired,
      classifications: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
};

export default ApiCategoryList; 