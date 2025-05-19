import React from 'react';
import HomePageComponent from '../components/HomePageComponent';
import { 
  ImportExport as ApiIcon,
  Code as CodeIcon,
  Storage as DatasetIcon,
  CheckCircle as ReviewIcon,
  Assignment as OrderIcon,
  Timeline as AnalyticsIcon,
  Add as CreateIcon
} from '@material-ui/icons';

const HomePage = () => {
  // 定义核心功能特性
  const features = [
    {
      title: 'API 目录',
      description: '浏览和管理所有API，查看API详情和文档，找到您需要的服务接口。',
      icon: <ApiIcon />,
      path: '/catalog',
      primary: true
    },
    {
      title: '创建API',
      description: '使用低代码构建工具快速创建新的API，无需编写复杂代码。',
      icon: <CreateIcon />,
      path: '/lowcode',
      primary: true
    },
    {
      title: '数据集管理',
      description: '管理可用于创建API的数据集，上传或接收来自其他平台的数据集。',
      icon: <DatasetIcon />,
      path: '/datasets',
      primary: true
    },
    {
      title: '审核中心',
      description: '处理API和数据集的审核请求，管理跨平台的API构建和订阅申请。',
      icon: <ReviewIcon />,
      path: '/review'
    },
    {
      title: '订单中心',
      description: '管理API订阅订单，处理团队service account的白名单绑定。',
      icon: <OrderIcon />,
      path: '/orders'
    },
    {
      title: '统计分析',
      description: '查看API使用数据和性能统计，了解平台运行状况。',
      icon: <AnalyticsIcon />,
      path: '/analytics'
    },
  ];

  // 标准首页配置
  return (
    <HomePageComponent 
      title="API 构建与管理平台"
      subtitle="简化API开发流程，加速业务集成，一站式管理所有API资源"
      searchPlaceholder="搜索API或数据集..."
      searchButtonText="搜索"
      searchRedirectPath="/catalog"
      cardButtonText="进入"
      features={features}
      heroBackgroundImage="linear-gradient(150deg, #1976d2 0%, #42a5f5 75%, #80d8ff 100%)"
      heroHeight="50vh"
      heroMinHeight={400}
      heroOverlayOpacity={0.4}
      showHeroPattern={true}
      showWorkflow={true}
    />
  );
};

export default HomePage; 