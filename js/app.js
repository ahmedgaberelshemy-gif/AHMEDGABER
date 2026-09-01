/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - APPLICATION CONTROLLER & BOOTSTRAP (Mediator)
 * =========================================================================
 */

class AppController {

  

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
  
}



