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

export interface GameRecord {
  tries: number
  timestamp: string // iso 8601 date-time string (e.g., "2025-11-10T14:30:00.000Z")
}

export interface GameHistory {
  games: Record<string, GameRecord>
}

export interface CreateHistoryData {
  device_id: string
  progress: GameHistory
}

export interface UpdateHistoryData {
  progress: GameHistory
}

export interface History {
  device_id: string
  progress: GameHistory
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
  totalGames: number
  totalUsers: number
  avgTries: number
  successRate: number // games completed in <= 6 tries
  triesDistribution: Record<number, number> // tries 1-10
  dailyActiveUsers: number
  avgGamesPerUser: number
  completionRate: number // games that were actually completed (not abandoned)
}

// api response types
export interface HealthResponse {
  status: 'ok'
  timestamp: string // iso 8601 date-time string
}

export interface ApiError {
  error: string
}
