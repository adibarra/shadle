<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const ui = useUiStore()
const game = useGameStore()
const { t } = useI18n()

// Date range
const minDate = new Date('2025-11-15')
minDate.setHours(0, 0, 0, 0) // Start of day
const maxDate = new Date()
maxDate.setHours(23, 59, 59, 999) // End of day
maxDate.setDate(maxDate.getDate()) // Today

const selectedDate = ref<Date | null>(null)
const playedDates = ref<Set<string>>(new Set())

async function fetchPlayedDates() {
  try {
    const playerId = localStorage.getItem('shadle-player-id') || ''
    const history = await getHistory(playerId)
    const dates = new Set<string>()
    for (const attempt of history.attempts) {
      if (attempt.puzzle_id.startsWith('§')) {
        const dateStr = attempt.puzzle_id.slice(1)
        dates.add(dateStr)
      }
    }
    playedDates.value = dates
  } catch (error) {
    console.error('Failed to fetch played dates:', error)
  }
}

onMounted(fetchPlayedDates)

function isDateDisabled(date: Date) {
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const minCheck = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
  const maxCheck = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
  if (checkDate <= minCheck || checkDate >= maxCheck) return true

  const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
  return playedDates.value.has(dateStr)
}

async function selectPuzzle() {
  if (!selectedDate.value) return

  const year = selectedDate.value.getFullYear()
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
  const day = String(selectedDate.value.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  ui.close('pastPuzzles')
  await game.setPuzzleMode('past', dateStr)
}
</script>

<template>
  <BaseModal modal-name="pastPuzzles" :title="t('modals.pastPuzzles.title')">
    <div class="space-y-4">
      <p class="text-sm op-50">
        {{ t('modals.pastPuzzles.description') }}
      </p>

      <VueDatePicker
        v-model="selectedDate"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="isDateDisabled"
        :time-config="{ enableTimePicker: false }"
        format="yyyy-MM-dd"
        :placeholder="t('modals.pastPuzzles.placeholder')"
        class="w-full"
        input-class-name="w-full rounded border border-[var(--color-outline)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        menu-class-name="bg-[var(--color-bg)] border border-[var(--color-outline)] rounded shadow-lg"
        calendar-class-name="text-[var(--color-text)]"
        calendar-cell-class-name="hover:bg-[var(--color-accent)] rounded"
        calendar-header-class-name="text-[var(--color-text)] font-semibold"
      />

      <button
        :disabled="!selectedDate"
        class="w-full rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        @click="selectPuzzle"
      >
        {{ t('modals.pastPuzzles.selectDate') }}
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
/* Additional date picker styling to match theme */
:deep(.dp__input) {
  border-color: var(--color-outline);
  background-color: var(--color-bg);
  color: var(--color-text);
}

:deep(.dp__menu) {
  background-color: var(--color-bg);
  border-color: var(--color-outline);
  color: var(--color-text);
}

:deep(.dp__calendar_header) {
  color: var(--color-text);
}

:deep(.dp__cell_inner) {
  color: var(--color-text);
}

:deep(.dp__cell_inner:hover) {
  background-color: var(--color-accent);
}

:deep(.dp__today) {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.dp__active_date) {
  background-color: rgb(59, 130, 246);
  color: white;
}

/* Hide the time picker section completely */
:deep(.dp__time_display),
:deep(.dp__time_picker_overlay),
:deep(.dp__button[aria-label='Open time picker']) {
  display: none !important;
}

/* Fix hover styling to not affect time picker */
:deep(.dp__time_display:hover) {
  background-color: transparent !important;
}

/* Make sure the selected date display at bottom is visible */
:deep(.dp__selection_display) {
  color: var(--color-text) !important;
}

:deep(.dp__selection_preview) {
  color: var(--color-text) !important;
}

:deep(.dp__action_select) {
  color: var(--color-text) !important;
}

/* Fix cancel button text color */
:deep(.dp__action_button.dp__action_cancel) {
  color: var(--color-text) !important;
}

:deep(.dp__action_button.dp__action_cancel:hover) {
  color: var(--color-accent) !important;
}

/* Fix month/year display text color */
:deep(.dp__month_year_select) {
  color: var(--color-text) !important;
}

:deep(.dp__month_year_wrap) {
  color: var(--color-text) !important;
}

:deep(.dp__month_year_select select) {
  color: var(--color-text) !important;
  background-color: var(--color-bg) !important;
  border-color: var(--color-outline) !important;
}

/* Gray out disabled/unselectable dates */
:deep(.dp__cell_disabled),
:deep(.dp__cell_out_of_range) {
  opacity: 0.3 !important;
  pointer-events: none !important;
  background-color: transparent !important;
}

:deep(.dp__cell_disabled .dp__cell_inner),
:deep(.dp__cell_out_of_range .dp__cell_inner) {
  color: var(--color-text) !important;
  opacity: 0.3 !important;
  background-color: transparent !important;
}

/* Additional styling for dates before min date */
:deep(.dp__calendar .dp__cell:not(.dp__cell_disabled):not(.dp__cell_out_of_range)) {
  /* Ensure enabled dates are fully visible */
  opacity: 1 !important;
}
</style>
