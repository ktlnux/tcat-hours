import scheduleData from '../data/schedule.json'

export const SEMESTERS_DATA = scheduleData.semesters

// Build sorted semester keys (chronologically by start date)
export const SEMESTER_KEYS = Object.keys(SEMESTERS_DATA).sort((a, b) => {
  return SEMESTERS_DATA[a].start.localeCompare(SEMESTERS_DATA[b].start)
})

// Semesters that can't start a full 3-semester program / aren't offered for enrollment
export const HIDDEN_SEMESTERS = new Set(['spring-2025', 'summer-2025', 'spring-2027'])

export function hhmmToMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Convert holidays arrays to Sets for efficient lookup
export const SD = {}
for (const k of SEMESTER_KEYS) {
  const raw = SEMESTERS_DATA[k]
  SD[k] = {
    st: raw.start,
    en: raw.end,
    h: new Set(raw.holidays),
    hpd: raw.hoursPerDay,
    shifts: {
      day: { start: hhmmToMin(raw.shifts.day.start), end: hhmmToMin(raw.shifts.day.end) },
      night: { start: hhmmToMin(raw.shifts.night.start), end: hhmmToMin(raw.shifts.night.end) }
    }
  }
}

export function ds(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// Current date/time in America/New_York, independent of the viewer's device timezone
export function easternParts(atMs = Date.now()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  })
  const parts = {}
  for (const p of fmt.formatToParts(new Date(atMs))) {
    if (p.type !== 'literal') parts[p.type] = p.value
  }
  let hour = parseInt(parts.hour, 10)
  if (hour === 24) hour = 0 // some ICU implementations emit "24" for midnight under hour12:false
  return {
    y: parseInt(parts.year, 10),
    m: parseInt(parts.month, 10),
    d: parseInt(parts.day, 10),
    hour,
    minute: parseInt(parts.minute, 10)
  }
}

export function cdays(s, e, h) {
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

export function tod(atMs) {
  const p = easternParts(atMs)
  return new Date(p.y, p.m - 1, p.d, 12)
}

export function yest(atMs) {
  const t = tod(atMs)
  t.setDate(t.getDate() - 1)
  return t
}

export function tmr(atMs) {
  const t = tod(atMs)
  t.setDate(t.getDate() + 1)
  return t
}

export function isClassDay(enrollmentKey, dateStr) {
  const s = SD[enrollmentKey]
  if (!s || dateStr < s.st || dateStr > s.en) return false
  const dow = new Date(dateStr + 'T12:00:00').getDay()
  if (dow === 0 || dow === 6) return false
  return !s.h.has(dateStr)
}

export function defaultSem() {
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

export function semOf(d, semesterKeys) {
  for (const k of semesterKeys) {
    if (d >= SD[k].st && d <= SD[k].en) return k
  }
  return null
}

export function fmtD(str) {
  const [y, m, d] = str.split('-')
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1] + ' ' + +d + ', ' + y
}

export function formatDateRange(start, end) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [, sm, sd] = start.split('-')
  const [, em, ed] = end.split('-')
  return `${months[+sm - 1]} ${+sd} – ${months[+em - 1]} ${+ed}`
}
