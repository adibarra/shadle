import { getPuzzleAttemptAggregates, getSql, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for all puzzle ids.
 * Runs hourly.
 */
export default {
  name: 'puzzle-stats-all',
  schedule: '0 * * * *', // hourly
  enabled: true,
  run: async () => {
    try {
      const sql = await getSql()
      const countResult = await sql`
        select count(distinct puzzle_id) as count
        from puzzle_attempts
        where puzzle_id like '§%'
      `

      const puzzleCount = Number(countResult[0]?.count ?? 0)
      logger.debug(`[puzzle-stats-all] Found ${puzzleCount} puzzle ids to update`)

      const idsResult = await sql`
        select distinct puzzle_id
        from puzzle_attempts
        where puzzle_id like '§%'
        order by puzzle_id
      `
      const puzzleIds = idsResult.map(row => row.puzzle_id as string)

      for (const puzzleId of puzzleIds) {
        try {
          const stats = await getPuzzleAttemptAggregates(puzzleId)
          await upsertPuzzleStats(stats)
        } catch (error) {
          logger.error(`Failed to update stats for '${puzzleId}': ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    } catch (error) {
      logger.error(`Failed to update all puzzle statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
