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
  puzzle_id: string
  tries: number
  solved: boolean
  timestamp: Date
}

export interface PuzzleStats {
  puzzle_id: string // unique puzzle identifier
  totalAttempts: number // total attempts on this puzzle
  totalDevices: number // unique devices who attempted this puzzle
  avgTries: number // average tries for solved attempts
  successRate: number // ratio of solved attempts that succeeded (<=6 tries) (0.0 to 1.0)
  failedAttempts: number // solved attempts that failed (>6 tries)
  triesDistribution: Record<number, number> // distribution of tries for solved attempts
  completionRate: number // ratio of attempts that were solved (0.0 to 1.0)
}

export interface CustomPuzzle {
  id: string
  answer: string
}
