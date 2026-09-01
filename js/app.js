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


  constructor() {
    this.storageService = new StorageService(APP_CONFIG.STORAGE_KEY);
    this.cloudSyncService = new CloudSyncService(this.storageService);
    this.state = this.storageService.load();
    this.currentEditingLessonKey = null;
  }

  async init() {
    HeaderView.render(this.state);
    this.cloudSyncService.updateStatusBadge();
    this.switchTab(this.state.activeTab || 'routine');

    // 1. Real-time live listener from Firebase Firestore
    this.cloudSyncService.subscribeRealtime((cloudState) => {
      if (cloudState && typeof cloudState === 'object' && cloudState.dailyLogs) {
        this.state = cloudState;
        this.storageService.save(this.state);
        HeaderView.render(this.state);
        if (this.state.activeTab === 'routine') this.renderRoutine();
        // Curriculum tab disabled
        if (this.state.activeTab === 'achievements') this.renderAchievements();
        if (this.state.activeTab === 'programming') this.renderProgramming();
        this.cloudSyncService.updateStatusBadge();
      }
    });

    // 2. Initial cloud state fetch
    try {
      const cloudState = await this.cloudSyncService.pull();
      if (cloudState && typeof cloudState === 'object' && cloudState.dailyLogs) {
        this.state = cloudState;
        this.storageService.save(this.state);
        this.renderRoutine();
        // No curriculum
        this.renderAchievements();
        this.renderProgramming();
        this.cloudSyncService.updateStatusBadge();
      }
    } catch (e) {}
  }

  saveAndRefreshViews() {
    this.storageService.save(this.state);
    this.cloudSyncService.push(this.state);
    HeaderView.render(this.state);
    if (this.state.activeTab === 'routine') this.renderRoutine();
    
    if (this.state.activeTab === 'programming') this.renderProgramming();
  }

  // ==========================================
  // Navigation: 4 Master Tabs
  // ==========================================
      switchTab(tabId) {
    if (!['routine', 'curriculum', 'achievements', 'programming'].includes(tabId)) {
      tabId = 'routine';
    }
    this.state.activeTab = tabId;

    // 1. Reset all tabs to standard inactive look
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('tab-btn-active');
      btn.classList.add('bg-slate-50', 'text-slate-700', 'border-slate-200');
    });

    // 2. Highlight strictly the active tab
    const activeBtn = document.getElementById(`tabBtn-${tabId}`);
    if (activeBtn) {
      activeBtn.classList.add('tab-btn-active');
      activeBtn.classList.remove('bg-slate-50', 'text-slate-700', 'border-slate-200');
    }

    const routineSec = document.getElementById('section-routine');
    const curricSec = document.getElementById('section-curriculum');
    const achieveSec = document.getElementById('section-achievements');
    const progSec = document.getElementById('section-programming');

    if (routineSec) routineSec.classList.toggle('hidden', tabId !== 'routine');
    if (curricSec) curricSec.classList.toggle('hidden', tabId !== 'curriculum');
    if (achieveSec) achieveSec.classList.toggle('hidden', tabId !== 'achievements');
    if (progSec) progSec.classList.toggle('hidden', tabId !== 'programming');

    if (tabId === 'routine') this.renderRoutine();
    if (tabId === 'curriculum') this.renderCurriculum();
    if (tabId === 'achievements') this.renderAchievements();
    if (tabId === 'programming') this.renderProgramming();

    this.storageService.save(this.state);
    HeaderView.render(this.state);
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
    RoutineView.render(this.getTodayLog());
  }

  togglePrayer(prayerId) {
    const log = this.getTodayLog();
    const nextState = !log.prayers[prayerId];
    log.prayers[prayerId] = nextState;

    const allDone = Object.values(log.prayers).filter(Boolean).length === 5;
    if (nextState && allDone) {
      SoundService.playSuccess();
      CelebrationService.fire('prayers');
    } else if (nextState) {
      SoundService.playCheck();
      CelebrationService.smallPop();
    } else {
      SoundService.playCheck();
    }

    this.renderRoutine();
    this.saveAndRefreshViews();
  }

  toggleGym() {
    const log = this.getTodayLog();
    const checkEl = document.getElementById('gymCheck');
    const isChecked = checkEl ? checkEl.checked : false;
    log.gym.done = isChecked;

    if (isChecked) {
      SoundService.playSuccess();
      CelebrationService.smallPop();
    } else {
      SoundService.playCheck();
    }

    this.renderRoutine();
    this.saveAndRefreshViews();
  }

  toggleSleep() {
    const log = this.getTodayLog();
    const checkEl = document.getElementById('sleepCheck');
    const isChecked = checkEl ? checkEl.checked : false;
    log.sleep.done = isChecked;

    if (isChecked) {
      SoundService.playSuccess();
      CelebrationService.smallPop();
    } else {
      SoundService.playCheck();
    }

    this.renderRoutine();
    this.saveAndRefreshViews();
  }

  toggleQuran() {
    const log = this.getTodayLog();
    const checkEl = document.getElementById('quranCheck');
    const isChecked = checkEl ? checkEl.checked : false;
    log.quran.done = isChecked;

    if (isChecked) {
      SoundService.playSuccess();
      CelebrationService.smallPop();
    } else {
      SoundService.playCheck();
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

    // 3. Save & Refresh views immediately (resets the screen checkboxes for the new day)
    this.saveAndRefreshViews();
    this.renderRoutine();

    // 4. Celebrations, Royal Fanfare & Motivational Modal Feedback
    if (is100) {
      SoundService.playFanfare();
      CelebrationService.fire('perfectDay');
    } else {
      SoundService.playSuccess();
      CelebrationService.smallPop();
    }

    ResultModalView.show(is100);
  }

  // ==========================================
  // Curriculum Handlers (By Subject)
  // ==========================================
  renderCurriculum() {
    CurriculumView.render(
      this.state.currentSubject || 0, 
      this.state.lessonProgress, 
      this.state.lessonNotes
    );
  }

  switchSubject(subjectIdx) {
    this.state.currentSubject = subjectIdx;
    // No curriculum
    const stage = document.getElementById('curriculumWeekStage');
    if (stage) {
      stage.classList.remove('animate-fade-in');
      void stage.offsetWidth;
      stage.classList.add('animate-fade-in');
    }
    this.saveAndRefreshViews();
  }

  switchWeek(weekNum) {
    this.state.currentWeek = weekNum;
    // No curriculum
    this.saveAndRefreshViews();
  }

  triggerGoldConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fde68a', '#10b981', '#6366f1', '#ffffff'],
        ticks: 200,
        gravity: 1.1,
        scalar: 1.2
      });
    }
  }

  toggleLesson(lessonKey) {
    const isNowCompleted = !Boolean(this.state.lessonProgress[lessonKey]);
    this.state.lessonProgress[lessonKey] = isNowCompleted;

    if (isNowCompleted) {
      SoundService.playCheck();
      CelebrationService.smallPop();
    } else {
      SoundService.playCheck();
    }

    // No curriculum
    this.saveAndRefreshViews();
  }

        // ==========================================
    // ==========================================
  // Curriculum Handlers (Subjects Only)
  // ==========================================
  renderCurriculum() {
    this.state.subjectsProgress = this.state.subjectsProgress || {};
    CurriculumView.render(this.state.subjectsProgress);
  }

  toggleSubjectCompletion(subjectId) {
    if (subjectId === undefined || subjectId === null) return;
    try {
      this.state.subjectsProgress = this.state.subjectsProgress || {};
      const isNowDone = !Boolean(this.state.subjectsProgress[subjectId]);
      this.state.subjectsProgress[subjectId] = isNowDone;

      if (isNowDone) {
        SoundService.playSuccess();
        CelebrationService.smallPop();
      } else {
        SoundService.playCheck();
      }

      this.storageService.save(this.state);
      this.cloudSyncService.push(this.state);
      HeaderView.render(this.state);
      this.renderCurriculum();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling subject:', err);
    }
  }

    // ==========================================
  // Curriculum Handlers (10 Weeks & 6 Subjects)
  // ==========================================
  renderCurriculum() {
    this.state.activeSubject = (typeof this.state.activeSubject === 'number') ? this.state.activeSubject : 0;
    this.state.lessonProgress = this.state.lessonProgress || {};
    this.state.lessonNotes = this.state.lessonNotes || {};
    CurriculumView.render(this.state.activeSubject, this.state.lessonProgress, this.state.lessonNotes);
  }

  switchSubject(subjectIdx) {
    this.state.activeSubject = subjectIdx;
    this.renderCurriculum();
    this.storageService.save(this.state);
  }

  toggleLesson(lessonKey) {
    if (!lessonKey) return;
    try {
      this.state.lessonProgress = this.state.lessonProgress || {};
      const current = Boolean(this.state.lessonProgress[lessonKey]);
      const isNowDone = !current;

      if (isNowDone) {
        this.state.lessonProgress[lessonKey] = true;
        SoundService.playCheck();
        CelebrationService.smallPop();
      } else {
        delete this.state.lessonProgress[lessonKey];
        SoundService.playCheck();
      }

      this.storageService.save(this.state);
      this.cloudSyncService.push(this.state);
      HeaderView.render(this.state);
      this.renderCurriculum();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling lesson:', err);
    }
  }

  // Programming Track Handlers
  // ==========================================
  renderProgramming() {
    this.state.programmingCourses = this.state.programmingCourses || {};
    ProgrammingView.render(this.state.programmingCourses);
  }

  toggleProgrammingCourse(courseId) {
    this.triggerGoldConfetti();
    if (!courseId) return;
    try {
      this.state.programmingCourses = this.state.programmingCourses || {};
      const isNowDone = !Boolean(this.state.programmingCourses[courseId]);
      this.state.programmingCourses[courseId] = isNowDone;

      if (isNowDone) {
        SoundService.playSuccess();
        CelebrationService.smallPop();
      } else {
        SoundService.playCheck();
      }

      this.storageService.save(this.state);
      this.cloudSyncService.push(this.state);
      HeaderView.render(this.state);
      this.renderProgramming();
      this.renderAchievements();
    } catch (err) {
      console.error('Error toggling course:', err);
    }
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
  // Achievements Handlers
  // ==========================================
    renderAchievements() {
    this.state.dailyLogs = this.state.dailyLogs || {};
    this.state.lessonProgress = this.state.lessonProgress || {};
    this.state.programmingCourses = this.state.programmingCourses || {};
    AchievementsView.render(this.state.dailyLogs, weeksData, this.state.lessonProgress, this.state.programmingCourses);
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
if (typeof window !== "undefined") { window.app = app; }

// Global event delegates for HTML inline events
function switchSubject(idx) { app.switchSubject(idx); }
function switchTab(tabId) { app.switchTab(tabId); }
function togglePrayer(prayerId) { app.togglePrayer(prayerId); }
function toggleGymStatus() { app.toggleGym(); }
function toggleSleepStatus() { app.toggleSleep(); }
function toggleQuran() { app.toggleQuran(); }
function saveQuranPages() { app.saveQuranPages(); }
function toggleLessonCompletion(key) { app.toggleLesson(key); }
function openNoteModal(key, subj, title) { app.openNoteModal(key, subj, title); }
function closeNoteModal() { app.closeNoteModal(); }
function saveCurrentLessonNote() { app.saveLessonNote(); }
function exportBackupData() { app.exportBackup(); }
function importBackupData(event) { app.importBackup(event); }
function finalizeTodayLog() { app.finalizeTodayLog(); }
function closeDailyResultModal() { ResultModalView.close(); }
function resetRoutineHistory() { app.resetRoutineHistory(); }
function openCloudSyncModal() { app.openCloudSyncModal(); }
function closeCloudSyncModal() { app.closeCloudSyncModal(); }
function generateRandomSyncKey() { app.generateRandomSyncKey(); }
function copyCloudShareableUrl() { app.copyCloudShareableUrl(); }
function connectAndSyncCloud() { app.connectAndSyncCloud(); }
function disconnectCloudSync() { app.disconnectCloudSync(); }
function resetEntireSystem() { app.resetEntireSystem(); }
function toggleSubjectCompletion(id) { app.toggleSubjectCompletion(id); }
function toggleProgrammingCourse(id) { app.toggleProgrammingCourse(id); }
if (typeof window !== 'undefined') {
  window.toggleSubjectCompletion = toggleSubjectCompletion;
  window.toggleProgrammingCourse = toggleProgrammingCourse;
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

// Bootstrap Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  app.init();
  const isMuted = SoundService.isMuted();
  const icon = document.getElementById('soundToggleIcon');
  if (icon) {
    icon.className = isMuted ? 'fa-solid fa-volume-xmark text-slate-400' : 'fa-solid fa-volume-high text-amber-400';
  }
});


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
  if (type === 'coding') userText = '💻 أعطني نصيحة في مسار البرمجة';
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
    if (indicator) indicator.remove();

    const currentState = (typeof app !== 'undefined' && app.state) ? app.state : {};
    const response = AIAcademicEngine.getResponse(query, currentState);
    appendAiMessage('ai', response);
    if (typeof confetti === 'function' && (query === 'quiz' || query.includes('اختبرني'))) {
      if (typeof triggerGoldConfetti === 'function') triggerGoldConfetti();
    }
  }, 600);
}
