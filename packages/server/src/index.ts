import process from 'node:process'
import config from '@shadle/config'
import { sql } from '@shadle/database'
import { getLogger } from '@shadle/logger'
import fastify from 'fastify'
import prexit from 'prexit'
import { loadApiRoutes } from './route-loader'
import { startTasks, stopTasks } from './task-runner'

const logger = getLogger('SERVER')
const _skipTasks = process.env.SKIP_TASKS === 'true'
const startTime = performance.now()

// initialize the api server
const app = fastify({ logger: false })

// load and register api routes
await loadApiRoutes(app)

// start listening for http requests
await app.listen({
  host: config.API_HOST,
  port: config.API_PORT,
})
logger.info(`Server listening on ${config.API_HOST}:${config.API_PORT}.`)

// start background tasks (unless skipped)
let tasksStarted = false
if (!_skipTasks) {
  await startTasks()
  tasksStarted = true
} else {
  logger.info('Background tasks skipped (SKIP_TASKS=true).')
}

logger.info(`Server ready in ${(performance.now() - startTime).toFixed(2)}ms.`)

// set up unified graceful shutdown with timeout
prexit(['SIGINT', 'SIGHUP', 'SIGTERM', 'SIGQUIT'], async () => {
  logger.info('Shutting down server...')

  // set a timeout to force exit if shutdown takes too long
  const forceExitTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out after 30s, forcing exit.')
    process.exit(1)
  }, 30_000)

  try {
    // cancel all scheduled tasks (if running)
    if (tasksStarted) {
      logger.debug('Stopping background tasks...')
      stopTasks()
      logger.debug('Background tasks stopped.')
    }

    // close api server
    logger.debug('Closing API server...')
    await Promise.race([
      app.close(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('API server close timeout')), 10_000)),
    ])
    logger.debug('API server closed.')

    // close database connection
    logger.debug('Closing database connection...')
    await sql.end({ timeout: 5 })
    logger.debug('Database connection closed.')

    logger.info('Server shut down successfully.')
  } catch (error) {
    logger.error(`Error during shutdown: ${error instanceof Error ? error.message : String(error)}.`)
    logger.warn('Forcing exit due to shutdown errors.')
    process.exit(1)
  } finally {
    clearTimeout(forceExitTimeout)
  }
})
