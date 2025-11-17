import config from '@shadle/config'
import { createCustomPuzzle, getAllCustomPuzzles, getCustomPuzzle } from '@shadle/database'
import { expect, testSuite } from 'manten'

export default testSuite(({ describe }) => {
  if (config.IS_CI) return // Skip DB tests in CI

  // use a unique namespace for test data to avoid conflicts
  const TEST_NAMESPACE = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  describe('custom puzzle database operations', ({ test }) => {
    test('should create and retrieve a custom puzzle', async () => {
      const puzzleId = `${TEST_NAMESPACE}-puzzle-1`
      const answer = 'RGBYP'

      // create the puzzle
      const created = await createCustomPuzzle(puzzleId, answer)
      expect(created.id).toBe(puzzleId)
      expect(created.answer).toBe(answer)

      // retrieve the puzzle
      const retrieved = await getCustomPuzzle(puzzleId)
      expect(retrieved).not.toBeNull()
      expect(retrieved!.id).toBe(puzzleId)
      expect(retrieved!.answer).toBe(answer)
    })

    test('should return null for non-existent puzzle', async () => {
      const result = await getCustomPuzzle(`${TEST_NAMESPACE}-non-existent`)
      expect(result).toBeNull()
    })

    test('should create multiple puzzles and retrieve all', async () => {
      const puzzles = [
        { id: `${TEST_NAMESPACE}-multi-1`, answer: 'RGBYP' },
        { id: `${TEST_NAMESPACE}-multi-2`, answer: 'POWKG' },
        { id: `${TEST_NAMESPACE}-multi-3`, answer: 'KYRGB' },
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
        expect(found!.answer).toBe(puzzle.answer)
      }
    })

    test('should handle duplicate puzzle IDs (should work due to unique constraint)', async () => {
      const puzzleId = `${TEST_NAMESPACE}-duplicate`
      const answer1 = 'RGBYP'
      const answer2 = 'POWKG'

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
      expect(retrieved!.answer).toBe(answer1)
    })

    test('should handle various answer formats', async () => {
      const testCases = [
        { id: `${TEST_NAMESPACE}-upper`, answer: 'RGBYP' },
        { id: `${TEST_NAMESPACE}-lower`, answer: 'rgbyp' },
        { id: `${TEST_NAMESPACE}-mixed`, answer: 'RgbYP' },
      ]

      for (const testCase of testCases) {
        await createCustomPuzzle(testCase.id, testCase.answer)
        const retrieved = await getCustomPuzzle(testCase.id)
        expect(retrieved!.answer).toBe(testCase.answer)
      }
    })

    test('should return puzzles ordered by creation date (newest first)', async () => {
      // create puzzles with a delay to ensure different timestamps
      const puzzle1 = { id: `${TEST_NAMESPACE}-order-1`, answer: 'RGBYP' }
      const puzzle2 = { id: `${TEST_NAMESPACE}-order-2`, answer: 'POWKG' }
      const puzzle3 = { id: `${TEST_NAMESPACE}-order-3`, answer: 'KYRGB' }

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
