import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { Code as CodeIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  apiStatsContainer: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(3),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: theme.spacing(1.5, 2.5),
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    zIndex: 10,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  statsContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  statsIcon: {
    fontSize: '1.8rem',
    color: theme.palette.primary.main,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statsNumber: {
    fontSize: '2rem',
    fontWeight: 900,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
  },
  statsLabel: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.5),
  },
}));

const ApiTotalStats = ({ totalCount }) => {
  const classes = useStyles();

  return (
    <Box className={classes.apiStatsContainer}>
      <Box className={classes.statsContent}>
        <CodeIcon className={classes.statsIcon} />
        <Box display="flex" alignItems="baseline">
          <Typography variant="h3" className={classes.statsNumber}>
            {totalCount}
          </Typography>
          <Typography variant="body2" className={classes.statsLabel}>
            API 总数
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ApiTotalStats; 