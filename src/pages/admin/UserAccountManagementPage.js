import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import { 
  Person as PersonIcon,
  Group as GroupIcon
} from '@material-ui/icons';
import UserManagementPage from './UserManagementPage';
import UserGroupManagementPage from './UserGroupManagementPage';
import useI18n from '../../hooks/useI18n';

// TabPanel component to display tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-management-tabpanel-${index}`}
      aria-labelledby={`user-management-tab-${index}`}
      {...other}
      style={{ padding: 0 }}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

// Props function for accessibility
function a11yProps(index) {
  return {
    id: `user-management-tab-${index}`,
    'aria-controls': `user-management-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  tabsContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabs: {
    '& .MuiTab-root': {
      minWidth: 120,
    },
  },
  tabIcon: {
    marginRight: theme.spacing(1),
  },
  tabPanel: {
    padding: 0,
  },
}));

const UserAccountManagementPage = () => {
  const classes = useStyles();
  const { translate } = useI18n();
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" component="h1">
          {translate('menu.userManagement')}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {translate('menu.userAccountManagement.subtitle')}
        </Typography>
      </div>

      <Paper className={classes.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <PersonIcon className={classes.tabIcon} />
                <span>{translate('menu.userManagement')}</span>
              </Box>
            } 
            {...a11yProps(0)} 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <GroupIcon className={classes.tabIcon} />
                <span>{translate('menu.userGroupManagement')}</span>
              </Box>
            } 
            {...a11yProps(1)} 
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
        <UserManagementPage isEmbedded={true} />
      </TabPanel>
      <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
        <UserGroupManagementPage isEmbedded={true} />
      </TabPanel>
    </Container>
  );
};

export default UserAccountManagementPage; 