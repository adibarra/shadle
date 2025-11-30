<script setup lang="ts">
import type { StatsResponse } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import confetti from 'canvas-confetti'
import { textColorClasses } from '~/constants'

const { t, d } = useI18n()
const { share } = useShare()
const game = useGameStore()
const ui = useUiStore()

const stats = ref<StatsResponse | null>(null)

watch(() => game.won || game.lost, async (gameEnded) => {
  if (gameEnded) {
    const fetchedStats = game.currentMode === 'random' ? await getRandomStats() : await getStats(game.puzzleId)
    stats.value = fetchedStats
    // always include the user's just completed game
    if (stats.value) {
      stats.value.triesDistribution[game.attempts] = (stats.value.triesDistribution[game.attempts] || 0) + 1
      stats.value.totalAttempts += 1
    }
  }
})

// trigger confetti on win
watch(() => ui.isOpen('win'), (isOpen) => {
  if (isOpen && game.won) {
    // Fire confetti from both sides
    const duration = 3000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      // fire from left edge
      confetti({
        particleCount,
        startVelocity: randomInRange(50, 100),
        spread: randomInRange(50, 70),
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      })

      // fire from right edge
      confetti({
        particleCount,
        startVelocity: randomInRange(50, 100),
        spread: randomInRange(50, 70),
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      })
    }, 250)
  }
})

function generateShareText() {
  const dateStr = game.selectedDate || new Date().toISOString().split('T')[0]
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = d(date, 'short')

  let text = `Shadle ${game.attempts}/6\n${formattedDate}\n\n`
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

function handlePlayRandom() {
  game.setPuzzleMode('random')
  ui.close('win')
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
      <h3 class="mb-6 text-center text-lg font-semibold">
        {{ t('modals.win.distribution.title') }}
      </h3>
      <DistributionChart
        :tries-distribution="stats.triesDistribution"
        :games-won="(Object.values(stats.triesDistribution) as number[]).reduce((sum, count) => sum + count, 0)"
      />
    </div>

    <div class="flex justify-center gap-2">
      <IconButton v-if="(game.won || game.lost) && game.currentMode === 'daily'" icon="i-carbon:share" :text="t('modals.win.actions.share')" @click="handleShare" />
      <IconButton icon="i-carbon:shuffle" :text="t('modals.win.actions.playRandom')" @click="handlePlayRandom" />
    </div>

    <div class="grow" />
  </BaseModal>
</template>
