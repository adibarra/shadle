import { useStorage } from '@vueuse/core'
import { watch } from 'vue'

export function useTheme() {
  const theme = useStorage('shadle/theme', 'default')

  const setTheme = (newTheme: string) => {
    theme.value = newTheme
  }

  watch(theme, (newTheme) => {
    if (newTheme === 'colorblind') {
      document.documentElement.classList.add('tol-muted')
    } else {
      document.documentElement.classList.remove('tol-muted')
    }
  })

  return { theme, setTheme }
}
