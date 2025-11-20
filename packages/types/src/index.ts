// =============================================================================
// CORE CONSTANTS & TYPES
// =============================================================================

export type Platform = 'ios' | 'android' | 'web'

/**
 * Valid color letters for puzzle guesses:
 * R: Red, G: Green, B: Blue, Y: Yellow, F: Fuchsia, C: Cyan, W: White, K: Black
 */
export const VALID_COLORS = ['R', 'G', 'B', 'Y', 'F', 'C', 'W', 'K'] as const
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
  totalDevices: number // unique users who attempted this puzzle
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
  solved: boolean
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

export enum GuessStatus {
  CORRECT = 0,
  PRESENT = 1,
  ABSENT = 2,
}

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
    status: GuessStatus
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
