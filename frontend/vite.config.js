import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    // Use VITE_BASE_URL environment variable or fallback to '/'
    base: env.VITE_BASE_URL || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // 確保生產環境的 base 路徑正確
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
    // 確保構建時正確處理路徑
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // 確保構建後的靜態資源路徑正確
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'axios']
          },
          // 確保靜態資源路徑正確
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
  }
})
