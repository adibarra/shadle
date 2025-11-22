<script setup lang="ts">
const toggleInstructions = inject<() => void>('toggleInstructions')!
</script>

<template>
  <div class="m-6 flex items-center justify-between">
    <div />
    <h1 class="text-center text-6xl">
      <ShadleTitle />
    </h1>
    <button class="p-2 text-2xl text-[var(--color-text)]" @click="toggleInstructions">
      <div class="i-carbon:help" />
    </button>
  </div>
</template>
