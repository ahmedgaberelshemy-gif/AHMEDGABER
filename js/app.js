/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - APPLICATION CONTROLLER & BOOTSTRAP (Mediator)
 * =========================================================================
 */

class AppController {
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
    if (!['routine', 'achievements', 'programming'].includes(tabId)) {
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
    const achieveSec = document.getElementById('section-achievements');
    const progSec = document.getElementById('section-programming');

    if (routineSec) routineSec.classList.toggle('hidden', tabId !== 'routine');
    if (achieveSec) achieveSec.classList.toggle('hidden', tabId !== 'achievements');
    if (progSec) progSec.classList.toggle('hidden', tabId !== 'programming');

    if (tabId === 'routine') this.renderRoutine();
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
  // Programming Track Handlers
  // ==========================================
  renderProgramming() {
    this.state.programmingCourses = this.state.programmingCourses || {};
    ProgrammingView.render(this.state.programmingCourses);
  }

  toggleProgrammingCourse(courseId) {
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
    AchievementsView.render(this.state, this.storageService);
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
function toggleProgrammingCourse(id) { app.toggleProgrammingCourse(id); }
if (typeof window !== 'undefined') {
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
}

