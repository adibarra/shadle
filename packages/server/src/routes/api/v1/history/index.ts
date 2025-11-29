import type { ApiError, HistoryRequest, HistoryResponse, PuzzleAttemptResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { getPuzzleAttempts } from '@shadle/database'
import { validatePlayerId } from '../../../../utils/validation'

/**
 * Fastify route for puzzle history operations.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply): Promise<HistoryResponse | ApiError> => {
    const { playerId, puzzleId } = request.query as HistoryRequest

    const playerValidation = validatePlayerId(playerId)
    if (!playerValidation.isValid) {
      return reply.code(400).send({ error: playerValidation.error })
    }

    try {
      const history = await getPuzzleAttempts(playerId, puzzleId)
      return reply.code(200).send({ attempts: history as PuzzleAttemptResponse[] })
    } catch (error) {
      fastify.log.error(`Failed to get puzzle history: ${error}`)
      return reply.code(500).send({ error: 'Failed to get puzzle history.' })
    }
  })
}

export default route
