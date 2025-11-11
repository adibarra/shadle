import type { ApiError, GuessRequest, GuessResponse } from '@shadle/types'
import type { FastifyPluginAsync } from 'fastify'
import { recordPuzzleAttempt } from '@shadle/database'

/**
 * Generate the correct answer for a given puzzle ID (deterministic)
 * For now, uses a simple algorithm based on date
 */
function getDailyAnswer(puzzleId: string): string {
  // Simple deterministic algorithm for daily answers
  const puzzleDate = new Date(puzzleId)
  const seed = puzzleDate.getFullYear() * 10000 + (puzzleDate.getMonth() + 1) * 100 + puzzleDate.getDate()

  // Available colors: R, G, B, Y, P, O, W, K (Red, Green, Blue, Yellow, Purple, Orange, White, Black)
  const colors = ['R', 'G', 'B', 'Y', 'P', 'O', 'W', 'K']

  let answer = ''
  let tempSeed = seed

  for (let i = 0; i < 5; i++) {
    tempSeed = (tempSeed * 9301 + 49297) % 233280 // Simple LCG
    const index = tempSeed % colors.length
    answer += colors[index]
  }

  return answer
}

/**
 * Validate a guess against the correct answer and return feedback
 */
function validateGuess(guess: string, answer: string): GuessResponse['feedback'] {
  const feedback: GuessResponse['feedback'] = []
  const answerLetters = answer.split('')
  const guessLetters = guess.split('')

  // First pass: mark correct positions
  const usedAnswerPositions = new Set<number>()
  const usedGuessPositions = new Set<number>()

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      feedback[i] = { letter: guessLetters[i], status: 'correct' }
      usedAnswerPositions.add(i)
      usedGuessPositions.add(i)
    }
  }

  // Second pass: mark present (wrong position) letters
  for (let i = 0; i < 5; i++) {
    if (!usedGuessPositions.has(i)) {
      // Find if this letter appears in unused positions in the answer
      let found = false
      for (let j = 0; j < 5; j++) {
        if (!usedAnswerPositions.has(j) && guessLetters[i] === answerLetters[j]) {
          feedback[i] = { letter: guessLetters[i], status: 'present' }
          usedAnswerPositions.add(j)
          found = true
          break
        }
      }
      if (!found) {
        feedback[i] = { letter: guessLetters[i], status: 'absent' }
      }
    }
  }

  return feedback
}

/**
 * Fastify route for puzzle guess operations.
 */
const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Submit a guess for a puzzle
  fastify.post('/', async (request, reply): Promise<GuessResponse | ApiError> => {
    const { deviceId, puzzleId, guess } = request.body as GuessRequest

    if (!deviceId) {
      return reply.code(400).send({ error: 'Device ID is required' })
    }

    if (!puzzleId) {
      return reply.code(400).send({ error: 'Puzzle ID is required' })
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(puzzleId)) {
      return reply.code(400).send({ error: 'Invalid puzzle ID format. Use YYYY-MM-DD.' })
    }

    const requestedDate = new Date(`${puzzleId}T00:00:00.000Z`)
    if (Number.isNaN(requestedDate.getTime())) {
      return reply.code(400).send({ error: 'Invalid puzzle ID format. Use YYYY-MM-DD.' })
    }

    // Check if puzzle ID (date) is not in the future
    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))
    if (requestedDate > today) {
      return reply.code(422).send({ error: 'Cannot guess for future puzzle IDs.' })
    }

    // Validate guess format
    if (!guess || typeof guess !== 'string') {
      return reply.code(400).send({ error: 'Guess is required and must be a string' })
    }

    if (guess.length !== 5) {
      return reply.code(400).send({ error: 'Guess must be exactly 5 characters' })
    }

    // Validate guess contains only valid color letters
    const validColors = /^[RGBYPOWK]+$/
    if (!validColors.test(guess.toUpperCase())) {
      return reply.code(400).send({ error: 'Guess must contain only valid color letters: R, G, B, Y, P, O, W, K' })
    }

    try {
      // Get the correct answer for this date
      const answer = getDailyAnswer(puzzleId)

      // Validate the guess
      const feedback = validateGuess(guess.toUpperCase(), answer)
      const correct = feedback.every(item => item.status === 'correct')

      // Record the attempt (pass completed flag if they got it right)
      const history = await recordPuzzleAttempt(deviceId, puzzleId, correct)

      return reply.code(200).send({
        correct,
        tries: history.progress.puzzles[puzzleId]?.tries || 1,
        feedback,
      })
    } catch (error) {
      fastify.log.error(`Failed to process guess: ${error}`)
      return reply.code(500).send({ error: 'Failed to process guess' })
    }
  })
}

export default route
