import { getHistoryAggregates, streamHistoryChunks, upsertDailyStats } from '@shadle/database'
import { getLogger } from '@shadle/logger'
import { mergeDistributions, processChunkForDistribution } from '../utils/stats-utils'

const logger = getLogger('TASKS')

interface GameStats {
  totalGames: number
  totalUsers: number
  avgTries: number
  successRate: number // games completed in <= 6 tries
  triesDistribution: Record<number, number>
  dailyActiveUsers: number
  avgGamesPerUser: number
  completionRate: number // games that were actually completed (not abandoned)
}

/**
 * Generate daily statistics using SQL aggregation + streaming
 *
 * Runs every hour
 */
export default {
  name: 'daily-stats',
  schedule: '0 * * * *', // every hour
  enabled: true,
  run: async () => {
    logger.info('Generating daily statistics...')

    try {
      const startTime = performance.now()

      // phase 1: get basic aggregates via sql
      const sqlStart = performance.now()
      const basicStats = await getHistoryAggregates()
      const sqlTime = performance.now() - sqlStart
      logger.info(`SQL aggregation completed in ${sqlTime.toFixed(2)}ms`)

      // phase 2: stream chunks for tries distribution
      const streamStart = performance.now()
      let triesDistribution: Record<number, number> = {}
      let chunksProcessed = 0

      for await (const chunk of streamHistoryChunks(1000)) {
        const chunkDistribution = processChunkForDistribution(chunk)
        triesDistribution = mergeDistributions(triesDistribution, chunkDistribution)
        chunksProcessed++
      }

      const streamTime = performance.now() - streamStart
      logger.info(`Streaming processing completed in ${streamTime.toFixed(2)}ms (${chunksProcessed} chunks)`)

      // phase 3: combine results
      const finalStats: GameStats = {
        ...basicStats,
        triesDistribution,
        avgGamesPerUser: basicStats.totalUsers > 0 ? basicStats.totalGames / basicStats.totalUsers : 0,
      }

      const totalTime = performance.now() - startTime
      logger.info(`Total stats generation time: ${totalTime.toFixed(2)}ms`)
      logger.info(`Statistics: totalGames=${finalStats.totalGames}, totalUsers=${finalStats.totalUsers}, avgTries=${finalStats.avgTries.toFixed(2)}, successRate=${(finalStats.successRate * 100).toFixed(1)}%, dailyActiveUsers=${finalStats.dailyActiveUsers}, avgGamesPerUser=${finalStats.avgGamesPerUser.toFixed(2)}, completionRate=${(finalStats.completionRate * 100).toFixed(1)}%`)
      logger.info(`Distribution: ${JSON.stringify(finalStats.triesDistribution)}`)

      // store daily stats
      const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd format
      const dailyStats = {
        date: today,
        ...finalStats,
      }

      await upsertDailyStats(dailyStats)
      logger.info(`Daily stats stored for ${today}`)
    } catch (error) {
      logger.error(`Failed to generate statistics: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
}
