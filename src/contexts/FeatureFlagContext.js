import React, { createContext, useContext, useState, useEffect } from 'react';
import featureFlagService from '../services/FeatureFlagService';
import { MODULES, FEATURES } from '../config/marketConfig';

// 创建上下文
const FeatureFlagContext = createContext({
  isModuleEnabled: () => false,
  isFeatureEnabled: () => false,
  currentMarket: null,
  enabledModules: [],
  setMarket: () => {},
});

// 提供程序组件
export const FeatureFlagProvider = ({ children, initialMarket = 'china' }) => {
  const [currentMarket, setCurrentMarket] = useState(null);
  const [enabledModules, setEnabledModules] = useState([]);
  
  // 初始化市场配置
  useEffect(() => {
    if (initialMarket) {
      setMarket(initialMarket);
    }
  }, [initialMarket]);
  
  // 设置市场
  const setMarket = (marketId) => {
    featureFlagService.initMarket(marketId);
    setCurrentMarket(marketId);
    setEnabledModules(featureFlagService.getEnabledModules());
  };
  
  // 检查模块是否可用
  const isModuleEnabled = (moduleId) => {
    return featureFlagService.isModuleEnabled(moduleId);
  };
  
  // 检查功能是否可用
  const isFeatureEnabled = (moduleId, featureId) => {
    return featureFlagService.isFeatureEnabled(moduleId, featureId);
  };
  
  const value = {
    isModuleEnabled,
    isFeatureEnabled,
    currentMarket,
    enabledModules,
    setMarket,
    MODULES,
    FEATURES,
  };
  
  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// 自定义钩子，用于访问特性标志
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

export default FeatureFlagContext; 