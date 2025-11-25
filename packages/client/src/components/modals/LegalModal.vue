<script setup lang="ts">
const ui = useUiStore()
const { t } = useI18n()
</script>

<template>
  <BaseModal modal-name="legal" :title="t('legal.title')">
    <div class="mb-8 flex flex-col gap-4">
      <IconButton
        icon="i-carbon:user"
        :text="t('legal.credits')"
        @click="ui.open('credits')"
      />
      <IconButton
        icon="i-carbon:document"
        :text="t('legal.privacyPolicy')"
        @click="ui.open('privacyPolicy')"
      />
    </div>
  </BaseModal>
</template>
