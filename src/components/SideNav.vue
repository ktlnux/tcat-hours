<template>
  <nav class="sidenav" aria-label="Main">
    <div class="sidenav-links">
      <span class="sidenav-title">TCAT Hours</span>
      <router-link to="/" class="sidenav-link" exact-active-class="act">
        <i class="ti ti-clock-hour-4" aria-hidden="true"></i>
        <span>Attendance Tracker</span>
      </router-link>
      <router-link to="/calendar" class="sidenav-link" exact-active-class="act">
        <i class="ti ti-calendar" aria-hidden="true"></i>
        <span>Class Schedule</span>
      </router-link>
    </div>

    <div class="sidenav-shift">
      <span class="sidenav-shift-lbl">Shift</span>
      <div class="segctl" role="group" aria-label="Class shift">
        <button
          type="button"
          class="segbtn"
          :class="{ act: shift === 'day' }"
          :aria-pressed="shift === 'day'"
          @click="shift = 'day'"
        >Day class</button>
        <button
          type="button"
          class="segbtn"
          :class="{ act: shift === 'night' }"
          :aria-pressed="shift === 'night'"
          @click="shift = 'night'"
        >Night class</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useShift } from '../composables/useShift'

const { shift } = useShift()
</script>
