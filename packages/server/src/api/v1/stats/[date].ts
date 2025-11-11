import type { ApiError, DailyStats } from '@shadle/types'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDailyStats } from '@shadle/database'

export default {
  get: async (request: FastifyRequest<{ Params: { date: string } }>, reply: FastifyReply): Promise<DailyStats | ApiError> => {
    const { date } = request.params

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      reply.code(400)
      return { error: 'Invalid date format. Use YYYY-MM-DD.' }
    }

    const requestedDate = new Date(date + 'T00:00:00.000Z')
    if (isNaN(requestedDate.getTime())) {
      reply.code(400)
      return { error: 'Invalid date format. Use YYYY-MM-DD.' }
    }

    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))

    if (requestedDate > today) {
      reply.code(422)
      return { error: 'Cannot request stats for future dates.' }
    }

    try {
      const stats = await getDailyStats(date)
      if (!stats) {
        reply.code(404)
        return { error: 'No stats found for this date.' }
      }
      return stats
    } catch {
      reply.code(500)
      return { error: 'Failed to fetch daily stats' }
    }
  },
}
