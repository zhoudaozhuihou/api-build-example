import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import JsonTableDisplay from '../components/JsonTableDisplay';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  codeBlock: {
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    fontSize: '14px',
    overflow: 'auto',
  },
  exampleCard: {
    marginBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
  }
}));

const JsonComponentDemo = () => {
  const classes = useStyles();

  // 各种数据示例
  const examples = {
    simple: {
      name: "张三",
      age: 28,
      isActive: true,
      email: "zhangsan@example.com"
    },
    
    complex: {
      user: {
        id: 12345,
        profile: {
          name: "李四",
          email: "lisi@example.com",
          avatar: "https://example.com/avatar.jpg",
          preferences: {
            theme: "dark",
            language: "zh-CN",
            notifications: {
              email: true,
              sms: false,
              push: true
            }
          }
        },
        permissions: ["read", "write", "admin"],
        metadata: {
          lastLogin: "2024-01-15T10:30:00Z",
          loginCount: 42,
          isVerified: true,
          balance: 999.99
        }
      },
      config: {
        apiEndpoints: [
          "https://api.example.com/users",
          "https://api.example.com/orders",
          "https://api.example.com/products"
        ],
        timeout: 5000,
        retryAttempts: 3,
        enableCache: true
      }
    },

    array: [
      { id: 1, name: "产品A", price: 99.99, inStock: true },
      { id: 2, name: "产品B", price: 149.99, inStock: false },
      { id: 3, name: "产品C", price: 199.99, inStock: true }
    ],

    apiResponse: {
      success: true,
      code: 200,
      message: "操作成功",
      data: {
        users: [
          { 
            id: 1, 
            name: "用户1", 
            roles: ["admin", "user"],
            stats: { loginCount: 15, score: 85.5 },
            createdAt: "2024-01-01T00:00:00Z"
          },
          { 
            id: 2, 
            name: "用户2", 
            roles: ["user"],
            stats: { loginCount: 8, score: 92.3 },
            createdAt: "2024-01-02T00:00:00Z"
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 100,
          hasNext: true,
          hasPrev: false
        }
      },
      timestamp: "2024-01-15T10:30:00Z",
      requestId: "req_123456789"
    },

    mixed: {
      string: "文本内容",
      number: 42,
      float: 3.14159,
      boolean: true,
      nullValue: null,
      array: [1, "混合", true, null, { nested: "对象" }],
      object: {
        deeply: {
          nested: {
            structure: {
              value: "深层嵌套的值"
            }
          }
        }
      }
    }
  };

  const [selectedExample, setSelectedExample] = useState('simple');
  const [customData, setCustomData] = useState('');
  const [customJsonData, setCustomJsonData] = useState(null);
  const [editableData, setEditableData] = useState({...examples.simple});
  const [jsonError, setJsonError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  // 处理自定义JSON输入
  const handleCustomJson = () => {
    try {
      const parsed = JSON.parse(customData);
      setCustomJsonData(parsed);
      setJsonError('');
    } catch (error) {
      setJsonError('JSON格式错误: ' + error.message);
    }
  };

  // 复制处理
  const handleCopy = (jsonString) => {
    navigator.clipboard.writeText(jsonString);
    setCopyStatus('已复制到剪贴板！');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  // 数据变化处理
  const handleDataChange = (newData) => {
    setEditableData(newData);
    console.log('数据已更新:', newData);
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h3" gutterBottom align="center">
        JsonTableDisplay 通用组件演示
      </Typography>
      
      <Typography variant="h6" color="textSecondary" align="center" paragraph>
        一个功能强大的通用JSON数据展示和编辑组件
      </Typography>

      {copyStatus && (
        <Alert severity="success" style={{ marginBottom: 16 }}>
          {copyStatus}
        </Alert>
      )}

      <Divider style={{ margin: '32px 0' }} />

      {/* 1. 基础用法 */}
      <Box className={classes.section}>
        <Typography variant="h4" gutterBottom>
          🚀 基础用法
        </Typography>
        
        <Card className={classes.exampleCard}>
          <CardHeader title="最简单的调用方式" />
          <CardContent>
            <Typography variant="body2" paragraph>
              只需要传入数据，组件会自动处理所有复杂的展示逻辑：
            </Typography>
            
            <Paper className={classes.codeBlock}>
              <pre style={{ margin: 0 }}>
{`import JsonTableDisplay from './components/JsonTableDisplay';

const data = {
  name: "张三",
  age: 28,
  isActive: true,
  email: "zhangsan@example.com"
};

<JsonTableDisplay 
  data={data} 
  title="用户信息" 
/>`}
              </pre>
            </Paper>

            <Box mt={2}>
              <JsonTableDisplay
                data={examples.simple}
                title="基础示例 - 只读模式"
                onCopy={handleCopy}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 2. 预设示例切换 */}
      <Box className={classes.section}>
        <Typography variant="h4" gutterBottom>
          📋 支持各种数据类型
        </Typography>
        
        <Box mb={2}>
          {Object.keys(examples).map((key) => (
            <Button
              key={key}
              variant={selectedExample === key ? "contained" : "outlined"}
              onClick={() => setSelectedExample(key)}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              {key === 'simple' && '简单对象'}
              {key === 'complex' && '复杂嵌套'}
              {key === 'array' && '数组数据'}
              {key === 'apiResponse' && 'API响应'}
              {key === 'mixed' && '混合类型'}
            </Button>
          ))}
        </Box>

        <JsonTableDisplay
          data={examples[selectedExample]}
          title={`数据类型示例: ${selectedExample}`}
          onCopy={handleCopy}
          defaultView="table"
        />
      </Box>

      {/* 3. 可编辑模式 */}
      <Box className={classes.section}>
        <Typography variant="h4" gutterBottom>
          ✏️ 可编辑模式
        </Typography>
        
        <Card className={classes.exampleCard}>
          <CardHeader title="启用编辑功能" />
          <CardContent>
            <Typography variant="body2" paragraph>
              通过设置 `isEditable=true` 和 `onDataChange` 回调启用编辑功能：
            </Typography>
            
            <Paper className={classes.codeBlock}>
              <pre style={{ margin: 0 }}>
{`const [data, setData] = useState(initialData);

<JsonTableDisplay
  data={data}
  title="可编辑数据"
  isEditable={true}
  onDataChange={setData}
  onCopy={handleCopy}
/>`}
              </pre>
            </Paper>

            <Box mt={2}>
              <JsonTableDisplay
                data={editableData}
                title="可编辑数据示例"
                isEditable={true}
                onDataChange={handleDataChange}
                onCopy={handleCopy}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 4. 自定义JSON输入 */}
      <Box className={classes.section}>
        <Typography variant="h4" gutterBottom>
          🛠️ 测试你的数据
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                输入JSON数据
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={12}
                variant="outlined"
                label="粘贴或输入你的JSON数据"
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder={`{
  "name": "测试数据",
  "config": {
    "enabled": true,
    "settings": {
      "theme": "dark",
      "language": "zh-CN"
    }
  },
  "items": [
    { "id": 1, "title": "项目1" },
    { "id": 2, "title": "项目2" }
  ],
  "metadata": {
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`}
              />
              
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCustomJson}
                  disabled={!customData.trim()}
                  style={{ marginRight: 8 }}
                >
                  解析并显示
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    setCustomData('');
                    setCustomJsonData(null);
                    setJsonError('');
                  }}
                >
                  清空
                </Button>
              </Box>

              {jsonError && (
                <Alert severity="error" style={{ marginTop: 8 }}>
                  {jsonError}
                </Alert>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {customJsonData ? (
              <JsonTableDisplay
                data={customJsonData}
                title="你的自定义数据"
                onCopy={handleCopy}
                isEditable={true}
                onDataChange={setCustomJsonData}
              />
            ) : (
              <Paper style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary" align="center">
                  在左侧输入JSON数据后点击"解析并显示"
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* 5. 完整属性示例 */}
      <Box className={classes.section}>
        <Typography variant="h4" gutterBottom>
          ⚙️ 完整属性配置
        </Typography>
        
        <Card className={classes.exampleCard}>
          <CardHeader title="所有可用属性" />
          <CardContent>
            <Paper className={classes.codeBlock}>
              <pre style={{ margin: 0 }}>
{`<JsonTableDisplay
  data={jsonData}                    // 必需：要显示的JSON数据
  title="数据标题"                   // 可选：组件标题
  isEditable={true}                  // 可选：是否可编辑，默认false
  onDataChange={handleDataChange}    // 可选：数据变化回调函数
  onCopy={handleCopy}               // 可选：复制操作回调函数
  isCopied={copied}                 // 可选：复制状态指示
  defaultView="table"               // 可选：默认视图模式 "table" | "json"
/>`}
              </pre>
            </Paper>
          </CardContent>
        </Card>
      </Box>

      {/* 6. 功能特性 */}
      <Box className={classes.section}>
        <Typography variant="h4" gutterBottom>
          ✨ 功能特性
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                📊 数据展示
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>支持任意JSON数据结构</li>
                <li>自动类型识别和颜色编码</li>
                <li>表格和JSON双视图切换</li>
                <li>层级结构清晰展示</li>
                <li>数据类型标签显示</li>
              </ul>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                🔧 交互功能
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>展开/折叠嵌套结构</li>
                <li>内联编辑数据值</li>
                <li>一键复制JSON数据</li>
                <li>类型验证和转换</li>
                <li>错误提示和处理</li>
              </ul>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                🎨 UI特性
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Material-UI设计风格</li>
                <li>响应式布局适配</li>
                <li>主题色彩体系</li>
                <li>流畅的动画效果</li>
                <li>直观的操作图标</li>
              </ul>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                ⚡ 技术特性
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>完全基于React Hooks</li>
                <li>TypeScript类型安全</li>
                <li>高性能渲染优化</li>
                <li>组件完全可复用</li>
                <li>零外部依赖冲突</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default JsonComponentDemo; 