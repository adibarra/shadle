<script setup lang="ts">
const { t } = useI18n()
const commitHash = import.meta.env.VITE_COMMIT_HASH
</script>

<template>
  <BaseModal modal-name="credits" :title="t('credits.title')">
    <div class="space-y-4">
      <p class="text-sm">
        {{ t('credits.description') }}
        <a
          href="https://adibarra.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Portfolio Website"
          aria-label="Visit adibarra's portfolio website"
          class="text-[var(--color-accent)] font-600 underline-1 outline-none focus:underline hover:underline"
        >
          adibarra
        </a>
      </p>
      <p class="text-xs">
        Build version: {{ commitHash }}
      </p>
    </div>
  </BaseModal>
</template>
