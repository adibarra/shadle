<script setup lang="ts">
const ui = useUiStore()
const { theme, setTheme } = useTheme()
const resetApp = inject<() => void>('resetApp')!

function handleThemeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const newTheme = target.value
  setTheme(newTheme)
}

function handleReset() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to reset? This will clear all game data and generate a new device ID.')) {
    resetApp()
    ui.showSettings = false
  }
}
</script>

<template>
  <div v-if="ui.showSettings" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="mx-4 max-w-sm w-full rounded-lg bg-[var(--color-bg)] p-6 shadow-lg">
      <div class="mb-8 flex flex-row items-center justify-between">
        <h2 class="text-3xl font-bold">
          Settings
        </h2>
        <button
          class="p-2 text-3xl"
          @click="ui.showSettings = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

      <div class="mb-8">
        <label for="theme-select" class="mb-2 block text-xl font-medium">Theme</label>
        <p class="mb-2 text-sm op-50">
          Choose your preferred color scheme.
        </p>
        <select
          id="theme-select"
          :value="theme"
          class="w-full border border-[var(--color-outline)] rounded bg-[var(--color-bg)] p-2 text-sm text-[var(--color-text)]"
          @change="handleThemeChange"
        >
          <option value="default">
            Default
          </option>
          <option value="colorblind">
            Colorblind
          </option>
        </select>
      </div>

      <div class="mb-8">
        <label class="mb-1 block text-xl text-red-500 font-medium">Reset Memory</label>
        <p class="mb-2 text-sm op-50">
          Clear all saved game data. You won't be able to see your old game history.
        </p>
        <button class="rounded bg-red-500 px-2 py-1 text-sm" @click="handleReset">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
