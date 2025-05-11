import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useLocation } from 'react-router-dom';
import { 
  ImportExport as ImportExportIcon,
  Category as CategoryIcon,
  MenuBook as MenuBookIcon,
  Code as CodeIcon,
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
  }
}));

function Navigation() {
  const classes = useStyles();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={3}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            <ImportExportIcon className={classes.logo} />
            API 构建平台
          </Typography>
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
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navigation; 