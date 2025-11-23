import path from 'node:path'
import process from 'node:process'
import autoload from '@fastify/autoload'
import compress from '@fastify/compress'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import ratelimit from '@fastify/rate-limit'
import config from '@shadle/config'
import { cleanupDb, getSql } from '@shadle/database'
import { getLogger } from '@shadle/logger'
import fastify from 'fastify'
import prexit from 'prexit'
import { startTasks, stopTasks } from './task-runner'

const logger = getLogger('SERVER')
const _skipTasks = process.env.SKIP_TASKS === 'true'
const startTime = performance.now()

// set up fastify
const app = fastify({
  loggerInstance: getLogger('API'),
  disableRequestLogging: true,
  // cloudflare
  trustProxy: 1,
})

// configure CORS
await app.register(cors, {
  origin: new RegExp(config.API_CORS_ORIGIN_REGEX),
})

// configure headers
await app.register(helmet, {
  contentSecurityPolicy: false,
  dnsPrefetchControl: false,
  permittedCrossDomainPolicies: true,
  noSniff: true,
  strictTransportSecurity: {
    maxAge: 15552000,
    includeSubDomains: true,
  },
})

// configure rate limiting
await app.register(ratelimit, {
  timeWindow: 60 * 1000,
  max: 500,
})

// configure compression
await app.register(compress)

// autoload api routes
await app.register(autoload, {
  dir: path.join(import.meta.dirname, 'routes'),
})

// handle 404
app.setNotFoundHandler(async (request, reply) => {
  app.log.warn(`404: ${request.url}`)
  return reply.code(404).send({
    message: 'Not Found',
    code: 404,
  })
})

// handle errors
app.setErrorHandler(async (err, _, reply) => {
  app.log.error(err)
  const statusCode = (err as any)?.statusCode ?? 500
  return reply.code(statusCode).send({
    message: 'Something went wrong',
    code: statusCode,
  })
})

// start listening for http requests
const port = config.IS_DEV ? 3332 : 81
await app.listen({
  host: config.API_HOST,
  port,
})
logger.info(`Server listening on ${config.API_HOST}:${port}.`)

// init db and run migrations
await getSql()

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
    await cleanupDb()
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
