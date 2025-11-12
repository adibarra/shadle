import { getPuzzleAttemptAggregates, sql, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for all puzzle ids.
 * Runs daily at 3:00 AM UTC.
 */
export default {
  name: 'puzzle-stats-all',
  schedule: '0 3 * * *', // daily at 3:00 AM UTC
  enabled: true,
  run: async () => {
    try {
      const dateResult = await sql`
        select distinct puzzle_id
        from puzzle_attempts
        order by puzzle_id
      `

      const puzzleIds = dateResult.map(row => row.puzzle_id as string)
      logger.info(`Found ${puzzleIds.length} puzzle ids to update`)

      for (const puzzleId of puzzleIds) {
        try {
          const stats = await getPuzzleAttemptAggregates(puzzleId)
          await upsertPuzzleStats(stats)
        } catch (error) {
          logger.error(`Failed to update stats for ${puzzleId}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    } catch (error) {
      logger.error(`Failed to update all puzzle statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
