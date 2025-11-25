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

interface Props {
  disabledColors?: ValidColor[]
  locked?: boolean
}
</script>

<template>
  <div>
    <div class="relative grid grid-cols-4 mb-4 gap-4">
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
        <p class="h-full w-full flex items-center justify-center border border-[var(--color-outline)] rounded text-center text-sm text-white">
          {{ $t('game.locked.description') }}
        </p>
      </div>
    </div>
  </div>
</template>
