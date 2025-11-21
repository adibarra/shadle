import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { colorHexes } from './src/constants/colors'

export default defineConfig({
  safelist: [
    ...Object.values(colorHexes).map(hex => `bg-[${hex}]`),
    ...Object.values(colorHexes).map(hex => `text-[${hex}]`),
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
