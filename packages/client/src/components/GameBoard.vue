<script setup lang="ts">
import type { ValidColor } from '@shadle/types'

interface Props {
  guesses: ValidColor[][]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="grid grid-rows-5 mx-6 my-32 gap-5">
    <div
      v-for="(guess, guessIndex) in props.guesses"
      :key="guessIndex"
      class="grid grid-cols-5 gap-5"
    >
      <div
        v-for="(color, colorIndex) in guess"
        :key="colorIndex"
        :class="`w-6 h-6 rounded-full mx-auto ${bgColorClasses[color]}`"
      />
    </div>
  </div>
</template>
