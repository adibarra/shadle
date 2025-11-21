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

const enabledColors = computed(() => VALID_COLORS.filter(c => !props.disabledColors.includes(c)))

const gridCols = computed(() => {
  const count = enabledColors.value.length
  if (count <= 2) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-2'
  if (count <= 6) return 'grid-cols-3'
  return 'grid-cols-4'
})
</script>

<template>
  <div :class="`mb-20 grid gap-4 ${gridCols}`">
    <div
      v-for="color in enabledColors"
      :key="color"
      :class="`relative rounded p-4 cursor-pointer transition-opacity ${bgColorClasses[color]}`"
      @click="emit('select', color)"
    />
  </div>
</template>
