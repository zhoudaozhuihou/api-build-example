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
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
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
  tabs: {
    marginBottom: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  statusChip: {
    minWidth: 90,
  },
  successChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  pendingChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  failedChip: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  cardLabel: {
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
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `order-tab-${index}`,
    'aria-controls': `order-tabpanel-${index}`,
  };
}

const OrderCenterPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    },
    { 
      id: 'ORD-20230610-037', 
      type: 'API', 
      name: '用户信息查询', 
      price: '¥800', 
      status: 'pending', 
      date: '2023-06-10',
      customer: '北京科技有限公司' 
    }
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
  const completedOrders = filteredOrders.filter(order => order.status === 'completed');
  const failedOrders = filteredOrders.filter(order => order.status === 'failed');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip 
          label="已完成" 
          size="small" 
          className={`${classes.statusChip} ${classes.successChip}`}
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
          icon={<CancelIcon style={{ fontSize: '0.75rem' }} />}
        />;
      default:
        return <Chip label="未知" size="small" />;
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.header}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" className={classes.pageTitle}>
                订单中心
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                管理API和数据集订单
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ReceiptIcon />}
              >
                导出订单
              </Button>
            </Grid>
          </Grid>
        </div>

        {/* 订单统计 */}
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card} elevation={1}>
              <CardContent className={classes.cardContent}>
                <MoneyIcon className={classes.cardIcon} />
                <Typography className={classes.cardValue} color="primary">
                  ¥13,400
                </Typography>
                <Typography className={classes.cardLabel}>
                  总收入
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card} elevation={1}>
              <CardContent className={classes.cardContent}>
                <ReceiptIcon className={classes.cardIcon} />
                <Typography className={classes.cardValue}>
                  {orders.length}
                </Typography>
                <Typography className={classes.cardLabel}>
                  总订单数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card} elevation={1}>
              <CardContent className={classes.cardContent}>
                <AssignmentIcon className={classes.cardIcon} />
                <Typography className={classes.cardValue} style={{ color: '#ff9800' }}>
                  {pendingOrders.length}
                </Typography>
                <Typography className={classes.cardLabel}>
                  待处理订单
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.card} elevation={1}>
              <CardContent className={classes.cardContent}>
                <CheckIcon className={classes.cardIcon} style={{ color: '#4caf50' }} />
                <Typography className={classes.cardValue} style={{ color: '#4caf50' }}>
                  {completedOrders.length}
                </Typography>
                <Typography className={classes.cardLabel}>
                  已完成订单
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={0} style={{ marginBottom: 24, padding: 16 }}>
          <div className={classes.searchBar}>
            <TextField
              className={classes.searchInput}
              variant="outlined"
              placeholder="搜索订单号、名称、客户或类型..."
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
            >
              筛选
            </Button>
          </div>
          
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab label="全部订单" {...a11yProps(0)} />
            <Tab label={`待处理 (${pendingOrders.length})`} {...a11yProps(1)} />
            <Tab label={`已完成 (${completedOrders.length})`} {...a11yProps(2)} />
          </Tabs>
        </Paper>

        {/* 全部订单 */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>产品名称</TableCell>
                  <TableCell>订单日期</TableCell>
                  <TableCell>客户</TableCell>
                  <TableCell>金额</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <span className={`${classes.orderType} ${order.type === 'Dataset' ? classes.datasetType : ''}`}>
                          {order.type}
                        </span>
                        {order.name}
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, order.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 待处理订单 */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>产品名称</TableCell>
                  <TableCell>订单日期</TableCell>
                  <TableCell>客户</TableCell>
                  <TableCell>金额</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <span className={`${classes.orderType} ${order.type === 'Dataset' ? classes.datasetType : ''}`}>
                          {order.type}
                        </span>
                        {order.name}
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, order.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ padding: '24px 0' }}>
                      <Typography variant="body1" color="textSecondary">
                        没有待处理的订单
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 已完成订单 */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>产品名称</TableCell>
                  <TableCell>订单日期</TableCell>
                  <TableCell>客户</TableCell>
                  <TableCell>金额</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <span className={`${classes.orderType} ${order.type === 'Dataset' ? classes.datasetType : ''}`}>
                          {order.type}
                        </span>
                        {order.name}
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, order.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {completedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ padding: '24px 0' }}>
                      <Typography variant="body1" color="textSecondary">
                        没有已完成的订单
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 订单菜单 */}
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>查看订单详情</MenuItem>
          <MenuItem onClick={handleMenuClose}>查看授权信息</MenuItem>
          <MenuItem onClick={handleMenuClose}>下载发票</MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>更新订单状态</MenuItem>
          <MenuItem onClick={handleMenuClose}>联系客户</MenuItem>
        </Menu>
      </Container>
    </div>
  );
};

export default OrderCenterPage; 