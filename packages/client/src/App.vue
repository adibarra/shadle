<script setup lang="ts">
import { useTheme } from './composables/theme'
import { useResetApp } from './composables/useResetApp'
import { useUiStore } from './stores/ui'

const ui = useUiStore()
const { theme, setTheme } = useTheme()
const { resetApp } = useResetApp()

provide('toggleInstructions', ui.openInstructions)
provide('toggleSidebar', ui.toggleSidebar)
provide('openSettings', ui.openSettings)
provide('setTheme', setTheme)
provide('theme', theme)
provide('resetApp', resetApp)
</script>

<template>
  <div class="flex flex-col min-h-svh">
    <Header />
    <div class="flex grow flex-col px-4">
      <RouterView />
    </div>
    <Footer />
    <InstructionsModal />
    <MenuModal />
    <SettingsModal />
  </div>
</template>

<style>
:root {
  --color-bg: #121212;
  --color-text: #e5e7eb;
  --color-text-alt: #121212;
  --color-outline: #555555;
  --color-accent: #2563eb;

  --color-r: #dc2626;
  --color-g: #16a34a;
  --color-b: #2563eb;
  --color-y: #eab308;
  --color-m: #c026d3;
  --color-c: #0891b2;
  --color-p: #ec4899;
  --color-o: #c2410c;
}

:root.tol-muted {
  --color-r: #332288;
  --color-g: #117733;
  --color-b: #44aa99;
  --color-y: #88ccee;
  --color-m: #ddcc77;
  --color-c: #cc6677;
  --color-p: #882255;
  --color-o: #aa4499;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-text);
}

html,
div {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

* {
  touch-action: manipulation;
}

html::-webkit-scrollbar,
div::-webkit-scrollbar {
  display: none;
}

.no-scroll {
  overflow: hidden;
}

#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: var(--color-accent);
  opacity: 0.75;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}
</style>
