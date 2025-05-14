import React from 'react';
import HomePageComponent from '../components/HomePageComponent';

const HomePage = () => {
  // 标准首页配置
  return (
    <HomePageComponent 
      title="API 构建与管理平台"
      subtitle="简化API开发流程，提高业务集成效率"
      searchPlaceholder="搜索API..."
      searchButtonText="搜索"
      searchRedirectPath="/catalog"
      cardButtonText="了解详情"
      heroBackgroundImage="linear-gradient(150deg, #1976d2 0%, #42a5f5 75%, #80d8ff 100%)"
      heroHeight="55vh"
      heroMinHeight={450}
      heroOverlayOpacity={0.4}
      showHeroPattern={true}
    />
  );
};

export default HomePage; 