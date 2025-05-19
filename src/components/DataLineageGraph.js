import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Storage as StorageIcon,
  Code as ApiIcon,
  ViewList as TableIcon,
  Person as UserIcon,
  DeviceHub as UpstreamIcon,
  ArrowDownward as DownstreamIcon,
  InfoOutlined as InfoIcon
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllDatasets } from '../redux/slices/datasetSlice';
import { selectAllApis, API_TYPES } from '../redux/slices/apiSlice';

// 模拟一些其他数据，实际项目中应从Redux或API获取
const mockTables = [
  { id: 't1', name: 'users', schema: 'public', database: 'postgres', source: 'PostgreSQL' },
  { id: 't2', name: 'orders', schema: 'public', database: 'postgres', source: 'PostgreSQL' },
  { id: 't3', name: 'products', schema: 'public', database: 'postgres', source: 'PostgreSQL' },
  { id: 't4', name: 'payments', schema: 'public', database: 'postgres', source: 'PostgreSQL' },
];

const mockUsers = [
  { id: 'u1', name: '开发团队A', email: 'team_a@example.com', role: 'developer' },
  { id: 'u2', name: '分析团队B', email: 'team_b@example.com', role: 'analyst' },
  { id: 'u3', name: '产品团队C', email: 'team_c@example.com', role: 'product' },
];

const mockUpstreams = [
  { id: 'up1', name: '用户中心', type: 'system', direction: 'upstream' },
  { id: 'up2', name: '订单系统', type: 'system', direction: 'upstream' },
  { id: 'up3', name: '支付网关', type: 'system', direction: 'upstream' },
];

const mockDownstreams = [
  { id: 'down1', name: '分析平台', type: 'system', direction: 'downstream' },
  { id: 'down2', name: '报表系统', type: 'system', direction: 'downstream' },
  { id: 'down3', name: '客户端应用', type: 'system', direction: 'downstream' },
];

// 模拟关系数据，实际项目中这部分应该由后端提供
const mockRelationships = [
  // 数据集与表的关系
  { source: 'ds1', target: 't1', type: 'dataset_table' },
  { source: 'ds1', target: 't2', type: 'dataset_table' },
  { source: 'ds2', target: 't3', type: 'dataset_table' },
  { source: 'ds3', target: 't4', type: 'dataset_table' },
  
  // 数据集与API的关系
  { source: 'ds1', target: 'api1', type: 'dataset_api' },
  { source: 'ds2', target: 'api2', type: 'dataset_api' },
  { source: 'ds3', target: 'api3', type: 'dataset_api' },
  
  // 用户与API的关系
  { source: 'u1', target: 'api1', type: 'user_api' },
  { source: 'u2', target: 'api2', type: 'user_api' },
  { source: 'u3', target: 'api3', type: 'user_api' },
  
  // 上游系统与数据集的关系
  { source: 'up1', target: 'ds1', type: 'upstream_dataset' },
  { source: 'up2', target: 'ds2', type: 'upstream_dataset' },
  { source: 'up3', target: 'ds3', type: 'upstream_dataset' },
  
  // API与下游系统的关系
  { source: 'api1', target: 'down1', type: 'api_downstream' },
  { source: 'api2', target: 'down2', type: 'api_downstream' },
  { source: 'api3', target: 'down3', type: 'api_downstream' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 600,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  graphContainer: {
    width: '100%',
    height: 600,
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
  legend: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(1),
  },
  legendTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  legendIcon: {
    marginRight: theme.spacing(1),
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendText: {
    fontSize: '0.75rem',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  formControl: {
    minWidth: 150,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1100,
  },
  nodeTooltip: {
    position: 'absolute',
    zIndex: 1200,
    backgroundColor: 'white',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    maxWidth: 300,
  },
}));

// 不同类型节点的颜色配置
const nodeColors = {
  dataset: '#2196f3', // 蓝色
  api: '#4caf50',     // 绿色
  table: '#ff9800',   // 橙色
  user: '#9c27b0',    // 紫色
  upstream: '#f44336',   // 红色
  downstream: '#795548', // 棕色
};

// 不同类型关系的颜色配置
const edgeColors = {
  dataset_table: '#ff9800',
  dataset_api: '#4caf50',
  user_api: '#9c27b0',
  upstream_dataset: '#f44336',
  api_downstream: '#795548',
};

const DataLineageGraph = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  
  // 状态
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'dataset', 'api', 'table', 'user', 'upstream', 'downstream'
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeTooltip, setNodeTooltip] = useState({ visible: false, x: 0, y: 0, node: null });
  
  // Redux数据
  const datasets = useSelector(selectAllDatasets);
  const apis = useSelector(selectAllApis);
  
  // 所有节点和边的数据
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // 渲染引擎
  const [renderer, setRenderer] = useState(null);
  
  // 初始化数据
  useEffect(() => {
    setLoading(true);
    
    // 整合数据集
    const datasetNodes = datasets.map(ds => ({
      id: ds.id,
      label: ds.name,
      type: 'dataset',
      data: ds,
    }));
    
    // 整合API
    const apiNodes = apis.map(api => ({
      id: api.id,
      label: api.name,
      type: 'api',
      data: api,
    }));
    
    // 整合表
    const tableNodes = mockTables.map(table => ({
      id: table.id,
      label: table.name,
      type: 'table',
      data: table,
    }));
    
    // 整合用户
    const userNodes = mockUsers.map(user => ({
      id: user.id,
      label: user.name,
      type: 'user',
      data: user,
    }));
    
    // 整合上游系统
    const upstreamNodes = mockUpstreams.map(upstream => ({
      id: upstream.id,
      label: upstream.name,
      type: 'upstream',
      data: upstream,
    }));
    
    // 整合下游系统
    const downstreamNodes = mockDownstreams.map(downstream => ({
      id: downstream.id,
      label: downstream.name,
      type: 'downstream',
      data: downstream,
    }));
    
    // 合并所有节点
    const allNodes = [
      ...datasetNodes,
      ...apiNodes,
      ...tableNodes,
      ...userNodes,
      ...upstreamNodes,
      ...downstreamNodes
    ];
    
    // 边关系
    const allEdges = mockRelationships.map((rel, index) => ({
      id: `e${index}`,
      source: rel.source,
      target: rel.target,
      type: rel.type,
    }));
    
    setNodes(allNodes);
    setEdges(allEdges);
    setLoading(false);
  }, [datasets, apis]);
  
  // 初始化和更新画布
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    
    // 此处应该集成实际的图形渲染库，如D3.js, react-flow, G6等
    // 为了示例，这里只简单绘制一些文本
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // 应用缩放
      ctx.save();
      ctx.scale(zoom, zoom);
      
      // 绘制边
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const sourceX = (sourceNode.x || 100) * zoom;
          const sourceY = (sourceNode.y || 100) * zoom;
          const targetX = (targetNode.x || 200) * zoom;
          const targetY = (targetNode.y || 200) * zoom;
          
          // 设置边的颜色
          ctx.strokeStyle = edgeColors[edge.type] || '#999';
          ctx.lineWidth = 2;
          
          // 绘制边
          ctx.beginPath();
          ctx.moveTo(sourceX, sourceY);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();
        }
      });
      
      // 绘制节点
      nodes.forEach(node => {
        // 过滤显示
        if (filter !== 'all' && node.type !== filter) return;
        
        const x = (node.x || 100) * zoom;
        const y = (node.y || 100) * zoom;
        const radius = 20;
        
        // 设置节点颜色
        ctx.fillStyle = nodeColors[node.type] || '#999';
        
        // 选中高亮
        if (selectedNodeId === node.id) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#333';
        } else {
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#666';
        }
        
        // 绘制节点
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 绘制标签
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y + radius + 15);
      });
      
      ctx.restore();
    };
    
    // 初次渲染
    draw();
    
    // 模拟布局算法的结果
    // 实际应用中应该用专业的图布局算法
    const simulateLayout = () => {
      // 为每个节点分配一个位置
      const updatedNodes = nodes.map((node, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        return {
          ...node,
          x: 100 + col * 150,
          y: 100 + row * 150
        };
      });
      
      setNodes(updatedNodes);
    };
    
    // 执行布局
    simulateLayout();
    
    // 返回的清理函数
    return () => {
      // 清理布局算法或事件监听器
    };
  }, [nodes, edges, zoom, filter, selectedNodeId]);
  
  // 增加缩放级别
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // 减少缩放级别
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // 重置缩放
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  // 更改过滤器
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  
  // 刷新图表
  const handleRefresh = () => {
    setLoading(true);
    // 重新获取数据或重新计算布局
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  // 保存图片
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'data-lineage.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };
  
  // 处理节点点击
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    // 查找点击的节点
    const clickedNode = nodes.find(node => {
      const dx = (node.x || 0) - x;
      const dy = (node.y || 0) - y;
      return Math.sqrt(dx * dx + dy * dy) <= 20; // 节点半径为20
    });
    
    if (clickedNode) {
      setSelectedNodeId(clickedNode.id);
      setNodeTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        node: clickedNode
      });
    } else {
      setSelectedNodeId(null);
      setNodeTooltip({ visible: false, x: 0, y: 0, node: null });
    }
  };
  
  // 关闭节点提示框
  const handleCloseTooltip = () => {
    setNodeTooltip({ visible: false, x: 0, y: 0, node: null });
  };
  
  // 渲染节点详情
  const renderNodeDetails = (node) => {
    if (!node) return null;
    
    switch (node.type) {
      case 'dataset':
        return (
          <div>
            <Typography variant="subtitle1">{node.label}</Typography>
            <Typography variant="body2">类型: {node.data.type}</Typography>
            <Typography variant="body2">来源: {node.data.source}</Typography>
            <Typography variant="body2">关联API数: {node.data.linkedApis?.length || 0}</Typography>
          </div>
        );
      case 'api':
        return (
          <div>
            <Typography variant="subtitle1">{node.label}</Typography>
            <Typography variant="body2">类型: {
              node.data.type === API_TYPES.UPLOADED ? '上传API' :
              node.data.type === API_TYPES.LOWCODE_DB ? '数据库构建API' :
              '数据集构建API'
            }</Typography>
            <Typography variant="body2">方法: {node.data.method}</Typography>
            <Typography variant="body2">路径: {node.data.path}</Typography>
          </div>
        );
      case 'table':
        return (
          <div>
            <Typography variant="subtitle1">{node.label}</Typography>
            <Typography variant="body2">数据库: {node.data.database}</Typography>
            <Typography variant="body2">模式: {node.data.schema}</Typography>
            <Typography variant="body2">来源: {node.data.source}</Typography>
          </div>
        );
      case 'user':
        return (
          <div>
            <Typography variant="subtitle1">{node.label}</Typography>
            <Typography variant="body2">邮箱: {node.data.email}</Typography>
            <Typography variant="body2">角色: {node.data.role}</Typography>
          </div>
        );
      case 'upstream':
      case 'downstream':
        return (
          <div>
            <Typography variant="subtitle1">{node.label}</Typography>
            <Typography variant="body2">类型: {node.data.type}</Typography>
            <Typography variant="body2">方向: {node.data.direction === 'upstream' ? '上游系统' : '下游系统'}</Typography>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.title}>
          数据血缘关系图
        </Typography>
        
        <Box>
          <Tooltip title="此图显示了数据集、API、数据库表、用户和上下游系统之间的所有关系">
            <InfoIcon color="action" style={{ marginRight: 8 }} />
          </Tooltip>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={handleRefresh} startIcon={<RefreshIcon />}>
              刷新
            </Button>
            <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
              下载
            </Button>
          </ButtonGroup>
        </Box>
      </div>
      
      <div className={classes.toolbar}>
        <div className={classes.filterContainer}>
          <FormControl variant="outlined" size="small" className={classes.formControl}>
            <InputLabel id="node-filter-label">节点类型过滤</InputLabel>
            <Select
              labelId="node-filter-label"
              value={filter}
              onChange={handleFilterChange}
              label="节点类型过滤"
            >
              <MenuItem value="all">全部显示</MenuItem>
              <MenuItem value="dataset">只显示数据集</MenuItem>
              <MenuItem value="api">只显示API</MenuItem>
              <MenuItem value="table">只显示数据表</MenuItem>
              <MenuItem value="user">只显示用户</MenuItem>
              <MenuItem value="upstream">只显示上游系统</MenuItem>
              <MenuItem value="downstream">只显示下游系统</MenuItem>
            </Select>
          </FormControl>
        </div>
        
        <ButtonGroup size="small">
          <Button onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOutIcon />
          </Button>
          <Button onClick={handleResetZoom}>
            {Math.round(zoom * 100)}%
          </Button>
          <Button onClick={handleZoomIn} disabled={zoom >= 2}>
            <ZoomInIcon />
          </Button>
        </ButtonGroup>
      </div>
      
      <div className={classes.graphContainer}>
        {loading && (
          <div className={classes.loadingOverlay}>
            <CircularProgress />
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className={classes.canvas}
          width={1200}
          height={600}
          onClick={handleCanvasClick}
        />
        
        {/* 控制按钮 */}
        <div className={classes.controlsContainer}>
          <ButtonGroup orientation="vertical" size="small">
            <Button onClick={handleZoomIn} disabled={zoom >= 2}>
              <ZoomInIcon />
            </Button>
            <Button onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOutIcon />
            </Button>
            <Button onClick={handleResetZoom}>
              <RefreshIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        </div>
        
        {/* 图例 */}
        <div className={classes.legend}>
          <Typography variant="subtitle2" className={classes.legendTitle}>
            图例
          </Typography>
          <div className={classes.legendItem}>
            <div className={classes.legendIcon} style={{ color: nodeColors.dataset }}>
              <StorageIcon fontSize="small" />
            </div>
            <Typography className={classes.legendText}>数据集</Typography>
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendIcon} style={{ color: nodeColors.api }}>
              <ApiIcon fontSize="small" />
            </div>
            <Typography className={classes.legendText}>API</Typography>
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendIcon} style={{ color: nodeColors.table }}>
              <TableIcon fontSize="small" />
            </div>
            <Typography className={classes.legendText}>数据表</Typography>
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendIcon} style={{ color: nodeColors.user }}>
              <UserIcon fontSize="small" />
            </div>
            <Typography className={classes.legendText}>用户</Typography>
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendIcon} style={{ color: nodeColors.upstream }}>
              <UpstreamIcon fontSize="small" />
            </div>
            <Typography className={classes.legendText}>上游系统</Typography>
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendIcon} style={{ color: nodeColors.downstream }}>
              <DownstreamIcon fontSize="small" />
            </div>
            <Typography className={classes.legendText}>下游系统</Typography>
          </div>
        </div>
        
        {/* 节点提示框 */}
        {nodeTooltip.visible && (
          <div 
            className={classes.nodeTooltip}
            style={{ 
              left: nodeTooltip.x + 15, 
              top: nodeTooltip.y - 15
            }}
          >
            <Button
              size="small"
              style={{ 
                position: 'absolute', 
                right: 0, 
                top: 0,
                minWidth: 'auto',
                padding: 4
              }}
              onClick={handleCloseTooltip}
            >
              ✕
            </Button>
            {renderNodeDetails(nodeTooltip.node)}
          </div>
        )}
      </div>
    </Paper>
  );
};

export default DataLineageGraph; 