import type { Platform } from '@shadle/types'

export interface Migration {
  path: string
  migration_id: number
  name: string
}

export interface PushSubscription {
  device_id: string
  platform: Platform
  push_sub: any
}

export interface PuzzleAttempt {
  device_id: string
  puzzle_date: string // YYYY-MM-DD format
  tries: number
  completed: boolean
  timestamp: Date
}

export interface PuzzleStats {
  puzzle_date: string // YYYY-MM-DD format
  totalAttempts: number // total attempts on this puzzle
  totalUsers: number // unique users who attempted this puzzle
  avgTries: number // average tries for completed attempts
  successRate: number // percentage of completed attempts that succeeded (<=6 tries)
  failedAttempts: number // completed attempts that failed (>6 tries)
  triesDistribution: Record<number, number> // distribution of tries for completed attempts
  completionRate: number // percentage of attempts that were completed
}
