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
import JsonTableDemo from './pages/JsonTableDemo';
import JsonComponentDemo from './pages/JsonComponentDemo';
import DatasetSearchDemo from './pages/DatasetSearchDemo';
import VisualJoinBuilderDemo from './pages/VisualJoinBuilderDemo';

// 新增页面组件
import DatasetsPage from './pages/DatasetsPage';
import ReviewCenterPage from './pages/ReviewCenterPage';
import OrderCenterPage from './pages/OrderCenterPage';
import ReviewOrdersPage from './pages/ReviewOrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';

// 统一管理页面组件
import UnifiedManagementPage from './pages/admin/UnifiedManagementPage';
import UnauthorizedPage from './pages/admin/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 新增页面
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

// 添加国际化提供
import I18nProvider from './i18n/I18nProvider';

// Redux状态和操作
import { selectDarkMode } from './redux/slices/uiSlice';
import { fetchApis, fetchCategories } from './redux/slices/apiSlice';
import { fetchUsers, setCurrentUser } from './redux/slices/auth/userSlice';
import { selectIsAuthenticated } from './redux/slices/authSlice';
import { loginSuccess } from './redux/slices/authSlice';

// 导入新主
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

import TableJoinerFlow from './pages/TableJoinerFlow';

function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { MODULES } = useFeatureFlags();
  
  // 如果未登录且不在登录页，重定向到登录
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
              <Route path="/json-table-demo">
                <JsonTableDemo />
              </Route>
              <Route path="/json-component-demo">
                <JsonComponentDemo />
              </Route>
              <Route path="/dataset-search-demo">
                <DatasetSearchDemo />
              </Route>
              <Route path="/visual-join-builder">
                <VisualJoinBuilderDemo />
              </Route>
              <Route path="/table-joiner-flow">
                <TableJoinerFlow />
              </Route>
              
              {/* 统一管理控制台路由 - 替换所有原有分散的管理页面 */}
              <ProtectedRoute 
                path="/admin"
                permissions="admin_view"
                component={UnifiedManagementPage}
              />
              
              <Route path="/unauthorized" component={UnauthorizedPage} />
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
