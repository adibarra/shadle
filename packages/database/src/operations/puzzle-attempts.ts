import type { PuzzleAttempt, PuzzleStats } from '../types'
import { getSql } from '../initializer'

/**
 * Gets puzzle attempts by player_id.
 * If puzzle_id is provided, filters attempts for that specific puzzle.
 */
export async function getPuzzleAttempts(player_id: string, puzzle_id?: string): Promise<PuzzleAttempt[]> {
  const sql = await getSql()
  const result = await sql`
    select
      player_id,
      puzzle_id,
      tries,
      timestamp,
      completed
    from puzzle_attempts
    where player_id = ${player_id}
    ${puzzle_id ? sql`and puzzle_id = ${puzzle_id}` : sql``}
    order by puzzle_id desc;
  `
  return result.map(row => ({
    player_id: row.player_id,
    puzzle_id: row.puzzle_id,
    tries: Number(row.tries),
    timestamp: row.timestamp.toISOString(),
    solved: Boolean(row.completed),
  })) as PuzzleAttempt[]
}

/**
 * Gets aggregated statistics from puzzle attempt data using SQL.
 * Returns stats for the specific puzzle id provided.
 */
export async function getPuzzleAttemptAggregates(puzzle_id: string): Promise<PuzzleStats> {
  const sql = await getSql()
  const result = await sql`
    select
      count(distinct player_id) as total_players,
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
      count(*) filter (where completed = true and tries = 6) as tries_6
    from puzzle_attempts
    where puzzle_id = ${puzzle_id};
  `

  const row = result[0] as any
  const totalPlayers = Number(row?.total_players ?? 0)
  const totalAttempts = Number(row?.total_puzzles ?? 0)
  return {
    puzzle_id,
    totalAttempts,
    totalPlayers,
    avgTries: Number(row?.avg_tries ?? 0),
    successRate: Number(row?.success_rate ?? 0),
    failedAttempts: Number(row?.failed_puzzles ?? 0),
    completionRate: Number(row?.completion_rate ?? 0),
    triesDistribution: {
      1: Number(row?.tries_1 ?? 0),
      2: Number(row?.tries_2 ?? 0),
      3: Number(row?.tries_3 ?? 0),
      4: Number(row?.tries_4 ?? 0),
      5: Number(row?.tries_5 ?? 0),
      6: Number(row?.tries_6 ?? 0),
    },
  }
}

/**
 * Gets aggregated statistics from puzzle attempt data for all random puzzles.
 */
export async function getRandomPuzzleStats(): Promise<PuzzleStats> {
  const sql = await getSql()
  const result = await sql`
    select
      count(distinct player_id) as total_players,
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
      count(*) filter (where completed = true and tries = 6) as tries_6
    from puzzle_attempts
    where puzzle_id like 'random:%';
  `

  const row = result[0] as any
  const totalPlayers = Number(row?.total_players ?? 0)
  const totalAttempts = Number(row?.total_puzzles ?? 0)
  return {
    puzzle_id: 'random',
    totalAttempts,
    totalPlayers,
    avgTries: Number(row?.avg_tries ?? 0),
    successRate: Number(row?.success_rate ?? 0),
    failedAttempts: Number(row?.failed_puzzles ?? 0),
    completionRate: Number(row?.completion_rate ?? 0),
    triesDistribution: {
      1: Number(row?.tries_1 ?? 0),
      2: Number(row?.tries_2 ?? 0),
      3: Number(row?.tries_3 ?? 0),
      4: Number(row?.tries_4 ?? 0),
      5: Number(row?.tries_5 ?? 0),
      6: Number(row?.tries_6 ?? 0),
    },
  }
}

/**
 * Records a puzzle attempt for a specific puzzle id, incrementing tries.
 * Creates the history record if it doesn't exist.
 * If the puzzle was already completed, does nothing.
 */
export async function recordPuzzleAttempt(player_id: string, puzzle_id: string, completed?: boolean): Promise<PuzzleAttempt> {
  const sql = await getSql()
  const result = await sql`
    with current as (
      select
        player_id,
        puzzle_id,
        tries,
        timestamp,
        completed
      from puzzle_attempts
      where player_id = ${player_id} and puzzle_id = ${puzzle_id}
    ), updated as (
      insert into puzzle_attempts (player_id, puzzle_id, tries, completed)
      values (${player_id}, ${puzzle_id}, 1, ${completed || false})
      on conflict (player_id, puzzle_id)
      do update set
        tries = puzzle_attempts.tries + 1,
        completed = excluded.completed,
        timestamp = now()
      where puzzle_attempts.completed = false
      returning
        player_id,
        puzzle_id,
        tries,
        timestamp,
        completed
    )
    select
      player_id,
      puzzle_id,
      tries,
      timestamp,
      completed
    from updated
    union all
    select
      player_id,
      puzzle_id,
      tries,
      timestamp,
      completed
    from current
    where not exists (select 1 from updated);
  `

  const row = result[0]
  return {
    player_id: row.player_id,
    puzzle_id: row.puzzle_id,
    tries: Number(row.tries),
    timestamp: row.timestamp.toISOString(),
    solved: Boolean(row.completed),
  }
}
