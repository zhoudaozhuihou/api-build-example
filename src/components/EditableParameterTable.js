import React, { useState, useRef, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  IconButton,
  Chip,
  Tooltip,
  ClickAwayListener,
  makeStyles,
  useTheme,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  RestoreFromTrash as ResetIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  headerButton: {
    color: 'white',
    borderColor: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5),
  },
  tableContainer: {
    maxHeight: 500,
    overflow: 'auto',
  },
  table: {
    '& .MuiTableHead-root': {
      backgroundColor: '#f8f9fa',
    },
    '& .MuiTableCell-head': {
      fontWeight: 600,
      color: '#495057',
      borderBottom: '2px solid #dee2e6',
      fontSize: '0.875rem',
    },
    '& .MuiTableCell-body': {
      borderBottom: '1px solid #dee2e6',
      fontSize: '0.875rem',
    },
  },
  editableCell: {
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
    '&.editing': {
      backgroundColor: '#e3f2fd',
      border: '2px solid #2196f3',
    },
    '&.modified': {
      backgroundColor: '#fff3e0',
      borderLeft: '4px solid #ff9800',
    },
  },
  cellContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  editInput: {
    '& .MuiInputBase-root': {
      fontSize: '0.875rem',
    },
    '& .MuiInputBase-input': {
      padding: '4px 8px',
    },
  },
  validationIcon: {
    fontSize: '1rem',
    marginLeft: theme.spacing(1),
  },
  validIcon: {
    color: '#4caf50',
  },
  invalidIcon: {
    color: '#f44336',
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  actionButton: {
    padding: '4px',
    minWidth: 'auto',
  },
  typeChip: {
    fontSize: '0.75rem',
    height: 20,
  },
  requiredChip: {
    fontSize: '0.7rem',
    height: 18,
  },
  newRow: {
    backgroundColor: '#e8f5e9',
  },
}));

const PARAMETER_TYPES = [
  'string',
  'integer', 
  'number',
  'boolean',
  'array',
  'object',
  'date',
  'file'
];

const EditableParameterTable = ({ 
  parameters = [], 
  onParametersChange, 
  title = "Interactive Parameter Table",
  subtitle = "Click on any cell to edit. Changes are highlighted until saved.",
  editable = true 
}) => {
  const classes = useStyles();
  const theme = useTheme();
  
  // 状态管理
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [modifiedRows, setModifiedRows] = useState(new Set());
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // 输入框引用
  const inputRef = useRef(null);

  // 初始化数据
  useEffect(() => {
    const normalizedData = parameters.map((param, index) => ({
      id: param.id || `param_${index}`,
      name: param.name || '',
      type: param.type || 'string',
      required: Boolean(param.required),
      description: param.description || '',
      defaultValue: param.defaultValue || '',
      _isNew: false
    }));
    setData(normalizedData);
    setOriginalData(JSON.parse(JSON.stringify(normalizedData)));
  }, [parameters]);

  // 自动聚焦编辑输入框
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }
  }, [editingCell]);

  // 验证单元格值
  const validateCell = (field, value, row) => {
    switch (field) {
      case 'name':
        return value.trim().length > 0 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
      case 'type':
        return PARAMETER_TYPES.includes(value);
      case 'description':
        return value.trim().length > 0;
      default:
        return true;
    }
  };

  // 处理单元格点击
  const handleCellClick = (rowId, field, currentValue) => {
    if (!editable) return;
    if (field === 'required') return; // Switch 特殊处理
    
    setEditingCell({ rowId, field });
    setEditValue(currentValue?.toString() || '');
  };

  // 处理值变更
  const handleValueChange = (event) => {
    setEditValue(event.target.value);
  };

  // 保存单元格编辑
  const handleSaveCell = () => {
    if (!editingCell) return;

    const { rowId, field } = editingCell;
    const row = data.find(r => r.id === rowId);
    
    if (!row) return;

    // 类型转换
    let processedValue = editValue;
    if (field === 'required') {
      processedValue = editValue === 'true' || editValue === true;
    }

    // 更新数据
    const newData = data.map(r => 
      r.id === rowId 
        ? { ...r, [field]: processedValue }
        : r
    );
    
    setData(newData);
    
    // 标记行为已修改
    const original = originalData.find(r => r.id === rowId);
    if (original && original[field] !== processedValue) {
      setModifiedRows(prev => new Set([...prev, rowId]));
    } else if (original && original[field] === processedValue) {
      setModifiedRows(prev => {
        const newSet = new Set(prev);
        // 检查该行是否还有其他修改
        const currentRow = newData.find(r => r.id === rowId);
        const hasOtherChanges = Object.keys(currentRow).some(key => 
          key !== '_isNew' && original[key] !== currentRow[key]
        );
        if (!hasOtherChanges) {
          newSet.delete(rowId);
        }
        return newSet;
      });
    }

    setEditingCell(null);
    setEditValue('');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // 处理 Switch 切换
  const handleSwitchChange = (rowId, checked) => {
    if (!editable) return;
    
    const newData = data.map(r => 
      r.id === rowId 
        ? { ...r, required: checked }
        : r
    );
    
    setData(newData);
    
    // 标记行为已修改
    const original = originalData.find(r => r.id === rowId);
    if (original && original.required !== checked) {
      setModifiedRows(prev => new Set([...prev, rowId]));
    }
  };

  // 添加新参数
  const handleAddParameter = () => {
    const newParam = {
      id: `param_${Date.now()}`,
      name: '',
      type: 'string',
      required: false,
      description: '',
      defaultValue: '',
      _isNew: true
    };
    
    setData(prev => [...prev, newParam]);
    setModifiedRows(prev => new Set([...prev, newParam.id]));
    
    // 自动开始编辑名称
    setTimeout(() => {
      handleCellClick(newParam.id, 'name', '');
    }, 100);
  };

  // 删除参数
  const handleDeleteParameter = (rowId) => {
    setData(prev => prev.filter(r => r.id !== rowId));
    setModifiedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });
    
    showNotification('参数已删除', 'info');
  };

  // 保存所有更改
  const handleSaveAll = () => {
    // 验证所有数据
    const hasErrors = data.some(row => 
      !validateCell('name', row.name, row) ||
      !validateCell('type', row.type, row) ||
      !validateCell('description', row.description, row)
    );

    if (hasErrors) {
      showNotification('请检查并修正所有验证错误', 'error');
      return;
    }

    // 过滤掉空名称的参数
    const validData = data.filter(row => row.name.trim().length > 0);
    
    // 清理数据（移除内部字段）
    const cleanData = validData.map(({ _isNew, ...rest }) => rest);
    
    // 更新原始数据
    setOriginalData(JSON.parse(JSON.stringify(validData)));
    setModifiedRows(new Set());
    
    // 触发父组件回调
    if (onParametersChange) {
      onParametersChange(cleanData);
    }
    
    showNotification(`成功保存 ${cleanData.length} 个参数`, 'success');
  };

  // 重置更改
  const handleReset = () => {
    setData(JSON.parse(JSON.stringify(originalData)));
    setModifiedRows(new Set());
    setEditingCell(null);
    setEditValue('');
    showNotification('已重置所有更改', 'info');
  };

  // 显示通知
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // 渲染可编辑单元格
  const renderEditableCell = (row, field, value) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === field;
    const isModified = modifiedRows.has(row.id);
    const isValid = validateCell(field, value, row);
    
    if (isEditing) {
      if (field === 'type') {
        return (
          <ClickAwayListener onClickAway={handleSaveCell}>
            <FormControl fullWidth size="small" className={classes.editInput}>
              <Select
                value={editValue}
                onChange={handleValueChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCell();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              >
                {PARAMETER_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ClickAwayListener>
        );
      }
      
      return (
        <ClickAwayListener onClickAway={handleSaveCell}>
          <Box display="flex" alignItems="center">
            <TextField
              ref={inputRef}
              fullWidth
              size="small"
              value={editValue}
              onChange={handleValueChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCell();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className={classes.editInput}
              placeholder={field === 'name' ? '参数名称' : '请输入...'}
            />
            <Box className={classes.actionButtons}>
              <IconButton 
                size="small" 
                onClick={handleSaveCell}
                className={classes.actionButton}
                style={{ color: '#4caf50' }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleCancelEdit}
                className={classes.actionButton}
                style={{ color: '#f44336' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </ClickAwayListener>
      );
    }

    return (
      <Box 
        className={classes.cellContent}
        onClick={() => handleCellClick(row.id, field, value)}
      >
        <span>{value || (field === 'name' ? '点击编辑' : '')}</span>
        {editable && (
          <>
            {isValid ? (
              <CheckIcon className={`${classes.validationIcon} ${classes.validIcon}`} />
            ) : (
              <CloseIcon className={`${classes.validationIcon} ${classes.invalidIcon}`} />
            )}
          </>
        )}
      </Box>
    );
  };

  // 渲染类型芯片
  const renderTypeChip = (type) => {
    const colorMap = {
      string: '#2196f3',
      integer: '#4caf50', 
      number: '#4caf50',
      boolean: '#ff9800',
      array: '#9c27b0',
      object: '#673ab7',
      date: '#795548',
      file: '#607d8b'
    };

    return (
      <Chip
        label={type}
        size="small"
        className={classes.typeChip}
        style={{ 
          backgroundColor: colorMap[type] || '#757575',
          color: 'white'
        }}
      />
    );
  };

  return (
    <Paper className={classes.root}>
      {/* 表格头部 */}
      <Box className={classes.header}>
        <Box>
          <Typography variant="h6" className={classes.headerTitle}>
            <EditIcon />
            {title}
          </Typography>
          <Typography className={classes.subtitle}>
            {subtitle}
          </Typography>
        </Box>
        <Box className={classes.headerActions}>
          <Tooltip title="重置所有更改">
            <Button
              variant="outlined"
              size="small"
              onClick={handleReset}
              disabled={modifiedRows.size === 0}
              className={classes.headerButton}
              startIcon={<ResetIcon />}
            >
              Reset
            </Button>
          </Tooltip>
          <Tooltip title="保存所有更改">
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveAll}
              disabled={modifiedRows.size === 0}
              style={{ 
                backgroundColor: '#4caf50', 
                color: 'white',
                '&:hover': { backgroundColor: '#45a049' }
              }}
              startIcon={<SaveIcon />}
            >
              Save All
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* 数据表格 */}
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell width="5%">ID</TableCell>
              <TableCell width="20%">Name</TableCell>
              <TableCell width="15%">Type</TableCell>
              <TableCell width="15%">Required</TableCell>
              <TableCell width="30%">Description</TableCell>
              <TableCell width="10%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const isModified = modifiedRows.has(row.id);
              const isNew = row._isNew;
              
              return (
                <TableRow 
                  key={row.id}
                  className={isNew ? classes.newRow : ''}
                  style={{
                    backgroundColor: isModified && !isNew ? '#fff3e0' : undefined
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  
                  <TableCell 
                    className={`${classes.editableCell} ${
                      editingCell?.rowId === row.id && editingCell?.field === 'name' ? 'editing' : ''
                    } ${isModified ? 'modified' : ''}`}
                  >
                    {renderEditableCell(row, 'name', row.name)}
                  </TableCell>
                  
                  <TableCell 
                    className={`${classes.editableCell} ${
                      editingCell?.rowId === row.id && editingCell?.field === 'type' ? 'editing' : ''
                    }`}
                  >
                    {editingCell?.rowId === row.id && editingCell?.field === 'type' 
                      ? renderEditableCell(row, 'type', row.type)
                      : renderTypeChip(row.type)
                    }
                  </TableCell>
                  
                  <TableCell>
                    <Switch
                      checked={row.required}
                      onChange={(e) => handleSwitchChange(row.id, e.target.checked)}
                      disabled={!editable}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  
                  <TableCell 
                    className={`${classes.editableCell} ${
                      editingCell?.rowId === row.id && editingCell?.field === 'description' ? 'editing' : ''
                    } ${isModified ? 'modified' : ''}`}
                  >
                    {renderEditableCell(row, 'description', row.description)}
                  </TableCell>
                  
                  <TableCell>
                    <Box className={classes.actionButtons}>
                      {editable && (
                        <Tooltip title="删除参数">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteParameter(row.id)}
                            style={{ color: '#f44336' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* 添加新行按钮 */}
            {editable && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center', padding: '16px' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddParameter}
                    startIcon={<AddIcon />}
                    style={{ color: '#1976d2', borderColor: '#1976d2' }}
                  >
                    添加新参数
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 通知提示 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EditableParameterTable; 