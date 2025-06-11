import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
} from '@material-ui/core';
import {
  Home as HomeIcon,
  TableChart as TableIcon,
} from '@material-ui/icons';
import InteractiveEmployeeTable from '../components/InteractiveEmployeeTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  breadcrumbs: {
    marginBottom: theme.spacing(3),
  },
  descriptionBox: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  featureList: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  featureItem: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '&:before': {
      content: '"✓"',
      marginRight: theme.spacing(1),
      color: theme.palette.success.main,
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
  },
}));

const InteractiveTableDemo = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        {/* 面包屑导航 */}
        <Breadcrumbs className={classes.breadcrumbs}>
          <Link color="inherit" href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon style={{ marginRight: 4 }} />
            首页
          </Link>
          <Typography color="textPrimary" style={{ display: 'flex', alignItems: 'center' }}>
            <TableIcon style={{ marginRight: 4 }} />
            可编辑表格演示
          </Typography>
        </Breadcrumbs>

        {/* 页面标题和描述 */}
        <Box className={classes.header}>
          <Typography variant="h3" component="h1" gutterBottom>
            可编辑员工表格演示
          </Typography>
          <Typography variant="h6" color="textSecondary">
            基于 Material-UI 的高交互性表格组件
          </Typography>
        </Box>

        {/* 功能描述 */}
        <Paper className={classes.descriptionBox}>
          <Typography variant="h5" gutterBottom>
            📋 功能特性
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            这个可编辑表格组件提供了完整的数据编辑解决方案，适用于各种管理界面和数据维护场景。
          </Typography>
          
          <Box className={classes.featureList}>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>批量编辑模式</strong> - 一次性编辑多个字段，统一保存
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>实时状态反馈</strong> - 清晰的编辑状态和保存状态提示
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>变更检测</strong> - 智能检测数据变更，防止误操作
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>取消功能</strong> - 支持取消编辑，恢复到原始状态
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>保存动画</strong> - 优雅的保存加载动画和用户反馈
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>数据对比</strong> - 显示当前编辑数据和已保存数据的对比
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>响应式设计</strong> - 适配不同屏幕尺寸和设备
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>字段验证</strong> - 支持邮箱等特殊字段类型验证
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>添加/删除行</strong> - 动态增加和删除表格行
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>错误提示</strong> - 实时表单验证和错误提示
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>操作保护</strong> - 防止意外删除（保留至少一行）
            </Typography>
          </Box>
        </Paper>

        {/* 交互式表格组件 */}
        <InteractiveEmployeeTable />

        {/* 使用说明 */}
        <Paper className={classes.descriptionBox} style={{ marginTop: 32 }}>
          <Typography variant="h5" gutterBottom>
            🔧 技术实现
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            该组件基于以下技术栈构建：
          </Typography>
          
          <Box className={classes.featureList}>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>Material-UI v4</strong> - 提供一致的设计语言和组件
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>React Hooks</strong> - 使用 useState 管理状态
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>makeStyles</strong> - CSS-in-JS 样式解决方案
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>异步操作</strong> - 模拟真实的保存操作体验
            </Typography>
            <Typography variant="body2" className={classes.featureItem}>
              <strong>状态管理</strong> - 分离编辑状态和保存状态
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default InteractiveTableDemo; 