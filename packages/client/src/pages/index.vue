<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import Instructions from '../components/Instructions.vue'

const guesses: ValidColor[][] = [
  ['R', 'G', 'B', 'Y', 'M'],
  ['G', 'O', 'B', 'Y', 'C'],
  ['B', 'R', 'Y', 'P', 'M'],
]

const feedback: GuessStatus[][] = [
  [GuessStatus.CORRECT, GuessStatus.PRESENT, GuessStatus.ABSENT, GuessStatus.ABSENT, GuessStatus.PRESENT],
  [GuessStatus.ABSENT, GuessStatus.CORRECT, GuessStatus.PRESENT, GuessStatus.ABSENT, GuessStatus.CORRECT],
]
</script>

<template>
  <Instructions />
  <GameBoard :guesses="guesses" :feedback="feedback" />
  <div class="grow" />
  <ColorSelect />
</template>
