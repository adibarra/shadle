import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { computed, readonly, ref } from 'vue'
import { submitGuess as submitGuessAPI } from './api'

const STORAGE_KEY = 'shadle-game-state'

interface GameState {
  puzzleId: string
  guesses: ValidColor[][]
  feedback: GuessStatus[][]
  attempts: number
  won: boolean
  lost: boolean
}

const gameState = ref<GameState>({
  puzzleId: '',
  guesses: [],
  feedback: [],
  attempts: 0,
  won: false,
  lost: false,
})

const currentGuess = ref<ValidColor[]>([])

const maxAttempts = 6

const isGuessComplete = computed(() => currentGuess.value.length === 5)

const canSubmit = computed(() => isGuessComplete.value && !gameState.value.won && !gameState.value.lost)

const disabledColors = computed(() => {
  const absentColors = new Set<ValidColor>()
  const presentOrCorrectColors = new Set<ValidColor>()

  for (let guessIndex = 0; guessIndex < gameState.value.feedback.length; guessIndex++) {
    const feedback = gameState.value.feedback[guessIndex]
    const guess = gameState.value.guesses[guessIndex]
    for (let i = 0; i < feedback.length; i++) {
      const color = guess[i]
      if (feedback[i] === GuessStatus.ABSENT) {
        absentColors.add(color)
      } else if (feedback[i] === GuessStatus.PRESENT || feedback[i] === GuessStatus.CORRECT) {
        presentOrCorrectColors.add(color)
      }
    }
  }

  // Only disable colors that are absent and have never been present or correct
  const eliminated = new Set<ValidColor>()
  for (const color of absentColors) {
    if (!presentOrCorrectColors.has(color)) {
      eliminated.add(color)
    }
  }

  return Array.from(eliminated)
})

function generatePuzzleId() {
  const today = new Date().toISOString().split('T')[0]
  return `§${today}`
}

function generateDeviceId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for browsers without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function _getDeviceId() {
  let deviceId = localStorage.getItem('shadle-device-id')
  if (!deviceId) {
    deviceId = generateDeviceId()
    localStorage.setItem('shadle-device-id', deviceId)
  }
  return deviceId
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState.value))
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.puzzleId === generatePuzzleId()) {
        gameState.value = parsed
      }
    } catch (e) {
      console.error('Failed to load game state', e)
    }
  }
}

function resetGame() {
  gameState.value = {
    puzzleId: generatePuzzleId(),
    guesses: [],
    feedback: [],
    attempts: 0,
    won: false,
    lost: false,
  }
  currentGuess.value = []
  saveState()
}

function addColor(color: ValidColor) {
  if (currentGuess.value.length < 5 && !gameState.value.won && !gameState.value.lost) {
    currentGuess.value.push(color)
  }
}

function removeColor() {
  currentGuess.value.pop()
}

async function submitGuess() {
  if (!canSubmit.value) return

  try {
    const feedback = await submitGuessAPI(gameState.value.puzzleId, currentGuess.value, _getDeviceId())
    gameState.value.guesses.push([...currentGuess.value])
    gameState.value.feedback.push(feedback)
    gameState.value.attempts++

    const isWin = feedback.every(status => status === GuessStatus.CORRECT)
    if (isWin) {
      gameState.value.won = true
    } else if (gameState.value.attempts >= maxAttempts) {
      gameState.value.lost = true
    }

    currentGuess.value = []
    saveState()
  } catch (error) {
    console.error('Failed to submit guess:', error)
    // Fallback to mock for development
    const mockFeedback: GuessStatus[] = [
      GuessStatus.CORRECT,
      GuessStatus.PRESENT,
      GuessStatus.ABSENT,
      GuessStatus.ABSENT,
      GuessStatus.PRESENT,
    ]

    gameState.value.guesses.push([...currentGuess.value])
    gameState.value.feedback.push(mockFeedback)
    gameState.value.attempts++

    const isWin = mockFeedback.every(status => status === GuessStatus.CORRECT)
    if (isWin) {
      gameState.value.won = true
    } else if (gameState.value.attempts >= maxAttempts) {
      gameState.value.lost = true
    }

    currentGuess.value = []
    saveState()
  }
}

export function useGame() {
  return {
    gameState: readonly(gameState),
    currentGuess: readonly(currentGuess),
    isGuessComplete,
    canSubmit,
    disabledColors,
    addColor,
    removeColor,
    submitGuess,
    resetGame,
    loadState,
  }
}
