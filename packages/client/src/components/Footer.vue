<script setup lang="ts">
const commitHash = import.meta.env.VITE_COMMIT_HASH
const { t } = useI18n()
</script>

<template>
  <footer class="relative m-2 text-center text-sm sm:text-base" role="contentinfo">
    <span class="absolute left-1 text-xs op-02" aria-hidden="true">
      {{ commitHash }}
    </span>
    <span class="op-50">
      {{ t('footer.madeWith') }}
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
  </footer>
</template>
