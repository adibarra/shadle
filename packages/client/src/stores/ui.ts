import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const showMenu = ref(false)
  const showSettings = ref(false)
  const showInstructions = ref(false)
  const showStatistics = ref(false)

  watchEffect(() => {
    const anyModal = showInstructions.value || showMenu.value || showSettings.value || showStatistics.value
    document.body.classList.toggle('no-scroll', anyModal)
  })

  const openMenu = () => {
    showMenu.value = !showMenu.value
  }

  const openSettings = () => {
    showSettings.value = true
    showMenu.value = false
  }

  const closeSettings = () => {
    showSettings.value = false
  }

  const openStatistics = () => {
    showStatistics.value = true
    showMenu.value = false
  }

  const closeStatistics = () => {
    showStatistics.value = false
  }

  const openInstructions = () => {
    showInstructions.value = true
  }

  const closeInstructions = () => {
    showInstructions.value = false
  }

  const closeAllModals = () => {
    showMenu.value = false
    showSettings.value = false
    showInstructions.value = false
    showStatistics.value = false
  }

  return {
    showMenu,
    showSettings,
    showInstructions,
    showStatistics,
    openMenu,
    openSettings,
    closeSettings,
    openStatistics,
    closeStatistics,
    openInstructions,
    closeInstructions,
    closeAllModals,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
