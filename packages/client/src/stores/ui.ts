import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useUiStore = defineStore('ui', () => {
  type ModalType = 'menu' | 'settings' | 'instructions' | 'statistics' | 'pastPuzzles' | 'alreadyPlayed' | 'win' | 'legal' | 'privacyPolicy' | 'credits'

  const activeModal = ref<ModalType | null>(null)

  const updateHash = () => {
    const hash = activeModal.value ? `#${activeModal.value}` : ''
    if (window.location.hash !== hash) {
      window.location.hash = hash
    }
  }

  const updateModalFromHash = () => {
    const hash = window.location.hash.slice(1)
    if (['menu', 'settings', 'instructions', 'statistics', 'pastPuzzles', 'alreadyPlayed', 'win', 'legal', 'privacyPolicy', 'credits'].includes(hash)) {
      activeModal.value = hash as ModalType
    } else {
      activeModal.value = null
    }
  }

  // Initialize modal from hash on load
  updateModalFromHash()

  // Listen for hash changes
  window.addEventListener('hashchange', updateModalFromHash)

  watchEffect(() => {
    document.body.classList.toggle('no-scroll', activeModal.value !== null)
  })

  const closeAllModals = () => {
    activeModal.value = null
    updateHash()
  }

  const isOpen = (modal: ModalType) => activeModal.value === modal

  const open = (modal: ModalType) => {
    closeAllModals()
    activeModal.value = modal
    updateHash()
  }

  const close = (modal: ModalType) => {
    if (activeModal.value === modal) {
      activeModal.value = null
      updateHash()
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
