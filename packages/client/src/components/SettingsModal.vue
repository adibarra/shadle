<script setup lang="ts">
const ui = useUiStore()
const { theme, setTheme } = useTheme()
const { resetApp } = useResetApp()
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
    resetApp()
    ui.showSettings = false
  }
}
</script>

<template>
  <div v-if="ui.showSettings" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.showSettings = false">
    <div :class="isCompactViewport ? 'absolute inset-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg' : 'mx-4 max-w-sm w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg'">
      <div class="mb-8 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-4">
        <h2 class="text-3xl font-bold">
          {{ t('settings.title') }}
        </h2>
        <button
          class="p-2 text-3xl"
          @click="ui.showSettings = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

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
          <option value="default">
            {{ t('settings.theme.options.default') }}
          </option>
          <option value="colorblind">
            {{ t('settings.theme.options.colorblind') }}
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
    </div>
  </div>
</template>
