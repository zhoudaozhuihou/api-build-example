import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  makeStyles,
  Tooltip,
  Avatar,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Code as CodeIcon,
} from '@material-ui/icons';
import { selectAllApis } from '../../redux/slices/apiSlice';
import { selectAllUsers } from '../../redux/slices/auth/userSlice';
import { selectAllUserGroups } from '../../redux/slices/auth/userGroupSlice';
import PermissionButton from '../../components/auth/PermissionButton';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  searchContainer: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
  chipPublic: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  chipPrivate: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  chipRestricted: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  ownerCell: {
    display: 'flex',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1),
    fontSize: '0.75rem',
  },
  ownerGroup: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

const ApiOwnershipManagementPage = ({ isEmbedded = false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Redux state
  const apis = useSelector(selectAllApis);
  const users = useSelector(selectAllUsers);
  const userGroups = useSelector(selectAllUserGroups);
  
  // Component state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [apiToModify, setApiToModify] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    owner: '',
    accessLevel: 'public',
    authorizedUsers: [],
    authorizedGroups: [],
  });
  const [formMode, setFormMode] = useState('edit');
  
  // Mock API ownership data
  const [apiOwnerships, setApiOwnerships] = useState([]);
  
  // Initialize mock data
  useEffect(() => {
    if (apis.length > 0 && users.length > 0) {
      const mockOwnerships = apis.map((api, index) => ({
        id: api.id,
        name: api.name,
        description: api.description,
        owner: users[index % users.length].id,
        accessLevel: index % 3 === 0 ? 'public' : index % 3 === 1 ? 'private' : 'restricted',
        authorizedUsers: index % 2 === 0 ? [users[0].id, users[1].id] : [users[0].id],
        authorizedGroups: index % 2 === 0 ? ['ug3'] : ['ug2', 'ug4'],
      }));
      setApiOwnerships(mockOwnerships);
    }
  }, [apis, users]);
  
  // Filter APIs
  const filteredApis = apiOwnerships.filter((api) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      api.name.toLowerCase().includes(searchLower) ||
      api.description?.toLowerCase().includes(searchLower)
    );
  });
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Dialog handlers
  const handleOpenDialog = (api) => {
    setApiToModify(api);
    setFormData({
      id: api.id,
      name: api.name,
      owner: api.owner,
      accessLevel: api.accessLevel,
      authorizedUsers: api.authorizedUsers || [],
      authorizedGroups: api.authorizedGroups || [],
    });
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setApiToModify(null);
  };
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = () => {
    // In a real application, this would dispatch an action to update the API ownership
    const updatedOwnerships = apiOwnerships.map(api => {
      if (api.id === formData.id) {
        return { ...api, ...formData };
      }
      return api;
    });
    setApiOwnerships(updatedOwnerships);
    handleCloseDialog();
  };
  
  // Helper functions
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  const getUserInitials = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name.substring(0, 1).toUpperCase() : 'U';
  };
  
  const getGroupName = (groupId) => {
    const group = userGroups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  };
  
  // Render access level chip
  const renderAccessLevelChip = (accessLevel) => {
    switch (accessLevel) {
      case 'public':
        return <Chip label="公开" size="small" className={classes.chipPublic} />;
      case 'private':
        return <Chip label="私有" size="small" className={classes.chipPrivate} />;
      case 'restricted':
        return <Chip label="受限" size="small" className={classes.chipRestricted} />;
      default:
        return <Chip label="未知" size="small" />;
    }
  };
  
  return (
    <div className={isEmbedded ? '' : classes.root}>
      {!isEmbedded && (
        <div className={classes.header}>
          <Typography variant="h4" component="h1">
            API 所有权管理
          </Typography>
        </div>
      )}
      
      <div className={classes.searchContainer}>
        <TextField
          className={classes.searchInput}
          variant="outlined"
          placeholder="搜索API名称或描述..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" style={{ marginRight: 8 }} />,
          }}
        />
      </div>
      
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API名称</TableCell>
              <TableCell>所有者</TableCell>
              <TableCell>访问级别</TableCell>
              <TableCell>授权用户</TableCell>
              <TableCell>授权用户组</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApis
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((api) => (
                <TableRow key={api.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CodeIcon style={{ marginRight: 8, color: '#757575' }} />
                      {api.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <div className={classes.ownerCell}>
                      <Avatar className={classes.ownerAvatar}>
                        {getUserInitials(api.owner)}
                      </Avatar>
                      {getUserName(api.owner)}
                    </div>
                  </TableCell>
                  <TableCell>{renderAccessLevelChip(api.accessLevel)}</TableCell>
                  <TableCell>
                    {api.authorizedUsers && api.authorizedUsers.length > 0 ? (
                      api.authorizedUsers.map((userId) => (
                        <Tooltip key={userId} title={getUserName(userId)}>
                          <Avatar className={classes.ownerAvatar} style={{ marginRight: 4 }}>
                            {getUserInitials(userId)}
                          </Avatar>
                        </Tooltip>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        无
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {api.authorizedGroups && api.authorizedGroups.length > 0 ? (
                      api.authorizedGroups.map((groupId) => (
                        <Chip
                          key={groupId}
                          label={getGroupName(groupId)}
                          size="small"
                          className={classes.ownerGroup}
                          style={{ marginRight: 4 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        无
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <PermissionButton
                      permissions="api_edit"
                      size="small"
                      onClick={() => handleOpenDialog(api)}
                    >
                      <EditIcon fontSize="small" />
                    </PermissionButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredApis.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  没有找到匹配的API
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredApis.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="每页行数"
        />
      </TableContainer>
      
      {/* Edit API ownership dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          编辑API所有权: {formData.name}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth className={classes.formField}>
            <InputLabel id="owner-label">所有者</InputLabel>
            <Select
              labelId="owner-label"
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth className={classes.formField}>
            <InputLabel id="access-level-label">访问级别</InputLabel>
            <Select
              labelId="access-level-label"
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleInputChange}
            >
              <MenuItem value="public">公开 (所有人可访问)</MenuItem>
              <MenuItem value="private">私有 (仅所有者可访问)</MenuItem>
              <MenuItem value="restricted">受限 (指定用户和用户组可访问)</MenuItem>
            </Select>
          </FormControl>
          
          {formData.accessLevel === 'restricted' && (
            <>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="authorized-users-label">授权用户</InputLabel>
                <Select
                  labelId="authorized-users-label"
                  name="authorizedUsers"
                  multiple
                  value={formData.authorizedUsers}
                  onChange={handleMultiSelectChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map((userId) => (
                        <Chip
                          key={userId}
                          label={getUserName(userId)}
                          style={{ margin: 2 }}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="authorized-groups-label">授权用户组</InputLabel>
                <Select
                  labelId="authorized-groups-label"
                  name="authorizedGroups"
                  multiple
                  value={formData.authorizedGroups}
                  onChange={handleMultiSelectChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map((groupId) => (
                        <Chip
                          key={groupId}
                          label={getGroupName(groupId)}
                          style={{ margin: 2 }}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                >
                  {userGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="default">
            取消
          </Button>
          <Button onClick={handleSubmit} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApiOwnershipManagementPage; 