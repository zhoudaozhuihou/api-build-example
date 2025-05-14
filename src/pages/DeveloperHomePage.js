import React from 'react';
import HomePageComponent from '../components/HomePageComponent';
import { 
  Code as CodeIcon,
  Settings as SettingsIcon,
  Book as DocumentationIcon
} from '@material-ui/icons';

const DeveloperHomePage = () => {
  // Example of a developer-focused homepage with different features
  const developerFeatures = [
    {
      title: 'API 文档',
      description: '详细的API文档，包含请求参数、响应格式和示例代码，助您快速开发。',
      icon: <DocumentationIcon />,
      path: '/documentation'
    },
    {
      title: '开发套件',
      description: '多语言SDK支持，集成测试工具和示例项目，降低集成难度。',
      icon: <CodeIcon />,
      path: '/sdk'
    },
    {
      title: '调试工具',
      description: '在线API调试环境，实时请求响应查看，帮助您快速定位问题。',
      icon: <SettingsIcon />,
      path: '/debug'
    }
  ];

  // 背景图案可以是渐变色或者真实图片
  // const bgImage = "url('/images/developer-bg.jpg')";
  const bgImage = "linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)";

  return (
    <HomePageComponent 
      title="开发者资源中心"
      subtitle="加速API开发与集成"
      searchPlaceholder="搜索API文档..."
      searchButtonText="查找"
      searchRedirectPath="/docs"
      cardButtonText="开始使用"
      features={developerFeatures}
      heroBackgroundImage={bgImage}
      heroHeight="50vh"
      heroMinHeight={450}
      heroOverlayOpacity={0.6}
      showHeroPattern={true}
    />
  );
};

export default DeveloperHomePage; 