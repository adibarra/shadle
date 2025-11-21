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
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #121212;
  color: #e5e7eb;
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
  background: #16a34a;
  opacity: 0.75;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}
</style>
