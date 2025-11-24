<script setup lang="ts">
type ModalType = 'menu' | 'settings' | 'instructions' | 'statistics' | 'pastPuzzles' | 'alreadyPlayed' | 'win'

interface Props {
  modalName: ModalType
  maxWidth?: string
  title?: string
  titleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'max-w-md',
})

const { modalName, maxWidth, title, titleClass } = props

const ui = useUiStore()
</script>

<template>
  <Transition name="modal" appear>
    <div v-if="ui.isOpen(modalName)" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.close(modalName)">
      <div :class="isCompactViewport ? 'absolute inset-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 text-[var(--color-text)] shadow-lg' : `mx-4 ${maxWidth} w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 text-[var(--color-text)] shadow-lg`">
        <div class="mb-8 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-4">
          <h2 v-if="title" class="text-3xl font-bold" :class="titleClass">
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
