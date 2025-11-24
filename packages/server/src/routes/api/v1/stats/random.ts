import type { ApiError, StatsResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getRandomPuzzleStats } from '@shadle/database'

/**
 * Fastify route for random puzzle stats.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply): Promise<StatsResponse | ApiError> => {
    try {
      const stats = await getRandomPuzzleStats()
      if (stats.totalAttempts === 0) {
        return reply.code(404).send({ error: 'No stats found for random puzzles.' })
      }
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
