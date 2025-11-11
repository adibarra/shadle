import { resolve } from 'node:path'
import process from 'node:process'
import reactPlugin from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const commitHash = process.env.COMMIT_HASH || 'unknown'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    reactPlugin(),
    Unocss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'shadle',
        short_name: 'shadle',
        description: 'A Wordle-style game with colors. Challenge your mind with daily color pattern puzzles.',
        theme_color: '#1da54f',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],

  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash.slice(0, 7)),
  },
})
