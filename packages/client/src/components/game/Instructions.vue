<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="mb-6 text-center text-sm">
    <p class="mb-1">
      {{ t('gamePrompts.guessPrompt') }}
    </p>
    <p>{{ t('gamePrompts.helpPrompt') }}</p>
  </div>
</template>
