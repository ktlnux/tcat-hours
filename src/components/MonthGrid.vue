<template>
  <div class="mgrid-wrap">
    <h3 class="mgrid-label">{{ month.label }}</h3>
    <div class="mgrid">
      <span v-for="h in weekdayHeaders" :key="h" class="mgrid-h">{{ h }}</span>
      <template v-for="(week, wi) in month.weeks" :key="wi">
        <div
          v-for="(cell, ci) in week"
          :key="ci"
          class="mgrid-cell"
          :class="{
            'mgrid-blank': !cell,
            'mgrid-out': cell && !cell.inSemester,
            'mgrid-noclass': cell && cell.inSemester && !cell.isClassDay,
            'mgrid-today': cell && cell.isToday
          }"
        >
          <template v-if="cell">
            <span class="mgrid-daynum">{{ cell.dayNum }}</span>
            <span v-if="cell.isSemesterStart" class="mgrid-tag">Start</span>
            <span v-else-if="cell.isSemesterEnd" class="mgrid-tag">End</span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  month: {
    type: Object,
    required: true
  },
  weekdayHeaders: {
    type: Array,
    required: true
  }
})
</script>
