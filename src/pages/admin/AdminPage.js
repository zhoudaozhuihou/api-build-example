import React from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { 
  People as PeopleIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Dns as DnsIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  pageTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  menuPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  menuTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  listItem: {
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }
}));

const AdminPage = () => {
  const classes = useStyles();
  const history = useHistory();
  
  const adminMenus = [
    {
      title: '用户管理',
      icon: <PeopleIcon />,
      path: '/admin/users',
      description: '管理系统用户、角色和权限',
    },
    {
      title: '系统配置',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      description: '配置系统参数、功能开关等',
    },
    {
      title: '安全与审计',
      icon: <SecurityIcon />,
      path: '/admin/security',
      description: '查看系统操作日志、安全配置',
    },
    {
      title: 'API管理',
      icon: <CodeIcon />,
      path: '/admin/apis',
      description: '管理API设置、策略和监控',
    },
    {
      title: '数据集管理',
      icon: <StorageIcon />,
      path: '/admin/datasets',
      description: '管理数据集配置和访问权限',
    },
    {
      title: '类别管理',
      icon: <CategoryIcon />,
      path: '/admin/categories',
      description: '管理API和数据集分类',
    },
  ];

  const reportMenus = [
    {
      title: '系统状态',
      icon: <DnsIcon />,
      path: '/admin/system-status',
      description: '查看系统运行状态和资源使用',
    },
    {
      title: '使用统计',
      icon: <TimelineIcon />,
      path: '/admin/usage-stats',
      description: '查看API和数据集使用统计',
    },
    {
      title: '审核报表',
      icon: <AssignmentIcon />,
      path: '/admin/review-reports',
      description: '查看审核流程统计数据',
    }
  ];

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.header}>
          <Typography variant="h4" className={classes.pageTitle}>
            管理控制台
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            平台管理与配置
          </Typography>
        </div>

        {/* 快速访问卡片 */}
        <Typography variant="h6" gutterBottom>
          常用功能
        </Typography>
        <Grid container spacing={3} style={{ marginBottom: 32 }}>
          {adminMenus.slice(0, 4).map((menu) => (
            <Grid item xs={12} sm={6} md={3} key={menu.title}>
              <Card 
                className={classes.card} 
                elevation={1}
                onClick={() => history.push(menu.path)}
                style={{ cursor: 'pointer' }}
              >
                <CardContent className={classes.cardContent}>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    {React.cloneElement(menu.icon, { className: classes.cardIcon })}
                    <Typography variant="h6" className={classes.cardTitle}>
                      {menu.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {menu.description}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation(); // 防止触发卡片的click事件
                      history.push(menu.path);
                    }}
                  >
                    进入管理
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 管理菜单 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.menuPaper}>
              <Typography variant="h6" className={classes.menuTitle}>
                系统管理
              </Typography>
              <List>
                {adminMenus.map((menu) => (
                  <ListItem 
                    button 
                    key={menu.title}
                    className={classes.listItem}
                    onClick={() => history.push(menu.path)}
                  >
                    <ListItemIcon>{menu.icon}</ListItemIcon>
                    <ListItemText 
                      primary={menu.title} 
                      secondary={menu.description} 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper className={classes.menuPaper}>
              <Typography variant="h6" className={classes.menuTitle}>
                报表与监控
              </Typography>
              <Divider style={{ marginBottom: 16 }} />
              <List disablePadding>
                {reportMenus.map((menu) => (
                  <ListItem 
                    button 
                    key={menu.title}
                    className={classes.listItem}
                    onClick={() => history.push(menu.path)}
                  >
                    <ListItemIcon>
                      {menu.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={menu.title} 
                      secondary={menu.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Paper className={classes.menuPaper}>
              <Typography variant="h6" className={classes.menuTitle}>
                系统状态
              </Typography>
              <Divider style={{ marginBottom: 16 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box p={2} bgcolor="#e8f5e9" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      系统负载
                    </Typography>
                    <Typography variant="h5" color="primary">
                      正常
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      当前负载: 32%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box p={2} bgcolor="#e3f2fd" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      API服务
                    </Typography>
                    <Typography variant="h5" style={{ color: '#4caf50' }}>
                      运行中
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      正常运行时间: 15d 6h
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box p={2} bgcolor="#fff3e0" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      数据库状态
                    </Typography>
                    <Typography variant="h5" style={{ color: '#ff9800' }}>
                      良好
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      当前连接数: 24
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box p={2} bgcolor="#f3e5f5" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      存储使用
                    </Typography>
                    <Typography variant="h5" style={{ color: '#9c27b0' }}>
                      68%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      剩余: 128 GB
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdminPage; 