<template>
  <div>
    <div v-if="isCompactViewport" class="flex grow flex-col min-h-svh">
      <slot />
    </div>
    <div v-else class="flex items-center justify-center p-4 min-h-svh">
      <div class="relative overflow-hidden border-4 border-gray-700 rounded-3xl bg-black shadow-2xl" style="width: 375px; height: 812px;">
        <div class="h-full overflow-hidden">
          <div class="h-full overflow-hidden">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
