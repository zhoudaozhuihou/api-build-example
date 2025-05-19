import marketConfigurations, { MODULES, FEATURES } from '../config/marketConfig';

class FeatureFlagService {
  constructor() {
    this.currentMarket = null;
    this.marketConfig = null;
    this.overrides = {}; // 存储临时覆盖设置
  }

  // 初始化市场
  initMarket(marketId) {
    if (!marketConfigurations[marketId]) {
      console.warn(`Market "${marketId}" not found in configurations, falling back to china`);
      marketId = 'china'; // 默认使用中国市场配置
    }
    
    this.currentMarket = marketId;
    this.marketConfig = marketConfigurations[marketId];
    this.overrides = {}; // 重置覆盖
    
    return this;
  }

  // 获取当前市场ID
  getCurrentMarket() {
    return this.currentMarket;
  }

  // 检查模块是否可用
  isModuleEnabled(moduleId) {
    if (!this.marketConfig) {
      console.error('Market not initialized');
      return false;
    }

    // 检查覆盖设置
    if (this.overrides[moduleId] !== undefined) {
      return this.overrides[moduleId];
    }

    return this.marketConfig.modules.includes(moduleId);
  }

  // 检查特定模块中的功能是否可用
  isFeatureEnabled(moduleId, featureId) {
    if (!this.marketConfig) {
      console.error('Market not initialized');
      return false;
    }

    // 先检查模块是否可用
    if (!this.isModuleEnabled(moduleId)) {
      return false;
    }

    // 检查覆盖设置
    const featureKey = `${moduleId}.${featureId}`;
    if (this.overrides[featureKey] !== undefined) {
      return this.overrides[featureKey];
    }

    // 检查功能是否在该市场的模块配置中
    return this.marketConfig.features[moduleId]?.includes(featureId) || false;
  }

  // 获取指定模块的所有可用功能
  getEnabledFeatures(moduleId) {
    if (!this.marketConfig || !this.isModuleEnabled(moduleId)) {
      return [];
    }

    return this.marketConfig.features[moduleId] || [];
  }

  // 获取所有可用模块
  getEnabledModules() {
    if (!this.marketConfig) {
      return [];
    }

    // 应用覆盖设置
    return this.marketConfig.modules.filter(moduleId => this.isModuleEnabled(moduleId));
  }

  // 临时覆盖模块可用性（用于测试或特殊情况）
  overrideModule(moduleId, enabled) {
    this.overrides[moduleId] = enabled;
    return this;
  }

  // 临时覆盖功能可用性
  overrideFeature(moduleId, featureId, enabled) {
    const featureKey = `${moduleId}.${featureId}`;
    this.overrides[featureKey] = enabled;
    return this;
  }

  // 重置所有覆盖设置
  resetOverrides() {
    this.overrides = {};
    return this;
  }
}

// 创建单例实例
const featureFlagService = new FeatureFlagService();

export default featureFlagService; 