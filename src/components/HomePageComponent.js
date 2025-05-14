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
  Fade
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import useHomePage from '../hooks/useHomePage';
import { 
  ImportExport as ApiIcon,
  Code as CodeIcon,
  Category as CategoryIcon
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
              <Grid item xs={12} md={4} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card className={styles.card} elevation={0}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      {React.cloneElement(feature.icon, { className: styles.cardIcon })}
                    </Box>
                    <CardContent className={styles.cardContent}>
                      <Typography variant="h5" component="h3" className={styles.cardTitle}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" className={styles.cardDescription}>
                        {feature.description}
                      </Typography>
                      <Box className={styles.cardAction}>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          onClick={() => navigateToFeature(feature.path)}
                          className={styles.featureButton}
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
    </Box>
  );
};

export default HomePageComponent; 