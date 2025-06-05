import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Grid, 
  Chip, 
  Divider, 
  Paper, 
  Tabs, 
  Tab, 
  Box,
  IconButton,
  createTheme,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Collapse,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@material-ui/core';
import { 
  Close as CloseIcon, 
  Code as CodeIcon, 
  Http as HttpIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  Timeline as TimelineIcon,
  AccountTree as LineageIcon,
  FileCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Done as DoneIcon,
  Settings as SettingsIcon,
  VpnKey as VpnKeyIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@material-ui/icons';
import MUIRichTextEditor from 'mui-rte';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import ApiLineage from './ApiLineage';
import EditableParameterTable from './EditableParameterTable';
import JsonTableDisplay from './JsonTableDisplay';

const defaultTheme = createTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '8px 16px',
      },
      head: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
      },
    },
  },
});

// Utility function to format JSON with indentation
const formatJson = (json) => {
  try {
    return JSON.stringify(json, null, 2);
  } catch (e) {
    return String(json);
  }
};

// Utility function to copy text to clipboard
const copyToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

// JSON Tree component to display nested JSON
const JsonTree = ({ data, level = 0, path = '', onEdit = null, isEditable = false }) => {
  const [expanded, setExpanded] = useState(level < 2); // Auto-expand first two levels
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    setEditValue(typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data));
    setIsEditing(true);
  };
  
  const handleSave = (e) => {
    e.stopPropagation();
    try {
      // Try to parse as JSON if it's an object
      const newValue = typeof data === 'object' ? JSON.parse(editValue) : editValue;
      onEdit && onEdit(path, newValue);
      setIsEditing(false);
    } catch (error) {
      alert('Invalid JSON format: ' + error.message);
    }
  };
  
  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
  };
  
  if (data === null) return <span style={{ color: '#999' }}>null</span>;
  if (data === undefined) return <span style={{ color: '#999' }}>undefined</span>;
  
  // For primitive values (not objects)
  if (typeof data !== 'object' || data === null) {
    const displayValue = typeof data === 'string' ? `"${data}"` : String(data);
    
    if (isEditing && isEditable) {
      return (
        <Box display="flex" alignItems="center">
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            size="small"
            fullWidth
            autoFocus
            variant="outlined"
          />
          <IconButton size="small" onClick={handleSave}>
            <SaveIcon fontSize="small" style={{ color: 'green' }} />
          </IconButton>
          <IconButton size="small" onClick={handleCancel}>
            <CancelIcon fontSize="small" style={{ color: 'red' }} />
          </IconButton>
        </Box>
      );
    }
    
    return (
      <Box display="flex" alignItems="center">
        <span style={{ 
          color: typeof data === 'number' ? '#0c7' : 
                 typeof data === 'boolean' ? '#c07' : '#b0b' 
        }}>
          {displayValue}
        </span>
        {isEditable && onEdit && (
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" style={{ color: '#777', fontSize: '0.8rem' }} />
          </IconButton>
        )}
      </Box>
    );
  }
  
  const isArray = Array.isArray(data);
  const items = isArray ? data : Object.keys(data);
  
  if (items.length === 0) {
    return <span>{isArray ? '[]' : '{}'}</span>;
  }
  
  if (isEditing && isEditable) {
    return (
      <Box>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          multiline
          rows={5}
          fullWidth
          variant="outlined"
          size="small"
        />
        <Box mt={1}>
          <Button 
            size="small" 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            保存
          </Button>
          <Button 
            size="small" 
            style={{ marginLeft: 8 }} 
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            取消
          </Button>
        </Box>
      </Box>
    );
  }
  
  return (
    <div style={{ paddingLeft: level > 0 ? 20 : 0 }}>
      <Box display="flex" alignItems="center">
        <IconButton size="small" onClick={toggleExpand}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
        <Typography variant="body2" component="span">
          {isArray ? `Array[${items.length}]` : 'Object'} 
          {path && <span style={{ color: '#777' }}>{path ? ` - ${path}` : ''}</span>}
        </Typography>
        <Box ml="auto" display="flex">
          {isEditable && onEdit && (
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" style={{ color: '#777' }} />
            </IconButton>
          )}
          <Tooltip title="复制">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(formatJson(data));
              }}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Collapse in={expanded}>
        <div>
          {isArray ? (
            items.map((item, index) => (
              <div key={index} style={{ margin: '4px 0' }}>
                <Box display="flex">
                  <Typography variant="body2" component="span" style={{ minWidth: 40, color: '#777' }}>
                    [{index}]:
                  </Typography>
                  <JsonTree 
                    data={item} 
                    level={level + 1} 
                    path={`${path}[${index}]`}
                    onEdit={onEdit}
                    isEditable={isEditable} 
                  />
                </Box>
              </div>
            ))
          ) : (
            Object.keys(data).map((key) => (
              <div key={key} style={{ margin: '4px 0' }}>
                <Box display="flex">
                  <Typography variant="body2" component="span" style={{ minWidth: 120, color: '#777' }}>
                    {key}:
                  </Typography>
                  <JsonTree 
                    data={data[key]} 
                    level={level + 1} 
                    path={path ? `${path}.${key}` : key}
                    onEdit={onEdit}
                    isEditable={isEditable}
                  />
                </Box>
              </div>
            ))
          )}
        </div>
      </Collapse>
    </div>
  );
};

// JSON display component with copy button
const JsonDisplay = ({ data, title, onCopy, isCopied, onEdit, isEditable = false }) => {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <Paper variant="outlined" style={{ marginBottom: 16 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        px={2} 
        py={1}
        bgcolor="#f5f5f5"
      >
        <Typography variant="subtitle1">
          <Box display="flex" alignItems="center">
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            {title}
          </Box>
        </Typography>
        <Box>
          {isEditable && (
            <FormControlLabel
              control={
                <Switch
                  checked={isEditable}
                  onChange={() => onEdit && onEdit(!isEditable)}
                  color="primary"
                  size="small"
                />
              }
              label="编辑模式"
              labelPlacement="start"
            />
          )}
          <Tooltip title="复制JSON">
            <IconButton size="small" onClick={onCopy}>
              {isCopied ? <DoneIcon style={{ color: 'green' }} /> : <CopyIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box p={2} bgcolor="#fafafa" style={{ maxHeight: isEditable ? 'none' : '300px', overflow: 'auto' }}>
          {isEditable ? (
            <JsonTree 
              data={data} 
              onEdit={(path, value) => onEdit && onEdit(path, value)}
              isEditable={true}
            />
          ) : (
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {formatJson(data)}
            </pre>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-detail-tabpanel-${index}`}
      aria-labelledby={`api-detail-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `api-detail-tab-${index}`,
    'aria-controls': `api-detail-tabpanel-${index}`,
  };
}

const ApiDetailDialog = ({ open, onClose, api }) => {
  const [tabValue, setTabValue] = useState(0);
  const [lineageDialogOpen, setLineageDialogOpen] = useState(false);
  const [editorState, setEditorState] = useState(null);
  const [copiedField, setCopiedField] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editableApi, setEditableApi] = useState(api);
  const [editableData, setEditableData] = useState({
    requestHeaders: null,
    requestBody: null,
    responseHeaders: null,
    responseBody: null,
    parameters: null
  });
  const [richTextKey, setRichTextKey] = useState(Date.now());
  
  // Mock data for demonstration
  const mockRequestHeaders = {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-API-Key": "your-api-key-here"
  };

  const mockResponseHeaders = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "X-Rate-Limit": "100",
    "X-Rate-Limit-Remaining": "99"
  };

  const mockRequestBody = {
    "username": "example_user",
    "filters": {
      "status": "active",
      "type": "premium",
      "categories": ["news", "sports", "entertainment"]
    },
    "pagination": {
      "page": 1,
      "pageSize": 20
    },
    "sort": {
      "field": "createdAt",
      "order": "desc"
    }
  };

  const mockResponseBody = {
    "success": true,
    "data": {
      "totalItems": 342,
      "totalPages": 18,
      "currentPage": 1,
      "items": [
        {
          "id": "item-123",
          "name": "示例项目",
          "description": "这是一个项目描述",
          "status": "active",
          "metadata": {
            "createdAt": "2023-05-15T08:30:00Z",
            "createdBy": "user-456",
            "tags": ["important", "featured"]
          }
        },
        {
          "id": "item-124",
          "name": "另一个项目",
          "description": "项目描述内容",
          "status": "active",
          "metadata": {
            "createdAt": "2023-05-14T10:15:00Z",
            "createdBy": "user-789",
            "tags": ["normal"]
          }
        }
      ]
    },
    "meta": {
      "processingTime": "45ms",
      "serverInfo": "api-server-01"
    }
  };

  // Example of a complex nested parameter
  const nestedParameter = {
    "name": "filters",
    "type": "object",
    "required": false,
    "description": "筛选条件",
    "children": [
      {
        "name": "status",
        "type": "string",
        "required": false,
        "description": "状态筛选 (active, inactive, all)",
        "enum": ["active", "inactive", "all"]
      },
      {
        "name": "type",
        "type": "string",
        "required": false,
        "description": "类型筛选",
        "enum": ["basic", "premium", "enterprise"]
      },
      {
        "name": "categories",
        "type": "array",
        "required": false,
        "description": "分类筛选",
        "items": {
          "type": "string"
        },
        "example": ["news", "sports", "entertainment"]
      }
    ]
  };

  const mockParameters = [
    { name: "username", type: "string", required: true, description: "用户名" },
    nestedParameter,
    { 
      name: "pagination", 
      type: "object", 
      required: false, 
      description: "分页信息",
      children: [
        { name: "page", type: "integer", required: false, description: "页码，默认为1" },
        { name: "pageSize", type: "integer", required: false, description: "每页条数，默认为20" }
      ]
    },
    { 
      name: "sort", 
      type: "object", 
      required: false, 
      description: "排序信息",
      children: [
        { name: "field", type: "string", required: false, description: "排序字段" },
        { name: "order", type: "string", required: false, description: "排序方向 (asc, desc)", enum: ["asc", "desc"] }
      ]
    }
  ];

  useEffect(() => {
    if (api) {
      setEditableApi({...api});
      
      // Initialize editable data
      setEditableData({
        requestHeaders: {...mockRequestHeaders},
        requestBody: {...mockRequestBody},
        responseHeaders: {...mockResponseHeaders},
        responseBody: {...mockResponseBody},
        parameters: [...mockParameters]
      });
      
      // Reset the rich text editor state
      setEditorState(null);
      setRichTextKey(Date.now());
      
      // Try to parse the description as JSON (for rich text)
      if (api.description) {
        try {
          // Only attempt to parse if it looks like JSON
          if (api.description.startsWith('{') && api.description.includes('"blocks"')) {
            const contentState = convertFromRaw(JSON.parse(api.description));
            setEditorState(EditorState.createWithContent(contentState));
          } else {
            // Plain text description
            setEditorState(null);
          }
        } catch (e) {
          console.log("Using description as plain text");
          setEditorState(null);
        }
      } else {
        setEditorState(null);
      }
    }
  }, [api]);

  // Prepare initial content for rich text editor
  const getInitialEditorContent = () => {
    // If we already have valid editor state from JSON, use it
    if (editorState) {
      return editableApi.description;
    }
    
    // Otherwise create proper initial state for plain text
    return JSON.stringify({
      blocks: [
        {
          text: (editableApi && editableApi.description) || '',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }
      ],
      entityMap: {}
    });
  };

  if (!api || !editableApi) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenLineageDialog = () => {
    setLineageDialogOpen(true);
  };

  const handleCloseLineageDialog = () => {
    setLineageDialogOpen(false);
  };

  // Handle copying text to clipboard
  const handleCopy = (text, field) => {
    copyToClipboard(text);
    setCopiedField(field);
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedField('');
    }, 2000);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset rich text editor when toggling edit mode
    setRichTextKey(Date.now());
  };
  
  // Update API field
  const handleApiFieldChange = (field, value) => {
    setEditableApi({
      ...editableApi,
      [field]: value
    });
  };
  
  // Update editable data field
  const handleDataFieldChange = (field, path, value) => {
    // Deep clone the current data
    const newData = JSON.parse(JSON.stringify(editableData));
    
    // If no path, update the whole object (for JsonTableDisplay)
    if (!path || path === '') {
      newData[field] = value;
    } else {
      // Get the object to update using path
      let target = newData[field];
      const parts = path.split('.');
      
      // Navigate to the parent of the target property
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        // Handle array indices in path, e.g. [0]
        if (part.match(/\[\d+\]/)) {
          const arrayName = part.split('[')[0];
          const index = parseInt(part.match(/\[(\d+)\]/)[1], 10);
          target = target[arrayName][index];
        } else {
          target = target[part];
        }
      }
      
      // Update the target property
      const lastPart = parts[parts.length - 1];
      if (lastPart.match(/\[\d+\]/)) {
        const arrayName = lastPart.split('[')[0];
        const index = parseInt(lastPart.match(/\[(\d+)\]/)[1], 10);
        target[arrayName][index] = value;
      } else {
        target[lastPart] = value;
      }
    }
    
    setEditableData(newData);
  };

  // Handle parameters change
  const handleParametersChange = (updatedParameters) => {
    handleDataFieldChange('parameters', null, updatedParameters);
  };
  
  // Handle saving all changes
  const handleSaveChanges = () => {
    // In a real application, you would submit the changes to your API here
    console.log('Saving changes to API:', editableApi);
    console.log('Updated request/response data:', editableData);
    
    // Toggle edit mode off after saving
    setEditMode(false);
    
    // Show success message
    alert('API 更新成功！');
  };

  // Format the method for display
  const methods = editableApi.method ? editableApi.method.split('/') : [];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      scroll="paper"
    >
      <DialogTitle style={{ background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)', color: 'white', boxShadow: '0 3px 5px rgba(0,0,0,0.1)' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box display="flex" alignItems="center">
              <HttpIcon style={{ marginRight: 12 }} />
              <Typography variant="h6">{editableApi.name}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <IconButton edge="end" style={{ color: 'white' }} onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      
      <Box display="flex" alignItems="center" px={3} py={2} bgcolor="rgba(0,0,0,0.03)">
        {methods.map((method, idx) => (
          <Chip 
            key={idx}
            label={method} 
            color={method === 'GET' ? 'primary' : method === 'POST' ? 'secondary' : 'default'} 
            style={{ 
              marginRight: 8, 
              fontWeight: 'bold',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
          />
        ))}
        <Typography 
          variant="body1" 
          style={{ 
            marginLeft: 8, 
            fontFamily: 'monospace', 
            padding: '4px 8px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 4
          }}
        >
          {editableApi.path}
        </Typography>
        
        <Tooltip title="复制API路径">
          <IconButton 
            size="small" 
            style={{ marginLeft: 8 }}
            onClick={() => handleCopy(`${editableApi.method} ${editableApi.path}`, 'path')}
          >
            {copiedField === 'path' ? <DoneIcon fontSize="small" style={{ color: 'green' }} /> : <CopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      
      <Divider />
      <DialogContent>
        <ThemeProvider theme={defaultTheme}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper square elevation={0} style={{ marginBottom: 16 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="概述" icon={<DescriptionIcon />} {...a11yProps(0)} />
                  <Tab label="请求/响应" icon={<HttpIcon />} {...a11yProps(1)} />
                  <Tab label="参数" icon={<VpnKeyIcon />} {...a11yProps(2)} />
                  <Tab label="分类" icon={<CategoryIcon />} {...a11yProps(3)} />
                  <Tab label="设置" icon={<SettingsIcon />} {...a11yProps(4)} />
                </Tabs>
              </Paper>

              {/* Overview Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" gutterBottom>API 描述</Typography>
                </Box>
                
                {editMode ? (
                  <Paper variant="outlined" style={{ padding: 16, minHeight: 200, marginBottom: 24 }}>
                    <ThemeProvider theme={defaultTheme}>
                      <MUIRichTextEditor
                        key={richTextKey}
                        defaultValue={getInitialEditorContent()}
                        controls={[
                          "title", "bold", "italic", "underline", "strikethrough", 
                          "highlight", "undo", "redo", "link", "numberList", 
                          "bulletList", "quote", "code", "clear"
                        ]}
                        onChange={(state) => {
                          if (!state) return;
                          try {
                            const contentState = state.getCurrentContent();
                            if (contentState) {
                              const rawContent = JSON.stringify(convertToRaw(contentState));
                              // Only update if content actually changed to prevent infinite loops
                              if (rawContent !== editableApi.description) {
                                handleApiFieldChange('description', rawContent);
                              }
                            }
                          } catch (e) {
                            console.error("Error saving rich text:", e);
                          }
                        }}
                        label="输入API详细描述..."
                      />
                    </ThemeProvider>
                  </Paper>
                ) : (
                  // Display mode (not editing)
                  editorState ? (
                    <Paper variant="outlined" style={{ padding: 16, minHeight: 200, marginBottom: 24 }}>
                      <MUIRichTextEditor
                        defaultValue={editableApi.description}
                        readOnly={true}
                        toolbar={false}
                        inheritFontSize={true}
                      />
                    </Paper>
                  ) : (
                    <Paper variant="outlined" style={{ padding: 16, marginBottom: 24 }}>
                      <Typography variant="body1">{
                        // If description looks like JSON, extract plain text
                        editableApi.description && editableApi.description.startsWith('{') 
                          ? "暂无描述" // You could parse and extract text if needed
                          : editableApi.description || "暂无描述"
                      }</Typography>
                    </Paper>
                  )
                )}

                <Box mt={4} mb={2}>
                  <Typography variant="h6" gutterBottom>
                    <Box display="flex" alignItems="center">
                      <TimelineIcon style={{ marginRight: 8 }} color="primary" />
                      API 元数据
                    </Box>
                  </Typography>
                  <Paper variant="outlined">
                    <TableContainer>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold', width: '30%' }}>API ID</TableCell>
                            <TableCell>{editableApi.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>响应时间</TableCell>
                            <TableCell>
                              {editMode ? (
                                <TextField
                                  value={editableApi.responseTime || ""}
                                  onChange={(e) => handleApiFieldChange('responseTime', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                />
                              ) : (
                                editableApi.responseTime || "未知"
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>更新时间</TableCell>
                            <TableCell>
                              {editMode ? (
                                <TextField
                                  type="date"
                                  value={editableApi.lastUpdated ? new Date(editableApi.lastUpdated).toISOString().substr(0, 10) : ""}
                                  onChange={(e) => handleApiFieldChange('lastUpdated', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                />
                              ) : (
                                editableApi.lastUpdated ? new Date(editableApi.lastUpdated).toLocaleDateString() : "未知"
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>所有者</TableCell>
                            <TableCell>
                              {editMode ? (
                                <TextField
                                  value={editableApi.owner || ""}
                                  onChange={(e) => handleApiFieldChange('owner', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  placeholder="输入所有者信息"
                                />
                              ) : (
                                editableApi.owner || "未分配"
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>API版本</TableCell>
                            <TableCell>
                              {editMode ? (
                                <TextField
                                  value={editableApi.version || "1.0"}
                                  onChange={(e) => handleApiFieldChange('version', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  placeholder="输入版本号"
                                />
                              ) : (
                                "v" + (editableApi.version || "1.0")
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>开放等级</TableCell>
                            <TableCell>
                              {editMode ? (
                                <FormControl variant="outlined" size="small">
                                  <Select
                                    value={editableApi.accessLevel || "内部访问"}
                                    onChange={(e) => handleApiFieldChange('accessLevel', e.target.value)}
                                  >
                                    <MenuItem value="内部访问">内部访问</MenuItem>
                                    <MenuItem value="部分开放">部分开放</MenuItem>
                                    <MenuItem value="完全开放">完全开放</MenuItem>
                                    <MenuItem value="合作伙伴">合作伙伴</MenuItem>
                                  </Select>
                                </FormControl>
                              ) : (
                                <Chip 
                                  label={editableApi.accessLevel || "内部访问"} 
                                  color="primary" 
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              </TabPanel>

              {/* Request/Response Tab */}
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>请求信息</Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>请求头</Typography>
                    <JsonTableDisplay 
                      data={editableData.requestHeaders} 
                      title="Headers" 
                      onCopy={(jsonString) => handleCopy(jsonString, 'reqHeaders')}
                      isCopied={copiedField === 'reqHeaders'}
                      onDataChange={(newData) => handleDataFieldChange('requestHeaders', '', newData)}
                      isEditable={editMode}
                      defaultView="table"
                    />
                    
                    <Typography variant="subtitle1" gutterBottom>请求体</Typography>
                    <JsonTableDisplay 
                      data={editableData.requestBody} 
                      title="Body" 
                      onCopy={(jsonString) => handleCopy(jsonString, 'reqBody')}
                      isCopied={copiedField === 'reqBody'}
                      onDataChange={(newData) => handleDataFieldChange('requestBody', '', newData)}
                      isEditable={editMode}
                      defaultView="table"
                    />
                    
                    <Box mt={3}>
                      <Typography variant="subtitle1">完整 cURL 请求示例</Typography>
                      <Paper variant="outlined" style={{ marginTop: 8 }}>
                        <Box 
                          display="flex" 
                          justifyContent="space-between" 
                          alignItems="center" 
                          px={2} 
                          py={1}
                          bgcolor="#f5f5f5"
                        >
                          <Typography variant="subtitle2">cURL</Typography>
                          <Tooltip title="复制 cURL 命令">
                            <IconButton 
                              size="small"
                              onClick={() => handleCopy(`curl -X ${editableApi.method} '${editableApi.path}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer {your_token}' \\
  -d '${formatJson(editableData.requestBody)}'`, 'curl')}
                            >
                              {copiedField === 'curl' ? <DoneIcon style={{ color: 'green' }} /> : <CopyIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box p={2} bgcolor="#fafafa" style={{ maxHeight: '200px', overflow: 'auto' }}>
                          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem' }}>
{`curl -X ${editableApi.method} '${editableApi.path}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer {your_token}' \\
  -d '${formatJson(editableData.requestBody)}'`}
                          </pre>
                        </Box>
                      </Paper>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>响应信息</Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>响应头</Typography>
                    <JsonTableDisplay 
                      data={editableData.responseHeaders} 
                      title="Headers" 
                      onCopy={(jsonString) => handleCopy(jsonString, 'resHeaders')}
                      isCopied={copiedField === 'resHeaders'}
                      onDataChange={(newData) => handleDataFieldChange('responseHeaders', '', newData)}
                      isEditable={editMode}
                      defaultView="table"
                    />
                    
                    <Typography variant="subtitle1" gutterBottom>响应体</Typography>
                    <JsonTableDisplay 
                      data={editableData.responseBody} 
                      title="Body" 
                      onCopy={(jsonString) => handleCopy(jsonString, 'resBody')}
                      isCopied={copiedField === 'resBody'}
                      onDataChange={(newData) => handleDataFieldChange('responseBody', '', newData)}
                      isEditable={editMode}
                      defaultView="table"
                    />
                    
                    <Box mt={3}>
                      <Typography variant="subtitle1">状态码</Typography>
                      <Paper variant="outlined" style={{ marginTop: 8 }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>状态码</TableCell>
                                <TableCell>描述</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Chip label="200" size="small" style={{ backgroundColor: '#4caf50', color: 'white' }} />
                                </TableCell>
                                <TableCell>操作成功</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Chip label="400" size="small" style={{ backgroundColor: '#ff9800', color: 'white' }} />
                                </TableCell>
                                <TableCell>请求参数错误</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Chip label="401" size="small" style={{ backgroundColor: '#f44336', color: 'white' }} />
                                </TableCell>
                                <TableCell>未授权访问</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Chip label="500" size="small" style={{ backgroundColor: '#f44336', color: 'white' }} />
                                </TableCell>
                                <TableCell>服务器内部错误</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Parameters Tab */}
              <TabPanel value={tabValue} index={2}>
                <EditableParameterTable
                  parameters={editableData.parameters || []}
                  onParametersChange={handleParametersChange}
                  title="API 参数管理"
                  subtitle="点击任意单元格进行编辑。修改的内容会高亮显示直到保存。"
                  editable={editMode}
                />
                
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>嵌套参数示例 (JSON)</Typography>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <JsonTree 
                        data={{
                          username: "example_user",
                          filters: {
                            status: "active",
                            type: "premium",
                            categories: ["news", "sports", "entertainment"]
                          },
                          pagination: {
                            page: 1,
                            pageSize: 20
                          },
                          sort: {
                            field: "createdAt",
                            order: "desc"
                          }
                        }}
                        isEditable={editMode}
                        onEdit={(path, value) => console.log("Edited path:", path, "New value:", value)}
                      />
                    </Box>
                  </Paper>
                </Box>
                
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>查询参数示例</Typography>
                  <Paper variant="outlined" style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                      {`${editableApi.path}?username=example_user&status=active&page=1&pageSize=20&sort=createdAt&order=desc`}
                    </Typography>
                    <Tooltip title="复制查询参数示例">
                      <IconButton 
                        size="small"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleCopy(`${editableApi.path}?username=example_user&status=active&page=1&pageSize=20&sort=createdAt&order=desc`, 'queryParams')}
                      >
                        {copiedField === 'queryParams' ? <DoneIcon style={{ color: 'green' }} /> : <CopyIcon />}
                      </IconButton>
                    </Tooltip>
                  </Paper>
                </Box>
              </TabPanel>

              {/* Categories Tab */}
              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>分类信息</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" style={{ padding: 16 }}>
                      <Typography variant="subtitle1" gutterBottom>主分类</Typography>
                      <Chip
                        icon={<CategoryIcon />}
                        label={editableApi.category || "未分类"}
                        color="primary"
                        style={{ margin: 8 }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" style={{ padding: 16 }}>
                      <Typography variant="subtitle1" gutterBottom>子分类</Typography>
                      {editableApi.subCategory ? (
                        <Chip
                          icon={<LabelIcon />}
                          label={editableApi.subCategory}
                          color="secondary"
                          style={{ margin: 8 }}
                        />
                      ) : (
                        <Typography variant="body2">无子分类</Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>标签</Typography>
                  <Paper variant="outlined" style={{ padding: 16 }}>
                    <Box display="flex" flexWrap="wrap">
                      <Chip label="API" style={{ margin: 4 }} />
                      <Chip label="数据服务" style={{ margin: 4 }} />
                      <Chip label="REST" style={{ margin: 4 }} />
                      <Chip label={`${editableApi.method}方法`} style={{ margin: 4 }} />
                      {editableApi.category && <Chip label={editableApi.category} style={{ margin: 4 }} />}
                      {editableApi.subCategory && <Chip label={editableApi.subCategory} style={{ margin: 4 }} />}
                    </Box>
                  </Paper>
                </Box>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>业务相关性</Typography>
                  <Paper variant="outlined">
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>业务领域</TableCell>
                            <TableCell>相关团队</TableCell>
                            <TableCell>优先级</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>用户管理</TableCell>
                            <TableCell>用户体验团队</TableCell>
                            <TableCell>
                              <Chip label="高" size="small" style={{ backgroundColor: '#f44336', color: 'white' }} />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>数据分析</TableCell>
                            <TableCell>数据团队</TableCell>
                            <TableCell>
                              <Chip label="中" size="small" style={{ backgroundColor: '#ff9800', color: 'white' }} />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>报表生成</TableCell>
                            <TableCell>业务团队</TableCell>
                            <TableCell>
                              <Chip label="低" size="small" style={{ backgroundColor: '#4caf50', color: 'white' }} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel value={tabValue} index={4}>
                <Typography variant="h6" gutterBottom>API 设置</Typography>
                
                <Paper variant="outlined" style={{ marginBottom: 24 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>设置项</TableCell>
                          <TableCell>值</TableCell>
                          <TableCell>描述</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>缓存时间</TableCell>
                          <TableCell>5分钟</TableCell>
                          <TableCell>API响应的缓存保留时间</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>限流策略</TableCell>
                          <TableCell>100次/分钟</TableCell>
                          <TableCell>单个令牌的请求限制</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>超时设置</TableCell>
                          <TableCell>30秒</TableCell>
                          <TableCell>请求超时时间</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>重试策略</TableCell>
                          <TableCell>3次</TableCell>
                          <TableCell>失败后自动重试次数</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>接口鉴权</TableCell>
                          <TableCell>Bearer Token</TableCell>
                          <TableCell>API访问认证方式</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                
                <Typography variant="h6" gutterBottom>监控状态</Typography>
                <Paper variant="outlined" style={{ padding: 16 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="#e3f2fd" borderRadius={1}>
                        <Typography variant="h4" color="primary">99.9%</Typography>
                        <Typography variant="body2">可用性</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="#f1f8e9" borderRadius={1}>
                        <Typography variant="h4" style={{ color: '#4caf50' }}>85ms</Typography>
                        <Typography variant="body2">平均响应时间</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="#fff3e0" borderRadius={1}>
                        <Typography variant="h4" style={{ color: '#ff9800' }}>1.2k</Typography>
                        <Typography variant="body2">每日请求量</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="#ffebee" borderRadius={1}>
                        <Typography variant="h4" style={{ color: '#f44336' }}>0.1%</Typography>
                        <Typography variant="body2">错误率</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </TabPanel>
            </Grid>
          </Grid>
        </ThemeProvider>
      </DialogContent>
      <DialogActions style={{ borderTop: '1px solid rgba(0,0,0,0.1)', padding: '16px 24px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={editMode}
              onChange={toggleEditMode}
              color="primary"
            />
          }
          label="编辑模式"
          style={{ marginRight: 'auto' }}
        />
        
        <Button 
          onClick={handleOpenLineageDialog} 
          color="primary" 
          startIcon={<LineageIcon />}
          variant="outlined"
        >
          查看血缘关系
        </Button>
        
        {editMode ? (
          <Button 
            onClick={handleSaveChanges} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            保存更改
          </Button>
        ) : (
          <Button onClick={onClose} color="primary" variant="contained">
            关闭
          </Button>
        )}
      </DialogActions>

      {/* API血缘关系对话框 */}
      {editableApi && (
        <ApiLineage
          open={lineageDialogOpen}
          onClose={handleCloseLineageDialog}
          apiId={editableApi.id}
          apiName={editableApi.name}
        />
      )}
    </Dialog>
  );
};

export default ApiDetailDialog; 