<template>
  <footer class="m-2 text-center text-sm sm:text-base" role="contentinfo">
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
  </footer>
</template>
