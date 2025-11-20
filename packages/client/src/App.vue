<template>
  <div class="flex flex-col min-h-svh">
    <Header />
    <div class="flex grow flex-col px-4">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style>
:root {
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
  color: var(--c-text);
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
