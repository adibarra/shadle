<script setup lang="ts">
const ui = useUiStore()
const { theme, setTheme } = useTheme()
const game = useGameStore()
const { t } = useI18n()
const { availableLocales, currentLocale, localeNames } = useLocales()

function handleThemeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const newTheme = target.value
  setTheme(newTheme)
}

function handleReset() {
  // eslint-disable-next-line no-alert
  if (confirm(t('settings.reset.confirm'))) {
    game.resetApp()
    ui.close('settings')
  }
}
</script>

<template>
  <BaseModal modal-name="settings" :title="t('settings.title')">
    <div class="mb-8">
      <label for="theme-select" class="mb-2 block text-xl font-medium">{{ t('settings.theme.title') }}</label>
      <p class="mb-2 text-sm op-50">
        {{ t('settings.theme.description') }}
      </p>
      <select
        id="theme-select"
        :value="theme"
        class="w-full border border-[var(--color-outline)] rounded bg-[var(--color-bg)] p-2 text-sm text-[var(--color-text)]"
        @change="handleThemeChange"
      >
        <option v-for="themeKey in Object.keys(themes)" :key="themeKey" :value="themeKey">
          {{ t(`settings.theme.options.${themeKey}`) }}
        </option>
      </select>
    </div>

    <div class="mb-8">
      <label for="language-select" class="mb-2 block text-xl font-medium">{{ t('settings.language.title') }}</label>
      <p class="mb-2 text-sm op-50">
        {{ t('settings.language.description') }}
      </p>
      <select
        id="language-select"
        v-model="currentLocale"
        class="w-full border border-[var(--color-outline)] rounded bg-[var(--color-bg)] p-2 text-sm text-[var(--color-text)]"
      >
        <option v-for="locale in availableLocales" :key="locale" :value="locale">
          {{ localeNames[locale] }}
        </option>
      </select>
    </div>

    <div class="mb-8">
      <label class="mb-1 block text-xl text-red-500 font-medium">{{ t('settings.reset.title') }}</label>
      <p class="mb-2 text-sm op-50">
        {{ t('settings.reset.description') }}
      </p>
      <button class="rounded bg-red-500 px-2 py-1 text-sm" @click="handleReset">
        {{ t('settings.reset.reset') }}
      </button>
    </div>
  </BaseModal>
</template>
