/**
 * A reactive boolean indicating whether the user prefers dark mode.
 * @returns True if the user prefers dark mode, false otherwise.
 */
export const preferredDark = usePreferredDark()

/**
 * A reactive boolean indicating whether the site is in dark mode.
 * Uses localStorage to persist the theme.
 * @returns True if the site is in dark mode, false otherwise.
 */
export const isDark = useDark({
  initialValue: 'dark',
  storageKey: 'shadle/theme',
})

/**
 * A function to toggle the site theme between light and dark mode.
 * @returns the new value of isDark.
 */
export const toggleTheme = useToggle(isDark)
