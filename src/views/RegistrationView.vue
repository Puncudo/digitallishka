<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const router = useRouter()

const form = ref({
  firstName: 'ישראלי',
  lastName: 'ישראלי',
  phone: '',
  role: '',
  email: '',
  id: '',
})

const schools = ref([{ name: '', city: '' }])

const roleOptions = ['מש"ק', 'רמ"ד', 'אדמין']
const cityOptions = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'רמת גן', 'פתח תקווה', 'ראשון לציון', 'אשדוד', 'נתניה', 'חולון']
const schoolOptions = ['תיכון אורט באר שבע', 'תיכון אזורי גזר', 'תיכון עירוני א׳ תל אביב', 'תיכון רבין חיפה', 'תיכון הרצליה', 'תיכון בויאר ירושלים', 'תיכון דה שליט רחובות', 'תיכון מקיף ה׳ אשדוד']

const showRoleDropdown = ref(false)

// Drawer state
const showSchoolDrawer = ref(false)
const showCityDrawer = ref(false)
const drawerSchoolIdx = ref(0)
const drawerCityIdx = ref(0)
const schoolSearch = ref('')
const citySearch = ref('')

const filteredSchools = computed(() =>
  schoolOptions.filter(s => s.includes(schoolSearch.value))
)
const filteredCities = computed(() =>
  cityOptions.filter(c => c.includes(citySearch.value))
)

function openSchoolDrawer(idx) {
  drawerSchoolIdx.value = idx
  schoolSearch.value = ''
  showSchoolDrawer.value = true
}

function openCityDrawer(idx) {
  drawerCityIdx.value = idx
  citySearch.value = ''
  showCityDrawer.value = true
}

function selectRole(r) {
  form.value.role = r
  showRoleDropdown.value = false
}

function selectSchool(s) {
  schools.value[drawerSchoolIdx.value].name = s
  showSchoolDrawer.value = false
}

function selectCity(c) {
  schools.value[drawerCityIdx.value].city = c
  showCityDrawer.value = false
}

const canAddSchool = computed(() => {
  const last = schools.value[schools.value.length - 1]
  return last.name && last.city
})

function addSchool() {
  if (canAddSchool.value) {
    schools.value.push({ name: '', city: '' })
  }
}

function submitForm() {
  router.push('/registration-success')
}
</script>

<template>
  <div class="reg-page">
    <!-- Sub-header row -->
    <div class="reg-subheader">
      <svg class="wave-icon" width="31" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.63375 0.953319C9.54875 0.760977 9.42668 0.587275 9.27451 0.442146C9.12234 0.297017 8.94305 0.183309 8.74689 0.107523C8.55074 0.0317371 8.34158 -0.00463967 8.13135 0.000473008C7.92113 0.00558568 7.71398 0.0520875 7.52175 0.137319C6.13272 0.751273 4.94807 1.7494 4.10735 3.01412C3.98353 3.18874 3.89601 3.38643 3.84998 3.59549C3.80394 3.80455 3.80032 4.02071 3.83934 4.23119C3.87836 4.44167 3.95921 4.64218 4.07712 4.82085C4.19502 4.99951 4.34758 5.1527 4.52576 5.27135C4.70394 5.38999 4.90411 5.47167 5.11443 5.51156C5.32474 5.55144 5.54092 5.54872 5.75017 5.50355C5.95941 5.45837 6.15746 5.37168 6.3326 5.24858C6.50773 5.12549 6.65638 4.9685 6.76975 4.78692C7.27411 4.02935 7.98476 3.43197 8.81775 3.06532C9.01009 2.98033 9.18379 2.85826 9.32892 2.70608C9.47405 2.55391 9.58776 2.37462 9.66354 2.17847C9.73933 1.98232 9.7757 1.77315 9.77059 1.56293C9.76548 1.35271 9.71898 1.14556 9.63375 0.953319ZM7.12815 31.9997C7.10325 31.7519 7.00142 31.518 6.83695 31.3309L5.64015 29.9709C4.18472 28.3152 3.04582 26.4062 2.28015 24.3389L0.145746 18.5693C-0.0709188 17.9655 -0.0452066 17.3013 0.217483 16.7161C0.480172 16.1309 0.959402 15.6702 1.55454 15.4308C2.14967 15.1914 2.81441 15.192 3.40916 15.4323C4.00391 15.6726 4.4824 16.1341 4.74415 16.7197L6.48175 20.7101C6.55372 20.875 6.66184 21.0215 6.7981 21.139C6.93436 21.2564 7.09528 21.3417 7.26895 21.3885C7.96975 21.5773 9.30095 22.1149 10.5873 23.0653C10.8437 23.2542 11.1645 23.3334 11.4792 23.2857C11.794 23.238 12.0769 23.0672 12.2657 22.8109C12.4546 22.5546 12.5339 22.2338 12.4862 21.919C12.4384 21.6043 12.2677 21.3214 12.0113 21.1325C10.9262 20.3327 9.72938 19.6966 8.45935 19.2445L7.47055 16.9693C7.4958 16.9092 7.51613 16.8471 7.53135 16.7837L10.1233 6.15972C10.1841 5.88089 10.3003 5.61715 10.4651 5.38423C10.63 5.15131 10.8401 4.95398 11.0828 4.80402C11.3256 4.65405 11.5961 4.55452 11.8782 4.51137C12.1603 4.46822 12.4481 4.48232 12.7246 4.55285C13.0011 4.62337 13.2606 4.74887 13.4876 4.92185C13.7145 5.09483 13.9043 5.31175 14.0456 5.55967C14.1869 5.8076 14.2768 6.08144 14.3099 6.36486C14.3431 6.64828 14.3188 6.93548 14.2385 7.20932L12.1649 14.9533C12.0984 15.2553 12.151 15.5712 12.3118 15.8353C12.4725 16.0994 12.729 16.2913 13.0278 16.3709C13.3265 16.4506 13.6445 16.4118 13.9153 16.2628C14.1862 16.1137 14.3891 15.8659 14.4817 15.5709L16.5553 7.83012L17.5921 3.97092C17.7567 3.43542 18.1226 2.98465 18.6127 2.71346C19.1029 2.44227 19.6792 2.37182 20.2203 2.51694C20.7614 2.66205 21.2251 3.01142 21.5138 3.49151C21.8025 3.97159 21.8936 4.54495 21.7681 5.09092L20.0273 11.5869L18.5809 16.9917C18.511 17.2947 18.5614 17.6131 18.7216 17.8797C18.8818 18.1462 19.1392 18.3402 19.4396 18.4207C19.74 18.5012 20.0599 18.4619 20.3319 18.3111C20.6039 18.1604 20.8068 17.9099 20.8977 17.6125L22.3473 12.2045C22.5119 11.669 22.8778 11.2182 23.3679 10.9471C23.8581 10.6759 24.4344 10.6054 24.9755 10.7505C25.5166 10.8957 25.9803 11.245 26.269 11.7251C26.5577 12.2052 26.6488 12.7786 26.5233 13.3245L21.5633 31.8429C21.3479 31.9474 21.1116 32.0021 20.8721 32.0029H7.12815V31.9997ZM29.0225 4.88292C28.7678 4.55246 28.394 4.33461 27.9808 4.27583C27.5677 4.21705 27.148 4.32198 26.8111 4.56825C26.4743 4.81453 26.247 5.18265 26.1777 5.59413C26.1084 6.00562 26.2025 6.42789 26.4401 6.77092C26.9585 7.48132 27.2881 8.34212 27.3489 9.28932C27.3626 9.49922 27.4175 9.70438 27.5104 9.89308C27.6034 10.0818 27.7326 10.2503 27.8906 10.3891C28.0487 10.5279 28.2326 10.6341 28.4317 10.7018C28.6309 10.7696 28.8414 10.7974 29.0513 10.7837C29.2613 10.7701 29.4664 10.7152 29.6551 10.6222C29.8438 10.5293 30.0124 10.4001 30.1511 10.242C30.2899 10.0839 30.3962 9.90007 30.4639 9.70092C30.5316 9.50176 30.5594 9.29122 30.5457 9.08132C30.4496 7.56559 29.9222 6.10892 29.0257 4.88292H29.0225Z" fill="#FFD16A"/>
      </svg>
      <div class="reg-subheader__text">
        <span>ברוכ/ה הבא/ה,</span>
        <span>אנא מלאו את הפרטים הבאים:</span>
      </div>
    </div>

    <!-- Page content -->
    <div class="reg-content">
      <!-- פרטים אישיים -->
      <div class="form-section">
        <div class="section-header">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0H4C1.79 0 0 1.78 0 3.97V14.03C0 16.22 1.79 18 4 18H16C18.21 18 20 16.22 20 14.03V3.97C20 1.78 18.21 0 16 0ZM6.5 4.17C7.77 4.17 8.81 5.21 8.81 6.48C8.81 7.75 7.77 8.79 6.5 8.79C5.23 8.79 4.19 7.75 4.19 6.48C4.19 5.21 5.23 4.17 6.5 4.17ZM10.37 13.66C10.28 13.76 10.14 13.82 10 13.82H3C2.86 13.82 2.72 13.76 2.63 13.66C2.54 13.56 2.49 13.42 2.5 13.28C2.67 11.6 4.01 10.27 5.69 10.11C6.22 10.06 6.77 10.06 7.3 10.11C8.98 10.27 10.33 11.6 10.49 13.28C10.51 13.42 10.46 13.56 10.37 13.66ZM17 13.75H15C14.59 13.75 14.25 13.41 14.25 13C14.25 12.59 14.59 12.25 15 12.25H17C17.41 12.25 17.75 12.59 17.75 13C17.75 13.41 17.41 13.75 17 13.75ZM17 9.75H13C12.59 9.75 12.25 9.41 12.25 9C12.25 8.59 12.59 8.25 13 8.25H17C17.41 8.25 17.75 8.59 17.75 9C17.75 9.41 17.41 9.75 17 9.75ZM17 5.75H12C11.59 5.75 11.25 5.41 11.25 5C11.25 4.59 11.59 4.25 12 4.25H17C17.41 4.25 17.75 4.59 17.75 5C17.75 5.41 17.41 5.75 17 5.75Z" fill="#5D87FF"/></svg>
          <span class="section-title">פרטים אישיים</span>
        </div>

        <div class="form-fields">
          <div class="field-group">
            <label class="field-label">שם פרטי</label>
            <div class="field-input field-input--readonly">
              <span class="field-value">ישראלי</span>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">שם משפחה</label>
            <div class="field-input field-input--readonly">
              <span class="field-value">ישראלי</span>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">טלפון</label>
            <div class="field-input">
              <input v-model="form.phone" type="tel" placeholder="טלפון" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">תפקיד</label>
            <div class="field-input field-input--select" @click="showRoleDropdown = !showRoleDropdown">
              <span :class="{ placeholder: !form.role }">{{ form.role || 'תפקיד' }}</span>
              <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 4.5L6 7.5L3 4.5" stroke="#2F305C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div v-if="showRoleDropdown" class="dropdown">
              <div v-for="r in roleOptions" :key="r" class="dropdown-item" @click="selectRole(r)">{{ r }}</div>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">דואל</label>
            <div class="field-input">
              <input v-model="form.email" type="email" placeholder="דואל" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">ת.ז.</label>
            <div class="field-input">
              <input v-model="form.id" type="text" placeholder="ת.ז." />
            </div>
          </div>
        </div>
      </div>

      <!-- בתי ספר -->
      <div class="form-section">
        <div class="section-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4.84969V16.7397C22 17.7097 21.21 18.5997 20.24 18.7197L19.93 18.7597C18.29 18.9797 15.98 19.6597 14.12 20.4397C13.47 20.7097 12.75 20.2197 12.75 19.5097V5.59969C12.75 5.22969 12.96 4.88969 13.29 4.70969C15.12 3.71969 17.89 2.83969 19.77 2.67969H19.83C21.03 2.67969 22 3.64969 22 4.84969Z" fill="#5D87FF"/><path d="M10.71 4.70969C8.87999 3.71969 6.10999 2.83969 4.22999 2.67969H4.15999C2.95999 2.67969 1.98999 3.64969 1.98999 4.84969V16.7397C1.98999 17.7097 2.77999 18.5997 3.74999 18.7197L4.05999 18.7597C5.69999 18.9797 8.00999 19.6597 9.86999 20.4397C10.52 20.7097 11.24 20.2197 11.24 19.5097V5.59969C11.24 5.21969 11.04 4.88969 10.71 4.70969ZM4.99999 7.73969H7.24999C7.65999 7.73969 7.99999 8.07969 7.99999 8.48969C7.99999 8.90969 7.65999 9.23969 7.24999 9.23969H4.99999C4.58999 9.23969 4.24999 8.90969 4.24999 8.48969C4.24999 8.07969 4.58999 7.73969 4.99999 7.73969ZM7.99999 12.2397H4.99999C4.58999 12.2397 4.24999 11.9097 4.24999 11.4897C4.24999 11.0797 4.58999 10.7397 4.99999 10.7397H7.99999C8.40999 10.7397 8.74999 11.0797 8.74999 11.4897C8.74999 11.9097 8.40999 12.2397 7.99999 12.2397Z" fill="#5D87FF"/></svg>
          <span class="section-title">בתי ספר</span>
        </div>

        <div class="form-fields">
          <template v-for="(school, idx) in schools" :key="idx">
            <div v-if="idx > 0" class="school-divider" />

            <div class="field-group">
              <label class="field-label">עיר</label>
              <div class="field-input field-input--select" @click="openCityDrawer(idx)">
                <span :class="{ placeholder: !school.city }">{{ school.city || 'עיר' }}</span>
                <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 4.5L6 7.5L3 4.5" stroke="#2F305C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">שם מוסד</label>
              <div class="field-input field-input--select" @click="openSchoolDrawer(idx)">
                <span :class="{ placeholder: !school.name }">{{ school.name || 'שם מוסד' }}</span>
                <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 4.5L6 7.5L3 4.5" stroke="#2F305C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </template>

          <button v-if="canAddSchool" class="add-school-btn" @click="addSchool">
            <span class="add-school-circle">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2.5V9.5" stroke="#5D87FF" stroke-width="1.8" stroke-linecap="round"/><path d="M2.5 6H9.5" stroke="#5D87FF" stroke-width="1.8" stroke-linecap="round"/></svg>
            </span>
            <span class="add-school-text">הוסף בית ספר</span>
          </button>
        </div>
      </div>
    </div>

    <!-- School Drawer -->
    <BaseDrawer v-model="showSchoolDrawer" title="בחירת בית ספר">
      <div class="drawer-content">
        <div class="drawer-search">
          <div class="drawer-search-box">
            <input v-model="schoolSearch" type="text" placeholder="חיפוש..." class="drawer-search-input" />
            <div class="drawer-icon-magnify">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6252 16.6252L12.7647 12.7647M12.7647 12.7647C13.4251 12.1044 13.9489 11.3205 14.3063 10.4577C14.6636 9.59489 14.8476 8.67016 14.8476 7.73629C14.8476 6.80243 14.6637 5.8777 14.3063 5.01492C13.9489 4.15214 13.4251 3.36819 12.7647 2.70785C12.1044 2.04751 11.3205 1.52369 10.4577 1.16632C9.59489 0.808939 8.67016 0.625 7.73629 0.625C6.80243 0.625 5.8777 0.808939 5.01492 1.16632C4.15214 1.52369 3.36819 2.04751 2.70785 2.70785C1.37422 4.04148 0.625 5.85026 0.625 7.73629C0.625 9.62233 1.37422 11.4311 2.70785 12.7647C4.04148 14.0984 5.85026 14.8476 7.73629 14.8476C9.62233 14.8476 11.4311 14.0984 12.7647 12.7647Z" stroke="#2F305C" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="drawer-icon-clear" @mousedown.prevent="schoolSearch = ''">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" rx="9" fill="#EFF3FF"/><path d="M11.8125 11.7562L6.24377 6.1875" stroke="#5D87FF" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.7562 6.24414L6.1875 11.8128" stroke="#5D87FF" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>
        <div class="drawer-divider" />
        <div class="drawer-list">
          <div
            v-for="s in filteredSchools" :key="s"
            class="drawer-list-item"
            @click="selectSchool(s)"
          >{{ s }}</div>
        </div>
      </div>
    </BaseDrawer>

    <!-- City Drawer -->
    <BaseDrawer v-model="showCityDrawer" title="בחירת ישוב">
      <div class="drawer-content">
        <div class="drawer-search">
          <div class="drawer-search-box">
            <input v-model="citySearch" type="text" placeholder="חיפוש..." class="drawer-search-input" />
            <div class="drawer-icon-magnify">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6252 16.6252L12.7647 12.7647M12.7647 12.7647C13.4251 12.1044 13.9489 11.3205 14.3063 10.4577C14.6636 9.59489 14.8476 8.67016 14.8476 7.73629C14.8476 6.80243 14.6637 5.8777 14.3063 5.01492C13.9489 4.15214 13.4251 3.36819 12.7647 2.70785C12.1044 2.04751 11.3205 1.52369 10.4577 1.16632C9.59489 0.808939 8.67016 0.625 7.73629 0.625C6.80243 0.625 5.8777 0.808939 5.01492 1.16632C4.15214 1.52369 3.36819 2.04751 2.70785 2.70785C1.37422 4.04148 0.625 5.85026 0.625 7.73629C0.625 9.62233 1.37422 11.4311 2.70785 12.7647C4.04148 14.0984 5.85026 14.8476 7.73629 14.8476C9.62233 14.8476 11.4311 14.0984 12.7647 12.7647Z" stroke="#2F305C" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="drawer-icon-clear" @mousedown.prevent="citySearch = ''">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" rx="9" fill="#EFF3FF"/><path d="M11.8125 11.7562L6.24377 6.1875" stroke="#5D87FF" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.7562 6.24414L6.1875 11.8128" stroke="#5D87FF" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>
        <div class="drawer-divider" />
        <div class="drawer-list">
          <div
            v-for="c in filteredCities" :key="c"
            class="drawer-list-item"
            @click="selectCity(c)"
          >{{ c }}</div>
        </div>
      </div>
    </BaseDrawer>

    <!-- Sticky submit bar -->
    <div class="submit-bar">
      <button class="submit-btn" @click="submitForm">שליחת טופס</button>
    </div>
  </div>
</template>

<style scoped>
.reg-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #F4F6FB;
}

/* ── Sticky submit bar ── */
.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  padding: 30px;
  background: #FFFFFF;
  box-shadow: 0px -6px 24px rgba(0, 0, 0, 0.05);
  z-index: 20;
}

.submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 52px;
  padding: 0 15px;
  background: #5D87FF;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
}

/* ── Sub-header ── */
.reg-subheader {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 20px;
  gap: 12px;
  background: linear-gradient(275.24deg, #5C6BF3 -1.99%, #4389F7 38.29%, #1FB5FB 88.96%, #00D9FF 99.75%);
}

.reg-subheader__text {
  display: flex;
  flex-direction: column;
  text-align: right;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #fff;
}

.wave-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

/* ── Content ── */
.reg-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 120px;
}

/* ── Form Section ── */
.form-section {
  background: #fff;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.section-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 30px;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: right;
  color: #5D87FF;
}

.form-fields {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.field-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  position: relative;
}

.field-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  text-align: right;
  color: #6D6E8D;
}

.field-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 14px 0 12px;
  gap: 10px;
  width: 100%;
  height: 42px;
  background: #FFFFFF;
  border: 1.5px solid #D0D5E0;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.field-input:focus-within {
  border-color: #5D87FF;
}

.field-input--readonly {
  background: #F4F6FB;
  border-color: #EFF3FF;
  cursor: default;
}

.field-value {
  flex: 1;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
}

.field-input input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
  outline: none;
}

.field-input input::placeholder {
  font-weight: 400;
  color: #ACACBE;
}

.field-input--select {
  cursor: pointer;
  user-select: none;
}

.field-input--select span {
  flex: 1;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
}

.field-input--select span.placeholder {
  font-weight: 400;
  color: #ACACBE;
}

.chevron {
  flex-shrink: 0;
}

/* ── Dropdown ── */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #EFF3FF;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 10px 14px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 15px;
  text-align: right;
  color: #2F305C;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #F0F4FF;
}

/* ── School divider & add button ── */
.school-divider {
  width: 100%;
  height: 0;
  border-top: 2px solid #EAEDEF;
}

.add-school-btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
}

.add-school-circle {
  width: 32px;
  height: 32px;
  background: #BECFFF;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-school-text {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #5D87FF;
}

/* ── Drawer content ── */
.drawer-content {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.drawer-search {
  padding: 0 30px;
  margin-top: 24px;
}

.drawer-search-box {
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
  transition: background 0.2s, border-color 0.2s;
}

.drawer-search-box:focus-within {
  background: #FFFFFF;
  border-color: #5D87FF;
}

.drawer-search-input {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
  outline: none;
}

.drawer-search-box:focus-within .drawer-search-input {
  font-weight: 600;
}

.drawer-search-input::placeholder {
  font-weight: 400;
  color: #ACACBE;
}

/* Magnifying glass: shown by default, hidden on focus */
.drawer-icon-magnify {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.drawer-search-box:focus-within .drawer-icon-magnify {
  display: none;
}

/* X clear button: hidden by default, shown on focus */
.drawer-icon-clear {
  display: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  cursor: pointer;
}

.drawer-search-box:focus-within .drawer-icon-clear {
  display: flex;
}

.drawer-divider {
  width: 100%;
  height: 0;
  border-top: 1px solid #EAEDEF;
  margin: 16px 0 0;
}

.drawer-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 320px;
}

.drawer-list-item {
  padding: 12px 30px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
  cursor: pointer;
  border-bottom: 1px solid #EAEDEF;
}

.drawer-list-item:hover {
  background: #F0F4FF;
}
</style>
