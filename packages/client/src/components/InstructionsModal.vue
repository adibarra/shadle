<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div v-if="ui.showInstructions" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="mx-4 max-w-sm min-h-[300px] w-full flex flex-col justify-between rounded-lg bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-lg">
      <div>
        <h2 class="mb-4 text-2xl font-bold">
          How to Play <ShadleTitle />
        </h2>
        <p class="mb-2">
          Guess the 5-color combo in 6 tries.
        </p>
        <p class="mb-2">
          Each guess must be a valid 5-color combination. Colors can repeat.
        </p>
        <p class="mb-2">
          After each guess, you'll get feedback on each color:
        </p>
        <ul class="mb-4 list-disc list-inside space-y-2">
          <li class="flex items-center">
            <div class="mr-2 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]" />
            If the full color is shown, the guess was correct
          </li>
          <li class="flex items-center">
            <div class="relative mr-2 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]">
              <div class="absolute inset-0 bg-[hsl(0,0%,20%)]" style="clip-path: polygon(0 100%, 100% 0, 100% 100%)" />
            </div>
            If half of the color is shown, it is present but in the wrong position
          </li>
          <li class="flex items-center">
            <div class="mr-2 h-8 w-4 flex-shrink-0 rounded bg-[hsl(0,0%,20%)]" />
            If it is fully greyed out, then it is not present in the combo
          </li>
        </ul>
        <p class="mb-4">
          Use the color buttons below the board to select colors for your guess. Click "Submit Guess" when ready.
        </p>
      </div>
      <div class="flex justify-end">
        <button class="rounded bg-[var(--color-accent)] px-4 py-2 text-[var(--color-text)]" @click="ui.showInstructions = false">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
