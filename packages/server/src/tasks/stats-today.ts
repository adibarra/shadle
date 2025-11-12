import { getPuzzleAttemptAggregates, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for the current day.
 */
export default {
  name: 'puzzle-stats-today',
  schedule: '0 * * * *', // every hour
  enabled: true,
  run: async () => {
    try {
      const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd format
      const finalStats = await getPuzzleAttemptAggregates(today)

      await upsertPuzzleStats(finalStats)

      logger.info(`Statistics: totalAttempts=${finalStats.totalAttempts}, totalUsers=${finalStats.totalUsers}, avgTries=${finalStats.avgTries.toFixed(2)}, successRate=${(finalStats.successRate * 100).toFixed(1)}%, completionRate=${(finalStats.completionRate * 100).toFixed(1)}%`)
      logger.info(`Distribution: ${JSON.stringify(finalStats.triesDistribution)}`)
    } catch (error) {
      logger.error(`Failed to generate statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
