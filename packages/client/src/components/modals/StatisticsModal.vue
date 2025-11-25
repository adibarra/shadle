<script setup lang="ts">
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
  if (ui.isOpen('statistics')) {
    loadStats()
  }
})
</script>

<template>
  <BaseModal modal-name="statistics" :title="t('stats.title')">
    <div v-if="loading" class="py-8 text-center">
      {{ t('stats.loading') }}
    </div>

    <div v-else-if="error" class="py-8 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="space-y-6">
      <!-- Games Played -->
      <div class="text-center">
        <div class="text-4xl font-bold opacity-75">
          {{ stats.gamesPlayed }}
        </div>
        <div class="text-sm">
          {{ t('stats.gamesPlayed') }}
        </div>
      </div>

      <!-- Win Rate -->
      <div class="text-center">
        <div class="text-4xl font-bold opacity-75">
          {{ stats.winRate }}%
        </div>
        <div class="text-sm">
          {{ t('stats.winRate') }}
        </div>
      </div>

      <!-- Streaks -->
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <div class="text-3xl font-bold opacity-75">
            {{ stats.currentStreak }}
          </div>
          <div class="text-sm">
            {{ t('stats.currentStreak') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold opacity-75">
            {{ stats.bestStreak }}
          </div>
          <div class="text-sm">
            {{ t('stats.bestStreak') }}
          </div>
        </div>
      </div>

      <!-- Average Tries -->
      <div v-if="stats.gamesWon > 0" class="text-center">
        <div class="text-4xl font-bold opacity-75">
          {{ stats.averageTries }}
        </div>
        <div class="text-sm">
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
  </BaseModal>
</template>
