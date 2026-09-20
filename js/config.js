/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - DOMAIN CONFIGURATION & CONSTANTS
 * =========================================================================
 */

const FIREBASE_CONFIG = Object.freeze({
  apiKey: "AIzaSyASOiqcD4RLQBZJ7DMrO6GO_y2pUOYpHGg",
  authDomain: "janaklis-os.firebaseapp.com",
  projectId: "janaklis-os",
  storageBucket: "janaklis-os.firebasestorage.app",
  messagingSenderId: "366648641503",
  appId: "1:366648641503:web:7e31c6d9bd0ea0ff23666a"
});

/**
 * Valid Active Navigation Tabs
 */
const TABS_CONFIG = Object.freeze({
  ROUTINE: 'routine',
  CURRICULUM: 'curriculum',
  LANGUAGES: 'languages',
  ROADMAP: 'roadmap',
  PROGRAMMING: 'programming',
  ALLOWED_TABS: Object.freeze(['routine', 'curriculum', 'languages', 'roadmap', 'programming'])
});

/**
 * Routine Habits Configuration & Weights
 */
const HABITS_CONFIG = Object.freeze({
  PRAYERS: Object.freeze([
    { id: 'fajr', name: 'صلاة الفجر', icon: 'fa-sun', time: '04:30 ص' },
    { id: 'dhuhr', name: 'صلاة الظهر', icon: 'fa-sun', time: '12:00 م' },
    { id: 'asr', name: 'صلاة العصر', icon: 'fa-cloud-sun', time: '03:30 م' },
    { id: 'maghrib', name: 'صلاة المغرب', icon: 'fa-mountain-sun', time: '06:15 م' },
    { id: 'isha', name: 'صلاة العشاء', icon: 'fa-moon', time: '07:45 م' }
  ]),
  WEIGHTS: Object.freeze({
    PRAYER_TOTAL: 30,
    PRAYER_SINGLE: 6,
    QURAN: 20,
    GYM: 25,
    SLEEP: 25
  })
});

/**
 * Master Application Configuration
 */
const APP_CONFIG = Object.freeze({
  STORAGE_KEY: 'janaklis_life_academic_os_v56',
  SOUND_MUTED_KEY: 'janaklis_sound_muted',
  TOTAL_SEMESTER_DAYS: 112,
  TOTAL_WEEKS: 19,
  TOTAL_SUBJECTS: 6,
  WEIGHTS: HABITS_CONFIG.WEIGHTS,
  PRAYERS: HABITS_CONFIG.PRAYERS,
  SUBJECTS: Object.freeze([
    { id: 0, name: "مبادئ إدارة الأعمال", icon: "fa-briefcase", color: "blue" },
    { id: 1, name: "المحاسبة المالية", icon: "fa-calculator", color: "emerald" },
    { id: 2, name: "مبادئ الإقتصاد", icon: "fa-chart-line", color: "amber" },
    { id: 3, name: "مبادئ القانون", icon: "fa-scale-balanced", color: "purple" },
    { id: 4, name: "علم النفس", icon: "fa-brain", color: "rose" },
    { id: 5, name: "اللغة الإنجليزية", icon: "fa-language", color: "cyan" }
  ]),
  SUBJECT_NAMES: Object.freeze([
    "مبادئ إدارة الأعمال", "المحاسبة المالية", "مبادئ الإقتصاد",
    "مبادئ القانون", "علم النفس", "اللغة الإنجليزية"
  ]),
  SUBJECT_COLOR_KEYS: Object.freeze(['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan']),
  PROGRAMMING_COURSES: Object.freeze([])
});

const colorStyles = Object.freeze({
  blue: {
    cardBg: 'bg-white',
    border: 'border-blue-300 hover:border-blue-500 shadow-md',
    badge: 'bg-blue-600 text-white shadow-2xs',
    iconBg: 'bg-blue-50 border border-blue-200',
    iconColor: 'text-blue-700 font-black',
    bulletBg: 'bg-blue-50 text-blue-800 border border-blue-200 font-bold',
    progressBar: 'bg-blue-600'
  },
  emerald: {
    cardBg: 'bg-white',
    border: 'border-emerald-300 hover:border-emerald-500 shadow-md',
    badge: 'bg-emerald-600 text-white shadow-2xs',
    iconBg: 'bg-emerald-50 border border-emerald-200',
    iconColor: 'text-emerald-700 font-black',
    bulletBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold',
    progressBar: 'bg-emerald-600'
  },
  amber: {
    cardBg: 'bg-white',
    border: 'border-amber-300 hover:border-amber-500 shadow-md',
    badge: 'bg-amber-600 text-white shadow-2xs',
    iconBg: 'bg-amber-50 border border-amber-200',
    iconColor: 'text-amber-700 font-black',
    bulletBg: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
    progressBar: 'bg-amber-600'
  },
  purple: {
    cardBg: 'bg-white',
    border: 'border-purple-300 hover:border-purple-500 shadow-md',
    badge: 'bg-purple-600 text-white shadow-2xs',
    iconBg: 'bg-purple-50 border border-purple-200',
    iconColor: 'text-purple-700 font-black',
    bulletBg: 'bg-purple-50 text-purple-800 border border-purple-200 font-bold',
    progressBar: 'bg-purple-600'
  },
  rose: {
    cardBg: 'bg-white',
    border: 'border-rose-300 hover:border-rose-500 shadow-md',
    badge: 'bg-rose-600 text-white shadow-2xs',
    iconBg: 'bg-rose-50 border border-rose-200',
    iconColor: 'text-rose-700 font-black',
    bulletBg: 'bg-rose-50 text-rose-800 border border-rose-200 font-bold',
    progressBar: 'bg-rose-600'
  },
  cyan: {
    cardBg: 'bg-white',
    border: 'border-cyan-300 hover:border-cyan-500 shadow-md',
    badge: 'bg-cyan-600 text-white shadow-2xs',
    iconBg: 'bg-cyan-50 border border-cyan-200',
    iconColor: 'text-cyan-700 font-black',
    bulletBg: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold',
    progressBar: 'bg-cyan-600'
  }
});
