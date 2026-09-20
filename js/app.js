/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - APPLICATION CONTROLLER & BOOTSTRAP (Mediator)
 * =========================================================================
 */

class AppController {

  openAiMentorModal() { openAiMentorModal(); }
  closeAiMentorModal() { closeAiMentorModal(); }
  sendAiQuickPrompt(t) { sendAiQuickPrompt(t); }
  sendAiMessage() { sendAiMessage(); }


  constructor(dependencies = {}) {
    this.storageService = dependencies.storageService || new StorageService();
    this.cloudSyncService = dependencies.cloudSyncService || new CloudSyncService(this.storageService, {
      onStatusChange: (status) => HeaderView.updateSyncStatus(status)
    });
    this.soundService = dependencies.soundService || SoundService;
    this.celebrationService = dependencies.celebrationService || CelebrationService;
    this.state = this.storageService.load();
    this.currentEditingLessonKey = null;
  }

  async init() {
    this.initTabClickListeners();
    HeaderView.render(this.state);
    HeaderView.updateSyncStatus(this.cloudSyncService.status);

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const urlTab = urlParams ? urlParams.get('tab') : null;
    const hashTab = typeof window !== 'undefined' && window.location.hash ? window.location.hash.replace('#', '') : null;
    const validTabs = ['routine', 'curriculum', 'languages', 'roadmap', 'programming'];
    const initialTab = (urlTab && validTabs.includes(urlTab)) 
      ? urlTab 
      : ((hashTab && validTabs.includes(hashTab)) ? hashTab : (this.state.activeTab || 'routine'));

    this.switchTab(initialTab);

    // 1. Real-time live listener from Firebase Firestore
    this.cloudSyncService.subscribeRealtime((cloudState) => {
      if (cloudState && typeof cloudState === 'object' && cloudState.dailyLogs) {
        const currentTab = this.state.activeTab || initialTab;
        this.state = cloudState;
        this.state.activeTab = currentTab;
        this.storageService.save(this.state);
        HeaderView.render(this.state);
        this.switchTab(currentTab);
        HeaderView.updateSyncStatus(this.cloudSyncService.status);
      }
    });

    // 2. Initial cloud state fetch
    try {
      const cloudState = await this.cloudSyncService.pull();
      if (cloudState && typeof cloudState === 'object' && cloudState.dailyLogs) {
        const currentTab = this.state.activeTab || initialTab;
        this.state = cloudState;
        this.state.activeTab = currentTab;
        this.storageService.save(this.state);
        this.switchTab(currentTab);
        HeaderView.updateSyncStatus(this.cloudSyncService.status);
      }
    } catch (e) {}

    // 3. Dynamic URL Hash Change Listener
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
        if (validTabs.includes(hash) && this.state.activeTab !== hash) {
          this.switchTab(hash);
        }
      });
    }

    // 4. Mobile Touch Gestures & Swipe Engine (Smooth swipe between tabs)
    this.initTouchGestures();
  }

  initTabClickListeners() {
    if (typeof document === 'undefined') return;
    const tabs = ['routine', 'curriculum', 'languages', 'roadmap', 'programming'];
    tabs.forEach(tabId => {
      const btn = document.getElementById(`tabBtn-${tabId}`);
      if (btn) {
        btn.onclick = (e) => {
          if (e && e.preventDefault) e.preventDefault();
          this.switchTab(tabId);
        };
      }
    });
  }

  renderActiveTab() {
    const tab = this.state.activeTab || 'routine';
    if (tab === 'routine') this.renderRoutine();
    if (tab === 'curriculum') this.renderCurriculum();
    if (tab === 'languages') this.renderLanguages();
    if (tab === 'roadmap') this.renderRoadmap();
    if (tab === 'programming') this.renderProgramming();
  }

  saveAndRefreshViews() {
    this.storageService.save(this.state);
    this.cloudSyncService.push(this.state);
    HeaderView.render(this.state);
    this.renderActiveTab();
  }

  // ==========================================
  // Navigation: Active Tabs (Routine, Curriculum, Languages, Roadmap & Programming)
  // ==========================================
  switchTab(tabId) {
    const validTabs = ['routine', 'curriculum', 'languages', 'roadmap', 'programming'];
    if (!validTabs.includes(tabId)) {
      tabId = 'routine';
    }
    this.state.activeTab = tabId;

    // 1. Reset all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('tab-btn-active', 'bg-slate-50', 'text-slate-700', 'border-slate-200', 'tab-active-routine', 'tab-active-languages', 'tab-active-roadmap', 'tab-active-programming', 'tab-active-curriculum');
    });

    // 2. Highlight strictly the active tab
    const activeBtn = document.getElementById(`tabBtn-${tabId}`);
    if (activeBtn) {
      activeBtn.classList.add('tab-btn-active', `tab-active-${tabId}`);
    }

    const routineSec = document.getElementById('section-routine');
    const curricSec = document.getElementById('section-curriculum');
    const languagesSec = document.getElementById('section-languages');
    const roadmapSec = document.getElementById('section-roadmap');
    const progSec = document.getElementById('section-programming');
    const achieveSec = document.getElementById('section-achievements');

    if (routineSec) routineSec.classList.toggle('hidden', tabId !== 'routine');
    if (curricSec) curricSec.classList.toggle('hidden', tabId !== 'curriculum');
    if (languagesSec) languagesSec.classList.toggle('hidden', tabId !== 'languages');
    if (roadmapSec) roadmapSec.classList.toggle('hidden', tabId !== 'roadmap');
    if (progSec) progSec.classList.toggle('hidden', tabId !== 'programming');
    if (achieveSec) achieveSec.classList.toggle('hidden', true);

    this.renderActiveTab();

    this.storageService.save(this.state);
    HeaderView.render(this.state);
    if (typeof window !== "undefined" && window.history && window.history.replaceState) {
      try { window.history.replaceState(null, '', '#' + tabId); } catch (e) {}
    }
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ==========================================
  // Mobile Touch Gestures & Swipe Engine
  // ==========================================
  initTouchGestures() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const workspace = document.getElementById('part-main-workspace') || document.body;

    workspace.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    }, { passive: true });

    workspace.addEventListener('touchend', (e) => {
      if (!touchStartX || !e.changedTouches || e.changedTouches.length !== 1) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const duration = Date.now() - touchStartTime;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      touchStartX = 0;
      touchStartY = 0;

      // Fast horizontal swipe with minimal vertical drift
      if (duration > 450 || Math.abs(deltaX) < 65 || Math.abs(deltaY) > 60) return;

      const target = e.target;
      if (target && target.closest('#noteModal, #cloudSyncModal, #dailyResultModal, input, textarea, select')) {
        return;
      }

      const tabs = ['routine', 'curriculum', 'languages', 'roadmap', 'programming'];
      const currentIndex = tabs.indexOf(this.state.activeTab || 'routine');
      if (currentIndex === -1) return;

      if (deltaX < 0 && currentIndex < tabs.length - 1) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
        this.switchTab(tabs[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
        this.switchTab(tabs[currentIndex - 1]);
      }
    }, { passive: true });
  }

  // ==========================================
  // Routine Handlers
  // ==========================================
  getTodayLog() {
    const today = this.storageService.getTodayKey();
    this.storageService.ensureTodayLog(this.state);
    return this.state.dailyLogs[today];
  }

  renderRoutine() {
    if (typeof AchievementsView !== "undefined" && AchievementsView.renderRoutineAchievements) {
      AchievementsView.renderRoutineAchievements(this.state.dailyLogs);
    }
    RoutineView.render(this.getTodayLog());
  }

  togglePrayer(prayerId) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    const log = this.getTodayLog();
    const nextState = !log.prayers[prayerId];
    log.prayers[prayerId] = nextState;

    const allDone = Object.values(log.prayers).filter(Boolean).length === 5;
    if (nextState && allDone) {
      this.soundService.playSuccess();
      this.celebrationService.fire('prayers');
    } else if (nextState) {
      this.soundService.playCheck();
      this.celebrationService.smallPop();
    } else {
      this.soundService.playCheck();
    }

    this.renderRoutine();
    this.saveAndRefreshViews();
  }

  toggleGym() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    const log = this.getTodayLog();
    log.gym.done = !Boolean(log.gym?.done);

    if (log.gym.done) {
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
    } else {
      this.soundService.playCheck();
    }

    this.saveAndRefreshViews();
  }

  toggleSleep() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    const log = this.getTodayLog();
    log.sleep.done = !Boolean(log.sleep?.done);

    if (log.sleep.done) {
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
    } else {
      this.soundService.playCheck();
    }

    this.saveAndRefreshViews();
  }

  toggleQuran() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    const log = this.getTodayLog();
    log.quran.done = !Boolean(log.quran?.done);

    if (log.quran.done) {
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
    } else {
      this.soundService.playCheck();
    }

    this.saveAndRefreshViews();
  }

  saveQuranPages() {
    const log = this.getTodayLog();
    const inputEl = document.getElementById('quranPagesInput');
    log.quran.pages = inputEl ? inputEl.value : '';
    this.storageService.save(this.state);
  }

  finalizeTodayLog() {
    const today = this.storageService.getTodayKey();
    const currentLog = this.getTodayLog();

    const prayersDone = Object.values(currentLog.prayers || {}).filter(Boolean).length;
    const is100 = (prayersDone === 5 && Boolean(currentLog.quran?.done) && Boolean(currentLog.gym?.done) && Boolean(currentLog.sleep?.done));

    // 1. Archive the finalized day permanently into history
    const recordId = `record_${Date.now()}`;
    this.state.dailyLogs[recordId] = {
      ...JSON.parse(JSON.stringify(currentLog)),
      submitted: true,
      recordedAt: new Date().toISOString()
    };

    // 2. Reset active routine inputs to 0/empty so user can log their new day
    this.state.dailyLogs[today] = this.storageService.createDefaultDayLog();

    // 3. Save & Refresh views immediately
    this.saveAndRefreshViews();
    this.renderRoutine();

    // 4. Celebrations, Royal Fanfare & Motivational Modal Feedback
    if (is100) {
      this.soundService.playFanfare();
      this.celebrationService.fire('perfectDay');
    } else {
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
    }

    ResultModalView.show(is100);
  }

  // ==========================================
  // Curriculum Handlers (Clean, Unified)
  // ==========================================
  renderCurriculum() {
    this.state.activeSubject = (typeof this.state.activeSubject === 'number') ? this.state.activeSubject : 0;
    this.state.lessonProgress = this.state.lessonProgress || {};
    this.state.lessonNotes = this.state.lessonNotes || {};
    if (typeof CurriculumView !== 'undefined' && CurriculumView.render) {
      CurriculumView.render(this.state.activeSubject, this.state.lessonProgress, this.state.lessonNotes);
    }
  }

  switchSubject(subjectIdx) {
    this.state.activeSubject = subjectIdx;
    this.renderCurriculum();
    this.storageService.save(this.state);
  }

  switchWeek(weekNum) {
    this.state.currentWeek = weekNum;
    this.storageService.save(this.state);
  }

  triggerGoldConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#fbbf24'],
        ticks: 90,
        gravity: 1.2,
        scalar: 0.95
      });
    }
  }

  toggleLesson(lessonKey) {
    if (!lessonKey) return;
    try {
      this.state.lessonProgress = this.state.lessonProgress || {};
      const isNowDone = !Boolean(this.state.lessonProgress[lessonKey]);

      if (isNowDone) {
        this.state.lessonProgress[lessonKey] = true;
        this.soundService.playCheck();
        this.celebrationService.smallPop();
      } else {
        delete this.state.lessonProgress[lessonKey];
        this.soundService.playCheck();
      }

      this.saveAndRefreshViews();
      this.renderCurriculum();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling lesson:', err);
    }
  }

  toggleSubjectCompletion(subjectId) {
    if (subjectId === undefined || subjectId === null) return;
    try {
      this.state.subjectsProgress = this.state.subjectsProgress || {};
      const isNowDone = !Boolean(this.state.subjectsProgress[subjectId]);
      this.state.subjectsProgress[subjectId] = isNowDone;

      if (isNowDone) {
        this.soundService.playSuccess();
        this.celebrationService.smallPop();
      } else {
        this.soundService.playCheck();
      }

      this.saveAndRefreshViews();
      this.renderCurriculum();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling subject:', err);
    }
  }

  // Programming Track Handlers
  // ==========================================
  renderProgramming() {
    this.state.programmingCourses = this.state.programmingCourses || {};
    ProgrammingView.render(this.state);
  }

  toggleProgrammingPillar(pillarId) {
    if (!pillarId) return;
    try {
      this.state.programmingCourses = this.state.programmingCourses || {};
      const isNowDone = !Boolean(this.state.programmingCourses[pillarId]);
      this.state.programmingCourses[pillarId] = isNowDone;

      if (isNowDone) {
        SoundService.playSuccess();
        CelebrationService.smallPop();
      } else {
        SoundService.playCheck();
      }

      this.saveAndRefreshViews();
      this.renderProgramming();
    } catch (err) {
      console.error('Error toggling programming pillar:', err);
    }
  }

  toggleProgrammingCourse(courseId) {
    this.toggleProgrammingPillar(courseId);
  }

  // ==========================================
  // Notes Modal Handlers
  // ==========================================
  openNoteModal(lessonKey) {
    if (!lessonKey) return;
    this.currentEditingLessonKey = lessonKey;

    let lessonTitle = 'ملاحظات الدرس';
    let subjectName = 'المقرر الدراسي';

    try {
      const parts = lessonKey.split('_');
      const weekNum = parseInt(parts[0].replace('w', ''), 10);
      const subjectIdx = parseInt(parts[1].replace('s', ''), 10);
      const lessonIdx = parseInt(parts[2].replace('l', ''), 10);

      const weekObj = weeksData.find(w => w.week === weekNum);
      if (weekObj && weekObj.subjects && weekObj.subjects[subjectIdx]) {
        subjectName = APP_CONFIG.SUBJECT_NAMES[subjectIdx] || subjectName;
        lessonTitle = weekObj.subjects[subjectIdx].lessons[lessonIdx] || lessonTitle;
      }
    } catch (e) {
      console.error('Error parsing lesson key for note modal', e);
    }

    const titleEl = document.getElementById('modalLessonTitle');
    const subjEl = document.getElementById('modalSubjectTitle');
    const textEl = document.getElementById('modalNoteText');

    if (titleEl) titleEl.innerText = lessonTitle;
    if (subjEl) subjEl.innerText = subjectName;
    if (textEl) textEl.value = this.state.lessonNotes[lessonKey] || '';

    const modal = document.getElementById('noteModal');
    const card = document.getElementById('noteModalCard');
    if (modal && card) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  }

  closeNoteModal() {
    const modal = document.getElementById('noteModal');
    const card = document.getElementById('noteModalCard');
    modal.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    this.currentEditingLessonKey = null;
  }

  saveLessonNote() {
    if (!this.currentEditingLessonKey) return;
    const text = document.getElementById('modalNoteText').value.trim();

    if (text) {
      this.state.lessonNotes[this.currentEditingLessonKey] = text;
    } else {
      delete this.state.lessonNotes[this.currentEditingLessonKey];
    }

    this.saveAndRefreshViews();
    this.closeNoteModal();
    // No curriculum
  }

  // ==========================================

  // ==========================================
  // Roadmap Handlers (15 Subjects + Skills + Certs)
  // ==========================================
  renderRoadmap() {
    this.state.roadmapProgress = this.state.roadmapProgress || {};
    if (typeof RoadmapView !== 'undefined' && RoadmapView.render) {
      RoadmapView.render(this.state);
    }
  }

  toggleRoadmapItem(itemId) {
    if (!itemId) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    try {
      this.state.roadmapProgress = this.state.roadmapProgress || {};
      const isNowDone = !Boolean(this.state.roadmapProgress[itemId]);
      this.state.roadmapProgress[itemId] = isNowDone;

      if (isNowDone) {
        this.soundService.playSuccess();
        this.celebrationService.smallPop();
      } else {
        this.soundService.playCheck();
      }

      this.saveAndRefreshViews();
      this.renderRoadmap();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling roadmap item:', err);
    }
  }

  // ==========================================
  // Languages Track Handlers (33 Courses)
  // ==========================================
  renderLanguages() {
    this.state.languageProgress = this.state.languageProgress || {};
    if (typeof LanguageTrackView !== 'undefined' && LanguageTrackView.render) {
      LanguageTrackView.render(this.state);
    }
  }

  toggleLanguageCourse(courseId) {
    if (!courseId) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    try {
      this.state.languageProgress = this.state.languageProgress || {};
      const isNowDone = !Boolean(this.state.languageProgress[courseId]);
      this.state.languageProgress[courseId] = isNowDone;

      if (isNowDone) {
        this.soundService.playSuccess();
        this.celebrationService.smallPop();
      } else {
        this.soundService.playCheck();
      }

      this.saveAndRefreshViews();
      this.renderLanguages();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling language course:', err);
    }
  }

  // Achievements Handlers
  // ==========================================
    renderAchievements() {
    this.state.dailyLogs = this.state.dailyLogs || {};
    this.state.lessonProgress = this.state.lessonProgress || {};
    this.state.programmingCourses = this.state.programmingCourses || {};
    AchievementsView.render(this.state.dailyLogs, weeksData, this.state.lessonProgress, this.state.programmingCourses, this.state);
  }

  async resetRoutineHistory() {
    if (confirm('هل تريد تصفير سجل أيام الروتين وإعادة عداد الأيام إلى (0 يوم) مع الحفاظ الكامل على تقدم المواد والملاحظات؟')) {
      const today = this.storageService.getTodayKey();
      
      // 1. Reset ONLY dailyLogs (leaves lessonProgress and lessonNotes completely untouched!)
      this.state.dailyLogs = {
        [today]: this.storageService.createDefaultDayLog()
      };

      // 2. Save locally
      this.storageService.save(this.state);

      // 3. Force push direct overwrite to Firebase Firestore (without merge)
      if (this.cloudSyncService && this.cloudSyncService.firestoreDb) {
        try {
          const docRef = this.cloudSyncService.firestoreDb.collection('academic_os').doc(this.cloudSyncService.syncKey || 'main_user');
          await docRef.set({
            state: this.state,
            updatedAt: new Date().toISOString(),
            lastDevice: navigator.userAgent
          });
        } catch (e) {
          console.warn('Firebase reset note:', e);
        }
      }

      // 4. Update and refresh all views immediately
      this.renderRoutine();
      this.renderAchievements();
      HeaderView.render(this.state);

      SoundService.playSuccess();
      alert('✅ تم تصفير سجل أيام الروتين بنجاح (0 يوم)! 🔄');
    }
  }

  // ==========================================
  // Backup & Restore
  // ==========================================
  exportBackup() {
    const today = this.storageService.getTodayKey();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Janaklis_Tracker_Backup_${today}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && typeof imported === 'object') {
          this.state = imported;
          this.storageService.save(this.state);

          // Force push restored backup to Firebase Firestore (direct overwrite)
          if (this.cloudSyncService && this.cloudSyncService.firestoreDb) {
            try {
              const docRef = this.cloudSyncService.firestoreDb.collection('academic_os').doc(this.cloudSyncService.syncKey || 'main_user');
              await docRef.set({
                state: this.state,
                updatedAt: new Date().toISOString(),
                lastDevice: navigator.userAgent
              });
            } catch (err) {}
          }

          SoundService.playSuccess();
          this.saveAndRefreshViews();
          this.renderRoutine();
          // No curriculum
          this.renderAchievements();
          HeaderView.render(this.state);
          alert('✅ تم استرجاع نسختك الاحتياطية بنجاح 100%! عادت كل بياناتك وأيامك كما كانت تماماً 🛡️');
        }
      } catch (err) {
        alert('ملف غير صالح! يرجى اختيار ملف نسخة احتياطية صحيح.');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================
  // Cloud Sync Modal Handlers
  // ==========================================
  openCloudSyncModal() {
    const input = document.getElementById('cloudSyncKeyInput');
    const shareInput = document.getElementById('cloudShareableUrlInput');
    if (input) input.value = this.cloudSyncService.syncKey || '';
    if (shareInput) shareInput.value = this.cloudSyncService.getShareableLink();

    const modal = document.getElementById('cloudSyncModal');
    const card = document.getElementById('cloudSyncModalCard');
    if (modal && card) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  }

  closeCloudSyncModal() {
    const modal = document.getElementById('cloudSyncModal');
    const card = document.getElementById('cloudSyncModalCard');
    if (modal && card) {
      modal.classList.add('opacity-0', 'pointer-events-none');
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
    }
  }

  generateRandomSyncKey() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const key = `janaklis-${rand}`;
    const input = document.getElementById('cloudSyncKeyInput');
    if (input) input.value = key;
    const shareInput = document.getElementById('cloudShareableUrlInput');
    if (shareInput) {
      const url = new URL(window.location.href.split('?')[0]);
      url.searchParams.set('syncKey', key);
      shareInput.value = url.toString();
    }
  }

  copyCloudShareableUrl() {
    const shareInput = document.getElementById('cloudShareableUrlInput');
    if (!shareInput || !shareInput.value) return;
    navigator.clipboard.writeText(shareInput.value).then(() => {
      SoundService.playCheck();
      alert('تم نسخ رابط المزامنة المباشر! يمكنك إرساله لنفسك على الواتساب وفتحه من الموبايل 📱');
    }).catch(() => {
      shareInput.select();
      document.execCommand('copy');
      alert('تم نسخ الرابط!');
    });
  }

  async connectAndSyncCloud() {
    const input = document.getElementById('cloudSyncKeyInput');
    const key = input ? input.value.trim() : '';

    if (!key) {
      alert('يرجى إدخال رمز مزامنة صالح (مثال: ahmed-2026)');
      return;
    }

    this.cloudSyncService.setSyncKey(key);
    SoundService.playCheck();

    // Pull from cloud if exists, else push local state
    const cloudState = await this.cloudSyncService.pull();
    if (cloudState && typeof cloudState === 'object') {
      this.state = cloudState;
      this.storageService.save(this.state);
      this.renderRoutine();
      // No curriculum
      this.renderAchievements();
      SoundService.playSuccess();
      CelebrationService.smallPop();
      alert(`✅ تم الاتصال بالخزنة السحابية (${key}) وتحميل أحدث البيانات بنجاح!`);
    } else {
      await this.cloudSyncService.push(this.state);
      SoundService.playSuccess();
      CelebrationService.smallPop();
      alert(`✅ تم إنشاء الخزنة السحابية (${key}) ورفع بياناتك الحالية بنجاح!`);
    }

    this.closeCloudSyncModal();
  }

  disconnectCloudSync() {
    if (confirm('هل تريد إلغاء الربط السحابي والرجوع للوضع المحلي؟')) {
      this.cloudSyncService.setSyncKey('');
      this.closeCloudSyncModal();
      SoundService.playCheck();
      alert('تم فصل المزامنة السحابية بنجاح ⚪');
    }
  }

  async resetEntireSystem() {
    if (confirm('تحذير: هل تريد تصفير جميع بيانات المنظومة بالكامل (الدروس، الصلوات، الأيام، والملاحظات) والبدء من الصفر تماماً 0%؟')) {
      // 1. Reset local state
      this.state = this.storageService.createInitialState();
      
      // 2. Clear all local storage keys
      try {
        localStorage.clear();
        localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(this.state));
        if (this.cloudSyncService.syncKey) {
          localStorage.setItem('janaklis_cloud_sync_key', this.cloudSyncService.syncKey);
        }
      } catch (e) {}

      // 3. Force overwrite in Firebase Firestore so cloud is also wiped
      if (this.cloudSyncService.firestoreDb) {
        try {
          const docRef = this.cloudSyncService.firestoreDb.collection('academic_os').doc(this.cloudSyncService.syncKey || 'main_user');
          await docRef.set({
            state: this.state,
            updatedAt: new Date().toISOString(),
            reset: true
          });
        } catch (e) {
          console.warn('Firebase reset note:', e);
        }
      }

      // 4. Save and re-render everything immediately
      this.saveAndRefreshViews();
      this.renderRoutine();
      // No curriculum
      this.renderAchievements();
      SoundService.playSuccess();
      alert('✅ تم تصفير المنظومة وقاعدة بيانات Firebase بنجاح تام (0%)! أنت الآن جاهز لبدء الترم الجديد 🚀👑');
    }
  }
}

// Global App Instance
const app = new AppController();

// Global event delegates for HTML inline events
function switchSubject(idx) { if (app && app.switchSubject) app.switchSubject(idx); }
function switchTab(tabId) { if (app && app.switchTab) app.switchTab(tabId); }
function togglePrayer(prayerId) { if (app && app.togglePrayer) app.togglePrayer(prayerId); }
function toggleGymStatus() { if (app && app.toggleGym) app.toggleGym(); }
function toggleSleepStatus() { if (app && app.toggleSleep) app.toggleSleep(); }
function toggleQuran() { if (app && app.toggleQuran) app.toggleQuran(); }
function saveQuranPages() { if (app && app.saveQuranPages) app.saveQuranPages(); }
function toggleLessonCompletion(key) { if (app && app.toggleLesson) app.toggleLesson(key); }
function openNoteModal(key, subj, title) { if (app && app.openNoteModal) app.openNoteModal(key, subj, title); }
function closeNoteModal() { if (app && app.closeNoteModal) app.closeNoteModal(); }
function saveCurrentLessonNote() { if (app && app.saveLessonNote) app.saveLessonNote(); }
function exportBackupData() { if (app && app.exportBackup) app.exportBackup(); }
function importBackupData(event) { if (app && app.importBackup) app.importBackup(event); }
function finalizeTodayLog() { if (app && app.finalizeTodayLog) app.finalizeTodayLog(); }
function closeDailyResultModal() { if (typeof ResultModalView !== 'undefined') ResultModalView.close(); }
function resetRoutineHistory() { if (app && app.resetRoutineHistory) app.resetRoutineHistory(); }
function openCloudSyncModal() { if (app && app.openCloudSyncModal) app.openCloudSyncModal(); }
function closeCloudSyncModal() { if (app && app.closeCloudSyncModal) app.closeCloudSyncModal(); }
function generateRandomSyncKey() { if (app && app.generateRandomSyncKey) app.generateRandomSyncKey(); }
function copyCloudShareableUrl() { if (app && app.copyCloudShareableUrl) app.copyCloudShareableUrl(); }
function connectAndSyncCloud() { if (app && app.connectAndSyncCloud) app.connectAndSyncCloud(); }
function disconnectCloudSync() { if (app && app.disconnectCloudSync) app.disconnectCloudSync(); }
function resetEntireSystem() { if (app && app.resetEntireSystem) app.resetEntireSystem(); }
function toggleRoadmapItem(id) { if (app && app.toggleRoadmapItem) app.toggleRoadmapItem(id); }
function toggleLanguageCourse(id) { if (app && app.toggleLanguageCourse) app.toggleLanguageCourse(id); }
function toggleProgrammingPillar(id) { if (app && app.toggleProgrammingPillar) app.toggleProgrammingPillar(id); }
function toggleProgrammingCourse(id) { if (app && app.toggleProgrammingPillar) app.toggleProgrammingPillar(id); }
function toggleSubjectCompletion(id) { if (app && app.toggleSubjectCompletion) app.toggleSubjectCompletion(id); }

if (typeof window !== 'undefined') {
  window.app = app;
  window.switchSubject = switchSubject;
  window.switchTab = switchTab;
  window.togglePrayer = togglePrayer;
  window.toggleGymStatus = toggleGymStatus;
  window.toggleSleepStatus = toggleSleepStatus;
  window.toggleQuran = toggleQuran;
  window.saveQuranPages = saveQuranPages;
  window.toggleLessonCompletion = toggleLessonCompletion;
  window.openNoteModal = openNoteModal;
  window.closeNoteModal = closeNoteModal;
  window.saveCurrentLessonNote = saveCurrentLessonNote;
  window.exportBackupData = exportBackupData;
  window.importBackupData = importBackupData;
  window.finalizeTodayLog = finalizeTodayLog;
  window.closeDailyResultModal = closeDailyResultModal;
  window.resetRoutineHistory = resetRoutineHistory;
  window.openCloudSyncModal = openCloudSyncModal;
  window.closeCloudSyncModal = closeCloudSyncModal;
  window.generateRandomSyncKey = generateRandomSyncKey;
  window.copyCloudShareableUrl = copyCloudShareableUrl;
  window.connectAndSyncCloud = connectAndSyncCloud;
  window.disconnectCloudSync = disconnectCloudSync;
  window.resetEntireSystem = resetEntireSystem;
  window.toggleRoadmapItem = toggleRoadmapItem;
  window.toggleLanguageCourse = toggleLanguageCourse;
  window.toggleProgrammingPillar = toggleProgrammingPillar;
  window.toggleProgrammingCourse = toggleProgrammingCourse;
  window.toggleSubjectCompletion = toggleSubjectCompletion;
}
function toggleIncompleteDetailsSection() {
  const wrapper = document.getElementById('incompleteDetailsWrapper');
  const icon = document.getElementById('toggleIncompleteIcon');
  const text = document.getElementById('toggleIncompleteText');
  if (!wrapper) return;

  const isHidden = wrapper.classList.toggle('hidden');
  SoundService.playCheck();
  if (icon) {
    icon.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    icon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
  }
  if (text) {
    text.innerText = isHidden ? 'عرض التفاصيل 🔍' : 'طي التفاصيل 🔼';
  }
  if (!isHidden) {
    wrapper.classList.remove('animate-fade-in');
    void wrapper.offsetWidth;
    wrapper.classList.add('animate-fade-in');
  }
}
function toggleSoundMute() {
  const isMuted = SoundService.toggleMute();
  const icon = document.getElementById('soundToggleIcon');
  const btn = document.getElementById('soundToggleBtn');
  if (icon) {
    icon.className = isMuted ? 'fa-solid fa-volume-xmark text-slate-400' : 'fa-solid fa-volume-high text-amber-400';
  }
  if (btn) {
    btn.title = isMuted ? 'تشغيل المؤثرات الصوتية الفاخرة' : 'كتم المؤثرات الصوتية';
  }
}

/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - 3D HARDWARE-ACCELERATED INTERACTIVE ENGINE
 * Highly optimized, zero memory-leak, 100% click & touch safe
 * =========================================================================
 */
class System3DEngine {
  static lastTiltedCard = null;
  static isTicking = false;
  static currentEvent = null;

  static init() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    document.addEventListener('mousemove', (e) => {
      System3DEngine.currentEvent = e;
      if (!System3DEngine.isTicking) {
        window.requestAnimationFrame(() => {
          System3DEngine.handleMouseMove(System3DEngine.currentEvent);
          System3DEngine.isTicking = false;
        });
        System3DEngine.isTicking = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (System3DEngine.lastTiltedCard) {
        System3DEngine.resetCard(System3DEngine.lastTiltedCard);
        System3DEngine.lastTiltedCard = null;
      }
    }, { passive: true });
  }

  static handleMouseMove(e) {
    if (!e) return;
    const card = e.target.closest('.card-lift, .card-3d');
    if (!card) {
      if (System3DEngine.lastTiltedCard) {
        System3DEngine.resetCard(System3DEngine.lastTiltedCard);
        System3DEngine.lastTiltedCard = null;
      }
      return;
    }

    if (System3DEngine.lastTiltedCard && System3DEngine.lastTiltedCard !== card) {
      System3DEngine.resetCard(System3DEngine.lastTiltedCard);
    }
    System3DEngine.lastTiltedCard = card;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--card-mouse-x', `${x}px`);
    card.style.setProperty('--card-mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = 3.0;
    const translateY = -4;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.classList.remove('card-resetting');
    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${translateY}px)`;
  }

  static resetCard(card) {
    if (!card) return;
    card.classList.add('card-resetting');
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  }
}

// Bootstrap Application on DOM Ready (Guaranteed execution)
function bootstrapSystem() {
  if (typeof app !== 'undefined' && app.init) {
    app.init();
  }
  if (typeof System3DEngine !== 'undefined' && System3DEngine.init) {
    System3DEngine.init();
  }
  if (typeof SoundService !== 'undefined') {
    const isMuted = SoundService.isMuted();
    const icon = document.getElementById('soundToggleIcon');
    if (icon) {
      icon.className = isMuted ? 'fa-solid fa-volume-xmark text-slate-400' : 'fa-solid fa-volume-high text-amber-400';
    }
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootstrapSystem);
  } else {
    bootstrapSystem();
  }
}


if (typeof window !== 'undefined') {
  window.app = app;
  window.switchSubject = switchSubject;
  window.switchTab = switchTab;
  window.togglePrayer = togglePrayer;
  window.toggleGymStatus = toggleGymStatus;
  window.toggleSleepStatus = toggleSleepStatus;
  window.toggleQuran = toggleQuran;
  window.saveQuranPages = saveQuranPages;
  window.toggleProgrammingCourse = toggleProgrammingCourse;
  window.toggleProgrammingPillar = toggleProgrammingPillar;
  window.finalizeTodayLog = finalizeTodayLog;
  window.closeDailyResultModal = closeDailyResultModal;
  window.resetRoutineHistory = resetRoutineHistory;
  window.openCloudSyncModal = openCloudSyncModal;
  window.closeCloudSyncModal = closeCloudSyncModal;
  window.generateRandomSyncKey = generateRandomSyncKey;
  window.copyCloudShareableUrl = copyCloudShareableUrl;
  window.connectAndSyncCloud = connectAndSyncCloud;
  window.disconnectCloudSync = disconnectCloudSync;
  window.resetEntireSystem = resetEntireSystem;
  window.toggleIncompleteDetailsSection = toggleIncompleteDetailsSection;
  window.toggleSoundMute = toggleSoundMute;
  window.exportBackupData = exportBackupData;
  window.importBackupData = importBackupData;
  window.openAiMentorModal = openAiMentorModal;
  window.closeAiMentorModal = closeAiMentorModal;
  window.sendAiQuickPrompt = sendAiQuickPrompt;
  window.sendAiMessage = sendAiMessage;
}



// ==========================================
// AI Academic Mentor Global Controller Methods
// ==========================================
function openAiMentorModal() {
  const modal = document.getElementById('aiMentorModal');
  const card = document.getElementById('aiMentorModalCard');
  if (!modal || !card) return;
  modal.classList.remove('opacity-0', 'pointer-events-none');
  card.classList.remove('scale-95');
  card.classList.add('scale-100');
  setTimeout(() => {
    const inp = document.getElementById('aiChatInput');
    if (inp) inp.focus();
  }, 150);
}

function closeAiMentorModal() {
  const modal = document.getElementById('aiMentorModal');
  const card = document.getElementById('aiMentorModalCard');
  if (!modal || !card) return;
  modal.classList.add('opacity-0', 'pointer-events-none');
  card.classList.remove('scale-100');
  card.classList.add('scale-95');
}

function sendAiQuickPrompt(type) {
  const container = document.getElementById('aiChatContainer');
  if (!container) return;

  let userText = '🎯 اختبرني بأسئلة امتحانات';
  if (type === 'explain') userText = '💡 اشرح ولخص لي مفهوماً دراسياً مهماً';
  if (type === 'coding') userText = '📊 أعطني نصيحة في مسار AI & Data Analysis';
  if (type === 'progress') userText = '📈 حلل مستوى أدائي وإنجازي الدراسي';

  appendAiMessage('user', userText);
  showAiTypingAndRespond(type);
}

function sendAiMessage() {
  const inp = document.getElementById('aiChatInput');
  if (!inp || !inp.value.trim()) return;
  const text = inp.value.trim();
  inp.value = '';

  appendAiMessage('user', text);
  showAiTypingAndRespond(text);
}

function appendAiMessage(sender, text) {
  const container = document.getElementById('aiChatContainer');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `flex items-start gap-2.5 ai-bubble-in ${sender === 'user' ? 'justify-end' : ''}`;

  if (sender === 'user') {
    div.innerHTML = `
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs sm:text-sm max-w-[85%] leading-relaxed font-medium">
        ${text}
      </div>
      <div class="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0 font-bold">
        <i class="fa-solid fa-user"></i>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bg-white p-3.5 rounded-2xl rounded-tr-xs border border-slate-200 shadow-2xs text-slate-800 space-y-1.5 max-w-[85%] leading-relaxed text-xs sm:text-sm">
        ${text.replace(/\n/g, '<br>')}
      </div>
    `;
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showAiTypingAndRespond(query) {
  const container = document.getElementById('aiChatContainer');
  if (!container) return;

  const typingDiv = document.createElement('div');
  typingDiv.id = 'aiTypingIndicator';
  typingDiv.className = 'flex items-center gap-2 ai-bubble-in';
  typingDiv.innerHTML = `
    <div class="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0">
      <i class="fa-solid fa-robot animate-spin"></i>
    </div>
    <div class="bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs text-slate-500 font-bold">
      <span>المرشد يحلل ويصيغ الإجابة</span>
      <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 typing-dot"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-purple-600 typing-dot"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-pink-600 typing-dot"></span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) {
      if (typeof indicator.remove === 'function') indicator.remove();
      else if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
    }

    const currentState = (typeof app !== 'undefined' && app.state) ? app.state : {};
    const response = AIAcademicEngine.getResponse(query, currentState);
    appendAiMessage('ai', response);
    if (typeof confetti === 'function' && (query === 'quiz' || query.includes('اختبرني'))) {
      if (typeof triggerGoldConfetti === 'function') triggerGoldConfetti();
    }
  }, 600);
}
