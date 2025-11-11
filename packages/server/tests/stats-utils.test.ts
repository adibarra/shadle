import { expect, testSuite } from 'manten'
import { mergeDistributions, processChunkForDistribution } from '../src/utils/stats-utils.js'

export default testSuite(({ describe }) => {
  describe('processChunkForDistribution', ({ test }) => {
    test('should count tries correctly for multiple users and puzzles', () => {
      const mockChunk = [
        {
          device_id: 'user1',
          progress: {
            puzzles: {
              puzzle1: { tries: 3, timestamp: '2025-01-01T00:00:00.000Z' },
              puzzle2: { tries: 5, timestamp: '2025-01-02T00:00:00.000Z' },
            },
          },
          updated_at: new Date(),
        },
        {
          device_id: 'user2',
          progress: {
            puzzles: {
              puzzle3: { tries: 3, timestamp: '2025-01-03T00:00:00.000Z' },
              puzzle4: { tries: 7, timestamp: '2025-01-04T00:00:00.000Z' },
            },
          },
          updated_at: new Date(),
        },
      ]

      const result = processChunkForDistribution(mockChunk)

      expect(result).toEqual({
        3: 2, // two puzzles with 3 tries
        5: 1, // one puzzle with 5 tries
        7: 1, // one puzzle with 7 tries
      })
    })

    test('should handle empty chunk', () => {
      const result = processChunkForDistribution([])
      expect(result).toEqual({})
    })

    test('should accumulate counts for same tries values', () => {
      const mockChunk = [
        {
          device_id: 'user1',
          progress: {
            puzzles: {
              puzzle1: { tries: 3, timestamp: '2025-01-01T00:00:00.000Z' },
              puzzle2: { tries: 3, timestamp: '2025-01-02T00:00:00.000Z' },
              puzzle3: { tries: 3, timestamp: '2025-01-03T00:00:00.000Z' },
            },
          },
        },
        {
          device_id: 'user2',
          progress: {
            puzzles: {
              puzzle4: { tries: 3, timestamp: '2025-01-04T00:00:00.000Z' },
            },
          },
        },
      ]

      const result = processChunkForDistribution(mockChunk)
      expect(result).toEqual({ 3: 4 }) // 3 puzzles from user1 + 1 puzzle from user2
    })

    test('should handle large tries values', () => {
      const mockChunk = [
        {
          device_id: 'user1',
          progress: {
            puzzles: {
              puzzle1: { tries: 10, timestamp: '2025-01-01T00:00:00.000Z' },
              puzzle2: { tries: 25, timestamp: '2025-01-02T00:00:00.000Z' },
              puzzle3: { tries: 50, timestamp: '2025-01-03T00:00:00.000Z' },
            },
          },
        },
      ]

      const result = processChunkForDistribution(mockChunk)
      expect(result).toEqual({ 10: 1, 25: 1, 50: 1 })
    })
  })

  describe('mergeDistributions', ({ test }) => {
    test('should combine distributions correctly', () => {
      const dist1 = { 1: 5, 2: 3, 3: 1 }
      const dist2 = { 2: 2, 3: 4, 4: 1 }

      const result = mergeDistributions(dist1, dist2)

      expect(result).toEqual({
        1: 5,
        2: 5, // 3 + 2
        3: 5, // 1 + 4
        4: 1,
      })
    })

    test('should handle empty distributions', () => {
      const dist1 = { 1: 5, 2: 3 }
      const dist2 = {}

      const result = mergeDistributions(dist1, dist2)

      expect(result).toEqual({ 1: 5, 2: 3 })
    })

    test('should handle non-overlapping keys', () => {
      const dist1 = { 1: 5, 2: 3 }
      const dist2 = { 3: 2, 4: 1 }

      const result = mergeDistributions(dist1, dist2)

      expect(result).toEqual({ 1: 5, 2: 3, 3: 2, 4: 1 })
    })

    test('should not mutate input distributions', () => {
      const dist1 = { 1: 5, 2: 3 }
      const dist2 = { 2: 2, 3: 4 }
      const dist1Original = { ...dist1 }
      const dist2Original = { ...dist2 }

      mergeDistributions(dist1, dist2)

      expect(dist1).toEqual(dist1Original)
      expect(dist2).toEqual(dist2Original)
    })
  })
})
