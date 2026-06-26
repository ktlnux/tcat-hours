import { ref, computed } from 'vue'
import scheduleData from '../data/schedule.json'

const HPD = scheduleData.hoursPerDay
const THR = scheduleData.graduationThreshold
const SEMESTERS_REQUIRED = scheduleData.semestersRequired || 3
const SEMESTERS_DATA = scheduleData.semesters

// Build sorted semester keys (chronologically by start date)
const SEMESTER_KEYS = Object.keys(SEMESTERS_DATA).sort((a, b) => {
  return SEMESTERS_DATA[a].start.localeCompare(SEMESTERS_DATA[b].start)
})

// Convert holidays arrays to Sets for efficient lookup
const SD = {}
for (const k of SEMESTER_KEYS) {
  SD[k] = {
    st: SEMESTERS_DATA[k].start,
    en: SEMESTERS_DATA[k].end,
    h: new Set(SEMESTERS_DATA[k].holidays)
  }
}

// Helper functions
function ds(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function cdays(s, e, h) {
  const c = new Date(s + 'T12:00:00')
  const end = new Date(e + 'T12:00:00')
  const days = []
  while (c <= end) {
    const dw = c.getDay()
    if (dw >= 1 && dw <= 5 && !h.has(ds(c))) {
      days.push(ds(c))
    }
    c.setDate(c.getDate() + 1)
  }
  return days
}

// Get the program semesters for a given enrollment semester (3 consecutive)
function getProgramSemesters(enrollmentKey) {
  const idx = SEMESTER_KEYS.indexOf(enrollmentKey)
  if (idx === -1) return []
  return SEMESTER_KEYS.slice(idx, idx + SEMESTERS_REQUIRED)
}

// Get class days within a range, filtered to specific semesters
function inSems(f, t, semesterKeys) {
  const days = []
  for (const k of semesterKeys) {
    const s = SD[k]
    const st = f > s.st ? f : s.st
    const en = t < s.en ? t : s.en
    if (st > en) continue
    days.push(...cdays(st, en, s.h))
  }
  return days
}

// Pre-compute possible hours per semester
const PH = {}
for (const k of SEMESTER_KEYS) {
  PH[k] = cdays(SD[k].st, SD[k].en, SD[k].h).length * HPD
}

// Pre-compute days per semester
const PD = {}
for (const k of SEMESTER_KEYS) {
  PD[k] = cdays(SD[k].st, SD[k].en, SD[k].h).length
}

function tod() {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12)
}

function yest() {
  const t = tod()
  t.setDate(t.getDate() - 1)
  return t
}

function tmr() {
  const t = tod()
  t.setDate(t.getDate() + 1)
  return t
}

function defaultSem() {
  const today = ds(tod())
  // Find current semester
  for (const k of SEMESTER_KEYS) {
    if (today >= SD[k].st && today <= SD[k].en) return k
  }
  // Find most recent past semester
  for (let i = SEMESTER_KEYS.length - 1; i >= 0; i--) {
    if (today > SD[SEMESTER_KEYS[i]].en) return SEMESTER_KEYS[i]
  }
  return SEMESTER_KEYS[0]
}

function getCutoff(inclToday) {
  return inclToday ? ds(tod()) : ds(yest())
}

function ptd(enrollmentKey, inclToday) {
  const cutoff = getCutoff(inclToday)
  const programSems = getProgramSemesters(enrollmentKey)
  let p = 0
  for (const k of programSems) {
    const s = SD[k]
    if (cutoff < s.st) continue
    p += cdays(s.st, cutoff <= s.en ? cutoff : s.en, s.h).length * HPD
  }
  return p
}

function calcDaysElapsed(enrollmentKey, inclToday) {
  const cutoff = getCutoff(inclToday)
  const programSems = getProgramSemesters(enrollmentKey)
  let n = 0
  for (const k of programSems) {
    const s = SD[k]
    if (cutoff < s.st) continue
    n += cdays(s.st, cutoff <= s.en ? cutoff : s.en, s.h).length
  }
  return n
}

function calcDaysRemaining(enrollmentKey) {
  const tmrS = ds(tmr())
  const programSems = getProgramSemesters(enrollmentKey)
  let n = 0
  for (const k of programSems) {
    const s = SD[k]
    const st = tmrS > s.st ? tmrS : s.st
    if (st > s.en) continue
    n += cdays(st, s.en, s.h).length
  }
  return n
}

function semOf(d, semesterKeys) {
  for (const k of semesterKeys) {
    if (d >= SD[k].st && d <= SD[k].en) return k
  }
  return null
}

function fmtD(str) {
  const [y, m, d] = str.split('-')
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1] + ' ' + +d + ', ' + y
}

function fmtH(n) {
  return n.toFixed(1) + 'h'
}

function getStatusColor(pct) {
  if (pct >= 91) {
    return {
      fill: '#639922',
      text: 'var(--suc-txt)',
      bg: 'var(--suc-bg)',
      border: 'var(--suc-brd)',
      icon: 'ti-circle-check',
      type: 'success'
    }
  }
  if (pct >= 75) {
    return {
      fill: '#BA7517',
      text: 'var(--wrn-txt)',
      bg: 'var(--wrn-bg)',
      border: 'var(--wrn-brd)',
      icon: 'ti-alert-triangle',
      type: 'warning'
    }
  }
  return {
    fill: '#E24B4A',
    text: 'var(--dng-txt)',
    bg: 'var(--dng-bg)',
    border: 'var(--dng-brd)',
    icon: 'ti-alert-circle',
    type: 'danger'
  }
}

function formatDateRange(start, end) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [, sm, sd] = start.split('-')
  const [, em, ed] = end.split('-')
  return `${months[+sm - 1]} ${+sd} – ${months[+em - 1]} ${+ed}`
}

export function useAttendance() {
  // Reactive state
  const selectedSemester = ref('summer-2026')
  const hoursLogged = ref('')
  const includeToday = ref(false)
  const awayPeriods = ref([])
  const impactRules = ref([])

  let nextId = 0

  // Program semesters for the selected enrollment
  const programSemesters = computed(() => getProgramSemesters(selectedSemester.value))

  // Program total hours (sum of 3 consecutive semesters)
  const programTotal = computed(() => {
    return programSemesters.value.reduce((sum, k) => sum + PH[k], 0)
  })

  // Last semester in the program
  const lastProgramSemester = computed(() => {
    const sems = programSemesters.value
    return sems.length > 0 ? sems[sems.length - 1] : null
  })

  // Computed properties
  const hasInput = computed(() => hoursLogged.value !== '')

  const loggedHours = computed(() => {
    const raw = hoursLogged.value.toString().trim()
    return raw !== '' ? Math.max(0, parseFloat(raw) || 0) : 0
  })

  const possibleHours = computed(() => ptd(selectedSemester.value, includeToday.value))

  const hasData = computed(() => possibleHours.value > 0)

  const daysElapsed = computed(() => calcDaysElapsed(selectedSemester.value, includeToday.value))

  const daysRemaining = computed(() => calcDaysRemaining(selectedSemester.value))

  const attendanceRate = computed(() => {
    if (!hasData.value) return 0
    return (loggedHours.value / possibleHours.value) * 100
  })

  const attendanceCapped = computed(() => Math.min(attendanceRate.value, 100))

  const statusColor = computed(() => {
    if (!hasData.value) {
      return {
        fill: '#888',
        text: 'var(--txt2)',
        bg: 'var(--bg2)',
        border: 'var(--brd)',
        icon: 'ti-info-circle',
        type: 'info'
      }
    }
    if (!hasInput.value) {
      return {
        fill: '#175fa5',
        text: 'var(--info-txt)',
        bg: 'var(--info-bg)',
        border: 'var(--info-brd)',
        icon: 'ti-info-circle',
        type: 'info'
      }
    }
    return getStatusColor(attendanceRate.value)
  })

  const statusMessage = computed(() => {
    const surplus = fmtH(Math.max(0, loggedHours.value - possibleHours.value * THR))
    const needed = fmtH(Math.max(0, possibleHours.value * THR - loggedHours.value))
    const firstSem = SEMESTERS_DATA[selectedSemester.value]

    if (!hasData.value) {
      const startDate = new Date(firstSem.start + 'T12:00:00')
      const formatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      return `${firstSem.name} begins ${formatted}. No class hours have elapsed yet.`
    }
    if (!hasInput.value) {
      return 'Enter your timesheet hours total by logging into the Time Clock dashboard.'
    }
    if (attendanceRate.value >= 91) {
      return `On track — you are ${surplus} above the 91% threshold.`
    }
    return `At risk — you need ${needed} more to reach the 91% graduation threshold.`
  })

  const projection = computed(() => {
    const tmrS = ds(tmr())
    const lastSem = lastProgramSemester.value
    if (!lastSem) {
      return {
        futureDays: [],
        presentDays: [],
        awayCount: 0,
        futureHours: 0,
        totalDeduction: 0,
        projectedTotal: loggedHours.value,
        deductionExceeds: false
      }
    }

    const fa = inSems(tmrS, SD[lastSem].en, programSemesters.value)

    const awSet = new Set()
    for (const a of awayPeriods.value) {
      const fs = a.start > tmrS ? a.start : tmrS
      inSems(fs, a.end, programSemesters.value).forEach(d => awSet.add(d))
    }

    const pdays = fa.filter(d => !awSet.has(d))
    const awC = fa.length - pdays.length
    const fh = pdays.length * HPD

    let totDed = 0
    for (const r of impactRules.value) {
      let p = 0
      if (r.unit === 'week') {
        const w = new Set()
        pdays.forEach(d => {
          const dt = new Date(d + 'T12:00:00')
          const dw = dt.getDay()
          const m = new Date(dt)
          m.setDate(dt.getDate() - (dw === 0 ? 6 : dw - 1))
          w.add(ds(m))
        })
        p = w.size
      } else if (r.unit === 'month') {
        const m = new Set()
        pdays.forEach(d => m.add(d.slice(0, 7)))
        p = m.size
      } else {
        const ss = new Set()
        pdays.forEach(d => {
          const sk = semOf(d, programSemesters.value)
          if (sk) ss.add(sk)
        })
        p = ss.size
      }
      totDed += p * r.count * r.hours
    }

    return {
      futureDays: fa,
      presentDays: pdays,
      awayCount: awC,
      futureHours: fh,
      totalDeduction: totDed,
      projectedTotal: loggedHours.value + Math.max(0, fh - totDed),
      deductionExceeds: totDed > fh && fh > 0
    }
  })

  const projectedRate = computed(() => {
    if (programTotal.value <= 0) return 0
    return (projection.value.projectedTotal / programTotal.value) * 100
  })

  const projectedCapped = computed(() => Math.min(projectedRate.value, 100))

  const projectionColor = computed(() => getStatusColor(projectedRate.value))

  const projectionNote = computed(() => {
    if (!hasInput.value) {
      return { text: 'Enter your timesheet hours above to see a projection.', warn: false }
    }
    if (projection.value.deductionExceeds) {
      return {
        text: 'Lateness adjustments exceed remaining class hours — projected additional hours capped at 0.',
        warn: true
      }
    }
    const pts = []
    if (projection.value.awayCount > 0) {
      pts.push(`${projection.value.awayCount} class day${projection.value.awayCount !== 1 ? 's' : ''} planned away (−${fmtH(projection.value.awayCount * HPD)})`)
    }
    if (projection.value.totalDeduction > 0) {
      pts.push(`lateness deductions −${fmtH(projection.value.totalDeduction)}`)
    }
    return {
      text: pts.length ? pts.join(' · ') : 'No adjustments — projection assumes 100% attendance for all remaining class days.',
      warn: false
    }
  })

  // Footer data with dynamic semester info
  const footerData = computed(() => {
    const sems = programSemesters.value
    const semHours = sems.map(k => ({
      name: SEMESTERS_DATA[k].name,
      hours: fmtH(PH[k])
    }))

    return {
      enrollmentSemester: SEMESTERS_DATA[selectedSemester.value]?.name || '',
      programTotal: fmtH(programTotal.value),
      thresholdAmount: fmtH(programTotal.value * THR),
      semesterHours: semHours
    }
  })

  // Projection intro text
  const projectionIntro = computed(() => {
    const lastSem = lastProgramSemester.value
    if (!lastSem) return ''
    return `Assumes full attendance for all remaining class days through ${SEMESTERS_DATA[lastSem].name}, adjusted for the factors below.`
  })

  // Methods
  function addAway(start, end) {
    const effectiveEnd = (!end || end < start) ? start : end
    awayPeriods.value.push({
      id: nextId++,
      start,
      end: effectiveEnd
    })
  }

  function removeAway(id) {
    awayPeriods.value = awayPeriods.value.filter(x => x.id !== id)
  }

  function addRule(hours, count, unit) {
    if (!hours || hours < 0.5 || hours > 6.5 || !count || count < 1) return
    impactRules.value.push({
      id: nextId++,
      hours,
      count,
      unit
    })
  }

  function removeRule(id) {
    impactRules.value = impactRules.value.filter(x => x.id !== id)
  }

  // Get formatted away period info
  function getAwayInfo(away) {
    const tmrS = ds(tmr())
    const fs = away.start > tmrS ? away.start : tmrS
    const fd = inSems(fs, away.end, programSemesters.value).length
    const rng = away.start === away.end ? fmtD(away.start) : `${fmtD(away.start)} – ${fmtD(away.end)}`
    return {
      range: rng,
      futureDays: fd,
      hoursImpact: fmtH(fd * HPD)
    }
  }

  // Semesters list for selector (only show semesters that can start a full program)
  const HIDDEN_SEMESTERS = new Set(['spring-2025', 'summer-2025', 'fall-2026', 'spring-2027'])
  const maxStartIndex = SEMESTER_KEYS.length - SEMESTERS_REQUIRED
  const semesters = SEMESTER_KEYS.slice(0, maxStartIndex + 1)
    .filter(k => !HIDDEN_SEMESTERS.has(k))
    .map(k => ({
      key: k,
      name: SEMESTERS_DATA[k].name,
      dateRange: formatDateRange(SEMESTERS_DATA[k].start, SEMESTERS_DATA[k].end)
    }))

  // Date bounds for time away inputs
  const semesterStart = computed(() => SD[selectedSemester.value]?.st || '')
  const semesterEnd = computed(() => {
    const lastSem = lastProgramSemester.value
    return lastSem ? SD[lastSem].en : ''
  })

  return {
    // State
    selectedSemester,
    hoursLogged,
    includeToday,
    awayPeriods,
    impactRules,

    // Computed
    hasInput,
    loggedHours,
    possibleHours,
    hasData,
    daysElapsed,
    daysRemaining,
    attendanceRate,
    attendanceCapped,
    statusColor,
    statusMessage,
    projection,
    programTotal,
    programSemesters,
    projectedRate,
    projectedCapped,
    projectionColor,
    projectionNote,
    projectionIntro,
    footerData,
    semesters,
    semesterStart,
    semesterEnd,

    // Methods
    addAway,
    removeAway,
    addRule,
    removeRule,
    getAwayInfo,

    // Constants
    threshold: THR,
    hoursPerDay: HPD
  }
}
