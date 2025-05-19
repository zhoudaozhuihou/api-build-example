import React from 'react';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Chip,
  Box
} from '@material-ui/core';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';

/**
 * 市场切换器组件，用于测试不同市场的功能
 */
const MarketSwitcher = () => {
  const [open, setOpen] = React.useState(false);
  const { currentMarket, setMarket, enabledModules, MODULES } = useFeatureFlags();

  const markets = [
    { id: 'china', name: '中国' },
    { id: 'north-america', name: '北美' },
    { id: 'europe', name: '欧洲' },
    { id: 'southeast-asia', name: '东南亚' }
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarketChange = (event) => {
    setMarket(event.target.value);
  };

  // 获取模块名称
  const getModuleName = (moduleId) => {
    switch(moduleId) {
      case MODULES.API_MANAGEMENT: return 'API管理';
      case MODULES.DATASET_MANAGEMENT: return '数据集管理';
      case MODULES.LOWCODE_BUILDER: return '低代码构建器';
      case MODULES.REVIEW_ORDERS: return '审核与订单';
      case MODULES.ANALYTICS: return '统计分析';
      case MODULES.ADMIN: return '管理员';
      default: return moduleId;
    }
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        切换市场
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>市场切换器</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            当前市场: <strong>{currentMarket}</strong>
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="market-selector-label">选择市场</InputLabel>
            <Select
              labelId="market-selector-label"
              id="market-selector"
              value={currentMarket}
              onChange={handleMarketChange}
            >
              {markets.map(market => (
                <MenuItem key={market.id} value={market.id}>
                  {market.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              已启用的模块:
            </Typography>
            <Grid container spacing={1}>
              {enabledModules.map(moduleId => (
                <Grid item key={moduleId}>
                  <Chip 
                    label={getModuleName(moduleId)} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MarketSwitcher; 