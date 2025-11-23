<script setup lang="ts">
const ui = useUiStore()
const game = useGame()

// Check if we're on today's puzzle
const isTodayPuzzle = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return game.gameState.value.puzzleId === `§${today}`
})

// Menu options
const menuOptions = [
  {
    id: 'daily',
    title: 'Daily Puzzle',
    icon: 'i-carbon:time',
    action: () => {
      // TODO: Navigate to daily puzzle or reset to today
      console.warn('Daily puzzle navigation not implemented yet')
    },
    disabled: isTodayPuzzle.value,
  },
  {
    id: 'archive',
    title: 'Past Puzzles',
    icon: 'i-carbon:calendar',
    action: () => {
      // TODO: Implement archive/past puzzles
      console.warn('Past puzzles not implemented yet')
    },
    disabled: false,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'i-carbon:settings',
    action: () => ui.openSettings(),
    disabled: false,
  },
  {
    id: 'stats',
    title: 'Statistics',
    icon: 'i-carbon:chart-bar',
    action: () => {
      // TODO: Implement stats modal
      console.warn('Statistics not implemented yet')
    },
    disabled: false,
  },
]
</script>

<template>
  <div v-if="ui.showSidebar" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="mx-4 max-w-md w-full rounded-lg bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-lg">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold">
          Menu
        </h2>
        <button
          class="p-2 text-xl text-[var(--color-text)] hover:text-[var(--color-text-alt)]"
          @click="ui.showSidebar = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
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
          <span v-if="option.disabled" class="text-center text-xs opacity-75">Active</span>
        </button>
      </div>
    </div>
  </div>
</template>
