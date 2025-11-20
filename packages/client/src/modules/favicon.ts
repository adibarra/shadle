import type { UserModule } from '~/types'
import { preferredDark } from '~/composables/utils'

export const install: UserModule = ({ head }) => {
  if (typeof window === 'undefined') return

  head.push({
    link: [{
      key: 'favicon',
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    }],
  })
}
