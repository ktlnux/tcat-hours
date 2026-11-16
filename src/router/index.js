import { createRouter, createWebHashHistory } from 'vue-router'
import AttendanceView from '../views/AttendanceView.vue'
import CalendarView from '../views/CalendarView.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'attendance', component: AttendanceView },
    { path: '/calendar', name: 'calendar', component: CalendarView }
  ]
})
