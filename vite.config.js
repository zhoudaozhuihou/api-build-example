const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [
    react(),
    {
      name: 'ethereum-provider-handler',
      apply: 'serve',
      configureServer(server) {
        // Add headers to allow iframe embedding and help with CORS issues
        server.middlewares.use((req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
          res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          next();
        });
      },
      transformIndexHtml(html) {
        // Insert ethereum shim script at the beginning of head
        return html.replace(
          /<head>/,
          `<head>
            <script>
              // Inline ethereum property handling
              try {
                if (!window.ethereum) {
                  let ethereumVal = null;
                  Object.defineProperty(window, 'ethereum', {
                    configurable: true,
                    set: function(val) { ethereumVal = val; },
                    get: function() { return ethereumVal; }
                  });
                }
              } catch (e) {
                console.warn('Failed to set ethereum property', e);
              }
            </script>`
        );
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'tslib': path.resolve(__dirname, 'node_modules/tslib'),
    },
  },
  define: {
    'process.env.PORT': JSON.stringify(process.env.PORT || 3001),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Ensure global is defined
    global: 'globalThis',
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@material-ui/core', '@material-ui/icons', '@material-ui/lab'],
        },
      },
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
        global: 'globalThis',
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