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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import {
  TableChart,
  Code as CodeIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
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
  const [selectedFields, setSelectedFields] = React.useState(
    data.fields.reduce((acc, field) => ({ 
      ...acc, 
      [field.name]: { selected: true, alias: '', aggregateFunc: '' }
    }), {})
  );
  const [configDialog, setConfigDialog] = React.useState({ open: false, fieldName: '', fieldConfig: {} });

  // 通知父组件字段选择变化
  const handleFieldToggle = (fieldName) => {
    const newSelection = { 
      ...selectedFields, 
      [fieldName]: { 
        ...selectedFields[fieldName], 
        selected: !selectedFields[fieldName].selected 
      }
    };
    setSelectedFields(newSelection);
    
    // 触发事件通知父组件
    window.dispatchEvent(new CustomEvent('updateFieldSelection', {
      detail: { nodeId: data.nodeId, fieldName, selected: !selectedFields[fieldName].selected }
    }));
  };

  // 打开字段配置对话框
  const openFieldConfig = (fieldName) => {
    setConfigDialog({
      open: true,
      fieldName,
      fieldConfig: { ...selectedFields[fieldName] }
    });
  };

  // 保存字段配置
  const saveFieldConfig = () => {
    const newSelection = {
      ...selectedFields,
      [configDialog.fieldName]: configDialog.fieldConfig
    };
    setSelectedFields(newSelection);
    
    // 触发事件通知父组件
    window.dispatchEvent(new CustomEvent('updateFieldConfig', {
      detail: { 
        nodeId: data.nodeId, 
        fieldName: configDialog.fieldName, 
        config: configDialog.fieldConfig 
      }
    }));
    
    setConfigDialog({ open: false, fieldName: '', fieldConfig: {} });
  };

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
              background: selectedFields[field.name]?.selected 
                ? (field.isPrimary ? '#e3f2fd' : '#f5f5f5')
                : '#fafafa',
              border: `1px solid ${field.isPrimary ? '#2196f3' : '#e0e0e0'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: selectedFields[field.name]?.selected ? 1 : 0.6
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <input
                type="checkbox"
                checked={selectedFields[field.name]?.selected || false}
                onChange={() => handleFieldToggle(field.name)}
                style={{ marginRight: 4 }}
              />
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
              {(selectedFields[field.name]?.alias || selectedFields[field.name]?.aggregateFunc) && (
                <span style={{ 
                  background: '#ff9800', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: 4, 
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  配置
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => openFieldConfig(field.name)}
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: '2px 4px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  color: '#666'
                }}
                title="配置字段"
              >
                ⚙️
              </button>
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
      
      {/* 字段配置对话框 */}
      <Dialog 
        open={configDialog.open} 
        onClose={() => setConfigDialog({ open: false, fieldName: '', fieldConfig: {} })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>配置字段: {configDialog.fieldName}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>聚合函数</InputLabel>
              <Select
                value={configDialog.fieldConfig.aggregateFunc || ''}
                onChange={(e) => setConfigDialog(prev => ({
                  ...prev,
                  fieldConfig: { ...prev.fieldConfig, aggregateFunc: e.target.value }
                }))}
              >
                <MenuItem value="">无</MenuItem>
                <MenuItem value="COUNT">COUNT - 计数</MenuItem>
                <MenuItem value="SUM">SUM - 求和</MenuItem>
                <MenuItem value="AVG">AVG - 平均值</MenuItem>
                <MenuItem value="MAX">MAX - 最大值</MenuItem>
                <MenuItem value="MIN">MIN - 最小值</MenuItem>
                <MenuItem value="COUNT(DISTINCT">COUNT(DISTINCT) - 去重计数</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="字段别名"
              value={configDialog.fieldConfig.alias || ''}
              onChange={(e) => setConfigDialog(prev => ({
                ...prev,
                fieldConfig: { ...prev.fieldConfig, alias: e.target.value }
              }))}
              placeholder="为字段设置别名"
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={configDialog.fieldConfig.selected || false}
                  onChange={(e) => setConfigDialog(prev => ({
                    ...prev,
                    fieldConfig: { ...prev.fieldConfig, selected: e.target.checked }
                  }))}
                />
              }
              label="选择此字段"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog({ open: false, fieldName: '', fieldConfig: {} })}>
            取消
          </Button>
          <Button onClick={saveFieldConfig} color="primary" variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
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
  
  // 查询构建器状态
  const [querySettings, setQuerySettings] = useState({
    selectedFields: {},  // { nodeId: { fieldName: { selected: boolean, alias: string, aggregateFunc: string } } }
    whereConditions: [], // { field: 'table.field', operator: '=', value: 'value' }
    groupByFields: [],   // ['table.field']
    havingConditions: [], // { field: 'table.field', operator: '=', value: 'value' }
    orderByFields: [],   // { field: 'table.field', direction: 'ASC|DESC' }
    distinct: false,
    limit: null,
    offset: null
  });

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

    const handleFieldSelection = (event) => {
      const { nodeId, fieldName, selected } = event.detail;
      setQuerySettings(prev => ({
        ...prev,
        selectedFields: {
          ...prev.selectedFields,
          [nodeId]: {
            ...prev.selectedFields[nodeId],
            [fieldName]: {
              selected: selected,
              alias: prev.selectedFields[nodeId]?.[fieldName]?.alias || '',
              aggregateFunc: prev.selectedFields[nodeId]?.[fieldName]?.aggregateFunc || ''
            }
          }
        }
      }));
    };

    const handleFieldConfig = (event) => {
      const { nodeId, fieldName, config } = event.detail;
      setQuerySettings(prev => ({
        ...prev,
        selectedFields: {
          ...prev.selectedFields,
          [nodeId]: {
            ...prev.selectedFields[nodeId],
            [fieldName]: config
          }
        }
      }));
    };

    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    window.addEventListener('updateFieldSelection', handleFieldSelection);
    window.addEventListener('updateFieldConfig', handleFieldConfig);
    
    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
      window.removeEventListener('updateFieldSelection', handleFieldSelection);
      window.removeEventListener('updateFieldConfig', handleFieldConfig);
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

      const nodeId = `${tableData.id}_${Date.now()}`;
      const newNode = {
        id: nodeId,
        type: 'table',
        position,
        data: {
          label: tableData.name,
          fields: tableData.fields,
          nodeId: nodeId  // 确保节点数据包含ID
        }
      };

      setNodes(prev => [...prev, newNode]);
      
      // 初始化字段选择状态
      setQuerySettings(prev => ({
        ...prev,
        selectedFields: {
          ...prev.selectedFields,
          [nodeId]: tableData.fields.reduce((acc, field) => ({ 
            ...acc, 
            [field.name]: { selected: true, alias: '', aggregateFunc: '' }
          }), {})
        }
      }));
    }
  }, []);

  const handleTableDragStart = (table) => {
    return (e) => {
      e.dataTransfer.setData('table', JSON.stringify(table));
    };
  };

  const generateSQL = () => {
    if (nodes.length === 0) {
      return '-- 请拖拽表格到画布开始构建查询';
    }

    let sql = '';
    
    // 1. SELECT 子句
    sql += querySettings.distinct ? 'SELECT DISTINCT\n' : 'SELECT\n';
    
    // 收集选中的字段
    const selectedColumns = [];
    nodes.forEach(node => {
      const nodeId = node.id;
      const tableName = node.data.label;
      const fieldSelections = querySettings.selectedFields[nodeId] || {};
      
      node.data.fields.forEach(field => {
        const fieldConfig = fieldSelections[field.name];
        if (fieldConfig?.selected) {
          let columnExpr = `${tableName}.${field.name}`;
          
          // 添加聚合函数
          if (fieldConfig.aggregateFunc) {
            if (fieldConfig.aggregateFunc === 'COUNT(DISTINCT') {
              columnExpr = `COUNT(DISTINCT ${columnExpr})`;
            } else {
              columnExpr = `${fieldConfig.aggregateFunc}(${columnExpr})`;
            }
          }
          
          // 添加别名
          if (fieldConfig.alias) {
            columnExpr += ` AS ${fieldConfig.alias}`;
          }
          
          selectedColumns.push(`  ${columnExpr}`);
        }
      });
    });
    
    if (selectedColumns.length === 0) {
      selectedColumns.push('  *');
    }
    
    sql += selectedColumns.join(',\n') + '\n';
    
    // 2. FROM 子句
    if (nodes.length > 0) {
      const firstTable = nodes[0].data.label;
      sql += `FROM ${firstTable}\n`;
    }
    
    // 3. JOIN 子句
    edges.forEach(edge => {
      const sourceTable = nodes.find(n => n.id === edge.source)?.data.label;
      const targetTable = nodes.find(n => n.id === edge.target)?.data.label;
      if (sourceTable && targetTable) {
        sql += `${edge.label || 'INNER JOIN'} ${targetTable} ON ${sourceTable}.${edge.sourceHandle} = ${targetTable}.${edge.targetHandle}\n`;
      }
    });
    
    // 4. WHERE 子句
    if (querySettings.whereConditions.length > 0 && querySettings.whereConditions.some(cond => cond.field && cond.value)) {
      sql += 'WHERE ';
      const conditions = querySettings.whereConditions
        .filter(cond => cond.field && cond.value)
        .map(cond => {
          let value = cond.value;
          // 如果操作符是IN，保持原样；如果是数字，不加引号；否则加引号
          if (cond.operator === 'IN') {
            value = `(${cond.value})`;
          } else if (isNaN(cond.value)) {
            value = `'${cond.value}'`;
          }
          return `${cond.field} ${cond.operator} ${value}`;
        });
      sql += conditions.join(' AND ') + '\n';
    }
    
    // 5. GROUP BY 子句
    if (querySettings.groupByFields.length > 0) {
      sql += 'GROUP BY ' + querySettings.groupByFields.join(', ') + '\n';
    }
    
    // 6. HAVING 子句
    if (querySettings.havingConditions.length > 0) {
      sql += 'HAVING ';
      const havingConds = querySettings.havingConditions.map(cond => 
        `${cond.field} ${cond.operator} '${cond.value}'`
      );
      sql += havingConds.join(' AND ') + '\n';
    }
    
    // 7. ORDER BY 子句
    if (querySettings.orderByFields.length > 0 && querySettings.orderByFields.some(order => order.field)) {
      sql += 'ORDER BY ';
      const orderFields = querySettings.orderByFields
        .filter(order => order.field)
        .map(order => `${order.field} ${order.direction}`);
      sql += orderFields.join(', ') + '\n';
    }
    
    // 8. LIMIT 和 OFFSET 子句
    if (querySettings.limit) {
      sql += `LIMIT ${querySettings.limit}`;
      if (querySettings.offset) {
        sql += ` OFFSET ${querySettings.offset}`;
      }
      sql += '\n';
    }
    
    return sql.trim() + ';';
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setQuerySettings({
      selectedFields: {},
      whereConditions: [],
      groupByFields: [],
      havingConditions: [],
      orderByFields: [],
      distinct: false,
      limit: null,
      offset: null
    });
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
            
            {/* 查询配置面板 */}
            {nodes.length > 0 && (
              <Box mt={2}>
                {/* 基本设置 */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center">
                      <SettingsIcon color="primary" style={{ marginRight: 8 }} />
                      <Typography variant="subtitle2">基本设置</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails style={{ flexDirection: 'column' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={querySettings.distinct}
                          onChange={(e) => setQuerySettings(prev => ({ ...prev, distinct: e.target.checked }))}
                        />
                      }
                      label="DISTINCT (去重)"
                    />
                    
                    <Box display="flex" gap={1}>
                      <TextField
                        label="LIMIT"
                        type="number"
                        value={querySettings.limit || ''}
                        onChange={(e) => setQuerySettings(prev => ({ ...prev, limit: e.target.value || null }))}
                        size="small"
                        style={{ flex: 1 }}
                      />
                      <TextField
                        label="OFFSET"
                        type="number"
                        value={querySettings.offset || ''}
                        onChange={(e) => setQuerySettings(prev => ({ ...prev, offset: e.target.value || null }))}
                        size="small"
                        style={{ flex: 1 }}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* WHERE条件 */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">WHERE 条件</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ flexDirection: 'column' }}>
                    {querySettings.whereConditions.map((condition, index) => (
                      <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                        <FormControl size="small" style={{ minWidth: 120 }}>
                          <InputLabel>字段</InputLabel>
                          <Select
                            value={condition.field}
                            onChange={(e) => {
                              const newConditions = [...querySettings.whereConditions];
                              newConditions[index].field = e.target.value;
                              setQuerySettings(prev => ({ ...prev, whereConditions: newConditions }));
                            }}
                          >
                            {nodes.map(node => 
                              node.data.fields.map(field => (
                                <MenuItem key={`${node.data.label}.${field.name}`} value={`${node.data.label}.${field.name}`}>
                                  {node.data.label}.{field.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        
                        <FormControl size="small" style={{ minWidth: 80 }}>
                          <InputLabel>操作符</InputLabel>
                          <Select
                            value={condition.operator}
                            onChange={(e) => {
                              const newConditions = [...querySettings.whereConditions];
                              newConditions[index].operator = e.target.value;
                              setQuerySettings(prev => ({ ...prev, whereConditions: newConditions }));
                            }}
                          >
                            <MenuItem value="=">=</MenuItem>
                            <MenuItem value="!=">!=</MenuItem>
                            <MenuItem value=">">&gt;</MenuItem>
                            <MenuItem value=">=">&gt;=</MenuItem>
                            <MenuItem value="<">&lt;</MenuItem>
                            <MenuItem value="<=">&lt;=</MenuItem>
                            <MenuItem value="LIKE">LIKE</MenuItem>
                            <MenuItem value="IN">IN</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <TextField
                          label="值"
                          size="small"
                          value={condition.value}
                          onChange={(e) => {
                            const newConditions = [...querySettings.whereConditions];
                            newConditions[index].value = e.target.value;
                            setQuerySettings(prev => ({ ...prev, whereConditions: newConditions }));
                          }}
                          style={{ flex: 1 }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => {
                            const newConditions = querySettings.whereConditions.filter((_, i) => i !== index);
                            setQuerySettings(prev => ({ ...prev, whereConditions: newConditions }));
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setQuerySettings(prev => ({
                          ...prev,
                          whereConditions: [...prev.whereConditions, { field: '', operator: '=', value: '' }]
                        }));
                      }}
                      size="small"
                      variant="outlined"
                    >
                      添加条件
                    </Button>
                  </AccordionDetails>
                </Accordion>

                {/* GROUP BY */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">GROUP BY</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ flexDirection: 'column' }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>选择分组字段</InputLabel>
                      <Select
                        multiple
                        value={querySettings.groupByFields}
                        onChange={(e) => setQuerySettings(prev => ({ ...prev, groupByFields: e.target.value }))}
                      >
                        {nodes.map(node => 
                          node.data.fields.map(field => (
                            <MenuItem key={`${node.data.label}.${field.name}`} value={`${node.data.label}.${field.name}`}>
                              {node.data.label}.{field.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                {/* ORDER BY */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">ORDER BY</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ flexDirection: 'column' }}>
                    {querySettings.orderByFields.map((order, index) => (
                      <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                        <FormControl size="small" style={{ flex: 1 }}>
                          <InputLabel>字段</InputLabel>
                          <Select
                            value={order.field}
                            onChange={(e) => {
                              const newOrders = [...querySettings.orderByFields];
                              newOrders[index].field = e.target.value;
                              setQuerySettings(prev => ({ ...prev, orderByFields: newOrders }));
                            }}
                          >
                            {nodes.map(node => 
                              node.data.fields.map(field => (
                                <MenuItem key={`${node.data.label}.${field.name}`} value={`${node.data.label}.${field.name}`}>
                                  {node.data.label}.{field.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        
                        <FormControl size="small" style={{ minWidth: 100 }}>
                          <InputLabel>排序</InputLabel>
                          <Select
                            value={order.direction}
                            onChange={(e) => {
                              const newOrders = [...querySettings.orderByFields];
                              newOrders[index].direction = e.target.value;
                              setQuerySettings(prev => ({ ...prev, orderByFields: newOrders }));
                            }}
                          >
                            <MenuItem value="ASC">升序 (ASC)</MenuItem>
                            <MenuItem value="DESC">降序 (DESC)</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <IconButton
                          size="small"
                          onClick={() => {
                            const newOrders = querySettings.orderByFields.filter((_, i) => i !== index);
                            setQuerySettings(prev => ({ ...prev, orderByFields: newOrders }));
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setQuerySettings(prev => ({
                          ...prev,
                          orderByFields: [...prev.orderByFields, { field: '', direction: 'ASC' }]
                        }));
                      }}
                      size="small"
                      variant="outlined"
                    >
                      添加排序
                    </Button>
                  </AccordionDetails>
                </Accordion>
                
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                  💡 提示：在表格节点中勾选/取消字段来选择要查询的列
                </Typography>
              </Box>
            )}
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
                disabled={nodes.length === 0}
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