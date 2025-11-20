<script setup lang="ts">
import type { ValidColor } from '@shadle/types'

const guesses: ValidColor[][] = [
  ['R', 'G', 'B', 'Y', 'M'],
  ['G', 'O', 'B', 'Y', 'C'],
  ['B', 'R', 'Y', 'P', 'M'],
]
</script>

<template>
  <GameBoard :guesses="guesses" />
  <div class="grow" />
  <ColorSelect />
</template>
