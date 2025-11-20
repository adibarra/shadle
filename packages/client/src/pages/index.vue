<script setup lang="ts">
import type { ValidColor } from '@shadle/types'

const guesses: ValidColor[][] = [
  ['R', 'G', 'B', 'Y', 'F'],
  ['G', 'G', 'B', 'Y', 'C'],
  ['B', 'R', 'Y', 'Y', 'F'],
]
</script>

<template>
  <GameBoard :guesses="guesses" />
  <div class="grow" />
  <ColorSelect />
</template>
