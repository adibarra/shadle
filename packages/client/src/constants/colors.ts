import type { ValidColor } from '@shadle/types'

/**
 * Raw hex color values for each ValidColor.
 */
export const colorHexes = {
  R: '#dc2626', // Red
  G: '#16a34a', // Green
  B: '#2563eb', // Blue
  Y: '#eab308', // Yellow
  M: '#c026d3', // Magenta
  C: '#0891b2', // Cyan
  P: '#ec4899', // Pink
  O: '#c2410c', // Orange
} as const

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
