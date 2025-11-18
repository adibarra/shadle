import { createSharedComposable, useOnline } from '@vueuse/core'

export const usePwaUpdate = createSharedComposable(() => {
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateSW = ref<(() => void) | undefined>()
  const isOnline = useOnline()
  const isOffline = computed(() => !isOnline.value)

  const setUpdateSW = (fn: () => void) => {
    updateSW.value = fn
  }

  const notifyNeedRefresh = () => {
    needRefresh.value = true
  }

  const notifyOfflineReady = () => {
    offlineReady.value = true
  }

  const doUpdate = () => {
    if (updateSW.value) {
      updateSW.value()
      needRefresh.value = false
    }
  }

  const dismissUpdate = () => {
    needRefresh.value = false
  }

  const dismissOfflineReady = () => {
    offlineReady.value = false
  }

  return {
    // for pwa module
    setUpdateSW,
    notifyNeedRefresh,
    notifyOfflineReady,
    // for app
    needRefresh,
    offlineReady,
    isOffline,
    doUpdate,
    dismissUpdate,
    dismissOfflineReady,
  }
})
