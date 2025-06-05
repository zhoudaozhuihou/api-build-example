import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@material-ui/core';
import {
  ViewModule as TableIcon,
  Code as JsonIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Check as CheckIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import JsonTableDisplay from '../components/JsonTableDisplay';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    marginBottom: theme.spacing(4),
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    color: 'white',
  },
  demoCard: {
    marginBottom: theme.spacing(3),
  },
  featuresList: {
    '& .MuiListItem-root': {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
    },
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  exampleSection: {
    marginBottom: theme.spacing(3),
  },
}));

const JsonTableDemo = () => {
  const classes = useStyles();
  
  // 示例数据 - 复杂嵌套JSON
  const [requestData, setRequestData] = useState({
    username: "example_user",
    password: "secret123",
    userProfile: {
      personalInfo: {
        firstName: "张",
        lastName: "三",
        age: 28,
        email: "zhangsan@example.com",
        phone: "+86-13800138000"
      },
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      skills: ["JavaScript", "React", "Node.js", "Python"],
      workExperience: [
        {
          company: "Tech Corp",
          position: "前端开发工程师",
          duration: "2020-2023",
          responsibilities: ["开发用户界面", "优化性能", "团队协作"]
        },
        {
          company: "Startup Inc",
          position: "全栈开发工程师", 
          duration: "2018-2020",
          responsibilities: ["API开发", "数据库设计", "部署运维"]
        }
      ]
    },
    settings: {
      theme: "dark",
      autoSave: true,
      maxFileSize: 10485760
    }
  });

  const [responseData, setResponseData] = useState({
    success: true,
    message: "操作成功",
    data: {
      user: {
        id: "user_12345",
        username: "example_user",
        status: "active",
        lastLogin: "2024-01-15T10:30:00Z",
        permissions: ["read", "write", "delete"],
        profile: {
          displayName: "张三",
          avatar: "https://example.com/avatar.jpg",
          bio: "热爱技术的开发者",
          socialLinks: {
            github: "https://github.com/zhangsan",
            linkedin: "https://linkedin.com/in/zhangsan",
            twitter: "@zhangsan_dev"
          }
        }
      },
      metadata: {
        requestId: "req_789abc123",
        timestamp: "2024-01-15T10:30:00Z",
        version: "v2.1.0",
        rateLimit: {
          remaining: 995,
          total: 1000,
          resetTime: "2024-01-15T11:00:00Z"
        }
      }
    },
    pagination: {
      page: 1,
      pageSize: 20,
      total: 156,
      hasNextPage: true
    }
  });

  const [simpleData] = useState({
    name: "简单示例",
    value: 42,
    enabled: true,
    tags: ["demo", "example", "test"]
  });

  const handleCopy = (jsonString, field) => {
    navigator.clipboard.writeText(jsonString);
    console.log(`已复制 ${field}:`, jsonString);
  };

  const features = [
    "🔄 双视图模式：表格视图和JSON视图无缝切换",
    "📊 智能表格展示：自动识别数据类型，用颜色区分",
    "🌳 层级结构支持：完美处理多层嵌套的JSON对象",
    "✏️ 在线编辑功能：支持实时编辑JSON字段值"
  ];

  const useCases = [
    {
      title: "API文档展示",
      description: "在API详情页展示请求和响应参数结构"
    },
    {
      title: "数据编辑器",
      description: "提供用户友好的JSON数据编辑界面"
    },
    {
      title: "配置管理",
      description: "管理复杂的系统配置和设置参数"
    },
    {
      title: "调试工具",
      description: "开发过程中查看和修改JSON数据"
    }
  ];

  return (
    <Container maxWidth="lg" className={classes.root}>
      {/* 标题区域 */}
      <Card className={classes.headerCard}>
        <CardContent>
          <Typography variant="h3" gutterBottom align="center">
            JSON 表格展示组件演示
          </Typography>
          <Typography variant="h6" align="center" style={{ opacity: 0.9 }}>
            支持嵌套结构的JSON数据可视化编辑器
          </Typography>
        </CardContent>
      </Card>

      {/* 功能特性 */}
      <Card className={classes.demoCard}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🚀 核心功能特性
          </Typography>
          <List className={classes.featuresList}>
            {features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* 使用场景 */}
      <Card className={classes.demoCard}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💡 使用场景
          </Typography>
          <Grid container spacing={2}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box 
                  p={2} 
                  border={1} 
                  borderColor="grey.300" 
                  borderRadius={1}
                  height="100%"
                >
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    {useCase.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {useCase.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Divider style={{ margin: '32px 0' }} />

      {/* 演示区域 */}
      <Typography variant="h4" gutterBottom align="center">
        实时演示
      </Typography>
      
      <Grid container spacing={4}>
        {/* 简单数据示例 */}
        <Grid item xs={12}>
          <div className={classes.exampleSection}>
            <Typography variant="h6" gutterBottom>
              1. 简单数据结构示例
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              演示基础数据类型的展示和编辑功能
            </Typography>
            <JsonTableDisplay
              data={simpleData}
              title="简单数据示例"
              onCopy={(jsonString) => handleCopy(jsonString, 'simple')}
              isCopied={false}
              isEditable={true}
              defaultView="table"
            />
          </div>
        </Grid>

        {/* 复杂请求数据 */}
        <Grid item xs={12} lg={6}>
          <div className={classes.exampleSection}>
            <Typography variant="h6" gutterBottom>
              2. 复杂请求参数示例 (可编辑)
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              模拟API请求参数，包含用户信息、配置项、嵌套对象和数组
            </Typography>
            <div className={classes.chipContainer}>
              <Chip size="small" label="多层嵌套" color="primary" />
              <Chip size="small" label="数组支持" color="secondary" />
              <Chip size="small" label="可编辑" />
            </div>
            <Box mt={2}>
              <JsonTableDisplay
                data={requestData}
                title="请求参数 (Request Body)"
                onDataChange={setRequestData}
                onCopy={(jsonString) => handleCopy(jsonString, 'request')}
                isCopied={false}
                isEditable={true}
                defaultView="table"
              />
            </Box>
          </div>
        </Grid>

        {/* 复杂响应数据 */}
        <Grid item xs={12} lg={6}>
          <div className={classes.exampleSection}>
            <Typography variant="h6" gutterBottom>
              3. 复杂响应数据示例 (只读)
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              模拟API响应数据，包含用户数据、元信息和分页信息
            </Typography>
            <div className={classes.chipContainer}>
              <Chip size="small" label="只读模式" />
              <Chip size="small" label="响应数据" color="primary" />
              <Chip size="small" label="元信息" color="secondary" />
            </div>
            <Box mt={2}>
              <JsonTableDisplay
                data={responseData}
                title="响应数据 (Response Body)"
                onCopy={(jsonString) => handleCopy(jsonString, 'response')}
                isCopied={false}
                isEditable={false}
                defaultView="table"
              />
            </Box>
          </div>
        </Grid>
      </Grid>

      {/* 操作指南 */}
      <Card className={classes.demoCard} style={{ marginTop: 32 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📖 操作指南
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                <TableIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                表格视图操作
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="展开/折叠"
                    secondary="点击箭头图标展开或折叠嵌套结构"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="编辑字段"
                    secondary="点击编辑按钮修改字段值，支持JSON格式验证"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="类型识别"
                    secondary="不同数据类型用不同颜色的标签显示"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                <JsonIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                JSON视图操作
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="切换视图"
                    secondary="使用右上角开关在表格和JSON视图间切换"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="编辑JSON"
                    secondary="在JSON视图下点击编辑按钮进行文本编辑"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="复制数据"
                    secondary="点击复制按钮将JSON数据复制到剪贴板"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JsonTableDemo;
