import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const showSidebar = ref(false)
  const showSettings = ref(false)
  const showInstructions = ref(false)

  watchEffect(() => {
    const anyModal = showInstructions.value || showSidebar.value || showSettings.value
    document.body.classList.toggle('no-scroll', anyModal)
  })

  const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value
  }

  const openSettings = () => {
    showSettings.value = true
    showSidebar.value = false
  }

  const closeSettings = () => {
    showSettings.value = false
  }

  const openInstructions = () => {
    showInstructions.value = true
  }

  const closeInstructions = () => {
    showInstructions.value = false
  }

  const closeAllModals = () => {
    showSidebar.value = false
    showSettings.value = false
    showInstructions.value = false
  }

  return {
    showSidebar,
    showSettings,
    showInstructions,
    toggleSidebar,
    openSettings,
    closeSettings,
    openInstructions,
    closeInstructions,
    closeAllModals,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
