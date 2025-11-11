export type UserModule = () => void | Promise<void>

// re-export from @shadle/types for convenience
export type {
  ApiError,
  DailyStats,
  HealthResponse,
} from '@shadle/types'
