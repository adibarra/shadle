<script setup lang="ts">
const { t } = useI18n()
const { currentLocale } = useLocales()

const pwaGuideUrl = computed(() => {
  switch (currentLocale.value) {
    case 'es':
      return 'https://developer.mozilla.org/es/docs/Web/Progressive_web_apps/Guides/Installing'
    case 'en':
    default:
      return 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing'
  }
})
</script>

<template>
  <BaseModal modal-name="faq" :title="t('faq.title')">
    <div class="mb-8 flex flex-col gap-6 text-sm">
      <div>
        <h3 class="mb-2 font-semibold">
          {{ t('faq.whatIs.question') }}
        </h3>
        <p>{{ t('faq.whatIs.answer') }}</p>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">
          {{ t('faq.gameModes.question') }}
        </h3>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>{{ t('menu.dailyPuzzle') }}:</strong> {{ t('faq.gameModes.daily') }}</li>
          <li><strong>{{ t('menu.randomPuzzle') }}:</strong> {{ t('faq.gameModes.random') }}</li>
          <li><strong>{{ t('menu.pastPuzzles') }}:</strong> {{ t('faq.gameModes.past') }}</li>
        </ul>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">
          {{ t('faq.statistics.question') }}
        </h3>
        <p>{{ t('faq.statistics.answer') }}</p>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">
          {{ t('faq.pwa.question') }}
        </h3>
        <p>{{ t('faq.pwa.answer') }}</p>
        <p>{{ t('faq.pwa.guide') }} <a :href="pwaGuideUrl" target="_blank" class="text-blue-500 underline">{{ t('faq.pwa.guideLink', { defaultValue: 'this guide' }) }}</a>.</p>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">
          {{ t('faq.themes.question') }}
        </h3>
        <p>{{ t('faq.themes.answer') }}</p>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">
          {{ t('faq.affiliation.question') }}
        </h3>
        <p>{{ t('faq.affiliation.answer') }}</p>
      </div>
    </div>
  </BaseModal>
</template>
