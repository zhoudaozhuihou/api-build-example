import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Chip,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  AddCircle as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ShowChart as ChartIcon,
  List as ListIcon,
} from '@material-ui/icons';
import ReactECharts from 'echarts-for-react';

// TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lineage-tabpanel-${index}`}
      aria-labelledby={`lineage-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  section: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  lineageContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  lineageTable: {
    marginTop: theme.spacing(2),
  },
  chartContainer: {
    height: 500,
    marginBottom: theme.spacing(3),
  },
  tabs: {
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

function ApiLineage({ open, onClose, apiId, apiName }) {
  const classes = useStyles();
  const [lineageData, setLineageData] = useState({
    upstream: [],
    downstream: [],
    users: [],
    upstreamRelations: [],
    downstreamRelations: []
  });
  const [editMode, setEditMode] = useState(false);
  const [newUpstream, setNewUpstream] = useState({ name: '', description: '' });
  const [newDownstream, setNewDownstream] = useState({ name: '', description: '' });
  const [newUser, setNewUser] = useState({ name: '', role: '', department: '' });
  const [tabValue, setTabValue] = useState(0);

  // Load lineage data for the specific API
  useEffect(() => {
    if (open && apiId) {
      const storedLineage = localStorage.getItem(`apiLineage_${apiId}`);
      if (storedLineage) {
        setLineageData(JSON.parse(storedLineage));
      } else {
        // Initialize with empty data if no data exists
        setLineageData({
          upstream: [],
          downstream: [],
          users: [],
          upstreamRelations: [],
          downstreamRelations: []
        });
      }
    }
  }, [open, apiId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    // Clean up any temporary data
    const { newUpstreamRelation, newDownstreamRelation, ...cleanData } = lineageData;
    
    // Save the lineage data to localStorage
    localStorage.setItem(`apiLineage_${apiId}`, JSON.stringify(cleanData));
    setEditMode(false);
  };

  const handleAddUpstream = () => {
    if (newUpstream.name.trim()) {
      setLineageData({
        ...lineageData,
        upstream: [...lineageData.upstream, { ...newUpstream, id: Date.now() }],
      });
      setNewUpstream({ name: '', description: '' });
    }
  };

  const handleAddDownstream = () => {
    if (newDownstream.name.trim()) {
      setLineageData({
        ...lineageData,
        downstream: [...lineageData.downstream, { ...newDownstream, id: Date.now() }],
      });
      setNewDownstream({ name: '', description: '' });
    }
  };

  const handleAddUser = () => {
    if (newUser.name.trim()) {
      setLineageData({
        ...lineageData,
        users: [...lineageData.users, { ...newUser, id: Date.now() }],
      });
      setNewUser({ name: '', role: '', department: '' });
    }
  };

  const handleRemoveUpstream = (id) => {
    setLineageData({
      ...lineageData,
      upstream: lineageData.upstream.filter((item) => item.id !== id),
    });
  };

  const handleRemoveDownstream = (id) => {
    setLineageData({
      ...lineageData,
      downstream: lineageData.downstream.filter((item) => item.id !== id),
    });
  };

  const handleRemoveUser = (id) => {
    setLineageData({
      ...lineageData,
      users: lineageData.users.filter((user) => user.id !== id),
    });
  };

  // Generate ECharts options for the graph visualization
  const getGraphOptions = () => {
    const nodes = [];
    const links = [];
    const categories = [
      { name: 'Current API' },
      { name: 'Upstream API' },
      { name: 'Downstream API' },
      { name: 'User' },
    ];

    // Add current API as the center node
    nodes.push({
      id: apiId,
      name: apiName,
      symbolSize: 50,
      category: 0,
      itemStyle: {
        color: '#1976d2'
      },
      label: {
        show: true
      }
    });

    // Add upstream APIs
    lineageData.upstream.forEach(item => {
      nodes.push({
        id: `upstream-${item.id}`,
        name: item.name,
        symbolSize: 30,
        category: 1,
        itemStyle: {
          color: '#388e3c'
        }
      });
      links.push({
        source: `upstream-${item.id}`,
        target: apiId,
        lineStyle: {
          color: '#388e3c',
          width: 2,
          curveness: 0.2
        }
      });
    });

    // Add downstream APIs
    lineageData.downstream.forEach(item => {
      nodes.push({
        id: `downstream-${item.id}`,
        name: item.name,
        symbolSize: 30,
        category: 2,
        itemStyle: {
          color: '#f57c00'
        }
      });
      links.push({
        source: apiId,
        target: `downstream-${item.id}`,
        lineStyle: {
          color: '#f57c00',
          width: 2,
          curveness: 0.2
        }
      });
    });

    // Add users as related nodes
    lineageData.users.forEach(user => {
      nodes.push({
        id: `user-${user.id}`,
        name: `${user.name} (${user.department})`,
        symbolSize: 20,
        category: 3,
        itemStyle: {
          color: '#7b1fa2'
        }
      });
      links.push({
        source: `user-${user.id}`,
        target: apiId,
        lineStyle: {
          color: '#7b1fa2',
          width: 1,
          type: 'dashed',
          curveness: 0.1
        }
      });
    });

    // Add relationships between upstream systems if they exist
    if (lineageData.upstreamRelations && lineageData.upstreamRelations.length > 0) {
      lineageData.upstreamRelations.forEach(relation => {
        links.push({
          source: `upstream-${relation.source}`,
          target: `upstream-${relation.target}`,
          lineStyle: {
            color: '#1e88e5',
            width: 1,
            type: 'dotted',
            curveness: 0.3
          },
          tooltip: {
            formatter: relation.description || '关联'
          }
        });
      });
    }

    // Add relationships between downstream systems if they exist
    if (lineageData.downstreamRelations && lineageData.downstreamRelations.length > 0) {
      lineageData.downstreamRelations.forEach(relation => {
        links.push({
          source: `downstream-${relation.source}`,
          target: `downstream-${relation.target}`,
          lineStyle: {
            color: '#fb8c00',
            width: 1,
            type: 'dotted',
            curveness: 0.3
          },
          tooltip: {
            formatter: relation.description || '关联'
          }
        });
      });
    }

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params.dataType === 'node') {
            return `<div>${params.name}</div>`;
          } else if (params.dataType === 'edge') {
            if (params.data.tooltip && params.data.tooltip.formatter) {
              return `<div>${params.data.source} → ${params.data.target}</div><div>${params.data.tooltip.formatter}</div>`;
            }
            return `<div>${params.data.source} → ${params.data.target}</div>`;
          }
          return '';
        }
      },
      legend: {
        data: categories.map(category => category.name),
        orient: 'vertical',
        right: 10,
        top: 20,
        textStyle: {
          color: '#333'
        }
      },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: 'API 血缘关系',
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: links,
          categories: categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4
            }
          },
          force: {
            repulsion: 350,
            gravity: 0.1,
            edgeLength: 200,
            friction: 0.2
          }
        }
      ]
    };
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        API 血缘关系 - {apiName}
        <Button
          color="primary"
          variant={editMode ? "contained" : "outlined"}
          onClick={() => setEditMode(!editMode)}
          style={{ float: 'right' }}
          startIcon={editMode ? <SaveIcon /> : <EditIcon />}
        >
          {editMode ? '保存模式' : '编辑模式'}
        </Button>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className={classes.tabs}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<ChartIcon />} label="可视化图表" />
          <Tab icon={<ListIcon />} label="详细信息" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {(lineageData.upstream.length > 0 || lineageData.downstream.length > 0 || lineageData.users.length > 0) ? (
            <>
              <Paper className={classes.chartContainer} variant="outlined">
                <ReactECharts
                  option={getGraphOptions()}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
              </Paper>
              <Paper className={classes.paper} variant="outlined">
                <Typography variant="subtitle1" gutterBottom>
                  图例说明
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>节点类型</Typography>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#1976d2' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">当前API</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#388e3c' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">上游API/数据源</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#f57c00' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">下游API/应用</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#7b1fa2' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">API使用者</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>连线类型</Typography>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 20, height: 2, backgroundColor: '#388e3c' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">上游API到当前API的数据流</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 20, height: 2, backgroundColor: '#f57c00' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">当前API到下游API的数据流</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 20, height: 0, border: '1px dashed #7b1fa2' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">API使用者关系</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 20, height: 0, border: '1px dotted #1e88e5' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">上游系统间的关系</Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <div style={{ width: 20, height: 0, border: '1px dotted #fb8c00' }}></div>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">下游系统间的关系</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    提示: 您可以通过鼠标拖动、滚轮缩放来查看完整的血缘关系图。悬停在节点或连线上可以查看详情。
                  </Typography>
                </Box>
              </Paper>
            </>
          ) : (
            <Paper className={classes.paper} variant="outlined" style={{ textAlign: 'center', padding: 48 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                暂无血缘关系数据
              </Typography>
              <Typography variant="body2" color="textSecondary">
                在"详细信息"选项卡中添加上下游API或用户以生成可视化图表
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                style={{ marginTop: 16 }}
                onClick={() => setTabValue(1)}
              >
                添加数据
              </Button>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <div className={classes.lineageContainer}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper} variant="outlined">
                  <Typography variant="h6" gutterBottom>
                    上游 API / 数据源
                  </Typography>
                  <Divider />
                  
                  {lineageData.upstream.length > 0 ? (
                    <TableContainer className={classes.lineageTable}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>名称</TableCell>
                            <TableCell>描述</TableCell>
                            {editMode && <TableCell width="10%">操作</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lineageData.upstream.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              {editMode && (
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveUpstream(item.id)}
                                  >
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                      暂无上游依赖
                    </Typography>
                  )}

                  {editMode && (
                    <div style={{ marginTop: 16 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            size="small"
                            label="上游API名称"
                            value={newUpstream.name}
                            onChange={(e) => setNewUpstream({ ...newUpstream, name: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            size="small"
                            label="描述"
                            value={newUpstream.description}
                            onChange={(e) => setNewUpstream({ ...newUpstream, description: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleAddUpstream}
                            startIcon={<AddIcon />}
                            fullWidth
                          >
                            添加
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper className={classes.paper} variant="outlined">
                  <Typography variant="h6" gutterBottom>
                    下游 API / 应用
                  </Typography>
                  <Divider />
                  
                  {lineageData.downstream.length > 0 ? (
                    <TableContainer className={classes.lineageTable}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>名称</TableCell>
                            <TableCell>描述</TableCell>
                            {editMode && <TableCell width="10%">操作</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lineageData.downstream.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              {editMode && (
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveDownstream(item.id)}
                                  >
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                      暂无下游依赖
                    </Typography>
                  )}

                  {editMode && (
                    <div style={{ marginTop: 16 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            size="small"
                            label="下游API名称"
                            value={newDownstream.name}
                            onChange={(e) => setNewDownstream({ ...newDownstream, name: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            size="small"
                            label="描述"
                            value={newDownstream.description}
                            onChange={(e) => setNewDownstream({ ...newDownstream, description: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleAddDownstream}
                            startIcon={<AddIcon />}
                            fullWidth
                          >
                            添加
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className={classes.paper} variant="outlined">
                  <Typography variant="h6" gutterBottom>
                    API 使用者
                  </Typography>
                  <Divider />
                  
                  {lineageData.users.length > 0 ? (
                    <TableContainer className={classes.lineageTable}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>用户名</TableCell>
                            <TableCell>角色</TableCell>
                            <TableCell>部门</TableCell>
                            {editMode && <TableCell width="10%">操作</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lineageData.users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              {editMode && (
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveUser(user.id)}
                                  >
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                      暂无API使用者信息
                    </Typography>
                  )}

                  {editMode && (
                    <div style={{ marginTop: 16 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="用户名"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="角色"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="部门"
                            value={newUser.department}
                            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleAddUser}
                            startIcon={<AddIcon />}
                            fullWidth
                          >
                            添加
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </div>

          {/* 系统间关系部分 */}
          <Grid container spacing={3}>
            {/* 上游系统间关系 */}
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  上游系统间关系
                </Typography>
                <Divider />
                
                {lineageData.upstreamRelations && lineageData.upstreamRelations.length > 0 ? (
                  <TableContainer className={classes.lineageTable}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>源系统</TableCell>
                          <TableCell>目标系统</TableCell>
                          <TableCell>关系描述</TableCell>
                          {editMode && <TableCell width="10%">操作</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lineageData.upstreamRelations.map((relation, index) => {
                          const sourceSystem = lineageData.upstream.find(item => item.id === relation.source);
                          const targetSystem = lineageData.upstream.find(item => item.id === relation.target);
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{sourceSystem ? sourceSystem.name : `系统 ${relation.source}`}</TableCell>
                              <TableCell>{targetSystem ? targetSystem.name : `系统 ${relation.target}`}</TableCell>
                              <TableCell>{relation.description}</TableCell>
                              {editMode && (
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      const newRelations = lineageData.upstreamRelations.filter((_, i) => i !== index);
                                      setLineageData({
                                        ...lineageData,
                                        upstreamRelations: newRelations
                                      });
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                    暂无上游系统间关系
                  </Typography>
                )}

                {editMode && lineageData.upstream.length >= 2 && (
                  <div style={{ marginTop: 16 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>源系统</InputLabel>
                          <Select
                            value=""
                            onChange={(e) => {
                              const sourceid = Number(e.target.value);
                              const newRelation = { source: sourceid, target: '', description: '' };
                              setLineageData({
                                ...lineageData,
                                newUpstreamRelation: newRelation
                              });
                            }}
                          >
                            {lineageData.upstream.map(item => (
                              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>目标系统</InputLabel>
                          <Select
                            value=""
                            onChange={(e) => {
                              if (lineageData.newUpstreamRelation) {
                                const targetid = Number(e.target.value);
                                setLineageData({
                                  ...lineageData,
                                  newUpstreamRelation: {
                                    ...lineageData.newUpstreamRelation,
                                    target: targetid
                                  }
                                });
                              }
                            }}
                          >
                            {lineageData.upstream
                              .filter(item => lineageData.newUpstreamRelation && item.id !== lineageData.newUpstreamRelation.source)
                              .map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="关系描述"
                          value={lineageData.newUpstreamRelation ? lineageData.newUpstreamRelation.description : ''}
                          onChange={(e) => {
                            if (lineageData.newUpstreamRelation) {
                              setLineageData({
                                ...lineageData,
                                newUpstreamRelation: {
                                  ...lineageData.newUpstreamRelation,
                                  description: e.target.value
                                }
                              });
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          fullWidth
                          disabled={!lineageData.newUpstreamRelation || !lineageData.newUpstreamRelation.source || !lineageData.newUpstreamRelation.target}
                          onClick={() => {
                            if (lineageData.newUpstreamRelation && lineageData.newUpstreamRelation.source && lineageData.newUpstreamRelation.target) {
                              const newRelations = [...(lineageData.upstreamRelations || []), lineageData.newUpstreamRelation];
                              setLineageData({
                                ...lineageData,
                                upstreamRelations: newRelations,
                                newUpstreamRelation: null
                              });
                            }
                          }}
                        >
                          添加
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </Paper>
            </Grid>

            {/* 下游系统间关系 */}
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  下游系统间关系
                </Typography>
                <Divider />
                
                {lineageData.downstreamRelations && lineageData.downstreamRelations.length > 0 ? (
                  <TableContainer className={classes.lineageTable}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>源系统</TableCell>
                          <TableCell>目标系统</TableCell>
                          <TableCell>关系描述</TableCell>
                          {editMode && <TableCell width="10%">操作</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lineageData.downstreamRelations.map((relation, index) => {
                          const sourceSystem = lineageData.downstream.find(item => item.id === relation.source);
                          const targetSystem = lineageData.downstream.find(item => item.id === relation.target);
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{sourceSystem ? sourceSystem.name : `系统 ${relation.source}`}</TableCell>
                              <TableCell>{targetSystem ? targetSystem.name : `系统 ${relation.target}`}</TableCell>
                              <TableCell>{relation.description}</TableCell>
                              {editMode && (
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      const newRelations = lineageData.downstreamRelations.filter((_, i) => i !== index);
                                      setLineageData({
                                        ...lineageData,
                                        downstreamRelations: newRelations
                                      });
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                    暂无下游系统间关系
                  </Typography>
                )}

                {editMode && lineageData.downstream.length >= 2 && (
                  <div style={{ marginTop: 16 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>源系统</InputLabel>
                          <Select
                            value=""
                            onChange={(e) => {
                              const sourceid = Number(e.target.value);
                              const newRelation = { source: sourceid, target: '', description: '' };
                              setLineageData({
                                ...lineageData,
                                newDownstreamRelation: newRelation
                              });
                            }}
                          >
                            {lineageData.downstream.map(item => (
                              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>目标系统</InputLabel>
                          <Select
                            value=""
                            onChange={(e) => {
                              if (lineageData.newDownstreamRelation) {
                                const targetid = Number(e.target.value);
                                setLineageData({
                                  ...lineageData,
                                  newDownstreamRelation: {
                                    ...lineageData.newDownstreamRelation,
                                    target: targetid
                                  }
                                });
                              }
                            }}
                          >
                            {lineageData.downstream
                              .filter(item => lineageData.newDownstreamRelation && item.id !== lineageData.newDownstreamRelation.source)
                              .map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="关系描述"
                          value={lineageData.newDownstreamRelation ? lineageData.newDownstreamRelation.description : ''}
                          onChange={(e) => {
                            if (lineageData.newDownstreamRelation) {
                              setLineageData({
                                ...lineageData,
                                newDownstreamRelation: {
                                  ...lineageData.newDownstreamRelation,
                                  description: e.target.value
                                }
                              });
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          fullWidth
                          disabled={!lineageData.newDownstreamRelation || !lineageData.newDownstreamRelation.source || !lineageData.newDownstreamRelation.target}
                          onClick={() => {
                            if (lineageData.newDownstreamRelation && lineageData.newDownstreamRelation.source && lineageData.newDownstreamRelation.target) {
                              const newRelations = [...(lineageData.downstreamRelations || []), lineageData.newDownstreamRelation];
                              setLineageData({
                                ...lineageData,
                                downstreamRelations: newRelations,
                                newDownstreamRelation: null
                              });
                            }
                          }}
                        >
                          添加
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        {editMode && (
          <Button onClick={() => setEditMode(false)} color="default" startIcon={<CancelIcon />}>
            取消
          </Button>
        )}
        {editMode && (
          <Button onClick={handleSave} color="primary" variant="contained" startIcon={<SaveIcon />}>
            保存
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiLineage; 