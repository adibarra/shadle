<script setup lang="ts">
import { inject } from 'vue'
import { textColorClasses } from '../constants/colors'

const toggleInstructions = inject<() => void>('toggleInstructions')!
</script>

<template>
  <div class="m-6 flex items-center justify-between">
    <div />
    <h1 class="text-center text-6xl">
      <span :class="textColorClasses.R">S</span>
      <span :class="textColorClasses.G">h</span>
      <span :class="textColorClasses.B">a</span>
      <span :class="textColorClasses.Y">d</span>
      <span :class="textColorClasses.M">l</span>
      <span :class="textColorClasses.C">e</span>
    </h1>
    <button class="p-2 text-2xl text-[var(--color-text)]" @click="toggleInstructions">
      <div class="i-carbon:help" />
    </button>
  </div>
</template>
