import type { ApiError, StatsRequest, StatsResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getPuzzleStats } from '@shadle/database'
import { validatePuzzleDate } from '../../../utils/validation'

/**
 * Fastify route for puzzle stats by date.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply): Promise<StatsResponse | ApiError> => {
    const { puzzleDate } = request.body as StatsRequest

    const dateValidation = validatePuzzleDate(puzzleDate)
    if (!dateValidation.isValid) {
      return reply.code(400).send({ error: dateValidation.error })
    }

    try {
      const stats = await getPuzzleStats(puzzleDate)
      if (stats.length === 0) {
        return reply.code(404).send({ error: 'No stats found for this date.' })
      }
      const puzzleStats = stats[0]
      return reply.code(200).send({
        puzzleDate: puzzleStats.puzzle_date,
        totalAttempts: puzzleStats.totalAttempts,
        totalUsers: puzzleStats.totalUsers,
        avgTries: puzzleStats.avgTries,
        successRate: puzzleStats.successRate,
        failedAttempts: puzzleStats.failedAttempts,
        triesDistribution: puzzleStats.triesDistribution,
        completionRate: puzzleStats.completionRate,
      })
    } catch {
      return reply.code(500).send({ error: 'Failed to fetch puzzle stats' })
    }
  })
}

export default route
