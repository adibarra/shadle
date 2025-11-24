import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useUiStore = defineStore('ui', () => {
  type ModalType = 'menu' | 'settings' | 'instructions' | 'statistics' | 'pastPuzzles' | 'alreadyPlayed' | 'win' | 'credits'

  const activeModal = ref<ModalType | null>(null)

  watchEffect(() => {
    document.body.classList.toggle('no-scroll', activeModal.value !== null)
  })

  const closeAllModals = () => {
    activeModal.value = null
  }

  const isOpen = (modal: ModalType) => activeModal.value === modal

  const open = (modal: ModalType) => {
    closeAllModals()
    activeModal.value = modal
  }

  const close = (modal: ModalType) => {
    if (activeModal.value === modal) {
      activeModal.value = null
    }
  }

  return {
    activeModal,
    isOpen,
    open,
    close,
    closeAllModals,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
