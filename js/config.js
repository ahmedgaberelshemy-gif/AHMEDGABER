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
    cardBg: 'bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950',
    border: 'border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10',
    badge: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/25',
    iconColor: 'text-slate-950 font-black',
    bulletBg: 'bg-slate-800 text-amber-200 border-slate-700 font-bold',
    progressBar: 'bg-amber-500'
  },
  emerald: {
    cardBg: 'bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950',
    border: 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10',
    badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-emerald-950/80 text-emerald-200 border-emerald-800/60 font-bold',
    progressBar: 'bg-emerald-500'
  },
  amber: {
    cardBg: 'bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-950',
    border: 'border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10',
    badge: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-amber-950/80 text-amber-200 border-amber-800/60 font-bold',
    progressBar: 'bg-amber-500'
  },
  purple: {
    cardBg: 'bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-slate-950',
    border: 'border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10',
    badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-purple-950/80 text-purple-200 border-purple-800/60 font-bold',
    progressBar: 'bg-purple-500'
  },
  rose: {
    cardBg: 'bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-950',
    border: 'border-rose-500/40 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/10',
    badge: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-rose-950/80 text-rose-200 border-rose-800/60 font-bold',
    progressBar: 'bg-rose-500'
  },
  cyan: {
    cardBg: 'bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950',
    border: 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10',
    badge: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-cyan-950/80 text-cyan-200 border-cyan-800/60 font-bold',
    progressBar: 'bg-cyan-500'
  }
});
