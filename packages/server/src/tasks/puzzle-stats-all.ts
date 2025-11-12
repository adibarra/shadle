import { getPuzzleAttemptAggregates, sql, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for all puzzle dates.
 * Runs daily at 3:00 AM UTC.
 */
export default {
  name: 'puzzle-stats-all',
  schedule: '0 3 * * *', // daily at 3:00 AM UTC
  enabled: true,
  run: async () => {
    try {
      const dateResult = await sql`
        select distinct puzzle_date
        from puzzle_attempts
        order by puzzle_date
      `

      const puzzleDates = dateResult.map(row => row.puzzle_date as string)
      logger.info(`Found ${puzzleDates.length} puzzle dates to update`)

      for (const puzzleDate of puzzleDates) {
        try {
          const stats = await getPuzzleAttemptAggregates(puzzleDate)
          await upsertPuzzleStats(stats)
        } catch (error) {
          logger.error(`Failed to update stats for ${puzzleDate}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    } catch (error) {
      logger.error(`Failed to update all puzzle statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
