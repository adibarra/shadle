// =============================================================================
// CORE CONSTANTS & TYPES
// =============================================================================

export type Platform = 'ios' | 'android' | 'web'

/**
 * Valid color letters for puzzle guesses
 */
export const VALID_COLORS = ['R', 'G', 'B', 'Y', 'P', 'O', 'W', 'K'] as const
export type ValidColor = typeof VALID_COLORS[number]

/**
 * Pre-compiled regex for validating color guesses
 */
export const VALID_COLORS_REGEX = new RegExp(`^[${VALID_COLORS.join('')}]+$`)

// =============================================================================
// PUSH NOTIFICATION TYPES
// =============================================================================

export interface NativePushSubscription {
  token: string
}

export interface WebPushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export type PushSubData = NativePushSubscription | WebPushSubscription

// =============================================================================
// DATA MODELS
// =============================================================================

export interface StatsResponse {
  puzzleId: string // unique puzzle identifier
  totalAttempts: number // total attempts on this puzzle
  totalUsers: number // unique users who attempted this puzzle
  avgTries: number // average tries for completed attempts
  successRate: number // percentage of completed attempts that succeeded (<=6 tries)
  failedAttempts: number // completed attempts that failed (>6 tries)
  triesDistribution: Record<number, number> // distribution of tries for completed attempts
  completionRate: number // percentage of attempts that were completed
}

export interface PuzzleAttemptResponse {
  device_id: string
  puzzle_id: string
  tries: number
  timestamp: Date
  completed: boolean
}

// =============================================================================
// API INFRASTRUCTURE TYPES
// =============================================================================

export interface ApiError {
  error: string
}

export interface HealthResponse {
  status: 'ok'
}

// =============================================================================
// GUESS API TYPES
// =============================================================================

export interface GuessRequest {
  deviceId: string
  puzzleId: string
  guess: string
}

export interface GuessResponse {
  tries: number
  correct: boolean
  feedback: Array<{
    letter: string
    status: 'correct' | 'present' | 'absent'
  }>
}

// =============================================================================
// HISTORY API TYPES
// =============================================================================

export interface HistoryRequest {
  deviceId: string
  puzzleId?: string
}

export interface HistoryResponse {
  attempts: PuzzleAttemptResponse[]
}

// =============================================================================
// STATS API TYPES
// =============================================================================

export interface StatsRequest {
  puzzleId: string
}
