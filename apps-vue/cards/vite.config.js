import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => ({
  base: '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      includeAssets: ['icons/*.svg', 'icons/*.png'],
      manifest: {
        name: 'Loke Cards',
        short_name: 'LokeCards',
        description: 'Interactive Fiction Scene Editor for Loke Engine',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: Number(process.env.VITE_DEV_PORT || process.env.PORT || 8081),
    https: false,
    strictPort: true,
    allowedHosts: [
      'loke.tail2d448.ts.net',
      'localhost',
      '127.0.0.1'
    ],

    proxy: {
      '/api': {
        target: process.env.VITE_LOKE_ENGINE_API || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@shared': '/home/lpm/REPO/loke/loke-cards/apps-vue/shared-vue/src',
    },
  }
}));
