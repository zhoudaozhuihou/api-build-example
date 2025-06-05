import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Search as SearchIcon,
  Storage as StorageIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Language as LanguageIcon,
  Image as ImageIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import DatasetGlobalSearch from '../components/DatasetGlobalSearch';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  subtitle: {
    color: theme.palette.text.secondary,
    maxWidth: 600,
    margin: '0 auto',
  },
  searchSection: {
    marginBottom: theme.spacing(4),
  },
  resultSection: {
    marginTop: theme.spacing(3),
  },
  resultCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[6],
    },
  },
  resultTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  resultDescription: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  resultMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  resultChips: {
    display: 'flex',
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
  },
  chip: {
    fontSize: '0.75rem',
    height: 24,
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  demoSection: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
  },
  demoTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  demoList: {
    marginBottom: theme.spacing(2),
  },
  demoButton: {
    margin: theme.spacing(0.5),
  },
  statsCard: {
    padding: theme.spacing(2),
    textAlign: 'center',
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  statsNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statsLabel: {
    fontSize: '0.875rem',
    opacity: 0.9,
  },
}));

const DatasetSearchDemo = () => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState(null);

  // 模拟数据集
  const mockDatasets = [
    {
      id: 1,
      title: '用户行为数据集',
      description: '电商平台用户行为轨迹数据，包含浏览、收藏、购物车、购买等行为数据，适用于用户画像分析和推荐系统开发',
      type: '结构化数据',
      dataSize: '1.2 GB',
      fileCount: 5,
      status: 'public',
      popularity: 120,
      categories: ['用户行为', '电子商务', '推荐系统'],
      category: '用户服务',
      subCategory: '用户行为',
      updatedAt: '2023-06-15',
      author: 'data_scientist'
    },
    {
      id: 2,
      title: '商品评论情感分析数据集',
      description: '电商平台商品评论文本及情感标签，包含正面、负面、中性评论，适用于情感分析和文本分类任务',
      type: '文本数据',
      dataSize: '450 MB',
      fileCount: 3,
      status: 'public',
      popularity: 85,
      categories: ['自然语言处理', '情感分析', '文本分类'],
      category: '产品相关',
      subCategory: '评论数据',
      updatedAt: '2023-05-22',
      author: 'nlp_expert'
    },
    {
      id: 3,
      title: '销售趋势预测数据集',
      description: '历史销售数据，包含季度、月度、周度销售趋势，可用于时间序列分析和销售预测建模',
      type: '时间序列',
      dataSize: '780 MB',
      fileCount: 8,
      status: 'private',
      popularity: 65,
      categories: ['时间序列分析', '预测建模', '销售分析'],
      category: '数据分析',
      subCategory: '销售报表',
      updatedAt: '2023-06-02',
      author: 'business_analyst'
    },
    {
      id: 4,
      title: '产品图像识别数据集',
      description: '标记好的产品图像数据集，包含多种商品类别，适用于计算机视觉和图像分类任务',
      type: '图像数据',
      dataSize: '4.5 GB',
      fileCount: 12,
      status: 'public',
      popularity: 210,
      categories: ['计算机视觉', '图像分类', '深度学习'],
      category: '产品相关',
      subCategory: '产品图片',
      updatedAt: '2023-04-18',
      author: 'cv_engineer'
    },
    {
      id: 5,
      title: '客户信用风险评估数据',
      description: '金融客户信用数据及风险评级，包含客户基础信息、交易记录、信用历史，适用于风险建模',
      type: '结构化数据',
      dataSize: '350 MB',
      fileCount: 4,
      status: 'private',
      popularity: 45,
      categories: ['金融', '风险评估', '机器学习'],
      category: '金融服务',
      subCategory: '风险评估',
      updatedAt: '2023-05-30',
      author: 'risk_analyst'
    },
    {
      id: 6,
      title: '用户推荐系统数据',
      description: '用户-物品交互数据，包含用户行为、商品属性、交互记录，适用于推荐系统训练和评估',
      type: '结构化数据',
      dataSize: '2.3 GB',
      fileCount: 6,
      status: 'public',
      popularity: 155,
      categories: ['推荐系统', '协同过滤', '机器学习'],
      category: '用户服务',
      subCategory: '个性化推荐',
      updatedAt: '2023-06-10',
      author: 'ml_engineer'
    },
    {
      id: 7,
      title: '智能客服对话数据集',
      description: '客服对话记录及意图标注，包含常见问题分类、情感标注，适用于对话系统和智能客服开发',
      type: '文本数据',
      dataSize: '680 MB',
      fileCount: 7,
      status: 'public',
      popularity: 92,
      categories: ['自然语言处理', '对话系统', '客服'],
      category: '客户服务',
      subCategory: '智能客服',
      updatedAt: '2023-06-08',
      author: 'chatbot_dev'
    },
    {
      id: 8,
      title: '网络流量异常检测数据',
      description: '网络流量监控数据，包含正常流量和异常流量模式，适用于网络安全和异常检测研究',
      type: '时间序列',
      dataSize: '1.8 GB',
      fileCount: 10,
      status: 'private',
      popularity: 73,
      categories: ['网络安全', '异常检测', '监控'],
      category: '安全相关',
      subCategory: '网络监控',
      updatedAt: '2023-05-25',
      author: 'security_expert'
    }
  ];

  // 处理搜索
  const handleSearch = async (searchParams) => {
    setSearchLoading(true);
    setLastSearchParams(searchParams);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let results = [...mockDatasets];
      
      // 基本搜索
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        
        if (searchParams.scope.includes('all')) {
          // 全字段搜索
          results = results.filter(dataset => 
            dataset.title.toLowerCase().includes(query) || 
            dataset.description.toLowerCase().includes(query) ||
            dataset.type.toLowerCase().includes(query) ||
            (dataset.categories && dataset.categories.some(cat => cat.toLowerCase().includes(query))) ||
            (dataset.category && dataset.category.toLowerCase().includes(query)) ||
            (dataset.subCategory && dataset.subCategory.toLowerCase().includes(query)) ||
            (dataset.author && dataset.author.toLowerCase().includes(query))
          );
        } else {
          // 指定字段搜索
          results = results.filter(dataset => {
            return searchParams.scope.some(scope => {
              switch (scope) {
                case 'title':
                  return dataset.title.toLowerCase().includes(query);
                case 'description':
                  return dataset.description.toLowerCase().includes(query);
                case 'categories':
                  return dataset.categories && dataset.categories.some(cat => cat.toLowerCase().includes(query));
                case 'tags':
                  return dataset.categories && dataset.categories.some(cat => cat.toLowerCase().includes(query));
                case 'author':
                  return dataset.author && dataset.author.toLowerCase().includes(query);
                default:
                  return false;
              }
            });
          });
        }
      }
      
      // 快速筛选
      if (searchParams.filters.type) {
        const typeMap = {
          'structured': '结构化数据',
          'text': '文本数据',
          'image': '图像数据',
          'timeseries': '时间序列'
        };
        const targetType = typeMap[searchParams.filters.type];
        if (targetType) {
          results = results.filter(dataset => dataset.type === targetType);
        }
      }
      
      if (searchParams.filters.status) {
        results = results.filter(dataset => dataset.status === searchParams.filters.status);
      }
      
      if (searchParams.filters.size) {
        results = results.filter(dataset => {
          const sizeInMB = parseSizeToMB(dataset.dataSize);
          switch (searchParams.filters.size) {
            case 'small':
              return sizeInMB < 100;
            case 'medium':
              return sizeInMB >= 100 && sizeInMB <= 1024;
            case 'large':
              return sizeInMB > 1024;
            default:
              return true;
          }
        });
      }
      
      if (searchParams.filters.popularity) {
        if (searchParams.filters.popularity === 'hot') {
          results = results.filter(dataset => dataset.popularity > 100);
        } else if (searchParams.filters.popularity === 'new') {
          results = results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
      }
      
      // 高级筛选
      if (searchParams.advanced.title) {
        const titleQuery = searchParams.advanced.title.toLowerCase();
        results = results.filter(dataset => dataset.title.toLowerCase().includes(titleQuery));
      }
      
      if (searchParams.advanced.description) {
        const descQuery = searchParams.advanced.description.toLowerCase();
        results = results.filter(dataset => dataset.description.toLowerCase().includes(descQuery));
      }
      
      if (searchParams.advanced.author) {
        const authorQuery = searchParams.advanced.author.toLowerCase();
        results = results.filter(dataset => dataset.author && dataset.author.toLowerCase().includes(authorQuery));
      }
      
      if (searchParams.advanced.dateRange.start || searchParams.advanced.dateRange.end) {
        const startDate = searchParams.advanced.dateRange.start ? new Date(searchParams.advanced.dateRange.start) : null;
        const endDate = searchParams.advanced.dateRange.end ? new Date(searchParams.advanced.dateRange.end) : null;
        
        results = results.filter(dataset => {
          const datasetDate = new Date(dataset.updatedAt);
          return (!startDate || datasetDate >= startDate) && (!endDate || datasetDate <= endDate);
        });
      }
      
      setSearchResults(results);
      setTotalResults(results.length);
      
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setSearchLoading(false);
    }
  };

  // 解析数据大小
  const parseSizeToMB = (sizeStr) => {
    const match = sizeStr.match(/^([\d.]+)\s*(MB|GB)$/);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit === 'GB' ? value * 1024 : value;
  };

  // 获取类型图标
  const getTypeIcon = (type) => {
    switch (type) {
      case '结构化数据':
        return <StorageIcon fontSize="small" />;
      case '文本数据':
        return <LanguageIcon fontSize="small" />;
      case '图像数据':
        return <ImageIcon fontSize="small" />;
      case '时间序列':
        return <TimelineIcon fontSize="small" />;
      default:
        return <StorageIcon fontSize="small" />;
    }
  };

  // 演示搜索示例
  const demoSearches = [
    { label: '搜索"用户行为"', params: { query: '用户行为', scope: ['all'], filters: {}, advanced: {} } },
    { label: '筛选文本数据', params: { query: '', scope: ['all'], filters: { type: 'text' }, advanced: {} } },
    { label: '查找公开数据集', params: { query: '', scope: ['all'], filters: { status: 'public' }, advanced: {} } },
    { label: '热门数据集', params: { query: '', scope: ['all'], filters: { popularity: 'hot' }, advanced: {} } },
    { label: '搜索推荐系统', params: { query: '推荐系统', scope: ['categories'], filters: {}, advanced: {} } },
    { label: '查找机器学习相关', params: { query: '机器学习', scope: ['all'], filters: {}, advanced: {} } },
  ];

  const handleDemoSearch = (params) => {
    handleSearch(params);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        {/* 页面标题 */}
        <Box className={classes.header}>
          <Typography variant="h3" className={classes.title}>
            数据集全局搜索演示
          </Typography>
          <Typography variant="h6" className={classes.subtitle}>
            体验强大的数据集搜索功能，支持全文搜索、字段筛选、高级查询和智能建议
          </Typography>
        </Box>

        {/* 搜索统计 */}
        <Grid container spacing={3} style={{ marginBottom: 32 }}>
          <Grid item xs={12} sm={3}>
            <Card className={classes.statsCard}>
              <Box className={classes.statsNumber}>{mockDatasets.length}</Box>
              <Box className={classes.statsLabel}>总数据集</Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className={classes.statsCard}>
              <Box className={classes.statsNumber}>{mockDatasets.filter(d => d.status === 'public').length}</Box>
              <Box className={classes.statsLabel}>公开数据集</Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className={classes.statsCard}>
              <Box className={classes.statsNumber}>{[...new Set(mockDatasets.flatMap(d => d.categories))].length}</Box>
              <Box className={classes.statsLabel}>数据分类</Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className={classes.statsCard}>
              <Box className={classes.statsNumber}>{totalResults}</Box>
              <Box className={classes.statsLabel}>搜索结果</Box>
            </Card>
          </Grid>
        </Grid>

        {/* 搜索组件 */}
        <Paper className={classes.searchSection} elevation={3}>
          <DatasetGlobalSearch
            onSearch={handleSearch}
            datasets={mockDatasets}
            loading={searchLoading}
            searchResults={searchResults}
            totalResults={totalResults}
          />
        </Paper>

        {/* 快速演示 */}
        <Paper className={classes.demoSection}>
          <Typography variant="h6" className={classes.demoTitle}>
            快速演示 - 点击体验不同搜索场景
          </Typography>
          <Box>
            {demoSearches.map((demo, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                className={classes.demoButton}
                onClick={() => handleDemoSearch(demo.params)}
                startIcon={<SearchIcon />}
              >
                {demo.label}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* 搜索结果 */}
        <Box className={classes.resultSection}>
          {lastSearchParams && (
            <Alert severity="info" style={{ marginBottom: 16 }}>
              搜索参数: {JSON.stringify(lastSearchParams, null, 2)}
            </Alert>
          )}
          
          {searchResults.length > 0 ? (
            <Grid container spacing={3}>
              {searchResults.map((dataset) => (
                <Grid item xs={12} md={6} key={dataset.id}>
                  <Card className={classes.resultCard} elevation={2}>
                    <CardContent>
                      <Typography variant="h6" className={classes.resultTitle}>
                        {dataset.title}
                      </Typography>
                      
                      <Typography variant="body2" className={classes.resultDescription}>
                        {dataset.description}
                      </Typography>
                      
                      <Box className={classes.resultMeta}>
                        {getTypeIcon(dataset.type)}
                        <Typography variant="caption">{dataset.type}</Typography>
                        <Divider orientation="vertical" flexItem style={{ margin: '0 8px' }} />
                        {dataset.status === 'public' ? <PublicIcon fontSize="small" /> : <PrivateIcon fontSize="small" />}
                        <Typography variant="caption">{dataset.status === 'public' ? '公开' : '私有'}</Typography>
                        <Divider orientation="vertical" flexItem style={{ margin: '0 8px' }} />
                        <StarIcon fontSize="small" />
                        <Typography variant="caption">{dataset.popularity}</Typography>
                        <Divider orientation="vertical" flexItem style={{ margin: '0 8px' }} />
                        <StorageIcon fontSize="small" />
                        <Typography variant="caption">{dataset.dataSize}</Typography>
                      </Box>
                      
                      <Box className={classes.resultChips}>
                        {dataset.categories.map((category, index) => (
                          <Chip
                            key={index}
                            label={category}
                            size="small"
                            className={classes.chip}
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                      
                      <Box style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="textSecondary">
                          作者: {dataset.author}
                        </Typography>
                        <Divider orientation="vertical" flexItem style={{ margin: '0 8px' }} />
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="textSecondary">
                          更新: {dataset.updatedAt}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : lastSearchParams ? (
            <Box className={classes.noResults}>
              <SearchIcon style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }} />
              <Typography variant="h6">未找到匹配的数据集</Typography>
              <Typography variant="body2">
                请尝试调整搜索条件或使用不同的关键词
              </Typography>
            </Box>
          ) : (
            <Box className={classes.noResults}>
              <SearchIcon style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }} />
              <Typography variant="h6">开始搜索数据集</Typography>
              <Typography variant="body2">
                在上方搜索框中输入关键词，或点击快速演示按钮体验搜索功能
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default DatasetSearchDemo;