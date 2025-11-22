import { VALID_COLORS } from '@shadle/types'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  safelist: [
    ...VALID_COLORS.map(key => `bg-[var(--color-${key.toLowerCase()})]`),
    ...VALID_COLORS.map(key => `text-[var(--color-${key.toLowerCase()})]`),
    'bg-[var(--color-bg)]',
    'text-[var(--color-text)]',
    'text-[var(--color-text-alt)]',
  ],
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
