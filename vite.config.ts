import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 128 * 1024 // inline upto 128 kb
  },
  plugins: [
    svelte(),
    Icons({
      compiler: 'svelte'
    }),
    VitePWA({
      workbox: {
        globPatterns: [
          "**\/*.{js,css,html,png,jpg}",
        ]
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'ArithMagic',
        short_name: 'ArithMagic',
        description: 'A fun numbers game!',
        theme_color: '#b1dcec',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-256x256.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-256x256.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ],
  server: {
    host: "0.0.0.0"
  }
})
