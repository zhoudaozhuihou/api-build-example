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
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Info as InfoIcon,
  Flag as FlagIcon,
  Comment as CommentIcon
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
  workflowSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  urgentBadge: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ReviewCenterPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
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
    },
    { 
      id: 6, 
      name: '数据集：产品图像数据', 
      type: 'Dataset', 
      submitter: { name: '王五', avatar: 'W' }, 
      submittedAt: '2023-06-12 14:20', 
      status: 'approved',
      urgent: false 
    },
    { 
      id: 7, 
      name: 'API接口：用户信息查询', 
      type: 'API', 
      submitter: { name: '李四', avatar: 'L' }, 
      submittedAt: '2023-06-12 11:05', 
      status: 'rejected',
      urgent: false 
    }
  ];

  const filteredItems = reviewItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.submitter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingItems = filteredItems.filter(item => item.status === 'pending');
  const approvedItems = filteredItems.filter(item => item.status === 'approved');
  const rejectedItems = filteredItems.filter(item => item.status === 'rejected');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="待审核" size="small" className={classes.pendingChip} />;
      case 'approved':
        return <Chip label="已批准" size="small" className={classes.approvedChip} />;
      case 'rejected':
        return <Chip label="已拒绝" size="small" className={classes.rejectedChip} />;
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
                审核中心
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                管理API和数据集的审核流程
              </Typography>
            </Grid>
          </Grid>
        </div>

        {/* 统计卡片 */}
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs={12} sm={4}>
            <Card className={classes.statisticsCard}>
              <CardContent>
                <Typography className={classes.statisticsValue} color="primary">
                  {pendingItems.length}
                </Typography>
                <Typography className={classes.statisticsLabel}>
                  待审核项目
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className={classes.statisticsCard}>
              <CardContent>
                <Typography className={classes.statisticsValue} style={{ color: '#4caf50' }}>
                  {approvedItems.length}
                </Typography>
                <Typography className={classes.statisticsLabel}>
                  已批准项目
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className={classes.statisticsCard}>
              <CardContent>
                <Typography className={classes.statisticsValue} style={{ color: '#f44336' }}>
                  {rejectedItems.length}
                </Typography>
                <Typography className={classes.statisticsLabel}>
                  已拒绝项目
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
              placeholder="搜索项目名称、类型或提交者..."
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
              className={classes.filterButton}
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
            <Tab label={`待审核 (${pendingItems.length})`} {...a11yProps(0)} />
            <Tab label={`已批准 (${approvedItems.length})`} {...a11yProps(1)} />
            <Tab label={`已拒绝 (${rejectedItems.length})`} {...a11yProps(2)} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>项目名称</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>提交者</TableCell>
                  <TableCell>提交时间</TableCell>
                  <TableCell className={classes.statusCell}>状态</TableCell>
                  <TableCell className={classes.actionCell}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {item.urgent && (
                          <Box 
                            className={`${classes.badge} ${classes.urgentBadge}`}
                            mr={1}
                          >
                            <FlagIcon fontSize="small" style={{ fontSize: '0.75rem', marginRight: 4 }} />
                            紧急
                          </Box>
                        )}
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <div className={classes.submitterColumn}>
                        <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                        {item.submitter.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell className={classes.statusCell}>
                      {getStatusChip(item.status)}
                    </TableCell>
                    <TableCell className={classes.actionCell}>
                      <IconButton
                        size="small"
                        className={classes.actionButton}
                        style={{ color: '#4caf50' }}
                      >
                        <ApproveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className={classes.actionButton}
                        style={{ color: '#f44336' }}
                      >
                        <RejectIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, item.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '24px 0' }}>
                      <Typography variant="body1" color="textSecondary">
                        没有待审核的项目
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>项目名称</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>提交者</TableCell>
                  <TableCell>提交时间</TableCell>
                  <TableCell className={classes.statusCell}>状态</TableCell>
                  <TableCell className={classes.actionCell}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <div className={classes.submitterColumn}>
                        <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                        {item.submitter.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell className={classes.statusCell}>
                      {getStatusChip(item.status)}
                    </TableCell>
                    <TableCell className={classes.actionCell}>
                      <IconButton
                        size="small"
                        className={classes.actionButton}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className={classes.actionButton}
                      >
                        <CommentIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, item.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {approvedItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '24px 0' }}>
                      <Typography variant="body1" color="textSecondary">
                        没有已批准的项目
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>项目名称</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>提交者</TableCell>
                  <TableCell>提交时间</TableCell>
                  <TableCell className={classes.statusCell}>状态</TableCell>
                  <TableCell className={classes.actionCell}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <div className={classes.submitterColumn}>
                        <Avatar className={classes.avatar}>{item.submitter.avatar}</Avatar>
                        {item.submitter.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell className={classes.statusCell}>
                      {getStatusChip(item.status)}
                    </TableCell>
                    <TableCell className={classes.actionCell}>
                      <IconButton
                        size="small"
                        className={classes.actionButton}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className={classes.actionButton}
                      >
                        <CommentIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, item.id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {rejectedItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '24px 0' }}>
                      <Typography variant="body1" color="textSecondary">
                        没有已拒绝的项目
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Menu for item actions */}
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>查看详情</MenuItem>
          <MenuItem onClick={handleMenuClose}>添加备注</MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>查看历史记录</MenuItem>
          <MenuItem onClick={handleMenuClose}>分配给他人</MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose} style={{ color: '#f44336' }}>
            撤销审核
          </MenuItem>
        </Menu>
      </Container>
    </div>
  );
};

export default ReviewCenterPage; 