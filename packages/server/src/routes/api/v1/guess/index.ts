import type { ApiError, GuessRequest, GuessResponse, ValidColor } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { recordPuzzleAttempt } from '@shadle/database'
import { GuessStatus } from '@shadle/types'
import { getPuzzleAnswer, validateGuess } from '../../../../logic/guess'
import { validateGuessFormat, validatePlayerId, validatePuzzleId } from '../../../../utils/validation'

/**
 * Fastify route for puzzle guess operations.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/', async (request, reply): Promise<GuessResponse | ApiError> => {
    const { playerId, puzzleId, guess } = request.body as GuessRequest

    const normalizedGuess = guess.map(color => color.toUpperCase() as ValidColor)

    const playerValidation = validatePlayerId(playerId)
    if (!playerValidation.isValid) {
      return reply.code(400).send({ error: playerValidation.error })
    }

    const idValidation = validatePuzzleId(puzzleId)
    if (!idValidation.isValid) {
      return reply.code(400).send({ error: idValidation.error })
    }

    const guessValidation = validateGuessFormat(normalizedGuess)
    if (!guessValidation.isValid) {
      return reply.code(400).send({ error: guessValidation.error })
    }

    try {
      const answer = await getPuzzleAnswer(puzzleId)
      if (!answer) {
        return reply.code(404).send({ error: 'Puzzle not found.' })
      }

      const feedback = validateGuess(normalizedGuess, answer)
      const correct = feedback.every(item => item.status === GuessStatus.CORRECT)
      const { tries } = await recordPuzzleAttempt(playerId, puzzleId, correct)

      return reply.code(200).send({
        tries,
        correct,
        feedback,
      })
    } catch (error) {
      fastify.log.error(`Failed to process guess: ${error}`)
      return reply.code(500).send({ error: 'Failed to process guess.' })
    }
  })
}

export default route
