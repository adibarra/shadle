<script setup lang="ts">
const ui = useUiStore()
const { t } = useI18n()
</script>

<template>
  <BaseModal modal-name="alreadyPlayed" :title="t('modals.alreadyPlayed.title')">
    <div class="space-y-4">
      <p class="text-sm op-50">
        {{ t('modals.alreadyPlayed.description') }}
      </p>

      <div class="flex gap-2">
        <button
          class="flex-1 rounded bg-gray-500 px-4 py-2 text-white"
          @click="ui.close('alreadyPlayed')"
        >
          {{ t('modals.alreadyPlayed.close') }}
        </button>
        <button
          class="flex-1 rounded bg-blue-500 px-4 py-2 text-white"
          @click="ui.open('menu'); ui.close('alreadyPlayed')"
        >
          {{ t('modals.alreadyPlayed.goToMenu') }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>
