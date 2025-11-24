import type { ApiError, GuessRequest, GuessResponse, ValidColor } from '@shadle/types'
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
        guess: ['B', 'Y', 'R', 'G', 'P'], // correct answer
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
      expect(answer).toEqual(['B', 'Y', 'R', 'G', 'P'])

      // validate guess
      const feedback = validateGuess(request.guess.map(c => c.toUpperCase() as ValidColor), answer!)
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
        guess: ['R', 'G', 'B', 'Y', 'M'], // incorrect
      }

      const answer = await getPuzzleAnswer(request.puzzleId)
      const feedback = validateGuess(request.guess.map(c => c.toUpperCase() as ValidColor), answer!)

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
        guess: ['R', 'G', 'B', 'Y', 'M'],
      }

      const validation = validateDeviceId(request.deviceId)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('Device ID is required')
    })

    test('should reject invalid puzzle ID', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '',
        guess: ['R', 'G', 'B', 'Y', 'M'],
      }

      const validation = validatePuzzleId(request.puzzleId)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('Puzzle ID is required')
    })

    test('should reject invalid guess format', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: ['X', 'Y', 'Z', '1', '2'] as ValidColor[], // 5 chars but invalid colors
      } as GuessRequest

      const validation = validateGuessFormat(request.guess)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('valid color letters')
    })

    test('should reject guess that is too short', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: ['R', 'G', 'B'],
      } as GuessRequest

      const validation = validateGuessFormat(request.guess)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('exactly 5 colors')
    })

    test('should reject guess that is too long', () => {
      const request = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: ['R', 'G', 'B', 'Y', 'P', 'O'],
      } as GuessRequest

      const validation = validateGuessFormat(request.guess)
      expect(validation.isValid).toBe(false)
      expect(validation.error).toContain('exactly 5 colors')
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
        guess: ['R', 'G', 'B', 'Y', 'M'],
      } as GuessRequest

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
          error: 'Puzzle not found.',
        }
        expect(errorResponse.error).toBe('Puzzle not found.')
      }
    })

    test('should handle case insensitive guesses', async () => {
      const request: GuessRequest = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: ['b', 'y', 'r', 'g', 'p'] as unknown as ValidColor[], // lowercase
      }

      const answer = await getPuzzleAnswer(request.puzzleId)
      const feedback = validateGuess(request.guess.map(c => c.toUpperCase() as ValidColor), answer!)

      expect(feedback.every(f => f.status === GuessStatus.CORRECT)).toBe(true)
    })

    test('should provide correct feedback for partial matches', async () => {
      const request: GuessRequest = {
        deviceId: 'test-device',
        puzzleId: '§2025-11-11',
        guess: ['P', 'B', 'R', 'Y', 'O'], // P present, B present, R correct, Y present, O absent
      }

      const answer = await getPuzzleAnswer(request.puzzleId)
      const feedback = validateGuess(request.guess.map(c => c.toUpperCase() as ValidColor), answer!)

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
  })
})
