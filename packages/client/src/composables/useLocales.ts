import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'
import { getStoredLocale, setStoredLocale } from '~/utils'

export function useLocales() {
  const { t } = useI18n()

  const currentLocale = computed({
    get: () => useI18n().locale.value,
    set: async (val: string) => {
      if (availableLocales.includes(val)) {
        await loadLanguageAsync(val)
        setStoredLocale(val)
      }
    },
  })

  const setLocale = async (locale: string) => {
    currentLocale.value = locale
  }

  const localeNames: Record<string, string> = {
    en: 'English',
    es: 'Español',
  }

  onMounted(async () => {
    const stored = getStoredLocale()
    if (stored && availableLocales.includes(stored)) {
      await setLocale(stored)
    } else {
      const browserLang = navigator.language.split('-')[0] // e.g., 'es' from 'es-ES'
      const defaultLang = availableLocales.includes(browserLang) ? browserLang : 'en'
      await setLocale(defaultLang)
    }
  })

  return {
    availableLocales,
    currentLocale,
    setLocale,
    localeNames,
    t,
  }
}
