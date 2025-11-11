/* eslint-disable no-console */
import { Buffer } from 'node:buffer'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

console.log('Generating og-image...')

const width = 1200
const height = 630

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1da54f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f5132;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
    shadle
  </text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle">
    Wordle Color Game
  </text>
</svg>
`

await sharp(Buffer.from(svg))
  .png()
  .toFile(join(process.cwd(), 'public', 'og-image.png'))

console.log('Generated og-image.png')

console.log('Generating PWA assets...')

execSync('pnpm pwa-assets-generator public/favicon.svg -p minimal-2023', { stdio: 'inherit' })

console.log('Prebuild complete!')
