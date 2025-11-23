<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div v-if="ui.showInstructions" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.showInstructions = false">
    <div class="mx-4 max-w-sm w-full rounded-lg bg-[var(--color-bg)] p-6 shadow-lg">
      <div class="mb-8 flex flex-row items-center justify-between">
        <h2 class="text-3xl font-bold">
          How to Play
        </h2>
        <button
          class="p-2 text-3xl"
          @click="ui.showInstructions = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

      <div class="mb-8">
        Guess the 5-color combo in 6 tries. The colors in the combination can repeat.
      </div>

      <div class="mb-8">
        <p class="mb-2">
          After each guess, you'll get feedback on each color:
        </p>
        <ul class="list-disc list-inside space-y-2">
          <li class="flex items-center">
            <div class="mr-4 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]" />
            If the full color is shown, the guess was correct.
          </li>
          <li class="flex items-center">
            <div class="relative mr-4 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]">
              <div class="absolute inset-0 bg-[hsl(0,0%,20%)]" style="clip-path: polygon(0 100%, 100% 0, 100% 100%)" />
            </div>
            If half of the color is shown, it is present but in the wrong position.
          </li>
          <li class="flex items-center">
            <div class="mr-4 h-8 w-4 flex-shrink-0 rounded bg-[hsl(0,0%,20%)]" />
            If it is fully greyed out, then it is not present in the combo.
          </li>
        </ul>
      </div>

      <div class="mb-8">
        Use the color buttons below the board to select colors for your guess.
      </div>

      <div class="mb-8">
        Click "Submit Guess" when ready.
      </div>
    </div>
  </div>
</template>
