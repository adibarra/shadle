import type { DailyStats } from '@shadle/types'
import { sql } from '../initializer'

/**
 * Stores daily statistics for a given date.
 * Upserts if stats for the date already exist.
 */
export async function upsertDailyStats(stats: DailyStats): Promise<void> {
  const { date, triesDistribution, ...statsWithoutDistribution } = stats

  await sql`
    insert into daily_stats (date, stats, tries_distribution)
    values (
      ${date},
      ${JSON.stringify(statsWithoutDistribution)},
      ${JSON.stringify(triesDistribution)}
    )
    on conflict (date)
    do update set
      stats = excluded.stats,
      tries_distribution = excluded.tries_distribution,
      updated_at = now();
  `
}

/**
 * Gets daily statistics for a specific date.
 */
export async function getDailyStats(date: string): Promise<DailyStats | null> {
  const result = await sql`
    select
      date,
      stats,
      tries_distribution
    from daily_stats
    where date = ${date};
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    date: row.date.toISOString().split('T')[0], // convert to yyyy-mm-dd format
    ...JSON.parse(row.stats),
    triesDistribution: JSON.parse(row.tries_distribution),
  } as DailyStats
}

/**
 * Gets daily statistics for a date range.
 */
export async function getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]> {
  const result = await sql`
    select
      date,
      stats,
      tries_distribution
    from daily_stats
    where date >= ${startDate} and date <= ${endDate}
    order by date;
  `

  return result.map(row => ({
    date: row.date.toISOString().split('T')[0],
    ...JSON.parse(row.stats),
    triesDistribution: JSON.parse(row.tries_distribution),
  })) as DailyStats[]
}

/**
 * Gets the most recent daily statistics.
 */
export async function getLatestDailyStats(): Promise<DailyStats | null> {
  const result = await sql`
    select
      date,
      stats,
      tries_distribution
    from daily_stats
    order by date desc
    limit 1;
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    date: row.date.toISOString().split('T')[0],
    ...JSON.parse(row.stats),
    triesDistribution: JSON.parse(row.tries_distribution),
  } as DailyStats
}
