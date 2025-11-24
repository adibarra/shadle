<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div class="m-6 relative flex items-center">
    <h1 class="text-center text-6xl w-full">
      <ShadleTitle />
    </h1>
    <button class="absolute left-0 p-2 text-2xl text-[var(--color-text)]" @click="ui.open('menu')">
      <div class="i-carbon:menu" />
    </button>
  </div>
</template>
