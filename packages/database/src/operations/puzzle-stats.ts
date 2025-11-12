import type { PuzzleStats } from '../types'
import { sql } from '../initializer'

/**
 * Stores puzzle statistics for a given date.
 * Upserts if stats for the date already exist.
 */
export async function upsertPuzzleStats(stats: PuzzleStats): Promise<void> {
  await sql`
    insert into puzzle_stats (date, stats)
    values (
      ${stats.puzzle_date},
      ${JSON.stringify(stats)}
    )
    on conflict (date)
    do update set
      stats = excluded.stats,
      updated_at = now();
  `
}

/**
 * Gets puzzle statistics for a specific date, or all puzzle statistics if no date provided.
 */
export async function getPuzzleStats(date?: string): Promise<PuzzleStats[]> {
  const result = await sql`
    select
      date,
      stats
    from puzzle_stats
    ${date ? sql`where date = ${date}` : sql``}
    order by date;
  `

  return result.map(row => JSON.parse(row.stats)) as PuzzleStats[]
}
