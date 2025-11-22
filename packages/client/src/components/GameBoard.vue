<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { bgColorClasses } from '~/constants/colors'

interface Props {
  guesses: readonly (readonly ValidColor[])[]
  feedback?: readonly (readonly GuessStatus[])[]
  currentGuess?: readonly ValidColor[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="grid grid-rows-6 mx-6 mb-8 gap-5">
    <div
      v-for="(_, guessIndex) in Array(6).fill(null)"
      :key="guessIndex"
      class="grid grid-cols-5 gap-1"
    >
      <div
        v-for="(__, colorIndex) in Array(5).fill(null)"
        :key="colorIndex"
        class="relative mx-auto h-6 w-12 flex items-center justify-center"
      >
        <div
          :class="`w-full h-full rounded relative overflow-hidden ${
            guessIndex < props.guesses.length
              ? bgColorClasses[props.guesses[guessIndex][colorIndex]]
              : guessIndex === props.guesses.length && props.currentGuess && colorIndex < props.currentGuess.length
                ? bgColorClasses[props.currentGuess[colorIndex]]
                : 'bg-[hsl(0,0%,13%)]'
          }`"
        >
          <div
            v-if="guessIndex < props.guesses.length && props.feedback?.[guessIndex]?.[colorIndex] === GuessStatus.CORRECT"
            class="absolute left-1/2 top-1/2 z-20 text-center text-[var(--color-text-alt)] font-bold op-80 -translate-x-1/2"
            style="line-height: 0; transform: translate(-50%, calc(-50% - 2px)); clip-path: inset(0 round 0.25rem)"
          >
            ✓
          </div>
          <div
            v-else-if="guessIndex < props.guesses.length && props.feedback?.[guessIndex]?.[colorIndex] !== GuessStatus.CORRECT && props.feedback?.[guessIndex]?.[colorIndex] !== GuessStatus.ABSENT"
            class="absolute inset-0 z-15"
            style="clip-path: inset(0 round 0.25rem)"
          >
            <div class="absolute inset-0 bg-[hsl(0,0%,20%)]" style="clip-path: polygon(0 100%, 100% 0, 100% 100%)" />
          </div>
          <div
            v-else-if="guessIndex < props.guesses.length && props.feedback?.[guessIndex]?.[colorIndex] === GuessStatus.ABSENT"
            class="absolute inset-0 z-15 bg-[hsl(0,0%,20%)]"
            style="clip-path: inset(0 round 0.25rem)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
