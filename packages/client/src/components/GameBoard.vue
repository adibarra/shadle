<script setup lang="ts">
import type { GuessStatus, ValidColor } from '@shadle/types'
import ColorSwatch from './ColorSwatch.vue'

interface Props {
  guesses: readonly (readonly ValidColor[])[]
  feedback?: readonly (readonly GuessStatus[])[]
  currentGuess?: readonly ValidColor[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="grid grid-rows-6 mx-6 mb-6 gap-5">
    <div
      v-for="(_, guessIndex) in Array(6).fill(null)"
      :key="guessIndex"
      class="relative grid grid-cols-5 gap-1"
    >
      <div v-if="guessIndex === props.guesses.length" class="bounce-lr absolute left-[-1.5rem] top-1/2 w-4 flex items-center justify-center">
        <span class="color-cycle text-lg">&gt;</span>
      </div>
      <ColorSwatch
        v-for="(__, colorIndex) in Array(5).fill(null)"
        :key="colorIndex"
        :color="guessIndex < props.guesses.length ? props.guesses[guessIndex][colorIndex] : guessIndex === props.guesses.length && props.currentGuess && colorIndex < props.currentGuess.length ? props.currentGuess[colorIndex] : undefined"
        :feedback="guessIndex < props.guesses.length ? props.feedback?.[guessIndex]?.[colorIndex] : undefined"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-left-right {
  0%,
  100% {
    transform: translateX(0) translateY(-50%);
  }
  50% {
    transform: translateX(2px) translateY(-50%);
  }
}

@keyframes color-cycle {
  0% {
    color: var(--color-r);
  }
  12.5% {
    color: var(--color-g);
  }
  25% {
    color: var(--color-b);
  }
  37.5% {
    color: var(--color-y);
  }
  50% {
    color: var(--color-m);
  }
  62.5% {
    color: var(--color-c);
  }
  75% {
    color: var(--color-p);
  }
  87.5% {
    color: var(--color-o);
  }
  100% {
    color: var(--color-r);
  }
}

.bounce-lr {
  animation: bounce-left-right 1s ease-in-out infinite;
}

.color-cycle {
  animation: color-cycle 15s linear infinite;
}
</style>
