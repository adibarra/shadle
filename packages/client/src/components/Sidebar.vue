<script setup lang="ts">
interface Props {
  show: boolean
  onClose: () => void
}

defineProps<Props>()

const openSettings = inject<() => void>('openSettings')!
</script>

<template>
  <Transition name="slide-left">
    <div
      v-if="show"
      class="fixed inset-0 z-50"
      @click="onClose"
    >
      <div
        class="fixed left-0 top-0 h-full w-32 border-r border-[var(--color-outline)] bg-[var(--color-bg)] shadow-lg"
        @click.stop
      >
        <div class="p-4">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg text-[var(--color-text)] font-bold">
              Menu
            </h2>
            <button
              class="p-2 text-xl text-[var(--color-text)]"
              @click="onClose"
            >
              <div class="i-carbon:close" />
            </button>
          </div>
          <nav>
            <ul class="space-y-2">
              <li>
                <button class="w-full rounded bg-[var(--color-outline)] p-2 text-left text-[var(--color-text)] hover:bg-[var(--color-outline)]" @click="openSettings">
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
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
