<template>
  <div class="fn">
    <!-- Program from {{ data.enrollmentSemester }}: <span class="mn">{{ data.programTotal }}</span> · 91% threshold: <span class="mn">{{ data.thresholdAmount }}</span><br> -->
    <template v-for="(sem, index) in data.semesterHours" :key="sem.name">
      {{ sem.name }}: <span class="mn">{{ sem.hours }}</span><template v-if="index < data.semesterHours.length - 1"> · </template>
    </template>
    · 6.5h / class day
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
