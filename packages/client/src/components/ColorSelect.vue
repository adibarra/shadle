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

const gridCols = computed(() => {
  const count = VALID_COLORS.length
  if (count <= 2) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-2'
  if (count <= 6) return 'grid-cols-3'
  return 'grid-cols-4'
})
</script>

<template>
  <div :class="`mb-10 grid gap-4 ${gridCols}`">
    <div
      v-for="color in VALID_COLORS"
      :key="color"
      :class="`relative rounded p-4 transition-opacity select-none ${
        props.disabledColors.includes(color) ? 'bg-[hsl(0,0%,20%)] cursor-not-allowed pointer-events-none' : `${bgColorClasses[color]} cursor-pointer`
      }`"
      @click="props.disabledColors.includes(color) || emit('select', color)"
    />
  </div>
</template>
