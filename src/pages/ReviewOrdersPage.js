import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent,
  LinearProgress
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Info as InfoIcon,
  Flag as FlagIcon,
  Comment as CommentIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon
} from '@material-ui/icons';

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
  searchBar: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  searchInput: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  filterButton: {
    marginRight: theme.spacing(1),
  },
  tabs: {
    marginBottom: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  statusCell: {
    width: 120,
  },
  actionCell: {
    width: 120,
    textAlign: 'right',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  submitterColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  pendingChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  approvedChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  rejectedChip: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  completedChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  failedChip: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  statusChip: {
    minWidth: 90,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  statisticsCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  statisticsValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statisticsLabel: {
    color: theme.palette.text.secondary,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  orderType: {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
    fontSize: '0.75rem',
    marginRight: theme.spacing(1),
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  datasetType: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
  },
  mainTabRoot: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

function ReviewOrdersPage() {
  const classes = useStyles();
  const theme = useTheme();
  const [mainTabValue, setMainTabValue] = useState(0);
  const [reviewTabValue, setReviewTabValue] = useState(0);
  const [orderTabValue, setOrderTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for review items
  const reviewItems = [
    { 
      id: 1, 
      name: 'API接口：用户认证服务', 
      type: 'API', 
      submitter: { name: '张三', avatar: 'Z' }, 
      submittedAt: '2023-06-15 10:30', 
      status: 'pending',
      urgent: true 
    },
    { 
      id: 2, 
      name: '数据集：商品评论情感分析', 
      type: 'Dataset', 
      submitter: { name: '李四', avatar: 'L' }, 
      submittedAt: '2023-06-14 16:45', 
      status: 'pending',
      urgent: false 
    },
    { 
      id: 3, 
      name: 'API接口：订单查询接口', 
      type: 'API', 
      submitter: { name: '王五', avatar: 'W' }, 
      submittedAt: '2023-06-14 11:20', 
      status: 'approved',
      urgent: false 
    },
    { 
      id: 4, 
      name: '数据集：用户画像数据', 
      type: 'Dataset', 
      submitter: { name: '赵六', avatar: 'Z' }, 
      submittedAt: '2023-06-13 15:30', 
      status: 'rejected',
      urgent: false 
    },
    { 
      id: 5, 
      name: 'API接口：支付回调接口', 
      type: 'API', 
      submitter: { name: '张三', avatar: 'Z' }, 
      submittedAt: '2023-06-13 09:10', 
      status: 'pending',
      urgent: true 
    }
  ];

  // Mock data for orders
  const orders = [
    { 
      id: 'ORD-20230615-001', 
      type: 'API', 
      name: '用户认证服务', 
      price: '¥1,500', 
      status: 'completed', 
      date: '2023-06-15',
      customer: '北京科技有限公司' 
    },
    { 
      id: 'ORD-20230614-023', 
      type: 'Dataset', 
      name: '商品评论情感分析数据集', 
      price: '¥3,200', 
      status: 'pending', 
      date: '2023-06-14',
      customer: '上海数据科技有限公司' 
    },
    { 
      id: 'ORD-20230613-015', 
      type: 'API', 
      name: '订单查询接口', 
      price: '¥900', 
      status: 'completed', 
      date: '2023-06-13',
      customer: '杭州互联网科技有限公司' 
    },
    { 
      id: 'ORD-20230612-008', 
      type: 'Dataset', 
      name: '用户画像数据', 
      price: '¥5,800', 
      status: 'failed', 
      date: '2023-06-12',
      customer: '深圳智能科技有限公司' 
    },
    { 
      id: 'ORD-20230611-042', 
      type: 'API', 
      name: '支付回调接口', 
      price: '¥1,200', 
      status: 'completed', 
      date: '2023-06-11',
      customer: '广州电商科技有限公司' 
    }
  ];

  // 过滤审核项
  const filteredReviews = reviewItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.submitter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReviews = filteredReviews.filter(item => item.status === 'pending');
  const approvedReviews = filteredReviews.filter(item => item.status === 'approved');
  const rejectedReviews = filteredReviews.filter(item => item.status === 'rejected');

  // 过滤订单
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
  const completedOrders = filteredOrders.filter(order => order.status === 'completed');
  const failedOrders = filteredOrders.filter(order => order.status === 'failed');

  // 事件处理
  const handleMainTabChange = (event, newValue) => {
    setMainTabValue(newValue);
  };

  const handleReviewTabChange = (event, newValue) => {
    setReviewTabValue(newValue);
  };

  const handleOrderTabChange = (event, newValue) => {
    setOrderTabValue(newValue);
  };
  
  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 获取状态标签
  const getReviewStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip 
          label="已通过" 
          size="small" 
          className={classes.approvedChip}
        />;
      case 'rejected':
        return <Chip 
          label="已拒绝" 
          size="small" 
          className={classes.rejectedChip}
        />;
      case 'pending':
      default:
        return <Chip 
          label="待审核" 
          size="small" 
          className={classes.pendingChip}
        />;
    }
  };

  const getOrderStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip 
          label="已完成" 
          size="small" 
          className={`${classes.statusChip} ${classes.completedChip}`}
          icon={<CheckIcon style={{ fontSize: '0.75rem' }} />}
        />;
      case 'pending':
        return <Chip 
          label="处理中" 
          size="small" 
          className={`${classes.statusChip} ${classes.pendingChip}`}
          icon={<RefreshIcon style={{ fontSize: '0.75rem' }} />}
        />;
      case 'failed':
        return <Chip 
          label="失败" 
          size="small" 
          className={`${classes.statusChip} ${classes.failedChip}`}
          icon={<RejectIcon style={{ fontSize: '0.75rem' }} />}
        />;
      default:
        return <Chip 
          label="未知" 
          size="small" 
          className={classes.statusChip}
        />;
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.searchBar}>
        <TextField
          className={classes.searchInput}
          variant="outlined"
          placeholder="搜索API、数据集、订单..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          className={classes.filterButton}
        >
          筛选
        </Button>
      </div>

      {/* 主选项卡 */}
      <Box className={classes.mainTabRoot}>
        <Tabs 
          value={mainTabValue} 
          onChange={handleMainTabChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="main tabs"
        >
          <Tab label="API管理" id="main-tab-0" aria-controls="main-tabpanel-0" />
          <Tab label="数据集管理" id="main-tab-1" aria-controls="main-tabpanel-1" />
          <Tab label="订阅与交付" id="main-tab-2" aria-controls="main-tabpanel-2" />
          <Tab label="概览" id="main-tab-3" aria-controls="main-tabpanel-3" />
        </Tabs>
      </Box>

      {/* API管理面板 */}
      <TabPanel value={mainTabValue} index={0}>
        <Tabs
          value={reviewTabValue}
          onChange={handleReviewTabChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label={`待审核API (${pendingReviews.filter(r => r.type === 'API').length})`} {...a11yProps(0)} />
          <Tab label={`已上线API (${approvedReviews.filter(r => r.type === 'API').length})`} {...a11yProps(1)} />
          <Tab label={`API订阅 (${orders.filter(o => o.type === 'API').length})`} {...a11yProps(2)} />
        </Tabs>

        <TabPanel value={reviewTabValue} index={0}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>API名称</TableCell>
                  <TableCell>提交人</TableCell>
                  <TableCell>提交时间</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingReviews.filter(item => item.type === 'API').map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.urgent && (
                        <Chip 
                          size="small" 
                          label="紧急" 
                          className={classes.urgentBadge}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      {item.name}
                    </TableCell>
                    <TableCell className={classes.submitterColumn}>
                      <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                      {item.submitter.name}
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell>
                      {getReviewStatusChip(item.status)}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" className={classes.actionButton}>
                        审核
                      </Button>
                      <IconButton size="small" title="更多操作" onClick={(e) => handleMenuOpen(e, item.id)}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingReviews.filter(item => item.type === 'API').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: '2rem' }}>
                      没有待审核的API
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={reviewTabValue} index={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>API名称</TableCell>
                  <TableCell>所有者</TableCell>
                  <TableCell>上线时间</TableCell>
                  <TableCell>版本</TableCell>
                  <TableCell>订阅数</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedReviews.filter(item => item.type === 'API').map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className={classes.submitterColumn}>
                      <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                      {item.submitter.name}
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell>v1.0</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" className={classes.actionButton}>
                        查看订阅
                      </Button>
                      <IconButton size="small" title="更多操作" onClick={(e) => handleMenuOpen(e, item.id)}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {approvedReviews.filter(item => item.type === 'API').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '2rem' }}>
                      没有已上线的API
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={reviewTabValue} index={2}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>API名称</TableCell>
                  <TableCell>客户</TableCell>
                  <TableCell>价格</TableCell>
                  <TableCell>订阅日期</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.filter(order => order.type === 'API').map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{getOrderStatusChip(order.status)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" className={classes.actionButton}>
                        处理
                      </Button>
                      <IconButton size="small" title="更多操作" onClick={(e) => handleMenuOpen(e, order.id)}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.filter(order => order.type === 'API').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ padding: '2rem' }}>
                      没有API订阅订单
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabPanel>

      {/* 数据集管理面板 */}
      <TabPanel value={mainTabValue} index={1}>
        <Tabs
          value={orderTabValue}
          onChange={handleOrderTabChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label={`待审核数据集 (${pendingReviews.filter(r => r.type === 'Dataset').length})`} {...a11yProps(0)} />
          <Tab label={`已发布数据集 (${approvedReviews.filter(r => r.type === 'Dataset').length})`} {...a11yProps(1)} />
          <Tab label={`数据集订阅 (${orders.filter(o => o.type === 'Dataset').length})`} {...a11yProps(2)} />
        </Tabs>

        <TabPanel value={orderTabValue} index={0}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>数据集名称</TableCell>
                  <TableCell>提交人</TableCell>
                  <TableCell>提交时间</TableCell>
                  <TableCell>格式</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingReviews.filter(item => item.type === 'Dataset').map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.urgent && (
                        <Chip 
                          size="small" 
                          label="紧急" 
                          className={classes.urgentBadge}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      {item.name}
                    </TableCell>
                    <TableCell className={classes.submitterColumn}>
                      <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                      {item.submitter.name}
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell>JSON</TableCell>
                    <TableCell>
                      {getReviewStatusChip(item.status)}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" className={classes.actionButton}>
                        审核
                      </Button>
                      <IconButton size="small" title="更多操作" onClick={(e) => handleMenuOpen(e, item.id)}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingReviews.filter(item => item.type === 'Dataset').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '2rem' }}>
                      没有待审核的数据集
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={orderTabValue} index={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>数据集名称</TableCell>
                  <TableCell>所有者</TableCell>
                  <TableCell>发布时间</TableCell>
                  <TableCell>格式</TableCell>
                  <TableCell>API数量</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedReviews.filter(item => item.type === 'Dataset').map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className={classes.submitterColumn}>
                      <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                      {item.submitter.name}
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell>JSON</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" className={classes.actionButton}>
                        关联API
                      </Button>
                      <IconButton size="small" title="更多操作" onClick={(e) => handleMenuOpen(e, item.id)}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {approvedReviews.filter(item => item.type === 'Dataset').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '2rem' }}>
                      没有已发布的数据集
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={orderTabValue} index={2}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>数据集名称</TableCell>
                  <TableCell>客户</TableCell>
                  <TableCell>价格</TableCell>
                  <TableCell>订阅日期</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.filter(order => order.type === 'Dataset').map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{getOrderStatusChip(order.status)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" className={classes.actionButton}>
                        处理
                      </Button>
                      <IconButton size="small" title="更多操作" onClick={(e) => handleMenuOpen(e, order.id)}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.filter(order => order.type === 'Dataset').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ padding: '2rem' }}>
                      没有数据集订阅订单
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabPanel>

      {/* 订阅与交付面板 */}
      <TabPanel value={mainTabValue} index={2}>
        <Grid container spacing={3} style={{ marginBottom: theme.spacing(3) }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>审批工作流</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box flex={1} mr={1}>
                    <Typography variant="body2" color="textSecondary">API审核请求</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(approvedReviews.filter(r => r.type === 'API').length / (pendingReviews.filter(r => r.type === 'API').length + approvedReviews.filter(r => r.type === 'API').length + rejectedReviews.filter(r => r.type === 'API').length)) * 100} 
                      style={{ height: 8, borderRadius: 4, marginTop: 4 }}
                    />
                  </Box>
                  <Typography variant="h6">{approvedReviews.filter(r => r.type === 'API').length}/{pendingReviews.filter(r => r.type === 'API').length + approvedReviews.filter(r => r.type === 'API').length + rejectedReviews.filter(r => r.type === 'API').length}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box flex={1} mr={1}>
                    <Typography variant="body2" color="textSecondary">数据集审核请求</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(approvedReviews.filter(r => r.type === 'Dataset').length / (pendingReviews.filter(r => r.type === 'Dataset').length + approvedReviews.filter(r => r.type === 'Dataset').length + rejectedReviews.filter(r => r.type === 'Dataset').length || 1)) * 100} 
                      style={{ height: 8, borderRadius: 4, marginTop: 4 }}
                    />
                  </Box>
                  <Typography variant="h6">{approvedReviews.filter(r => r.type === 'Dataset').length}/{pendingReviews.filter(r => r.type === 'Dataset').length + approvedReviews.filter(r => r.type === 'Dataset').length + rejectedReviews.filter(r => r.type === 'Dataset').length}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>订单处理</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box flex={1} mr={1}>
                    <Typography variant="body2" color="textSecondary">API订阅订单</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(completedOrders.filter(o => o.type === 'API').length / orders.filter(o => o.type === 'API').length || 1) * 100} 
                      style={{ height: 8, borderRadius: 4, marginTop: 4 }}
                    />
                  </Box>
                  <Typography variant="h6">{completedOrders.filter(o => o.type === 'API').length}/{orders.filter(o => o.type === 'API').length}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box flex={1} mr={1}>
                    <Typography variant="body2" color="textSecondary">数据集订阅订单</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(completedOrders.filter(o => o.type === 'Dataset').length / orders.filter(o => o.type === 'Dataset').length || 1) * 100} 
                      style={{ height: 8, borderRadius: 4, marginTop: 4 }}
                    />
                  </Box>
                  <Typography variant="h6">{completedOrders.filter(o => o.type === 'Dataset').length}/{orders.filter(o => o.type === 'Dataset').length}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>订单号</TableCell>
                <TableCell>产品名称</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>客户</TableCell>
                <TableCell>提交日期</TableCell>
                <TableCell>状态</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>
                    <span className={`${classes.orderType} ${order.type === 'Dataset' ? classes.datasetType : ''}`}>
                      {order.type}
                    </span>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{getOrderStatusChip(order.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" className={classes.actionButton} title="查看详情">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                    {order.status === 'pending' && (
                      <Button size="small" color="primary">处理</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* 概览面板 */}
      <TabPanel value={mainTabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statisticsCard}>
              <CardContent className={classes.statisticsCard}>
                <ApproveIcon className={classes.cardIcon} style={{ color: '#4caf50' }} />
                <Typography variant="h5" className={classes.statisticsValue}>
                  {approvedReviews.length}
                </Typography>
                <Typography variant="body2" className={classes.statisticsLabel}>
                  已审核通过
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statisticsCard}>
              <CardContent className={classes.statisticsCard}>
                <FlagIcon className={classes.cardIcon} style={{ color: '#ff9800' }} />
                <Typography variant="h5" className={classes.statisticsValue}>
                  {pendingReviews.length}
                </Typography>
                <Typography variant="body2" className={classes.statisticsLabel}>
                  待处理请求
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statisticsCard}>
              <CardContent className={classes.statisticsCard}>
                <ReceiptIcon className={classes.cardIcon} style={{ color: '#2196f3' }} />
                <Typography variant="h5" className={classes.statisticsValue}>
                  {orders.length}
                </Typography>
                <Typography variant="body2" className={classes.statisticsLabel}>
                  总订单数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statisticsCard}>
              <CardContent className={classes.statisticsCard}>
                <MoneyIcon className={classes.cardIcon} style={{ color: '#4caf50' }} />
                <Typography variant="h5" className={classes.statisticsValue}>
                  ¥{completedOrders.reduce((sum, order) => sum + parseInt(order.price.replace(/[^\d]/g, '')), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" className={classes.statisticsLabel}>
                  订单收入
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>待处理请求分布</Typography>
                <Box height={240} display="flex" alignItems="flex-end" mt={2}>
                  <Box flex={1} height={`${(pendingReviews.filter(item => item.type === 'API').length / pendingReviews.length || 0.5) * 100}%`} bgcolor="#2196f3" mx={1} borderRadius="4px 4px 0 0" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center" p={1}>
                    <Typography variant="h6" style={{ color: 'white' }}>{pendingReviews.filter(item => item.type === 'API').length}</Typography>
                    <Typography variant="body2" style={{ color: 'white' }}>API</Typography>
                  </Box>
                  <Box flex={1} height={`${(pendingReviews.filter(item => item.type === 'Dataset').length / pendingReviews.length || 0.5) * 100}%`} bgcolor="#4caf50" mx={1} borderRadius="4px 4px 0 0" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center" p={1}>
                    <Typography variant="h6" style={{ color: 'white' }}>{pendingReviews.filter(item => item.type === 'Dataset').length}</Typography>
                    <Typography variant="body2" style={{ color: 'white' }}>数据集</Typography>
                  </Box>
                  <Box flex={1} height={`${(pendingOrders.filter(order => order.type === 'API').length / pendingOrders.length || 0.5) * 100}%`} bgcolor="#ff9800" mx={1} borderRadius="4px 4px 0 0" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center" p={1}>
                    <Typography variant="h6" style={{ color: 'white' }}>{pendingOrders.filter(order => order.type === 'API').length}</Typography>
                    <Typography variant="body2" style={{ color: 'white' }}>API订单</Typography>
                  </Box>
                  <Box flex={1} height={`${(pendingOrders.filter(order => order.type === 'Dataset').length / pendingOrders.length || 0.5) * 100}%`} bgcolor="#9c27b0" mx={1} borderRadius="4px 4px 0 0" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center" p={1}>
                    <Typography variant="h6" style={{ color: 'white' }}>{pendingOrders.filter(order => order.type === 'Dataset').length}</Typography>
                    <Typography variant="body2" style={{ color: 'white' }}>数据集订单</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>紧急请求</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>名称</TableCell>
                        <TableCell>类型</TableCell>
                        <TableCell>提交时间</TableCell>
                        <TableCell align="right">操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingReviews.filter(item => item.urgent).map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.submittedAt}</TableCell>
                          <TableCell align="right">
                            <Button size="small" color="primary">处理</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {pendingReviews.filter(item => item.urgent).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">没有紧急请求</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>最近处理的订单</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>订单号</TableCell>
                        <TableCell>名称</TableCell>
                        <TableCell>客户</TableCell>
                        <TableCell>状态</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {completedOrders.slice(0, 5).map(order => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.name}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{getOrderStatusChip(order.status)}</TableCell>
                        </TableRow>
                      ))}
                      {completedOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">没有已完成的订单</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 菜单 */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>查看详情</MenuItem>
        <MenuItem onClick={handleMenuClose}>转发给管理员</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>添加备注</MenuItem>
      </Menu>
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default ReviewOrdersPage; 