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

const APP_CONFIG = Object.freeze({
  STORAGE_KEY: 'janaklis_life_academic_os_v45',
  SOUND_MUTED_KEY: 'janaklis_sound_muted',
  TOTAL_SEMESTER_DAYS: 112,
  TOTAL_WEEKS: 19,
  TOTAL_SUBJECTS: 6,
  WEIGHTS: {
    PRAYER_TOTAL: 30,
    PRAYER_SINGLE: 6,
    QURAN: 20,
    GYM: 25,
    SLEEP: 25
  },
  PRAYERS: [
    { id: 'fajr', name: 'صلاة الفجر', icon: 'fa-sun', time: '04:30 ص' },
    { id: 'dhuhr', name: 'صلاة الظهر', icon: 'fa-sun', time: '12:00 م' },
    { id: 'asr', name: 'صلاة العصر', icon: 'fa-cloud-sun', time: '03:30 م' },
    { id: 'maghrib', name: 'صلاة المغرب', icon: 'fa-mountain-sun', time: '06:15 م' },
    { id: 'isha', name: 'صلاة العشاء', icon: 'fa-moon', time: '07:45 م' }
  ],
        SUBJECTS: [
    { id: 0, name: "مبادئ إدارة الأعمال", icon: "fa-briefcase", color: "blue" },
    { id: 1, name: "المحاسبة المالية", icon: "fa-calculator", color: "emerald" },
    { id: 2, name: "مبادئ الإقتصاد", icon: "fa-chart-line", color: "amber" },
    { id: 3, name: "مبادئ القانون", icon: "fa-scale-balanced", color: "purple" },
    { id: 4, name: "علم النفس", icon: "fa-brain", color: "rose" },
    { id: 5, name: "اللغة الإنجليزية", icon: "fa-language", color: "cyan" }
  ],
  SUBJECT_NAMES: [
    "مبادئ إدارة الأعمال", "المحاسبة المالية", "مبادئ الإقتصاد",
    "مبادئ القانون", "علم النفس", "اللغة الإنجليزية"
  ],
  SUBJECT_COLOR_KEYS: ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'],
  PROGRAMMING_COURSES: [
    {
      id: "cs50",
      title: "كورس CS50",
      icon: "fa-laptop-code",
      color: "indigo"
    },
    {
      id: "html",
      title: "كورس HTML",
      icon: "fa-code",
      color: "orange"
    },
    {
      id: "css",
      title: "كورس CSS",
      icon: "fa-palette",
      color: "blue"
    },
    {
      id: "js",
      title: "كورس JavaScript",
      icon: "fa-bolt",
      color: "amber"
    },
    {
      id: "bootstrap",
      title: "كورس بوت ستراب (Bootstrap)",
      icon: "fa-cubes",
      color: "purple"
    }
  ]
});

const colorStyles = Object.freeze({
  blue: {
    cardBg: 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent',
    border: 'border-blue-200/90 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10',
    badge: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-blue-100/80 text-blue-950 border-blue-200 font-bold'
  },
  emerald: {
    cardBg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent',
    border: 'border-emerald-200/90 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10',
    badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-emerald-100/80 text-emerald-950 border-emerald-200 font-bold'
  },
  amber: {
    cardBg: 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent',
    border: 'border-amber-200/90 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10',
    badge: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-amber-100/80 text-amber-950 border-amber-200 font-bold'
  },
  purple: {
    cardBg: 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent',
    border: 'border-purple-200/90 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10',
    badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-purple-100/80 text-purple-950 border-purple-200 font-bold'
  },
  rose: {
    cardBg: 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent',
    border: 'border-rose-200/90 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/10',
    badge: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-rose-100/80 text-rose-950 border-rose-200 font-bold'
  },
  cyan: {
    cardBg: 'bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent',
    border: 'border-cyan-200/90 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10',
    badge: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs',
    iconBg: 'bg-gradient-to-br from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/25',
    iconColor: 'text-white',
    bulletBg: 'bg-cyan-100/80 text-cyan-950 border-cyan-200 font-bold'
  }
});
