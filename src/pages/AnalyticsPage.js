import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Box,
  Tabs,
  Tab,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  CloudDownload as DownloadIcon
} from '@material-ui/icons';
import ReactEcharts from 'echarts-for-react';

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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  statsCard: {
    position: 'relative',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  statsValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statsLabel: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  statsChange: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
  },
  positiveChange: {
    color: theme.palette.success.main,
  },
  negativeChange: {
    color: theme.palette.error.main,
  },
  chartCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  chartTitle: {
    fontWeight: 'bold',
  },
  timePeriod: {
    minWidth: 120,
  },
  tabsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    marginBottom: theme.spacing(2),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

const AnalyticsPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // API使用趋势图
  const apiUsageOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'API调用次数',
        type: 'bar',
        barWidth: '60%',
        data: [1200, 980, 1400, 1800, 1250, 900, 1100],
        itemStyle: {
          color: '#1976d2'
        }
      }
    ]
  };

  // 收入趋势图
  const revenueOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      boundaryGap: false,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: [5000, 8000, 7500, 9000, 12000, 15000],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(25, 118, 210, 0.5)'
            }, {
              offset: 1, color: 'rgba(25, 118, 210, 0.1)'
            }],
          }
        },
        itemStyle: {
          color: '#1976d2'
        },
        lineStyle: {
          width: 3
        },
        smooth: true
      }
    ]
  };

  // 数据集下载统计图
  const datasetDownloadOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '数据集下载',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '用户行为数据' },
          { value: 735, name: '商品评论数据' },
          { value: 580, name: '图像识别数据' },
          { value: 484, name: '销售趋势数据' },
          { value: 300, name: '其他数据集' }
        ]
      }
    ]
  };

  // API类别使用统计图
  const apiCategoryOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['上周', '本周']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: ['用户服务', '订单服务', '支付服务', '商品服务', '通知服务']
    },
    series: [
      {
        name: '上周',
        type: 'bar',
        data: [320, 302, 301, 334, 390],
        itemStyle: {
          color: '#90caf9'
        }
      },
      {
        name: '本周',
        type: 'bar',
        data: [420, 388, 310, 350, 410],
        itemStyle: {
          color: '#1976d2'
        }
      }
    ]
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        {/* 统计卡片 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper className={classes.statsCard} elevation={1}>
              <Typography className={classes.statsLabel}>
                API调用次数
              </Typography>
              <Typography className={classes.statsValue} color="primary">
                42,580
              </Typography>
              <Box className={`${classes.statsChange} ${classes.positiveChange}`}>
                <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
                <span>+15.3% 同比上周</span>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper className={classes.statsCard} elevation={1}>
              <Typography className={classes.statsLabel}>
                活跃客户数
              </Typography>
              <Typography className={classes.statsValue} style={{ color: '#4caf50' }}>
                128
              </Typography>
              <Box className={`${classes.statsChange} ${classes.positiveChange}`}>
                <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
                <span>+5.2% 同比上月</span>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper className={classes.statsCard} elevation={1}>
              <Typography className={classes.statsLabel}>
                数据集下载次数
              </Typography>
              <Typography className={classes.statsValue} style={{ color: '#ff9800' }}>
                3,147
              </Typography>
              <Box className={`${classes.statsChange} ${classes.positiveChange}`}>
                <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
                <span>+8.7% 同比上周</span>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper className={classes.statsCard} elevation={1}>
              <Typography className={classes.statsLabel}>
                平均响应时间
              </Typography>
              <Typography className={classes.statsValue} style={{ color: '#f44336' }}>
                85ms
              </Typography>
              <Box className={`${classes.statsChange} ${classes.negativeChange}`}>
                <TrendingDownIcon fontSize="small" style={{ marginRight: 4 }} />
                <span>-12.5% 同比上周</span>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 时间范围选择器 */}
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <FormControl variant="outlined" size="small" className={classes.timePeriod}>
            <InputLabel id="time-range-label">时间范围</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range"
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="时间范围"
            >
              <MenuItem value="day">今日</MenuItem>
              <MenuItem value="week">本周</MenuItem>
              <MenuItem value="month">本月</MenuItem>
              <MenuItem value="quarter">本季度</MenuItem>
              <MenuItem value="year">本年度</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            style={{ marginLeft: 8 }}
            size="small"
          >
            刷新
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            style={{ marginLeft: 8 }}
            size="small"
          >
            导出
          </Button>
        </Box>

        {/* 图表 */}
        <div className={classes.tabsContainer}>
          <Paper elevation={0}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              className={classes.tabs}
            >
              <Tab 
                icon={<AssessmentIcon />} 
                label="API分析" 
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<TimelineIcon />} 
                label="数据集分析" 
                {...a11yProps(1)} 
              />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.chartCard}>
                  <div className={classes.chartHeader}>
                    <Typography variant="h6" className={classes.chartTitle}>
                      API调用趋势
                    </Typography>
                  </div>
                  <ReactEcharts
                    option={apiUsageOption}
                    style={{ height: '400px' }}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.chartCard}>
                  <div className={classes.chartHeader}>
                    <Typography variant="h6" className={classes.chartTitle}>
                      收入趋势
                    </Typography>
                  </div>
                  <ReactEcharts
                    option={revenueOption}
                    style={{ height: '350px' }}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.chartCard}>
                  <div className={classes.chartHeader}>
                    <Typography variant="h6" className={classes.chartTitle}>
                      API类别使用统计
                    </Typography>
                  </div>
                  <ReactEcharts
                    option={apiCategoryOption}
                    style={{ height: '350px' }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.chartCard}>
                  <div className={classes.chartHeader}>
                    <Typography variant="h6" className={classes.chartTitle}>
                      数据集下载趋势
                    </Typography>
                  </div>
                  <ReactEcharts
                    option={revenueOption}
                    style={{ height: '400px' }}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.chartCard}>
                  <div className={classes.chartHeader}>
                    <Typography variant="h6" className={classes.chartTitle}>
                      数据集热门排行
                    </Typography>
                  </div>
                  <ReactEcharts
                    option={datasetDownloadOption}
                    style={{ height: '350px' }}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.chartCard}>
                  <div className={classes.chartHeader}>
                    <Typography variant="h6" className={classes.chartTitle}>
                      数据集使用分布
                    </Typography>
                  </div>
                  <ReactEcharts
                    option={apiCategoryOption}
                    style={{ height: '350px' }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </div>
      </Container>
    </div>
  );
};

export default AnalyticsPage; 