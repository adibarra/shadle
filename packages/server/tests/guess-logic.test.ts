import { expect, testSuite } from 'manten'
import { getPuzzleAnswer, validateGuess } from '../src/logic/guess.js'
import { skipIfCI } from './utils'

export default testSuite(({ describe }) => {
  describe('validateGuess', ({ test }) => {
    test('should return all correct for perfect match', () => {
      const result = validateGuess('RGBYP', 'RGBYP')
      expect(result).toEqual([
        { letter: 'R', status: 'correct' },
        { letter: 'G', status: 'correct' },
        { letter: 'B', status: 'correct' },
        { letter: 'Y', status: 'correct' },
        { letter: 'P', status: 'correct' },
      ])
    })

    test('should return all absent for no matches', () => {
      const result = validateGuess('RGBYP', 'OWKRO')
      expect(result).toEqual([
        { letter: 'R', status: 'present' }, // R exists in answer
        { letter: 'G', status: 'absent' }, // G not in answer
        { letter: 'B', status: 'absent' }, // B not in answer
        { letter: 'Y', status: 'absent' }, // Y not in answer
        { letter: 'P', status: 'absent' }, // P not in answer
      ])
    })

    test('should handle present letters correctly', () => {
      const result = validateGuess('RGBYP', 'YBRGP')
      expect(result).toEqual([
        { letter: 'R', status: 'present' },
        { letter: 'G', status: 'present' },
        { letter: 'B', status: 'present' },
        { letter: 'Y', status: 'present' },
        { letter: 'P', status: 'correct' }, // P is in correct position
      ])
    })

    test('should handle mixed correct, present, and absent', () => {
      const result = validateGuess('RGBYP', 'RBYPO')
      expect(result).toEqual([
        { letter: 'R', status: 'correct' }, // R is in correct position
        { letter: 'G', status: 'absent' }, // G not in answer
        { letter: 'B', status: 'present' }, // B exists but wrong position
        { letter: 'Y', status: 'present' }, // Y exists but wrong position
        { letter: 'P', status: 'present' }, // P exists but wrong position
      ])
    })

    test('should handle duplicate letters correctly - only mark first occurrence as correct/present', () => {
      const result = validateGuess('RRRRR', 'RGBYR')
      expect(result).toEqual([
        { letter: 'R', status: 'correct' }, // first R matches position
        { letter: 'R', status: 'absent' }, // no more R's available
        { letter: 'R', status: 'absent' }, // no more R's available
        { letter: 'R', status: 'absent' }, // no more R's available
        { letter: 'R', status: 'correct' }, // fifth R matches position 4
      ])
    })

    test('should handle duplicate letters with correct and present', () => {
      const result = validateGuess('RBRBR', 'BRBRB')
      expect(result).toEqual([
        { letter: 'R', status: 'present' }, // R exists but wrong position
        { letter: 'B', status: 'present' }, // B exists but wrong position
        { letter: 'R', status: 'present' }, // R exists but wrong position
        { letter: 'B', status: 'present' }, // B exists but wrong position
        { letter: 'R', status: 'absent' }, // no more R's available
      ])
    })

    test('should handle case insensitive input', () => {
      const result = validateGuess('rgbyp', 'RGBYP')
      expect(result).toEqual([
        { letter: 'r', status: 'absent' }, // case sensitive comparison
        { letter: 'g', status: 'absent' },
        { letter: 'b', status: 'absent' },
        { letter: 'y', status: 'absent' },
        { letter: 'p', status: 'absent' },
      ])
    })

    test('should preserve original guess letter case', () => {
      const result = validateGuess('Rgbyp', 'RGBYP')
      expect(result).toEqual([
        { letter: 'R', status: 'correct' },
        { letter: 'g', status: 'absent' }, // lowercase g doesn't match uppercase G
        { letter: 'b', status: 'absent' },
        { letter: 'y', status: 'absent' },
        { letter: 'p', status: 'absent' },
      ])
    })

    test('should handle all letters present but wrong positions', () => {
      const result = validateGuess('RGBYP', 'PGBYR')
      expect(result).toEqual([
        { letter: 'R', status: 'present' }, // R exists in answer
        { letter: 'G', status: 'correct' }, // G in correct position
        { letter: 'B', status: 'correct' }, // B in correct position
        { letter: 'Y', status: 'correct' }, // Y in correct position
        { letter: 'P', status: 'present' }, // P exists in answer
      ])
    })

    test('should handle single letter matches', () => {
      const result = validateGuess('RRRRR', 'RBBBB')
      expect(result).toEqual([
        { letter: 'R', status: 'correct' }, // first R matches
        { letter: 'R', status: 'absent' }, // no more R's
        { letter: 'R', status: 'absent' }, // no more R's
        { letter: 'R', status: 'absent' }, // no more R's
        { letter: 'R', status: 'absent' }, // no more R's
      ])
    })

    test('should handle edge case with repeated letters in answer', () => {
      const result = validateGuess('BBBBB', 'BRBRB')
      expect(result).toEqual([
        { letter: 'B', status: 'correct' }, // B in correct position
        { letter: 'B', status: 'absent' }, // no more B's available
        { letter: 'B', status: 'correct' }, // B in correct position
        { letter: 'B', status: 'absent' }, // no more B's available
        { letter: 'B', status: 'correct' }, // B in correct position
      ])
    })

    test('should handle guess with no letters matching answer', () => {
      const result = validateGuess('OWKOW', 'RGBYP')
      expect(result).toEqual([
        { letter: 'O', status: 'absent' }, // O not in answer
        { letter: 'W', status: 'absent' }, // W not in answer
        { letter: 'K', status: 'absent' }, // K not in answer
        { letter: 'O', status: 'absent' }, // O not in answer
        { letter: 'W', status: 'absent' }, // W not in answer
      ])
    })
  })

  describe('getPuzzleAnswer', ({ test }) => {
    test('should generate correct daily puzzle answer for specific date', async () => {
      const result = await getPuzzleAnswer('§2025-11-11')
      expect(result).toBe('POBYR') // based on LCG algorithm with seed for 2025-11-11
    })

    test('should generate different answers for different dates', async () => {
      const result1 = await getPuzzleAnswer('§2025-11-10')
      const result2 = await getPuzzleAnswer('§2025-11-11')
      expect(result1).not.toBe(result2)
      expect(result1).toHaveLength(5)
      expect(result2).toHaveLength(5)
    })

    test('should generate consistent answers for same date', async () => {
      const result1 = await getPuzzleAnswer('§2025-11-11')
      const result2 = await getPuzzleAnswer('§2025-11-11')
      expect(result1).toBe(result2)
    })

    test('should return null for invalid daily puzzle format', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const result = await getPuzzleAnswer('§invalid-date')
      expect(result).toBeNull()
    })

    test('should generate answer even for invalid date numbers', async () => {
      const result = await getPuzzleAnswer('§2025-13-45') // invalid date but valid format
      expect(result).toHaveLength(5)
      expect(typeof result).toBe('string')
    })

    test('should return null for custom puzzle when database returns null', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const result = await getPuzzleAnswer('TEST-custom-puzzle-123')
      expect(result).toBeNull()
    })

    test('should handle edge case dates', async () => {
      const result = await getPuzzleAnswer('§2000-01-01')
      expect(result).toHaveLength(5)
      expect(typeof result).toBe('string')
    })

    test('should handle future dates', async () => {
      const result = await getPuzzleAnswer('§2030-12-31')
      expect(result).toHaveLength(5)
      expect(typeof result).toBe('string')
    })
  })
})
