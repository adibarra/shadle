<script setup lang="ts">
interface Props {
  icon: string
  text: string
  disabled?: boolean
  showActive?: boolean
  activeText?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showActive: false,
  activeText: 'Active',
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="w-full flex flex-row items-center justify-start border-2 border-[var(--color-outline)] rounded-lg bg-[var(--color-bg)] px-5 py-2 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-outline)]"
    :class="props.disabled ? 'cursor-not-allowed' : ''"
    :disabled="props.disabled"
    :tabindex="props.disabled ? -1 : 0"
    @click="emit('click')"
  >
    <div :class="[icon, props.disabled ? 'opacity-50' : '']" class="mr-2 text-3xl" />
    <span class="text-sm font-medium" :class="props.disabled ? 'opacity-50' : ''">{{ text }}</span>
    <span v-if="showActive" class="ml-auto text-xs font-900 opacity-100">{{ activeText }}</span>
  </button>
</template>
