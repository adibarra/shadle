<script setup lang="ts">
const { needRefresh, doUpdate } = usePwaUpdate()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    leave-active-class="transition-all duration-200"
    enter-from-class="opacity-0 translate-y--2"
    leave-to-class="opacity-0 translate-y--2"
  >
    <div
      v-if="needRefresh"
      class="cursor-pointer bg-[var(--color-accent)] p-2 text-center text-[var(--color-text)]"
      @click="doUpdate"
    >
      A new version is available. Click here to update.
    </div>
  </Transition>
</template>
