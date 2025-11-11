import type { FastifyInstance } from 'fastify'
import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { getLogger } from '@shadle/logger'

const logger = getLogger('API')

/**
 * Route configuration interface
 */
export interface RouteConfig {
  [method: string]: (request: any, reply: any) => Promise<any> | any
}

/**
 * Recursively loads and registers all API routes from the api directory
 */
export async function loadApiRoutes(app: FastifyInstance): Promise<void> {
  const apiDir = join(import.meta.dirname, 'api')

  async function collectRouteFiles(dir: string): Promise<string[]> {
    const files: string[] = []
    const dirsToProcess = [dir]

    while (dirsToProcess.length > 0) {
      const currentDir = dirsToProcess.pop()!
      const entries = await readdir(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name)
        if (entry.isDirectory()) {
          dirsToProcess.push(fullPath)
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
          files.push(fullPath)
        }
      }
    }

    return files
  }

  logger.info('Loading API routes...')
  const startTime = performance.now()
  const routeFiles = await collectRouteFiles(apiDir)

  for (const fullPath of routeFiles) {
    const relativePath = relative(apiDir, fullPath)
    const routePath = `/${relativePath.replace(/\.ts$/, '').replace(/\\/g, '/')}`

    try {
      const routeModule = await import(fullPath)
      const routes: RouteConfig = routeModule.default || routeModule

      if (!routes || typeof routes !== 'object') {
        logger.warn(`Invalid route config in ${fullPath}: expected object`)
        continue
      }

      for (const [method, handler] of Object.entries(routes)) {
        if (typeof handler !== 'function') {
          logger.warn(`Invalid handler for ${method} in ${fullPath}: expected function`)
          continue
        }

        const httpMethod = method.toLowerCase()
        if (!['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(httpMethod)) {
          logger.warn(`Unsupported HTTP method ${method} in ${fullPath}`)
          continue
        }

        (app as any)[httpMethod](routePath, handler)
        logger.debug(`Registered ${httpMethod.toUpperCase()} ${routePath}`)
      }
    } catch (error) {
      logger.error(`Failed to load routes from ${fullPath}: ${error}`)
    }
  }

  const duration = performance.now() - startTime
  logger.info(`Routes loaded from ${routeFiles.length} files in ${(duration).toFixed(2)}ms.`)
}
