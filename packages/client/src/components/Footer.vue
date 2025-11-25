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
    (adsbygoogle = window.adsbygoogle || []).push({})
  }
})
</script>

<template>
  <footer class="w-full flex grow items-center justify-center" role="contentinfo">
    <div class="border border-[var(--color-outline)] rounded" style="width: 320px; height: 50px;">
      <ins
        v-if="!isDev"
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-1557521916095990"
        data-ad-slot="4651494788"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  </footer>
</template>
