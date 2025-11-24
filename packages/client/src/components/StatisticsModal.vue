<script setup lang="ts">
import { getHistory } from '../composables/api'
import DistributionChart from './DistributionChart.vue'

const ui = useUiStore()
const { t } = useI18n()

// Get device ID
const deviceId = computed(() => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('shadle-device-id') || ''
})

// Statistics data
const stats = ref({
  gamesPlayed: 0,
  gamesWon: 0,
  winRate: 0,
  currentStreak: 0,
  bestStreak: 0,
  averageTries: 0,
  triesDistribution: {} as Record<number, number>,
})

const loading = ref(false)
const error = ref('')

// Calculate statistics from history
function calculateStats(history: any[]) {
  if (!history.length) return

  stats.value.gamesPlayed = history.length
  stats.value.gamesWon = history.filter(game => game.solved).length
  stats.value.winRate = Math.round((stats.value.gamesWon / stats.value.gamesPlayed) * 100)

  // Calculate streaks
  let currentStreak = 0
  let bestStreak = 0
  let tempStreak = 0

  // Sort by date (most recent first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  for (const game of sortedHistory) {
    if (game.solved) {
      tempStreak++
      bestStreak = Math.max(bestStreak, tempStreak)
    } else {
      break
    }
  }

  currentStreak = tempStreak

  stats.value.currentStreak = currentStreak
  stats.value.bestStreak = bestStreak

  // Calculate average tries for won games
  const wonGames = history.filter(game => game.solved)
  if (wonGames.length > 0) {
    stats.value.averageTries = Math.round((wonGames.reduce((sum, game) => sum + game.tries, 0) / wonGames.length) * 10) / 10
  }

  // Calculate tries distribution
  stats.value.triesDistribution = {}
  for (let i = 1; i <= 6; i++) {
    stats.value.triesDistribution[i] = history.filter(game => game.solved && game.tries === i).length
  }
}

// Load statistics
async function loadStats() {
  if (!deviceId.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await getHistory(deviceId.value)
    const history = response.attempts
    calculateStats(history)
  } catch (err) {
    error.value = 'Failed to load statistics'
    console.error('Failed to load stats:', err)
  } finally {
    loading.value = false
  }
}

// Load stats when modal opens
watchEffect(() => {
  if (ui.showStatistics) {
    loadStats()
  }
})
</script>

<template>
  <div v-if="ui.showStatistics" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.showStatistics = false">
    <div :class="isCompactViewport ? 'absolute inset-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg' : 'mx-4 max-w-md w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg'">
      <div class="mb-8 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-4">
        <h2 class="text-3xl font-bold">
          {{ t('stats.title') }}
        </h2>
        <button
          class="p-2 text-3xl"
          @click="ui.showStatistics = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

      <div v-if="loading" class="py-8 text-center">
        {{ t('stats.loading') }}
      </div>

      <div v-else-if="error" class="py-8 text-center text-red-500">
        {{ error }}
      </div>

      <div v-else class="space-y-6">
        <!-- Games Played -->
        <div class="text-center">
          <div class="text-4xl font-bold">
            {{ stats.gamesPlayed }}
          </div>
          <div class="text-sm text-gray-600">
            {{ t('stats.gamesPlayed') }}
          </div>
        </div>

        <!-- Win Rate -->
        <div class="text-center">
          <div class="text-4xl font-bold">
            {{ stats.winRate }}%
          </div>
          <div class="text-sm text-gray-600">
            {{ t('stats.winRate') }}
          </div>
        </div>

        <!-- Streaks -->
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold">
              {{ stats.currentStreak }}
            </div>
            <div class="text-sm text-gray-600">
              {{ t('stats.currentStreak') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">
              {{ stats.bestStreak }}
            </div>
            <div class="text-sm text-gray-600">
              {{ t('stats.bestStreak') }}
            </div>
          </div>
        </div>

        <!-- Average Tries -->
        <div v-if="stats.gamesWon > 0" class="text-center">
          <div class="text-4xl font-bold">
            {{ stats.averageTries }}
          </div>
          <div class="text-sm text-gray-600">
            {{ t('stats.averageTries') }}
          </div>
        </div>

        <!-- Tries Distribution -->
        <div v-if="stats.gamesWon > 0" class="space-y-2">
          <h3 class="text-center text-lg font-semibold">
            {{ t('stats.triesDistribution') }}
          </h3>
          <DistributionChart
            :tries-distribution="stats.triesDistribution"
            :games-won="stats.gamesWon"
          />
        </div>
      </div>
    </div>
  </div>
</template>
