<script setup lang="ts">
import AlreadyPlayedModal from '../components/AlreadyPlayedModal.vue'
import InstructionsModal from '../components/InstructionsModal.vue'
import MenuModal from '../components/MenuModal.vue'
import PastPuzzlesModal from '../components/PastPuzzlesModal.vue'
import PuzzleModeIndicator from '../components/PuzzleModeIndicator.vue'
import SettingsModal from '../components/SettingsModal.vue'
import StatisticsModal from '../components/StatisticsModal.vue'

const game = useGameStore()
const ui = useUiStore()

watch(() => game.won || game.lost, (shouldShowWin) => {
  if (shouldShowWin && !ui.isOpen('win')) {
    ui.open('win')
  }
})

onMounted(() => {
  game.loadGameState()
  if (!game.puzzleId) {
    game.resetGame()
  }
})
</script>

<template>
  <Instructions />
  <PuzzleModeIndicator />
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
    @select="game.addColor"
  />

  <InstructionsModal />
  <MenuModal />
  <SettingsModal />
  <StatisticsModal />
  <PastPuzzlesModal />
  <AlreadyPlayedModal />
  <WinModal />
</template>
