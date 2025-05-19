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
  Group as GroupIcon,
  Code as CodeIcon,
  Security as SecurityIcon
} from '@material-ui/icons';
import UserManagementPage from './UserManagementPage';
import UserGroupManagementPage from './UserGroupManagementPage';
import ApiOwnershipManagementPage from './ApiOwnershipManagementPage';
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
          variant="scrollable"
          scrollButtons="auto"
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
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <CodeIcon className={classes.tabIcon} />
                <span>API 所有权管理</span>
              </Box>
            } 
            {...a11yProps(2)} 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <SecurityIcon className={classes.tabIcon} />
                <span>权限管理</span>
              </Box>
            } 
            {...a11yProps(3)} 
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
        <UserManagementPage isEmbedded={true} />
      </TabPanel>
      <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
        <UserGroupManagementPage isEmbedded={true} />
      </TabPanel>
      <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
        <ApiOwnershipManagementPage isEmbedded={true} />
      </TabPanel>
      <TabPanel value={tabValue} index={3} className={classes.tabPanel}>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            权限管理
          </Typography>
          <Typography variant="body1" paragraph>
            在这个页面中，您可以管理系统中的权限定义以及权限组。权限定义了用户可以执行的具体操作，而权限组则用于将相关权限组织在一起，方便分配给用户组。
          </Typography>
          <Box mt={2} p={2} bgcolor="background.default" borderRadius={1}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              当前已定义的权限类型:
            </Typography>
            <ul>
              <li>用户管理权限 - 管理系统用户的创建、编辑、删除等操作</li>
              <li>API管理权限 - 管理API的创建、编辑、删除、访问等操作</li>
              <li>数据集管理权限 - 管理数据集的上传、编辑、删除、访问等操作</li>
              <li>低代码平台权限 - 管理低代码应用的创建、编辑、发布等操作</li>
              <li>审核权限 - 管理API和数据集的审核流程</li>
              <li>系统管理权限 - 管理系统设置、日志、监控等操作</li>
            </ul>
          </Box>
          <Box mt={3}>
            <Typography variant="body1">
              您可以通过用户组管理页面为用户组分配权限，或者通过用户管理页面为特定用户分配直接权限。
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </Container>
  );
};

export default UserAccountManagementPage; 