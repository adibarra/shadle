import type { UserModule } from '~/types'

export const install: UserModule = ({ router, head }) => {
  router.beforeResolve(() => {
    if (typeof window === 'undefined') return

    head.push({
      link: [{
        key: 'canonical',
        rel: 'canonical',
        href: window.location.origin + window.location.pathname,
      }],
    })
  })
}
