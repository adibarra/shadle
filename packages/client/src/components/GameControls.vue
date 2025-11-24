<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  currentGuessLength: number
  canSubmit: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  remove: []
  submit: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid grid-cols-2 mb-4 gap-2">
    <button
      :disabled="currentGuessLength === 0"
      class="w-full border rounded bg-transparent px-2 py-1 text-[var(--color-text)]"
      :class="[
        currentGuessLength === 0
          ? 'border-[var(--color-outline)] opacity-50'
          : 'border-[var(--color-outline)] active:opacity-75',
      ]"
      @click="emit('remove')"
    >
      {{ t('game.backspace') }}
    </button>
    <button
      :disabled="!canSubmit"
      class="w-full border rounded bg-transparent px-2 py-1 text-[var(--color-text)]"
      :class="[
        !canSubmit
          ? 'border-[var(--color-outline)] opacity-50'
          : 'border-[var(--color-outline)] active:opacity-75',
      ]"
      @click="emit('submit')"
    >
      {{ t('game.submitGuess') }}
    </button>
  </div>
</template>
