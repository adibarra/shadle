<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <Transition name="slide-bottom">
    <div
      v-if="ui.showSidebar"
      class="fixed inset-0 z-50"
      @click="ui.showSidebar = false"
    >
      <div
        class="fixed bottom-0 left-0 right-0 h-40 border-t border-[var(--color-outline)] rounded-t-lg bg-[var(--color-bg)] shadow-lg"
        @click.stop
      >
        <div class="p-4">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg text-[var(--color-text)] font-bold">
              Menu
            </h2>
            <button
              class="p-2 text-xl text-[var(--color-text)]"
              @click="ui.showSidebar = false"
            >
              <div class="i-carbon:close" />
            </button>
          </div>
          <nav>
            <ul class="space-y-2">
              <li>
                <button class="w-full rounded bg-[var(--color-outline)] p-2 text-left text-[var(--color-text)] hover:bg-[var(--color-outline)]" @click="ui.openSettings">
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.5s;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
