import type { UserModule } from '~/types'
import { createI18n } from 'vue-i18n'
import en from '~/locales/en.json'

// https://vue-i18n.intlify.dev/
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en } as any,
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../locales/*.json'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.json$/)?.[1], loadLocale]),
) as Record<string, () => Promise<{ default: Record<string, any> }>>

export const availableLocales = Object.keys(localesMap)

const loadedLanguages: string[] = []

function setI18nLanguage(lang: string) {
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: string): Promise<string> {
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default as any)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export const install: UserModule = ({ app }) => {
  app.use(i18n)
  loadLanguageAsync('en')
}
