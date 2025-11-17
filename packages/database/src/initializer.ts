import type { Sql } from 'postgres'

import { exit } from 'node:process'
import config from '@shadle/config'
import { getLogger } from '@shadle/logger'
import postgres from 'postgres'
import { runMigrations } from './migrations'

const logger = getLogger('DATABASE')

let sql: Sql | undefined

/**
 * Establishes a connection to the PostgreSQL database using the configured URI.
 *
 * @returns The connected postgres client instance.
 * @throws Exits the process if connection fails.
 */
async function connect(): Promise<Sql> {
  const dbUrl = config.IS_TEST ? config.POSTGRES_TEST_URL : config.POSTGRES_URL

  let sqlInstance: Sql
  try {
    logger.debug('Connecting to database...')
    sqlInstance = postgres(dbUrl, {
      onnotice: notice => logger.trace(`Notice: ${notice.message}`),
    })
    await sqlInstance`SELECT 1;`
    return sqlInstance
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
async function prepare(): Promise<void> {
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

async function init(): Promise<void> {
  if (!sql) {
    sql = await connect()
    await prepare()
  }
}

export async function getSql(): Promise<Sql> {
  await init()
  return sql!
}

export async function cleanupDb(): Promise<void> {
  if (sql) await sql.end({ timeout: 10 })
}
