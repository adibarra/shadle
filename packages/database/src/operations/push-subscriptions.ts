import type { PushSubscription } from '../types'
import { getSql } from '../initializer'

/**
 * Creates or updates a push notification subscription.
 */
export async function upsertPushSubscription(device_id: string, platform: string, push_sub: any): Promise<PushSubscription> {
  const sql = await getSql()
  const result = await sql`
    insert into push_subscriptions (device_id, platform, push_sub)
    values (${device_id}, ${platform}, ${JSON.stringify(push_sub)})
    on conflict (device_id)
    do update set
      platform = excluded.platform,
      push_sub = excluded.push_sub,
      updated_at = now()
    returning
      device_id,
      platform,
      push_sub;
  `
  return {
    ...result[0],
    push_sub: JSON.parse(result[0].push_sub),
  } as PushSubscription
}

/**
 * Gets a push subscription by device_id.
 */
export async function getPushSubscription(device_id: string): Promise<PushSubscription | null> {
  const sql = await getSql()
  const result = await sql`
    select
      device_id,
      platform,
      push_sub
    from push_subscriptions
    where device_id = ${device_id};
  `
  if (result.length === 0) return null
  return {
    ...result[0],
    push_sub: JSON.parse(result[0].push_sub),
  } as PushSubscription
}

/**
 * Deletes a push subscription.
 */
export async function deletePushSubscription(device_id: string): Promise<void> {
  const sql = await getSql()
  await sql`
    delete from push_subscriptions
    where device_id = ${device_id};
  `
}
