<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { textColorClasses } from '../constants'

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

function generateShareText() {
  let text = `Shadle ${props.attempts}/6\n\n`
  for (let i = 0; i < props.guesses.length; i++) {
    for (let j = 0; j < props.guesses[i].length; j++) {
      const status = props.feedback[i][j]
      if (status === GuessStatus.CORRECT) text += '🟩'
      else if (status === GuessStatus.PRESENT) text += '🟨'
      else text += '🟥'
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
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div :class="isCompactViewport ? 'absolute inset-4 flex flex-col justify-between rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 text-[var(--color-text)] shadow-lg' : 'mx-4 max-w-sm min-h-[200px] w-full flex flex-col justify-between rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 text-[var(--color-text)] shadow-lg'">
      <div>
        <h2 class="mb-4 border-b border-[var(--color-outline)] pb-4 text-2xl font-bold" :class="props.won ? textColorClasses.G : textColorClasses.R">
          {{ props.won ? t('winModal.messages.congratulations') : t('winModal.messages.gameOver') }}
        </h2>
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
      </div>
      <div class="flex justify-end gap-2">
        <button v-if="props.won" class="rounded bg-[var(--color-accent)] px-4 py-2 text-[var(--color-text)]" @click="handleShare">
          {{ t('winModal.actions.share') }}
        </button>
        <button class="rounded bg-[var(--color-accent)] px-4 py-2 text-[var(--color-text)]" @click="props.onClose">
          {{ t('winModal.actions.playAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>
