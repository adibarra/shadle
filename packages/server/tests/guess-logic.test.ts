import config from '@shadle/config'
import { GuessStatus } from '@shadle/types'
import { expect, testSuite } from 'manten'
import { getPuzzleAnswer, validateGuess } from '../src/logic/guess.js'

export default testSuite(({ describe }) => {
  describe('validateGuess', ({ test }) => {
    test('should return all correct for perfect match', () => {
      const result = validateGuess(['R', 'G', 'B', 'Y', 'P'], ['R', 'G', 'B', 'Y', 'P'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.CORRECT },
        { letter: 'G', status: GuessStatus.CORRECT },
        { letter: 'B', status: GuessStatus.CORRECT },
        { letter: 'Y', status: GuessStatus.CORRECT },
        { letter: 'P', status: GuessStatus.CORRECT },
      ])
    })

    test('should return all absent for no matches', () => {
      const result = validateGuess(['R', 'G', 'B', 'Y', 'P'], ['O', 'M', 'C', 'R', 'O'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.PRESENT }, // R exists in answer
        { letter: 'G', status: GuessStatus.ABSENT }, // G not in answer
        { letter: 'B', status: GuessStatus.ABSENT }, // B not in answer
        { letter: 'Y', status: GuessStatus.ABSENT }, // Y not in answer
        { letter: 'P', status: GuessStatus.ABSENT }, // P not in answer
      ])
    })

    test('should handle present letters correctly', () => {
      const result = validateGuess(['R', 'G', 'B', 'Y', 'P'], ['Y', 'B', 'R', 'G', 'P'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.PRESENT },
        { letter: 'G', status: GuessStatus.PRESENT },
        { letter: 'B', status: GuessStatus.PRESENT },
        { letter: 'Y', status: GuessStatus.PRESENT },
        { letter: 'P', status: GuessStatus.CORRECT }, // P is in correct position
      ])
    })

    test('should handle mixed correct, present, and absent', () => {
      const result = validateGuess(['R', 'G', 'B', 'Y', 'P'], ['R', 'B', 'Y', 'P', 'O'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.CORRECT }, // R is in correct position
        { letter: 'G', status: GuessStatus.ABSENT }, // G not in answer
        { letter: 'B', status: GuessStatus.PRESENT }, // B exists but wrong position
        { letter: 'Y', status: GuessStatus.PRESENT }, // Y exists but wrong position
        { letter: 'P', status: GuessStatus.PRESENT }, // P exists but wrong position
      ])
    })

    test('should handle duplicate letters correctly - only mark first occurrence as correct/present', () => {
      const result = validateGuess(['R', 'R', 'R', 'R', 'R'], ['R', 'G', 'B', 'Y', 'R'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.CORRECT }, // first R matches position
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's available
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's available
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's available
        { letter: 'R', status: GuessStatus.CORRECT }, // fifth R matches position 4
      ])
    })

    test('should handle duplicate letters with correct and present', () => {
      const result = validateGuess(['R', 'B', 'R', 'B', 'R'], ['B', 'R', 'B', 'R', 'B'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.PRESENT }, // R exists but wrong position
        { letter: 'B', status: GuessStatus.PRESENT }, // B exists but wrong position
        { letter: 'R', status: GuessStatus.PRESENT }, // R exists but wrong position
        { letter: 'B', status: GuessStatus.PRESENT }, // B exists but wrong position
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's available
      ])
    })

    test('should handle all letters present but wrong positions', () => {
      const result = validateGuess(['R', 'G', 'B', 'Y', 'P'], ['P', 'G', 'B', 'Y', 'R'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.PRESENT }, // R exists in answer
        { letter: 'G', status: GuessStatus.CORRECT }, // G in correct position
        { letter: 'B', status: GuessStatus.CORRECT }, // B in correct position
        { letter: 'Y', status: GuessStatus.CORRECT }, // Y in correct position
        { letter: 'P', status: GuessStatus.PRESENT }, // P exists in answer
      ])
    })

    test('should handle single letter matches', () => {
      const result = validateGuess(['R', 'R', 'R', 'R', 'R'], ['R', 'B', 'B', 'B', 'B'])
      expect(result).toEqual([
        { letter: 'R', status: GuessStatus.CORRECT }, // first R matches
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's
        { letter: 'R', status: GuessStatus.ABSENT }, // no more R's
      ])
    })

    test('should handle edge case with repeated letters in answer', () => {
      const result = validateGuess(['B', 'B', 'B', 'B', 'B'], ['B', 'R', 'B', 'R', 'B'])
      expect(result).toEqual([
        { letter: 'B', status: GuessStatus.CORRECT }, // B in correct position
        { letter: 'B', status: GuessStatus.ABSENT }, // no more B's available
        { letter: 'B', status: GuessStatus.CORRECT }, // B in correct position
        { letter: 'B', status: GuessStatus.ABSENT }, // no more B's available
        { letter: 'B', status: GuessStatus.CORRECT }, // B in correct position
      ])
    })

    test('should handle guess with no letters matching answer', () => {
      const result = validateGuess(['O', 'M', 'C', 'O', 'M'], ['R', 'G', 'B', 'Y', 'P'])
      expect(result).toEqual([
        { letter: 'O', status: GuessStatus.ABSENT }, // O not in answer
        { letter: 'M', status: GuessStatus.ABSENT }, // M not in answer
        { letter: 'C', status: GuessStatus.ABSENT }, // C not in answer
        { letter: 'O', status: GuessStatus.ABSENT }, // O not in answer
        { letter: 'M', status: GuessStatus.ABSENT }, // M not in answer
      ])
    })
  })

  describe('getPuzzleAnswer', ({ test }) => {
    test('should generate correct daily puzzle answer for specific date', async () => {
      const result = await getPuzzleAnswer('§2025-11-11')
      expect(result).toEqual(['M', 'O', 'G', 'B', 'O']) // based on modified algorithm with 50% unique, 50% duplicates
    })

    test('should generate different answers for different dates', async () => {
      const result1 = await getPuzzleAnswer('§2025-11-10')
      const result2 = await getPuzzleAnswer('§2025-11-11')
      expect(result1).not.toEqual(result2)
      expect(result1).toHaveLength(5)
      expect(result2).toHaveLength(5)
    })

    test('should generate consistent answers for same date', async () => {
      const result1 = await getPuzzleAnswer('§2025-11-11')
      const result2 = await getPuzzleAnswer('§2025-11-11')
      expect(result1).toEqual(result2)
    })

    test('should return null for invalid daily puzzle format', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const result = await getPuzzleAnswer('§invalid-date')
      expect(result).toBeNull()
    })

    test('should generate answer even for invalid date numbers', async () => {
      const result = await getPuzzleAnswer('§2025-13-45') // invalid date but valid format
      expect(result).toHaveLength(5)
    })

    test('should return null for custom puzzle when database returns null', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const result = await getPuzzleAnswer('TEST-custom-puzzle-123')
      expect(result).toBeNull()
    })

    test('should handle edge case dates', async () => {
      const result = await getPuzzleAnswer('§2000-01-01')
      expect(result).toHaveLength(5)
    })

    test('should handle future dates', async () => {
      const result = await getPuzzleAnswer('§2030-12-31')
      expect(result).toHaveLength(5)
    })
  })
})
