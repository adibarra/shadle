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
      </div>
      <div class="flex justify-center">
        <button v-if="props.won" class="flex grow flex-col items-center justify-center border-2 border-[var(--color-outline)] rounded-lg bg-[var(--color-bg)] px-8 py-4 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-outline)]" @click="handleShare">
          <div class="i-carbon:share mb-2 text-3xl" />
          <span class="text-center text-sm font-medium">{{ t('winModal.actions.share') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
