import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Tooltip,
  Snackbar,
  CircularProgress,
  Divider,
  Grid
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  TableChart,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  DragIndicator,
  Code as CodeIcon,
  PlayArrow as PlayIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
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
    backgroundImage: `
      radial-gradient(circle, #e0e0e0 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    overflow: 'hidden',
  },
  canvasContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  tableCard: {
    position: 'absolute',
    width: 280,
    minHeight: 200,
    cursor: 'move',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    backgroundColor: 'white',
    zIndex: 10,
    '&:hover': {
      boxShadow: theme.shadows[8],
    },
  },
  tableCardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(1, 2),
    '& .MuiCardHeader-title': {
      fontSize: '1rem',
      fontWeight: 'bold',
    },
  },
  tableCardContent: {
    padding: theme.spacing(1),
    maxHeight: 300,
    overflow: 'auto',
  },
  columnItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.25, 0),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      transform: 'translateX(2px)',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
    },
  },
  connectionPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    border: `2px solid white`,
    cursor: 'crosshair',
    zIndex: 20,
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  connectionLine: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 5,
  },
  joinLabel: {
    position: 'absolute',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    zIndex: 15,
    cursor: 'pointer',
  },
  toolbar: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1),
    zIndex: 30,
  },
  sqlPreviewDialog: {
    '& .MuiDialog-paper': {
      maxWidth: '80vw',
      maxHeight: '80vh',
    },
  },
  sqlPreview: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(2),
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    minHeight: 200,
    overflow: 'auto',
  },
  dragHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    zIndex: 1,
  },
  '@global': {
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.4)',
      },
      '70%': {
        boxShadow: '0 0 0 6px rgba(255, 152, 0, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)',
      },
    },
  },
}));

const VisualJoinBuilder = ({ connection, onSave, onBack }) => {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const [tables, setTables] = useState([]);
  const [canvasTables, setCanvasTables] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggedTable, setDraggedTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sqlDialogOpen, setSqlDialogOpen] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [joinTypeDialogOpen, setJoinTypeDialogOpen] = useState(false);

  // Mock data for demonstration
  const mockTables = [
    { 
      id: 1, 
      name: 'users', 
      description: '用户信息表', 
      columns: [
        { id: 1, name: 'id', type: 'INT', isPrimary: true, description: '主键ID' },
        { id: 2, name: 'name', type: 'VARCHAR(100)', description: '用户名称' },
        { id: 3, name: 'email', type: 'VARCHAR(255)', description: '用户邮箱' },
        { id: 4, name: 'created_at', type: 'DATETIME', description: '创建时间' },
        { id: 5, name: 'department_id', type: 'INT', description: '部门ID' },
      ]
    },
    { 
      id: 2, 
      name: 'orders', 
      description: '订单信息表', 
      columns: [
        { id: 1, name: 'id', type: 'INT', isPrimary: true, description: '主键ID' },
        { id: 2, name: 'user_id', type: 'INT', description: '用户ID' },
        { id: 3, name: 'product_id', type: 'INT', description: '产品ID' },
        { id: 4, name: 'quantity', type: 'INT', description: '数量' },
        { id: 5, name: 'total_amount', type: 'DECIMAL(10,2)', description: '总金额' },
        { id: 6, name: 'order_date', type: 'DATETIME', description: '订单日期' },
      ]
    },
    { 
      id: 3, 
      name: 'products', 
      description: '产品信息表', 
      columns: [
        { id: 1, name: 'id', type: 'INT', isPrimary: true, description: '主键ID' },
        { id: 2, name: 'name', type: 'VARCHAR(200)', description: '产品名称' },
        { id: 3, name: 'price', type: 'DECIMAL(10,2)', description: '产品价格' },
        { id: 4, name: 'category_id', type: 'INT', description: '分类ID' },
        { id: 5, name: 'stock_quantity', type: 'INT', description: '库存数量' },
      ]
    },
    { 
      id: 4, 
      name: 'departments', 
      description: '部门信息表', 
      columns: [
        { id: 1, name: 'id', type: 'INT', isPrimary: true, description: '主键ID' },
        { id: 2, name: 'name', type: 'VARCHAR(100)', description: '部门名称' },
        { id: 3, name: 'manager_id', type: 'INT', description: '部门经理ID' },
        { id: 4, name: 'budget', type: 'DECIMAL(12,2)', description: '部门预算' },
      ]
    },
    { 
      id: 5, 
      name: 'categories', 
      description: '产品分类表', 
      columns: [
        { id: 1, name: 'id', type: 'INT', isPrimary: true, description: '主键ID' },
        { id: 2, name: 'name', type: 'VARCHAR(100)', description: '分类名称' },
        { id: 3, name: 'parent_id', type: 'INT', description: '父级分类ID' },
      ]
    },
  ];

  useEffect(() => {
    setTables(mockTables);
  }, []);

  // Handle mouse move for dragging and temporary connections
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }

      if (draggedTable) {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
          const newPosition = {
            x: e.clientX - canvasRect.left - dragOffset.x,
            y: e.clientY - canvasRect.top - dragOffset.y
          };
          
          setCanvasTables(prev => 
            prev.map(table => 
              table.canvasId === draggedTable.canvasId 
                ? { ...table, position: newPosition }
                : table
            )
          );
        }
      }
    };

    const handleMouseUp = () => {
      setDraggedTable(null);
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
        setTempConnection(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedTable, dragOffset, isConnecting]);

  const handleTableDrop = useCallback((e) => {
    e.preventDefault();
    const tableData = JSON.parse(e.dataTransfer.getData('table'));
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    
    if (canvasRect) {
      const position = {
        x: e.clientX - canvasRect.left - 140, // Center the card
        y: e.clientY - canvasRect.top - 100
      };

      const canvasTable = {
        ...tableData,
        canvasId: `canvas_${Date.now()}_${Math.random()}`,
        position
      };

      setCanvasTables(prev => [...prev, canvasTable]);
      showNotification('表格已添加到画布', 'success');
    }
  }, []);

  const handleTableDragStart = (table) => {
    return (e) => {
      e.dataTransfer.setData('table', JSON.stringify(table));
    };
  };

  const handleCanvasTableMouseDown = (canvasTable) => {
    return (e) => {
      // Don't start dragging if clicking on a column item
      if (e.target.closest('.column-item-clickable')) {
        return;
      }
      
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDraggedTable(canvasTable);
    };
  };

  const handleColumnClick = (canvasTable, column) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling to table drag handler
      
      console.log('Column clicked:', {
        table: canvasTable.name,
        column: column.name,
        isConnecting,
        connectionStart: connectionStart ? {
          table: connectionStart.tableName,
          column: connectionStart.column.name
        } : null
      });
      
      if (isConnecting && connectionStart) {
        // Complete connection
        if (connectionStart.canvasId !== canvasTable.canvasId) {
          const newConnection = {
            id: `conn_${Date.now()}`,
            sourceTable: connectionStart.canvasId,
            sourceColumn: connectionStart.column.name,
            sourceTableName: canvasTables.find(t => t.canvasId === connectionStart.canvasId)?.name,
            targetTable: canvasTable.canvasId,
            targetColumn: column.name,
            targetTableName: canvasTable.name,
            joinType: 'INNER JOIN'
          };
          setConnections(prev => [...prev, newConnection]);
          showNotification(`连接已创建: ${newConnection.sourceTableName}.${newConnection.sourceColumn} → ${newConnection.targetTableName}.${newConnection.targetColumn}`, 'success');
        } else {
          showNotification('不能连接同一个表格的字段', 'warning');
        }
        setIsConnecting(false);
        setConnectionStart(null);
        setTempConnection(null);
      } else {
        // Start connection
        setIsConnecting(true);
        setConnectionStart({ canvasId: canvasTable.canvasId, column, tableName: canvasTable.name });
        showNotification(`开始连接: ${canvasTable.name}.${column.name}`, 'info');
      }
    };
  };

  const removeTableFromCanvas = (canvasId) => {
    setCanvasTables(prev => prev.filter(table => table.canvasId !== canvasId));
    setConnections(prev => prev.filter(conn => 
      conn.sourceTable !== canvasId && conn.targetTable !== canvasId
    ));
    showNotification('表格已从画布移除', 'info');
  };

  const removeConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    showNotification('连接已删除', 'info');
  };

  const editConnection = (connection) => {
    setEditingConnection(connection);
    setJoinTypeDialogOpen(true);
  };

  const updateJoinType = (newJoinType) => {
    if (editingConnection) {
      setConnections(prev => prev.map(conn => 
        conn.id === editingConnection.id 
          ? { ...conn, joinType: newJoinType }
          : conn
      ));
      showNotification(`JOIN类型已更新为: ${newJoinType}`, 'success');
    }
    setJoinTypeDialogOpen(false);
    setEditingConnection(null);
  };

  const generateSQL = () => {
    if (canvasTables.length === 0) {
      setGeneratedSQL('-- 请先添加表格到画布');
      return;
    }

    if (canvasTables.length === 1) {
      const table = canvasTables[0];
      setGeneratedSQL(`SELECT * FROM ${table.name};`);
      return;
    }

    let sql = 'SELECT\n';
    
    // Add columns from all tables
    const allColumns = canvasTables.map(table => 
      table.columns.map(col => `  ${table.name}.${col.name}`)
    ).flat();
    sql += allColumns.join(',\n') + '\n';
    
    // Add FROM clause
    sql += `FROM ${canvasTables[0].name}\n`;
    
    // Add JOIN clauses
    connections.forEach(conn => {
      const sourceTable = canvasTables.find(t => t.canvasId === conn.sourceTable);
      const targetTable = canvasTables.find(t => t.canvasId === conn.targetTable);
      if (sourceTable && targetTable) {
        sql += `${conn.joinType} ${targetTable.name} ON ${sourceTable.name}.${conn.sourceColumn} = ${targetTable.name}.${conn.targetColumn}\n`;
      }
    });

    setGeneratedSQL(sql);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const getFieldPosition = (table, columnName) => {
    const cardHeaderHeight = 60; // CardHeader height
    const columnHeight = 32; // Each column item height
    const columnIndex = table.columns.findIndex(col => col.name === columnName);
    
    return {
      x: table.position.x,
      y: table.position.y + cardHeaderHeight + (columnIndex * columnHeight) + 16
    };
  };

  const renderConnectionLines = () => {
    const lines = [];
    
    connections.forEach(conn => {
      const sourceTable = canvasTables.find(t => t.canvasId === conn.sourceTable);
      const targetTable = canvasTables.find(t => t.canvasId === conn.targetTable);
      
      if (sourceTable && targetTable) {
        // Get precise field positions
        const sourcePos = getFieldPosition(sourceTable, conn.sourceColumn);
        const targetPos = getFieldPosition(targetTable, conn.targetColumn);
        
        const sourceX = sourcePos.x + 280; // Right edge of source card
        const sourceY = sourcePos.y;
        const targetX = targetPos.x; // Left edge of target card
        const targetY = targetPos.y;
        
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;
        
        // Create curved path for better visual appeal
        const controlX1 = sourceX + 50;
        const controlY1 = sourceY;
        const controlX2 = targetX - 50;
        const controlY2 = targetY;
        
        const pathData = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
        
        lines.push(
          <g key={conn.id}>
            {/* Connection path */}
            <path
              d={pathData}
              stroke="#2196f3"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              style={{ cursor: 'pointer' }}
            />
            
            {/* Source connection point */}
            <circle
              cx={sourceX}
              cy={sourceY}
              r="4"
              fill="#2196f3"
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Target connection point */}
            <circle
              cx={targetX}
              cy={targetY}
              r="4"
              fill="#2196f3"
              stroke="white"
              strokeWidth="2"
            />
            
            {/* JOIN type label - clickable for editing */}
            <g onClick={() => editConnection(conn)} style={{ cursor: 'pointer' }}>
              <rect
                x={midX - 45}
                y={midY - 12}
                width="90"
                height="24"
                fill="white"
                stroke="#2196f3"
                strokeWidth="2"
                rx="12"
                className="join-label-bg"
              />
              <text
                x={midX}
                y={midY + 5}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#2196f3"
                className="join-label-text"
              >
                {conn.joinType.replace(' JOIN', '')}
              </text>
            </g>
            
            {/* Delete button */}
            <g 
              onClick={(e) => {
                e.stopPropagation();
                removeConnection(conn.id);
              }} 
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={midX + 50}
                cy={midY - 20}
                r="8"
                fill="#f44336"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x={midX + 50}
                y={midY - 16}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
              >
                ×
              </text>
            </g>
          </g>
        );
      }
    });
    
    // Temporary connection line while dragging
    if (isConnecting && connectionStart) {
      const sourceTable = canvasTables.find(t => t.canvasId === connectionStart.canvasId);
      if (sourceTable) {
        const sourcePos = getFieldPosition(sourceTable, connectionStart.column.name);
        const sourceX = sourcePos.x + 280;
        const sourceY = sourcePos.y;
        
        lines.push(
          <g key="temp">
            <path
              d={`M ${sourceX} ${sourceY} Q ${(sourceX + mousePosition.x) / 2} ${sourceY - 50} ${mousePosition.x} ${mousePosition.y}`}
              stroke="#ff9800"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              opacity="0.8"
            />
            <circle
              cx={sourceX}
              cy={sourceY}
              r="6"
              fill="#ff9800"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={sourceX + 10}
              y={sourceY - 10}
              fontSize="12"
              fill="#ff9800"
              fontWeight="bold"
            >
              {connectionStart.tableName}.{connectionStart.column.name}
            </text>
          </g>
        );
      }
    }
    
    return (
      <svg
        className={classes.connectionLine}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#2196f3"
            />
          </marker>
        </defs>
        {lines}
      </svg>
    );
  };

  return (
    <div className={classes.root}>
      {/* Sidebar with table list */}
      <div className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <Typography variant="h6" gutterBottom>
            数据表列表
          </Typography>
          <Typography variant="body2" color="textSecondary">
            拖拽表格到画布中开始构建查询
          </Typography>
        </div>
        
        <div className={classes.tableList}>
          {tables.map((table) => (
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
                    {table.columns.length} 个字段
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div 
        className={classes.canvas}
        ref={canvasRef}
        onDrop={handleTableDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={(e) => {
          // Cancel connection if clicking on empty canvas
          if (isConnecting && e.target === e.currentTarget) {
            setIsConnecting(false);
            setConnectionStart(null);
            setTempConnection(null);
            showNotification('连接已取消', 'info');
          }
        }}
        style={{ 
          cursor: isConnecting ? 'crosshair' : 'default',
          backgroundColor: isConnecting ? '#f0f8ff' : '#f8f9fa'
        }}
      >
        <div className={classes.canvasContent}>
          {canvasTables.length === 0 && (
            <div className={classes.dragHint}>
              <TableChart style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }} />
              <Typography variant="h6" color="textSecondary">
                拖拽表格到这里开始设计
              </Typography>
              <Typography variant="body2" color="textSecondary">
                点击字段创建表间连接关系
              </Typography>
            </div>
          )}

          {/* Render connection lines */}
          {renderConnectionLines()}

          {/* Render table cards */}
          {canvasTables.map((table) => (
            <Card
              key={table.canvasId}
              className={classes.tableCard}
              style={{
                left: table.position.x,
                top: table.position.y,
              }}
              onMouseDown={handleCanvasTableMouseDown(table)}
            >
              <CardHeader
                className={classes.tableCardHeader}
                title={table.name}
                subheader={table.description}
                action={
                  <IconButton
                    size="small"
                    onClick={() => removeTableFromCanvas(table.canvasId)}
                    style={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent className={classes.tableCardContent}>
                {table.columns.map((column) => {
                  const isSelected = connectionStart?.canvasId === table.canvasId && 
                                   connectionStart?.column.id === column.id;
                  const isConnected = connections.some(conn => 
                    (conn.sourceTable === table.canvasId && conn.sourceColumn === column.name) ||
                    (conn.targetTable === table.canvasId && conn.targetColumn === column.name)
                  );
                  const isConnectable = isConnecting && connectionStart && 
                                       connectionStart.canvasId !== table.canvasId;
                  
                  return (
                    <div
                      key={column.id}
                      className={`${classes.columnItem} column-item-clickable`}
                      onClick={handleColumnClick(table, column)}
                      style={{
                        backgroundColor: isSelected 
                          ? '#e3f2fd' 
                          : isConnected 
                            ? '#f3e5f5' 
                            : isConnectable
                              ? '#fff3e0'
                              : 'transparent',
                        borderColor: isSelected 
                          ? '#2196f3' 
                          : isConnected 
                            ? '#9c27b0' 
                            : isConnectable
                              ? '#ff9800'
                              : '#e0e0e0',
                        borderWidth: isSelected || isConnected || isConnectable ? '2px' : '1px',
                        position: 'relative',
                        cursor: isConnectable ? 'crosshair' : 'pointer',
                        animation: isConnectable ? 'pulse 1s infinite' : 'none'
                      }}
                    >
                      <Box display="flex" alignItems="center" flex={1}>
                        <Typography variant="body2" style={{ fontWeight: column.isPrimary ? 'bold' : 'normal' }}>
                          {column.name}
                        </Typography>
                        {column.isPrimary && (
                          <Chip size="small" label="PK" color="primary" style={{ marginLeft: 8, height: 16 }} />
                        )}
                        {isConnected && (
                          <LinkIcon style={{ marginLeft: 4, fontSize: 16, color: '#9c27b0' }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {column.type}
                      </Typography>
                      
                      {/* Connection indicators */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          right: -6,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: '#ff9800',
                          border: '2px solid white',
                          zIndex: 10
                        }} />
                      )}
                      
                      {isConnected && !isSelected && (
                        <div style={{
                          position: 'absolute',
                          right: -6,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#9c27b0',
                          border: '1px solid white',
                          zIndex: 10
                        }} />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Status Panel */}
        {isConnecting && connectionStart && (
          <Paper
            style={{
              position: 'absolute',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 20px',
              zIndex: 100,
              backgroundColor: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <LinkIcon style={{ color: '#ff9800' }} />
              <Typography variant="body1" style={{ fontWeight: 'bold', color: '#e65100' }}>
                正在连接: {connectionStart.tableName}.{connectionStart.column.name}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setIsConnecting(false);
                  setConnectionStart(null);
                  setTempConnection(null);
                  showNotification('连接已取消', 'info');
                }}
              >
                取消
              </Button>
            </Box>
            <Typography variant="caption" style={{ color: '#bf360c', marginTop: 4 }}>
              点击另一个表格的字段完成连接，或点击空白区域取消
            </Typography>
          </Paper>
        )}

        {/* Toolbar */}
        <div className={classes.toolbar}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CodeIcon />}
            onClick={() => {
              generateSQL();
              setSqlDialogOpen(true);
            }}
            disabled={canvasTables.length === 0}
          >
            生成SQL
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setCanvasTables([]);
              setConnections([]);
              setIsConnecting(false);
              setConnectionStart(null);
            }}
          >
            清空画布
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
          >
            返回
          </Button>
        </div>
      </div>

      {/* SQL Preview Dialog */}
      <Dialog
        open={sqlDialogOpen}
        onClose={() => setSqlDialogOpen(false)}
        className={classes.sqlPreviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            生成的SQL查询
            <IconButton onClick={() => setSqlDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <div className={classes.sqlPreview}>
            {generatedSQL}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(generatedSQL);
              showNotification('SQL已复制到剪贴板', 'success');
            }}
            color="primary"
          >
            复制SQL
          </Button>
          <Button
            onClick={() => setSqlDialogOpen(false)}
            color="primary"
            variant="contained"
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      {/* JOIN Type Selection Dialog */}
      <Dialog
        open={joinTypeDialogOpen}
        onClose={() => setJoinTypeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            选择JOIN类型
            <IconButton onClick={() => setJoinTypeDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingConnection && (
            <Box>
              <Typography variant="body1" gutterBottom>
                当前连接: <strong>{editingConnection.sourceTableName}.{editingConnection.sourceColumn}</strong> → <strong>{editingConnection.targetTableName}.{editingConnection.targetColumn}</strong>
              </Typography>
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  选择JOIN类型:
                </Typography>
                <Grid container spacing={2}>
                  {['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'].map((joinType) => (
                    <Grid item xs={6} key={joinType}>
                      <Button
                        variant={editingConnection.joinType === joinType ? "contained" : "outlined"}
                        color="primary"
                        fullWidth
                        onClick={() => updateJoinType(joinType)}
                        style={{ 
                          height: 60,
                          flexDirection: 'column',
                          fontSize: '0.9rem'
                        }}
                      >
                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                          {joinType.replace(' JOIN', '')}
                        </Typography>
                        <Typography variant="caption" style={{ marginTop: 4 }}>
                          {joinType === 'INNER JOIN' && '内连接'}
                          {joinType === 'LEFT JOIN' && '左连接'}
                          {joinType === 'RIGHT JOIN' && '右连接'}
                          {joinType === 'FULL JOIN' && '全连接'}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinTypeDialogOpen(false)} color="primary">
            取消
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VisualJoinBuilder; 