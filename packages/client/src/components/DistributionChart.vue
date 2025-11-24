<script setup lang="ts">
interface Props {
  triesDistribution: Record<number, number>
  gamesWon: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="relative max-h-28 flex items-end justify-center gap-2 px-4">
    <!-- X-axis -->
    <div class="absolute bottom-5 left-0 right-0 h-px bg-gray-400" />

    <div v-for="tries in [1, 2, 3, 4, 5, 6]" :key="tries" class="relative z-10 flex flex-col items-center">
      <div class="text-xs text-white font-medium">
        {{ props.triesDistribution[tries] }}
      </div>
      <div class="w-8 flex flex-col justify-end" :style="{ height: '70px' }">
        <div
          class="w-full flex items-end justify-center rounded-t bg-[var(--color-accent)] transition-all"
          :style="{ height: props.gamesWon > 0 ? `${(props.triesDistribution[tries] / props.gamesWon) * 100}%` : '0%' }"
        />
      </div>
      <div class="mt-1.5 text-xs font-900">
        {{ tries }}
      </div>
    </div>
  </div>
</template>
