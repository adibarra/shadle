<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { textColorClasses } from '../constants'
import { useGame } from '../composables/game'
import { getStats } from '../composables/api'
import type { StatsResponse } from '@shadle/types'
import DistributionChart from './DistributionChart.vue'

interface Props {
  won: boolean
  attempts: number
  onClose: () => void
  guesses: readonly (readonly ValidColor[])[]
  feedback: readonly (readonly GuessStatus[])[]
}

const props = defineProps<Props>()
const { t } = useI18n()
const { share } = useShare()

const { gameState } = useGame()

const stats = ref<StatsResponse | null>(null)

onMounted(async () => {
  if (props.won) {
    try {
      const fetchedStats = await getStats(gameState.value.puzzleId)
      stats.value = fetchedStats
    } catch (e) {
      // If 404 or error, create empty stats
      stats.value = {
        puzzleId: gameState.value.puzzleId,
        totalAttempts: 0,
        totalDevices: 0,
        avgTries: 0,
        successRate: 0,
        failedAttempts: 0,
        triesDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        completionRate: 0,
      }
    }
    // Always include the user's just completed game
    if (stats.value) {
      stats.value.triesDistribution[props.attempts] = (stats.value.triesDistribution[props.attempts] || 0) + 1
      stats.value.totalAttempts += 1
      stats.value.totalDevices += 1 // Assuming new device, but actually might not be
      // Recalculate gamesWon as sum of triesDistribution
    }
  }
})

function generateShareText() {
  let text = `Shadle ${props.attempts}/6\n\n`
  for (let i = 0; i < props.guesses.length; i++) {
    for (let j = 0; j < props.guesses[i].length; j++) {
      const status = props.feedback[i][j]
      if (status === GuessStatus.CORRECT) text += '🟩'
      else if (status === GuessStatus.PRESENT) text += '🟨'
      else text += '⬛'
    }
    text += '\n'
  }
  return text.trim()
}

function handleShare() {
  share({
    title: 'Shadle',
    text: generateShareText(),
    url: window.location.href,
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="props.onClose()">
    <div :class="isCompactViewport ? 'absolute inset-4 flex flex-col justify-between rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 text-[var(--color-text)] shadow-lg' : 'mx-4 max-w-sm min-h-[200px] w-full flex flex-col justify-between rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 text-[var(--color-text)] shadow-lg'">
      <div>
        <div class="mb-4 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-4">
          <h2 class="text-2xl font-bold" :class="props.won ? textColorClasses.G : textColorClasses.R">
            {{ props.won ? t('winModal.messages.congratulations') : t('winModal.messages.gameOver') }}
          </h2>
          <button
            class="p-2 text-3xl"
            @click="props.onClose()"
          >
            <div class="i-carbon:close" />
          </button>
        </div>
        <p class="mb-4">
          {{ props.won ? t('winModal.messages.solved', { attempts: props.attempts }) : t('winModal.messages.tryAgain') }}
        </p>
        <div v-if="props.won" class="mb-4">
          <div class="grid grid-rows-6 gap-3">
            <div
              v-for="(guess, guessIndex) in props.guesses"
              :key="guessIndex"
              class="grid grid-cols-5"
            >
              <ColorSwatch
                v-for="(color, colorIndex) in guess"
                :key="colorIndex"
                :color="color"
                :feedback="props.feedback[guessIndex][colorIndex]"
              />
            </div>
          </div>
        </div>
        <div v-if="stats" class="mb-4">
          <h3 class="text-lg font-semibold mb-2">{{ t('winModal.distribution.title') }}</h3>
          <DistributionChart
            :tries-distribution="stats.triesDistribution"
            :games-won="(Object.values(stats.triesDistribution) as number[]).reduce((sum, count) => sum + count, 0)"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <button v-if="props.won" class="flex grow flex-row items-center justify-center border-2 border-[var(--color-outline)] rounded-lg bg-[var(--color-bg)] px-8 py-3 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-outline)]" @click="handleShare">
          <div class="i-carbon:share mr-2 text-3xl" />
          <span class="text-center text-sm font-medium">{{ t('winModal.actions.share') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
