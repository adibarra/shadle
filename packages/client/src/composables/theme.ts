import { useStorage } from '@vueuse/core'
import { watch } from 'vue'

const themes = {
  default: '',
  colorblind: 'tol-muted',
} as const

export function useTheme() {
  const theme = useStorage('shadle/theme', 'default')

  const setTheme = (newTheme: string) => {
    theme.value = newTheme
  }

  watch(theme, (newTheme) => {
    Object.values(themes).forEach((cls) => {
      if (cls) document.documentElement.classList.remove(cls)
    })

    const cls = themes[newTheme as keyof typeof themes]
    if (cls) document.documentElement.classList.add(cls)
  }, { immediate: true })

  return { theme, setTheme }
}
