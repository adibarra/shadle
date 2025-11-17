import type { UserModule } from '~/types'
import { createHead } from '@unhead/vue/client'

export const install: UserModule = ({ app, router }) => {
  const head = createHead()

  router.afterEach((_to: any) => {
    if (typeof window !== 'undefined') {
      const canonicalUrl = window.location.href.split('?')[0]
      head.push({
        link: [
          { rel: 'canonical', href: canonicalUrl, key: 'canonical' },
        ],
      })
    }
  })

  app.use(head)
}
