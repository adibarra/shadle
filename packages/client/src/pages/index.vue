<script setup lang="ts">
const game = useGameStore()

onMounted(() => {
  game.loadGameState()
  if (!game.puzzleId) {
    game.resetGame()
  }
})
</script>

<template>
  <Instructions />
  <GameBoard
    :guesses="game.guesses"
    :feedback="game.feedback"
    :current-guess="game.currentGuess"
  />
  <GameControls
    :current-guess-length="game.currentGuess.length"
    :can-submit="game.canSubmit"
    @remove="game.removeColor"
    @submit="game.submitGuess"
  />
  <ColorSelect
    :disabled-colors="game.disabledColors"
    :locked="game.won || game.lost || game.alreadyPlayed"
    @select="game.addColor"
  />

  <MenuModal />
  <SettingsModal />
  <InstructionsModal />
  <StatisticsModal />
  <PastPuzzlesModal />
  <WinModal />
  <CreditsModal />

  <!-- Hidden links for SEO -->
  <div style="display: none;">
    <a href="#menu">Menu</a>
    <a href="#settings">Settings</a>
    <a href="#instructions">Instructions</a>
    <a href="#statistics">Statistics</a>
    <a href="#pastPuzzles">Past Puzzles</a>
    <a href="#win">Win</a>
    <a href="#credits">Credits</a>
  </div>
</template>
