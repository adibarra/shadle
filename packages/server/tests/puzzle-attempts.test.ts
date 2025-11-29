import config from '@shadle/config'
import { getPuzzleAttemptAggregates, getPuzzleAttempts, recordPuzzleAttempt } from '@shadle/database'
import { expect, testSuite } from 'manten'

export default testSuite(({ describe }) => {
  // use a unique namespace for test data to avoid conflicts
  const TEST_NAMESPACE = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  describe('puzzle attempt database operations', ({ test }) => {
    test('should record and retrieve puzzle attempts', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const playerId = `${TEST_NAMESPACE}-player-1`
      const puzzleId = `${TEST_NAMESPACE}-puzzle-1`

      // record first attempt
      const result1 = await recordPuzzleAttempt(playerId, puzzleId, false)
      expect(result1.tries).toBe(1)

      // record second attempt
      const result2 = await recordPuzzleAttempt(playerId, puzzleId, false)
      expect(result2.tries).toBe(2)

      // record third attempt as completed
      const result3 = await recordPuzzleAttempt(playerId, puzzleId, true)
      expect(result3.tries).toBe(3)

      // retrieve attempts - should return 1 record with final state
      const attempts = await getPuzzleAttempts(playerId, puzzleId)
      expect(attempts).toHaveLength(1)
      expect(attempts[0].player_id).toBe(playerId)
      expect(attempts[0].puzzle_id).toBe(puzzleId)
      expect(attempts[0].tries).toBe(3)
      expect(attempts[0].solved).toBe(true)
    })

    test('should handle multiple players and puzzles', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const player1 = `${TEST_NAMESPACE}-player-multi-1`
      const player2 = `${TEST_NAMESPACE}-player-multi-2`
      const puzzle1 = `${TEST_NAMESPACE}-puzzle-multi-1`
      const puzzle2 = `${TEST_NAMESPACE}-puzzle-multi-2`

      // player 1 attempts puzzle 1
      await recordPuzzleAttempt(player1, puzzle1, false)
      await recordPuzzleAttempt(player1, puzzle1, true)

      // player 2 attempts puzzle 1
      await recordPuzzleAttempt(player2, puzzle1, false)
      await recordPuzzleAttempt(player2, puzzle1, false)
      await recordPuzzleAttempt(player2, puzzle1, true)

      // player 1 attempts puzzle 2
      await recordPuzzleAttempt(player1, puzzle2, true)

      // check player 1's attempts for puzzle 1
      const player1Puzzle1 = await getPuzzleAttempts(player1, puzzle1)
      expect(player1Puzzle1).toHaveLength(1)
      expect(player1Puzzle1[0].player_id).toBe(player1)
      expect(player1Puzzle1[0].puzzle_id).toBe(puzzle1)
      expect(player1Puzzle1[0].tries).toBe(2)
      expect(player1Puzzle1[0].solved).toBe(true)

      // check player 2's attempts for puzzle 1
      const player2Puzzle1 = await getPuzzleAttempts(player2, puzzle1)
      expect(player2Puzzle1).toHaveLength(1)
      expect(player2Puzzle1[0].player_id).toBe(player2)
      expect(player2Puzzle1[0].puzzle_id).toBe(puzzle1)
      expect(player2Puzzle1[0].tries).toBe(3)
      expect(player2Puzzle1[0].solved).toBe(true)

      // check player 1's attempts for all puzzles
      const player1All = await getPuzzleAttempts(player1)
      expect(player1All).toHaveLength(2) // 1 for puzzle1 + 1 for puzzle2
      expect(player1All.map(a => a.puzzle_id).sort()).toEqual([puzzle1, puzzle2].sort())
    })

    test('should not increment tries after completion', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const playerId = `${TEST_NAMESPACE}-player-complete`
      const puzzleId = `${TEST_NAMESPACE}-puzzle-complete`

      // complete the puzzle
      const result1 = await recordPuzzleAttempt(playerId, puzzleId, true)
      expect(result1.tries).toBe(1)

      // try to record another attempt - should not increment
      const result2 = await recordPuzzleAttempt(playerId, puzzleId, false)
      expect(result2.tries).toBe(1) // should still be 1

      // check attempts
      const attempts = await getPuzzleAttempts(playerId, puzzleId)
      expect(attempts).toHaveLength(1) // only the first attempt should be recorded
      expect(attempts[0].solved).toBe(true)
    })

    test('should aggregate statistics correctly', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const puzzleId = `${TEST_NAMESPACE}-puzzle-stats`

      // create multiple attempts with different outcomes
      const players = [
        { id: `${TEST_NAMESPACE}-stats-player-1`, tries: 3, solved: true },
        { id: `${TEST_NAMESPACE}-stats-player-2`, tries: 5, solved: true },
        { id: `${TEST_NAMESPACE}-stats-player-3`, tries: 7, solved: true }, // solved but failed (>6 tries)
        { id: `${TEST_NAMESPACE}-stats-player-4`, tries: 2, solved: true },
        { id: `${TEST_NAMESPACE}-stats-player-5`, tries: 4, solved: true },
      ]

      // record attempts
      for (const player of players) {
        for (let i = 1; i <= player.tries; i++) {
          const isLastAttempt = i === player.tries
          const solved = isLastAttempt ? player.solved : false
          await recordPuzzleAttempt(player.id, puzzleId, solved)
        }
      }

      // get aggregates
      const stats = await getPuzzleAttemptAggregates(puzzleId)

      expect(stats.puzzle_id).toBe(puzzleId)
      expect(stats.totalAttempts).toBe(5) // 5 players
      expect(stats.totalPlayers).toBe(5) // 5 unique players
      expect(stats.successRate).toBe(0.8) // 4/5 solved within 6 tries
      expect(stats.failedAttempts).toBe(1) // 1 solved but failed (>6 tries)
      expect(stats.completionRate).toBe(1.0) // 5/5 solved

      // check try distribution
      expect(stats.triesDistribution[2]).toBe(1) // 1 player with 2 tries
      expect(stats.triesDistribution[3]).toBe(1) // 1 player with 3 tries
      expect(stats.triesDistribution[4]).toBe(1) // 1 player with 4 tries
      expect(stats.triesDistribution[5]).toBe(1) // 1 player with 5 tries
    })

    test('should return empty array for non-existent attempts', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const attempts = await getPuzzleAttempts('non-existent-player')
      expect(attempts).toEqual([])
    })

    test('should return empty stats for puzzle with no attempts', async ({ skip }) => {
      if (config.IS_CI) {
        skip('Skipping database tests in CI')
      }

      const stats = await getPuzzleAttemptAggregates('empty-puzzle')
      expect(stats.totalAttempts).toBe(0)
      expect(stats.totalPlayers).toBe(0)
      expect(stats.avgTries).toBe(0)
      expect(stats.successRate).toBe(0)
      expect(stats.completionRate).toBe(0)
    })
  })
})
