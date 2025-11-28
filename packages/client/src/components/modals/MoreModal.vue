<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const ui = useUiStore()
const { t } = useI18n()
const { needRefresh, updateServiceWorker } = useRegisterSW()

function checkForUpdate() {
  if (needRefresh.value) {
    // eslint-disable-next-line no-alert
    if (confirm('Update available. Update now?')) {
      updateServiceWorker(true)
    }
  } else {
    // eslint-disable-next-line no-alert
    alert('No updates available.')
  }
}
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
      <IconButton
        v-if="isPwa"
        icon="i-carbon:renew"
        :text="t('more.checkForUpdates')"
        @click="checkForUpdate"
      />
    </div>
  </BaseModal>
</template>
