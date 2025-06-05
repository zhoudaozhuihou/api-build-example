import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Tooltip,
  Collapse,
  TextField,
  Button,
  Divider
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FileCopy as CopyIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ViewModule as TableViewIcon,
  Code as JsonViewIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  viewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  tableContainer: {
    maxHeight: 400,
    overflow: 'auto',
  },
  jsonContainer: {
    maxHeight: 400,
    overflow: 'auto',
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  indentCell: {
    paddingLeft: (props) => theme.spacing(2 + props.level * 2),
  },
  typeChip: {
    height: 20,
    fontSize: '0.75rem',
  },
  actionButton: {
    padding: theme.spacing(0.5),
  },
  editField: {
    minWidth: 200,
  },
  keyField: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  valueField: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
  },
  expandButton: {
    padding: theme.spacing(0.25),
  },
}));

// 获取数据类型颜色
const getTypeColor = (type) => {
  const colors = {
    string: '#1976d2',
    number: '#388e3c', 
    boolean: '#7b1fa2',
    object: '#f57c00',
    array: '#d32f2f',
    null: '#616161',
    undefined: '#616161'
  };
  return colors[type] || '#616161';
};

// 格式化显示值
const formatDisplayValue = (value, type) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  
  if (type === 'object') {
    const keys = Object.keys(value || {});
    return `{ ${keys.length} properties }`;
  }
  
  if (type === 'array') {
    return `[ ${(value || []).length} items ]`;
  }
  
  if (type === 'string') {
    return `"${value}"`;
  }
  
  return String(value);
};

// 将JSON数据扁平化为表格行
const flattenJsonToRows = (data, expandedPaths = new Set(), parentPath = '', level = 0) => {
  const rows = [];
  
  if (data && typeof data === 'object') {
    const entries = Array.isArray(data) 
      ? data.map((item, index) => [index, item])
      : Object.entries(data);
    
    entries.forEach(([key, value]) => {
      const fullPath = parentPath ? `${parentPath}.${key}` : String(key);
      const type = Array.isArray(value) ? 'array' : typeof value;
      const hasChildren = (typeof value === 'object' && value !== null);
      const isExpanded = expandedPaths.has(fullPath);
      
      const row = {
        id: fullPath,
        key,
        value,
        type,
        level,
        hasChildren,
        isExpanded,
        fullPath,
        parentPath,
      };
      
      rows.push(row);
      
      // 如果展开且有子项，递归添加子项
      if (isExpanded && hasChildren) {
        const childRows = flattenJsonToRows(value, expandedPaths, fullPath, level + 1);
        rows.push(...childRows);
      }
    });
  }
  
  return rows;
};

// 表格视图组件
const TableView = ({ data, onDataChange, isEditable, expandedPaths, onToggleExpand, onEdit }) => {
  const classes = useStyles();
  const [editingRow, setEditingRow] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const rows = flattenJsonToRows(data, expandedPaths);
  
  const handleStartEdit = (row) => {
    setEditingRow(row.id);
    setEditValue(row.type === 'object' || row.type === 'array' 
      ? JSON.stringify(row.value, null, 2) 
      : String(row.value));
  };
  
  const handleSaveEdit = (row) => {
    try {
      let newValue = editValue;
      
      // 尝试解析JSON格式
      if (row.type === 'object' || row.type === 'array') {
        newValue = JSON.parse(editValue);
      } else if (row.type === 'number') {
        newValue = Number(editValue);
      } else if (row.type === 'boolean') {
        newValue = editValue.toLowerCase() === 'true';
      }
      
      onEdit && onEdit(row.fullPath, newValue);
      setEditingRow(null);
    } catch (error) {
      alert('格式错误: ' + error.message);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValue('');
  };
  
  return (
    <TableContainer className={classes.tableContainer}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width="40%">字段名</TableCell>
            <TableCell width="35%">值</TableCell>
            <TableCell width="15%">类型</TableCell>
            {isEditable && <TableCell width="10%">操作</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className={classes.tableRow}>
              <TableCell className={classes.indentCell} style={{ paddingLeft: 8 + row.level * 16 }}>
                <Box display="flex" alignItems="center">
                  {row.hasChildren && (
                    <IconButton
                      className={classes.expandButton}
                      onClick={() => onToggleExpand(row.fullPath)}
                    >
                      {row.isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  )}
                  <Typography className={classes.keyField} variant="body2">
                    {Array.isArray(data) && row.level === 0 ? `[${row.key}]` : row.key}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                {editingRow === row.id ? (
                  <TextField
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    size="small"
                    fullWidth
                    multiline={row.type === 'object' || row.type === 'array'}
                    rows={row.type === 'object' || row.type === 'array' ? 3 : 1}
                    className={classes.editField}
                  />
                ) : (
                  <Typography className={classes.valueField} variant="body2">
                    {formatDisplayValue(row.value, row.type)}
                  </Typography>
                )}
              </TableCell>
              
              <TableCell>
                <Chip
                  label={row.type}
                  size="small"
                  className={classes.typeChip}
                  style={{ 
                    backgroundColor: getTypeColor(row.type),
                    color: 'white'
                  }}
                />
              </TableCell>
              
              {isEditable && (
                <TableCell>
                  {editingRow === row.id ? (
                    <Box display="flex">
                      <IconButton
                        className={classes.actionButton}
                        onClick={() => handleSaveEdit(row)}
                      >
                        <SaveIcon fontSize="small" style={{ color: 'green' }} />
                      </IconButton>
                      <IconButton
                        className={classes.actionButton}
                        onClick={handleCancelEdit}
                      >
                        <CancelIcon fontSize="small" style={{ color: 'red' }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton
                      className={classes.actionButton}
                      onClick={() => handleStartEdit(row)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// JSON视图组件
const JsonView = ({ data, onDataChange, isEditable }) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  
  useEffect(() => {
    setJsonText(JSON.stringify(data, null, 2));
  }, [data]);
  
  const handleSaveJson = () => {
    try {
      const newData = JSON.parse(jsonText);
      onDataChange && onDataChange(newData);
      setIsEditing(false);
    } catch (error) {
      alert('JSON格式错误: ' + error.message);
    }
  };
  
  const handleCancelEdit = () => {
    setJsonText(JSON.stringify(data, null, 2));
    setIsEditing(false);
  };
  
  return (
    <Box className={classes.jsonContainer}>
      {isEditable && (
        <Box mb={1} display="flex" justifyContent="flex-end">
          {isEditing ? (
            <Box>
              <Button
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSaveJson}
                style={{ marginRight: 8, color: 'green' }}
              >
                保存
              </Button>
              <Button
                size="small"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
                style={{ color: 'red' }}
              >
                取消
              </Button>
            </Box>
          ) : (
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              编辑
            </Button>
          )}
        </Box>
      )}
      
      {isEditing ? (
        <TextField
          fullWidth
          multiline
          rows={15}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          variant="outlined"
          style={{ fontFamily: 'monospace' }}
        />
      ) : (
        <pre style={{ 
          margin: 0, 
          fontFamily: 'monospace', 
          fontSize: '0.875rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </Box>
  );
};

// 主组件
const JsonTableDisplay = ({ 
  data, 
  title, 
  onDataChange, 
  onCopy, 
  isCopied, 
  isEditable = false,
  defaultView = 'table' // 'table' 或 'json'
}) => {
  const classes = useStyles();
  const [viewMode, setViewMode] = useState(defaultView);
  const [expandedPaths, setExpandedPaths] = useState(new Set([''])); // 默认展开根级
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleToggleExpand = (path) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };
  
  const handleEdit = (path, newValue) => {
    if (!onDataChange) return;
    
    // 创建新的数据对象
    const newData = JSON.parse(JSON.stringify(data));
    
    // 根据路径更新值
    const pathParts = path.split('.');
    let current = newData;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    
    const lastPart = pathParts[pathParts.length - 1];
    current[lastPart] = newValue;
    
    onDataChange(newData);
  };
  
  const formatJson = (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  return (
    <Paper variant="outlined" className={classes.root}>
      <Box className={classes.header}>
        <Box display="flex" alignItems="center">
          <IconButton 
            size="small" 
            onClick={() => setIsExpanded(!isExpanded)}
            className={classes.expandButton}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
        
        <Box className={classes.viewToggle}>
          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'table'}
                onChange={(e) => setViewMode(e.target.checked ? 'table' : 'json')}
                color="primary"
                size="small"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                {viewMode === 'table' ? <TableViewIcon fontSize="small" /> : <JsonViewIcon fontSize="small" />}
                {viewMode === 'table' ? '表格' : 'JSON'}
              </Box>
            }
            labelPlacement="start"
          />
          
          <Divider orientation="vertical" flexItem style={{ margin: '0 8px' }} />
          
          <Tooltip title="复制JSON">
            <IconButton 
              size="small" 
              onClick={() => onCopy && onCopy(formatJson(data))}
            >
              {isCopied ? <DoneIcon style={{ color: 'green' }} /> : <CopyIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Collapse in={isExpanded}>
        {viewMode === 'table' ? (
          <TableView
            data={data}
            onDataChange={onDataChange}
            isEditable={isEditable}
            expandedPaths={expandedPaths}
            onToggleExpand={handleToggleExpand}
            onEdit={handleEdit}
          />
        ) : (
          <JsonView
            data={data}
            onDataChange={onDataChange}
            isEditable={isEditable}
          />
        )}
      </Collapse>
    </Paper>
  );
};

export default JsonTableDisplay; 