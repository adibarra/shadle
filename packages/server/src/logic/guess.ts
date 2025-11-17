import type { GuessResponse } from '@shadle/types'
import { getCustomPuzzle } from '@shadle/database'
import { GuessStatus, VALID_COLORS } from '@shadle/types'

/**
 * Get the correct answer for a given puzzle id
 * - §PUZZLE_ID format: daily puzzles (PUZZLE_ID is like §2025-11-11)
 * - PUZZLE_ID format: custom puzzles (checks database)
 * - Returns null if puzzle id format is invalid or not found
 */
export async function getPuzzleAnswer(puzzleId: string): Promise<string | null> {
  const dailyMatch = puzzleId.match(/^§(\d{4})-(\d{2})-(\d{2})$/)
  if (dailyMatch) {
    const [, year, month, day] = dailyMatch
    const seed = Number.parseInt(year) * 10000 + Number.parseInt(month) * 100 + Number.parseInt(day)

    const colors = VALID_COLORS
    let answer = ''
    let tempSeed = seed

    for (let i = 0; i < 5; i++) {
      tempSeed = (tempSeed * 9301 + 49297) % 233280 // simple lcg
      const index = tempSeed % colors.length
      answer += colors[index]
    }

    return answer
  } else {
    const customPuzzle = await getCustomPuzzle(puzzleId)
    return customPuzzle ? customPuzzle.answer : null
  }
}

/**
 * Validate a guess against the correct answer and return feedback
 */
export function validateGuess(guess: string, answer: string): GuessResponse['feedback'] {
  const feedback: GuessResponse['feedback'] = Array.from({ length: 5 })
  const answerLetters = answer.split('')
  const guessLetters = guess.split('')

  const usedAnswerPositions = new Set<number>()
  const usedGuessPositions = new Set<number>()

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      feedback[i] = { letter: guessLetters[i], status: GuessStatus.CORRECT }
      usedAnswerPositions.add(i)
      usedGuessPositions.add(i)
    }
  }

  for (let i = 0; i < 5; i++) {
    if (!usedGuessPositions.has(i)) {
      let found = false
      for (let j = 0; j < 5; j++) {
        if (!usedAnswerPositions.has(j) && guessLetters[i] === answerLetters[j]) {
          feedback[i] = { letter: guessLetters[i], status: GuessStatus.PRESENT }
          usedAnswerPositions.add(j)
          found = true
          break
        }
      }
      if (!found) {
        feedback[i] = { letter: guessLetters[i], status: GuessStatus.ABSENT }
      }
    }
  }

  return feedback
}
