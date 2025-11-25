import type { ApiError, StatsRequest, StatsResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getPuzzleStats, getRandomPuzzleStats } from '@shadle/database'
import { validatePuzzleId } from '../../../../utils/validation'

/**
 * Fastify route for puzzle stats by puzzle ID.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply): Promise<StatsResponse | ApiError> => {
    const { puzzleId } = request.query as StatsRequest

    const idValidation = validatePuzzleId(puzzleId)
    if (!idValidation.isValid) {
      return reply.code(400).send({ error: idValidation.error })
    }

    try {
      const stats = await getPuzzleStats(puzzleId)
      const puzzleStats = stats.length > 0
        ? stats[0]
        : {
            puzzle_id: puzzleId,
            totalAttempts: 0,
            totalDevices: 0,
            avgTries: 0,
            successRate: 0,
            failedAttempts: 0,
            triesDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
            completionRate: 0,
          }
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
      return reply.code(500).send({ error: 'Failed to fetch puzzle stats.' })
    }
  })

  fastify.get('/random', async (request, reply): Promise<StatsResponse | ApiError> => {
    try {
      const stats = await getRandomPuzzleStats()
      return reply.code(200).send({
        puzzleId: stats.puzzle_id,
        totalAttempts: stats.totalAttempts,
        totalDevices: stats.totalDevices,
        avgTries: stats.avgTries,
        successRate: stats.successRate,
        failedAttempts: stats.failedAttempts,
        triesDistribution: stats.triesDistribution,
        completionRate: stats.completionRate,
      })
    } catch {
      return reply.code(500).send({ error: 'Failed to fetch random puzzle stats.' })
    }
  })
}

export default route
