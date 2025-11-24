<script setup lang="ts">
import type { StatsResponse } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { textColorClasses } from '~/constants'

const { t } = useI18n()
const { share } = useShare()
const game = useGameStore()

const stats = ref<StatsResponse | null>(null)

watch(() => game.won || game.lost, async (gameEnded) => {
  if (gameEnded) {
    try {
      const fetchedStats = await getStats(game.puzzleId)
      stats.value = fetchedStats
    } catch {
      // if error use empty stats
      stats.value = {
        puzzleId: game.puzzleId,
        totalAttempts: 0,
        totalDevices: 0,
        avgTries: 0,
        successRate: 0,
        failedAttempts: 0,
        triesDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        completionRate: 0,
      }
    }
    // always include the user's just completed game
    if (stats.value) {
      stats.value.triesDistribution[game.attempts] = (stats.value.triesDistribution[game.attempts] || 0) + 1
      stats.value.totalAttempts += 1
    }
  }
})

function generateShareText() {
  let text = `Shadle ${game.attempts}/6\n\n`
  for (let i = 0; i < game.guesses.length; i++) {
    for (let j = 0; j < game.guesses[i].length; j++) {
      const status = game.feedback[i][j]
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
  <BaseModal modal-name="win" max-width="max-w-sm" :title="game.won ? t('modals.win.messages.congratulations') : t('modals.win.messages.gameOver')" :title-class="game.won ? textColorClasses.G : textColorClasses.R">
    <p class="mb-4">
      {{ game.won ? t('modals.win.messages.solved', { attempts: game.attempts }) : t('modals.win.messages.tryAgain') }}
    </p>
    <div v-if="game.won || game.lost" class="mb-4">
      <div class="grid grid-rows-6 gap-3">
        <div
          v-for="(_, guessIndex) in Array(6).fill(null)"
          :key="guessIndex"
          class="grid grid-cols-5"
        >
          <ColorSwatch
            v-for="(__, colorIndex) in Array(5).fill(null)"
            :key="colorIndex"
            :color="guessIndex < game.guesses.length ? game.guesses[guessIndex][colorIndex] : undefined"
            :feedback="guessIndex < game.guesses.length ? game.feedback[guessIndex][colorIndex] : undefined"
          />
        </div>
      </div>
    </div>
    <div v-if="stats" class="mb-4">
      <h3 class="mb-2 text-lg font-semibold">
        {{ t('modals.win.distribution.title') }}
      </h3>
      <DistributionChart
        :tries-distribution="stats.triesDistribution"
        :games-won="(Object.values(stats.triesDistribution) as number[]).reduce((sum, count) => sum + count, 0)"
      />
    </div>

    <div class="flex justify-start">
      <IconButton v-if="game.won" icon="i-carbon:share" :text="t('modals.win.actions.share')" @click="handleShare" />
    </div>
  </BaseModal>
</template>
