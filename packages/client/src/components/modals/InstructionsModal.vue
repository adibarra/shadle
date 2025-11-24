<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <BaseModal modal-name="instructions" :title="t('modals.instructions.title')">
    <div class="mb-8">
      {{ t('modals.instructions.description') }}
    </div>

    <div class="mb-8">
      {{ t('modals.instructions.howTo.selectColors') }}
    </div>

    <div class="mb-8">
      <p class="mb-8">
        {{ t('modals.instructions.feedback.intro') }}
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li class="flex items-center">
          <div class="mr-4 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]" />
          {{ t('modals.instructions.feedback.correct') }}
        </li>
        <li class="flex items-center">
          <div class="relative mr-4 h-8 w-4 flex-shrink-0 rounded bg-[var(--color-b)]">
            <div class="absolute inset-0 bg-[hsl(0,0%,20%)]" style="clip-path: polygon(0 100%, 100% 0, 100% 100%)" />
          </div>
          {{ t('modals.instructions.feedback.present') }}
        </li>
        <li class="flex items-center">
          <div class="mr-4 h-8 w-4 flex-shrink-0 rounded bg-[hsl(0,0%,20%)]" />
          {{ t('modals.instructions.feedback.absent') }}
        </li>
      </ul>
    </div>
  </BaseModal>
</template>
