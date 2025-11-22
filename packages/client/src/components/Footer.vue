<script setup lang="ts">
const commitHash = import.meta.env.VITE_COMMIT_HASH
</script>

<template>
  <footer class="relative m-2 text-center text-sm sm:text-base" role="contentinfo">
    <span class="op-50">
      Made with ❤️ by
    </span>
    <a
      href="https://adibarra.com"
      target="_blank"
      rel="noopener noreferrer"
      title="Portfolio Website"
      aria-label="Visit adibarra's portfolio website"
      class="text-[var(--color-accent)] font-600 underline-1 op-80 outline-none focus:underline hover:underline"
    >
      adibarra
    </a>
    <div v-if="isCompactViewport" class="h-4" />
    <span
      class="absolute text-sm op-5"
      :style="{
        left: `calc(0.25rem + env(safe-area-inset-left))`,
        bottom: `calc(0.125rem + env(safe-area-inset-bottom))`,
      }"
    >
      {{ commitHash }}
    </span>
  </footer>
</template>
