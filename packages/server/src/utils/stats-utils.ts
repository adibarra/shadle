import type { PuzzleAttempt } from '@shadle/database'

/**
 * Pure utility functions for stats processing (no database dependencies)
 */

/**
 * Processes a chunk of history records to build tries distribution.
 */
export function processChunkForDistribution(chunk: PuzzleAttempt[]): Record<number, number> {
  const distribution: Record<number, number> = {}

  for (const attempt of chunk) {
    distribution[attempt.tries] = (distribution[attempt.tries] || 0) + 1
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
