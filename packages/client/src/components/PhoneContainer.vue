<script setup lang="ts">
const isDev = import.meta.env.DEV

if (!isDev) {
  useHead({
    script: [
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1557521916095990',
        async: true,
        crossorigin: 'anonymous',
      },
    ],
  })
}

onMounted(() => {
  if (!isDev && window.adsbygoogle) {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }
})
</script>

<template>
  <div>
    <div v-if="isCompactViewport" class="flex grow flex-col min-h-svh">
      <slot />
    </div>
    <div v-else class="flex items-center justify-center p-4 min-h-svh">
      <div class="flex items-center gap-4">
        <div v-if="!isDev" class="h-[600px] w-[160px] flex-shrink-0">
          <ins
            class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-1557521916095990"
            data-ad-slot="9781791714"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
        <div v-else class="h-[600px] w-[160px] flex-shrink-0 rounded-[8px] bg-[var(--color-outline)]" />
        <div class="relative overflow-hidden border-4 border-gray-700 rounded-3xl bg-[var(--color-bg)] shadow-2xl" style="width: 375px; height: 812px;">
          <div class="relative flex grow flex-col">
            <slot />
          </div>
        </div>
        <div v-if="!isDev" class="h-[600px] w-[160px] flex-shrink-0">
          <ins
            class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-1557521916095990"
            data-ad-slot="9781791714"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
        <div v-else class="h-[600px] w-[160px] flex-shrink-0 rounded-[8px] bg-[var(--color-outline)]" />
      </div>
    </div>
  </div>
</template>
