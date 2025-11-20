import { VALID_COLORS } from '@shadle/types'
import { expect, testSuite } from 'manten'
import { validateDeviceId, validateGuessFormat, validatePuzzleId } from '../src/utils/validation.js'

export default testSuite(({ describe }) => {
  describe('validatePuzzleId', ({ test }) => {
    test('should return valid for non-empty string', () => {
      const result = validatePuzzleId('test-puzzle')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should return invalid for empty string', () => {
      const result = validatePuzzleId('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Puzzle ID is required')
    })

    test('should accept various puzzle ID formats', () => {
      expect(validatePuzzleId('§2025-11-11').isValid).toBe(true)
      expect(validatePuzzleId('custom-puzzle-123').isValid).toBe(true)
      expect(validatePuzzleId('test_123').isValid).toBe(true)
    })
  })

  describe('validateDeviceId', ({ test }) => {
    test('should return valid for non-empty string', () => {
      const result = validateDeviceId('device-123')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should return invalid for empty string', () => {
      const result = validateDeviceId('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Device ID is required')
    })

    test('should return invalid for undefined', () => {
      const result = validateDeviceId(undefined)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Device ID is required')
    })

    test('should return invalid for null', () => {
      const result = validateDeviceId(null as any)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Device ID is required')
    })

    test('should accept various device ID formats', () => {
      expect(validateDeviceId('abc123').isValid).toBe(true)
      expect(validateDeviceId('device-uuid-123').isValid).toBe(true)
      expect(validateDeviceId('test_device_123').isValid).toBe(true)
    })
  })

  describe('validateGuessFormat', ({ test }) => {
    test('should return valid for correct 5-letter guess with valid colors', () => {
      const result = validateGuessFormat('RGBYM')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should return valid for lowercase guess', () => {
      const result = validateGuessFormat('rgbym')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should return valid for mixed case guess', () => {
      const result = validateGuessFormat('RgbYM')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should return invalid for undefined', () => {
      const result = validateGuessFormat(undefined)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Guess is required and must be a string')
    })

    test('should return invalid for null', () => {
      const result = validateGuessFormat(null as any)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Guess is required and must be a string')
    })

    test('should return invalid for non-string', () => {
      const result = validateGuessFormat(123 as any)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Guess is required and must be a string')
    })

    test('should return invalid for empty string', () => {
      const result = validateGuessFormat('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Guess is required and must be a string')
    })

    test('should return invalid for too short guess', () => {
      const result = validateGuessFormat('RGB')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Guess must be exactly 5 characters')
    })

    test('should return invalid for too long guess', () => {
      const result = validateGuessFormat('RGBYPO')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Guess must be exactly 5 characters')
    })

    test('should return invalid for guess with invalid characters', () => {
      const result = validateGuessFormat('RGBYX')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe(`Guess must contain only valid color letters: ${VALID_COLORS.join(', ')}`)
    })

    test('should return invalid for guess with numbers', () => {
      const result = validateGuessFormat('RGBY1')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe(`Guess must contain only valid color letters: ${VALID_COLORS.join(', ')}`)
    })

    test('should return invalid for guess with special characters', () => {
      const result = validateGuessFormat('RGBY!')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe(`Guess must contain only valid color letters: ${VALID_COLORS.join(', ')}`)
    })

    test('should return invalid for guess with spaces', () => {
      const result = validateGuessFormat('RGBY ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe(`Guess must contain only valid color letters: ${VALID_COLORS.join(', ')}`)
    })

    test('should accept all valid color letters', () => {
      const validGuesses = VALID_COLORS.map(color => color.repeat(5))
      validGuesses.forEach((guess) => {
        const result = validateGuessFormat(guess)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    test('should accept mixed valid colors', () => {
      const validGuesses = ['RGBYM', 'MCPGO', 'OYRGB', 'BCMPO', 'GYMCB']
      validGuesses.forEach((guess) => {
        const result = validateGuessFormat(guess)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })
  })
})
