import { getRandomPuzzleStats, getSql, upsertPuzzleStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'

const logger = getLogger('TASKS')

/**
 * Generate puzzle statistics for all random puzzles.
 * Runs every 15 minutes.
 */
export default {
  name: 'puzzle-stats-random',
  schedule: '*/15 * * * *', // every 15 minutes
  enabled: true,
  run: async () => {
    try {
      const sql = await getSql()
      const result = await sql`
        select count(distinct puzzle_id) as count
        from puzzle_attempts
        where puzzle_id like 'random:%'
      `

      const randomPuzzleCount = Number(result[0]?.count ?? 0)
      logger.debug(`[puzzle-stats-random] Found ${randomPuzzleCount} puzzle ids to aggregate`)

      try {
        const stats = await getRandomPuzzleStats()
        await upsertPuzzleStats(stats)
      } catch (error) {
        logger.error(`Failed to update stats for 'random': ${error instanceof Error ? error.message : String(error)}`)
      }
    } catch (error) {
      logger.error(`Failed to update random puzzle statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
