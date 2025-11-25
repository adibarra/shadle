import { getPuzzleAttemptAggregates, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for the current day.
 * Runs every 5 minutes.
 */
export default {
  name: 'puzzle-stats-today',
  schedule: '*/5 * * * *', // every 5 minutes
  enabled: true,
  run: async () => {
    try {
      const puzzleId = `§${new Date().toISOString().split('T')[0]}`

      try {
        const stats = await getPuzzleAttemptAggregates(puzzleId)
        await upsertPuzzleStats(stats)
      } catch (error) {
        logger.error(`Failed to update stats for '${puzzleId}': ${error instanceof Error ? error.message : String(error)}`)
      }
    } catch (error) {
      logger.error(`Failed to generate statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
