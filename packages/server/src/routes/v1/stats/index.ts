import type { ApiError, StatsRequest, StatsResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getPuzzleStats } from '@shadle/database'
import { validatePuzzleId } from '../../../utils/validation'

/**
 * Fastify route for puzzle stats by puzzle ID.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply): Promise<StatsResponse | ApiError> => {
    const { puzzleId } = request.body as StatsRequest

    const idValidation = validatePuzzleId(puzzleId)
    if (!idValidation.isValid) {
      return reply.code(400).send({ error: idValidation.error })
    }

    try {
      const stats = await getPuzzleStats(puzzleId)
      if (stats.length === 0) {
        return reply.code(404).send({ error: 'No stats found for this puzzle.' })
      }
      const puzzleStats = stats[0]
      return reply.code(200).send({
        puzzleId: puzzleStats.puzzle_id,
        totalAttempts: puzzleStats.totalAttempts,
        totalDevices: puzzleStats.totalDevices,
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
