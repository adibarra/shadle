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

const footerRef = ref<HTMLElement | null>(null)
const adSize = ref<{ w: number, h: number }>({ w: 0, h: 0 })
let resizeObserver: ResizeObserver | null = null

function computeAdSize() {
  if (!footerRef.value) return

  const style = window.getComputedStyle(footerRef.value)
  const availableHeight = Number.parseFloat(style.height)
  const availableWidth = Number.parseFloat(style.width)
  const rect = footerRef.value.getBoundingClientRect()
  const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

  if (isFullyVisible) {
    if (availableHeight >= 100 + 40) {
      adSize.value = { w: availableWidth - 32, h: 100 }
    } else if (availableHeight >= 50 + 40) {
      adSize.value = { w: availableWidth - 32, h: 50 }
    } else {
      adSize.value = { w: 0, h: 0 }
    }
  } else {
    adSize.value = { w: 0, h: 0 }
  }
}

onMounted(() => {
  nextTick(() => {
    computeAdSize()
    if (footerRef.value) {
      resizeObserver = new ResizeObserver(() => computeAdSize())
      resizeObserver.observe(footerRef.value)
    }
  })

  if (!isDev && window.adsbygoogle) {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <footer ref="footerRef" class="w-full flex flex-grow flex-col items-center" role="contentinfo">
    <div class="grow" />
    <div
      v-if="!isDev"
      class="mx-4"
      :class="isPwa && isIos ? 'mt-5 mb-10' : 'my-5'"
      :style="`width:${adSize.w}px; height:${adSize.h}px;`"
    >
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-1557521916095990"
        data-ad-slot="4651494788"
      />
    </div>
    <div
      v-else
      class="mx-4 rounded-[8px] bg-[var(--color-outline)]"
      :class="isPwa && isIos ? 'mt-5 mb-10' : 'my-5'"
      :style="`width:${adSize.w}px; height:${adSize.h}px;`"
    />
  </footer>
</template>
