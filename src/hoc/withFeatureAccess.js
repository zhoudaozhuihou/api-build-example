import React from 'react';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { Redirect } from 'react-router-dom';

/**
 * 高阶组件，用于限制对特定模块的访问
 * @param {React.Component} Component 需要保护的组件
 * @param {string} moduleId 模块ID
 * @param {string} [featureId] 可选的功能ID
 * @param {React.Component} [FallbackComponent] 可选的回退组件，当功能不可用时显示
 * @param {string} [redirectPath] 可选的重定向路径，当功能不可用时跳转
 */
const withFeatureAccess = (
  Component,
  moduleId,
  featureId = null,
  FallbackComponent = null,
  redirectPath = '/'
) => {
  const WithFeatureAccess = (props) => {
    const { isModuleEnabled, isFeatureEnabled } = useFeatureFlags();
    
    // 检查模块是否可用
    const moduleEnabled = isModuleEnabled(moduleId);
    
    // 如果指定了功能ID，则检查该功能是否可用
    const featureEnabled = featureId ? isFeatureEnabled(moduleId, featureId) : true;
    
    // 同时满足模块和功能可用条件
    const hasAccess = moduleEnabled && featureEnabled;
    
    if (!hasAccess) {
      // 如果提供了回退组件，则显示回退组件
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      
      // 如果提供了重定向路径，则重定向
      if (redirectPath) {
        return <Redirect to={redirectPath} />;
      }
      
      // 默认返回无权限提示
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>功能不可用</h2>
          <p>当前市场不支持此功能。</p>
        </div>
      );
    }
    
    // 有权限时，渲染原始组件
    return <Component {...props} />;
  };
  
  // 设置显示名称
  WithFeatureAccess.displayName = `withFeatureAccess(${Component.displayName || Component.name || 'Component'})`;
  
  return WithFeatureAccess;
};

export default withFeatureAccess; 