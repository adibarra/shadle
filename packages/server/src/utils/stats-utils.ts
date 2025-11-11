/**
 * Pure utility functions for stats processing (no database dependencies)
 */

/**
 * Processes a chunk of history records to build tries distribution.
 */
export function processChunkForDistribution(chunk: Array<{
  device_id: string
  progress?: any
  updated_at?: Date
}>): Record<number, number> {
  const distribution: Record<number, number> = {}

  for (const record of chunk) {
    const puzzles = record.progress?.puzzles || {}
    for (const [_puzzleId, puzzleRecord] of Object.entries(puzzles)) {
      const { tries } = puzzleRecord as any
      distribution[tries] = (distribution[tries] || 0) + 1
    }
  }

  return distribution
}

/**
 * Merges two tries distribution objects.
 */
export function mergeDistributions(dist1: Record<number, number>, dist2: Record<number, number>): Record<number, number> {
  const merged = { ...dist1 }
  for (const [tries, count] of Object.entries(dist2)) {
    const triesNum = Number(tries)
    merged[triesNum] = (merged[triesNum] || 0) + count
  }
  return merged
}
