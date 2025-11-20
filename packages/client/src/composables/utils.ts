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
