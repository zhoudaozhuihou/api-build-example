import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
} from '@material-ui/core';
import {
  Storage as StorageIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Code as CodeIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import SearchDropdown from '../components/SearchDropdown';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  demoContainer: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.spacing(1),
  },
}));

// 模拟数据
const datasets = [
  { id: 1, title: '用户行为数据集', description: '电商平台用户行为轨迹数据', type: '结构化数据', size: '1.2 GB', status: '公开' },
  { id: 2, title: '商品评论情感分析', description: '商品评论文本及情感标签', type: '文本数据', size: '450 MB', status: '公开' },
  { id: 3, title: '销售趋势预测', description: '历史销售数据时间序列', type: '时间序列', size: '780 MB', status: '私有' },
  { id: 4, title: '产品图像识别', description: '标记好的产品图像数据集', type: '图像数据', size: '4.5 GB', status: '公开' },
];

const users = [
  { id: 1, name: '张三', description: '高级数据分析师', type: '管理员', status: '在线' },
  { id: 2, name: '李四', description: '机器学习工程师', type: '开发者', status: '离线' },
  { id: 3, name: '王五', description: '产品经理', type: '用户', status: '在线' },
];

const apis = [
  { id: 1, title: '用户认证API', description: '提供用户登录和注册功能', type: 'REST', size: 'v1.0', status: '稳定' },
  { id: 2, title: '数据分析API', description: '提供数据统计和分析功能', type: 'GraphQL', size: 'v2.1', status: '测试版' },
];

const SearchDropdownDemo = () => {
  const classes = useStyles();
  
  // 数据集搜索状态
  const [datasetQuery, setDatasetQuery] = useState('');
  const [datasetResults, setDatasetResults] = useState([]);
  const [datasetLoading, setDatasetLoading] = useState(false);
  
  // 用户搜索状态
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  
  // API搜索状态
  const [apiQuery, setApiQuery] = useState('');
  const [apiResults, setApiResults] = useState([]);

  // 数据集搜索处理
  const handleDatasetSearch = (event) => {
    const query = event.target.value;
    setDatasetQuery(query);
    setDatasetLoading(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      if (query.trim()) {
        const results = datasets.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        setDatasetResults(results);
      } else {
        setDatasetResults([]);
      }
      setDatasetLoading(false);
    }, 300);
  };

  const handleDatasetClear = () => {
    setDatasetQuery('');
    setDatasetResults([]);
  };

  // 用户搜索处理
  const handleUserSearch = (event) => {
    const query = event.target.value;
    setUserQuery(query);
    
    if (query.trim()) {
      const results = users.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setUserResults(results);
    } else {
      setUserResults([]);
    }
  };

  const handleUserClear = () => {
    setUserQuery('');
    setUserResults([]);
  };

  // API搜索处理
  const handleApiSearch = (event) => {
    const query = event.target.value;
    setApiQuery(query);
    
    if (query.trim()) {
      const results = apis.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setApiResults(results);
    } else {
      setApiResults([]);
    }
  };

  const handleApiClear = () => {
    setApiQuery('');
    setApiResults([]);
  };

  // 自定义用户结果渲染
  const renderUserItem = (user, index) => (
    <div key={user.id} style={{ 
      padding: '12px 16px', 
      borderBottom: '1px solid #eee',
      cursor: 'pointer',
      borderRadius: '8px',
      marginBottom: '4px',
      transition: 'background-color 0.2s'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    onClick={() => {
      alert(`选择了用户: ${user.name}`);
      handleUserClear();
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <PeopleIcon color="primary" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{user.name}</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>{user.description}</div>
          <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
            {user.type} • {user.status}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Typography variant="h3" className={classes.title}>
          SearchDropdown 组件演示
        </Typography>
        
        <Grid container spacing={4}>
          {/* 数据集搜索演示 */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.section}>
              <Typography variant="h5" className={classes.sectionTitle}>
                数据集搜索
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                使用默认样式的数据集搜索，支持加载状态和完整功能
              </Typography>
              <Box className={classes.demoContainer}>
                <SearchDropdown
                  searchQuery={datasetQuery}
                  onSearchChange={handleDatasetSearch}
                  onSearchClear={handleDatasetClear}
                  searchResults={datasetResults}
                  totalResults={datasetResults.length}
                  loading={datasetLoading}
                  placeholder="搜索数据集..."
                  maxDisplayResults={3}
                  onResultClick={(dataset) => alert(`选择了数据集: ${dataset.title}`)}
                  onViewAllResults={() => alert('打开完整搜索结果')}
                  resultIcon={StorageIcon}
                />
              </Box>
            </Paper>
          </Grid>

          {/* 用户搜索演示 */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.section}>
              <Typography variant="h5" className={classes.sectionTitle}>
                用户搜索（自定义渲染）
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                使用自定义渲染函数的用户搜索，展示不同的样式
              </Typography>
              <Box className={classes.demoContainer}>
                <SearchDropdown
                  searchQuery={userQuery}
                  onSearchChange={handleUserSearch}
                  onSearchClear={handleUserClear}
                  searchResults={userResults}
                  totalResults={userResults.length}
                  placeholder="搜索用户..."
                  maxDisplayResults={5}
                  renderResultItem={renderUserItem}
                  showViewAllButton={false}
                />
              </Box>
            </Paper>
          </Grid>

          {/* API搜索演示 */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.section}>
              <Typography variant="h5" className={classes.sectionTitle}>
                API搜索
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                简化版的API搜索，不显示"查看全部"按钮
              </Typography>
              <Box className={classes.demoContainer}>
                <SearchDropdown
                  searchQuery={apiQuery}
                  onSearchChange={handleApiSearch}
                  onSearchClear={handleApiClear}
                  searchResults={apiResults}
                  totalResults={apiResults.length}
                  placeholder="搜索API..."
                  maxDisplayResults={4}
                  onResultClick={(api) => alert(`选择了API: ${api.title}`)}
                  resultIcon={CodeIcon}
                  showViewAllButton={false}
                  clearOnSelect={true}
                />
              </Box>
            </Paper>
          </Grid>

          {/* 配置说明 */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.section}>
              <Typography variant="h5" className={classes.sectionTitle}>
                组件配置说明
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                SearchDropdown组件支持的主要属性：
              </Typography>
              <Box style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
                <div><strong>searchQuery:</strong> 搜索关键词</div>
                <div><strong>onSearchChange:</strong> 搜索输入变化处理函数</div>
                <div><strong>onSearchClear:</strong> 清除搜索处理函数</div>
                <div><strong>searchResults:</strong> 搜索结果数组</div>
                <div><strong>totalResults:</strong> 总结果数量</div>
                <div><strong>loading:</strong> 加载状态</div>
                <div><strong>placeholder:</strong> 搜索框占位文本</div>
                <div><strong>maxDisplayResults:</strong> 最大显示结果数</div>
                <div><strong>onResultClick:</strong> 点击结果项处理函数</div>
                <div><strong>onViewAllResults:</strong> 查看全部结果处理函数</div>
                <div><strong>renderResultItem:</strong> 自定义结果项渲染函数</div>
                <div><strong>resultIcon:</strong> 结果项图标组件</div>
                <div><strong>clearOnSelect:</strong> 选择后是否清除搜索</div>
                <div><strong>showViewAllButton:</strong> 是否显示查看全部按钮</div>
              </Box>
              
              <Button 
                variant="outlined" 
                color="primary" 
                style={{ marginTop: 16 }}
                onClick={() => window.open('/src/components/SearchDropdown.js')}
              >
                查看源代码
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default SearchDropdownDemo; 