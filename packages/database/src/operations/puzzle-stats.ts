import type { PuzzleStats } from '../types'
import { getSql } from '../initializer'

/**
 * Stores puzzle statistics for a given puzzle id.
 * Upserts if stats for the puzzle id already exist.
 */
export async function upsertPuzzleStats(stats: PuzzleStats): Promise<void> {
  const sql = await getSql()
  await sql`
    insert into puzzle_stats (puzzle_id, stats)
    values (
      ${stats.puzzle_id},
      ${JSON.stringify(stats)}
    )
    on conflict (puzzle_id)
    do update set
      stats = excluded.stats,
      updated_at = now();
  `
}

/**
 * Gets puzzle statistics for a specific puzzle id, or all puzzle statistics if no id provided.
 */
export async function getPuzzleStats(puzzleId?: string): Promise<PuzzleStats[]> {
  const sql = await getSql()
  const result = await sql`
    select
      puzzle_id,
      stats
    from puzzle_stats
    ${puzzleId ? sql`where puzzle_id = ${puzzleId}` : sql``}
    order by puzzle_id;
  `

  return result.map(row => JSON.parse(row.stats)) as PuzzleStats[]
}
