<template>
  <div class="wrap">
    <h1>Class Schedule</h1>
    <p class="dl">{{ semesterDateRange }}</p>

    <SemesterSelector
      :modelValue="selectedSemester"
      :semesters="availableSemesters"
      title="Semester"
      hint="Pick a semester to see its class days and breaks."
      @update:modelValue="selectedSemester = $event"
    />

    <div class="cal-legend">
      <span class="cal-legend-item"><span class="cal-dot cal-dot-class"></span> Class day</span>
      <span class="cal-legend-item"><span class="cal-dot cal-dot-noclass"></span> No class</span>
      <span class="cal-legend-item"><span class="cal-dot cal-dot-today"></span> Today</span>
    </div>

    <MonthGrid
      v-for="m in months"
      :key="m.label"
      :month="m"
      :weekdayHeaders="weekdayHeaders"
    />
  </div>
</template>

<script setup>
import { useCalendar } from '../composables/useCalendar'
import SemesterSelector from '../components/SemesterSelector.vue'
import MonthGrid from '../components/MonthGrid.vue'

const {
  weekdayHeaders,
  availableSemesters,
  selectedSemester,
  months,
  semesterDateRange
} = useCalendar()
</script>
