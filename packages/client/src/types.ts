import type { createHead } from '@unhead/vue/client'
import type { App } from 'vue'
import type { Router } from 'vue-router'

export type UserModule = (ctx: { app: App, router: Router, head: ReturnType<typeof createHead> }) => void
