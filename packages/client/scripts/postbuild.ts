/* eslint-disable no-console */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const clientDist = resolve(import.meta.dirname, '../dist')
const serverPublic = resolve(import.meta.dirname, '../../server/public')

console.log(`[${new Date().toISOString().slice(0, 19)}] INFO: [PREVIEW] Preparing preview build...`)

if (existsSync(serverPublic)) {
  rmSync(serverPublic, { recursive: true, force: true })
}
mkdirSync(serverPublic, { recursive: true })
cpSync(clientDist, serverPublic, { recursive: true, force: true })

console.log(`[${new Date().toISOString().slice(0, 19)}] INFO: [PREVIEW] Preview build prepared successfully.`)
