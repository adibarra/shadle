<script setup lang="ts">
interface Props {
  won: boolean
  attempts: number
  onClose: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="mx-4 max-w-sm w-full rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-2xl font-bold" :class="props.won ? 'text-green-600' : 'text-red-600'">
        {{ props.won ? 'Congratulations!' : 'Game Over' }}
      </h2>
      <p class="mb-4">
        {{ props.won ? `You solved the puzzle in ${props.attempts} attempts!` : 'Better luck next time!' }}
      </p>
      <button class="btn rounded bg-blue-500 px-4 py-2 text-white" @click="props.onClose">
        Play Again
      </button>
    </div>
  </div>
</template>
