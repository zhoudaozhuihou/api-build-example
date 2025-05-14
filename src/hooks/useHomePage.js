import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

// Custom hook for homepage functionality
const useHomePage = (props = {}) => {
  // Default config values that can be overridden by props
  const {
    title = 'API 构建与管理平台',
    subtitle = '简化API开发流程，提高业务集成效率',
    searchPlaceholder = '搜索API...',
    searchButtonText = '搜索',
    searchRedirectPath = '/catalog',
    cardButtonText = '了解详情',
    features = [],
    heroBackgroundImage = 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
    heroHeight = '50vh',
    heroMinHeight = 400,
    heroOverlayOpacity = 0.7,
    showHeroPattern = true
  } = props;

  const classes = makeStyles((theme) => ({
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    '@keyframes slideIn': {
      from: { transform: 'translateX(-30px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 }
    },
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' }
    },
    hero: {
      position: 'relative',
      height: heroHeight,
      minHeight: heroMinHeight,
      backgroundImage: heroBackgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      padding: theme.spacing(4),
      overflow: 'hidden',
      '&::before': showHeroPattern ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h2v2H0zm4 4h2v2H4zm4 4h2v2H8zM12 0h2v2h-2zm0 8h2v2h-2zm4 4h2v2h-2z" fill="%23ffffff" fill-opacity="0.15"/%3E%3C/svg%3E")',
        opacity: 0.4,
        zIndex: 0
      } : {},
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `rgba(0, 0, 0, ${heroOverlayOpacity})`,
        zIndex: 0
      }
    },
    heroContent: {
      position: 'relative',
      zIndex: 1,
      animation: '$fadeIn 0.8s ease-out',
      width: '100%',
      maxWidth: 1200
    },
    heroTitle: {
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontWeight: 700,
      marginBottom: theme.spacing(1),
      animation: '$slideIn 0.5s ease-out'
    },
    heroSubtitle: {
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      opacity: 0.9,
      marginBottom: theme.spacing(3),
      animation: '$slideIn 0.5s ease-out 0.2s',
      animationFillMode: 'both'
    },
    searchContainer: {
      width: '100%',
      maxWidth: 700,
      marginTop: theme.spacing(4),
      animation: '$fadeIn 0.8s ease-out 0.4s',
      animationFillMode: 'both'
    },
    searchField: {
      background: 'white',
      borderRadius: theme.shape.borderRadius * 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'transparent',
        },
        '&:hover fieldset': {
          borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'transparent',
        },
      },
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
      }
    },
    featureSection: {
      padding: theme.spacing(10, 0),
      background: '#fafafa',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        left: 0,
        right: 0,
        height: 100,
        background: 'white',
        transform: 'skewY(-2deg)',
        transformOrigin: '100%'
      }
    },
    featureSectionInner: {
      position: 'relative',
      zIndex: 1
    },
    featureGrid: {
      marginTop: theme.spacing(2)
    },
    card: {
      height: 350,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      borderRadius: theme.shape.borderRadius * 2,
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
        '& $cardIcon': {
          animation: '$pulse 0.8s ease-in-out'
        }
      }
    },
    cardMedia: {
      height: 140,
      backgroundSize: 'contain',
      backgroundColor: theme.palette.grey[100]
    },
    cardIcon: {
      fontSize: 80,
      margin: '30px auto 10px',
      color: theme.palette.primary.main,
      transition: 'all 0.3s'
    },
    cardTitle: {
      fontWeight: 700,
      marginBottom: theme.spacing(1),
      color: theme.palette.primary.dark
    },
    cardContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(3),
      backgroundColor: 'white'
    },
    cardDescription: {
      flexGrow: 1,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2)
    },
    cardAction: {
      marginTop: 'auto'
    },
    featureButton: {
      borderRadius: 50,
      padding: theme.spacing(1, 3),
      textTransform: 'none',
      fontWeight: 600,
      boxShadow: 'none',
      '&:hover': {
        boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
      }
    },
    searchButton: {
      borderRadius: 50,
      padding: theme.spacing(1, 3),
      textTransform: 'none',
      fontWeight: 600
    },
    sectionTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing(6),
      fontWeight: 700,
      position: 'relative',
      '&:after': {
        content: '""',
        display: 'block',
        width: 80,
        height: 4,
        background: theme.palette.primary.main,
        margin: '12px auto',
        borderRadius: 2
      }
    }
  }));

  const history = useHistory();
  const styles = classes();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      // Use the configured search redirect path
      history.push(`${searchRedirectPath}?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Navigate to feature page
  const navigateToFeature = (path) => {
    history.push(path);
  };

  // Return the UI components and handlers
  return {
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
  };
};

export default useHomePage; 