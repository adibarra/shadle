<script setup lang="ts">
type ModalType = 'menu' | 'settings' | 'instructions' | 'statistics' | 'pastPuzzles' | 'alreadyPlayed' | 'win' | 'legal' | 'privacyPolicy' | 'credits'

interface Props {
  modalName: ModalType
  title: string
}

defineProps<Props>()

const ui = useUiStore()
</script>

<template>
  <Transition name="modal" appear>
    <div v-if="ui.isOpen(modalName)" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.close(modalName)">
      <div class="absolute inset-4 max-h-[calc(100vh-2rem)] flex flex-col overflow-y-auto border border-[var(--color-outline)] rounded-lg bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-lg">
        <div class="mb-4 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-2">
          <h2 class="mx-2 text-3xl font-bold">
            {{ title }}
          </h2>
          <button
            class="p-2 text-3xl"
            @click="ui.close(modalName)"
          >
            <div class="i-carbon:close" />
          </button>
        </div>

        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
