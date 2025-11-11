import type { ApiError } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getHistory, recordPuzzleAttempt } from '@shadle/database'

/**
 * Fastify route for puzzle history operations.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Record a puzzle attempt for a specific date
  fastify.post('/play/:date', async (request, reply): Promise<{ success: boolean } | ApiError> => {
    const { date } = request.params as { date: string }
    const { deviceId } = request.body as { deviceId: string }

    if (!deviceId) {
      return reply.code(400).send({ error: 'Device ID is required' })
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return reply.code(400).send({ error: 'Invalid date format. Use YYYY-MM-DD.' })
    }

    const requestedDate = new Date(`${date}T00:00:00.000Z`)
    if (Number.isNaN(requestedDate.getTime())) {
      return reply.code(400).send({ error: 'Invalid date format. Use YYYY-MM-DD.' })
    }

    // Check if date is not in the future
    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))
    if (requestedDate > today) {
      return reply.code(422).send({ error: 'Cannot record attempts for future dates.' })
    }

    try {
      await recordPuzzleAttempt(deviceId, date)
      return reply.code(200).send({ success: true })
    } catch (error) {
      fastify.log.error(`Failed to record puzzle attempt: ${error}`)
      return reply.code(500).send({ error: 'Failed to record puzzle attempt' })
    }
  })

  // Get puzzle history for a device
  fastify.get('/', async (request, reply): Promise<any | ApiError> => {
    const { deviceId } = request.query as { deviceId: string }

    if (!deviceId) {
      return reply.code(400).send({ error: 'Device ID is required' })
    }

    try {
      const history = await getHistory(deviceId)
      if (!history) {
        return reply.code(404).send({ error: 'No history found for this device' })
      }
      return reply.code(200).send(history)
    } catch (error) {
      fastify.log.error(`Failed to get puzzle history: ${error}`)
      return reply.code(500).send({ error: 'Failed to get puzzle history' })
    }
  })
}

export default route
