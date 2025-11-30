import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { getLogger } from '@shadle/logger'
import cron from 'node-cron'

const logger = getLogger('TASKS')

/**
 * Task configuration interface
 */
export interface TaskConfig {
  name: string
  schedule: string // cron expression
  enabled?: boolean
  run: () => Promise<void> | void
}

/**
 * Loads and schedules all tasks from the tasks directory
 */
export async function startTasks(): Promise<void> {
  const startTime = performance.now()
  const tasksDir = join(import.meta.dirname, 'tasks')

  logger.info('Loading tasks...')
  const taskFiles = await readdir(tasksDir).catch(() => [])

  for (const file of taskFiles) {
    if (!file.endsWith('.ts') && !file.endsWith('.js')) continue

    try {
      const taskModule = await import(join(tasksDir, file))
      const task: TaskConfig = taskModule.default || taskModule

      if (!task.name || !task.schedule || !task.run) {
        logger.warn(`Invalid task in ${file}: missing required fields`)
        continue
      }

      if (task.enabled === false) {
        logger.info(`Task ${task.name} is disabled`)
        continue
      }

      // schedule the task
      cron.schedule(task.schedule, async () => {
        const taskStartTime = performance.now()
        try {
          logger.debug(`Running task: ${task.name}`)
          await task.run()
          logger.info(`Task ${task.name} completed in ${(performance.now() - taskStartTime).toFixed(2)}ms`)
        } catch (error) {
          logger.error(`Task ${task.name} failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      }, {
        timezone: 'UTC',
      })

      logger.info(`Scheduled task: ${task.name} (${task.schedule})`)
    } catch (error) {
      logger.error(`Failed to load task from ${file}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const duration = performance.now() - startTime
  logger.info(`Tasks loaded from ${taskFiles.length} files in ${(duration).toFixed(2)}ms.`)
}

/**
 * Stops all scheduled tasks
 */
export function stopTasks(): void {
  cron.getTasks().forEach(task => task.stop())
  logger.info('All tasks stopped')
}
