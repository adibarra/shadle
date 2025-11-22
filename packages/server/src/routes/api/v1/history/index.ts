import type { ApiError, HistoryRequest, HistoryResponse, PuzzleAttemptResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getPuzzleAttempts } from '@shadle/database'
import { validateDeviceId } from '../../../../utils/validation'

/**
 * Fastify route for puzzle history operations.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply): Promise<HistoryResponse | ApiError> => {
    const { deviceId, puzzleId } = request.query as HistoryRequest

    const deviceValidation = validateDeviceId(deviceId)
    if (!deviceValidation.isValid) {
      return reply.code(400).send({ error: deviceValidation.error })
    }

    try {
      const history = await getPuzzleAttempts(deviceId, puzzleId)
      return reply.code(200).send({ attempts: history as PuzzleAttemptResponse[] })
    } catch (error) {
      fastify.log.error(`Failed to get puzzle history: ${error}`)
      return reply.code(500).send({ error: 'Failed to get puzzle history.' })
    }
  })
}

export default route
