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
 * Raw hex color values for each ValidColor.
 */
export const colorHexes: Record<ValidColor, string> = {
  R: '#dc2626', // Red
  G: '#16a34a', // Green
  B: '#2563eb', // Blue
  Y: '#eab308', // Yellow
  M: '#c026d3', // Magenta
  C: '#0891b2', // Cyan
  P: '#ec4899', // Pink
  O: '#c2410c', // Orange
}

/**
 * Mapping of ValidColor to UnoCSS background classes.
 */
export const bgColorClasses: Record<ValidColor, string> = Object.fromEntries(
  Object.entries(colorHexes).map(([key, hex]) => [key, `bg-[${hex}]`]),
) as Record<ValidColor, string>

/**
 * Mapping of ValidColor to UnoCSS text classes.
 */
export const textColorClasses: Record<ValidColor, string> = Object.fromEntries(
  Object.entries(colorHexes).map(([key, hex]) => [key, `text-[${hex}]`]),
) as Record<ValidColor, string>
