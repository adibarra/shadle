import type { ValidColor } from '@shadle/types'

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
 * Mapping of ValidColor to UnoCSS background classes.
 */
export const colorClasses: Record<ValidColor, string> = {
  R: 'bg-red-500',
  G: 'bg-green-500',
  B: 'bg-blue-500',
  Y: 'bg-yellow-500',
  F: 'bg-fuchsia-500',
  C: 'bg-cyan-500',
  W: 'bg-white',
  K: 'bg-black',
}
