<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { bgColorClasses } from '../constants'

interface Props {
  color?: ValidColor
  feedback?: GuessStatus
}

const props = defineProps<Props>()
</script>

<template>
  <div class="mx-auto h-6 w-12 flex items-center justify-center">
    <div
      class="relative h-full w-full overflow-hidden bg-[hsl(0,0%,13%)]"
      style="clip-path: inset(0 round 0.25rem)"
    >
      <div
        v-if="props.color"
        :class="`absolute inset-0 z-10 transition-opacity duration-500 ${bgColorClasses[props.color]}`"
        :style="{ opacity: props.feedback === GuessStatus.ABSENT ? 0 : 1 }"
      />
      <div class="absolute inset-0 z-20">
        <div
          class="absolute inset-0 bg-[hsl(0,0%,20%)] transition-opacity duration-500"
          style="clip-path: polygon(0 100%, 100% 0, 100% 100%)"
          :style="{ opacity: props.feedback === GuessStatus.PRESENT ? 1 : 0 }"
        />
        <div
          class="absolute inset-0 bg-[hsl(0,0%,20%)] transition-opacity duration-500"
          :style="{ opacity: props.feedback === GuessStatus.ABSENT ? 1 : 0 }"
        />
      </div>
    </div>
  </div>
</template>
