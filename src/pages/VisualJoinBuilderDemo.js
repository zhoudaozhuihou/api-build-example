import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@material-ui/core';
import {
  TableChart,
  Build as BuildIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  DragIndicator,
  ArrowForward,
  CheckCircle
} from '@material-ui/icons';
import VisualJoinBuilder from '../components/VisualJoinBuilder';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(6, 0),
    marginBottom: theme.spacing(4),
  },
  headerContent: {
    textAlign: 'center',
  },
  demoSection: {
    marginBottom: theme.spacing(4),
  },
  featureCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  featureIcon: {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  builderContainer: {
    height: 'calc(100vh - 100px)',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  instructionsList: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const VisualJoinBuilderDemo = () => {
  const classes = useStyles();
  const [showBuilder, setShowBuilder] = useState(false);

  const features = [
    {
      icon: <DragIndicator className={classes.featureIcon} />,
      title: '拖拽式设计',
      description: '从表格列表拖拽表格到画布，直观地构建数据关系。支持自由移动和位置调整。',
    },
    {
      icon: <LinkIcon className={classes.featureIcon} />,
      title: '可视化连接',
      description: '点击字段创建表间连接，用线条直观显示JOIN关系。支持多种连接类型。',
    },
    {
      icon: <CodeIcon className={classes.featureIcon} />,
      title: '自动生成SQL',
      description: '基于可视化设计自动生成优化的SQL查询语句，支持复杂的多表JOIN。',
    },
    {
      icon: <BuildIcon className={classes.featureIcon} />,
      title: '低代码体验',
      description: '无需手写复杂SQL，通过拖拽和点击即可完成数据库查询设计。',
    },
  ];

  const instructions = [
    '从左侧表格列表选择需要的表格',
    '拖拽表格到右侧画布区域',
    '表格会以卡片形式展示，显示所有字段信息',
    '点击表格字段开始创建连接',
    '再点击另一个表格的字段完成连接',
    '连接线会自动显示，标注JOIN类型',
    '点击"生成SQL"按钮查看自动生成的查询',
    '可以复制SQL代码或继续调整设计',
  ];

  if (showBuilder) {
    return (
      <div className={classes.builderContainer}>
        <VisualJoinBuilder
          connection={{
            name: "演示数据库",
            type: "mysql",
            host: "localhost",
            port: 3306,
            database: "demo_db"
          }}
          onBack={() => setShowBuilder(false)}
          onSave={(config) => {
            console.log('保存配置:', config);
          }}
        />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.header}>
        <Container maxWidth="lg">
          <div className={classes.headerContent}>
            <Typography variant="h2" component="h1" gutterBottom>
              可视化表格关联构建器
            </Typography>
            <Typography variant="h5" style={{ opacity: 0.9, marginBottom: 32 }}>
              拖拽式低代码数据库查询设计工具
            </Typography>
            <Button
              size="large"
              variant="contained"
              color="secondary"
              endIcon={<ArrowForward />}
              onClick={() => setShowBuilder(true)}
              style={{ 
                fontSize: '1.1rem',
                padding: '12px 32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              开始体验
            </Button>
          </div>
        </Container>
      </div>

      <Container maxWidth="lg">
        {/* Features Section */}
        <div className={classes.demoSection}>
          <Typography variant="h4" align="center" gutterBottom>
            功能特点
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            参考现代架构设计工具的交互体验，为数据库查询设计量身打造
          </Typography>
          
          <Grid container spacing={4} style={{ marginTop: 32 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className={classes.featureCard}>
                  <CardContent style={{ textAlign: 'center', flex: 1 }}>
                    {feature.icon}
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Instructions Section */}
        <div className={classes.demoSection}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 24 }}>
                <Typography variant="h5" gutterBottom>
                  使用说明
                </Typography>
                <List className={classes.instructionsList}>
                  {instructions.map((instruction, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${index + 1}. ${instruction}`}
                        />
                      </ListItem>
                      {index < instructions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 24 }}>
                <Typography variant="h5" gutterBottom>
                  设计理念
                </Typography>
                <Typography variant="body1" paragraph>
                  本工具参考了现代软件架构设计工具的交互体验，将复杂的SQL JOIN操作转化为直观的拖拽和连线操作。
                </Typography>
                <Typography variant="body1" paragraph>
                  用户可以像搭建积木一样构建数据查询逻辑，无需记忆复杂的SQL语法，大大降低了数据库查询的学习成本。
                </Typography>
                <Typography variant="body1" paragraph>
                  系统会根据表结构自动推荐连接关系，并生成优化的SQL查询语句，确保查询的性能和准确性。
                </Typography>
                <Box mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => setShowBuilder(true)}
                    endIcon={<BuildIcon />}
                  >
                    立即开始构建
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default VisualJoinBuilderDemo; 