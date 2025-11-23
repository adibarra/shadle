import type { UserModule } from '~/types'

// https://github.com/vite-pwa/vite-plugin-pwa
export const install: UserModule = ({ router }) => {
  if (import.meta.env.DEV) {
    console.warn('PWA: skipping registration in development')
    return
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('PWA: service Worker not supported')
    return
  }

  router.isReady()
    .then(async () => {
      const { registerSW } = await import('virtual:pwa-register')

      registerSW({
        immediate: true,
        onNeedRefresh() {
          console.warn('PWA: update available')
          location.reload()
        },
        onOfflineReady() {
          console.warn('PWA: ready for offline use')
        },
        onRegistered(registration) {
          console.warn('PWA: service worker registered')

          if (!registration) return

          const intervalMS = 60 * 60 * 1000
          setInterval(() => {
            registration.update()
          }, intervalMS)
        },
        onRegisterError(error) {
          console.warn('PWA: service worker registration failed', error)
        },
      })
    })
    .catch((error) => {
      console.warn('PWA: initialization failed', error)
    })
}
