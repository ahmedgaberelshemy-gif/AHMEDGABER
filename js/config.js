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
  LANGUAGES: 'languages',
  ROADMAP: 'roadmap',
  PROGRAMMING: 'programming',
  VISIBLE_TABS: Object.freeze(['routine', 'languages', 'roadmap']),
  ALLOWED_TABS: Object.freeze(['routine', 'languages', 'roadmap', 'programming'])
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
  TOTAL_SEMESTER_DAYS: 98,
  WEIGHTS: HABITS_CONFIG.WEIGHTS,
  PRAYERS: HABITS_CONFIG.PRAYERS
});
