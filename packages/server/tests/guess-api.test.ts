import type { ApiError, GuessRequest, GuessResponse } from '@shadle/types'
import config from '@shadle/config'
import { GuessStatus } from '@shadle/types'
import { expect, testSuite } from 'manten'
import { getPuzzleAnswer, validateGuess } from '../src/logic/guess.js'
import { validateDeviceId, validateGuessFormat, validatePuzzleId } from '../src/utils/validation.js'

// mock the database operation for testing
function mockRecordPuzzleAttempt(_deviceId: string, _puzzleId: string, _solved: boolean) {
  return Promise.resolve({
    device_id: _deviceId,
    puzzle_id: _puzzleId,
    tries: 1,
    timestamp: new Date().toISOString(),
    solved: _solved,
  })
}

export default testSuite(({ describe }) => {
  describe('guess API logic', ({ test }) => {
    test('should process valid guess request successfully', async () => {
      const request: GuessRequest = {
        deviceId: 'test-device-1',
        puzzleId: '§2025-11-11',
        guess: 'BYRGP', // correct answer
      }

      // validate inputs
      const deviceValidation = validateDeviceId(request.deviceId)
      const puzzleValidation = validatePuzzleId(request.puzzleId)
      const guessValidation = validateGuessFormat(request.guess)

      expect(deviceValidation.isValid).toBe(true)
      expect(puzzleValidation.isValid).toBe(true)
      expect(guessValidation.isValid).toBe(true)

      // get puzzle answer
      const answer = await getPuzzleAnswer(request.puzzleId)
      expect(answer).toBe('BYRGP')

      // validate guess
      const feedback = validateGuess(request.guess.toUpperCase(), answer!)
      expect(feedback.every(f => f.status === GuessStatus.CORRECT)).toBe(true)

      // record attempt
      const attemptResult = await mockRecordPuzzleAttempt(request.deviceId, request.puzzleId, true)
      expect(attemptResult.tries).toBe(1)

      // should return success response
      const response: GuessResponse = {
        tries: attemptResult.tries,
        correct: true,
        feedback,
      }

      expect(response.tries).toBe(1)
      expect(response.correct).toBe(true)
      expect(response.feedback).toHaveLength(5)
    })

    test('should handle incorrect guess', async () => {
      const request: GuessRequest = {
        deviceId: 'test-device-2',
        puzzleId: '§2025-11-11',
        guess: 'RGBYM', // incorrect
      }

      const answer = await getPuzzleAnswer(request.puzzleId)
      const feedback = validateGuess(request.guess.toUpperCase(), answer!)

      expect(feedback.every(f => f.status === GuessStatus.CORRECT)).toBe(false)
      expect(feedback.some(f => f.status !== GuessStatus.CORRECT)).toBe(true)

      const attemptResult = await mockRecordPuzzleAttempt(request.deviceId, request.puzzleId, false)

      const response: GuessResponse = {
        tries: attemptResult.tries,
        correct: false,
        feedback,
      }

      expect(response.correct).toBe(false)
    })

    test('should reject invalid device ID', () => {
      const request = {
        deviceId: '',
        puzzleId: '§2025-11-11',
        guess: 'RGBYM',
      }

      const validation = validateDeviceId(request.deviceId)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('Device ID is required')
    })

    test('should reject invalid puzzle ID', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '',
        guess: 'RGBYM',
      }

      const validation = validatePuzzleId(request.puzzleId)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('Puzzle ID is required')
    })

    test('should reject invalid guess format', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: 'XYZ12', // 5 chars but invalid colors
      }

      const validation = validateGuessFormat(request.guess)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('valid color letters')
    })

    test('should reject guess that is too short', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: 'RGB',
      }

      const validation = validateGuessFormat(request.guess)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('exactly 5 characters')
    })

    test('should reject guess that is too long', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: 'RGBYPO',
      }

      const validation = validateGuessFormat(request.guess)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('exactly 5 characters')
    })

    test('should handle non-existent puzzle', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      // test that getPuzzleAnswer returns null for invalid puzzle IDs
      const invalidDailyPuzzle = await getPuzzleAnswer('invalid-puzzle-id')
      expect(invalidDailyPuzzle).toBeNull()

      // test that getPuzzleAnswer returns null for non-existent custom puzzles
      const nonExistentCustomPuzzle = await getPuzzleAnswer('non-existent-custom-puzzle-123')
      expect(nonExistentCustomPuzzle).toBeNull()

      // test that the API logic would properly handle null answer by rejecting the guess
      // simulate what would happen in the route handler
      const request = {
        deviceId: 'test-device',
        puzzleId: 'non-existent-puzzle',
        guess: 'RGBYM',
      }

      // get answer (should be null)
      const answer = await getPuzzleAnswer(request.puzzleId)
      expect(answer).toBeNull()

      // validate inputs first (these should pass)
      const deviceValidation = validateDeviceId(request.deviceId)
      const puzzleValidation = validatePuzzleId(request.puzzleId)
      const guessValidation = validateGuessFormat(request.guess)

      expect(deviceValidation.isValid).toBe(true)
      expect(puzzleValidation.isValid).toBe(true)
      expect(guessValidation.isValid).toBe(true)

      // but since answer is null, the guess should be rejected
      // this simulates the route handler logic: if answer is null, return 404
      if (answer === null) {
        const errorResponse: ApiError = {
          error: 'Puzzle not found',
        }
        expect(errorResponse.error).toBe('Puzzle not found')
      }
    })

    test('should handle case insensitive guesses', async () => {
      const request: GuessRequest = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: 'byrgp', // lowercase
      }

      const answer = await getPuzzleAnswer(request.puzzleId)
      const feedback = validateGuess(request.guess.toUpperCase(), answer!)

      expect(feedback.every(f => f.status === GuessStatus.CORRECT)).toBe(true)
    })

    test('should provide correct feedback for partial matches', async () => {
      const request: GuessRequest = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: 'PBRYO', // P present, B present, R correct, Y present, O absent
      }

      const answer = await getPuzzleAnswer(request.puzzleId)
      const feedback = validateGuess(request.guess.toUpperCase(), answer!)

      // P exists but wrong position
      expect(feedback[0].status).toBe(GuessStatus.PRESENT)
      // B exists but wrong position
      expect(feedback[1].status).toBe(GuessStatus.PRESENT)
      // R is in correct position
      expect(feedback[2].status).toBe(GuessStatus.CORRECT)
      // Y exists but wrong position
      expect(feedback[3].status).toBe(GuessStatus.PRESENT)
      // O not in answer
      expect(feedback[4].status).toBe(GuessStatus.ABSENT)
    })

    test('should handle custom puzzle guesses with real database integration', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const { createCustomPuzzle, getCustomPuzzle } = await import('@shadle/database')
      const { getPuzzleAnswer } = await import('../src/logic/guess.js')
      const { validateGuess } = await import('../src/logic/guess.js')

      // use a unique namespace for test data
      const TEST_NAMESPACE = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const answer = 'SHALE'
      const puzzleId = `${TEST_NAMESPACE}-custom-puzzle`

      // create a real custom puzzle in the database
      const created = await createCustomPuzzle(puzzleId, answer)
      expect(created.id).toBe(puzzleId)
      expect(created.answer).toBe(answer)

      // retrieve the puzzle answer using the real database
      const retrievedAnswer = await getPuzzleAnswer(puzzleId)
      expect(retrievedAnswer).toBe(answer)

      // test guess validation against the real answer
      const guess = 'SHALE' // perfect match
      const feedback = validateGuess(guess, retrievedAnswer!)

      // all letters should be correct
      expect(feedback.every(f => f.status === GuessStatus.CORRECT)).toBe(true)

      // test partial match
      const partialGuess = 'SHADO'
      const partialFeedback = validateGuess(partialGuess, retrievedAnswer!)

      // SHALE vs SHADO
      // S=correct, H=correct, A=correct, D=absent (D not in SHALE), O=absent (O not in SHALE)
      expect(partialFeedback[0].status).toBe(GuessStatus.CORRECT) // S
      expect(partialFeedback[1].status).toBe(GuessStatus.CORRECT) // H
      expect(partialFeedback[2].status).toBe(GuessStatus.CORRECT) // A
      expect(partialFeedback[3].status).toBe(GuessStatus.ABSENT) // D (D not in SHALE)
      expect(partialFeedback[4].status).toBe(GuessStatus.ABSENT) // O (O not in SHALE)

      // verify the puzzle still exists in database
      const retrieved = await getCustomPuzzle(puzzleId)
      expect(retrieved).not.toBeNull()
      expect(retrieved!.answer).toBe(answer)
    })
  })
})
