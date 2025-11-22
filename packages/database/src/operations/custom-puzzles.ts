import type { ValidColor } from '@shadle/types'
import type { CustomPuzzle } from '../types'
import { getSql } from '../initializer'

/**
 * Creates a new custom puzzle with the given ID and answer.
 * Returns the created puzzle.
 */
export async function createCustomPuzzle(id: string, answer: ValidColor[]): Promise<CustomPuzzle> {
  const sql = await getSql()
  const result = await sql`
    insert into custom_puzzles (id, answer)
    values (${id}, ${JSON.stringify(answer)})
    returning id, answer;
  `

  return {
    id: result[0].id,
    answer: JSON.parse(result[0].answer),
  } as CustomPuzzle
}

/**
 * Gets a custom puzzle by its ID.
 * Returns null if the puzzle doesn't exist.
 */
export async function getCustomPuzzle(id: string): Promise<CustomPuzzle | null> {
  const sql = await getSql()
  const result = await sql`
    select id, answer
    from custom_puzzles
    where id = ${id};
  `

  return result.length > 0
    ? {
        id: result[0].id,
        answer: JSON.parse(result[0].answer),
      }
    : null
}

/**
 * Gets all custom puzzles.
 * Returns an array of custom puzzles.
 */
export async function getAllCustomPuzzles(): Promise<CustomPuzzle[]> {
  const sql = await getSql()
  const result = await sql`
    select id, answer
    from custom_puzzles
    order by created_at desc;
  `

  return result.map(row => ({
    id: row.id,
    answer: JSON.parse(row.answer),
  }))
}

/**
 * Deletes a custom puzzle by its ID.
 * Returns true if the puzzle was deleted, false if it didn't exist.
 */
export async function deleteCustomPuzzle(id: string): Promise<boolean> {
  const sql = await getSql()
  const result = await sql`
    delete from custom_puzzles
    where id = ${id}
    returning id;
  `

  return result.length > 0
}
