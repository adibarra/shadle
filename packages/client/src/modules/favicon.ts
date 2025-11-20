import type { UserModule } from '~/types'
import { preferredDark } from '~/composables/utils'

export const install: UserModule = ({ head }) => {
  head.push({
    link: [{
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
      key: 'favicon',
    }],
  })
}
