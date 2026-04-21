<script setup>
import { ref, computed } from 'vue'
import mockData from '@/data/mock.json'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const admin = mockData.admin
const schools = mockData.schools
const selectedSchoolId = ref(schools[0].id)

const isAll = computed(() => selectedSchoolId.value === 'all')

const selectedSchool = computed(() =>
  schools.find(s => s.id === selectedSchoolId.value)
)

const totalStudents = computed(() => {
  const sum = { 'יא': 0, 'יב': 0 }
  schools.forEach(s => {
    sum['יא'] += s.students['יא']
    sum['יב'] += s.students['יב']
  })
  return sum
})

const displayStudents = computed(() =>
  isAll.value ? totalStudents.value : selectedSchool.value.students
)

function selectSchool(id) {
  selectedSchoolId.value = id
}

// Representatives section
const repsOpen = ref(false)

const displayReps = computed(() => {
  if (isAll.value) {
    return schools.flatMap(s => s.representatives || [])
  }
  return selectedSchool.value?.representatives || []
})

// Drawer
const drawerOpen = ref(false)
const drawerMode = ref('edit') // 'edit' or 'new'
const editingRep = ref(null)

const drawerForm = ref({
  name: '',
  idNumber: '',
  phone: '',
  email: '',
  role: 'רכזת'
})

function openEditDrawer(rep) {
  drawerMode.value = 'edit'
  editingRep.value = rep
  drawerForm.value = {
    name: rep.name,
    idNumber: rep.idNumber,
    phone: rep.phone,
    email: rep.email,
    role: rep.role
  }
  drawerOpen.value = true
}

function openNewDrawer() {
  drawerMode.value = 'new'
  editingRep.value = null
  drawerForm.value = {
    name: '',
    idNumber: '',
    phone: '',
    email: '',
    role: 'רכזת'
  }
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

function padCount(n) {
  return String(n).padStart(2, '0')
}

// Urgent tasks
const displayUrgentTasks = computed(() => {
  if (isAll.value) {
    return schools.flatMap(s => s.urgentTasks || [])
  }
  return selectedSchool.value?.urgentTasks || []
})

// Mission status section
const gradeTab = ref('all') // 'all', 'יא', 'יב'
const statusTab = ref('missions') // 'missions' or 'students'
const activeIndicators = ref(new Set())
const studentSearch = ref('')

// All students with their mission completion stats
const allStudentsList = computed(() => {
  let students
  if (isAll.value) {
    students = schools.flatMap(s =>
      (s.missionData.missionStudents || []).map(st => {
        const missions = s.missionData.missions
        const total = missions.length
        const completed = missions.filter(m => st.statuses[m.id] === 'בוצע').length
        const missing = total - completed
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0
        return { ...st, totalMissions: total, completedMissions: completed, missingMissions: missing, completionPct: percent }
      })
    )
  } else {
    const s = selectedSchool.value
    const missions = s?.missionData?.missions || []
    students = (s?.missionData?.missionStudents || []).map(st => {
      const total = missions.length
      const completed = missions.filter(m => st.statuses[m.id] === 'בוצע').length
      const missing = total - completed
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0
      return { ...st, totalMissions: total, completedMissions: completed, missingMissions: missing, completionPct: percent }
    })
  }
  // Apply indicator filters
  if (activeIndicators.value.size > 0) {
    students = students.filter(st =>
      [...activeIndicators.value].every(f => (st.indicators || []).includes(f))
    )
  }
  return students
})

const filteredStudentsList = computed(() => {
  if (!studentSearch.value) return allStudentsList.value
  const q = studentSearch.value.trim()
  return allStudentsList.value.filter(s =>
    s.name.includes(q) || s.idNumber.includes(q)
  )
})

// Filter drawer
const filterDrawerOpen = ref(false)
const filterSelections = ref({
  type: 'צו בצוותא',
  dateFrom: 'הכל',
  dateTo: '',
  grade: '',
  malshabStatus: '',
  missions: new Set(),
  missionStatus: ''
})

const hasActiveFilters = computed(() => {
  const f = filterSelections.value
  return f.type !== 'צו בצוותא' || f.dateFrom !== 'הכל' || f.dateTo || f.grade || f.malshabStatus || f.missions.size > 0 || f.missionStatus
})

function openFilterDrawer() {
  filterDrawerOpen.value = true
}

function closeFilterDrawer() {
  filterDrawerOpen.value = false
}

function toggleFilterPill(section, value) {
  const f = filterSelections.value
  if (section === 'missions') {
    const s = new Set(f.missions)
    if (s.has(value)) s.delete(value)
    else s.add(value)
    f.missions = s
  } else {
    f[section] = f[section] === value ? '' : value
  }
}

function clearAllFilters() {
  filterSelections.value = {
    type: 'צו בצוותא',
    dateFrom: 'הכל',
    dateTo: '',
    grade: '',
    malshabStatus: '',
    missions: new Set(),
    missionStatus: ''
  }
}

// Student detail drawer
const studentDrawerOpen = ref(false)
const selectedStudent = ref(null)

function openStudentDrawer(student) {
  selectedStudent.value = student
  studentDrawerOpen.value = true
}

function closeStudentDrawer() {
  studentDrawerOpen.value = false
  selectedStudent.value = null
}

const studentMissionRows = computed(() => {
  if (!selectedStudent.value) return []
  const missions = currentMissionData.value.missions || []
  return missions.map(m => ({
    id: m.id,
    name: m.name,
    status: selectedStudent.value.statuses?.[m.id] || 'לא בוצע'
  }))
})

// Address drawer
const addressDrawerOpen = ref(false)
function openAddressDrawer() { addressDrawerOpen.value = true }
function closeAddressDrawer() { addressDrawerOpen.value = false }

// Dates drawer
const datesDrawerOpen = ref(false)
function openDatesDrawer() { datesDrawerOpen.value = true }
function closeDatesDrawer() { datesDrawerOpen.value = false }

const currentMissionData = computed(() => {
  if (isAll.value) {
    // Aggregate all schools
    const allMissions = schools[0].missionData.missions.map((m, i) => {
      const total = schools.reduce((s, sc) => s + sc.missionData.missions[i].total, 0)
      const completed = schools.reduce((s, sc) => s + sc.missionData.missions[i].completed, 0)
      const missing = schools.reduce((s, sc) => s + sc.missionData.missions[i].missing, 0)
      return {
        ...m,
        total,
        completed,
        missing,
        percent: Math.round((completed / total) * 100),
        hasAlert: schools.some(sc => sc.missionData.missions[i].hasAlert)
      }
    })
    const grades = {}
    for (const g of ['all', 'יא', 'יב']) {
      grades[g] = {
        total: schools.reduce((s, sc) => s + sc.missionData.grades[g].total, 0),
        completed: schools.reduce((s, sc) => s + sc.missionData.grades[g].completed, 0),
        inProgress: schools.reduce((s, sc) => s + sc.missionData.grades[g].inProgress, 0),
        notDone: schools.reduce((s, sc) => s + sc.missionData.grades[g].notDone, 0)
      }
      const t = grades[g].total || 1
      grades[g].completedPct = Math.round((grades[g].completed / t) * 100)
      grades[g].inProgressPct = Math.round((grades[g].inProgress / t) * 100)
      grades[g].notDonePct = Math.round((grades[g].notDone / t) * 100)
    }
    const indicators = schools[0].missionData.indicators.map((ind, i) => ({
      ...ind,
      count: schools.reduce((s, sc) => s + sc.missionData.indicators[i].count, 0)
    }))
    return { missions: allMissions, grades, indicators }
  }
  return selectedSchool.value?.missionData || { missions: [], grades: {}, indicators: [] }
})

const currentGradeData = computed(() => {
  return currentMissionData.value.grades?.[gradeTab.value] || {}
})

const pieSegments = computed(() => {
  const d = currentGradeData.value
  if (!d.total) return ''
  const c = d.completedPct || 0
  const ip = d.inProgressPct || 0
  // conic-gradient for donut
  return `conic-gradient(#5D87FF 0% ${c}%, #FFD16A ${c}% ${c + ip}%, #DEE1FD ${c + ip}% 100%)`
})

// Mission detail view
const missionDetailOpen = ref(false)
const selectedMission = ref(null)
const missionStudentTab = ref('all') // 'all', 'בוצע', 'בתהליך', 'לא בוצע'

function openMissionDetail(mission) {
  selectedMission.value = mission
  missionStudentTab.value = 'all'
  missionDetailOpen.value = true
}

function closeMissionDetail() {
  missionDetailOpen.value = false
  selectedMission.value = null
}

function toggleIndicator(label) {
  const s = new Set(activeIndicators.value)
  if (s.has(label)) {
    s.delete(label)
  } else {
    s.add(label)
  }
  activeIndicators.value = s
}

const missionStudents = computed(() => {
  if (!selectedMission.value) return []
  const missionId = selectedMission.value.id
  const filters = activeIndicators.value
  let students
  if (isAll.value) {
    const missionIndex = schools[0].missionData.missions.findIndex(m => m.name === selectedMission.value.name)
    students = schools.flatMap(s => {
      const schoolMissionId = s.missionData.missions[missionIndex]?.id
      return (s.missionData.missionStudents || []).map(st => ({
        ...st,
        status: st.statuses[schoolMissionId] || 'לא בוצע'
      }))
    })
  } else {
    students = (selectedSchool.value?.missionData?.missionStudents || []).map(st => ({
      ...st,
      status: st.statuses[missionId] || 'לא בוצע'
    }))
  }
  if (filters.size > 0) {
    students = students.filter(st =>
      [...filters].every(f => (st.indicators || []).includes(f))
    )
  }
  return students
})

const filteredMissionStudents = computed(() => {
  if (missionStudentTab.value === 'all') return missionStudents.value
  return missionStudents.value.filter(s => s.status === missionStudentTab.value)
})

const missionStudentCounts = computed(() => {
  const all = missionStudents.value
  return {
    all: all.length,
    completed: all.filter(s => s.status === 'בוצע').length,
    inProgress: all.filter(s => s.status === 'בתהליך').length,
    notDone: all.filter(s => s.status === 'לא בוצע').length
  }
})
</script>

<template>
  <div class="home-view">
    <!-- Blue gradient header -->
    <div class="header-gradient">
      <!-- School selector pills -->
      <div class="school-pills">
        <button
          class="pill"
          :class="{ active: isAll }"
          @click="selectSchool('all')"
        >
          הכל
        </button>
        <button
          v-for="school in schools"
          :key="school.id"
          class="pill"
          :class="{ active: selectedSchoolId === school.id }"
          @click="selectSchool(school.id)"
        >
          {{ school.name }}
        </button>
      </div>

      <!-- Info section -->
      <div class="header-info">
        <!-- School name + students -->
        <div class="name-block">
          <h1 class="school-name">{{ isAll ? 'הכל' : selectedSchool.name }}</h1>
          <div class="students-grades">
            <div class="grade-item">
              <span class="grade-count">{{ displayStudents['יא'] }}</span>
              <span class="grade-label">י״א</span>
            </div>
            <span class="grade-sep">|</span>
            <div class="grade-item">
              <span class="grade-count">{{ displayStudents['יב'] }}</span>
              <span class="grade-label">י״ב</span>
            </div>
          </div>
        </div>

        <div class="divider" />

        <!-- Details rows -->
        <div v-if="!isAll" class="details-block">
          <!-- Row 1: Address (only when single school selected) -->
          <div v-if="!isAll" class="detail-row">
            <div class="detail-content">
              <svg class="detail-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" fill="#FFD16A"/>
                <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" fill="#FFD16A"/>
              </svg>
              <span class="detail-value">{{ selectedSchool.address }}</span>
            </div>
            <div class="detail-link" @click="openAddressDrawer">
              <span class="link-text">לכתובת</span>
            </div>
          </div>

          <!-- Row 2: צו בצוותא (only when single school selected) -->
          <div v-if="!isAll" class="detail-row">
            <div class="detail-content">
              <svg class="detail-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 2V4M8 2V4M3 9H21M21 8V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8C3 5 4.5 3 8 3H16C19.5 3 21 5 21 8Z" stroke="#FFD16A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#FFD16A"/>
                <path d="M8 17C8.55228 17 9 16.5523 9 16C9 15.4477 8.55228 15 8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17Z" fill="#FFD16A"/>
                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="#FFD16A"/>
              </svg>
              <span class="detail-value-bold">{{ selectedSchool.tzvBtzvata.label }} - {{ selectedSchool.tzvBtzvata.date }}</span>
            </div>
            <div class="detail-link" @click="openDatesDrawer">
              <span class="link-text">פרטים</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content below header -->
    <div class="home-body">
      <!-- נציגי בית ספר section -->
      <div class="reps-section">
        <div class="reps-header" @click="repsOpen = !repsOpen">
          <div class="reps-title-row">
            <span class="reps-title">נציגי בית ספר</span>
            <span class="reps-count">{{ padCount(displayReps.length) }} נציגים</span>
          </div>
          <div class="reps-actions">
            <button class="reps-btn" @click.stop="openNewDrawer">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V13M1 7H13" stroke="#2F305C" stroke-width="2.4" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="reps-btn" :class="{ rotated: !repsOpen }">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10 8L6 4L2 8" stroke="#2F305C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="repsOpen" class="reps-list">
          <div v-for="rep in displayReps" :key="rep.id" class="rep-card">
            <div class="rep-info">
              <div class="rep-name-row">
                <span class="rep-name">{{ rep.name }}</span>
                <span class="rep-sep">|</span>
                <span class="rep-id">ת.ז {{ rep.idNumber }}</span>
              </div>
              <span class="rep-role">{{ rep.role }}</span>
              <div class="rep-buttons">
                <a :href="'tel:' + rep.phone" class="rep-action-btn">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M16.5 14.3V16.3C16.5 16.7 16.2 17 15.8 17C7.6 17 1 10.4 1 2.2C1 1.8 1.3 1.5 1.7 1.5H3.7C4.1 1.5 4.4 1.8 4.4 2.2C4.4 3.4 4.6 4.5 5 5.5C5.1 5.8 5 6.1 4.8 6.3L3.3 7.8C4.7 10.5 7 12.8 9.7 14.2L11.2 12.7C11.4 12.5 11.7 12.4 12 12.5C13 12.9 14.1 13.1 15.3 13.1C15.7 13.1 16 13.4 16 13.8L16.5 14.3Z" fill="white"/>
                  </svg>
                </a>
                <a :href="'mailto:' + rep.email" class="rep-action-btn">
                  <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                    <path d="M1 1L9 7L17 1M1 12H17V1H1V12Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <a :href="'https://wa.me/972' + rep.phone.replace(/-/g,'').substring(1)" class="rep-action-btn" target="_blank">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 0C4.03 0 0 4.03 0 9C0 10.59 0.42 12.11 1.2 13.44L0 18L4.68 16.83C5.97 17.54 7.44 17.94 9 17.94C13.97 17.94 18 13.91 18 8.94C18 4.03 13.97 0 9 0ZM13.35 12.24C13.14 12.81 12.21 13.29 11.73 13.35C11.25 13.41 10.65 13.44 10.02 13.23C9.63 13.08 9.12 12.9 8.46 12.6C6.18 11.58 4.74 9.27 4.62 9.12C4.5 8.97 3.72 7.95 3.72 6.87C3.72 5.79 4.26 5.28 4.47 5.04C4.68 4.8 4.92 4.74 5.07 4.74C5.22 4.74 5.37 4.74 5.49 4.74C5.64 4.74 5.82 4.68 6 5.1C6.18 5.52 6.6 6.6 6.66 6.72C6.72 6.84 6.75 6.99 6.66 7.14C6.57 7.29 6.54 7.38 6.42 7.5C6.3 7.62 6.18 7.77 6.06 7.89C5.94 8.01 5.82 8.13 5.94 8.37C6.06 8.61 6.57 9.42 7.32 10.08C8.28 10.92 9.06 11.16 9.3 11.28C9.54 11.4 9.69 11.37 9.84 11.22C9.99 11.07 10.47 10.5 10.65 10.26C10.83 10.02 11.01 10.08 11.25 10.14C11.49 10.2 12.57 10.77 12.81 10.89C13.05 11.01 13.2 11.07 13.26 11.16C13.35 11.37 13.35 11.91 13.14 12.24H13.35Z" fill="white"/>
                  </svg>
                </a>
              </div>
            </div>
            <div class="rep-arrow" @click="openEditDrawer(rep)">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="#5D87FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- משימות דחופות section -->
      <div class="urgent-section">
        <div class="urgent-header">
          <span class="urgent-title">משימות דחופות</span>
          <span class="urgent-link">צפייה בהכל</span>
        </div>
        <div class="urgent-list">
          <div v-for="task in displayUrgentTasks" :key="task.id" class="urgent-card">
            <div class="urgent-bar" :style="{ background: task.color }" />
            <div class="urgent-card-content">
              <div class="urgent-card-top">
                <div class="urgent-name-row">
                  <span class="urgent-name">{{ task.name }}</span>
                  <span class="urgent-sep">|</span>
                  <span class="urgent-id">ת.ז {{ task.idNumber }}</span>
                </div>
                <span class="urgent-desc">{{ task.description }}</span>
              </div>
              <span class="urgent-date">יעד לביצוע {{ task.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mission status section -->
      <div class="missions-section">
        <!-- Grade tabs -->
        <div class="grade-tabs">
          <div class="grade-tabs-row">
            <div
              class="grade-tab"
              :class="{ active: gradeTab === 'all' }"
              @click="gradeTab = 'all'"
            >
              <span>כל התלמידים</span>
              <div v-if="gradeTab === 'all'" class="grade-tab-line" />
            </div>
            <div
              class="grade-tab"
              :class="{ active: gradeTab === 'יא' }"
              @click="gradeTab = 'יא'"
            >
              <span>שכבה י״א</span>
              <div v-if="gradeTab === 'יא'" class="grade-tab-line" />
            </div>
            <div
              class="grade-tab"
              :class="{ active: gradeTab === 'יב' }"
              @click="gradeTab = 'יב'"
            >
              <span>שכבה י״ב</span>
              <div v-if="gradeTab === 'יב'" class="grade-tab-line" />
            </div>
          </div>
          <button class="filter-icon-btn" @click="openFilterDrawer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="#5D87FF" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <div v-if="hasActiveFilters" class="filter-red-dot" />
          </button>
        </div>

        <!-- Indicator pills -->
        <div class="indicator-pills-wrap">
          <div class="indicator-pills">
            <div
              v-for="(ind, i) in currentMissionData.indicators"
              :key="i"
              class="indicator-pill"
              :class="{ active: activeIndicators.has(ind.label) }"
              @click="toggleIndicator(ind.label)"
            >
              {{ ind.label }} {{ ind.count }}
            </div>
          </div>
          <button
            class="clear-filters-btn"
            :style="{ visibility: activeIndicators.size > 0 ? 'visible' : 'hidden' }"
            @click="activeIndicators = new Set()"
          >
            נקה סינונים
          </button>
        </div>

        <!-- Status / Students toggle -->
        <div class="status-toggle">
          <div
            class="toggle-option"
            :class="{ active: statusTab === 'missions' }"
            @click="statusTab = 'missions'"
          >
            סטטוס משימות ראשיות
          </div>
          <div
            class="toggle-option"
            :class="{ active: statusTab === 'students' }"
            @click="statusTab = 'students'"
          >
            רשימת תלמידים
          </div>
        </div>

        <template v-if="statusTab === 'missions'">
          <!-- Pie chart + legend -->
          <div class="pie-row">
            <div class="pie-legend">
              <div class="legend-row">
                <span class="legend-value"><small>({{ currentGradeData.completedPct }}%)</small> {{ currentGradeData.completed }}</span>
                <div class="legend-info">
                  <span class="legend-label">בוצע</span>
                  <div class="legend-dot" style="background: #5D87FF" />
                </div>
              </div>
              <div class="legend-row">
                <span class="legend-value"><small>({{ currentGradeData.inProgressPct }}%)</small> {{ currentGradeData.inProgress }}</span>
                <div class="legend-info">
                  <span class="legend-label">בתהליך</span>
                  <div class="legend-dot" style="background: #FFD16A" />
                </div>
              </div>
              <div class="legend-row">
                <span class="legend-value"><small>({{ currentGradeData.notDonePct }}%)</small> {{ currentGradeData.notDone }}</span>
                <div class="legend-info">
                  <span class="legend-label">לא בוצע</span>
                  <div class="legend-dot" style="background: #DEE1FD" />
                </div>
              </div>
            </div>
            <div class="pie-chart" :style="{ background: pieSegments }">
              <div class="pie-hole">
                <span class="pie-label">סה״כ</span>
                <span class="pie-total">{{ currentGradeData.total }}</span>
              </div>
            </div>
          </div>

          <!-- Mission cards -->
          <div class="mission-cards">
            <div v-for="mission in currentMissionData.missions" :key="mission.id" class="mission-card">
              <div class="mission-arrow" @click="openMissionDetail(mission)">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 2L4 6L8 10" stroke="#5D87FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="mission-content">
                <div class="mission-title-row">
                  <span class="mission-name">{{ mission.name }}</span>
                  <svg v-if="mission.hasAlert" class="mission-alert" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 1.5L18.66 17H1.34L10 1.5Z" fill="#FF1D47"/>
                    <path d="M10 11V7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="10" cy="14" r="0.75" fill="white"/>
                  </svg>
                </div>
                <div class="mission-stats">
                  <div class="mission-stats-text">
                    <span class="mission-stat-dark">{{ mission.completed }}/{{ mission.total }} ביצעו</span>
                    <span class="mission-stat-gray">{{ mission.missing }} חסרים</span>
                  </div>
                  <div class="mission-pct">
                    <span class="mission-pct-sign">%</span><span class="mission-pct-num">{{ mission.percent }}</span>
                  </div>
                </div>
                <div class="mission-bar-row">
                  <div class="mission-bar-track">
                    <div class="mission-bar-fill" :style="{ width: mission.percent + '%' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <!-- Search bar -->
          <div class="sl-search-wrap">
            <div class="sl-search">
              <input
                v-model="studentSearch"
                type="text"
                class="sl-search-input"
                placeholder="חיפוש"
              />
              <svg class="sl-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="#2F305C" stroke-width="1.5" fill="none"/>
                <path d="M14 14L18 18" stroke="#2F305C" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <!-- Student cards -->
          <div class="sl-cards">
            <div v-for="student in filteredStudentsList" :key="student.id" class="sl-card">
              <div class="sl-card-arrow" @click="openStudentDrawer(student)">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 2L4 6L8 10" stroke="#5D87FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="sl-card-content">
                <div class="sl-card-top">
                  <div class="sl-name-row">
                    <span class="sl-name">{{ student.name }}</span>
                    <span class="sl-separator">|</span>
                    <span class="sl-id">ת.ז {{ student.idNumber }}</span>
                  </div>
                </div>
                <div class="sl-card-bottom">
                  <div class="sl-stats-row">
                    <div class="sl-stats-text">
                      <span class="sl-stat-dark">{{ student.completedMissions }}/{{ student.totalMissions }} הושלמו</span>
                      <span class="sl-stat-gray">{{ student.missingMissions }} חסר</span>
                    </div>
                    <div class="sl-pct">
                      <span class="sl-pct-sign">%</span><span class="sl-pct-num">{{ student.completionPct }}</span>
                    </div>
                  </div>
                  <div class="sl-bar-row">
                    <div class="sl-bar-track">
                      <div class="sl-bar-fill" :style="{ width: student.completionPct + '%' }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Edit / New Representative Drawer -->
    <BaseDrawer v-model="drawerOpen">
            <!-- Header -->
            <div class="drawer-header">
              <span class="drawer-title">פרטים מלאים</span>
              <button class="drawer-close" @click="closeDrawer">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <!-- Body -->
            <div class="drawer-body">
              <div class="form-field">
                <label class="form-label">שם הנציג/ה</label>
                <div class="form-input">
                  <input v-model="drawerForm.name" class="form-value-input" type="text" />
                </div>
              </div>
              <div class="form-field">
                <label class="form-label">תעודת זהות</label>
                <div class="form-input">
                  <input v-model="drawerForm.idNumber" class="form-value-input" type="text" />
                </div>
              </div>
              <div class="form-field">
                <label class="form-label">נייד</label>
                <div class="form-input">
                  <input v-model="drawerForm.phone" class="form-value-input" type="tel" />
                </div>
              </div>
              <div class="form-field">
                <label class="form-label">דוא״ל</label>
                <div class="form-input">
                  <input v-model="drawerForm.email" class="form-value-input" type="email" />
                </div>
              </div>
              <div class="form-field">
                <label class="form-label">תפקיד</label>
                <div class="form-input has-chevron">
                  <select v-model="drawerForm.role" class="form-select">
                    <option value="רכזת">רכזת</option>
                    <option value="מנהל">מנהל</option>
                    <option value="יועץ">יועץ</option>
                    <option value="מדריך">מדריך</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="drawer-footer">
              <button v-if="drawerMode === 'edit'" class="remove-btn" @click="closeDrawer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 4.98C14.78 4.71 12.05 4.57 9.33 4.57C7.5 4.57 5.67 4.66 3.84 4.85L2.5 4.98" stroke="#FF1D47" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.08 4.14L7.27 3.05C7.41 2.25 7.5 1.67 8.91 1.67H11.09C12.5 1.67 12.6 2.29 12.73 3.06L12.92 4.14" stroke="#FF1D47" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.71 7.62L15.17 16.11C15.07 17.38 14.99 18.33 12.66 18.33H7.34C5.01 18.33 4.93 17.38 4.83 16.11L4.29 7.62" stroke="#FF1D47" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>הסרת נציג</span>
              </button>
              <button class="save-btn" @click="closeDrawer">שמירה</button>
            </div>
    </BaseDrawer>

    <!-- Filter Drawer -->
    <BaseDrawer v-model="filterDrawerOpen">
            <!-- Header -->
            <div class="filter-header">
              <span class="filter-title">סינון</span>
              <button class="filter-close" @click="closeFilterDrawer">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="filter-body">
              <!-- סוג -->
              <div class="filter-section">
                <div class="filter-section-pills">
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.type === 'צו בצוותא' }"
                    @click="toggleFilterPill('type', 'צו בצוותא')"
                  >צו בצוותא</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.type === 'עצמאים' }"
                    @click="toggleFilterPill('type', 'עצמאים')"
                  >עצמאים</div>
                </div>
              </div>

              <!-- בחירת תאריך -->
              <div class="filter-section">
                <span class="filter-section-label">בחירת תאריך</span>
                <div class="filter-section-pills">
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.dateFrom === 'הכל' }"
                    @click="toggleFilterPill('dateFrom', 'הכל')"
                  >הכל</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.dateFrom === '14.04.26' }"
                    @click="toggleFilterPill('dateFrom', '14.04.26')"
                  >14.04.26</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.dateFrom === '06.05.26' }"
                    @click="toggleFilterPill('dateFrom', '06.05.26')"
                  >06.05.26</div>
                </div>
              </div>

              <!-- כיתה -->
              <div class="filter-section">
                <span class="filter-section-title">כיתה</span>
                <div class="filter-section-pills">
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.grade === 'י״א 1' }"
                    @click="toggleFilterPill('grade', 'י״א 1')"
                  >י״א 1</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.grade === 'י״א 2' }"
                    @click="toggleFilterPill('grade', 'י״א 2')"
                  >י״א 2</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.grade === 'י״א 3' }"
                    @click="toggleFilterPill('grade', 'י״א 3')"
                  >י״א 3</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.grade === 'י״א 4' }"
                    @click="toggleFilterPill('grade', 'י״א 4')"
                  >י״א 4</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.grade === 'י״א 5' }"
                    @click="toggleFilterPill('grade', 'י״א 5')"
                  >י״א 5</div>
                </div>
              </div>

              <!-- סטטוס מלש"ב -->
              <div class="filter-section">
                <span class="filter-section-title">סטטוס מלש״ב</span>
                <div class="filter-section-pills">
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.malshabStatus === 'סטטוס 0' }"
                    @click="toggleFilterPill('malshabStatus', 'סטטוס 0')"
                  >סטטוס 0</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.malshabStatus === 'סטטוס 1' }"
                    @click="toggleFilterPill('malshabStatus', 'סטטוס 1')"
                  >סטטוס 1</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.malshabStatus === 'סטטוס 2' }"
                    @click="toggleFilterPill('malshabStatus', 'סטטוס 2')"
                  >סטטוס 2</div>
                </div>
              </div>

              <!-- משימות -->
              <div class="filter-section">
                <span class="filter-section-title">משימות</span>
                <div class="filter-section-pills">
                  <div
                    v-for="mission in currentMissionData.missions"
                    :key="mission.id"
                    class="filter-pill"
                    :class="{ active: filterSelections.missions.has(mission.name) }"
                    @click="toggleFilterPill('missions', mission.name)"
                  >{{ mission.name }}</div>
                </div>
              </div>

              <!-- סטטוס משימה -->
              <div class="filter-section">
                <span class="filter-section-title">סטטוס משימה</span>
                <div class="filter-section-pills">
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.missionStatus === 'בוצע' }"
                    @click="toggleFilterPill('missionStatus', 'בוצע')"
                  >בוצע</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.missionStatus === 'בתהליך' }"
                    @click="toggleFilterPill('missionStatus', 'בתהליך')"
                  >בתהליך</div>
                  <div
                    class="filter-pill"
                    :class="{ active: filterSelections.missionStatus === 'לא בוצע' }"
                    @click="toggleFilterPill('missionStatus', 'לא בוצע')"
                  >לא בוצע</div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="filter-footer">
              <button class="filter-clear-btn" @click="clearAllFilters">ניקוי</button>
              <button class="filter-apply-btn" @click="closeFilterDrawer">הצגת תוצאות</button>
            </div>
    </BaseDrawer>

    <!-- Student Detail Drawer -->
    <BaseDrawer v-model="studentDrawerOpen">
            <!-- Header -->
            <div class="sd-header">
              <button class="sd-close" @click="closeStudentDrawer">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="sd-header-info">
                <span class="sd-header-name">{{ selectedStudent?.name }}</span>
                <span class="sd-header-id">ת.ז {{ selectedStudent?.idNumber }}</span>
              </div>
            </div>
            <!-- Body -->
            <div class="sd-body">
              <div class="sd-missions">
                <div v-for="row in studentMissionRows" :key="row.id" class="sd-mission-row">
                  <div class="sd-mission-name-row">
                    <span class="sd-mission-name">{{ row.name }}</span>
                  </div>
                  <div
                    class="sd-mission-badge"
                    :class="{
                      'status-done': row.status === 'בוצע',
                      'status-not-done': row.status === 'לא בוצע',
                      'status-in-progress': row.status === 'בתהליך'
                    }"
                  >{{ row.status }}</div>
                </div>
              </div>
            </div>
    </BaseDrawer>

    <!-- Address Drawer -->
    <BaseDrawer v-model="addressDrawerOpen">
            <!-- Header -->
            <div class="addr-header">
              <button class="addr-close" @click="closeAddressDrawer">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
              </button>
              <span class="addr-title">{{ selectedSchool?.name }}</span>
            </div>
            <!-- Waze row -->
            <div class="addr-row">
              <span class="addr-row-label">פתח באמצעות Waze</span>
              <div class="addr-icon-box addr-icon-waze">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path d="M12.5 2C7.25 2 3 6.25 3 11.5C3 16.75 7.25 21 12.5 21C17.75 21 22 16.75 22 11.5C22 6.25 17.75 2 12.5 2Z" fill="white"/>
                  <circle cx="9.5" cy="10" r="1.5" fill="#333"/>
                  <circle cx="15.5" cy="10" r="1.5" fill="#333"/>
                  <path d="M8.5 14.5C9.5 16 11 17 12.5 17C14 17 15.5 16 16.5 14.5" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                </svg>
              </div>
            </div>
            <!-- Divider -->
            <div class="addr-divider" />
            <!-- Google Maps row -->
            <div class="addr-row">
              <span class="addr-row-label">פתח באמצעות Google maps</span>
              <div class="addr-icon-box addr-icon-gmaps">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              </div>
            </div>
    </BaseDrawer>

    <!-- Dates Drawer -->
    <BaseDrawer v-model="datesDrawerOpen">
            <!-- Header -->
            <div class="addr-header">
              <button class="addr-close" @click="closeDatesDrawer">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
              </button>
              <span class="addr-title">{{ selectedSchool?.name }}</span>
            </div>
            <!-- Date row 1 -->
            <div class="dates-row">
              <div class="dates-date">{{ selectedSchool?.tzvBtzvata?.date }}</div>
              <div class="dates-badge">צו בצוותא הבא</div>
              <div class="dates-label">צו אחוד - גברים</div>
            </div>
            <!-- Divider -->
            <div class="addr-divider" />
            <!-- Date row 2 -->
            <div class="dates-row">
              <div class="dates-date">{{ selectedSchool?.tzvBtzvata?.date }}</div>
              <div class="dates-label">צו אחוד - בנות</div>
            </div>
    </BaseDrawer>

    <!-- Mission Detail Overlay -->
    <Transition name="slide">
      <div v-if="missionDetailOpen" class="mission-detail-overlay">
        <!-- Header -->
        <div class="md-header">
          <div class="md-header-circle" />
          <div class="md-header-row">
            <span class="md-title">{{ selectedMission?.name }}</span>
            <button class="md-back" @click="closeMissionDetail">
              <svg width="10" height="14" viewBox="0 0 8 16" fill="none">
                <path d="M2 2L8 8L2 14" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="md-tabs">
          <div
            class="md-tab"
            :class="{ active: missionStudentTab === 'all' }"
            @click="missionStudentTab = 'all'"
          >
            <span>כל התלמידים</span>
            <div v-if="missionStudentTab === 'all'" class="md-tab-bar" />
          </div>
          <div
            class="md-tab"
            :class="{ active: missionStudentTab === 'בוצע' }"
            @click="missionStudentTab = 'בוצע'"
          >
            <span>בוצע ({{ missionStudentCounts.completed }})</span>
            <div v-if="missionStudentTab === 'בוצע'" class="md-tab-bar" />
          </div>
          <div
            class="md-tab"
            :class="{ active: missionStudentTab === 'בתהליך' }"
            @click="missionStudentTab = 'בתהליך'"
          >
            <span>בתהליך ({{ missionStudentCounts.inProgress }})</span>
            <div v-if="missionStudentTab === 'בתהליך'" class="md-tab-bar" />
          </div>
          <div
            class="md-tab"
            :class="{ active: missionStudentTab === 'לא בוצע' }"
            @click="missionStudentTab = 'לא בוצע'"
          >
            <span>לא בוצע ({{ missionStudentCounts.notDone }})</span>
            <div v-if="missionStudentTab === 'לא בוצע'" class="md-tab-bar" />
          </div>
        </div>

        <!-- Student cards -->
        <div class="md-students">
          <div v-for="student in filteredMissionStudents" :key="student.id" class="md-student-card">
            <div
              class="md-status-badge"
              :class="{
                'status-done': student.status === 'בוצע',
                'status-not-done': student.status === 'לא בוצע',
                'status-in-progress': student.status === 'בתהליך'
              }"
            >
              {{ student.status }}
            </div>
            <div class="md-student-info">
              <div class="md-student-name-row">
                <span class="md-student-name">{{ student.name }}</span>
                <svg v-if="student.hasAlert" class="md-student-alert" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.5L18.66 17H1.34L10 1.5Z" fill="#FF1D47"/>
                  <path d="M10 11V7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="10" cy="14" r="0.75" fill="white"/>
                </svg>
              </div>
              <span class="md-student-id">ת.ז {{ student.idNumber }}</span>
            </div>
            <div class="md-student-avatar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="6" r="3" stroke="#2F305C" stroke-width="1.5" fill="none"/>
                <path d="M3.5 17C3.5 13.5 6 11 10 11C14 11 16.5 13.5 16.5 17" stroke="#2F305C" stroke-width="1.5" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.home-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #F5F5F7;
  direction: rtl;
}

/* ── Header ── */
.header-gradient {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0;
  gap: 20px;
  background: linear-gradient(208.28deg, #5C6BF3 -1.76%, #4389F7 40.13%, #1FB5FB 88.46%, #00D9FF 104.03%), #FFFFFF;
  position: relative;
  min-width: 0;
  overflow: hidden;
  width: 100%;
}

/* School pills */
.school-pills {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  scrollbar-width: none;
  -ms-overflow-style: none;
  direction: rtl;
}

.school-pills::-webkit-scrollbar {
  display: none;
}

.pill {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px 2px;
  height: 38px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 13px;
  color: #231B49;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.pill.active {
  background: #2F305C;
  color: #FFFFFF;
  font-weight: 600;
}

/* Header info */
.header-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  gap: 14px;
  width: 100%;
  box-sizing: border-box;
}

.name-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
}

.school-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 30px;
  color: #FFFFFF;
  text-align: right;
  width: 100%;
  margin: 0;
}

.students-grades {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.grade-item {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 6px;
}

.grade-count {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #FFFFFF;
}

.grade-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.7);
}

.grade-sep {
  color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
}

.divider {
  width: calc(100% - 40px);
  height: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Detail rows */
.details-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0;
  gap: 8px;
  width: 100%;
}

.detail-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.detail-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.detail-value {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
}

.detail-value-bold {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
}

.detail-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.detail-link {
  display: flex;
  align-items: center;
}

.link-text {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
  text-decoration: underline;
  cursor: pointer;
}

/* Body */
.home-body {
  flex: 1;
  padding: 0;
  background: #F5F5F7;
}

/* Representatives section */
.reps-section {
  width: 100%;
  background: #FFFFFF;
  padding: 18px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}

.reps-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.reps-title-row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
}

.reps-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #2F305C;
}

.reps-count {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #6D6E8D;
}

.reps-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.reps-btn {
  width: 36px;
  height: 36px;
  background: #EFF3FF;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s;
}

.reps-btn.rotated {
  transform: rotate(180deg);
}

/* Rep cards */
.reps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.rep-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid #EFF3FF;
  border-left: none;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 4px;
}

.rep-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  padding: 8px;
}

.rep-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.rep-name-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.rep-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
}

.rep-sep {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #ACACBE;
}

.rep-id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #6D6E8D;
}

.rep-role {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
  align-self: flex-start;
}

.rep-buttons {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.rep-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 61px;
  height: 36px;
  background: #5D87FF;
  border-radius: 1000px;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  cursor: pointer;
}

/* Urgent tasks section */
.urgent-section {
  width: 100%;
  background: #FFFFFF;
  padding: 20px;
  box-sizing: border-box;
}

.urgent-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.urgent-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #2F305C;
}

.urgent-link {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  text-decoration: underline;
  color: #5D87FF;
  cursor: pointer;
}

.urgent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.urgent-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 0;
  background: #FFFFFF;
  border: 1px solid #EFF3FF;
  border-right: none;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 4px;
  overflow: hidden;
}

.urgent-card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 8px;
  flex: 1;
}

.urgent-card-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
}

.urgent-name-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.urgent-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
}

.urgent-sep {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #ACACBE;
}

.urgent-id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #6D6E8D;
}

.urgent-desc {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
}

.urgent-date {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #6D6E8D;
  align-self: flex-end;
}

.urgent-bar {
  width: 4px;
  align-self: stretch;
  flex-shrink: 0;
}

/* Missions section */
.missions-section {
  width: 100%;
  background: #FFFFFF;
  padding: 0 0 20px;
  margin-top: 8px;
}

/* Grade tabs */
.grade-tabs {
  border-bottom: 1px solid #F5F5F7;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.filter-icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  background: #EFF3FF;
  border-radius: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.filter-red-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #FF1D47;
  border-radius: 50%;
}

.grade-tabs-row {
  display: flex;
  flex-direction: row;
  gap: 36px;
}

.grade-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 20px 0 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.grade-tab span {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #ACACBE;
  white-space: nowrap;
}

.grade-tab.active span {
  font-weight: 600;
  color: #5D87FF;
}

.grade-tab-line {
  width: 30px;
  height: 3px;
  background: #5D87FF;
  border-radius: 8px;
}

/* Indicator pills */
.indicator-pills-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 16px 30px;
  gap: 0;
}

.indicator-pills {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  align-content: flex-end;
  gap: 8px;
}

.clear-filters-btn {
  background: none;
  border: none;
  padding: 0;
  margin-top: 8px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #5D87FF;
  cursor: pointer;
  text-decoration: underline;
  -webkit-tap-highlight-color: transparent;
  min-height: 0;
}

.indicator-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px 2px;
  height: 36px;
  background: #DEE1FD;
  border-radius: 100px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: #5D87FF;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.indicator-pill.active {
  background: #5D87FF;
  color: #FFFFFF;
}

/* Status toggle */
.status-toggle {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: #F5F5F7;
}

.toggle-option {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  flex: 1;
  border-radius: 8px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #6D6E8D;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.toggle-option.active {
  background: #FFFFFF;
  box-shadow: -1px 0px 10px rgba(104, 113, 127, 0.08);
  font-weight: 600;
  color: #2F305C;
}

/* Pie chart */
.pie-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
}

.pie-chart {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-hole {
  width: 60px;
  height: 60px;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #2F305C;
}

.pie-total {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #2F305C;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 50%;
}

.legend-row {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 0;
}

.legend-info {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: flex-end;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 150px;
}

.legend-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
}

.legend-value {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
  color: #2F305C;
  flex: 1;
  text-align: left;
}

.legend-value small {
  font-weight: 400;
  font-size: 14px;
  color: #6D6E8D;
}

/* Mission cards */
.mission-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 30px;
}

.mission-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  padding: 20px 20px 20px 10px;
  gap: 20px;
  background: #FFFFFF;
  border: 1px solid #EFF3FF;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 5px;
}

.mission-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 65px;
  cursor: pointer;
}

.mission-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
}

.mission-title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

.mission-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
}

.mission-alert {
  flex-shrink: 0;
}

.mission-stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.mission-stats-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.mission-stat-dark {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #2F305C;
}

.mission-stat-gray {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #6D6E8D;
}

.mission-bar-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.mission-pct {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.mission-pct-num {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #2F305C;
}

.mission-pct-sign {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #2F305C;
}

.mission-bar-track {
  flex: 1;
  height: 8px;
  background: #EFF3FF;
  border-radius: 100px;
  position: relative;
}

.mission-bar-fill {
  position: absolute;
  height: 8px;
  background: #5D87FF;
  border-radius: 100px;
  left: 0;
  top: 0;
}

/* Students placeholder */
.students-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
}

.students-placeholder span {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #6D6E8D;
}

/* Drawer */
.drawer-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 30px;
  background: #FFFFFF;
  box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 0 0;
  flex-shrink: 0;
  z-index: 1;
}

.drawer-close {
  width: 32px;
  height: 32px;
  background: #EFF3FF;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.drawer-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #5D87FF;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
}

.form-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #6D6E8D;
  text-align: right;
}

.form-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 14px 0 12px;
  width: 100%;
  height: 42px;
  background: #FAFBFF;
  border: 1px solid #EFF3FF;
  border-radius: 2px;
  transition: border-color 0.15s, background-color 0.15s;
}

.form-input:focus-within {
  background: #FFFFFF;
  border: 1px solid #5D87FF;
}

.form-input.has-chevron {
  justify-content: space-between;
}

.field-chevron {
  flex-shrink: 0;
}

.form-value {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #2F305C;
  text-align: right;
}

.form-value-input {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #2F305C;
  text-align: right;
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  height: 100%;
  padding: 0;
}

.form-select {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #2F305C;
  text-align: right;
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  height: 100%;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  direction: rtl;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%232F305C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 0 center;
  background-size: 12px;
  padding-left: 20px;
}

.drawer-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 30px;
  gap: 20px;
  background: #FFFFFF;
  box-shadow: 0px -6px 24px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  height: 52px;
  background: #ACACBE;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  flex: 1;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
  -webkit-tap-highlight-color: transparent;
}

.remove-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 15px;
  height: 52px;
  background: #FFFFFF;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.remove-btn span {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #FF1D47;
}

/* Student List */
.sl-search-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 30px;
  gap: 4px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.sl-search {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 12px 0 14px;
  gap: 10px;
  width: 100%;
  height: 42px;
  background: #FAFBFF;
  border: 1px solid #EFF3FF;
  border-radius: 2px;
}

.sl-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #2F305C;
  text-align: right;
  outline: none;
}

.sl-search-input::placeholder {
  color: #ACACBE;
}

.sl-search-icon {
  flex-shrink: 0;
}

.sl-cards {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 30px;
  gap: 15px;
}

.sl-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  padding: 20px 20px 20px 0;
  gap: 10px;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #EFF3FF;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 5px;
}

.sl-card-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 50px;
  align-self: stretch;
  flex: 1;
  min-height: 65px;
  cursor: pointer;
}

.sl-card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  width: calc(100% - 60px);
}

.sl-card-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.sl-name-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}

.sl-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  text-decoration-line: underline;
  color: #2F305C;
}

.sl-separator {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #ACACBE;
}

.sl-id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #6D6E8D;
}

.sl-card-bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.sl-stats-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.sl-pct {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.sl-pct-num {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #2F305C;
}

.sl-pct-sign {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #2F305C;
}

.sl-stats-text {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}

.sl-stat-dark {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #2F305C;
}

.sl-stat-gray {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #6D6E8D;
}

.sl-bar-row {
  width: 100%;
}

.sl-bar-track {
  width: 100%;
  height: 8px;
  background: #EFF3FF;
  border-radius: 100px;
  position: relative;
  overflow: hidden;
}

.sl-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  background: #5D87FF;
  border-radius: 100px;
}

/* Filter Drawer */
.filter-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 20px 20px;
  background: #FFFFFF;
  box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 0 0;
  flex-shrink: 0;
  z-index: 1;
}

.filter-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #5D87FF;
}

.filter-close {
  width: 32px;
  height: 32px;
  background: #EFF3FF;
  border-radius: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.filter-body {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  gap: 32px;
  overflow-y: auto;
  flex: 1;
  padding-top: 20px;
  padding-bottom: 20px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.filter-section-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 16px;
  color: #2F305C;
  text-align: left;
}

.filter-section-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #2F305C;
  text-align: left;
}

.filter-section-pills {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
}

.filter-pill {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px 2px;
  height: 36px;
  background: #FFFFFF;
  border: 1px solid #D5D6DE;
  border-radius: 100px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.filter-pill.active {
  background: #2F305C;
  border-color: #2F305C;
  color: #FFFFFF;
  font-weight: 600;
}

.filter-footer {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 30px;
  gap: 20px;
  background: #FFFFFF;
  box-shadow: 0px -6px 24px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.filter-apply-btn {
  flex: 1;
  height: 52px;
  background: #5D87FF;
  border-radius: 4px;
  border: none;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
  cursor: pointer;
}

.filter-clear-btn {
  box-sizing: border-box;
  width: 100px;
  height: 52px;
  background: #FFFFFF;
  border: 1px solid #5D87FF;
  border-radius: 4px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #5D87FF;
  cursor: pointer;
}

/* Student Detail Drawer */
.sd-header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 30px;
  background: #FFFFFF;
  box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 0 0;
}

.sd-close {
  width: 32px;
  height: 32px;
  background: #EFF3FF;
  border-radius: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sd-header-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.sd-header-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #5D87FF;
  text-align: left;
}

.sd-header-id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #6D6E8D;
  letter-spacing: -0.02em;
}

.sd-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 30px 30px;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
}

.sd-missions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  width: 100%;
}

.sd-mission-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 4px;
}

.sd-mission-badge {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 12px;
  width: 74px;
  height: 32px;
  box-sizing: border-box;
  border-radius: 4px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  white-space: nowrap;
}

.sd-mission-badge.status-done {
  background: rgba(46, 171, 80, 0.15);
  color: #2EAB50;
}

.sd-mission-badge.status-not-done {
  background: #FFDDE3;
  color: #FF1D47;
}

.sd-mission-badge.status-in-progress {
  background: rgba(0, 160, 230, 0.15);
  color: #00A0E6;
}

.sd-mission-name-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.sd-mission-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  text-align: left;
  color: #2F305C;
}

/* Address & Dates Drawers */
.addr-header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 30px;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 0 0;
}

.addr-close {
  width: 32px;
  height: 32px;
  background: #EFF3FF;
  border-radius: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.addr-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #5D87FF;
  text-align: right;
}

.addr-row {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 30px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.addr-row-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #2F305C;
}

.addr-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.addr-icon-waze {
  background: linear-gradient(180deg, #47D1FF 0%, #0DC3FF 100%);
}

.addr-icon-gmaps {
  background: #FFFFFF;
  border: 1px solid #F0F1FC;
}

.addr-divider {
  width: 100%;
  height: 0;
  border-top: 1px solid #DEE1FD;
}

/* Dates drawer rows */
.dates-row {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.dates-date {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #5D87FF;
}

.dates-badge {
  padding: 3px 8px 4px;
  background: #DEE1FD;
  border-radius: 3px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  text-align: right;
  color: #5D87FF;
}

.dates-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
}

/* Mission Detail Overlay */
.mission-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #F5F5F7;
  display: flex;
  flex-direction: column;
  direction: rtl;
}

.md-header {
  position: relative;
  height: 104px;
  background: linear-gradient(275.24deg, #5C6BF3 -1.99%, #4389F7 38.29%, #1FB5FB 88.96%, #00D9FF 99.75%);
  box-shadow: 0px 4px 34px rgba(0, 4, 57, 0.25);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 11px;
}

.md-header-circle {
  position: absolute;
  width: 350px;
  height: 350px;
  left: -158px;
  top: -195px;
  border-radius: 50%;
  border: 40px solid rgba(255, 255, 255, 0.07);
  pointer-events: none;
  transform: rotate(64.56deg);
}

.md-header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.md-back {
  width: 32px;
  height: 32px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transform: rotate(180deg);
}

.md-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.md-tabs {
  padding: 20px 0 0;
  margin-top: 0;
  border-bottom: 1px solid rgba(214, 222, 230, 0.24);
  background: #FFFFFF;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  padding-right: 20px;
}

.md-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(47, 48, 92, 0.4);
  line-height: 22px;
  white-space: nowrap;
}

.md-tab.active {
  font-weight: 600;
  color: #5D87FF;
}

.md-tab-bar {
  width: 50px;
  height: 3px;
  background: #5D87FF;
  border-radius: 8px;
}

.md-students {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
}

.md-student-card {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 4px;
}

.md-student-avatar {
  width: 40px;
  height: 40px;
  background: #F5F5F7;
  border-radius: 111px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.md-student-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  flex: 1;
}

.md-student-name-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.md-student-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #2F305C;
}

.md-student-id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #6D6E8D;
  letter-spacing: -0.02em;
}

.md-status-badge {
  display: block;
  width: 80px;
  box-sizing: border-box;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.02rem;
  border-radius: 8px;
  padding: 6px 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.md-status-badge.status-done {
  background: rgba(46, 171, 80, 0.15);
  color: #2EAB50;
}

.md-status-badge.status-not-done {
  background: rgba(255, 29, 71, 0.15);
  color: #FF1D47;
}

.md-status-badge.status-in-progress {
  background: rgba(0, 160, 230, 0.15);
  color: #00A0E6;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
