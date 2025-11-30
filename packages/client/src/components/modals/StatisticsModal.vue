<script setup lang="ts">
import { getPlayerId } from '~/utils'

const ui = useUiStore()
const { t } = useI18n()

// Get player ID
const playerId = computed(() => {
  if (typeof window === 'undefined') return ''
  return getPlayerId()
})

// Statistics data
const stats = ref({
  gamesPlayed: 0,
  gamesWon: 0,
  winRate: 0,
  dailyCompleted: 0,
  randomCompleted: 0,
  totalGuesses: 0,
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

  // Calculate completed puzzles for daily and random
  stats.value.dailyCompleted = history.filter(game => game.solved && game.puzzle_id.startsWith('§')).length
  stats.value.randomCompleted = history.filter(game => game.solved && game.puzzle_id.startsWith('random:')).length

  // Calculate total guesses
  stats.value.totalGuesses = history.reduce((sum, game) => sum + game.tries, 0)

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
  if (!playerId.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await getHistory(playerId.value)
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

    <div v-else class="space-y-10">
      <!-- Overall Stats -->
      <div>
        <h4 class="mb-4 text-center text-lg font-semibold">
          {{ t('stats.sections.overall') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold opacity-75">
              {{ stats.gamesPlayed }}
            </div>
            <div class="text-xs">
              {{ t('stats.gamesPlayed') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold opacity-75">
              {{ stats.gamesPlayed > 0 ? `${stats.winRate}%` : 'N/A' }}
            </div>
            <div class="text-xs">
              {{ t('stats.winRate') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold opacity-75">
              {{ stats.gamesPlayed > 0 ? stats.totalGuesses.toLocaleString() : 'N/A' }}
            </div>
            <div class="text-xs">
              {{ t('stats.totalGuesses') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold opacity-75">
              {{ stats.gamesWon > 0 ? stats.averageTries : 'N/A' }}
            </div>
            <div class="text-xs">
              {{ t('stats.averageTries') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Stats -->
      <div>
        <h4 class="mb-4 text-center text-lg font-semibold">
          {{ t('stats.sections.completion') }}
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold opacity-75">
              {{ stats.dailyCompleted }}
            </div>
            <div class="text-xs">
              {{ t('stats.dailyCompleted') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold opacity-75">
              {{ stats.randomCompleted }}
            </div>
            <div class="text-xs">
              {{ t('stats.randomCompleted') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Details -->
      <div v-if="stats.gamesWon > 0">
        <h4 class="mb-4 text-center text-lg font-semibold">
          {{ t('stats.sections.performance') }}
        </h4>
        <DistributionChart
          :tries-distribution="stats.triesDistribution"
          :games-won="stats.gamesWon"
        />
      </div>
    </div>
  </BaseModal>
</template>
