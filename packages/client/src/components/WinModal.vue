<script setup lang="ts">
import { textColorClasses } from '../constants/colors'

interface Props {
  won: boolean
  attempts: number
  onClose: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="mx-4 max-w-sm min-h-[200px] w-full flex flex-col justify-between rounded-lg bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-lg">
      <div>
        <h2 class="mb-4 text-2xl font-bold" :class="props.won ? textColorClasses.G : textColorClasses.R">
          {{ props.won ? 'Congratulations!' : 'Game Over' }}
        </h2>
        <p class="mb-4">
          {{ props.won ? `You solved the puzzle in ${props.attempts} attempts!` : 'Better luck next time!' }}
        </p>
      </div>
      <div class="flex justify-end">
        <button class="rounded bg-[var(--color-accent)] px-4 py-2 text-[var(--color-text)]" @click="props.onClose">
          Play Again
        </button>
      </div>
    </div>
  </div>
</template>
