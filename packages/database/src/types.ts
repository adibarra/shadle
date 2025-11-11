import type { Platform } from '@shadle/types'

export interface Migration {
  path: string
  migration_id: number
  name: string
}

export interface History {
  device_id: string
  progress?: any
  created_at: Date
  updated_at?: Date
}

export interface Notification {
  device_id: string
  platform: Platform
  push_sub: any
  created_at: Date
  updated_at?: Date
}
