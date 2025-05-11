import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Container,
  Button
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import DatabaseConnection from '../components/DatabaseConnection';
import TableSelection from '../components/TableSelection';
import ParameterSelection from '../components/ParameterSelection';
import SqlEditor from '../components/SqlEditor';
import ApiDetailsEditor from '../components/ApiDetailsEditor';
import ApiList from '../components/ApiList';
import JoinTablesBuilder from '../components/JoinTablesBuilder';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  stepperContainer: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  contentContainer: {
    marginTop: theme.spacing(2),
  }
}));

// API构建工作流步骤配置
const steps = [
  { label: '数据库连接', key: 'database' },
  { label: '表格选择', key: 'tables' },
  { label: '参数选择', key: 'parameters' },
  { label: 'SQL 编辑', key: 'sql' },
  { label: 'API 详情', key: 'details' },
];

function LowCode() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [useJoinTables, setUseJoinTables] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    name: '',
    method: 'GET',
    path: '',
    description: '',
    selectedTable: null,
    inputParameters: [],
    outputParameters: [],
    sql: '',
    categories: [],
    requestHeaders: [],
    requestBody: {},
    responseHeaders: [],
    responseBody: {},
    upstreamSystems: [],
  });

  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      setActiveStep(prevStep);
    }
  };

  // 点击步骤标签导航
  const handleStepClick = (index) => {
    // 只允许点击已完成的步骤或下一个步骤
    if (index <= activeStep + 1) {
      setActiveStep(index);
    }
  };

  const toggleJoinMode = () => {
    setUseJoinTables(!useJoinTables);
  };

  // 更新API配置
  const updateApiConfig = (newData) => {
    setApiConfig(prev => ({
      ...prev,
      ...newData
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DatabaseConnection onNext={handleNext} updateApiConfig={updateApiConfig} />;
      case 1:
        return useJoinTables ? 
          <JoinTablesBuilder onNext={handleNext} onBack={handleBack} updateApiConfig={updateApiConfig} /> : 
          <div>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={toggleJoinMode} 
              style={{ marginBottom: '16px' }}
            >
              切换到多表关联模式
            </Button>
            <TableSelection onNext={handleNext} onBack={handleBack} updateApiConfig={updateApiConfig} />
          </div>;
      case 2:
        return <ParameterSelection 
          onNext={handleNext} 
          onBack={handleBack} 
          apiConfig={apiConfig}
          updateApiConfig={updateApiConfig} 
        />;
      case 3:
        return <SqlEditor 
          onNext={handleNext} 
          onBack={handleBack} 
          apiConfig={apiConfig}
          updateApiConfig={updateApiConfig} 
        />;
      case 4:
        return <ApiDetailsEditor 
          onFinish={() => {
            // 保存API并跳转到API列表
            const apiData = {
              ...apiConfig,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            };
            
            // 保存到localStorage
            const existingApis = JSON.parse(localStorage.getItem('apis') || '[]');
            localStorage.setItem('apis', JSON.stringify([...existingApis, apiData]));
            
            // 跳转到API列表页面或回到起始页
            // 这里可以根据需要调整
            window.location.href = '/api-catalog';
          }}
          onBack={handleBack} 
          apiConfig={apiConfig}
          updateApiConfig={updateApiConfig} 
        />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Typography variant="h6">未知步骤</Typography>
          </div>
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper className={classes.stepperContainer}>
        <Typography variant="h4" align="center" gutterBottom>
          API 构建工作流
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.key} onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <div className={classes.contentContainer}>
        {getStepContent(activeStep)}
      </div>
    </Container>
  );
}

export default LowCode; 