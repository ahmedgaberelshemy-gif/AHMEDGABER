/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - APPLICATION ARCHITECTURE & MEDIATOR (SOLID & CLEAN CODE)
 * =========================================================================
 * S - Single Responsibility: Separate engines for Tab Navigation, Gestures, 3D Tilt, and AI Mentor.
 * O - Open/Closed: TabRegistry manages tabs dynamically without modifying switchTab logic.
 * L - Liskov Substitution: Modular services can be swapped with matching interfaces.
 * I - Interface Segregation: Discrete modules for storage, sync, audio, views, and mentors.
 * D - Dependency Inversion: AppController receives injected dependencies with sensible defaults.
 * Clean Code: DRY, atomic functions, descriptive naming, fail-safe error boundaries.
 */

// =========================================================================
// 1. TAB REGISTRY & ROUTER (Open / Closed Principle)
// =========================================================================
class TabRegistry {
  constructor() {
    this._tabs = new Map();
    this._initDefaultTabs();
  }

  _initDefaultTabs() {
    this.register('routine', {
      sectionId: 'section-routine',
      buttonId: 'tabBtn-routine',
      activeClass: 'tab-active-routine',
      render: (controller) => controller.renderRoutine()
    });

    this.register('languages', {
      sectionId: 'section-languages',
      buttonId: 'tabBtn-languages',
      activeClass: 'tab-active-languages',
      render: (controller) => controller.renderLanguages()
    });

    this.register('roadmap', {
      sectionId: 'section-roadmap',
      buttonId: 'tabBtn-roadmap',
      activeClass: 'tab-active-roadmap',
      render: (controller) => controller.renderRoadmap()
    });

    this.register('programming', {
      sectionId: 'section-programming',
      buttonId: 'tabBtn-programming',
      activeClass: 'tab-active-programming',
      render: (controller) => controller.renderProgramming()
    });

    // Legacy fallback (hidden by default)
    this.register('curriculum', {
      sectionId: 'section-curriculum',
      buttonId: 'tabBtn-curriculum',
      activeClass: 'tab-active-curriculum',
      render: (controller) => controller.renderCurriculum()
    });
  }

  register(tabId, config) {
    this._tabs.set(tabId, config);
  }

  get(tabId) {
    return this._tabs.get(tabId);
  }

  has(tabId) {
    return this._tabs.has(tabId);
  }

  getValidTabIds() {
    return Array.from(this._tabs.keys());
  }

  getAllSectionIds() {
    return Array.from(this._tabs.values()).map(cfg => cfg.sectionId);
  }
}

// =========================================================================
// 2. TOUCH GESTURE ENGINE (Single Responsibility: Mobile Swipe Navigation)
// =========================================================================
class TouchGestureEngine {
  constructor(onSwipeNext, onSwipePrev) {
    this.onSwipeNext = onSwipeNext;
    this.onSwipePrev = onSwipePrev;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
  }

  init(containerSelector = '#part-main-workspace') {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const container = document.querySelector(containerSelector) || document.body;
    if (!container) return;

    container.addEventListener('touchstart', (e) => this._handleTouchStart(e), { passive: true });
    container.addEventListener('touchend', (e) => this._handleTouchEnd(e), { passive: true });
  }

  _handleTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
    }
  }

  _handleTouchEnd(e) {
    if (!this.touchStartX || !e.changedTouches || e.changedTouches.length !== 1) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const duration = Date.now() - this.touchStartTime;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    this.touchStartX = 0;
    this.touchStartY = 0;

    // Reject long drifts or vertical scrolls
    if (duration > 450 || Math.abs(deltaX) < 65 || Math.abs(deltaY) > 60) return;

    // Ignore if inside an interactive modal or input
    const target = e.target;
    if (target && target.closest('#noteModal, #cloudSyncModal, #dailyResultModal, #aiMentorModal, input, textarea, select')) {
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }

    if (deltaX < 0) {
      if (typeof this.onSwipeNext === 'function') this.onSwipeNext();
    } else if (deltaX > 0) {
      if (typeof this.onSwipePrev === 'function') this.onSwipePrev();
    }
  }
}

// =========================================================================
// 3. 3D HARDWARE-ACCELERATED CARD TILT ENGINE (Single Responsibility)
// =========================================================================
class CardTiltEngine {
  static lastTiltedCard = null;
  static isTicking = false;
  static currentEvent = null;

  static init() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    document.addEventListener('mousemove', (e) => {
      this.currentEvent = e;
      if (!this.isTicking) {
        window.requestAnimationFrame(() => {
          this.handleMouseMove(this.currentEvent);
          this.isTicking = false;
        });
        this.isTicking = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (this.lastTiltedCard) {
        this.resetCard(this.lastTiltedCard);
        this.lastTiltedCard = null;
      }
    }, { passive: true });
  }

  static handleMouseMove(e) {
    if (!e) return;
    const card = e.target.closest('.card-lift, .card-3d');
    if (!card) {
      if (this.lastTiltedCard) {
        this.resetCard(this.lastTiltedCard);
        this.lastTiltedCard = null;
      }
      return;
    }

    if (this.lastTiltedCard && this.lastTiltedCard !== card) {
      this.resetCard(this.lastTiltedCard);
    }
    this.lastTiltedCard = card;

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

// =========================================================================
// 4. AI MENTOR CONTROLLER (Single Responsibility: AI Academic Interaction)
// =========================================================================
class AiMentorController {
  constructor(appController) {
    this.app = appController;
  }

  openModal() {
    if (typeof AiMentorView !== 'undefined' && AiMentorView.openModal) {
      AiMentorView.openModal();
    }
  }

  closeModal() {
    if (typeof AiMentorView !== 'undefined' && AiMentorView.closeModal) {
      AiMentorView.closeModal();
    }
  }

  sendQuickPrompt(type) {
    let userText = '🎯 اختبرني بأسئلة امتحانات';
    if (type === 'explain') userText = '💡 اشرح ولخص لي مفهوماً دراسياً مهماً';
    if (type === 'coding') userText = '📊 أعطني نصيحة في مسار AI & Data Analysis';
    if (type === 'progress') userText = '📈 حلل مستوى أدائي وإنجازي الدراسي';

    if (typeof AiMentorView !== 'undefined' && AiMentorView.appendMessage) {
      AiMentorView.appendMessage('user', userText);
    }
    this._processQuery(type);
  }

  sendMessage() {
    const inp = document.getElementById('aiChatInput');
    if (!inp || !inp.value.trim()) return;
    const text = inp.value.trim();
    inp.value = '';

    if (typeof AiMentorView !== 'undefined' && AiMentorView.appendMessage) {
      AiMentorView.appendMessage('user', text);
    }
    this._processQuery(text);
  }

  _processQuery(query) {
    if (typeof AiMentorView !== 'undefined' && AiMentorView.showTypingIndicator) {
      AiMentorView.showTypingIndicator();
    }

    setTimeout(() => {
      if (typeof AiMentorView !== 'undefined' && AiMentorView.removeTypingIndicator) {
        AiMentorView.removeTypingIndicator();
      }

      const currentState = (this.app && this.app.state) ? this.app.state : {};
      const response = (typeof AIAcademicEngine !== 'undefined') ? AIAcademicEngine.getResponse(query, currentState) : 'أهلاً بك! معك المرشد الأكاديمي والمهني لمنظومة الامتياز 🚀';
      
      if (typeof AiMentorView !== 'undefined' && AiMentorView.appendMessage) {
        AiMentorView.appendMessage('ai', response);
      }

      if (typeof confetti === 'function' && (query === 'quiz' || (typeof query === 'string' && query.includes('اختبرني')))) {
        CelebrationService.fire('prayers');
      }
    }, 600);
  }
}

// =========================================================================
// 5. APPLICATION CONTROLLER (Mediator Pattern & High-Level Orchestrator)
// =========================================================================
class AppController {
  constructor(dependencies = {}) {
    this.tabRegistry = dependencies.tabRegistry || new TabRegistry();
    this.storageService = dependencies.storageService || new StorageService();
    this.cloudSyncService = dependencies.cloudSyncService || new CloudSyncService(this.storageService, {
      onStatusChange: (status) => {
        if (typeof HeaderView !== 'undefined' && HeaderView.updateSyncStatus) {
          HeaderView.updateSyncStatus(status);
        }
      }
    });
    this.soundService = dependencies.soundService || SoundService;
    this.celebrationService = dependencies.celebrationService || CelebrationService;
    this.aiMentor = new AiMentorController(this);
    this.state = this.storageService.load();
    this.currentEditingLessonKey = null;
  }

  async init() {
    this._initTabClickListeners();
    this._initGestureEngine();
    this._initUrlHashListener();

    if (typeof HeaderView !== 'undefined') {
      HeaderView.render(this.state);
      HeaderView.updateSyncStatus(this.cloudSyncService.status);
    }

    const initialTab = this._resolveInitialTab();
    this.switchTab(initialTab);

    // 1. Subscribe to real-time cloud changes
    this.cloudSyncService.subscribeRealtime((cloudState) => this._onCloudSyncUpdate(cloudState));

    // 2. Initial cloud state pull
    await this._fetchInitialCloudState();
  }

  _resolveInitialTab() {
    const urlParams = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : null;
    const urlTab = urlParams ? urlParams.get('tab') : null;
    const hashTab = (typeof window !== 'undefined' && window.location.hash) ? window.location.hash.replace('#', '') : null;

    if (urlTab && this.tabRegistry.has(urlTab)) return urlTab;
    if (hashTab && this.tabRegistry.has(hashTab)) return hashTab;
    return this.state.activeTab && this.tabRegistry.has(this.state.activeTab) ? this.state.activeTab : 'routine';
  }

  _initTabClickListeners() {
    if (typeof document === 'undefined') return;
    this.tabRegistry.getValidTabIds().forEach(tabId => {
      const btn = document.getElementById(`tabBtn-${tabId}`);
      if (btn) {
        btn.onclick = (e) => {
          if (e && e.preventDefault) e.preventDefault();
          this.switchTab(tabId);
        };
      }
    });
  }

  _initGestureEngine() {
    const tabs = ['routine', 'languages', 'roadmap', 'programming'];
    this.gestureEngine = new TouchGestureEngine(
      () => {
        const currentIndex = tabs.indexOf(this.state.activeTab || 'routine');
        if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
          this.switchTab(tabs[currentIndex + 1]);
        }
      },
      () => {
        const currentIndex = tabs.indexOf(this.state.activeTab || 'routine');
        if (currentIndex !== -1 && currentIndex > 0) {
          this.switchTab(tabs[currentIndex - 1]);
        }
      }
    );
    this.gestureEngine.init('#part-main-workspace');
  }

  _initUrlHashListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
        if (this.tabRegistry.has(hash) && this.state.activeTab !== hash) {
          this.switchTab(hash);
        }
      });
    }
  }

  _onCloudSyncUpdate(cloudState) {
    if (cloudState && typeof cloudState === 'object' && cloudState.dailyLogs) {
      const currentTab = this.state.activeTab || 'routine';
      this.state = cloudState;
      this.state.activeTab = currentTab;
      this.storageService.save(this.state);
      if (typeof HeaderView !== 'undefined') {
        HeaderView.render(this.state);
        HeaderView.updateSyncStatus(this.cloudSyncService.status);
      }
      this.switchTab(currentTab);
    }
  }

  async _fetchInitialCloudState() {
    try {
      const cloudState = await this.cloudSyncService.pull();
      if (cloudState && typeof cloudState === 'object' && cloudState.dailyLogs) {
        const currentTab = this.state.activeTab || 'routine';
        this.state = cloudState;
        this.state.activeTab = currentTab;
        this.storageService.save(this.state);
        this.switchTab(currentTab);
        if (typeof HeaderView !== 'undefined') {
          HeaderView.updateSyncStatus(this.cloudSyncService.status);
        }
      }
    } catch (e) {
      console.warn('AppController: Initial cloud pull skipped', e);
    }
  }

  // ==========================================
  // Navigation & Tab Switching (Open/Closed)
  // ==========================================
  switchTab(tabId) {
    const targetTab = this.tabRegistry.has(tabId) ? tabId : 'routine';
    this.state.activeTab = targetTab;

    // 1. Reset all tab button highlight states
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-btn-active', 'bg-slate-50', 'text-slate-700', 'border-slate-200',
          'tab-active-routine', 'tab-active-languages', 'tab-active-roadmap', 'tab-active-programming', 'tab-active-curriculum');
      });

      // 2. Highlight active tab button
      const activeBtn = document.getElementById(`tabBtn-${targetTab}`);
      if (activeBtn) {
        activeBtn.classList.add('tab-btn-active', `tab-active-${targetTab}`);
      }

      // 3. Show active section, hide others
      this.tabRegistry.getValidTabIds().forEach(id => {
        const config = this.tabRegistry.get(id);
        if (config && config.sectionId) {
          const sectionEl = document.getElementById(config.sectionId);
          if (sectionEl) {
            const isActive = (id === targetTab);
            sectionEl.style.display = isActive ? 'block' : 'none';
            sectionEl.classList.toggle('hidden', !isActive);
          }
        }
      });
    }

    this.renderActiveTab();
    this.storageService.save(this.state);
    if (typeof HeaderView !== 'undefined') {
      HeaderView.render(this.state);
    }

    if (typeof window !== 'undefined') {
      if (window.history && window.history.replaceState) {
        try { window.history.replaceState(null, '', '#' + targetTab); } catch (e) {}
      }
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  renderActiveTab() {
    const activeConfig = this.tabRegistry.get(this.state.activeTab || 'routine');
    if (activeConfig && typeof activeConfig.render === 'function') {
      activeConfig.render(this);
    }
  }

  saveAndRefreshViews() {
    this.storageService.save(this.state);
    this.cloudSyncService.push(this.state);
    if (typeof HeaderView !== 'undefined') {
      HeaderView.render(this.state);
    }
    this.renderActiveTab();
  }

  // ==========================================
  // Routine Domain Actions
  // ==========================================
  getTodayLog() {
    const today = this.storageService.getTodayKey();
    this.storageService.ensureTodayLog(this.state);
    return this.state.dailyLogs[today];
  }

  renderRoutine() {
    if (typeof AchievementsView !== 'undefined' && AchievementsView.renderRoutineAchievements) {
      AchievementsView.renderRoutineAchievements(this.state.dailyLogs);
    }
    if (typeof RoutineView !== 'undefined' && RoutineView.render) {
      RoutineView.render(this.getTodayLog());
    }
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

    // 1. Archive the finalized day into history
    const recordId = `record_${Date.now()}`;
    this.state.dailyLogs[recordId] = {
      ...JSON.parse(JSON.stringify(currentLog)),
      submitted: true,
      recordedAt: new Date().toISOString()
    };

    // 2. Reset today's active routine inputs
    this.state.dailyLogs[today] = this.storageService.createDefaultDayLog();

    // 3. Save & Refresh views immediately
    this.saveAndRefreshViews();
    this.renderRoutine();

    // 4. Celebrations & Motivational Modal Feedback
    if (is100) {
      this.soundService.playFanfare();
      this.celebrationService.fire('perfectDay');
    } else {
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
    }

    if (typeof ResultModalView !== 'undefined' && ResultModalView.show) {
      ResultModalView.show(is100);
    }
  }

  async resetRoutineHistory() {
    if (confirm('هل تريد تصفير سجل أيام الروتين وإعادة عداد الأيام إلى (0 يوم) مع الحفاظ الكامل على تقدم المسارات الأخرى؟')) {
      const today = this.storageService.getTodayKey();
      this.state.dailyLogs = {
        [today]: this.storageService.createDefaultDayLog()
      };

      this.storageService.save(this.state);

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

      this.renderRoutine();
      if (typeof HeaderView !== 'undefined') {
        HeaderView.render(this.state);
      }
      this.soundService.playSuccess();
      alert('✅ تم تصفير سجل أيام الروتين بنجاح (0 يوم)! 🔄');
    }
  }

  // ==========================================
  // Languages Track Domain Actions
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
    } catch (err) {
      console.error('Error toggling language course:', err);
    }
  }

  // ==========================================
  // Roadmap Track Domain Actions
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
    } catch (err) {
      console.error('Error toggling roadmap item:', err);
    }
  }

  // ==========================================
  // AI & Data Analysis Domain Actions
  // ==========================================
  renderProgramming() {
    this.state.programmingCourses = this.state.programmingCourses || {};
    if (typeof ProgrammingView !== 'undefined' && ProgrammingView.render) {
      ProgrammingView.render(this.state);
    }
  }

  toggleProgrammingPillar(pillarId) {
    if (!pillarId) return;
    try {
      this.state.programmingCourses = this.state.programmingCourses || {};
      const isNowDone = !Boolean(this.state.programmingCourses[pillarId]);
      this.state.programmingCourses[pillarId] = isNowDone;

      if (isNowDone) {
        this.soundService.playSuccess();
        this.celebrationService.smallPop();
      } else {
        this.soundService.playCheck();
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
  // Curriculum Handlers (Backward Compatibility)
  // ==========================================
  renderCurriculum() {
    if (typeof CurriculumView !== 'undefined' && CurriculumView.render) {
      CurriculumView.render(this.state.activeSubject || 0, this.state.lessonProgress || {}, this.state.lessonNotes || {});
    }
  }

  switchSubject(subjectIdx) {
    this.state.activeSubject = subjectIdx;
    this.renderCurriculum();
    this.storageService.save(this.state);
  }

  toggleLesson(lessonKey) {
    if (!lessonKey) return;
    this.state.lessonProgress = this.state.lessonProgress || {};
    this.state.lessonProgress[lessonKey] = !Boolean(this.state.lessonProgress[lessonKey]);
    this.saveAndRefreshViews();
    this.renderCurriculum();
  }

  toggleSubjectCompletion(subjectId) {
    if (subjectId === undefined || subjectId === null) return;
    this.state.subjectsProgress = this.state.subjectsProgress || {};
    this.state.subjectsProgress[subjectId] = !Boolean(this.state.subjectsProgress[subjectId]);
    this.saveAndRefreshViews();
    this.renderCurriculum();
  }

  // ==========================================
  // Notes Modal Domain Actions
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

      const weekObj = (typeof weeksData !== 'undefined') ? weeksData.find(w => w.week === weekNum) : null;
      if (weekObj && weekObj.subjects && weekObj.subjects[subjectIdx]) {
        subjectName = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.SUBJECT_NAMES) ? APP_CONFIG.SUBJECT_NAMES[subjectIdx] || subjectName : subjectName;
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
    if (textEl) textEl.value = (this.state.lessonNotes && this.state.lessonNotes[lessonKey]) || '';

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
    if (modal && card) {
      modal.classList.add('opacity-0', 'pointer-events-none');
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
    }
    this.currentEditingLessonKey = null;
  }

  saveLessonNote() {
    if (!this.currentEditingLessonKey) return;
    const text = document.getElementById('modalNoteText')?.value.trim() || '';

    if (!this.state.lessonNotes) this.state.lessonNotes = {};
    if (text) {
      this.state.lessonNotes[this.currentEditingLessonKey] = text;
    } else {
      delete this.state.lessonNotes[this.currentEditingLessonKey];
    }

    this.saveAndRefreshViews();
    this.closeNoteModal();
  }

  // ==========================================
  // Cloud Sync Modal Domain Actions
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
      this.soundService.playCheck();
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
    this.soundService.playCheck();

    const cloudState = await this.cloudSyncService.pull();
    if (cloudState && typeof cloudState === 'object') {
      this.state = cloudState;
      this.storageService.save(this.state);
      this.renderRoutine();
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
      alert(`✅ تم الاتصال بالخزنة السحابية (${key}) وتحميل أحدث البيانات بنجاح!`);
    } else {
      await this.cloudSyncService.push(this.state);
      this.soundService.playSuccess();
      this.celebrationService.smallPop();
      alert(`✅ تم إنشاء الخزنة السحابية (${key}) ورفع بياناتك الحالية بنجاح!`);
    }

    this.closeCloudSyncModal();
  }

  disconnectCloudSync() {
    if (confirm('هل تريد إلغاء الربط السحابي والرجوع للوضع المحلي؟')) {
      this.cloudSyncService.setSyncKey('');
      this.closeCloudSyncModal();
      this.soundService.playCheck();
      alert('تم فصل المزامنة السحابية بنجاح ⚪');
    }
  }

  // ==========================================
  // Backup, Restore & System Reset Actions
  // ==========================================
  exportBackup() {
    const today = this.storageService.getTodayKey();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Janaklis_Tracker_Backup_${today}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importBackup(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && typeof imported === 'object') {
          this.state = imported;
          this.storageService.save(this.state);

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

          this.soundService.playSuccess();
          this.saveAndRefreshViews();
          this.renderRoutine();
          if (typeof HeaderView !== 'undefined') {
            HeaderView.render(this.state);
          }
          alert('✅ تم استرجاع نسختك الاحتياطية بنجاح 100%! عادت كل بياناتك كما كانت تماماً 🛡️');
        }
      } catch (err) {
        alert('ملف غير صالح! يرجى اختيار ملف نسخة احتياطية صحيح.');
      }
    };
    reader.readAsText(file);
  }

  async resetEntireSystem() {
    if (confirm('تحذير: هل تريد تصفير جميع بيانات المنظومة بالكامل والبدء من الصفر تماماً 0%؟')) {
      this.state = this.storageService.createInitialState();
      
      try {
        localStorage.clear();
        localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(this.state));
        if (this.cloudSyncService.syncKey) {
          localStorage.setItem('janaklis_cloud_sync_key', this.cloudSyncService.syncKey);
        }
      } catch (e) {}

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

      this.saveAndRefreshViews();
      this.renderRoutine();
      this.soundService.playSuccess();
      alert('✅ تم تصفير المنظومة بنجاح تام (0%)! أنت الآن جاهز للانطلاق 🚀👑');
    }
  }
}

// =========================================================================
// 6. SINGLETON INSTANCE & DELEGATED UI EVENT HANDLERS (DRY Principle)
// =========================================================================
const app = new AppController();

// UI Helper: Incomplete details toggle in Routine
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

// UI Helper: Sound mute toggle
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

// Global Single-Source Event Registry for HTML markup compatibility
const globalBindings = {
  app,
  // Navigation
  switchTab: (id) => app.switchTab(id),
  // Routine
  togglePrayer: (id) => app.togglePrayer(id),
  toggleGymStatus: () => app.toggleGym(),
  toggleSleepStatus: () => app.toggleSleep(),
  toggleQuran: () => app.toggleQuran(),
  saveQuranPages: () => app.saveQuranPages(),
  finalizeTodayLog: () => app.finalizeTodayLog(),
  closeDailyResultModal: () => { if (typeof ResultModalView !== 'undefined') ResultModalView.close(); },
  resetRoutineHistory: () => app.resetRoutineHistory(),
  toggleIncompleteDetailsSection,
  // Languages Track
  toggleLanguageCourse: (id) => app.toggleLanguageCourse(id),
  // Roadmap Track
  toggleRoadmapItem: (id) => app.toggleRoadmapItem(id),
  // AI & Data Track
  toggleProgrammingPillar: (id) => app.toggleProgrammingPillar(id),
  toggleProgrammingCourse: (id) => app.toggleProgrammingPillar(id),
  // AI Academic Mentor
  openAiMentorModal: () => app.aiMentor.openModal(),
  closeAiMentorModal: () => app.aiMentor.closeModal(),
  sendAiQuickPrompt: (type) => app.aiMentor.sendQuickPrompt(type),
  sendAiMessage: () => app.aiMentor.sendMessage(),
  // Notes Modal
  openNoteModal: (key) => app.openNoteModal(key),
  closeNoteModal: () => app.closeNoteModal(),
  saveCurrentLessonNote: () => app.saveLessonNote(),
  // Cloud Sync Modal
  openCloudSyncModal: () => app.openCloudSyncModal(),
  closeCloudSyncModal: () => app.closeCloudSyncModal(),
  generateRandomSyncKey: () => app.generateRandomSyncKey(),
  copyCloudShareableUrl: () => app.copyCloudShareableUrl(),
  connectAndSyncCloud: () => app.connectAndSyncCloud(),
  disconnectCloudSync: () => app.disconnectCloudSync(),
  // Backup & Reset
  exportBackupData: () => app.exportBackup(),
  importBackupData: (e) => app.importBackup(e),
  resetEntireSystem: () => app.resetEntireSystem(),
  toggleSoundMute,
  // Backward compatibility
  switchSubject: (idx) => app.switchSubject(idx),
  toggleLessonCompletion: (key) => app.toggleLesson(key),
  toggleSubjectCompletion: (id) => app.toggleSubjectCompletion(id)
};

if (typeof window !== 'undefined') {
  Object.assign(window, globalBindings);
}

// =========================================================================
// 7. BOOTSTRAP SYSTEM ON DOM READY
// =========================================================================
function bootstrapSystem() {
  if (typeof app !== 'undefined' && app.init) {
    app.init();
  }
  if (typeof CardTiltEngine !== 'undefined' && CardTiltEngine.init) {
    CardTiltEngine.init();
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
