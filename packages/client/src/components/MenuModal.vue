<script setup lang="ts">
const ui = useUiStore()
const game = useGameStore()
const router = useRouter()
const { t } = useI18n()

// Check current mode
const currentMode = computed(() => game.currentMode)

// Menu options
const menuOptions = computed(() => [
  {
    id: 'daily',
    title: t('menu.dailyPuzzle'),
    icon: 'i-carbon:time',
    action: () => {
      game.setPuzzleMode('daily')
      router.push('/')
      ui.close('menu')
    },
    disabled: false,
    showActive: currentMode.value === 'daily',
  },
  {
    id: 'random',
    title: t('menu.randomPuzzle'),
    icon: 'i-carbon:shuffle',
    action: () => {
      game.setPuzzleMode('random')
      router.push('/')
      ui.close('menu')
    },
    disabled: false,
    showActive: currentMode.value === 'random',
  },
  {
    id: 'archive',
    title: t('menu.pastPuzzles'),
    icon: 'i-carbon:calendar',
    action: () => {
      ui.open('pastPuzzles')
    },
    disabled: false,
    showActive: currentMode.value === 'past',
  },
  {
    id: 'stats',
    title: t('menu.statistics'),
    icon: 'i-carbon:chart-bar',
    action: () => {
      ui.open('statistics')
    },
    disabled: false,
  },
  {
    id: 'instructions',
    title: t('menu.instructions'),
    icon: 'i-carbon:help',
    action: () => {
      ui.open('instructions')
    },
    disabled: false,
  },
  {
    id: 'settings',
    title: t('menu.settings'),
    icon: 'i-carbon:settings',
    action: () => ui.open('settings'),
    disabled: false,
  },
])
</script>

<template>
  <BaseModal modal-name="menu" :title="t('menu.title')">
    <div class="mb-8 flex flex-col gap-4">
      <IconButton
        v-for="option in menuOptions"
        :key="option.id"
        :icon="option.icon"
        :text="option.title"
        :disabled="option.disabled"
        :show-active="option.showActive"
        :active-text="t('menu.active')"
        @click="option.action()"
      />
    </div>
  </BaseModal>
</template>
