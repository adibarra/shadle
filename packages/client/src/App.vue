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
  --color-bg: color(display-p3 0.0705 0.0705 0.0705);
  --color-text: #color(display-p3 0.8980 0.9058 0.9215);
  --color-text-alt: color(display-p3 0.0705 0.0705 0.0705);
  --color-outline: color(display-p3 0.3333 0.3333 0.3333);
  --color-accent: color(display-p3 0 0.2666 1);

  --color-r: #c70000;
  --color-g: #0d8c0d;
  --color-b: #0044ff;
  --color-y: #ffc509;
  --color-m: #800080;
  --color-c: #0891b2;
  --color-p: #ec4899;
  --color-o: #f47a00;
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

:root.retro {
  --color-r: #ff0000;
  --color-g: #00ff00;
  --color-b: #0000ff;
  --color-y: #ffff00;
  --color-m: #bc00ff;
  --color-c: #00ffff;
  --color-p: #ff1493;
  --color-o: #ff8200;
}

:root.blues {
  --color-r: #0c224f;
  --color-g: #153a8c;
  --color-b: #1954c6;
  --color-y: #1f6fea;
  --color-m: #3f8fff;
  --color-c: #66b8ff;
  --color-p: #a7d4ff;
  --color-o: #e2f2ff;
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
