import { getPuzzleAttemptAggregates, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for the current day.
 * Runs every 30 minutes.
 */
export default {
  name: 'puzzle-stats-today',
  schedule: '*/30 * * * *', // every 30 minutes
  enabled: true,
  run: async () => {
    try {
      const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd format
      const finalStats = await getPuzzleAttemptAggregates(today)

      await upsertPuzzleStats(finalStats)
    } catch (error) {
      logger.error(`Failed to generate statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
