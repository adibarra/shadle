import type { ValidColor } from '@shadle/types'
import config from '@shadle/config'
import { createCustomPuzzle, getAllCustomPuzzles, getCustomPuzzle } from '@shadle/database'
import { expect, testSuite } from 'manten'

export default testSuite(({ describe }) => {
  // use a unique namespace for test data to avoid conflicts
  const TEST_NAMESPACE = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  describe('custom puzzle database operations', ({ test }) => {
    test('should create and retrieve a custom puzzle', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const puzzleId = `${TEST_NAMESPACE}-puzzle-1`
      const answer: ValidColor[] = ['R', 'G', 'B', 'Y', 'P']

      // create the puzzle
      const created = await createCustomPuzzle(puzzleId, answer)
      expect(created.id).toBe(puzzleId)
      expect(created.answer).toEqual(answer)

      // retrieve the puzzle
      const retrieved = await getCustomPuzzle(puzzleId)
      expect(retrieved).not.toBeNull()
      expect(retrieved!.id).toBe(puzzleId)
      expect(retrieved!.answer).toEqual(answer)
    })

    test('should return null for non-existent puzzle', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const result = await getCustomPuzzle(`${TEST_NAMESPACE}-non-existent`)
      expect(result).toBeNull()
    })

    test('should create multiple puzzles and retrieve all', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const puzzles = [
        { id: `${TEST_NAMESPACE}-multi-1`, answer: ['R', 'G', 'B', 'Y', 'P'] as ValidColor[] },
        { id: `${TEST_NAMESPACE}-multi-2`, answer: ['P', 'O', 'M', 'C', 'G'] as ValidColor[] },
        { id: `${TEST_NAMESPACE}-multi-3`, answer: ['C', 'Y', 'R', 'G', 'B'] as ValidColor[] },
      ]

      // create all puzzles
      for (const puzzle of puzzles) {
        await createCustomPuzzle(puzzle.id, puzzle.answer)
      }

      // get all puzzles
      const allPuzzles = await getAllCustomPuzzles()

      // should contain our test puzzles (may contain others from other tests)
      const ourPuzzles = allPuzzles.filter(p => p.id.startsWith(TEST_NAMESPACE))
      expect(ourPuzzles.length).toBeGreaterThanOrEqual(3) // At least the 3 we just created

      // verify each puzzle is present
      for (const puzzle of puzzles) {
        const found = ourPuzzles.find(p => p.id === puzzle.id)
        expect(found).toBeDefined()
        expect(found!.answer).toEqual(puzzle.answer)
      }
    })

    test('should handle duplicate puzzle IDs (should work due to unique constraint)', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const puzzleId = `${TEST_NAMESPACE}-duplicate`
      const answer1: ValidColor[] = ['R', 'G', 'B', 'Y', 'P']
      const answer2: ValidColor[] = ['P', 'O', 'M', 'C', 'G']

      // create first puzzle
      await createCustomPuzzle(puzzleId, answer1)

      // attempt to create duplicate - this should fail
      try {
        await createCustomPuzzle(puzzleId, answer2)
        expect(true).toBe(false) // Should have thrown an error for duplicate ID
      } catch (error) {
        // expected to fail due to unique constraint
        expect(error).toBeDefined()
      }

      // original puzzle should still exist
      const retrieved = await getCustomPuzzle(puzzleId)
      expect(retrieved).not.toBeNull()
      expect(retrieved!.answer).toEqual(answer1)
    })

    test('should handle various answer formats', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const testCases = [
        { id: `${TEST_NAMESPACE}-array-1`, answer: ['R', 'G', 'B', 'Y', 'P'] as ValidColor[] },
        { id: `${TEST_NAMESPACE}-array-2`, answer: ['P', 'O', 'M', 'C', 'G'] as ValidColor[] },
        { id: `${TEST_NAMESPACE}-array-3`, answer: ['C', 'Y', 'R', 'G', 'B'] as ValidColor[] },
      ]

      for (const testCase of testCases) {
        await createCustomPuzzle(testCase.id, testCase.answer)
        const retrieved = await getCustomPuzzle(testCase.id)
        expect(retrieved!.answer).toEqual(testCase.answer)
      }
    })

    test('should return puzzles ordered by creation date (newest first)', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      // create puzzles with a delay to ensure different timestamps
      const puzzle1 = { id: `${TEST_NAMESPACE}-order-1`, answer: ['R', 'G', 'B', 'Y', 'P'] as ValidColor[] }
      const puzzle2 = { id: `${TEST_NAMESPACE}-order-2`, answer: ['P', 'O', 'M', 'C', 'G'] as ValidColor[] }
      const puzzle3 = { id: `${TEST_NAMESPACE}-order-3`, answer: ['C', 'Y', 'R', 'G', 'B'] as ValidColor[] }

      await createCustomPuzzle(puzzle1.id, puzzle1.answer)
      await new Promise(resolve => setTimeout(resolve, 10)) // small delay
      await createCustomPuzzle(puzzle2.id, puzzle2.answer)
      await new Promise(resolve => setTimeout(resolve, 10)) // small delay
      await createCustomPuzzle(puzzle3.id, puzzle3.answer)

      const allPuzzles = await getAllCustomPuzzles()
      const ourPuzzles = allPuzzles.filter(p => p.id.startsWith(`${TEST_NAMESPACE}-order`))

      // should be ordered by creation date descending (newest first)
      expect(ourPuzzles).toHaveLength(3)
      expect(ourPuzzles[0].id).toBe(puzzle3.id) // newest
      expect(ourPuzzles[1].id).toBe(puzzle2.id)
      expect(ourPuzzles[2].id).toBe(puzzle1.id) // oldest
    })
  })
})
