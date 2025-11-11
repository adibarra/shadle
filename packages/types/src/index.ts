export type Platform = 'ios' | 'android' | 'web'

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

export interface PuzzleRecord {
  tries: number
  timestamp: string // iso 8601 date-time string (e.g., "2025-11-10T14:30:00.000Z")
}

export interface PuzzleHistory {
  puzzles: Record<string, PuzzleRecord>
}

export interface CreateHistoryData {
  device_id: string
  progress: PuzzleHistory
}

export interface UpdateHistoryData {
  progress: PuzzleHistory
}

export interface History {
  device_id: string
  progress: PuzzleHistory
  created_at: Date
  updated_at?: Date
}

export interface CreateNotificationData {
  device_id: string
  platform: Platform
  push_sub: PushSubData
}

export interface UpdateNotificationData {
  push_sub?: PushSubData
}

export interface Notification {
  device_id: string
  platform: Platform
  push_sub: PushSubData
  created_at: Date
  updated_at?: Date
}

export interface DailyStats {
  date: string // iso date string (yyyy-mm-dd)
  totalPuzzles: number
  totalUsers: number
  avgTries: number
  successRate: number // puzzles completed in <= 6 tries
  triesDistribution: Record<number, number> // tries 1-10
  dailyActiveUsers: number
  avgPuzzlesPerUser: number
  completionRate: number // puzzles that were actually completed (not abandoned)
}

// api response types
export interface HealthResponse {
  status: 'ok'
  timestamp: string // iso 8601 date-time string
}

export interface ApiError {
  error: string
}
