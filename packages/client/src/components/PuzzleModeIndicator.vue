<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { d } = useI18n()
const game = useGameStore()

const displayText = computed(() => {
  if (game.currentMode === 'random') {
    return 'Random'
  } else if (game.currentMode === 'past' && game.selectedDate) {
    const [year, month, day] = game.selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return d(date, 'short')
  } else {
    return 'Daily'
  }
})
</script>

<template>
  <div style="position: absolute; top: 0; right: 0; z-index: 40; width: 85px; height: 85px; overflow: hidden;">
    <div
      style="
        position: absolute;
        z-index: 1;
        font-size: 12px;
        font-weight: bold;
        color: #FFF;
        text-align: center;
        line-height: 25px;
        transform: rotate(45deg);
        width: 120px;
        background: var(--color-accent);
        box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
        top: 22px;
        right: -26px;
      "
    >
      {{ displayText }}
    </div>
  </div>
</template>
