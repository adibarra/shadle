import type { Migration } from './types'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { getLogger } from '@shadle/logger'

import { sql } from './initializer'

const logger = getLogger('DATABASE')

async function getCurrentMigration(): Promise<{ id: number } | null> {
  const result = await sql`
    select migration_id as id from migrations
    order by migration_id desc
    limit 1
  `
  return result.length > 0 ? result[0] as { id: number } : null
}

async function ensureMigrationsTable(): Promise<void> {
  try {
    await sql`select 'migrations'::regclass`
  } catch {
    await sql`
      create table migrations (
        migration_id integer primary key,
        created_at timestamp with time zone not null default now(),
        name text
      )
    `
  }
}

/**
 * Validates that a migration object has the required structure and types.
 */
function validateMigration(migration: any): migration is Migration {
  return (
    typeof migration === 'object'
    && migration !== null
    && typeof migration.path === 'string'
    && typeof migration.migration_id === 'number'
    && Number.isInteger(migration.migration_id)
    && migration.migration_id >= 0
    && typeof migration.name === 'string'
    && migration.name.length > 0
  )
}

/**
 * Runs pending migrations by executing SQL files in order.
 */
export async function runMigrations(): Promise<void> {
  const migrationsPath = join(import.meta.dirname, 'migrations')

  const migrations: Migration[] = readdirSync(migrationsPath)
    .filter(x => statSync(join(migrationsPath, x)).isFile() && x.match(/^\d+_.*\.sql$/))
    .sort((a, b) => Number.parseInt(a.split('_')[0]) - Number.parseInt(b.split('_')[0]))
    .map((x) => {
      const parts = x.split('_')
      const num = parts[0]
      const name = parts.slice(1).join('_').replace('.sql', '').replace(/-/g, ' ')
      const migration = {
        path: join(migrationsPath, x),
        migration_id: Number.parseInt(num),
        name,
      }
      if (!validateMigration(migration)) {
        throw new Error(`Invalid migration file: ${x}`)
      }
      return migration
    })

  await ensureMigrationsTable()

  const current = await getCurrentMigration()

  const needed = migrations.filter(m => m.migration_id > (current ? current.id : -1))

  await sql.begin(async (sql) => {
    for (const migration of needed) {
      logger.info(`Running migration ${migration.migration_id}: ${migration.name}`)
      await sql.file(migration.path)
      await sql`
        insert into migrations (
          migration_id,
          name
        ) values (
          ${migration.migration_id},
          ${migration.name}
        )
      `
    }
  })

  if (needed.length > 0) {
    logger.debug('All pending migrations completed.')
  } else {
    logger.debug('No migrations pending.')
  }
}
