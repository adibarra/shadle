import type { ApiError, DailyStats } from '@shadle/types'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { getLatestDailyStats } from '@shadle/database'

export default {
  get: async (_request: FastifyRequest, reply: FastifyReply): Promise<DailyStats | ApiError> => {
    try {
      const stats = await getLatestDailyStats()
      if (!stats) {
        reply.code(404)
        return { error: 'No daily stats available' }
      }
      return stats
    } catch {
      reply.code(500)
      return { error: 'Failed to fetch daily stats' }
    }
  },
}
