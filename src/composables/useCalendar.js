import { ref, computed } from 'vue'
import {
  SEMESTERS_DATA,
  SEMESTER_KEYS,
  SD,
  ds,
  tod,
  isClassDay,
  defaultSem,
  formatDateRange
} from './useSchedule'

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function monthsInRange(startISO, endISO) {
  const [sy, sm] = startISO.split('-').map(Number)
  const [ey, em] = endISO.split('-').map(Number)
  const months = []
  let y = sy
  let m = sm
  while (y < ey || (y === ey && m <= em)) {
    months.push({ year: y, month: m })
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  return months
}

function buildMonthGrid(year, month, semesterKey) {
  const s = SD[semesterKey]
  const today = ds(tod())
  const firstOfMonth = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const leadingBlanks = firstOfMonth.getDay()

  const cells = []
  for (let i = 0; i < leadingBlanks; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({
      dateStr,
      dayNum: day,
      inSemester: dateStr >= s.st && dateStr <= s.en,
      isClassDay: isClassDay(semesterKey, dateStr),
      isToday: dateStr === today,
      isSemesterStart: dateStr === s.st,
      isSemesterEnd: dateStr === s.en
    })
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return {
    label: firstOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    weeks
  }
}

export function useCalendar() {
  const today = ds(tod())

  const availableSemesters = computed(() => {
    return SEMESTER_KEYS
      .filter(k => SD[k].en >= today)
      .map(k => ({
        key: k,
        name: SEMESTERS_DATA[k].name,
        dateRange: formatDateRange(SEMESTERS_DATA[k].start, SEMESTERS_DATA[k].end)
      }))
  })

  function initialSemester() {
    const def = defaultSem()
    if (availableSemesters.value.some(s => s.key === def)) return def
    return availableSemesters.value[0]?.key || def
  }

  const selectedSemester = ref(initialSemester())

  const months = computed(() => {
    const s = SD[selectedSemester.value]
    if (!s) return []
    return monthsInRange(s.st, s.en).map(({ year, month }) => buildMonthGrid(year, month, selectedSemester.value))
  })

  const semesterDateRange = computed(() => {
    const data = SEMESTERS_DATA[selectedSemester.value]
    return data ? formatDateRange(data.start, data.end) : ''
  })

  return {
    weekdayHeaders: WEEKDAY_HEADERS,
    availableSemesters,
    selectedSemester,
    months,
    semesterDateRange
  }
}
