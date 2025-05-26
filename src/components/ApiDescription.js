import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Box, 
  Typography, 
  Chip, 
  Paper,
  Divider
} from '@material-ui/core';
import { 
  Description as DescriptionIcon,
  Label as LabelIcon,
  Category as CategoryIcon,
  Http as HttpIcon 
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  descriptionContainer: {
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    },
  },
  descriptionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
  descriptionIcon: {
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
  },
  descriptionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  descriptionContent: {
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  metadataSection: {
    marginTop: theme.spacing(2),
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    gap: theme.spacing(1),
  },
  metadataIcon: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
  },
  metadataLabel: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    minWidth: '80px',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  tag: {
    fontSize: '0.75rem',
    height: '24px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
    color: 'white',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  methodChip: {
    fontSize: '0.75rem',
    height: '24px',
    borderRadius: '6px',
    fontWeight: 600,
    '&.GET': {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    '&.POST': {
      backgroundColor: '#2196F3',
      color: 'white',
    },
    '&.PUT': {
      backgroundColor: '#FF9800',
      color: 'white',
    },
    '&.DELETE': {
      backgroundColor: '#F44336',
      color: 'white',
    },
    '&.PATCH': {
      backgroundColor: '#9C27B0',
      color: 'white',
    },
  },
}));

const ApiDescription = ({ api }) => {
  const classes = useStyles();

  if (!api) return null;

  const { description, category, tags, method, endpoint, version } = api;

  return (
    <Paper className={classes.descriptionContainer} elevation={0}>
      {/* 描述标题 */}
      <Box className={classes.descriptionHeader}>
        <DescriptionIcon className={classes.descriptionIcon} />
        <Typography className={classes.descriptionTitle}>
          API 描述
        </Typography>
      </Box>

      {/* 描述内容 */}
      {description && (
        <Typography className={classes.descriptionContent}>
          {description}
        </Typography>
      )}

      <Divider />

      {/* 元数据信息 */}
      <Box className={classes.metadataSection}>
        {/* 分类信息 */}
        {category && (
          <Box className={classes.metadataItem}>
            <CategoryIcon className={classes.metadataIcon} />
            <Typography className={classes.metadataLabel}>分类:</Typography>
            <Chip
              label={category}
              size="small"
              className={classes.tag}
            />
          </Box>
        )}

        {/* 请求方法 */}
        {method && (
          <Box className={classes.metadataItem}>
            <HttpIcon className={classes.metadataIcon} />
            <Typography className={classes.metadataLabel}>方法:</Typography>
            <Chip
              label={method}
              size="small"
              className={`${classes.methodChip} ${method}`}
            />
          </Box>
        )}

        {/* 版本信息 */}
        {version && (
          <Box className={classes.metadataItem}>
            <LabelIcon className={classes.metadataIcon} />
            <Typography className={classes.metadataLabel}>版本:</Typography>
            <Typography variant="body2" color="textSecondary">
              {version}
            </Typography>
          </Box>
        )}

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <Box className={classes.metadataItem}>
            <LabelIcon className={classes.metadataIcon} />
            <Typography className={classes.metadataLabel}>标签:</Typography>
            <Box className={classes.tagContainer}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  className={classes.tag}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ApiDescription; 