import type { ApiError, DailyStats } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getDailyStats } from '@shadle/database'

/**
 * Fastify route for daily stats by date.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/:date', async (request, reply): Promise<DailyStats | ApiError> => {
    const { date } = request.params as { date: string }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return reply.code(400).send({ error: 'Invalid date format. Use YYYY-MM-DD.' })
    }

    const requestedDate = new Date(`${date}T00:00:00.000Z`)
    if (Number.isNaN(requestedDate.getTime())) {
      return reply.code(400).send({ error: 'Invalid date format. Use YYYY-MM-DD.' })
    }

    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))

    if (requestedDate > today) {
      return reply.code(422).send({ error: 'Cannot request stats for future dates.' })
    }

    try {
      const stats = await getDailyStats(date)
      if (!stats) {
        return reply.code(404).send({ error: 'No stats found for this date.' })
      }
      return reply.code(200).send(stats)
    } catch {
      return reply.code(500).send({ error: 'Failed to fetch daily stats' })
    }
  })
}

export default route
