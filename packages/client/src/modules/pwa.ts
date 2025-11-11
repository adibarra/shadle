import type { UserModule } from '~/types'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = async () => {
  const { registerSW } = await import('virtual:pwa-register')
  registerSW({ immediate: true })

  // request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}
