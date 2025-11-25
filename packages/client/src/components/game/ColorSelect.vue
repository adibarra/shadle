<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { VALID_COLORS } from '@shadle/types'
import { bgColorClasses } from '~/constants'

const props = withDefaults(defineProps<Props>(), {
  disabledColors: () => [],
  locked: false,
})

const emit = defineEmits<{
  select: [color: ValidColor]
}>()

const game = useGameStore()

interface Props {
  disabledColors?: ValidColor[]
  locked?: boolean
}
</script>

<template>
  <div>
    <div class="relative grid grid-cols-4 gap-4">
      <div
        v-for="color in VALID_COLORS"
        :key="color"
        :class="`relative rounded p-4 transition-colors duration-500 select-none ${
          props.disabledColors.includes(color) || props.locked ? `bg-[hsl(0,0%,20%)] cursor-not-allowed pointer-events-none` : `${bgColorClasses[color]} cursor-pointer`
        }`"
        :style="props.disabledColors.includes(color) || props.locked ? { boxShadow: `inset 0 0 0 1px var(--color-${color.toLowerCase()})` } : {}"
        @click="props.disabledColors.includes(color) || props.locked || emit('select', color)"
      />
      <div v-if="props.locked" class="absolute inset-0 rounded bg-[var(--color-bg)] bg-opacity-50 outline-1">
        <IconButton
          v-if="game.currentMode === 'random'"
          icon="i-carbon:shuffle"
          :text="$t('game.newRandomPuzzle')"
          @click="game.setPuzzleMode('random')"
        />
        <div v-else class="h-full w-full flex items-center justify-center border border-[var(--color-outline)] rounded px-4 text-center text-sm">
          <p>{{ $t('game.locked.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
