import type { ValidColor } from '@shadle/types'
import { GuessStatus } from '@shadle/types'
import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'
import { getHistory, submitGuess as submitGuessAPI } from '../composables/api'
import { generateDeviceId } from '../utils'
import { useUiStore } from './ui'

const STORAGE_KEY = 'shadle-game-state'
const MODE_STORAGE_KEY = 'shadle-current-mode'

interface GameState {
  puzzleId: string
  guesses: ValidColor[][]
  feedback: GuessStatus[][]
  attempts: number
  won: boolean
  lost: boolean
}

export const useGameStore = defineStore('game', () => {
  // Persistent state using VueUse
  const selectedDate = useStorage<string>(`${MODE_STORAGE_KEY}-selectedDate`, '')
  const randomSeed = useStorage<string>(`${MODE_STORAGE_KEY}-randomSeed`, '')
  const currentMode = useStorage<'daily' | 'random' | 'past'>(`${MODE_STORAGE_KEY}-currentMode`, 'daily')

  // Game state - persisted separately
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

  // Computeds
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

  // Persistence functions
  function saveGameState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState.value))
    } catch (error) {
      console.error('Failed to save game state:', error)
    }
  }

  function loadGameState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.puzzleId === generatePuzzleId()) {
          gameState.value = parsed
          // Derive selectedDate and randomSeed from puzzleId
          const dailyMatch = parsed.puzzleId.match(/^§(\d{4})-(\d{2})-(\d{2})$/)
          if (dailyMatch) {
            const dateStr = `${dailyMatch[1]}-${dailyMatch[2]}-${dailyMatch[3]}`
            const today = new Date().toISOString().split('T')[0]
            selectedDate.value = dateStr === today ? '' : dateStr
          }
          const randomMatch = parsed.puzzleId.match(/^random:(.+)$/)
          if (randomMatch) {
            randomSeed.value = randomMatch[1]
            selectedDate.value = ''
          }
        }
      }
    } catch (error) {
      console.error('Failed to load game state:', error)
    }
  }

  function generatePuzzleId() {
    if (currentMode.value === 'random') {
      return `random:${randomSeed.value}`
    }
    const date = selectedDate.value || new Date().toISOString().split('T')[0]
    return `§${date}`
  }

  function _getDeviceId() {
    let deviceId = localStorage.getItem('shadle-device-id')
    if (!deviceId) {
      deviceId = generateDeviceId()
      localStorage.setItem('shadle-device-id', deviceId)
    }
    return deviceId
  }

  function resetApp() {
    localStorage.setItem('shadle-device-id', generateDeviceId())
    localStorage.removeItem(STORAGE_KEY)
    // Clear mode data
    selectedDate.value = ''
    randomSeed.value = ''
    currentMode.value = 'daily'
    // Reset game state
    gameState.value = {
      puzzleId: '',
      guesses: [],
      feedback: [],
      attempts: 0,
      won: false,
      lost: false,
    }
    currentGuess.value = []
    window.location.reload()
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
    saveGameState()
  }

  async function setPuzzleMode(mode: 'daily' | 'random' | 'past', seedOrDate?: string) {
    if (mode === 'daily') {
      selectedDate.value = ''
      randomSeed.value = ''
    } else if (mode === 'random') {
      randomSeed.value = seedOrDate || Math.random().toString(36).substring(2)
      selectedDate.value = ''
    } else if (seedOrDate) {
      selectedDate.value = seedOrDate
      randomSeed.value = ''
    }

    const puzzleId = generatePuzzleId()

    // Check if already played for daily and past modes
    if (mode === 'daily' || mode === 'past') {
      const deviceId = _getDeviceId()
      const ui = useUiStore()
      try {
        const history = await getHistory(deviceId, puzzleId)
        if (history.attempts.length > 0) {
          // Already played
          ui.open('alreadyPlayed')
          return
        }
      } catch (error) {
        console.error('Failed to check puzzle history:', error)
        // Proceed anyway?
      }
    }

    currentMode.value = mode
    resetGame()
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
      if (isWin || gameState.value.attempts >= maxAttempts) {
        const ui = useUiStore()
        ui.open('win')
      }

      currentGuess.value = []
      saveGameState()
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
      if (isWin || gameState.value.attempts >= maxAttempts) {
        const ui = useUiStore()
        ui.open('win')
      }

      currentGuess.value = []
      saveGameState()
    }
  }

  return {
    // Game state properties (flattened for easier access)
    guesses: computed(() => gameState.value.guesses),
    feedback: computed(() => gameState.value.feedback),
    attempts: computed(() => gameState.value.attempts),
    won: computed(() => gameState.value.won),
    lost: computed(() => gameState.value.lost),
    puzzleId: computed(() => gameState.value.puzzleId),

    // Other state
    currentGuess: readonly(currentGuess),
    selectedDate: readonly(selectedDate),
    randomSeed: readonly(randomSeed),
    currentMode: readonly(currentMode),

    // Computeds
    isGuessComplete,
    canSubmit,
    disabledColors,

    // Actions
    addColor,
    removeColor,
    submitGuess,
    resetGame,
    setPuzzleMode,
    loadGameState,
    resetApp,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
