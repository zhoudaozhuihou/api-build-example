import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  InputAdornment,
  Card, 
  CardContent, 
  Grid,
  Button,
  Box,
  Zoom,
  Fade,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import useHomePage from '../hooks/useHomePage';
import { 
  ImportExport as ApiIcon,
  Code as CodeIcon,
  Category as CategoryIcon,
  ArrowForward as ArrowIcon
} from '@material-ui/icons';

/**
 * Configurable HomePage component
 * @param {Object} props - The component props
 * @param {string} [props.title] - The main title
 * @param {string} [props.subtitle] - The subtitle
 * @param {string} [props.searchPlaceholder] - Placeholder text for search input
 * @param {string} [props.searchButtonText] - Text for search button
 * @param {string} [props.searchRedirectPath] - Path to redirect when search is submitted
 * @param {string} [props.cardButtonText] - Text for feature card buttons
 * @param {Array} [props.features] - Features to display in cards
 * @param {string} [props.heroBackgroundImage] - Background image for hero section
 * @param {string} [props.heroHeight] - Height of hero section
 * @param {number} [props.heroMinHeight] - Minimum height of hero section
 * @param {number} [props.heroOverlayOpacity] - Opacity of the hero section overlay
 * @param {boolean} [props.showHeroPattern] - Whether to show a pattern overlay on hero section
 * @param {boolean} [props.showWorkflow] - Whether to show the workflow section
 */
const HomePageComponent = (props) => {
  // Default feature cards if none provided
  const defaultFeatures = [
    {
      title: 'API 目录',
      description: '浏览和管理所有API，分类查询并快速找到您需要的服务接口。',
      icon: <ApiIcon />,
      path: '/catalog'
    },
    {
      title: '低代码构建',
      description: '通过简单的可视化界面快速构建API，无需编写复杂代码。',
      icon: <CodeIcon />,
      path: '/lowcode'
    },
    {
      title: '分类管理',
      description: '对API进行分类管理，创建有组织的目录结构以便于维护和查找。',
      icon: <CategoryIcon />,
      path: '/category-demo'
    }
  ];

  // 工作流步骤
  const workflowSteps = [
    {
      label: '数据集接入',
      description: '通过数据集管理接收来自其他平台的数据集或直接上传您的数据集',
      path: '/datasets'
    },
    {
      label: '低代码构建API',
      description: '使用低代码构建器基于数据集快速创建API，无需深入了解技术细节',
      path: '/lowcode'
    },
    {
      label: '审核与发布',
      description: '通过审核中心处理API申请，审核通过后自动发布API并关联数据集',
      path: '/review'
    },
    {
      label: '订阅管理',
      description: '在订单中心管理API订阅请求，为团队分配API访问权限并绑定service account',
      path: '/orders'
    },
    {
      label: '监控与分析',
      description: '通过分析中心监控API使用情况、性能指标和调用统计',
      path: '/analytics'
    }
  ];

  // Use the hook with either provided props or defaults
  const {
    styles,
    searchTerm,
    features,
    title,
    subtitle,
    searchPlaceholder,
    searchButtonText,
    cardButtonText,
    showWorkflow,
    handleSearchChange,
    handleSearchSubmit,
    navigateToFeature
  } = useHomePage({
    ...props,
    features: props.features || defaultFeatures
  });

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section with Background and Search */}
      <Box className={styles.hero}>
        <Container className={styles.heroContent}>
          <Typography variant="h3" component="h1" className={styles.heroTitle}>
            {title}
          </Typography>
          <Typography variant="h6" component="h2" className={styles.heroSubtitle}>
            {subtitle}
          </Typography>
          
          <Box className={styles.searchContainer}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                className={styles.searchField}
                variant="outlined"
                fullWidth
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        disableElevation
                        className={styles.searchButton}
                      >
                        {searchButtonText}
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Box>
        </Container>
      </Box>

      {/* Feature Cards Section */}
      <Box className={styles.featureSection}>
        <Container className={styles.featureSectionInner}>
          <Typography variant="h4" component="h3" className={styles.sectionTitle}>
            平台功能
          </Typography>
          
          <Grid container spacing={4} className={styles.featureGrid}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={feature.primary ? 4 : 4} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card 
                    className={styles.card} 
                    elevation={2}
                    style={{
                      border: feature.primary ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
                      background: feature.primary 
                        ? 'linear-gradient(145deg, rgba(25, 118, 210, 0.03) 0%, rgba(66, 165, 245, 0.06) 100%)' 
                        : 'white'
                    }}
                  >
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                      {React.cloneElement(feature.icon, { 
                        className: styles.cardIcon,
                        style: { 
                          fontSize: 40, 
                          color: feature.primary ? '#1976d2' : '#666'
                        }
                      })}
                    </Box>
                    <CardContent className={styles.cardContent}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        className={styles.cardTitle}
                        style={{ 
                          fontWeight: feature.primary ? 600 : 500,
                          color: feature.primary ? '#1976d2' : '#333'
                        }}
                      >
                        {feature.title}
                        {feature.primary && (
                          <Chip 
                            size="small" 
                            label="核心功能" 
                            style={{ 
                              marginLeft: 8, 
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              color: '#1976d2',
                              fontSize: '0.65rem',
                              height: 20
                            }} 
                          />
                        )}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        className={styles.cardDescription}
                        style={{ minHeight: 80 }}
                      >
                        {feature.description}
                      </Typography>
                      <Box className={styles.cardAction}>
                        <Button 
                          variant={feature.primary ? "contained" : "outlined"} 
                          color="primary"
                          endIcon={<ArrowIcon />}
                          onClick={() => navigateToFeature(feature.path)}
                          className={styles.featureButton}
                          fullWidth
                        >
                          {cardButtonText}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Workflow Section */}
      {showWorkflow && (
        <Box className={styles.workflowSection} mt={6} mb={6}>
          <Container>
            <Typography variant="h4" component="h3" className={styles.sectionTitle} gutterBottom>
              平台工作流程
            </Typography>
            <Typography variant="subtitle1" component="p" align="center" mb={4} 
              style={{ maxWidth: 800, margin: '0 auto 32px' }}>
              从数据集接入到API创建、审核、发布和订阅的全流程管理
            </Typography>
            
            <Paper elevation={0} style={{ background: 'rgba(25, 118, 210, 0.03)', padding: 32, borderRadius: 8 }}>
              <Stepper orientation="vertical">
                {workflowSteps.map((step, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>
                      <Typography variant="h6">{step.label}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      <Box mt={2}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="primary"
                          onClick={() => navigateToFeature(step.path)}
                        >
                          前往{step.label}
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HomePageComponent; 