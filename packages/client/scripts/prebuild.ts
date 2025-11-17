/* eslint-disable no-console */
import { execSync } from 'node:child_process'

console.log(`[${new Date().toISOString().slice(0, 19)}] INFO: [PREBUILD] Generating PWA assets...`)
execSync('pnpm pwa-assets-generator public/favicon.svg -p minimal-2023', { stdio: 'ignore' })
console.log(`[${new Date().toISOString().slice(0, 19)}] INFO: [PREBUILD] Finished generating PWA assets.`)
