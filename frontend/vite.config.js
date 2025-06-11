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
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // Ensure proper chunking for Vercel
      rollupOptions: {
        output: {
          manualChunks: {
            'vue': ['vue', 'vue-router', 'pinia'],
            'vendor': ['axios']
          }
        }
      }
    }
  }
})
