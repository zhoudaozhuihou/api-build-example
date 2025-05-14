import React from 'react';
import HomePageComponent from '../components/HomePageComponent';
import { 
  Cloud as CloudIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon
} from '@material-ui/icons';

const MarketingHomePage = () => {
  // Example of a marketing-focused homepage with different features
  const marketingFeatures = [
    {
      title: '云端部署',
      description: '一键部署API到云端，无需复杂的基础设施配置，立即提供服务。',
      icon: <CloudIcon />,
      path: '/cloud-deployment'
    },
    {
      title: '高性能',
      description: '优化的API设计和处理流程，确保响应迅速，支持高并发访问。',
      icon: <SpeedIcon />,
      path: '/performance'
    },
    {
      title: '安全可靠',
      description: '内置安全机制，支持多种认证方式，保护您的数据和接口安全。',
      icon: <SecurityIcon />,
      path: '/security'
    }
  ];

  return (
    <HomePageComponent 
      title="面向企业的API解决方案"
      subtitle="提升开发效率，加速业务创新"
      searchPlaceholder="查找解决方案..."
      searchButtonText="查询"
      searchRedirectPath="/solutions"
      cardButtonText="查看方案"
      features={marketingFeatures}
      heroBackgroundImage="linear-gradient(120deg, #673ab7 0%, #9c27b0 100%)"
      heroHeight="60vh"
      heroMinHeight={500}
      heroOverlayOpacity={0.5}
      showHeroPattern={true}
    />
  );
};

export default MarketingHomePage; 