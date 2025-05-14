import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Route, Switch, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Layout from './components/layout/Layout';
import Toast from './components/Toast';
import ApiCatalog from './pages/ApiCatalog';
import LowCode from './pages/LowCode';
import HomePage from './pages/HomePage';
import MarketingHomePage from './pages/MarketingHomePage';
import DeveloperHomePage from './pages/DeveloperHomePage';
import CategorySelectorDemo from './components/CategorySelectorDemo';

// 权限管理相关组件
import UserAccountManagementPage from './pages/admin/UserAccountManagementPage';
import UnauthorizedPage from './pages/admin/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 新增页面
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

// 添加国际化提供者
import I18nProvider from './i18n/I18nProvider';

// Redux状态和操作
import { selectDarkMode } from './redux/slices/uiSlice';
import { fetchApis, fetchCategories } from './redux/slices/apiSlice';
import { fetchUsers, setCurrentUser } from './redux/slices/auth/userSlice';
import { selectIsAuthenticated } from './redux/slices/authSlice';

// 导入新主题
import { lightTheme, darkTheme } from './theme';

// Vite indicator component
const ViteIndicator = () => (
  <div style={{ 
    position: 'fixed', 
    bottom: '20px', 
    right: '20px', 
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <Chip 
      label="Powered by Vite" 
      color="primary" 
      size="small"
      style={{ 
        background: 'linear-gradient(to right, #646cff, #42b883)',
        color: 'white',
        fontWeight: 'bold'
      }}
    />
  </div>
);

function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // 如果未登录且不在登录页，重定向到登录页
  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  };

  return (
    <ErrorBoundary>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        
        <PrivateRoute path="/">
          <Layout>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/marketing" component={MarketingHomePage} />
              <Route path="/developer" component={DeveloperHomePage} />
              <Route path="/catalog">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <ApiCatalog />
                </Container>
              </Route>
              <Route path="/lowcode">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <LowCode />
                </Container>
              </Route>
              <Route path="/category-demo">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <CategorySelectorDemo />
                </Container>
              </Route>
              
              {/* 权限管理路由 */}
              <ProtectedRoute 
                path="/admin/users"
                permissions="user_view"
                component={UserAccountManagementPage}
              />
              <Route path="/unauthorized" component={UnauthorizedPage} />
              
              {/* 404页面 */}
              <Route path="*" component={NotFoundPage} />
            </Switch>
            <Toast />
            <ViteIndicator />
          </Layout>
        </PrivateRoute>
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectDarkMode);

  // 根据暗色模式选择主题
  const theme = isDarkMode ? darkTheme : lightTheme;

  // 加载初始数据
  useEffect(() => {
    dispatch(fetchApis());
    dispatch(fetchCategories());
    
    // 加载用户数据，并设置当前用户
    dispatch(fetchUsers())
      .then(response => {
        // 模拟当前登录用户
        if (response.payload && response.payload.length > 0) {
          const adminUser = response.payload.find(user => user.username === 'admin');
          if (adminUser) {
            dispatch(setCurrentUser(adminUser));
          }
        }
      });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App; 