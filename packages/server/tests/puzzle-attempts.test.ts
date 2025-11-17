import { getPuzzleAttemptAggregates, getPuzzleAttempts, recordPuzzleAttempt } from '@shadle/database'
import { expect, testSuite } from 'manten'
import { skipIfCI } from './utils'

export default testSuite(({ describe }) => {
  // use a unique namespace for test data to avoid conflicts
  const TEST_NAMESPACE = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  describe('puzzle attempt database operations', ({ test }) => {
    test('should record and retrieve puzzle attempts', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const deviceId = `${TEST_NAMESPACE}-device-1`
      const puzzleId = `${TEST_NAMESPACE}-puzzle-1`

      // record first attempt
      const result1 = await recordPuzzleAttempt(deviceId, puzzleId, false)
      expect(result1.tries).toBe(1)

      // record second attempt
      const result2 = await recordPuzzleAttempt(deviceId, puzzleId, false)
      expect(result2.tries).toBe(2)

      // record third attempt as completed
      const result3 = await recordPuzzleAttempt(deviceId, puzzleId, true)
      expect(result3.tries).toBe(3)

      // retrieve attempts - should return 1 record with final state
      const attempts = await getPuzzleAttempts(deviceId, puzzleId)
      expect(attempts).toHaveLength(1)
      expect(attempts[0].device_id).toBe(deviceId)
      expect(attempts[0].puzzle_id).toBe(puzzleId)
      expect(attempts[0].tries).toBe(3)
      expect(attempts[0].solved).toBe(true)
    })

    test('should handle multiple devices and puzzles', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const device1 = `${TEST_NAMESPACE}-device-multi-1`
      const device2 = `${TEST_NAMESPACE}-device-multi-2`
      const puzzle1 = `${TEST_NAMESPACE}-puzzle-multi-1`
      const puzzle2 = `${TEST_NAMESPACE}-puzzle-multi-2`

      // device 1 attempts puzzle 1
      await recordPuzzleAttempt(device1, puzzle1, false)
      await recordPuzzleAttempt(device1, puzzle1, true)

      // device 2 attempts puzzle 1
      await recordPuzzleAttempt(device2, puzzle1, false)
      await recordPuzzleAttempt(device2, puzzle1, false)
      await recordPuzzleAttempt(device2, puzzle1, true)

      // device 1 attempts puzzle 2
      await recordPuzzleAttempt(device1, puzzle2, true)

      // check device 1's attempts for puzzle 1
      const device1Puzzle1 = await getPuzzleAttempts(device1, puzzle1)
      expect(device1Puzzle1).toHaveLength(1)
      expect(device1Puzzle1[0].device_id).toBe(device1)
      expect(device1Puzzle1[0].puzzle_id).toBe(puzzle1)
      expect(device1Puzzle1[0].tries).toBe(2)
      expect(device1Puzzle1[0].solved).toBe(true)

      // check device 2's attempts for puzzle 1
      const device2Puzzle1 = await getPuzzleAttempts(device2, puzzle1)
      expect(device2Puzzle1).toHaveLength(1)
      expect(device2Puzzle1[0].device_id).toBe(device2)
      expect(device2Puzzle1[0].puzzle_id).toBe(puzzle1)
      expect(device2Puzzle1[0].tries).toBe(3)
      expect(device2Puzzle1[0].solved).toBe(true)

      // check device 1's attempts for all puzzles
      const device1All = await getPuzzleAttempts(device1)
      expect(device1All).toHaveLength(2) // 1 for puzzle1 + 1 for puzzle2
      expect(device1All.map(a => a.puzzle_id).sort()).toEqual([puzzle1, puzzle2].sort())
    })

    test('should not increment tries after completion', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const deviceId = `${TEST_NAMESPACE}-device-complete`
      const puzzleId = `${TEST_NAMESPACE}-puzzle-complete`

      // complete the puzzle
      const result1 = await recordPuzzleAttempt(deviceId, puzzleId, true)
      expect(result1.tries).toBe(1)

      // try to record another attempt - should not increment
      const result2 = await recordPuzzleAttempt(deviceId, puzzleId, false)
      expect(result2.tries).toBe(1) // should still be 1

      // check attempts
      const attempts = await getPuzzleAttempts(deviceId, puzzleId)
      expect(attempts).toHaveLength(1) // only the first attempt should be recorded
      expect(attempts[0].solved).toBe(true)
    })

    test('should aggregate statistics correctly', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const puzzleId = `${TEST_NAMESPACE}-puzzle-stats`

      // create multiple attempts with different outcomes
      const devices = [
        { id: `${TEST_NAMESPACE}-stats-device-1`, tries: 3, solved: true },
        { id: `${TEST_NAMESPACE}-stats-device-2`, tries: 5, solved: true },
        { id: `${TEST_NAMESPACE}-stats-device-3`, tries: 7, solved: true }, // solved but failed (>6 tries)
        { id: `${TEST_NAMESPACE}-stats-device-4`, tries: 2, solved: true },
        { id: `${TEST_NAMESPACE}-stats-device-5`, tries: 4, solved: true },
      ]

      // record attempts
      for (const device of devices) {
        for (let i = 1; i <= device.tries; i++) {
          const isLastAttempt = i === device.tries
          const solved = isLastAttempt ? device.solved : false
          await recordPuzzleAttempt(device.id, puzzleId, solved)
        }
      }

      // get aggregates
      const stats = await getPuzzleAttemptAggregates(puzzleId)

      expect(stats.puzzle_id).toBe(puzzleId)
      expect(stats.totalAttempts).toBe(5) // 5 devices
      expect(stats.totalDevices).toBe(5) // 5 unique devices
      expect(stats.successRate).toBe(0.8) // 4/5 solved within 6 tries
      expect(stats.failedAttempts).toBe(1) // 1 solved but failed (>6 tries)
      expect(stats.completionRate).toBe(1.0) // 5/5 solved

      // check try distribution
      expect(stats.triesDistribution[2]).toBe(1) // 1 device with 2 tries
      expect(stats.triesDistribution[3]).toBe(1) // 1 device with 3 tries
      expect(stats.triesDistribution[4]).toBe(1) // 1 device with 4 tries
      expect(stats.triesDistribution[5]).toBe(1) // 1 device with 5 tries
      expect(stats.triesDistribution[7]).toBe(1) // 1 device with 7 tries (failed)
    })

    test('should return empty array for non-existent attempts', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const attempts = await getPuzzleAttempts('non-existent-device')
      expect(attempts).toEqual([])
    })

    test('should return empty stats for puzzle with no attempts', async () => {
      const skip = skipIfCI()
      if (skip) return skip

      const stats = await getPuzzleAttemptAggregates('empty-puzzle')
      expect(stats.totalAttempts).toBe(0)
      expect(stats.totalDevices).toBe(0)
      expect(stats.avgTries).toBe(0)
      expect(stats.successRate).toBe(0)
      expect(stats.completionRate).toBe(0)
    })
  })
})
