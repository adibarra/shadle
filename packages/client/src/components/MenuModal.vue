<script setup lang="ts">
const ui = useUiStore()
const game = useGame()
const { t } = useI18n()

// Check if we're on today's puzzle
const isTodayPuzzle = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return game.gameState.value.puzzleId === `§${today}`
})

// Menu options
const menuOptions = computed(() => [
  {
    id: 'daily',
    title: t('menu.items.dailyPuzzle'),
    icon: 'i-carbon:time',
    action: () => {
      // TODO: Navigate to daily puzzle or reset to today
      console.warn('Daily puzzle navigation not implemented yet')
    },
    disabled: isTodayPuzzle.value,
  },
  {
    id: 'archive',
    title: t('menu.items.pastPuzzles'),
    icon: 'i-carbon:calendar',
    action: () => {
      // TODO: Implement archive/past puzzles
      console.warn('Past puzzles not implemented yet')
    },
    disabled: false,
  },
  {
    id: 'settings',
    title: t('menu.items.settings'),
    icon: 'i-carbon:settings',
    action: () => ui.openSettings(),
    disabled: false,
  },
  {
    id: 'stats',
    title: t('menu.items.statistics'),
    icon: 'i-carbon:chart-bar',
    action: () => {
      // TODO: Implement stats modal
      console.warn('Statistics not implemented yet')
    },
    disabled: false,
  },
])
</script>

<template>
  <div v-if="ui.showSidebar" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.showSidebar = false">
    <div :class="isCompactViewport ? 'absolute inset-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg' : 'mx-4 max-w-md w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg'">
      <div class="mb-8 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-4">
        <h2 class="text-3xl font-bold">
          {{ t('menu.title') }}
        </h2>
        <button
          class="p-2 text-3xl"
          @click="ui.showSidebar = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

      <div class="grid grid-cols-2 mb-8 gap-4">
        <button
          v-for="option in menuOptions"
          :key="option.id"
          class="flex flex-col items-center justify-center border-2 rounded-lg p-4 transition-all"
          :class="option.disabled
            ? 'border-[var(--color-outline)] bg-[var(--color-outline)] cursor-not-allowed opacity-50'
            : 'border-[var(--color-outline)] bg-[var(--color-bg)] hover:border-[var(--color-accent)] hover:bg-[var(--color-outline)]'"
          :disabled="option.disabled"
          @click="option.action()"
        >
          <div :class="option.icon" class="mb-2 text-3xl" />
          <span class="text-center text-sm font-medium">{{ option.title }}</span>
          <span v-if="option.disabled" class="text-center text-xs opacity-75">{{ t('menu.active') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
