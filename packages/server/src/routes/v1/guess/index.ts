import type { ApiError, GuessRequest, GuessResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { recordPuzzleAttempt } from '@shadle/database'
import { getDailyAnswer, validateGuess } from '../../../logic/guess'
import { validateDeviceId, validateGuessFormat, validatePuzzleDate } from '../../../utils/validation'

/**
 * Fastify route for puzzle guess operations.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/', async (request, reply): Promise<GuessResponse | ApiError> => {
    const { deviceId, puzzleDate, guess } = request.body as GuessRequest

    const deviceValidation = validateDeviceId(deviceId)
    if (!deviceValidation.isValid) {
      return reply.code(400).send({ error: deviceValidation.error })
    }

    const dateValidation = validatePuzzleDate(puzzleDate)
    if (!dateValidation.isValid) {
      return reply.code(400).send({ error: dateValidation.error })
    }

    const guessValidation = validateGuessFormat(guess)
    if (!guessValidation.isValid) {
      return reply.code(400).send({ error: guessValidation.error })
    }

    try {
      const answer = getDailyAnswer(puzzleDate)
      const feedback = validateGuess(guess.toUpperCase(), answer)
      const correct = feedback.every((item: { letter: string, status: string }) => item.status === 'correct')
      const { tries } = await recordPuzzleAttempt(deviceId, puzzleDate, correct)

      return reply.code(200).send({
        tries,
        correct,
        feedback,
      })
    } catch (error) {
      fastify.log.error(`Failed to process guess: ${error}`)
      return reply.code(500).send({ error: 'Failed to process guess' })
    }
  })
}

export default route
