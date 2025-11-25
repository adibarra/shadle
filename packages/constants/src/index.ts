import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT_DIR = resolve(import.meta.dirname, '..')
export const PROJECT_ROOT_DIR = resolve(ROOT_DIR, '..', '..')
export const LOGS_DIR = `${PROJECT_ROOT_DIR}/logs`

let cachedPackageVersion: string | null = null

/**
 * Get the package version from package.json
 */
export function getPackageVersion(): string {
  if (cachedPackageVersion === null) {
    try {
      const packageJsonPath = resolve(PROJECT_ROOT_DIR, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      cachedPackageVersion = packageJson.version || 'unknown'
    } catch {
      cachedPackageVersion = 'unknown'
    }
  }
  return cachedPackageVersion as string
}
