<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const ui = useUiStore()
const { t } = useI18n()

let registration: ServiceWorkerRegistration | undefined

useRegisterSW({
  onRegistered(r: ServiceWorkerRegistration | undefined) {
    registration = r
  },
})

async function checkForUpdate() {
  if (registration) {
    await registration.update()
    // eslint-disable-next-line no-alert
    alert('Update check completed. If an update was available, it has been installed and the app will reload.')
    window.location.reload()
  } else {
    // eslint-disable-next-line no-alert
    alert('Service worker not registered.')
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
