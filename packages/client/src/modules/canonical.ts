import type { UserModule } from '~/types'
import { createHead } from '@unhead/vue/client'

export const install: UserModule = ({ app, router }) => {
  const head = createHead()

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

  app.use(head)
}
