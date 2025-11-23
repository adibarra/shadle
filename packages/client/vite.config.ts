import { resolve } from 'node:path'
import process from 'node:process'
import { unheadVueComposablesImports } from '@unhead/vue'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import WebfontDownload from 'vite-plugin-webfont-dl'

const commitHash = process.env.COMMIT_HASH || 'unknown'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(import.meta.dirname, 'src')}/`,
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3332',
        changeOrigin: true,
      },
    },
  },

  plugins: [
    // https://vue-macros.dev/guide/getting-started
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),

    // https://github.com/unplugin/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'vue-i18n',
        unheadVueComposablesImports,
        VueRouterAutoImports,
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/stores'],
      vueTemplate: true,
    }),

    // https://github.com/unplugin/unplugin-vue-components
    Components({
      dts: 'src/components.d.ts',
    }),

    // https://github.com/unocss/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/feat-agency/vite-plugin-webfont-dl
    ...(process.env.NODE_ENV === 'prod'
      ? [WebfontDownload([
          'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap',
          'https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400;500;700&display=swap',
          'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&display=swap',
        ],
        )]
      : []),
  ],

  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash.slice(0, 7)),
  },
})
