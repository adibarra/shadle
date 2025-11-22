<script setup lang="ts">
import { inject, ref } from 'vue'

interface Props {
  show: boolean
  onClose: () => void
}

const props = defineProps<Props>()

const setTheme = inject<(theme: string) => void>('setTheme')!
const theme = inject<Ref<string>>('theme')!
const resetApp = inject<() => void>('resetApp')!

const selectedTheme = ref(theme.value)
const deviceId = ref(localStorage.getItem('shadle-device-id') || 'Not available')

function handleThemeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const newTheme = target.value
  selectedTheme.value = newTheme
  setTheme(newTheme)
}

async function copyDeviceId() {
  try {
    await navigator.clipboard.writeText(deviceId.value)
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = deviceId.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

function handleReset() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to reset? This will clear all game data and generate a new device ID.')) {
    resetApp()
    props.onClose()
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="mx-4 max-w-sm w-full rounded-lg bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-lg">
      <h2 class="mb-4 text-2xl font-bold">
        Settings
      </h2>
      <div class="mb-4">
        <label for="theme-select" class="mb-2 block text-sm font-medium">Theme</label>
        <p class="mb-2 text-xs text-gray-600">
          Choose your preferred color scheme for the game.
        </p>
        <select
          id="theme-select"
          :value="selectedTheme"
          class="w-full border border-[var(--color-outline)] rounded bg-[var(--color-bg)] p-2 text-[var(--color-text)]"
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
      <div class="mb-4">
        <label class="mb-2 block text-sm font-medium">Device ID</label>
        <p class="mb-2 text-xs text-gray-600">
          Your unique identifier used for game statistics.
        </p>
        <div class="flex space-x-2">
          <input
            type="text"
            :value="deviceId"
            readonly
            class="flex-1 border border-[var(--color-outline)] rounded bg-[var(--color-bg)] p-2 text-white/50"
          >
          <button class="rounded bg-[var(--color-accent)] px-3 py-2 text-[var(--color-text)]" @click="copyDeviceId">
            Copy
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label class="mb-1 block text-sm text-red-500 font-medium">Reset Memory</label>
        <p class="mb-2 text-xs text-gray-600">
          Clear all saved game data and generate a new device ID. You won't be able to see your old game history.
        </p>
        <button class="rounded bg-red-500 px-2 py-1 text-white" @click="handleReset">
          Reset Memory
        </button>
      </div>
      <div class="flex justify-end">
        <button class="btn rounded bg-[var(--color-accent)] px-4 py-2 text-[var(--color-text)]" @click="props.onClose">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
