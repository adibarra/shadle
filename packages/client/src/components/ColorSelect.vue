<script setup lang="ts">
import type { ValidColor } from '@shadle/types'

interface Props {
  disabledColors?: ValidColor[]
}

const props = withDefaults(defineProps<Props>(), {
  disabledColors: () => [],
})

const emit = defineEmits<{
  select: [color: ValidColor]
}>()

const colors: ValidColor[] = ['R', 'G', 'B', 'Y', 'P', 'C', 'W', 'K']

const enabledColors = computed(() => colors.filter(c => !props.disabledColors.includes(c)))

const gridCols = computed(() => {
  const count = enabledColors.value.length
  if (count <= 2) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-2'
  if (count <= 6) return 'grid-cols-3'
  return 'grid-cols-4'
})
</script>

<template>
  <div :class="`grid gap-4 ${gridCols}`">
    <div
      v-for="color in enabledColors"
      :key="color"
      :class="`relative rounded p-4 cursor-pointer transition-opacity ${colorClasses[color]}`"
      @click="emit('select', color)"
    />
  </div>
</template>
