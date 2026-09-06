/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - SERVICES & DOMAIN CALCULATORS (SRP / DIP / LSP)
 * =========================================================================
 */

// 1. STORAGE PROVIDER ABSTRACTION (Liskov Substitution Principle)
class LocalStorageProvider {
  getItem(key) {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch (e) {
      console.warn('LocalStorageProvider: getItem failed', e);
      return null;
    }
  }
  setItem(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('LocalStorageProvider: setItem failed', e);
      return false;
    }
  }
  removeItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('LocalStorageProvider: removeItem failed', e);
      return false;
    }
  }
}

class MemoryStorageProvider {
  constructor() {
    this.storage = new Map();
  }
  getItem(key) {
    return this.storage.has(key) ? this.storage.get(key) : null;
  }
  setItem(key, value) {
    this.storage.set(key, String(value));
    return true;
  }
  removeItem(key) {
    return this.storage.delete(key);
  }
}

// 2. STORAGE SERVICE (Dependency Inversion Principle: consumes any IStorageProvider)
class StorageService {
  constructor(storageKey = (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.STORAGE_KEY : 'janaklis_life_academic_os_v56'), provider = null) {
    this.storageKey = storageKey;
    this.provider = provider || this._resolveProvider();
  }

  _resolveProvider() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return new LocalStorageProvider();
      }
    } catch (e) {
      console.warn('StorageService: Falling back to MemoryStorageProvider', e);
    }
    return new MemoryStorageProvider();
  }

  getTodayKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  createDefaultDayLog() {
    return {
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      gym: { done: false },
      sleep: { done: false },
      quran: { done: false, pages: '' }
    };
  }

  createInitialState() {
    const today = this.getTodayKey();
    return {
      activeTab: 'routine',
      currentWeek: 1,
      lastActiveDate: today,
      dailyLogs: {
        [today]: this.createDefaultDayLog()
      },
      lessonProgress: {},
      lessonNotes: {},
      programmingCourses: {}
    };
  }

  load() {
    try {
      try {
        this.provider.removeItem('janaklis_life_academic_os_v1');
        this.provider.removeItem('janaklis_life_academic_os_v2');
      } catch (e) {}

      const raw = this.provider.getItem(this.storageKey);
      const state = raw ? JSON.parse(raw) : this.createInitialState();
      state.programmingCourses = {};

      // Safety check for active tab: Only routine and achievements are allowed
      if (state.activeTab !== 'achievements') {
        state.activeTab = 'routine';
      }

      this.ensureTodayLog(state);
      return state;
    } catch (error) {
      console.error('StorageService: Error loading state, using defaults.', error);
      return this.createInitialState();
    }
  }

  save(state) {
    try {
      this.provider.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('StorageService: Error saving state.', error);
    }
  }

  ensureTodayLog(state) {
    const today = this.getTodayKey();
    if (!state.dailyLogs) state.dailyLogs = {};
    if (!state.dailyLogs[today]) {
      state.dailyLogs[today] = this.createDefaultDayLog();
    }
  }

  resetAllData() {
    try {
      this.provider.removeItem(this.storageKey);
    } catch (e) {}
    return this.createInitialState();
  }
}

// 3. CLOUD SYNC SERVICE (Single Responsibility: Decoupled via status listeners)
class CloudSyncService {
  constructor(storageService, options = {}) {
    this.storageService = storageService;
    this.syncKey = this.getStoredSyncKey() || 'main_user';
    this.status = 'connecting';
    this.debounceTimer = null;
    this.firestoreDb = null;
    this.unsubscribeListener = null;
    this.statusListeners = [];

    if (options.onStatusChange) {
      this.addStatusListener(options.onStatusChange);
    }

    this.initFirebase();
  }

  addStatusListener(listener) {
    if (typeof listener === 'function') {
      this.statusListeners.push(listener);
      listener(this.status);
    }
  }

  _notifyStatus(status) {
    this.status = status;
    this.statusListeners.forEach(listener => {
      try {
        listener(status);
      } catch (e) {
        console.error('CloudSyncService status listener error:', e);
      }
    });
    this.updateStatusBadge();
  }

  initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.firestoreDb = firebase.firestore();
        this._notifyStatus('connected');
        console.log('✅ Google Firebase Firestore connected successfully!');
      }
    } catch (e) {
      console.warn('Firebase init warning:', e);
      this._notifyStatus('connected');
    }
  }

  getStoredSyncKey() {
    try {
      if (typeof window === 'undefined') return 'main_user';
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get('syncKey');
      if (urlKey) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('janaklis_cloud_sync_key', urlKey.trim().toLowerCase());
        }
        return urlKey.trim().toLowerCase();
      }
      return (typeof localStorage !== 'undefined' ? localStorage.getItem('janaklis_cloud_sync_key') : null) || 'main_user';
    } catch (e) {
      return 'main_user';
    }
  }

  setSyncKey(key) {
    if (!key) {
      this.syncKey = 'main_user';
      try { if (typeof localStorage !== 'undefined') localStorage.removeItem('janaklis_cloud_sync_key'); } catch (e) {}
    } else {
      this.syncKey = key.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '');
      try { if (typeof localStorage !== 'undefined') localStorage.setItem('janaklis_cloud_sync_key', this.syncKey); } catch (e) {}
    }
    this._notifyStatus('connected');
  }

  getShareableLink() {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('syncKey', this.syncKey);
    return url.toString();
  }

  subscribeRealtime(onCloudUpdate) {
    if (!this.firestoreDb) return;
    if (this.unsubscribeListener) this.unsubscribeListener();

    try {
      const docRef = this.firestoreDb.collection('academic_os').doc(this.syncKey || 'main_user');
      this.unsubscribeListener = docRef.onSnapshot((doc) => {
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && cloudData.state && typeof onCloudUpdate === 'function') {
            onCloudUpdate(cloudData.state);
          }
        }
      }, (err) => {
        console.warn('Realtime sync note:', err);
      });
    } catch (e) {}
  }

  async push(state) {
    this._notifyStatus('syncing');

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      try {
        if (this.firestoreDb) {
          const docRef = this.firestoreDb.collection('academic_os').doc(this.syncKey || 'main_user');
          await docRef.set({
            state: state,
            updatedAt: new Date().toISOString(),
            lastDevice: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test'
          });
        }
        this._notifyStatus('connected');
      } catch (e) {
        console.warn('Firebase push warning:', e);
        this._notifyStatus('connected');
      }
    }, 800);
  }

  async pull() {
    this._notifyStatus('syncing');

    try {
      if (this.firestoreDb) {
        const docRef = this.firestoreDb.collection('academic_os').doc(this.syncKey || 'main_user');
        const doc = await docRef.get();
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && cloudData.state) {
            this._notifyStatus('connected');
            return cloudData.state;
          }
        }
      }
    } catch (e) {
      console.warn('Firebase pull note:', e);
    }

    this._notifyStatus('connected');
    return null;
  }

  updateStatusBadge() {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('cloudSyncHeaderBadge');
    if (!badge) return;

    if (this.status === 'syncing') {
      badge.className = 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-display shadow-2xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/30 transition';
      badge.innerHTML = '<i class="fa-solid fa-rotate text-amber-400 animate-spin"></i> <span>جاري الحفظ في Firebase...</span>';
    } else {
      badge.className = 'px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-display shadow-2xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/30 transition';
      badge.innerHTML = '<i class="fa-solid fa-fire text-amber-400"></i> <span>فايربيز متصل 🟢</span>';
    }
  }
}

// 4. DISCIPLINE CALCULATOR (Pure Domain Function)
class DisciplineCalculator {
  static calculateDailyScore(dayLog) {
    if (!dayLog) return 0;

    let score = 0;

    // Prayers: 5 x 6% = 30%
    const prayersCount = Object.values(dayLog.prayers || {}).filter(Boolean).length;
    score += prayersCount * (APP_CONFIG.WEIGHTS.PRAYER_SINGLE || 6);

    // Quran: 20%
    if (dayLog.quran && dayLog.quran.done) {
      score += (APP_CONFIG.WEIGHTS.QURAN || 20);
    }

    // Gym: 25%
    if (dayLog.gym && dayLog.gym.done) {
      score += (APP_CONFIG.WEIGHTS.GYM || 25);
    }

    // Sleep (7-9 Hours): 25%
    if (dayLog.sleep && dayLog.sleep.done) {
      score += (APP_CONFIG.WEIGHTS.SLEEP || 25);
    }

    return Math.min(score, 100);
  }

  static calculateHistoryStats(dailyLogs) {
    const dateKeys = Object.keys(dailyLogs || {});
    let totalLoggedDays = 0;
    let perfectDays = 0;
    let incompleteDays = 0;
    let totalPrayersFullDays = 0;
    let totalGymDays = 0;
    let totalSleepDays = 0;
    let totalQuranDays = 0;

    dateKeys.forEach(date => {
      const log = dailyLogs[date];
      if (!log || !log.submitted) return;

      totalLoggedDays++;

      const prayersDone = Object.values(log.prayers || {}).filter(Boolean).length;
      const isPrayersFull = prayersDone === 5;
      const isGymDone = Boolean(log.gym && log.gym.done);
      const isSleepDone = Boolean(log.sleep && log.sleep.done);
      const isQuranDone = Boolean(log.quran && log.quran.done);

      if (isPrayersFull) totalPrayersFullDays++;
      if (isGymDone) totalGymDays++;
      if (isSleepDone) totalSleepDays++;
      if (isQuranDone) totalQuranDays++;

      const is100PercentDay = isPrayersFull && isQuranDone && isGymDone && isSleepDone;

      if (is100PercentDay) {
        perfectDays++;
      } else {
        incompleteDays++;
      }
    });

    const perfectRate = totalLoggedDays > 0 ? Math.round((perfectDays / totalLoggedDays) * 100) : 0;
    const streak = this.calculateStreak(dailyLogs);
    const rank = this.getRank(perfectDays);

    return {
      totalLoggedDays,
      perfectDays,
      incompleteDays,
      perfectRate,
      streak,
      rank,
      totalPrayersFullDays,
      totalGymDays,
      totalSleepDays,
      totalQuranDays
    };
  }

  static getIncompleteDaysDetails(dailyLogs) {
    if (!dailyLogs) return [];
    const results = [];
    const prayerNames = {
      fajr: 'صلاة الفجر',
      dhuhr: 'صلاة الظهر',
      asr: 'صلاة العصر',
      maghrib: 'صلاة المغرب',
      isha: 'صلاة العشاء'
    };

    const records = Object.entries(dailyLogs || {})
      .map(([key, log]) => ({ key, log }))
      .filter(({ log }) => log && log.submitted)
      .sort((a, b) => new Date(b.log.recordedAt || 0) - new Date(a.log.recordedAt || 0));

    records.forEach(({ key, log }, index) => {
      const missed = [];
      const achieved = [];

      // Prayers
      const prayers = log.prayers || {};
      Object.entries(prayerNames).forEach(([pKey, pName]) => {
        if (prayers[pKey]) {
          achieved.push(pName);
        } else {
          missed.push(pName);
        }
      });

      // Quran
      if (log.quran && log.quran.done) {
        achieved.push('الورد القرآني');
      } else {
        missed.push('الورد القرآني');
      }

      // Gym
      if (log.gym && log.gym.done) {
        achieved.push('تمرين الجيم');
      } else {
        missed.push('تمرين الجيم');
      }

      // Sleep
      if (log.sleep && log.sleep.done) {
        achieved.push('النوم 7-9 ساعات');
      } else {
        missed.push('النوم 7-9 ساعات');
      }

      if (missed.length > 0) {
        let dateFormatted = '';
        if (log.recordedAt) {
          const d = new Date(log.recordedAt);
          dateFormatted = d.toLocaleDateString('ar-EG', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }) + ' (' + d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ')';
        } else {
          dateFormatted = 'اليوم رقم ' + (index + 1);
        }

        results.push({
          key,
          date: dateFormatted,
          missedCount: missed.length,
          achievedCount: achieved.length,
          missed,
          achieved,
          score: this.calculateDailyScore(log)
        });
      }
    });

    return results;
  }

  static calculateStreak(dailyLogs) {
    const records = Object.keys(dailyLogs || {})
      .map(k => dailyLogs[k])
      .filter(l => l && l.submitted && l.recordedAt)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    let streak = 0;
    for (const log of records) {
      const prayersDone = Object.values(log.prayers || {}).filter(Boolean).length;
      const is100 = (prayersDone === 5 && Boolean(log.quran && log.quran.done) && Boolean(log.gym && log.gym.done) && Boolean(log.sleep && log.sleep.done));
      if (is100) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  static getRank(perfectDays = 0) {
    if (perfectDays >= 60) return { title: 'أسطورة الامتياز 👑', level: 4, next: 'القمة المطلقة 🏆', badge: 'shimmer-gold text-slate-950 font-black' };
    if (perfectDays >= 30) return { title: 'جنرال الالتزام 🏆', level: 3, next: 'أسطورة الامتياز (60 يوم)', badge: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black' };
    if (perfectDays >= 10) return { title: 'فارس التحصيل ⚡', level: 2, next: 'جنرال الالتزام (30 يوم)', badge: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black' };
    return { title: 'طالب منضبط 🌟', level: 1, next: 'فارس التحصيل (10 أيام)', badge: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-bold' };
  }
}

// 5. ACADEMIC CALCULATOR (Subject & Semester Progress)
class AcademicCalculator {
  static getSubjectStats(weeks, lessonProgress, subjectIndex) {
    let total = 0;
    let completed = 0;

    (weeks || []).forEach(weekObj => {
      const subject = weekObj.subjects ? weekObj.subjects[subjectIndex] : null;
      if (subject && Array.isArray(subject.lessons)) {
        subject.lessons.forEach((_, lessonIndex) => {
          total++;
          const key = 'w' + weekObj.week + '_s' + subjectIndex + '_l' + lessonIndex;
          if (lessonProgress && lessonProgress[key] === true) {
            completed++;
          }
        });
      }
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, totalCount: total, completedCount: completed, percentage };
  }

  static getWeekStats(weekObj, lessonProgress) {
    let total = 0;
    let completed = 0;
    if (weekObj && Array.isArray(weekObj.subjects)) {
      weekObj.subjects.forEach((subject, subjectIndex) => {
        if (subject && Array.isArray(subject.lessons)) {
          subject.lessons.forEach((_, lessonIndex) => {
            total++;
            const key = 'w' + weekObj.week + '_s' + subjectIndex + '_l' + lessonIndex;
            if (lessonProgress && lessonProgress[key] === true) {
              completed++;
            }
          });
        }
      });
    }
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, totalCount: total, completedCount: completed, percentage };
  }

  static getSemesterStats(weeks, lessonProgress) {
    let total = 0;
    let completed = 0;

    (weeks || []).forEach(weekObj => {
      (weekObj.subjects || []).forEach((subject, subjectIndex) => {
        if (subject && Array.isArray(subject.lessons)) {
          subject.lessons.forEach((_, lessonIndex) => {
            total++;
            const key = 'w' + weekObj.week + '_s' + subjectIndex + '_l' + lessonIndex;
            if (lessonProgress && lessonProgress[key] === true) {
              completed++;
            }
          });
        }
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, totalCount: total, completedCount: completed, percentage };
  }
}

// 6. CELEBRATION SERVICE (Confetti & Visual Fireworks)
class CelebrationService {
  static fire(type = 'default') {
    if (typeof window === 'undefined' || !window.confetti) return;

    if (type === 'prayers') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#34d399', '#f59e0b', '#ffffff']
      });
      setTimeout(() => {
        confetti({ particleCount: 70, angle: 60, spread: 65, origin: { x: 0.1, y: 0.65 }, colors: ['#10b981', '#fbbf24'] });
        confetti({ particleCount: 70, angle: 120, spread: 65, origin: { x: 0.9, y: 0.65 }, colors: ['#10b981', '#fbbf24'] });
      }, 250);
    } else if (type === 'perfectDay') {
      const end = Date.now() + 1500;
      const colors = ['#fbbf24', '#10b981', '#6366f1', '#ec4899', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    } else if (type === 'week') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fef3c7', '#d97706']
      });
    } else {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    }
  }

  static smallPop() {
    if (typeof window !== 'undefined' && window.confetti) {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.75 }, colors: ['#10b981', '#6366f1', '#fbbf24'] });
    }
  }

  static fireConfetti(type = 'default') {
    CelebrationService.fire(type);
  }
}

// 7. SOUND SERVICE (Pure Web Audio API Synthesizer - Luxury Harmonic Chimes)
class SoundService {
  static getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext));
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  static isMuted() {
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem('janaklis_sound_muted') === 'true';
    } catch (e) {
      return false;
    }
  }

  static toggleMute() {
    const nextState = !this.isMuted();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('janaklis_sound_muted', String(nextState));
      }
    } catch (e) {}
    return nextState;
  }

  // Soft crystalline click chime (C5 -> E5)
  static playCheck() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Joyful harmonic 3-tone chord (C5 -> E5 -> G5)
  static playSuccess() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + (idx * 0.07);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.1, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } catch (e) {}
  }

  // Grand Triumphal Fanfare (C5 -> E5 -> G5 -> C6) for 100% Day / Milestone
  static playFanfare() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + (idx * 0.09);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.55);
      });
    } catch (e) {}
  }
}

// 8. Smooth Rolling Number Counter Animation
function animateRollingCounter(elementId, targetValue, duration = 800, suffix = '') {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(elementId);
  if (!el) return;
  const startValue = parseInt(el.innerText) || 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuad);
    el.innerText = currentValue + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// 9. AI ACADEMIC ENGINE (Domain mentor logic)
class AIAcademicEngine {
  static getResponse(query, state = {}) {
    const q = (query || '').toLowerCase();
    if (q === 'quiz' || q.includes('اختبرني') || q.includes('امتحان')) {
      return '🎯 **اختبار تفاعلي سريع في المواد الأساسية:**\n1. ما الفرق بين الإدارة العامة وإدارة الأعمال؟\n2. ما هي المعادلة المحاسبية الأساسية (الأصول = الخصوم + حقوق الملكية)؟\n3. ما هو تعريف قانون الطلب في الاقتصاد؟\nراجع إجاباتك وركز على الفهم العميق للربط بين المواد 🌟';
    }
    if (q === 'explain' || q.includes('اشرح') || q.includes('مفهوم')) {
      return '💡 **مفهوم أكاديمي ريادي:**\nالمعادلة المحاسبية هي حجر الأساس للمحاسبة المالية:\n**الأصول = الخصوم + حقوق الملكية**\nكل عملية مالية تؤثر على طرفي هذه المعادلة بالتساوي للحفاظ على توازن المركز المالي 📊';
    }
    if (q === 'coding' || q.includes('ai') || q.includes('data') || q.includes('تحليل')) {
      return '📊 **نصيحة مسار AI & Data Analysis:**\nالجمع بين فهم الأعمال والبيانات يمنحك ميزة تنافسية خارقة. ركز على إتقان Excel متقدم وSQL وتحليل القوائم المالية، ثم انطلق في لغة Python ومكتبات Pandas للتنبؤ المالي الذكي 🤖📈';
    }
    if (q === 'progress' || q.includes('أداء') || q.includes('مستوى') || q.includes('حلل')) {
      const stats = DisciplineCalculator.calculateHistoryStats(state.dailyLogs || {});
      return '📈 **تحليل مستوى الانضباط:**\n- إجمالي الأيام المسجلة: ' + stats.totalLoggedDays + ' يوم\n- نسبة الأيام المثالية 100%: ' + stats.perfectRate + '%\n- سلسلة الالتزام الحالية: ' + stats.streak + ' أيام متواصلة\n' + (stats.streak >= 3 ? 'أداء ممتاز واستمرارية رائعة! واصل الانضباط للوصول للامتياز 👑' : 'بداية جيدة.. ركز على استمرارية الصلوات الخمس والورد القرآني يومياً 🌿');
    }
    return 'أهلاً بك يا بطل! أنا مرشدك الأكاديمي الذكي 🎓\nيمكنني مساعدتك في اختبار معلوماتك، تلخيص المفاهيم المحاسبية والإدارية، وتحليل مستوى التزامك الدراسي. اختر أحد الأزرار السريعة أو اكتب سؤالك هنا!';
  }
}
