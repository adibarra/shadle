<script setup lang="ts">
const game = useGameStore()
const ui = useUiStore()

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
    @go-to-menu="ui.open('menu')"
  />

  <InstructionsModal />
  <MenuModal />
  <SettingsModal />
  <StatisticsModal />
  <PastPuzzlesModal />
  <WinModal />
  <CreditsModal />
</template>
