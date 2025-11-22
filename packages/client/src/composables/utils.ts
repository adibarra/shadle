const { width, height } = useWindowSize()

/**
 * A reactive boolean indicating whether the viewport is roughly 'mobile' size.
 * @returns True if the viewport is 'mobile' size, false otherwise.
 */
export const isCompactViewport = computed<boolean>(() => {
  if (typeof window === 'undefined') return false
  return width.value < 768 || height.value < 640
})

/**
 * A reactive boolean indicating whether the user prefers dark mode.
 * @returns True if the user prefers dark mode, false otherwise.
 */
export const preferredDark = usePreferredDark()

/**
 * A reactive boolean indicating whether the device is running ios.
 * @returns True if the device is running ios, false otherwise.
 */
export const isIos = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
})

/**
 * A reactive boolean indicating whether the app is running as a PWA.
 * @returns True if the app is running as a PWA, false otherwise.
 */
export const isPwa = computed(() => {
  return (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches
})
