const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'tslib': path.resolve(__dirname, 'node_modules/tslib'),
    },
  },
  define: {
    'process.env.PORT': JSON.stringify(process.env.PORT || 3001),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: '{}',
  },
  server: {
    port: 3001,
    open: true,
    hmr: {
      timeout: 60000
    },
    fs: {
      strict: true,
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      define: {
        global: 'window',
        'window.ethereum': 'window.ethereum',
      },
    },
    include: [
      'tslib', 
      'echarts-for-react',
      'react',
      'react-dom',
      '@material-ui/core',
      '@material-ui/icons',
      '@material-ui/lab',
      'draft-js',
      'mui-rte'
    ],
    exclude: ['ethereum'],
    force: true,
  },
  css: {
    devSourcemap: true,
  },
  // Remove Vite branding
  clearScreen: false,
}); 