import type postgres from 'postgres'

// credit: https://github.com/porsager/postgres/issues/807#issuecomment-2191994261
export type PendingQuery<T extends postgres.Row = postgres.Row>
  = postgres.PendingQuery<T[]>

// credit: https://github.com/porsager/postgres/issues/807#issuecomment-2191994261
export function join(fragments: (PendingQuery | null)[], joiner: PendingQuery): PendingQuery {
  return fragments.flatMap((x, i) => {
    if (!i) return x

    if (Array.isArray(x)) {
      // already an array, means we're nested, so lets spread it
      return [joiner, ...x]
    }

    return [joiner, x]
  }) as unknown as PendingQuery
}
