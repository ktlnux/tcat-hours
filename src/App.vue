<template>
  <div class="wrap">
    <h1>TCAT Attendance Tracker</h1>
    <p class="dl">{{ currentDate }}</p>

    <HoursInput
      v-model="hoursLogged"
      :includeToday="includeToday"
      @update:includeToday="includeToday = $event"
    />

    <StatsGrid
      :possibleHours="hasData ? possibleHours.toFixed(1) + 'h' : null"
      :daysElapsed="hasData ? daysElapsed : null"
      :daysRemaining="daysRemaining"
    />

    <AttendanceCard
      :rate="attendanceRate"
      :cappedRate="attendanceCapped"
      :threshold="threshold"
      :hasData="hasData"
      :color="statusColor"
    />

    <StatusMessage
      v-if="hasInput"
      :message="statusMessage"
      :color="statusColor"
    />

    <div class="sdiv"><span>End of Semester Projection</span></div>
    <p class="intro-text"><span class="intro-em">See how your attendance rate will look at the end of the semester.</span> Assumes full attendance for all remaining class days through Summer 2026, adjusted for the factors below.</p>
    <!-- <p class="proj-intro">{{ projectionIntro }}</p> -->

    <TimeAwayManager
      :modelValue="awayPeriods"
      :semesterStart="semesterStart"
      :semesterEnd="semesterEnd"
      :getAwayInfo="getAwayInfo"
      @add="addAway"
      @remove="removeAway"
    />

    <ImpactsManager
      :modelValue="impactRules"
      @add="addRule"
      @remove="removeRule"
    />

    <ProjectionCard
      :rate="projectedRate"
      :cappedRate="projectedCapped"
      :total="projection.projectedTotal"
      :programTotal="semesterTotal"
      :futureDays="projection.futureDays.length"
      :note="projectionNote"
      :threshold="threshold"
      :color="projectionColor"
    />

    <ProgramFooter :data="footerData" />

    <div class="page-end">
      <hr class="page-rule" />
      <p class="made-by">&lt;3 made by ktln + claude</p>
      <FeedbackButton />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAttendance } from './composables/useAttendance'
import HoursInput from './components/HoursInput.vue'
import StatsGrid from './components/StatsGrid.vue'
import AttendanceCard from './components/AttendanceCard.vue'
import StatusMessage from './components/StatusMessage.vue'
import TimeAwayManager from './components/TimeAwayManager.vue'
import ImpactsManager from './components/ImpactsManager.vue'
import ProjectionCard from './components/ProjectionCard.vue'
import ProgramFooter from './components/ProgramFooter.vue'
import FeedbackButton from './components/FeedbackButton.vue'

const {
  hoursLogged,
  includeToday,
  awayPeriods,
  impactRules,
  hasInput,
  hasData,
  possibleHours,
  daysElapsed,
  daysRemaining,
  attendanceRate,
  attendanceCapped,
  statusColor,
  statusMessage,
  projection,
  programTotal,
  semesterTotal,
  projectedRate,
  projectedCapped,
  projectionColor,
  projectionNote,
  projectionIntro,
  footerData,
  addAway,
  removeAway,
  addRule,
  removeRule,
  getAwayInfo,
  threshold,
  semesterStart,
  semesterEnd
} = useAttendance()

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
