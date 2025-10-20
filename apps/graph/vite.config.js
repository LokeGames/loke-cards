import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: Number(process.env.VITE_GRAPH_PORT || 8092),
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_LOKE_ENGINE_API || 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@graph': path.resolve(__dirname, 'src/graph'),
    },
  },
  css: {
    postcss: path.resolve(process.cwd(), 'postcss.config.js'),
  },
}))

