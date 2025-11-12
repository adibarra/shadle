import type { PuzzleAttempt, PuzzleStats } from '../types'
import { sql } from '../initializer'

/**
 * Gets puzzle attempts by device_id.
 * If puzzle_date is provided, filters attempts for that specific date.
 */
export async function getPuzzleAttempts(device_id: string, puzzle_date?: string): Promise<PuzzleAttempt[]> {
  const result = await sql`
    select
      device_id,
      puzzle_date,
      tries,
      timestamp,
      completed
    from puzzle_attempts
    where device_id = ${device_id}
    ${puzzle_date ? sql`and puzzle_date = ${puzzle_date}` : sql``}
    order by puzzle_date desc;
  `
  return result.map(row => ({
    device_id: row.device_id,
    puzzle_date: row.puzzle_date,
    tries: Number(row.tries),
    timestamp: row.timestamp.toISOString(),
    completed: Boolean(row.completed),
  })) as PuzzleAttempt[]
}

/**
 * Gets aggregated statistics from puzzle attempt data using SQL.
 * Returns stats for the specific puzzle date provided.
 */
export async function getPuzzleAttemptAggregates(puzzle_date: string): Promise<PuzzleStats> {
  const result = await sql`
    select
      count(distinct device_id) as total_users,
      count(*) as total_puzzles,
      coalesce(avg(tries) filter (where completed = true), 0) as avg_tries,
      case
        when count(*) filter (where completed = true) > 0
        then count(*) filter (where completed = true and tries <= 6)::float / count(*) filter (where completed = true)
        else 0
      end as success_rate,
      count(*) filter (where completed = true and tries > 6) as failed_puzzles,
      case
        when count(*) > 0
        then count(*) filter (where completed = true)::float / count(*)
        else 0
      end as completion_rate,
      count(*) filter (where completed = true and tries = 1) as tries_1,
      count(*) filter (where completed = true and tries = 2) as tries_2,
      count(*) filter (where completed = true and tries = 3) as tries_3,
      count(*) filter (where completed = true and tries = 4) as tries_4,
      count(*) filter (where completed = true and tries = 5) as tries_5,
      count(*) filter (where completed = true and tries = 6) as tries_6,
      count(*) filter (where completed = true and tries = 7) as tries_7,
      count(*) filter (where completed = true and tries = 8) as tries_8,
      count(*) filter (where completed = true and tries = 9) as tries_9,
      count(*) filter (where completed = true and tries >= 10) as tries_10_plus
    from puzzle_attempts
    where puzzle_date = ${puzzle_date};
  `

  const row = result[0] as any
  const totalUsers = Number(row.total_users)
  const totalAttempts = Number(row.total_puzzles)
  return {
    puzzle_date,
    totalAttempts,
    totalUsers,
    avgTries: Number(row.avg_tries),
    successRate: Number(row.success_rate),
    failedAttempts: Number(row.failed_puzzles),
    completionRate: Number(row.completion_rate),
    triesDistribution: {
      1: Number(row.tries_1),
      2: Number(row.tries_2),
      3: Number(row.tries_3),
      4: Number(row.tries_4),
      5: Number(row.tries_5),
      6: Number(row.tries_6),
      7: Number(row.tries_7),
      8: Number(row.tries_8),
      9: Number(row.tries_9),
      10: Number(row.tries_10_plus),
    },
  }
}

/**
 * Records a puzzle attempt for a specific date, incrementing tries.
 * Creates the history record if it doesn't exist.
 * If the puzzle was already completed, does nothing.
 */
export async function recordPuzzleAttempt(device_id: string, puzzle_date: string, completed?: boolean): Promise<{ tries: number }> {
  const result = await sql`
    insert into puzzle_attempts (device_id, puzzle_date, tries, completed)
    values (${device_id}, ${puzzle_date}, 1, ${completed || false})
    on conflict (device_id, puzzle_date)
    do update set
      tries = puzzle_attempts.tries + 1,
      completed = excluded.completed,
      timestamp = now()
    where puzzle_attempts.completed = false
    returning tries;
  `

  return { tries: result[0].tries }
}
