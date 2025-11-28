<script setup lang="ts">
interface Props {
  triesDistribution: Record<number, number>
  gamesWon: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="relative max-h-32 flex flex-col items-center px-4">
    <div class="relative flex items-end justify-center gap-2">
      <!-- X-axis -->
      <div class="absolute bottom-5 left-0 right-0 h-px bg-gray-400" />

      <div v-for="tries in [1, 2, 3, 4, 5, 6]" :key="tries" class="relative z-10 flex flex-col items-center">
        <div
          class="relative w-8 flex flex-col justify-end"
          :style="{ height: '70px' }"
        >
          <div
            class="absolute w-full text-center text-xs text-white font-medium"
            :style="{
              bottom: (() => {
                const barHeightPercent = props.gamesWon > 0 ? Math.max((props.triesDistribution[tries] / props.gamesWon) * 100, 10) : 0;
                return `${(barHeightPercent / 100) * 70}px`;
              })(),
            }"
          >
            {{ props.triesDistribution[tries] }}
          </div>
          <div
            class="w-full rounded-t bg-[var(--color-accent)] transition-all"
            :style="{
              height: (() => {
                const barHeightPercent = props.gamesWon > 0 ? Math.max((props.triesDistribution[tries] / props.gamesWon) * 100, 10) : 0;
                return `${(barHeightPercent / 100) * 70}px`;
              })(),
            }"
          />
        </div>
        <div class="mt-1.5 text-xs font-900">
          {{ tries }}
        </div>
      </div>
    </div>
    <div class="mt-1 text-center text-xs font-900">
      Number of tries
    </div>
  </div>
</template>
