import type { CreateHistoryData, UpdateHistoryData } from '@shadle/types'
import type { History } from '../types'
import { sql } from '../initializer'

/**
 * Creates or updates puzzle history for a device.
 */
export async function upsertHistory(historyData: CreateHistoryData): Promise<History> {
  const result = await sql`
    insert into history (device_id, progress)
    values (${historyData.device_id}, ${JSON.stringify(historyData.progress)})
    on conflict (device_id)
    do update set
      progress = excluded.progress,
      updated_at = now()
    returning
      device_id,
      progress,
      created_at,
      updated_at;
  `
  return {
    ...result[0],
    progress: JSON.parse(result[0].progress),
  } as History
}

/**
 * Gets puzzle history by device_id.
 */
export async function getHistory(deviceId: string): Promise<History | null> {
  const result = await sql`
    select
      device_id,
      progress,
      created_at,
      updated_at
    from history
    where device_id = ${deviceId};
  `
  if (result.length === 0) return null
  return {
    ...result[0],
    progress: JSON.parse(result[0].progress),
  } as History
}

/**
 * Updates puzzle history progress.
 */
export async function updateHistory(deviceId: string, updateData: UpdateHistoryData): Promise<History | null> {
  const result = await sql`
    update history
    set
      progress = ${JSON.stringify(updateData.progress)},
      updated_at = now()
    where device_id = ${deviceId}
    returning
      device_id,
      progress,
      created_at,
      updated_at;
  `
  if (result.length === 0) return null
  return {
    ...result[0],
    progress: JSON.parse(result[0].progress),
  } as History
}

/**
 * Deletes puzzle history for a device.
 */
export async function deleteHistory(deviceId: string): Promise<void> {
  await sql`
    delete from history
    where device_id = ${deviceId};
  `
}

/**
 * Gets all puzzle history records for statistics.
 */
export async function getAllHistory(): Promise<History[]> {
  const result = await sql`
    select
      device_id,
      progress,
      created_at,
      updated_at
    from history;
  `
  return result.map(row => ({
    ...row,
    progress: JSON.parse(row.progress),
  })) as History[]
}

/**
 * Gets aggregated statistics from history data using SQL.
 */
export async function getHistoryAggregates(): Promise<{
  totalUsers: number
  totalPuzzles: number
  avgTries: number
  successRate: number
  dailyActiveUsers: number
  completionRate: number
}> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const result = await sql`
    WITH user_puzzle_stats AS (
      SELECT
        h.device_id,
        h.updated_at,
        jsonb_object_length(h.progress->'puzzles') as puzzle_count,
        COUNT(CASE WHEN (puzzle_data->>'tries')::int <= 6 THEN 1 END) as completed_puzzles,
        COUNT(CASE WHEN (puzzle_data->>'tries')::int <= 6 THEN 1 END) as successful_puzzles,
        AVG((puzzle_data->>'tries')::int) FILTER (WHERE (puzzle_data->>'tries')::int <= 6) as avg_completed_tries
      FROM history h,
      LATERAL jsonb_object_keys(h.progress->'puzzles') as puzzle_key,
      LATERAL jsonb_extract_path(h.progress->'puzzles', puzzle_key) as puzzle_data
      GROUP BY h.device_id, h.updated_at
    )
    SELECT
      COUNT(*) as total_users,
      COALESCE(SUM(puzzle_count), 0) as total_puzzles,
      COALESCE(AVG(avg_completed_tries), 0) as avg_tries,
      CASE
        WHEN SUM(completed_puzzles) > 0
        THEN SUM(successful_puzzles)::float / SUM(completed_puzzles)
        ELSE 0
      END as success_rate,
      COUNT(CASE WHEN updated_at >= ${today.toISOString()} THEN 1 END) as daily_active_users,
      CASE
        WHEN SUM(puzzle_count) > 0
        THEN SUM(completed_puzzles)::float / SUM(puzzle_count)
        ELSE 0
      END as completion_rate
    FROM user_puzzle_stats;
  `

  const row = result[0] as any
  return {
    totalUsers: Number(row.total_users),
    totalPuzzles: Number(row.total_puzzles),
    avgTries: Number(row.avg_tries),
    successRate: Number(row.success_rate),
    dailyActiveUsers: Number(row.daily_active_users),
    completionRate: Number(row.completion_rate),
  }
}

/**
 * Streams history records in chunks for processing complex statistics.
 */
export async function* streamHistoryChunks(chunkSize: number = 1000): AsyncGenerator<Array<{
  device_id: string
  progress: any
  updated_at?: Date
}>, void, unknown> {
  let offset = 0

  while (true) {
    const result = await sql`
      SELECT
        device_id,
        progress,
        updated_at
      FROM history
      ORDER BY device_id
      LIMIT ${chunkSize}
      OFFSET ${offset};
    `

    if (result.length === 0) break

    yield result.map(row => ({
      ...row,
      progress: JSON.parse(row.progress),
    })) as Array<{
      device_id: string
      progress: any
      updated_at?: Date
    }>

    offset += chunkSize
  }
}

/**
 * Records a puzzle attempt for a specific date, incrementing tries.
 * Creates the history record if it doesn't exist.
 */
export async function recordPuzzleAttempt(deviceId: string, date: string, completed?: boolean): Promise<History> {
  // First, get current history
  const currentHistory = await getHistory(deviceId)

  const puzzles = currentHistory?.progress.puzzles || {}
  const puzzleKey = date

  // Get current tries for this date, default to 0
  const currentTries = puzzles[puzzleKey]?.tries || 0
  const newTries = currentTries + 1

  // If completed is specified, we might want to set tries to 6 (completed) or keep incrementing
  // For now, just increment tries. The "completed" flag might be used for analytics
  const finalTries = completed && newTries > 6 ? 6 : newTries

  // Update the puzzles object
  puzzles[puzzleKey] = {
    tries: finalTries,
    timestamp: new Date().toISOString(),
  }

  // Upsert the history
  const historyData: CreateHistoryData = {
    device_id: deviceId,
    progress: { puzzles },
  }

  return await upsertHistory(historyData)
}
