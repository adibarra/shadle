<script setup lang="ts">
import PhoneContainer from '~/components/PhoneContainer.vue'
</script>

<template>
  <PhoneContainer>
    <Header />
    <PuzzleModeIndicator />
    <div class="flex flex-col px-4">
      <RouterView />
    </div>
    <Footer />
  </PhoneContainer>
</template>

<style>
:root {
  --color-bg: #121212;
  --color-text: #e5e7eb;
  --color-text-alt: #121212;
  --color-outline: #555555;
  --color-accent: #2563eb;

  --color-r: #ff0000;
  --color-g: #00aa00;
  --color-b: #0044ff;
  --color-y: #ffc509;
  --color-m: #800080;
  --color-c: #0891b2;
  --color-p: #ec4899;
  --color-o: #db6d00;
}

:root.colorblind {
  --color-r: #332288;
  --color-g: #117733;
  --color-b: #44aa99;
  --color-y: #88ccee;
  --color-m: #ddcc77;
  --color-c: #cc6677;
  --color-p: #882255;
  --color-o: #aa4499;
}

:root.pastel {
  --color-r: #ff9999;
  --color-g: #99ff99;
  --color-b: #9999ff;
  --color-y: #ffff99;
  --color-m: #ff99ff;
  --color-c: #99ffff;
  --color-p: #ff99cc;
  --color-o: #ffcc99;
}

:root.retro {
  --color-r: #ff0000;
  --color-g: #00ff00;
  --color-b: #0000ff;
  --color-y: #ffff00;
  --color-m: #ff00ff;
  --color-c: #00ffff;
  --color-p: #ff1493;
  --color-o: #ff4500;
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
