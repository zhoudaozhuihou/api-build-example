import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  GetApp as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  CloudDownload as CloudDownloadIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2, 3),
    position: 'relative',
    '& .MuiTypography-h6': {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      paddingRight: theme.spacing(6),
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.primary.contrastText,
  },
  dialogContent: {
    padding: 0,
    backgroundColor: theme.palette.background.default,
  },
  tabContent: {
    padding: theme.spacing(3),
    minHeight: 400,
    maxHeight: 600,
    overflow: 'auto',
  },
  infoCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  statItem: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  statNumber: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),
  },
  statLabel: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
  },
  sampleTable: {
    '& .MuiTableHead-root': {
      backgroundColor: theme.palette.background.default,
    },
    '& .MuiTableCell-head': {
      fontWeight: 600,
      fontSize: '0.9rem',
    },
    '& .MuiTableCell-body': {
      fontSize: '0.85rem',
    },
  },
  categoryChip: {
    margin: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
  },
  usageProgressCard: {
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    marginBottom: theme.spacing(2),
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
  },
  downloadStats: {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  userList: {
    maxHeight: 200,
    overflow: 'auto',
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dataset-tabpanel-${index}`}
      aria-labelledby={`dataset-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="tab-content">{children}</Box>}
    </div>
  );
}

const DatasetDetailDialog = ({ open, onClose, dataset }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!dataset) return null;

  // 确保dataset对象有所有必需的字段
  const safeDataset = {
    title: dataset.title || '未知数据集',
    description: dataset.description || '暂无描述',
    type: dataset.type || '未知类型',
    dataSize: dataset.dataSize || '未知大小',
    fileCount: dataset.fileCount || 0,
    updatedAt: dataset.updatedAt || '未知',
    status: dataset.status || 'private',
    owner: dataset.owner || '数据团队',
    categories: dataset.categories || [],
    ...dataset // 保留其他所有字段
  };

  // 模拟数据样本
  const getSampleData = () => {
    switch (safeDataset.type) {
      case '结构化数据':
        return [
          { id: '1001', user_id: 'user_12345', action: 'view', product_id: 'prod_789', timestamp: '2023-06-15 10:30:22' },
          { id: '1002', user_id: 'user_67890', action: 'purchase', product_id: 'prod_456', timestamp: '2023-06-15 11:15:33' },
          { id: '1003', user_id: 'user_11111', action: 'add_to_cart', product_id: 'prod_123', timestamp: '2023-06-15 12:20:11' },
          { id: '1004', user_id: 'user_22222', action: 'view', product_id: 'prod_789', timestamp: '2023-06-15 13:45:55' },
          { id: '1005', user_id: 'user_33333', action: 'favorite', product_id: 'prod_101', timestamp: '2023-06-15 14:30:40' },
        ];
      case '文本数据':
        return [
          { id: 1, review: '这个产品质量很好，推荐购买！', sentiment: '正面', confidence: 0.95 },
          { id: 2, review: '包装有些破损，但商品还不错', sentiment: '中性', confidence: 0.78 },
          { id: 3, review: '完全不符合描述，很失望', sentiment: '负面', confidence: 0.92 },
          { id: 4, review: '性价比很高，会再次购买', sentiment: '正面', confidence: 0.88 },
          { id: 5, review: '普通吧，没什么特别的', sentiment: '中性', confidence: 0.65 },
        ];
      case '时间序列':
        return [
          { date: '2023-01-01', sales: 125000, orders: 450, avg_order_value: 278 },
          { date: '2023-01-02', sales: 145000, orders: 520, avg_order_value: 279 },
          { date: '2023-01-03', sales: 132000, orders: 475, avg_order_value: 278 },
          { date: '2023-01-04', sales: 158000, orders: 580, avg_order_value: 272 },
          { date: '2023-01-05', sales: 167000, orders: 610, avg_order_value: 274 },
        ];
      default:
        return [];
    }
  };

  // 模拟使用统计数据
  const getUsageStats = () => ({
    totalDownloads: Math.floor(Math.random() * 1000) + 100,
    thisMonthDownloads: Math.floor(Math.random() * 100) + 10,
    activeUsers: Math.floor(Math.random() * 50) + 5,
    avgRating: (Math.random() * 2 + 3).toFixed(1),
    lastAccessed: '2023-06-14 15:30:00',
  });

  // 模拟用户列表
  const getRecentUsers = () => [
    { id: 1, name: '张小明', role: '数据分析师', department: '数据科学部', accessTime: '2023-06-15 09:30' },
    { id: 2, name: '李小红', role: '机器学习工程师', department: '算法部', accessTime: '2023-06-14 16:45' },
    { id: 3, name: '王小伟', role: '产品经理', department: '产品部', accessTime: '2023-06-14 14:20' },
    { id: 4, name: '赵小敏', role: '业务分析师', department: '业务部', accessTime: '2023-06-13 11:15' },
  ];

  const sampleData = getSampleData();
  const usageStats = getUsageStats();
  const recentUsers = getRecentUsers();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle className={classes.dialogTitle}>
        <StorageIcon style={{ marginRight: theme.spacing(1) }} />
        {safeDataset.title}
        <Button
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="基本信息" icon={<InfoIcon />} />
          <Tab label="数据样本" icon={<DescriptionIcon />} />
          <Tab label="统计信息" icon={<AssessmentIcon />} />
          <Tab label="使用情况" icon={<GroupIcon />} />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <div className={classes.tabContent}>
            {/* 基本信息 */}
            <Card className={classes.infoCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  数据集描述
                </Typography>
                <Typography variant="body1" paragraph>
                  {safeDataset.description}
                </Typography>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <div className={classes.metaInfo}>
                      <CategoryIcon />
                      <Typography variant="body2">
                        <strong>数据类型：</strong>{safeDataset.type}
                      </Typography>
                    </div>
                    <div className={classes.metaInfo}>
                      <StorageIcon />
                      <Typography variant="body2">
                        <strong>数据大小：</strong>{safeDataset.dataSize}
                      </Typography>
                    </div>
                    <div className={classes.metaInfo}>
                      <DescriptionIcon />
                      <Typography variant="body2">
                        <strong>文件数量：</strong>{safeDataset.fileCount} 个文件
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.metaInfo}>
                      <ScheduleIcon />
                      <Typography variant="body2">
                        <strong>最后更新：</strong>{safeDataset.updatedAt}
                      </Typography>
                    </div>
                    <div className={classes.metaInfo}>
                      <VisibilityIcon />
                      <Typography variant="body2">
                        <strong>访问权限：</strong>{safeDataset.status === 'public' ? '公开' : '私有'}
                      </Typography>
                    </div>
                    <div className={classes.metaInfo}>
                      <PersonIcon />
                      <Typography variant="body2">
                        <strong>创建者：</strong>{safeDataset.owner}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>

                <Divider style={{ margin: '16px 0' }} />

                <Typography variant="subtitle2" gutterBottom>
                  分类标签
                </Typography>
                <Box>
                  {safeDataset.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      className={classes.categoryChip}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudDownloadIcon />}
                className={classes.actionButton}
              >
                下载数据集
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShareIcon />}
                className={classes.actionButton}
              >
                分享数据集
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                className={classes.actionButton}
              >
                编辑信息
              </Button>
            </Box>
          </div>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <div className={classes.tabContent}>
            <Typography variant="h6" gutterBottom>
              数据样本预览
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              以下显示数据集的前几行数据样本，供您了解数据结构和内容
            </Typography>
            
            {sampleData.length > 0 && sampleData[0] ? (
              <TableContainer component={Paper} className={classes.sampleTable}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {Object.keys(sampleData[0]).map((key) => (
                        <TableCell key={key}>{key}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {typeof value === 'number' ? value.toLocaleString() : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                暂无数据样本预览
              </Typography>
            )}
          </div>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <div className={classes.tabContent}>
            <Typography variant="h6" gutterBottom>
              数据统计信息
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Card className={classes.statItem}>
                  <CardContent>
                    <div className={classes.statNumber}>{safeDataset.fileCount}</div>
                    <div className={classes.statLabel}>文件数量</div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card className={classes.statItem}>
                  <CardContent>
                    <div className={classes.statNumber}>{safeDataset.dataSize}</div>
                    <div className={classes.statLabel}>数据大小</div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card className={classes.statItem}>
                  <CardContent>
                    <div className={classes.statNumber}>{sampleData.length}K+</div>
                    <div className={classes.statLabel}>记录数量</div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card className={classes.statItem}>
                  <CardContent>
                    <div className={classes.statNumber}>{Object.keys(sampleData[0] || {}).length}</div>
                    <div className={classes.statLabel}>字段数量</div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                数据质量评估
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" style={{ minWidth: 120 }}>
                      完整性
                    </Typography>
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={95} color="primary" />
                    </Box>
                    <Typography variant="body2" color="textSecondary">95%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" style={{ minWidth: 120 }}>
                      一致性
                    </Typography>
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={88} color="primary" />
                    </Box>
                    <Typography variant="body2" color="textSecondary">88%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" style={{ minWidth: 120 }}>
                      准确性
                    </Typography>
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={92} color="secondary" />
                    </Box>
                    <Typography variant="body2" color="textSecondary">92%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" style={{ minWidth: 120 }}>
                      时效性
                    </Typography>
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={85} color="secondary" />
                    </Box>
                    <Typography variant="body2" color="textSecondary">85%</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </div>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <div className={classes.tabContent}>
            <Typography variant="h6" gutterBottom>
              使用情况统计
            </Typography>
            
            {/* 下载统计 */}
            <Card className={classes.usageProgressCard}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <div className={classes.statItem}>
                      <div className={classes.statNumber} style={{ color: 'inherit' }}>
                        {usageStats.totalDownloads}
                      </div>
                      <div className={classes.statLabel} style={{ color: 'inherit', opacity: 0.9 }}>
                        总下载次数
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.statItem}>
                      <div className={classes.statNumber} style={{ color: 'inherit' }}>
                        {usageStats.thisMonthDownloads}
                      </div>
                      <div className={classes.statLabel} style={{ color: 'inherit', opacity: 0.9 }}>
                        本月下载
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.statItem}>
                      <div className={classes.statNumber} style={{ color: 'inherit' }}>
                        {usageStats.activeUsers}
                      </div>
                      <div className={classes.statLabel} style={{ color: 'inherit', opacity: 0.9 }}>
                        活跃用户
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.statItem}>
                      <div className={classes.statNumber} style={{ color: 'inherit' }}>
                        {usageStats.avgRating}
                      </div>
                      <div className={classes.statLabel} style={{ color: 'inherit', opacity: 0.9 }}>
                        平均评分
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 最近访问用户 */}
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: 24 }}>
              最近访问用户
            </Typography>
            <Card>
              <List className={classes.userList}>
                {recentUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" style={{ fontWeight: 500 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.accessTime}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            {user.role} · {user.department}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DatasetDetailDialog; 