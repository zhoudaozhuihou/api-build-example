import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Paper, Typography, Grid, Divider, 
  Card, CardContent, Box
} from '@material-ui/core';
import CategoryCascader from './CategoryCascader';
import LeafCategoryCascader from './LeafCategoryCascader';
import { apiCategories } from '../constants/apiCategories';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 1200,
    margin: '0 auto',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  demoContainer: {
    marginTop: theme.spacing(2),
  },
  selectedInfo: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  tipBox: {
    padding: theme.spacing(2),
    margin: `${theme.spacing(2)}px 0`,
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.contrastText,
    borderRadius: theme.shape.borderRadius,
  },
  featuresList: {
    paddingLeft: theme.spacing(3),
    '& li': {
      margin: theme.spacing(0.5, 0),
    },
  },
}));

export default function CategorySelectorDemo() {
  const classes = useStyles();
  const [standardSelected, setStandardSelected] = useState([]);
  const [leafSelected, setLeafSelected] = useState([]);

  // 标准选择器处理函数
  const handleStandardChange = (selected) => {
    console.log('标准选择器选择的分类:', selected);
    setStandardSelected(selected);
  };

  // 叶子节点选择器处理函数
  const handleLeafChange = (selected) => {
    console.log('叶子节点选择器选择的分类:', selected);
    setLeafSelected(selected);
  };

  // 格式化分类路径
  const formatCategoryPath = (category) => {
    // 根据分类id创建层级路径
    const parts = category.id.split('-');
    let path = '';
    
    // 使用apiCategories寻找完整路径
    const findPath = (categories, indices, currentIndex, currentPath) => {
      if (currentIndex >= indices.length) return currentPath;
      
      const targetIndex = indices[currentIndex] - 1; // 转换为0-based索引
      const targetCategory = categories[targetIndex];
      
      if (!targetCategory) return currentPath;
      
      const newPath = currentPath ? `${currentPath} > ${targetCategory.name}` : targetCategory.name;
      
      if (currentIndex === indices.length - 1) return newPath;
      
      return findPath(targetCategory.classifications || [], indices, currentIndex + 1, newPath);
    };
    
    return findPath(apiCategories, parts, 0, '');
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        API 分类选择器对比
      </Typography>
      
      <Box className={classes.tipBox}>
        <Typography variant="subtitle1" gutterBottom>
          优化滚动支持
        </Typography>
        <Typography variant="body2" paragraph>
          两种分类选择器现在都支持大量数据的滚动展示。您可以尝试浏览多级分类并观察以下特性：
        </Typography>
        <ul className={classes.featuresList}>
          <li>精心设计的滚动条样式，更易于拖动和定位</li>
          <li>更大的显示区域，可同时展示更多选项</li>
          <li>当点击父分类展开子分类时，自动滚动到子分类列表顶部</li>
          <li>多级分类数据的顺畅浏览体验</li>
          <li>更直观的分类说明和提示信息</li>
        </ul>
        <Typography variant="body2">
          每个分类列表最多可有 25+ 个项目，并支持垂直滚动，特别适合包含大量子分类的场景。
        </Typography>
      </Box>
      
      <Box className={classes.tipBox} style={{ backgroundColor: '#ffe0b2', color: '#bf360c' }}>
        <Typography variant="subtitle1" gutterBottom>
          数据结构更新
        </Typography>
        <Typography variant="body2">
          分类数据结构已更新为更复杂的格式，现在包含更多的字段和信息：
        </Typography>
        <ul className={classes.featuresList}>
          <li>value → id: 唯一标识符</li>
          <li>label → name: 分类名称</li>
          <li>children → classifications: 子分类列表</li>
          <li>新增了多个属性字段: parentId, sort, type, typeName, fields等</li>
        </ul>
        <Typography variant="body2">
          组件已经完全适配新的数据结构，同时保持了原有的操作体验。
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.sectionTitle}>
                标准分类选择器
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                支持选择任意级别的分类，包括父级分类和子级分类。选择父级分类时会自动选择所有子分类。
              </Typography>
              
              <CategoryCascader
                value={standardSelected}
                onChange={handleStandardChange}
                title="API 分类"
                placeholder="请选择 API 分类"
              />
              
              {standardSelected.length > 0 && (
                <Box className={classes.selectedInfo}>
                  <Typography variant="subtitle2" gutterBottom>
                    已选择 {standardSelected.length} 个分类:
                  </Typography>
                  {standardSelected.map((item) => (
                    <Typography key={item.id} variant="body2">
                      • {formatCategoryPath(item)}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.sectionTitle}>
                叶子节点分类选择器
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                只支持选择最后一级分类（叶子节点），父级分类只能用于导航，不能被选择。
              </Typography>
              
              <LeafCategoryCascader
                value={leafSelected}
                onChange={handleLeafChange}
                title="API 分类"
                placeholder="请选择 API 分类"
              />
              
              {leafSelected.length > 0 && (
                <Box className={classes.selectedInfo}>
                  <Typography variant="subtitle2" gutterBottom>
                    已选择 {leafSelected.length} 个分类:
                  </Typography>
                  {leafSelected.map((item) => (
                    <Typography key={item.id} variant="body2">
                      • {formatCategoryPath(item)}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Divider className={classes.divider} />
      
      <Typography variant="h6" className={classes.sectionTitle}>
        使用场景说明
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            标准分类选择器适用于:
          </Typography>
          <ul>
            <li>需要选择多个层级分类的场景</li>
            <li>希望一次性选择一个大分类及其所有子分类</li>
            <li>需要进行分层管理和精细控制</li>
            <li>分类数据结构复杂，需要快速批量选择</li>
          </ul>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            叶子节点分类选择器适用于:
          </Typography>
          <ul>
            <li>只关心最终分类，不需要中间层级的场景</li>
            <li>需要确保所有选择都是最具体的分类</li>
            <li>API的最终归类和标签管理</li>
            <li>避免选择不完整或过于宽泛的分类</li>
          </ul>
        </Grid>
      </Grid>
      
      <Box className={classes.tipBox} style={{ backgroundColor: '#4caf50', color: '#fff' }}>
        <Typography variant="subtitle1" gutterBottom>
          滚动优化性能提示
        </Typography>
        <Typography variant="body2">
          分类选择器组件已针对大量数据进行了性能优化，包括：
        </Typography>
        <ul className={classes.featuresList}>
          <li>仅渲染当前可见级别的分类数据，避免不必要的DOM节点</li>
          <li>使用React的引用功能对列表进行滚动控制，减少重渲染</li>
          <li>优化的滚动条样式和交互，提升用户体验</li>
          <li>合理的高度设置，确保在各种屏幕尺寸下都有良好表现</li>
        </ul>
      </Box>
    </Paper>
  );
} 