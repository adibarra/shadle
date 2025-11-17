/* eslint-disable no-console */
import { execSync } from 'node:child_process'

console.log('Generating PWA assets...')
execSync('pnpm pwa-assets-generator public/favicon.svg -p minimal-2023', { stdio: 'inherit' })
console.log('Prebuild complete!')
