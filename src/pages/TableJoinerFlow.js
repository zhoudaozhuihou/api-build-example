import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  TableChart,
  Code as CodeIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    width: 300,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tableList: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  tableItem: {
    cursor: 'grab',
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  canvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  sqlPanel: {
    height: 200,
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
  },
  sqlHeader: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sqlContent: {
    flex: 1,
    padding: theme.spacing(2),
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#f5f5f5',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  toolbar: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1000,
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

// 自定义边缘组件，支持JOIN类型选择
function CustomEdge({ id, sourceX, sourceY, targetX, targetY, label, style = {}, data, ...props }) {
  const [joinMenuAnchor, setJoinMenuAnchor] = useState(null);
  
  const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'];
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleJoinClick = (event) => {
    event.stopPropagation();
    setJoinMenuAnchor(event.currentTarget);
  };

  const handleJoinTypeSelect = (joinType) => {
    // 通过全局事件通知父组件更新边缘标签
    window.dispatchEvent(new CustomEvent('updateEdgeLabel', {
      detail: { edgeId: id, newLabel: joinType }
    }));
    setJoinMenuAnchor(null);
  };

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <foreignObject
        width={120}
        height={30}
        x={labelX - 60}
        y={labelY - 15}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            onClick={handleJoinClick}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {label || 'INNER JOIN'}
          </button>
        </div>
      </foreignObject>
      
      <Menu
        anchorEl={joinMenuAnchor}
        open={Boolean(joinMenuAnchor)}
        onClose={() => setJoinMenuAnchor(null)}
        PaperProps={{
          style: { minWidth: 150 }
        }}
      >
        {joinTypes.map((joinType) => (
          <MenuItem
            key={joinType}
            onClick={() => handleJoinTypeSelect(joinType)}
            selected={label === joinType}
          >
            {joinType}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function TableNode({ data }) {
  return (
    <div style={{ border: '2px solid #e53935', borderRadius: 8, background: '#fff', minWidth: 250, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ background: '#e53935', color: '#fff', padding: '12px 16px', borderRadius: '6px 6px 0 0', fontWeight: 'bold', fontSize: '16px' }}>
        📊 {data.label}
      </div>
      <div style={{ padding: '8px 16px 16px 16px' }}>
        {data.fields.map((field, idx) => (
          <div 
            key={field.name} 
            style={{ 
              position: 'relative', 
              marginBottom: 8, 
              padding: '8px 12px', 
              borderRadius: 6, 
              background: field.isPrimary ? '#e3f2fd' : '#f5f5f5',
              border: `1px solid ${field.isPrimary ? '#2196f3' : '#e0e0e0'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: field.isPrimary ? 'bold' : 'normal' }}>
                {field.name}
              </span>
              {field.isPrimary && (
                <span style={{ 
                  background: '#2196f3', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: 4, 
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  PK
                </span>
              )}
            </div>
            <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
              {field.type || 'VARCHAR'}
            </span>
            
            {/* 左侧为target，右侧为source */}
            <Handle
              type="target"
              position={Position.Left}
              id={field.name}
              style={{ 
                top: '50%', 
                background: '#2196f3', 
                left: -8,
                width: 12,
                height: 12,
                border: '2px solid white'
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={field.name}
              style={{ 
                top: '50%', 
                background: '#ff9800', 
                right: -8,
                width: 12,
                height: 12,
                border: '2px solid white'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const nodeTypes = { table: TableNode };
const edgeTypes = { custom: CustomEdge };

// 可用表格数据（用于左侧列表）
const availableTables = [
  {
    id: 'users',
    name: 'users',
    description: '用户信息表',
    fields: [
      { name: 'id', type: 'INT', isPrimary: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'department_id', type: 'INT' },
      { name: 'created_at', type: 'DATETIME' },
    ],
  },
  {
    id: 'departments',
    name: 'departments',
    description: '部门信息表',
    fields: [
      { name: 'id', type: 'INT', isPrimary: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'manager_id', type: 'INT' },
      { name: 'budget', type: 'DECIMAL(12,2)' },
    ],
  },
  {
    id: 'orders',
    name: 'orders',
    description: '订单信息表',
    fields: [
      { name: 'id', type: 'INT', isPrimary: true },
      { name: 'user_id', type: 'INT' },
      { name: 'product_id', type: 'INT' },
      { name: 'quantity', type: 'INT' },
      { name: 'total_amount', type: 'DECIMAL(10,2)' },
      { name: 'order_date', type: 'DATETIME' },
    ],
  },
  {
    id: 'products',
    name: 'products',
    description: '产品信息表',
    fields: [
      { name: 'id', type: 'INT', isPrimary: true },
      { name: 'name', type: 'VARCHAR(200)' },
      { name: 'price', type: 'DECIMAL(10,2)' },
      { name: 'category_id', type: 'INT' },
      { name: 'stock_quantity', type: 'INT' },
    ],
  },
  {
    id: 'categories',
    name: 'categories',
    description: '产品分类表',
    fields: [
      { name: 'id', type: 'INT', isPrimary: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'parent_id', type: 'INT' },
    ],
  },
];

const initialNodes = [
  {
    id: 'users',
    type: 'table',
    position: { x: 100, y: 100 },
    data: {
      label: 'users',
      fields: [
        { name: 'id', type: 'INT', isPrimary: true },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'department_id', type: 'INT' },
        { name: 'created_at', type: 'DATETIME' },
      ],
    },
  },
  {
    id: 'departments',
    type: 'table',
    position: { x: 500, y: 100 },
    data: {
      label: 'departments',
      fields: [
        { name: 'id', type: 'INT', isPrimary: true },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'manager_id', type: 'INT' },
        { name: 'budget', type: 'DECIMAL(12,2)' },
      ],
    },
  },
  {
    id: 'orders',
    type: 'table',
    position: { x: 100, y: 400 },
    data: {
      label: 'orders',
      fields: [
        { name: 'id', type: 'INT', isPrimary: true },
        { name: 'user_id', type: 'INT' },
        { name: 'product_id', type: 'INT' },
        { name: 'quantity', type: 'INT' },
        { name: 'total_amount', type: 'DECIMAL(10,2)' },
        { name: 'order_date', type: 'DATETIME' },
      ],
    },
  },
  {
    id: 'products',
    type: 'table',
    position: { x: 500, y: 400 },
    data: {
      label: 'products',
      fields: [
        { name: 'id', type: 'INT', isPrimary: true },
        { name: 'name', type: 'VARCHAR(200)' },
        { name: 'price', type: 'DECIMAL(10,2)' },
        { name: 'category_id', type: 'INT' },
        { name: 'stock_quantity', type: 'INT' },
      ],
    },
  },
];

export default function TableJoinerFlow() {
  const classes = useStyles();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      label: 'INNER JOIN',
      type: 'custom',
      style: { strokeWidth: 2, stroke: '#2196f3' }
    }, eds)),
    []
  );

  // 处理边缘标签更新
  React.useEffect(() => {
    const handleUpdateEdgeLabel = (event) => {
      const { edgeId, newLabel } = event.detail;
      setEdges((eds) => 
        eds.map((edge) => 
          edge.id === edgeId 
            ? { ...edge, label: newLabel }
            : edge
        )
      );
    };

    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    };
  }, []);

  // 处理表格拖拽到画布
  const handleTableDrop = useCallback((e) => {
    e.preventDefault();
    const tableData = JSON.parse(e.dataTransfer.getData('table'));
    const canvasRect = e.currentTarget.getBoundingClientRect();
    
    if (canvasRect) {
      const position = {
        x: e.clientX - canvasRect.left - 125, // Center the node
        y: e.clientY - canvasRect.top - 100
      };

      const newNode = {
        id: `${tableData.id}_${Date.now()}`,
        type: 'table',
        position,
        data: {
          label: tableData.name,
          fields: tableData.fields
        }
      };

      setNodes(prev => [...prev, newNode]);
    }
  }, []);

  const handleTableDragStart = (table) => {
    return (e) => {
      e.dataTransfer.setData('table', JSON.stringify(table));
    };
  };

  const generateSQL = () => {
    if (edges.length === 0) {
      return '-- 请拖拽表格到画布并创建连接';
    }

    const usedTables = new Set();
    edges.forEach(edge => {
      usedTables.add(edge.source);
      usedTables.add(edge.target);
    });

    const tableList = Array.from(usedTables);
    let sql = 'SELECT\n';
    
    // Add columns from all used tables
    const allColumns = tableList.map(tableId => {
      const table = nodes.find(n => n.id === tableId);
      return table?.data.fields.map(field => `  ${table.data.label}.${field.name}`) || [];
    }).flat();
    
    if (allColumns.length > 0) {
      sql += allColumns.join(',\n') + '\n';
      sql += `FROM ${nodes.find(n => n.id === tableList[0])?.data.label}\n`;
      
      // Add JOIN clauses
      edges.forEach(edge => {
        const sourceTable = nodes.find(n => n.id === edge.source)?.data.label;
        const targetTable = nodes.find(n => n.id === edge.target)?.data.label;
        sql += `${edge.label || 'INNER JOIN'} ${targetTable} ON ${sourceTable}.${edge.sourceHandle} = ${targetTable}.${edge.targetHandle}\n`;
      });
    } else {
      sql = '-- 请先添加表格到画布';
    }

    return sql;
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className={classes.root}>
      {/* 主体内容区域 */}
      <div className={classes.mainContent}>
        {/* 左侧表格列表 */}
        <div className={classes.sidebar}>
          <div className={classes.sidebarHeader}>
            <Typography variant="h6" gutterBottom>
              数据表列表
            </Typography>
            <Typography variant="body2" color="textSecondary">
              拖拽表格到右侧画布中开始构建查询
            </Typography>
          </div>
          
          <div className={classes.tableList}>
            {availableTables.map((table) => (
              <Card
                key={table.id}
                className={classes.tableItem}
                draggable
                onDragStart={handleTableDragStart(table)}
              >
                <CardContent style={{ padding: '12px' }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TableChart color="primary" style={{ marginRight: 8 }} />
                    <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                      {table.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {table.description}
                  </Typography>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      {table.fields.length} 个字段
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 右侧画布区域 */}
        <div className={classes.canvas}>
          <ReactFlowProvider>
            {/* 工具栏 */}
            <div className={classes.toolbar}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<CodeIcon />}
                onClick={() => {
                  const sql = generateSQL();
                  navigator.clipboard.writeText(sql);
                  alert('SQL已复制到剪贴板！\n\n' + sql);
                }}
                disabled={edges.length === 0}
              >
                复制SQL
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={clearCanvas}
              >
                清空画布
              </Button>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onDrop={handleTableDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: '100%', height: '100%' }}
            >
              <MiniMap style={{ background: '#f8f9fa' }} />
              <Controls />
              <Background color="#e0e0e0" gap={20} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* 底部SQL预览区域 */}
      <div className={classes.sqlPanel}>
        <div className={classes.sqlHeader}>
          <Typography variant="h6">
            生成的SQL查询
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Chip 
              label={`${edges.length} 个连接`} 
              size="small" 
              color={edges.length > 0 ? "primary" : "default"}
            />
            <Chip 
              label={`${nodes.length} 个表格`} 
              size="small" 
              color={nodes.length > 0 ? "secondary" : "default"}
            />
          </Box>
        </div>
        <div className={classes.sqlContent}>
          {generateSQL()}
        </div>
      </div>
    </div>
  );
} 