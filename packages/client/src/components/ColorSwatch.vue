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
  <div class="relative mx-auto h-6 w-12 flex items-center justify-center">
    <div
      :class="`w-full h-full rounded relative overflow-hidden ${
        props.color ? bgColorClasses[props.color] : 'bg-[hsl(0,0%,13%)]'
      }`"
    >
      <div
        v-if="props.feedback && props.feedback !== GuessStatus.CORRECT && props.feedback !== GuessStatus.ABSENT"
        class="absolute inset-0 z-15"
        style="clip-path: inset(0 round 0.25rem)"
      >
        <div class="absolute inset-0 bg-[hsl(0,0%,20%)]" style="clip-path: polygon(0 100%, 100% 0, 100% 100%)" />
      </div>
      <div
        v-else-if="props.feedback === GuessStatus.ABSENT"
        class="absolute inset-0 z-15 bg-[hsl(0,0%,20%)]"
        style="clip-path: inset(0 round 0.25rem)"
      />
    </div>
  </div>
</template>