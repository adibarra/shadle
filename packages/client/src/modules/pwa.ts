import type { UserModule } from '~/types'

// https://github.com/vite-pwa/vite-plugin-pwa
export const install: UserModule = ({ router }) => {
  router.isReady()
    .then(async () => {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({ immediate: true })
    })
    .catch(() => {})
}
