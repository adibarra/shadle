<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})
</script>

<template>
  <div flex flex-col min-h-svh text--c-text>
    <RouterView />
  </div>
</template>

<style>
:root {
  color-scheme: light dark;
  --c-text: #1f2937;
  --c-primary: #f9f9f9;
  --c-secondary: #e3e3e3;
  --c-tertiary: #cccccc;
  --c-inverse: #121212;
  --c-inverse-2: #4b4b4b;
  --c-inverse-3: #7a7a7a;
  --c-accent: #1da54f;
}

html.dark {
  --c-text: #e5e7eb;
  --c-primary: #121212;
  --c-secondary: #1f1f1f;
  --c-tertiary: #2d2d2d;
  --c-inverse: #f9f9f9;
  --c-inverse-2: #bdbdbd;
  --c-inverse-3: #8c8c8c;
  --c-accent: #4ade80;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--c-primary);
}

html,
div {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

html::-webkit-scrollbar,
div::-webkit-scrollbar {
  display: none;
}

#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: var(--c-accent);
  opacity: 0.75;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}
</style>
