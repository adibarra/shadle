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
  shortcuts: [
    ['custom-link', 'text--c-accent outline-none underline-1 hover:underline focus:underline'],
    ['custom-outline', 'border--c-inverse outline-none rd-1 b-1'],
    ['custom-hover', 'hover:bg--c-secondary focus:bg--c-secondary focus:border--c-accent focus-within:border--c-accent'],
    ['custom-btn', 'custom-outline custom-hover border--c-inverse/80'],
    ['custom-icon-btn', 'outline-none inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text--c-accent focus:opacity-100 focus:text--c-accent'],
    ['text-xs', 'text-[0.75rem] line-height-[1rem]'],
    ['text-xxs', 'text-[0.70rem] line-height-[0.75rem]'],
  ],
  rules: [
    [/^([^.\s]+)--c-([^/)\]>\s]+)(?:\/(\d+))?$/, ([, prefix, color, opacity]) => {
      const value = opacity ? `color-mix(in srgb, var(--c-${color}), transparent ${100 - Number.parseInt(opacity)}%)` : `var(--c-${color})`
      return {
        [prefix]: value,
      }
    }],
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
