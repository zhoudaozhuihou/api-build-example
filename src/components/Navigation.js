import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { 
  ImportExport as ImportExportIcon,
  Category as CategoryIcon,
  MenuBook as MenuBookIcon,
  Code as CodeIcon,
  Home as HomeIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AccountTree as AccountTreeIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(1),
    fontSize: '1.8rem',
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: theme.spacing(1),
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonText: {
    marginLeft: theme.spacing(0.5),
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
  },
  menuItem: {
    minWidth: 150,
  }
}));

function Navigation() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHomePageChange = (path) => {
    history.push(path);
    handleMenuClose();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={3}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            <ImportExportIcon className={classes.logo} />
            API 构建平台
          </Typography>
          
          <Button 
            color="inherit" 
            className={isActive('/') || isActive('/marketing') || isActive('/developer') ? classes.activeButton : ''}
            startIcon={<HomeIcon />}
            endIcon={<ArrowDropDownIcon />}
            onClick={handleMenuClick}
          >
            <span className={classes.buttonText}>首页</span>
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem 
              onClick={() => handleHomePageChange('/')}
              selected={isActive('/')}
              className={classes.menuItem}
            >
              标准首页
            </MenuItem>
            <MenuItem 
              onClick={() => handleHomePageChange('/marketing')}
              selected={isActive('/marketing')}
              className={classes.menuItem}
            >
              营销首页
            </MenuItem>
            <MenuItem 
              onClick={() => handleHomePageChange('/developer')}
              selected={isActive('/developer')}
              className={classes.menuItem}
            >
              开发者首页
            </MenuItem>
          </Menu>
          
          <Link to="/catalog" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/catalog') ? classes.activeButton : ''}
              startIcon={<MenuBookIcon />}
            >
              <span className={classes.buttonText}>API 目录</span>
            </Button>
          </Link>
          <Link to="/lowcode" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/lowcode') ? classes.activeButton : ''} 
              startIcon={<CodeIcon />}
            >
              <span className={classes.buttonText}>低代码构建</span>
            </Button>
          </Link>
          <Link to="/category-demo" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/category-demo') ? classes.activeButton : ''}
              startIcon={<CategoryIcon />}
            >
              <span className={classes.buttonText}>分类选择器</span>
            </Button>
          </Link>
          <Link to="/json-table-demo" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/json-table-demo') ? classes.activeButton : ''}
              startIcon={<CategoryIcon />}
            >
              <span className={classes.buttonText}>JSON表格</span>
            </Button>
          </Link>
          <Link to="/json-component-demo" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/json-component-demo') ? classes.activeButton : ''}
              startIcon={<CategoryIcon />}
            >
              <span className={classes.buttonText}>通用组件演示</span>
            </Button>
          </Link>
          <Link to="/dataset-search-demo" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/dataset-search-demo') ? classes.activeButton : ''}
              startIcon={<CategoryIcon />}
            >
              <span className={classes.buttonText}>数据集搜索演示</span>
            </Button>
          </Link>
          <Link to="/visual-join-builder" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/visual-join-builder') ? classes.activeButton : ''}
              startIcon={<AccountTreeIcon />}
            >
              <span className={classes.buttonText}>可视化表关联</span>
            </Button>
          </Link>
          <Link to="/table-joiner-flow" className={classes.link}>
            <Button 
              color="inherit" 
              className={isActive('/table-joiner-flow') ? classes.activeButton : ''}
              startIcon={<AccountTreeIcon />}
            >
              <span className={classes.buttonText}>字段级连线原型</span>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navigation; 