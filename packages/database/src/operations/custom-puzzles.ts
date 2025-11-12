import type { CustomPuzzle } from '../types'
import { sql } from '../initializer'

/**
 * Creates a new custom puzzle with the given ID and answer.
 * Returns the created puzzle.
 */
export async function createCustomPuzzle(id: string, answer: string): Promise<CustomPuzzle> {
  const result = await sql`
    insert into custom_puzzles (id, answer)
    values (${id}, ${answer})
    returning id, answer;
  `

  return result[0] as CustomPuzzle
}

/**
 * Gets a custom puzzle by its ID.
 * Returns null if the puzzle doesn't exist.
 */
export async function getCustomPuzzle(id: string): Promise<CustomPuzzle | null> {
  const result = await sql`
    select id, answer
    from custom_puzzles
    where id = ${id};
  `

  return result.length > 0 ? (result[0] as CustomPuzzle) : null
}

/**
 * Gets all custom puzzles.
 * Returns an array of custom puzzles.
 */
export async function getAllCustomPuzzles(): Promise<CustomPuzzle[]> {
  const result = await sql`
    select id, answer
    from custom_puzzles
    order by created_at desc;
  `

  return result.map(row => ({
    id: row.id,
    answer: row.answer,
  })) as CustomPuzzle[]
}
