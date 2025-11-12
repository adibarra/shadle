import type { GuessResponse } from '@shadle/types'
import { VALID_COLORS } from '@shadle/types'

/**
 * Generate the correct answer for a given puzzle date (deterministic)
 * For now, uses a simple algorithm based on date
 */
export function getDailyAnswer(puzzleDate: string): string {
  const puzzleDateObj = new Date(puzzleDate)
  const seed = puzzleDateObj.getFullYear() * 10000 + (puzzleDateObj.getMonth() + 1) * 100 + puzzleDateObj.getDate()
  const colors = VALID_COLORS

  let answer = ''
  let tempSeed = seed

  for (let i = 0; i < 5; i++) {
    tempSeed = (tempSeed * 9301 + 49297) % 233280 // Simple LCG
    const index = tempSeed % colors.length
    answer += colors[index]
  }

  return answer
}

/**
 * Validate a guess against the correct answer and return feedback
 */
export function validateGuess(guess: string, answer: string): GuessResponse['feedback'] {
  const feedback: GuessResponse['feedback'] = []
  const answerLetters = answer.split('')
  const guessLetters = guess.split('')

  const usedAnswerPositions = new Set<number>()
  const usedGuessPositions = new Set<number>()

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      feedback[i] = { letter: guessLetters[i], status: 'correct' }
      usedAnswerPositions.add(i)
      usedGuessPositions.add(i)
    }
  }

  for (let i = 0; i < 5; i++) {
    if (!usedGuessPositions.has(i)) {
      let found = false
      for (let j = 0; j < 5; j++) {
        if (!usedAnswerPositions.has(j) && guessLetters[i] === answerLetters[j]) {
          feedback[i] = { letter: guessLetters[i], status: 'present' }
          usedAnswerPositions.add(j)
          found = true
          break
        }
      }
      if (!found) {
        feedback[i] = { letter: guessLetters[i], status: 'absent' }
      }
    }
  }

  return feedback
}
