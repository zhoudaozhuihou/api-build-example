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

// 新增页面组件
import DatasetsPage from './pages/DatasetsPage';
import ReviewCenterPage from './pages/ReviewCenterPage';
import OrderCenterPage from './pages/OrderCenterPage';
import ReviewOrdersPage from './pages/ReviewOrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';

// 权限管理相关组件
import UserAccountManagementPage from './pages/admin/UserAccountManagementPage';
import ApiOwnershipManagementPage from './pages/admin/ApiOwnershipManagementPage';
import AdminPage from './pages/admin/AdminPage';
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
import { loginSuccess } from './redux/slices/authSlice';

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

import { FeatureFlagProvider, useFeatureFlags } from './contexts/FeatureFlagContext';
import withFeatureAccess from './hoc/withFeatureAccess';

function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { MODULES } = useFeatureFlags();
  
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

  // 使用高阶组件保护路由
  const ProtectedDatasetsPage = withFeatureAccess(DatasetsPage, MODULES.DATASET_MANAGEMENT);
  const ProtectedReviewOrdersPage = withFeatureAccess(ReviewOrdersPage, MODULES.REVIEW_ORDERS);
  const ProtectedLowCode = withFeatureAccess(LowCode, MODULES.LOWCODE_BUILDER);
  const ProtectedAnalyticsPage = withFeatureAccess(AnalyticsPage, MODULES.ANALYTICS);

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
              <Route path="/datasets">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <ProtectedDatasetsPage />
                </Container>
              </Route>
              <Route path="/review-orders">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <ProtectedReviewOrdersPage />
                </Container>
              </Route>
              <Route path="/analytics">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <ProtectedAnalyticsPage />
                </Container>
              </Route>
              <Route path="/lowcode">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <ProtectedLowCode />
                </Container>
              </Route>
              <Route path="/category-demo">
                <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <CategorySelectorDemo />
                </Container>
              </Route>
              
              {/* 权限管理路由 */}
              <ProtectedRoute 
                path="/admin"
                exact
                permissions="admin_view"
                component={AdminPage}
              />
              <ProtectedRoute 
                path="/admin/users"
                permissions="user_view"
                component={UserAccountManagementPage}
              />
              <ProtectedRoute 
                path="/admin/apis"
                permissions="api_view"
                component={ApiOwnershipManagementPage}
              />
              <ProtectedRoute 
                path="/admin/settings"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>系统配置</Typography>
                    <Typography variant="body1">系统配置页面正在建设中...</Typography>
                  </Container>
                )}
              />
              <ProtectedRoute 
                path="/admin/security"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>安全与审计</Typography>
                    <Typography variant="body1">安全与审计页面正在建设中...</Typography>
                  </Container>
                )}
              />
              <ProtectedRoute 
                path="/admin/datasets"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>数据集管理</Typography>
                    <Typography variant="body1">数据集管理页面正在建设中...</Typography>
                  </Container>
                )}
              />
              <ProtectedRoute 
                path="/admin/categories"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>类别管理</Typography>
                    <Typography variant="body1">类别管理页面正在建设中...</Typography>
                  </Container>
                )}
              />
              <ProtectedRoute 
                path="/admin/system-status"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>系统状态</Typography>
                    <Typography variant="body1">系统状态页面正在建设中...</Typography>
                  </Container>
                )}
              />
              <ProtectedRoute 
                path="/admin/usage-stats"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>使用统计</Typography>
                    <Typography variant="body1">使用统计页面正在建设中...</Typography>
                  </Container>
                )}
              />
              <ProtectedRoute 
                path="/admin/review-reports"
                permissions="admin_view"
                component={() => (
                  <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" gutterBottom>审核报表</Typography>
                    <Typography variant="body1">审核报表页面正在建设中...</Typography>
                  </Container>
                )}
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
            // 确保身份验证状态也被设置
            dispatch(loginSuccess({
              user: adminUser,
              token: 'mock-jwt-token-for-admin'
            }));
          }
        }
      });
  }, [dispatch]);

  return (
    <FeatureFlagProvider initialMarket={process.env.REACT_APP_MARKET || 'china'}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <I18nProvider>
          <AppContent />
        </I18nProvider>
      </ThemeProvider>
    </FeatureFlagProvider>
  );
}

export default App; 