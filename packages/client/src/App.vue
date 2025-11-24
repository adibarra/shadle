<template>
  <div class="relative flex flex-col min-h-svh">
    <Header />
    <PuzzleModeIndicator />
    <div class="flex grow flex-col px-4">
      <RouterView />
    </div>
    <Footer />
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
  --color-r: #ffb3ba;
  --color-g: #baffc9;
  --color-b: #bae1ff;
  --color-y: #ffffba;
  --color-m: #e6baff;
  --color-c: #baffff;
  --color-p: #ffb3ff;
  --color-o: #ffd4ba;
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
