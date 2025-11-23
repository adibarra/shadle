import type { ValidColor } from '@shadle/types'
import { VALID_COLORS } from '@shadle/types'

/**
 * Mapping of ValidColor to UnoCSS background classes.
 */
export const bgColorClasses: Record<ValidColor, string> = Object.fromEntries(
  VALID_COLORS.map(key => [key, `bg-[var(--color-${key.toLowerCase()})]`]),
) as Record<ValidColor, string>

/**
 * Mapping of ValidColor to UnoCSS text classes.
 */
export const textColorClasses: Record<ValidColor, string> = Object.fromEntries(
  VALID_COLORS.map(key => [key, `text-[var(--color-${key.toLowerCase()})]`]),
) as Record<ValidColor, string>
