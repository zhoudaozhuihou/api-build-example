import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Stepper, Step, StepLabel, Typography, Paper, Button } from '@material-ui/core';
import Navigation from './components/Navigation';
import DatabaseConnection from './components/DatabaseConnection';
import TableSelection from './components/TableSelection';
import ApiBuilder from './components/ApiBuilder';
import ApiList from './components/ApiList';
import CategorySelectorDemo from './components/CategorySelectorDemo';
import ApiCatalog from './pages/ApiCatalog';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

// 步骤配置
const steps = [
  { label: '数据库连接', path: '/' },
  { label: '选择表格', path: '/tables' },
  { label: '构建 API', path: '/builder' },
  { label: 'API 列表', path: '/apis' },
];

// 路径与步骤索引的映射
const pathToStepIndex = {
  '/': 0,
  '/tables': 1,
  '/builder': 2,
  '/apis': 3,
};

function AppContent() {
  const history = useHistory();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  // 根据当前路径更新激活的步骤
  useEffect(() => {
    const currentPath = location.pathname;
    // 只在主工作流路径中更新步骤
    if (pathToStepIndex[currentPath] !== undefined) {
      const stepIndex = pathToStepIndex[currentPath] || 0;
      setActiveStep(stepIndex);
    }
  }, [location.pathname]);

  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
      history.push(steps[nextStep].path);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      setActiveStep(prevStep);
      history.push(steps[prevStep].path);
    }
  };

  // 点击步骤标签导航
  const handleStepClick = (index) => {
    // 只允许点击已完成的步骤或下一个步骤
    if (index <= activeStep + 1) {
      setActiveStep(index);
      history.push(steps[index].path);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DatabaseConnection onNext={handleNext} />;
      case 1:
        return <TableSelection onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ApiBuilder onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ApiList onBack={handleBack} />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Typography variant="h6">未知步骤</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => history.push('/')}
              style={{ marginTop: '1rem' }}
            >
              返回首页
            </Button>
          </div>
        );
    }
  };

  // 判断是否显示步骤导航
  const showStepper = Object.keys(pathToStepIndex).includes(location.pathname);

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        {showStepper && (
          <Paper style={{ padding: '2rem', marginBottom: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
              API 构建工作流
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label} onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        )}
        <div>
          <Switch>
            <Route path="/catalog" component={ApiCatalog} />
            <Route path="/category-demo" component={CategorySelectorDemo} />
            <Route path="*">
              {getStepContent(activeStep)}
            </Route>
          </Switch>
        </div>
      </Container>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="*" component={AppContent} />
      </Switch>
    </ThemeProvider>
  );
}

export default App; 