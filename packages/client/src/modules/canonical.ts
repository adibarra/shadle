import type { UserModule } from '~/types'

export const install: UserModule = ({ router, head }) => {
  router.beforeResolve(() => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = window.location.origin + window.location.pathname

      head.push({
        link: [{
          rel: 'canonical',
          href: canonicalUrl,
          key: 'canonical',
        }],
      })
    }
  })
}
