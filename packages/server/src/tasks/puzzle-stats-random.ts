import { getRandomPuzzleStats, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for all random puzzles.
 * Runs every 30 minutes.
 */
export default {
  name: 'puzzle-stats-random',
  schedule: '*/30 * * * *', // every 30 minutes
  enabled: true,
  run: async () => {
    try {
      const stats = await getRandomPuzzleStats()
      await upsertPuzzleStats(stats)
      logger.info('Updated random puzzle statistics')
    } catch (error) {
      logger.error(`Failed to update random puzzle statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
