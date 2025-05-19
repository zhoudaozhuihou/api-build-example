import React from 'react';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';

/**
 * 功能守卫组件 - 条件性渲染子组件
 * 只有当指定的模块/功能可用时才会渲染子组件
 */
const FeatureGuard = ({
  moduleId,
  featureId = null,
  fallback = null,
  children
}) => {
  const { isModuleEnabled, isFeatureEnabled } = useFeatureFlags();
  
  // 检查模块是否可用
  const moduleEnabled = isModuleEnabled(moduleId);
  
  // 如果指定了功能ID，则检查该功能是否可用
  const featureEnabled = featureId ? isFeatureEnabled(moduleId, featureId) : true;
  
  // 同时满足模块和功能可用条件
  const hasAccess = moduleEnabled && featureEnabled;
  
  // 如果没有访问权限，则显示回退内容或返回null
  if (!hasAccess) {
    return fallback;
  }
  
  // 有访问权限，显示子组件
  return children;
};

export default FeatureGuard; 