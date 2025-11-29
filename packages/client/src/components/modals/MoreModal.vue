<script setup lang="ts">
const ui = useUiStore()
const { t } = useI18n()
</script>

<template>
  <BaseModal modal-name="more" :title="t('more.title')">
    <div class="mb-8 flex flex-col gap-4">
      <IconButton
        icon="i-carbon:help"
        :text="t('more.faq')"
        @click="ui.open('faq')"
      />
      <IconButton
        icon="i-carbon:user"
        :text="t('more.credits')"
        @click="ui.open('credits')"
      />
      <IconButton
        icon="i-carbon:document"
        :text="t('more.privacyPolicy')"
        @click="ui.open('privacyPolicy')"
      />
    </div>
  </BaseModal>
</template>
