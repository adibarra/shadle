<script setup lang="ts">
const { gameState, currentGuess, addColor, submitGuess, canSubmit, resetGame, removeColor, loadState, disabledColors } = useGame()

onMounted(() => {
  loadState()
  if (!gameState.value.puzzleId) {
    resetGame()
  }
})
</script>

<template>
  <Instructions />
  <GameBoard
    :guesses="gameState.guesses"
    :feedback="gameState.feedback"
    :current-guess="currentGuess"
  />
  <GameControls
    :current-guess-length="currentGuess.length"
    :can-submit="canSubmit"
    @remove="removeColor"
    @submit="submitGuess"
  />
  <ColorSelect
    :disabled-colors="disabledColors"
    @select="addColor"
  />

  <WinModal
    v-if="gameState.won || gameState.lost"
    :won="gameState.won"
    :attempts="gameState.attempts"
    :guesses="gameState.guesses"
    :feedback="gameState.feedback"
    :on-close="resetGame"
  />
</template>
