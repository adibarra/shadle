<script setup lang="ts">
import type { ValidColor } from '@shadle/types'
import { VALID_COLORS } from '@shadle/types'

interface Props {
  disabledColors?: ValidColor[]
}

const props = withDefaults(defineProps<Props>(), {
  disabledColors: () => [],
})

const emit = defineEmits<{
  select: [color: ValidColor]
}>()
</script>

<template>
  <div class="grid grid-cols-4 mb-10 gap-4">
    <div
      v-for="color in VALID_COLORS"
      :key="color"
      :class="`relative rounded p-4 transition-opacity select-none ${
        props.disabledColors.includes(color) ? `bg-[hsl(0,0%,20%)] cursor-not-allowed pointer-events-none` : `${bgColorClasses[color]} cursor-pointer`
      }`"
      :style="props.disabledColors.includes(color) ? { boxShadow: `inset 0 0 0 1px var(--color-${color.toLowerCase()})` } : {}"
      @click="props.disabledColors.includes(color) || emit('select', color)"
    />
  </div>
</template>
