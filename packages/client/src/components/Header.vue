<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div class="relative m-6 flex items-center">
    <h1 class="w-full text-center text-6xl">
      <ShadleTitle />
    </h1>
    <button class="absolute left-0 p-2 text-2xl text-[var(--color-text)]" @click="ui.open('menu')">
      <div class="i-carbon:menu" />
    </button>
  </div>
</template>
