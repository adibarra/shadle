import type { GuessResponse, ValidColor } from '@shadle/types'
import config from '@shadle/config'
import { GuessStatus, VALID_COLORS } from '@shadle/types'

/**
 * Simple string hash function for salting the randomization
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Get the correct answer for a given puzzle id
 * - §PUZZLE_ID format: daily puzzles (PUZZLE_ID is like §2025-11-11)
 * - random:SEED format: random puzzles
 * - Returns null if puzzle id format is invalid
 */
export async function getPuzzleAnswer(puzzleId: string): Promise<ValidColor[] | null> {
  const dailyMatch = puzzleId.match(/^§(\d{4})-(\d{2})-(\d{2})$/)
  if (dailyMatch) {
    const [, year, month, day] = dailyMatch
    const dateSeed = Number.parseInt(year) * 10000 + Number.parseInt(month) * 100 + Number.parseInt(day)
    const seed = dateSeed + hashString(config.PUZZLE_SALT)

    const colors = VALID_COLORS
    const answer: ValidColor[] = []
    let tempSeed = seed

    for (let i = 0; i < 5; i++) {
      tempSeed = (tempSeed * 9301 + 49297) % 233280 // simple lcg
      const index = tempSeed % colors.length
      answer.push(colors[index])
    }

    return answer
  }

  const randomMatch = puzzleId.match(/^random:(.+)$/)
  if (randomMatch) {
    const seedStr = randomMatch[1]
    const seed = hashString(seedStr) + hashString(config.PUZZLE_SALT)

    const colors = VALID_COLORS
    const answer: ValidColor[] = []
    let tempSeed = seed

    for (let i = 0; i < 5; i++) {
      tempSeed = (tempSeed * 9301 + 49297) % 233280
      const index = tempSeed % colors.length
      answer.push(colors[index])
    }

    return answer
  }

  return null
}

/**
 * Validate a guess against the correct answer and return feedback
 */
export function validateGuess(guess: ValidColor[], answer: ValidColor[]): GuessResponse['feedback'] {
  const { feedback: initialFeedback, usedAnswerPositions } = guess.reduce<{
    feedback: GuessResponse['feedback']
    usedAnswerPositions: Set<number>
  }>((acc, letter, index) => {
    if (letter === answer[index]) {
      acc.feedback[index] = { letter, status: GuessStatus.CORRECT }
      acc.usedAnswerPositions.add(index)
    }
    return acc
  }, {
    feedback: Array.from({ length: 5 }),
    usedAnswerPositions: new Set<number>(),
  })

  return guess.map((letter, index) => {
    if (initialFeedback[index]) {
      return initialFeedback[index]
    }

    const unusedAnswerIndex = answer.findIndex((answerLetter, answerIndex) =>
      !usedAnswerPositions.has(answerIndex) && answerLetter === letter,
    )

    if (unusedAnswerIndex !== -1) {
      usedAnswerPositions.add(unusedAnswerIndex)
      return { letter, status: GuessStatus.PRESENT }
    }

    return { letter, status: GuessStatus.ABSENT }
  })
}
