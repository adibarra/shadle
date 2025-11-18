import type { RouteRecordRaw } from 'vue-router'
import type { UserModule } from '~/types'
import { createHead } from '@unhead/vue/client'
import { setupLayouts } from 'virtual:generated-layouts'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import App from '~/App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'

const head = createHead()

// create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes as RouteRecordRaw[]),
})

// create the Vue app instance
const app = createApp(App)

// install all modules under `modules/`
Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.({ app, router }))

// mount the app
app.use(router)
app.use(head)

// handle HMR with layouts
if (import.meta.hot) {
  handleHotUpdate(router, (newRoutes) => {
    const withLayoutsRoutes = setupLayouts(newRoutes)
    withLayoutsRoutes.forEach((route) => {
      router.addRoute(route)
    })
  })
}

app.mount('#app')
