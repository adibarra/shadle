import { exit } from 'node:process'
import config from '@shadle/config'
import { getLogger } from '@shadle/logger'
import postgres from 'postgres'
import { runMigrations } from './migrations'

const logger = getLogger('DATABASE')

const sql = await connect()
await prepare()

/**
 * Establishes a connection to the PostgreSQL database using the configured URI.
 *
 * @returns The connected postgres client instance.
 * @throws Exits the process if connection fails.
 */
async function connect() {
  let sql
  try {
    logger.debug('Connecting to database...')
    sql = postgres(config.POSTGRES_URL, {
      onnotice: notice => logger.trace(`Notice: ${notice.message}`),
    })
    await sql`SELECT 1;`
    return sql
  } catch (err) {
    logger.fatal('Database connection failed.')
    logger.fatal(err)
    exit(1)
  }
}

/**
 * Prepares the database by running migrations.
 *
 * @throws Exits the process if preparation fails.
 */
async function prepare() {
  try {
    logger.debug('Connected. Running migrations...')

    const startTime = performance.now()
    await runMigrations()
    const duration = performance.now() - startTime

    logger.info(`Database ready in ${(duration).toFixed(2)}ms.`)
  } catch (err) {
    logger.fatal('Database preparation failed.')
    logger.fatal(err)
    exit(1)
  }
}

export { sql }
