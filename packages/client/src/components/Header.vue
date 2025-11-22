<script setup lang="ts">
const toggleInstructions = inject<() => void>('toggleInstructions')!
const toggleSidebar = inject<() => void>('toggleSidebar')!
</script>

<template>
  <div class="m-6 flex items-center justify-between">
    <button class="p-2 text-2xl text-[var(--color-text)]" @click="toggleInstructions">
      <div class="i-carbon:help" />
    </button>
    <h1 class="text-center text-6xl">
      <ShadleTitle />
    </h1>
    <button class="p-2 text-2xl text-[var(--color-text)]" @click="toggleSidebar">
      <div class="i-carbon:menu" />
    </button>
  </div>
</template>
