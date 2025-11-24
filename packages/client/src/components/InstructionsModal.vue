<script setup lang="ts">
const ui = useUiStore()
const { t } = useI18n()
</script>

<template>
  <div v-if="ui.showInstructions" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="ui.showInstructions = false">
    <div :class="isCompactViewport ? 'absolute inset-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg' : 'mx-4 max-w-sm w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-outline)] p-6 shadow-lg'">
      <div class="mb-8 flex flex-row items-center justify-between border-b border-[var(--color-outline)] pb-4">
        <h2 class="text-3xl font-bold">
          {{ t('instructionsModal.title') }}
        </h2>
        <button
          class="p-2 text-3xl"
          @click="ui.showInstructions = false"
        >
          <div class="i-carbon:close" />
        </button>
      </div>

      <div class="mb-8">
        {{ t('instructionsModal.description') }}
      </div>

      <div class="mb-8">
        {{ t('instructionsModal.howTo.selectColors') }}
      </div>

      <div class="mb-8">
        <p class="mb-8">
          {{ t('instructionsModal.feedback.intro') }}
        </p>
        <ul class="list-disc list-inside space-y-2">
          <li class="flex items-center">
            <div class="mr-4 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]" />
            {{ t('instructionsModal.feedback.correct') }}
          </li>
          <li class="flex items-center">
            <div class="mr-4 h-8 w-4 flex-shrink-0 rounded bg-[hsl(0,0%,20%)]" />
            {{ t('instructionsModal.feedback.absent') }}
          </li>
          <li class="flex items-center">
            <div class="relative mr-4 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]">
              <div class="absolute inset-0 bg-[hsl(0,0%,20%)]" style="clip-path: polygon(0 100%, 100% 0, 100% 100%)" />
            </div>
            {{ t('instructionsModal.feedback.present') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
