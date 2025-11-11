import type { CreateNotificationData } from '@shadle/types'
import type { Notification } from '../types'
import { sql } from '../initializer'

/**
 * Creates or updates a push notification subscription.
 */
export async function upsertNotification(notificationData: CreateNotificationData): Promise<Notification> {
  const result = await sql`
    insert into notifications (device_id, platform, push_sub)
    values (${notificationData.device_id}, ${notificationData.platform}, ${JSON.stringify(notificationData.push_sub)})
    on conflict (device_id)
    do update set
      platform = excluded.platform,
      push_sub = excluded.push_sub,
      updated_at = now()
    returning
      device_id,
      platform,
      push_sub,
      created_at,
      updated_at;
  `
  return {
    ...result[0],
    push_sub: JSON.parse(result[0].push_sub),
  } as Notification
}

/**
 * Gets a notification subscription by device_id.
 */
export async function getNotification(deviceId: string): Promise<Notification | null> {
  const result = await sql`
    select
      device_id,
      platform,
      push_sub,
      created_at,
      updated_at
    from notifications
    where device_id = ${deviceId};
  `
  if (result.length === 0) return null
  return {
    ...result[0],
    push_sub: JSON.parse(result[0].push_sub),
  } as Notification
}

/**
 * Deletes a notification subscription.
 */
export async function deleteNotification(deviceId: string): Promise<void> {
  await sql`
    delete from notifications
    where device_id = ${deviceId};
  `
}
