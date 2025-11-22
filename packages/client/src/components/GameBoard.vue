<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'

interface Props {
  guesses: readonly (readonly ValidColor[])[]
  feedback?: readonly (readonly GuessStatus[])[]
  currentGuess?: readonly ValidColor[]
}

const props = defineProps<Props>()

function getSymbol(status?: GuessStatus) {
  if (status == null) return ''
  switch (status as number) {
    case GuessStatus.CORRECT as number:
      return '✓'
    case GuessStatus.PRESENT as number:
      return '~'
    case GuessStatus.ABSENT as number:
      return '✗'
    default:
      return ''
  }
}
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
          v-if="guessIndex < props.guesses.length"
          :class="`w-full h-full rounded relative z-10 ${bgColorClasses[props.guesses[guessIndex][colorIndex]]}`"
        />
        <div
          v-else-if="guessIndex === props.guesses.length && props.currentGuess && colorIndex < props.currentGuess.length"
          :class="`w-full h-full rounded relative z-10 ${bgColorClasses[props.currentGuess[colorIndex]]}`"
        />
        <div
          v-else
          class="h-full w-full rounded bg-gray-400 opacity-20"
        />
        <span
          v-if="guessIndex < props.guesses.length && props.feedback?.[guessIndex]?.[colorIndex] != null"
          class="absolute left-1/2 top-1/2 z-20 text-center text-white font-bold op-80 -translate-x-1/2"
          style="line-height: 0; transform: translate(-50%, calc(-50% - 2px));"
        >
          {{ getSymbol(props.feedback[guessIndex][colorIndex]) }}
        </span>
      </div>
    </div>
  </div>
</template>
