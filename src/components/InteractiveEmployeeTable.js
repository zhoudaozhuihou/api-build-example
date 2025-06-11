import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  CircularProgress,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
  },
  cardHeader: {
    paddingBottom: theme.spacing(1),
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  buttonSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  editModeRow: {
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  normalRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  editInput: {
    '& .MuiInputBase-input': {
      padding: theme.spacing(0.5, 1),
      fontSize: '0.875rem',
    },
  },
  statusChip: {
    fontWeight: 'bold',
  },
  descriptionText: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
  instructionsBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  instructionItem: {
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '&:before': {
      content: '"•"',
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
  },
  savedDataCard: {
    backgroundColor: theme.palette.grey[50],
  },
  tableContainer: {
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  tableCell: {
    minWidth: '120px',
    '&:first-child': {
      minWidth: '60px',
    },
  },
}));

const initialData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    department: "Engineering",
    salary: "$75,000",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Designer",
    department: "Design",
    salary: "$70,000",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Manager",
    department: "Engineering",
    salary: "$90,000",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Analyst",
    department: "Marketing",
    salary: "$65,000",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@example.com",
    role: "Developer",
    department: "Engineering",
    salary: "$72,000",
  },
];

const InteractiveEmployeeTable = () => {
  const classes = useStyles();
  const [savedData, setSavedData] = useState(initialData);
  const [editData, setEditData] = useState(initialData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (rowId, field, value) => {
    setEditData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  const enterEditMode = () => {
    setEditData([...savedData]);
    setIsEditMode(true);
  };

  const saveAllChanges = async () => {
    // 验证数据
    const errors = validateAllData();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setSaveMessage('请修正表单中的错误后再保存');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage('');
    
    try {
      // 模拟保存延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedData([...editData]);
      setIsEditMode(false);
      setSaveMessage('保存成功！');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('保存失败，请重试');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditData([...savedData]);
    setIsEditMode(false);
    setValidationErrors({});
    setSaveMessage('');
  };

  const hasChanges = () => {
    return JSON.stringify(savedData) !== JSON.stringify(editData);
  };

  // 添加新行
  const addNewRow = () => {
    const newId = Math.max(...editData.map(row => row.id)) + 1;
    const newRow = {
      id: newId,
      name: "",
      email: "",
      role: "",
      department: "",
      salary: "",
    };
    setEditData([...editData, newRow]);
  };

  // 删除行
  const deleteRow = (rowId) => {
    setEditData(editData.filter(row => row.id !== rowId));
  };

  // 字段验证
  const validateRow = (row) => {
    const errors = {};
    if (!row.name.trim()) errors.name = '姓名不能为空';
    if (!row.email.trim()) errors.email = '邮箱不能为空';
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.email = '邮箱格式不正确';
    }
    if (!row.role.trim()) errors.role = '职位不能为空';
    if (!row.department.trim()) errors.department = '部门不能为空';
    return errors;
  };

  // 验证所有数据
  const validateAllData = () => {
    const allErrors = {};
    editData.forEach(row => {
      const rowErrors = validateRow(row);
      if (Object.keys(rowErrors).length > 0) {
        allErrors[row.id] = rowErrors;
      }
    });
    return allErrors;
  };

  const renderTableCell = (row, field, label) => {
    const hasError = validationErrors[row.id] && validationErrors[row.id][field];
    
    return (
      <TableCell className={classes.tableCell}>
        {isEditMode ? (
          <Box>
            <TextField
              value={row[field]}
              onChange={(e) => handleInputChange(row.id, field, e.target.value)}
              variant="outlined"
              size="small"
              className={classes.editInput}
              placeholder={`输入${label}`}
              fullWidth
              type={field === 'email' ? 'email' : 'text'}
              error={hasError}
              helperText={hasError ? validationErrors[row.id][field] : ''}
            />
          </Box>
        ) : (
          <Typography variant="body2">{row[field]}</Typography>
        )}
      </TableCell>
    );
  };

  return (
    <div className={classes.root}>
      {/* 主编辑表格 */}
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader}>
          <Box className={classes.headerContent}>
            <Box className={classes.titleSection}>
              <PersonIcon color="primary" />
              <Box>
                <Typography variant="h5" component="h2">
                  Interactive Employee Table
                </Typography>
                <Typography variant="body2" className={classes.descriptionText}>
                  {isEditMode 
                    ? "编辑模式：修改表格内容后点击保存" 
                    : "点击编辑按钮开始编辑整个表格"
                  }
                </Typography>
              </Box>
            </Box>
            
            <Box className={classes.buttonSection}>
              {!isEditMode ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={enterEditMode}
                    size="small"
                  >
                    编辑表格
                  </Button>
                  <Chip
                    icon={<CheckIcon />}
                    label="已保存"
                    color="primary"
                    variant="outlined"
                    className={classes.statusChip}
                  />
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addNewRow}
                    size="small"
                    disabled={saving}
                  >
                    添加行
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={cancelEdit}
                    size="small"
                    disabled={saving}
                  >
                    取消
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                    onClick={saveAllChanges}
                    disabled={!hasChanges() || saving}
                    size="small"
                  >
                    {saving ? '保存中...' : '保存修改'}
                  </Button>
                </>
              )}
              
              {saveMessage && (
                <Chip
                  icon={saveMessage.includes('成功') ? <CheckIcon /> : <WarningIcon />}
                  label={saveMessage}
                  color={saveMessage.includes('成功') ? 'primary' : 'secondary'}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </CardHeader>

        <CardContent>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      ID
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      姓名
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      邮箱
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      职位
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      部门
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      薪资
                    </Typography>
                  </TableCell>
                  {isEditMode && (
                    <TableCell className={classes.tableCell}>
                      <Typography variant="subtitle2" color="textSecondary">
                        操作
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {(isEditMode ? editData : savedData).map((row) => (
                  <TableRow
                    key={row.id}
                    className={isEditMode ? classes.editModeRow : classes.normalRow}
                  >
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2" color="textSecondary">
                        {row.id}
                      </Typography>
                    </TableCell>
                    {renderTableCell(row, 'name', '姓名')}
                    {renderTableCell(row, 'email', '邮箱')}
                    {renderTableCell(row, 'role', '职位')}
                    {renderTableCell(row, 'department', '部门')}
                    {renderTableCell(row, 'salary', '薪资')}
                    {isEditMode && (
                      <TableCell className={classes.tableCell}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteRow(row.id)}
                          disabled={saving || editData.length === 1}
                        >
                          删除
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 操作说明 */}
          <Box className={classes.instructionsBox}>
            <Typography variant="subtitle2" gutterBottom>
              操作说明：
            </Typography>
            {isEditMode ? (
              <>
                <Typography variant="body2" className={classes.instructionItem}>
                  当前处于编辑模式，所有字段都可以修改
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  点击"添加行"可以新增员工记录
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  点击行末的"删除"按钮可以删除该行（至少保留一行）
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  系统会验证必填字段和邮箱格式
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  修改完成后点击"保存修改"按钮保存所有更改
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  点击"取消"按钮放弃所有修改
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" className={classes.instructionItem}>
                  点击"编辑表格"按钮进入编辑模式
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  编辑模式下可以同时修改多个字段、添加和删除行
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  支持表单验证，确保数据完整性
                </Typography>
                <Typography variant="body2" className={classes.instructionItem}>
                  保存后所有修改将被应用到已保存数据中
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* 已保存数据展示 */}
      <Card className={`${classes.card} ${classes.savedDataCard}`}>
        <CardHeader className={classes.cardHeader}>
          <Typography variant="h6" component="h3">
            已保存的数据
          </Typography>
          <Typography variant="body2" className={classes.descriptionText}>
            显示当前已保存的表格数据状态
          </Typography>
        </CardHeader>
        
        <CardContent>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      ID
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      姓名
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      邮箱
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      职位
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      部门
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="subtitle2" color="textSecondary">
                      薪资
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedData.map((row) => (
                  <TableRow key={row.id} className={classes.normalRow}>
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2" color="textSecondary">
                        {row.id}
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2">{row.name}</Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2">{row.email}</Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2">{row.role}</Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2">{row.department}</Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Typography variant="body2">{row.salary}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveEmployeeTable; 