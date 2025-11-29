import type { PushSubscription } from '../types'
import { getSql } from '../initializer'

/**
 * Creates or updates a push notification subscription.
 */
export async function upsertPushSubscription(player_id: string, platform: string, push_sub: any): Promise<PushSubscription> {
  const sql = await getSql()
  const result = await sql`
    insert into push_subscriptions (player_id, platform, push_sub)
    values (${player_id}, ${platform}, ${JSON.stringify(push_sub)})
    on conflict (player_id)
    do update set
      platform = excluded.platform,
      push_sub = excluded.push_sub,
      updated_at = now()
    returning
      player_id,
      platform,
      push_sub;
  `
  return {
    ...result[0],
    push_sub: JSON.parse(result[0].push_sub),
  } as PushSubscription
}

/**
 * Gets a push subscription by player_id.
 */
export async function getPushSubscription(player_id: string): Promise<PushSubscription | null> {
  const sql = await getSql()
  const result = await sql`
    select
      player_id,
      platform,
      push_sub
    from push_subscriptions
    where player_id = ${player_id};
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
export async function deletePushSubscription(player_id: string): Promise<void> {
  const sql = await getSql()
  await sql`
    delete from push_subscriptions
    where player_id = ${player_id};
  `
}
