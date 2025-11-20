<template>
  <footer class="m-2 text-center text-sm sm:text-base" role="contentinfo">
    <span op-50>
      Made with ❤️ by
    </span>
    <a
      href="https://adibarra.com"
      target="_blank"
      rel="noopener noreferrer"
      title="Portfolio Website"
      aria-label="Visit adibarra's portfolio website"
      class="custom-link font-600 op-80"
    >
      adibarra
    </a>
    <div v-if="isCompactViewport" h-4 />
  </footer>
</template>
