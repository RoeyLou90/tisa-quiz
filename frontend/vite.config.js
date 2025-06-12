import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],
    base: env.VITE_BASE_URL || "/",

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      port: 5173, // Vite default port
      strictPort: true, // Don't try other ports if 5173 is in use
      open: false, // Don't open browser automatically
      cors: true, // Enable CORS for development

      // Configure proxy for API requests
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
          // Configure proxy timeout (in milliseconds)
          timeout: 10000,
          // Don't verify SSL certificates (useful for development with self-signed certs)
          rejectUnauthorized: false,
        },
      },

      // Enable source maps in development
      sourcemap: true,

      // Configure HMR (Hot Module Replacement)
      hmr: {
        overlay: true, // Show error overlay in the browser
        clientPort: 443, // Required for HMR to work with WSL
        protocol: "ws",
        host: "localhost",
      },
    },

    // Build configuration
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode !== "production",
      minify: mode === "production" ? "terser" : false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            vendor: ["axios", "lodash"],
          },
        },
      },
    },

    // Environment variables
    define: {
      "process.env": {},
      __VUE_PROD_DEVTOOLS__: true, // Enable Vue Devtools in production
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },

    // Configure development server logging
    logLevel: "info",
    clearScreen: false,
  };
});
