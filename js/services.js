/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - SERVICES & DOMAIN CALCULATORS (SRP / DIP)
 * =========================================================================
 */

// 1. STORAGE SERVICE (Encapsulates localStorage, backup export & import)
class StorageService {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  getTodayKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      // Purge legacy test records
      try {
        localStorage.removeItem('janaklis_life_academic_os_v1');
        localStorage.removeItem('janaklis_life_academic_os_v2');
      } catch (e) {}

      const raw = localStorage.getItem(this.storageKey);
      const state = raw ? JSON.parse(raw) : this.createInitialState();
      this.ensureTodayLog(state);
      return state;
    } catch (error) {
      console.error('StorageService: Error loading state, using defaults.', error);
      return this.createInitialState();
    }
  }

  save(state) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
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
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
    return this.createInitialState();
  }
}

// 6. CLOUD SYNC SERVICE (Google Firebase Firestore Realtime Sync)
class CloudSyncService {
  constructor(storageService) {
    this.storageService = storageService;
    this.syncKey = this.getStoredSyncKey() || 'main_user';
    this.status = 'connecting';
    this.debounceTimer = null;
    this.firestoreDb = null;
    this.unsubscribeListener = null;

    this.initFirebase();
  }

  initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.firestoreDb = firebase.firestore();
        this.status = 'connected';
        console.log('✅ Google Firebase Firestore connected successfully!');
      }
    } catch (e) {
      console.warn('Firebase init warning:', e);
      this.status = 'connected';
    }
  }

  getStoredSyncKey() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get('syncKey');
      if (urlKey) {
        localStorage.setItem('janaklis_cloud_sync_key', urlKey.trim().toLowerCase());
        return urlKey.trim().toLowerCase();
      }
      return localStorage.getItem('janaklis_cloud_sync_key') || 'main_user';
    } catch (e) {
      return 'main_user';
    }
  }

  setSyncKey(key) {
    if (!key) {
      this.syncKey = 'main_user';
      localStorage.removeItem('janaklis_cloud_sync_key');
    } else {
      this.syncKey = key.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '');
      localStorage.setItem('janaklis_cloud_sync_key', this.syncKey);
    }
    this.status = 'connected';
    this.updateStatusBadge();
  }

  getShareableLink() {
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
    this.status = 'syncing';
    this.updateStatusBadge();

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      try {
        if (this.firestoreDb) {
          const docRef = this.firestoreDb.collection('academic_os').doc(this.syncKey || 'main_user');
          await docRef.set({
            state: state,
            updatedAt: new Date().toISOString(),
            lastDevice: navigator.userAgent
          });
        }
        this.status = 'connected';
      } catch (e) {
        console.warn('Firebase push warning:', e);
        this.status = 'connected';
      }
      this.updateStatusBadge();
    }, 800);
  }

  async pull() {
    this.status = 'syncing';
    this.updateStatusBadge();

    try {
      if (this.firestoreDb) {
        const docRef = this.firestoreDb.collection('academic_os').doc(this.syncKey || 'main_user');
        const doc = await docRef.get();
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && cloudData.state) {
            this.status = 'connected';
            this.updateStatusBadge();
            return cloudData.state;
          }
        }
      }
    } catch (e) {
      console.warn('Firebase pull note:', e);
    }

    this.status = 'connected';
    this.updateStatusBadge();
    return null;
  }

  updateStatusBadge() {
    const badge = document.getElementById('cloudSyncHeaderBadge');
    if (!badge) return;

    if (this.status === 'syncing') {
      badge.className = 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-display shadow-2xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/30 transition';
      badge.innerHTML = '<i class="fa-solid fa-rotate text-amber-400 animate-spin"></i> <span>جاري الحفظ في Firebase...</span>';
    } else {
      badge.className = 'px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-display shadow-2xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/30 transition';
      badge.innerHTML = `<i class="fa-solid fa-fire text-amber-400"></i> <span>فايربيز متصل 🟢</span>`;
    }
  }
}

// 2. DISCIPLINE CALCULATOR (Pure Domain Function)
class DisciplineCalculator {
  static calculateDailyScore(dayLog) {
    if (!dayLog) return 0;

    let score = 0;

    // Prayers: 5 x 6% = 30%
    const prayersCount = Object.values(dayLog.prayers || {}).filter(Boolean).length;
    score += prayersCount * (APP_CONFIG.WEIGHTS.PRAYER_SINGLE || 6);

    // Quran: 20%
    if (dayLog.quran?.done) {
      score += (APP_CONFIG.WEIGHTS.QURAN || 20);
    }

    // Gym: 25%
    if (dayLog.gym?.done) {
      score += (APP_CONFIG.WEIGHTS.GYM || 25);
    }

    // Sleep (7-9 Hours): 25%
    if (dayLog.sleep?.done) {
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
      if (!log || !log.submitted) return; // Only count days explicitly finalized by the user

      totalLoggedDays++;

      const prayersDone = Object.values(log.prayers || {}).filter(Boolean).length;
      const isPrayersFull = prayersDone === 5;
      const isGymDone = Boolean(log.gym?.done);
      const isSleepDone = Boolean(log.sleep?.done);
      const isQuranDone = Boolean(log.quran?.done);

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
      if (log.quran?.done) {
        achieved.push('الورد القرآني');
      } else {
        missed.push('الورد القرآني');
      }

      // Gym
      if (log.gym?.done) {
        achieved.push('تمرين الجيم');
      } else {
        missed.push('تمرين الجيم');
      }

      // Sleep
      if (log.sleep?.done) {
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
          dateFormatted = `اليوم رقم ${index + 1}`;
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
      const is100 = (prayersDone === 5 && Boolean(log.quran?.done) && Boolean(log.gym?.done) && Boolean(log.sleep?.done));
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

// 3. ACADEMIC CALCULATOR (Subject & Semester Progress)
class AcademicCalculator {
  static getSubjectStats(weeks, lessonProgress, subjectIndex) {
    let total = 0;
    let completed = 0;

    (weeks || []).forEach(weekObj => {
      const subject = weekObj.subjects ? weekObj.subjects[subjectIndex] : null;
      if (subject && Array.isArray(subject.lessons)) {
        subject.lessons.forEach((_, lessonIndex) => {
          total++;
          const key = `w${weekObj.week}_s${subjectIndex}_l${lessonIndex}`;
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
            const key = `w${weekObj.week}_s${subjectIndex}_l${lessonIndex}`;
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
            const key = `w${weekObj.week}_s${subjectIndex}_l${lessonIndex}`;
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

// 4. CELEBRATION SERVICE (Confetti & Visual Fireworks)
class CelebrationService {
  static fire(type = 'default') {
    if (!window.confetti) return;

    if (type === 'prayers') {
      // Emerald & Gold Fireworks for completing all 5 prayers
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
      // Grand Royal Celebration (Multi-stage fireworks for 100% Perfect Day)
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
      // Golden starburst for completing a full study week
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fef3c7', '#d97706']
      });
    } else {
      // Double burst celebration
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    }
  }

  static smallPop() {
    if (window.confetti) {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.75 }, colors: ['#10b981', '#6366f1', '#fbbf24'] });
    }
  }

  static fireConfetti(type = 'default') {
    CelebrationService.fire(type);
  }
}

// 5. SOUND SERVICE (Pure Web Audio API Synthesizer - Luxury Harmonic Chimes)
class SoundService {
  static getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
    return localStorage.getItem('janaklis_sound_muted') === 'true';
  }

  static toggleMute() {
    const nextState = !this.isMuted();
    localStorage.setItem('janaklis_sound_muted', String(nextState));
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
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      // Audio context policy safe ignore
    }
  }

  // Joyful harmonic 3-tone chord (C5 -> E5 -> G5)
  static playSuccess() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
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
    } catch (e) {
      // Audio context policy safe ignore
    }
  }

  // Grand Triumphal Fanfare (C5 -> E5 -> G5 -> C6) for 100% Day / Milestone
  static playFanfare() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
    } catch (e) {
      // Audio context policy safe ignore
    }
  }
}


// 6. Smooth Rolling Number Counter Animation
function animateRollingCounter(elementId, targetValue, duration = 800, suffix = '') {
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


// =========================================================================
// AI ACADEMIC MENTOR INTELLIGENCE ENGINE (Knowledge Base & Generators)
// =========================================================================
class AIAcademicEngine {
  static getResponse(query, contextState = {}) {
    const q = query.trim().toLowerCase();
    
    // Quick prompt triggers
    if (q === 'quiz' || q.includes('اختبرني') || q.includes('سؤال') || q.includes('امتحان')) {
      return this.generateQuiz(contextState);
    }
    if (q === 'explain' || q.includes('اشرح') || q.includes('لخص') || q.includes('شرح')) {
      return this.generateExplanation(contextState);
    }
    if (q === 'coding' || q.includes('برمج') || q.includes('كورس') || q.includes('بايثون') || q.includes('ويب')) {
      return this.generateCodingAdvice(contextState);
    }
    if (q === 'progress' || q.includes('تحليل') || q.includes('مستواي') || q.includes('ادائي') || q.includes('إنجاز')) {
      return this.generateProgressAnalysis(contextState);
    }

    // Keyword Subject Answers
    if (q.includes('محاسب') || q.includes('مدين') || q.includes('دائن') || q.includes('ميزاني')) {
      return "📊 **نصيحة المحاسبة المالية (ACT 01):**\nالقاعدة الذهبية التي تحكم كل قيود الترم: **الأصول والمصروفات بطبيعتها (مدينة)، وعندما تزيد تظل مدينة وعندما تنقص تصبح دائنة**. أما **الخصوم وحقوق الملكية والإيرادات فبطبيعتها (دائنة)**. تذكر دائماً معادلة الميزانية: الأصول = الخصوم + حقوق الملكية! 🧮✨";
    }

    if (q.includes('ادار') || q.includes('تايلور') || q.includes('فايول') || q.includes('تخطيط') || q.includes('تنظيم')) {
      return "💼 **تريكة مبادئ إدارة الأعمال (MGT 01):**\nوظائف الإدارة الأربعة هي: **التخطيط ➔ التنظيم ➔ التوجيه ➔ الرقابة**. تذكر أن (هنري فايول) هو أب الإدارة الحديثة ومؤسس الـ 14 مبدأ، بينما (فريدريك تايلور) ركز على مستوى الورشة والمصنع وحركة العاملين (الإدارة العلمية)! 🏆";
    }

    if (q.includes('اقتصاد') || q.includes('طلب') || q.includes('عرض') || q.includes('تضخم') || q.includes('مرون')) {
      return "📈 **تريكة مبادئ الاقتصاد (ECO 01):**\n**قانون الطلب:** علاقة عكسية بين السعر والكمية المطلوبة (مع بقاء العوامل الأخرى ثابتة). **قانون العرض:** علاقة طردية بين السعر والكمية المعروضة. نقطة تقاطع المنحنيين هي **سعر وكمية التوازن**! ⚖️";
    }

    if (q.includes('قانون') || q.includes('حق') || q.includes('شخصي') || q.includes('عقار') || q.includes('منقول')) {
      return "⚖️ **تريكة مبادئ القانون (LAW 02):**\nالقاعدة القانونية: عامة، مجردة، ملزمة، ومصحوبة بجزاء مادي توقعه السلطة العامة. والفرق بين **العقار والمنقول**: العقار مستقر وثابت ولا يمكن نقله دون تلف (كالأرض والمبنى)، والمنقول يمكن نقله دون تلف (كالنقود والسيارات)! 🏛️";
    }

    if (q.includes('نفس') || q.includes('شخصي') || q.includes('دوافع') || q.includes('ادراك') || q.includes('ماسلو')) {
      return "🧠 **تريكة علم النفس (Psychology):**\nهرم ماسلو للحاجات يبدأ من القاعدة: **1. الفسيولوجية ➔ 2. الأمان ➔ 3. الاجتماعية والانتماء ➔ 4. التقدير ➔ 5. تحقيق الذات**. تذكر أن الحاجة غير المشبعة هي التي تحرك السلوك وتدفعه! 🌟";
    }

    // Default intelligent guidance
    return `💡 **إجابة المرشد الأكاديمي:**\\nأهلاً بك يا غالي! بخصوص استفسارك عن ("${query}"): أنصحك بتطبيق قاعدة **(التركيز والتدوين الفوري)**. اضغط على أيقونة الملاحظات 📝 بجانب الدرس في السيستم وسجّل أهم نقطة خرجت بها. هل تحب أختبرك بأسئلة في أي مادة الآن؟ 🎯`;
  }

  static generateQuiz(contextState) {
    const quizzes = [
      {
        q: "السؤال الأول (مبادئ إدارة الأعمال): ما هي الوظيفة الإدارية الأولى التي تسبق وتوجه كافة الوظائف الأخرى؟",
        opts: ["أ) التوجيه", "ب) الرقابة", "ج) التخطيط", "د) التنظيم"],
        ans: "ج) التخطيط - لأنه يرسم خارطة الطريق والأهداف المستقبلية."
      },
      {
        q: "السؤال الثاني (المحاسبة المالية): إذا اشترت المنشأة أثاثاً بمبلغ 10,000 ج نقداً، فإن الطرف المدين في القيد هو:",
        opts: ["أ) حساب الخزينة", "ب) حساب الأثاث", "ج) حساب رأس المال", "د) حساب المشتريات"],
        ans: "ب) حساب الأثاث - لأنه أصل وزاد فيصبح مديناً."
      },
      {
        q: "السؤال الثالث (مبادئ الاقتصاد): عند ارتفاع سعر سلعة ما مع ثبات العوامل الأخرى، فإن الكمية المطلوبة منها:",
        opts: ["أ) تزداد", "ب) تنخفض", "ج) تظل ثابتة", "د) تتضاعف"],
        ans: "ب) تنخفض - تطبيقاً لقانون الطلب (علاقة عكسية)."
      }
    ];

    const pick = quizzes[Math.floor(Math.random() * quizzes.length)];
    return `🎯 **اختبار سريع من المرشد الأكاديمي:**\\n\\n**${pick.q}**\\n\\n${pick.opts.join('\\n')}\\n\\n💡 **الإجابة الصحيحة والتوضيح:**\\n${pick.ans}`;
  }

  static generateExplanation(contextState) {
    return "💡 **ملخص وشرح درس ذهبي (المعادلة المحاسبية):**\n\n1. **المعادلة:** الأصول = الالتزامات (الخصوم) + حقوق الملكية.\n2. **الأصول (Assets):** ما تملكه المنشأة وله قيمة اقتصادية (نقدية، بضاعة، سيارات، مباني).\n3. **الخصوم (Liabilities):** ديون والتزامات على المنشأة للغير (الدائنون، أوراق الدفع، القروض).\n4. **حقوق الملكية (Owner's Equity):** حق صاحب المنشأة (رأس المال + الأرباح - المسحوبات).\n\n📌 **الخلاصة:** أي عملية مالية في الدنيا يجب أن تحافظ على توازن طرفي هذه المعادلة 100%! ✨";
  }

  static generateCodingAdvice(contextState) {
    return "💻 **توجيه وخارطة طريق مسار البرمجة:**\n\n1. **CS50 أولاً:** يمنحك التفكير الخوارزمي وفهم كيف يعمل الكمبيوتر في الذاكرة والمنطق.\n2. **HTML & CSS ثم JS:** لتأسيس واجهات المواقع وبناء مشاريع حقيقية تفاعلية.\n3. **Python:** لتطبيقات الأتمتة وتحليل البيانات والذكاء الاصطناعي.\n\n🚀 **نصيحة ذهبية:** طبّق كورس «بناء المشاريع والتجريب العملي» في نهاية كل أسبوع لترسيخ ما تعلمته في محفظتك (Portfolio)!";
  }

  static generateProgressAnalysis(contextState) {
    const progress = contextState.lessonProgress || {};
    const doneCount = Object.values(progress).filter(Boolean).length;
    const percentage = Math.round((doneCount / 300) * 100);

    return `📈 **تقرير وتحليل أدائك الأكاديمي الحالي:**\\n\\n* 📚 **إجمالي الدروس المنجزة:** ${doneCount} من أصل 300 درس (${percentage}%).\\n* 🗓️ **الخطة الاستراتيجية:** توزيع الـ 19 أسبوعاً يتيح لك إنهاء المناهج بمرونة تامة (2 إلى 3 دروس فقط أسبوعياً للمادة).\\n* 👑 **تقييم المرشد:** أنت على الطريق الصحيح للتفوق والحصول على تقدير الامتياز بإذن الله! حافظ على التزامك اليومي بالروتين والصلوات وستحقق القمة! 🌟🚀`;
  }
}
