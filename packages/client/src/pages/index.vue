<script setup lang="ts">
import { onMounted } from 'vue'

const { gameState, currentGuess, addColor, submitGuess, canSubmit, resetGame, removeColor, loadState } = useGame()

onMounted(() => {
  loadState()
  if (!gameState.value.puzzleId) {
    resetGame()
  }
})
</script>

<template>
  <Instructions />
  <GameBoard :guesses="gameState.guesses" :feedback="gameState.feedback" :current-guess="currentGuess" />
  <div class="grid grid-cols-2 mb-4 mt-4 gap-2">
    <button :disabled="currentGuess.length === 0" class="w-full border rounded bg-transparent px-2 py-1 text-white" :class="[currentGuess.length === 0 ? 'border-[#dc2626] opacity-50' : 'border-[#dc2626] active:opacity-75']" @click="removeColor">
      Backspace
    </button>
    <button :disabled="!canSubmit" class="w-full border rounded bg-transparent px-2 py-1 text-white" :class="[!canSubmit ? 'border-[#16a34a] opacity-50' : 'border-[#16a34a] active:opacity-75']" @click="submitGuess">
      Submit Guess
    </button>
  </div>
  <ColorSelect @select="addColor" />

  <WinModal
    v-if="gameState.won || gameState.lost"
    :won="gameState.won"
    :attempts="gameState.attempts"
    :on-close="resetGame"
  />
</template>
