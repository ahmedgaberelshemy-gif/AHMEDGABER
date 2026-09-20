/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - VIEW RENDERERS (SRP / Clean UI Separation)
 * =========================================================================
 * Solid Principles & Clean Code Architecture:
 * - Single Responsibility Principle (SRP): Each View class manages UI rendering for its specific domain context.
 * - Open/Closed Principle (OCP): Pure Light Mode Design Token system with rich colored badges & 3D cards.
 * - Robust Defensive Checks: Prevents null reference errors or broken DOM state.
 */

// 1. ROUTINE VIEW (Prayers, Gym, Sleep, Quran, Finalize Button)
class RoutineView {
  static render(dayLog) {
    if (!dayLog) return;
    this.renderHeaderStats(dayLog);
    this.renderPrayers(dayLog.prayers || {});
    this.renderGym(dayLog.gym || {});
    this.renderSleep(dayLog.sleep || {});
    this.renderQuran(dayLog.quran || {});
    this.renderFinalizeStatus(dayLog);
  }

  static renderHeaderStats(dayLog) {
    const prayersDone = Object.values(dayLog.prayers || {}).filter(Boolean).length;
    const isPrayersComplete = prayersDone === 5;
    const quranDone = Boolean(dayLog.quran?.done);
    const gymDone = Boolean(dayLog.gym?.done);
    const sleepDone = Boolean(dayLog.sleep?.done);

    // Count the 4 core pillars: Prayers, Quran, Gym, Sleep
    const donePillars = (isPrayersComplete ? 1 : 0) + (quranDone ? 1 : 0) + (gymDone ? 1 : 0) + (sleepDone ? 1 : 0);
    const totalPillars = 4;
    const percent = Math.round(((prayersDone * 6) + (quranDone ? 20 : 0) + (gymDone ? 25 : 0) + (sleepDone ? 25 : 0)));

    const todayDoneStat = document.getElementById('routineTodayDoneStat');
    if (todayDoneStat) todayDoneStat.innerText = `${donePillars} / ${totalPillars}`;

    const overallBadge = document.getElementById('routineOverallBadge');
    if (overallBadge) {
      if (percent === 100) {
        overallBadge.innerText = '100% يوم مثالي معتمد 👑';
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black font-display shadow-sm';
      } else if (percent === 0) {
        overallBadge.innerText = '0% | انطلاقة اليوم والتفوق 🚀';
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black font-display shadow-sm';
      } else {
        overallBadge.innerText = `${percent}% مكتمل اليوم ⚡`;
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black font-display shadow-sm';
      }
    }

    const cardBadge = document.getElementById('routineTodayCardBadge');
    if (cardBadge) {
      cardBadge.innerText = donePillars === 0 
        ? 'بانتظار إنجاز أول ركن اليوم ⚡' 
        : `${donePillars} من ${totalPillars} أركان منجزة`;
    }
  }

  static renderPrayers(prayers = {}) {
    const container = document.getElementById('prayersListContainer');
    const badge = document.getElementById('prayersCountBadge');
    const box = document.getElementById('prayersStatusBox');
    const msg = document.getElementById('prayersStatusMsg');
    if (!container) return;

    const count = Object.values(prayers).filter(Boolean).length;
    if (badge) badge.innerText = `${count} / 5 صلوات`;

    const prayerOrder = [
      { id: 'fajr', name: 'صلاة الفجر', time: 'مفتاح الرزق والنشاط' },
      { id: 'dhuhr', name: 'صلاة الظهر', time: 'تجديد العهد والتركيز' },
      { id: 'asr', name: 'صلاة العصر', time: 'الصلاة الوسطى' },
      { id: 'maghrib', name: 'صلاة المغرب', time: 'شكر النعمة' },
      { id: 'isha', name: 'صلاة العشاء', time: 'ختام اليوم بسلام' }
    ];

    container.innerHTML = prayerOrder.map(prayer => {
      const isDone = Boolean(prayers[prayer.id]);
      return `
        <div class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition shadow-2xs ${
          isDone 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-500/10' 
            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300'
        }">
          <div class="flex items-center gap-3.5">
            <input 
              type="checkbox" 
              id="prayer-${prayer.id}" 
              ${isDone ? 'checked' : ''} 
              onchange="togglePrayer('${prayer.id}')"
              class="checkbox-custom w-6 h-6"
            />
            <div>
              <label for="prayer-${prayer.id}" class="text-sm sm:text-base font-black cursor-pointer select-none leading-tight block ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">
                ${prayer.name}
              </label>
              <span class="text-[11px] text-slate-500 font-bold block mt-0.5">${prayer.time}</span>
            </div>
          </div>
          ${isDone ? '<span class="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl shadow-2xs">تمت بنجاح ✅</span>' : '<span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-300">بانتظار الصلاة ⏳</span>'}
        </div>
      `;
    }).join('');

    if (box && msg) {
      if (count === 5) {
        box.className = 'p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-center mt-4 shadow-2xs';
        msg.innerHTML = '🎉 ما شاء الله! أتممت الصلوات الخمس كاملة في أوقاتها.. جعلها الله في ميزان حسناتك 🌿';
      } else {
        box.className = 'p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center mt-4 shadow-2xs';
        msg.innerText = 'الصلاة عماد الدين.. حافظ على كل صلاة في وقتها لتنال التوفيق الأعظم 🌿';
      }
    }
  }

  static renderGym(gym = {}) {
    const check = document.getElementById('gymCheck');
    const badge = document.getElementById('gymStatusBadge');
    const box = document.getElementById('gymCardBox');
    if (!check) return;

    const isDone = Boolean(gym.done);
    check.checked = isDone;

    if (badge) {
      badge.innerText = isDone ? 'تم التمارين 💪' : 'لم يتم ⏳';
      badge.className = isDone 
        ? 'text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl shadow-2xs' 
        : 'text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-300';
    }

    if (box) {
      box.className = isDone 
        ? 'p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 bg-amber-50 border-amber-300 text-amber-900 shadow-2xs' 
        : 'p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 bg-slate-50 border-slate-200 hover:border-amber-400 shadow-2xs';
    }
  }

  static renderSleep(sleep = {}) {
    const check = document.getElementById('sleepCheck');
    const badge = document.getElementById('sleepStatusBadge');
    const box = document.getElementById('sleepCardBox');
    if (!check) return;

    const isDone = Boolean(sleep.done);
    check.checked = isDone;

    if (badge) {
      badge.innerText = isDone ? 'نوم صحي ممتاز 😴' : 'لم يتم ⏳';
      badge.className = isDone 
        ? 'text-xs font-black text-indigo-900 bg-indigo-100 border border-indigo-300 px-3 py-1 rounded-xl shadow-2xs' 
        : 'text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-300';
    }

    if (box) {
      box.className = isDone 
        ? 'p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs' 
        : 'p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 bg-slate-50 border-slate-200 hover:border-indigo-400 shadow-2xs';
    }
  }

  static renderQuran(quran = {}) {
    const check = document.getElementById('quranCheck');
    const badge = document.getElementById('quranStatusBadge');
    const box = document.getElementById('quranCardBox');
    if (!check) return;

    const isDone = Boolean(quran.done);
    check.checked = isDone;

    if (badge) {
      badge.innerText = isDone ? 'تم القراءة 🌿' : 'لم يتم ⏳';
      badge.className = isDone 
        ? 'text-xs font-black text-teal-900 bg-teal-100 border border-teal-300 px-3 py-1 rounded-xl shadow-2xs' 
        : 'text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-300';
    }

    if (box) {
      box.className = isDone 
        ? 'p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 bg-teal-50 border-teal-300 text-teal-900 shadow-2xs' 
        : 'p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 bg-slate-50 border-slate-200 hover:border-teal-400 shadow-2xs';
    }
  }

  static renderFinalizeStatus(dayLog) {
    const pill = document.getElementById('finalizeStatusPill');
    const btn = document.getElementById('finalizeDayBtn');
    const btnText = document.getElementById('finalizeBtnText');
    const btnIcon = document.getElementById('finalizeBtnIcon');

    if (!pill || !btnText) return;

    const calmBtnClass = 'w-full sm:w-auto px-7 sm:px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-display font-black text-sm sm:text-base border border-amber-400 flex items-center justify-center gap-2.5 transition cursor-pointer select-none shadow-lg shadow-amber-500/25 shrink-0';

    if (dayLog && dayLog.submitted) {
      const prayersDone = Object.values(dayLog.prayers || {}).filter(Boolean).length;
      const is100 = (prayersDone === 5 && Boolean(dayLog.quran?.done) && Boolean(dayLog.gym?.done) && Boolean(dayLog.sleep?.done));

      if (is100) {
        pill.innerHTML = '<i class="fa-solid fa-crown text-emerald-700"></i> تم الاعتماد: التزام تام 100% 👑';
        pill.className = 'px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-2xs sm:text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      } else {
        pill.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-rose-700"></i> تم الاعتماد: يوم به نقص ⚠️';
        pill.className = 'px-3 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-2xs sm:text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      }

      btnText.innerText = 'تحديث اعتماد اليوم 🔄';
      if (btnIcon) btnIcon.className = 'fa-solid fa-check-double text-slate-950 text-xs';
      if (btn) btn.className = calmBtnClass;
    } else {
      pill.innerHTML = '<i class="fa-solid fa-bolt text-amber-600"></i> جاهز للتسجيل ⚡';
      pill.className = 'px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-2xs sm:text-xs font-black inline-flex items-center gap-1';
      btnText.innerText = 'تسجيل واعتماد اليوم ✅';
      if (btnIcon) btnIcon.className = 'fa-solid fa-crown text-slate-950 text-xs';
      if (btn) btn.className = calmBtnClass;
    }
  }
}

// 2. ACHIEVEMENTS VIEW (Routine Discipline & Performance Diagnostics)
class AchievementsView {
  static render(dailyLogs = {}, weeks = [], lessonProgress = {}, programmingCourses = {}) {
    this.renderRoutineAchievements(dailyLogs);
  }

  // Routine Discipline & Performance Diagnostics Card
  static renderRoutineAchievements(dailyLogs = {}) {
    const detailsContainer = document.getElementById('routineDetailsContainer');

    const stats = DisciplineCalculator.calculateHistoryStats(dailyLogs);
    const incompleteHistory = DisciplineCalculator.getIncompleteDaysDetails(dailyLogs);
    const totalSemesterDays = APP_CONFIG.TOTAL_SEMESTER_DAYS || 112;
    const perfectSemesterPercentage = totalSemesterDays > 0 ? Math.round((stats.perfectDays / totalSemesterDays) * 100) : 0;
    const remainingDays = Math.max(0, totalSemesterDays - stats.totalLoggedDays);
    const incompletePercentage = stats.totalLoggedDays > 0 ? Math.round((stats.incompleteDays / stats.totalLoggedDays) * 100) : 0;

    // Update unique cumulative metrics in the TOP HERO BANNER
    const loggedCountEl = document.getElementById('routineLoggedDaysCount');
    if (loggedCountEl) loggedCountEl.innerText = `${stats.totalLoggedDays} / ${totalSemesterDays}`;

    const perfectDaysStatEl = document.getElementById('routinePerfectDaysStat');
    if (perfectDaysStatEl) perfectDaysStatEl.innerText = `${stats.perfectDays}`;

    const overallPercentText = document.getElementById('routineOverallPercentText');
    if (overallPercentText) overallPercentText.innerText = `${perfectSemesterPercentage}%`;

    const overallProgressBar = document.getElementById('routineOverallProgressBar');
    if (overallProgressBar) overallProgressBar.style.width = `${perfectSemesterPercentage}%`;

    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
      <!-- Performance Diagnostics & Missed Days Log Card -->
      <div class="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-7 shadow-lg space-y-6 card-lift">
        
        <!-- Header: Diagnostic Purpose -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 gap-2 flex-wrap">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-xl shadow-xs shrink-0">
              <i class="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <div>
              <h3 class="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight">
                سجل تشريح الأداء وتدارك التقصير 🔍
              </h3>
              <span class="text-xs sm:text-sm text-slate-500 font-bold leading-tight block mt-0.5">
                تتبع الأيام غير المكتملة وتشريح أسباب التقصير لتداركها فورياً، وأدوات إدارة البيانات
              </span>
            </div>
          </div>
          <span class="text-xs sm:text-sm font-black text-indigo-800 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
            الرتبة: ${stats.rank?.title || 'طالب منضبط 🌟'} 🎖️
          </span>
        </div>

        <!-- 3 Unique Diagnostic Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <!-- Card 1: Incomplete Days -->
          <div class="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="flex items-center justify-between gap-1 text-rose-800 text-xs sm:text-sm font-black">
              <span class="flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i> أيام بها تقصير</span>
              <span class="font-mono text-sm font-black text-rose-800">${incompletePercentage}%</span>
            </div>
            <p class="text-xs text-slate-600 font-bold">أيام حدث بها نقص في الصلاة أو العادات</p>
            <div class="text-3xl sm:text-4xl font-black font-mono text-rose-700 my-1" dir="ltr">
              ${stats.incompleteDays} <span class="text-xs font-bold text-slate-500 font-cairo">يوم</span>
            </div>
            <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-rose-500 rounded-full transition-all duration-300" style="width: ${incompletePercentage}%;"></div>
            </div>
            <span class="text-xs font-bold text-rose-800 block">رصد النواقص لتداركها ومنع تكرارها</span>
          </div>

          <!-- Card 2: Remaining Days -->
          <div class="p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="flex items-center justify-between gap-1 text-indigo-800 text-xs sm:text-sm font-black">
              <span class="flex items-center gap-2"><i class="fa-solid fa-calendar-days text-indigo-600 text-base"></i> متبقي بالترم</span>
              <span class="font-mono text-sm font-black text-indigo-800">${totalSemesterDays > 0 ? Math.round((remainingDays / totalSemesterDays) * 100) : 0}%</span>
            </div>
            <p class="text-xs text-slate-600 font-bold">فرص قادمة كل يوم لتعزيز الامتياز</p>
            <div class="text-3xl sm:text-4xl font-black font-mono text-indigo-700 my-1" dir="ltr">
              ${remainingDays} <span class="text-xs font-bold text-slate-500 font-cairo">يوم</span>
            </div>
            <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full transition-all duration-300" style="width: ${totalSemesterDays > 0 ? Math.round((remainingDays / totalSemesterDays) * 100) : 0}%;"></div>
            </div>
            <span class="text-xs font-bold text-indigo-800 block">متبقي حتى نهاية الفصل الدراسي 🏆</span>
          </div>

          <!-- Card 3: Current Streak -->
          <div class="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="flex items-center justify-between gap-1 text-amber-800 text-xs sm:text-sm font-black">
              <span class="flex items-center gap-2"><i class="fa-solid fa-fire text-amber-600 text-base"></i> سلسلة الالتزام</span>
              <span class="text-xs font-bold text-amber-700 font-mono">متواصل 🔥</span>
            </div>
            <p class="text-xs text-slate-600 font-bold">عدد الأيام المتتالية دون أي انقطاع</p>
            <div class="text-3xl sm:text-4xl font-black font-mono text-amber-700 my-1" dir="ltr">
              ${stats.streak} <span class="text-xs font-bold text-slate-500 font-cairo">أيام متتالية</span>
            </div>
            <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 rounded-full transition-all duration-300" style="width: ${Math.min(100, (stats.streak / 14) * 100)}%;"></div>
            </div>
            <span class="text-xs font-bold text-amber-800 block">استمر في حماية شعلة الالتزام 🔥</span>
          </div>

        </div>

        <!-- Incomplete Days Breakdown Log or Spotless Streak Banner -->
        ${incompleteHistory.length > 0 ? `
          <div class="border-2 border-rose-300 rounded-2xl bg-white overflow-hidden shadow-2xs">
            <button 
              type="button"
              onclick="toggleIncompleteDetailsSection()" 
              class="w-full p-4 bg-rose-50 hover:bg-rose-100 flex items-center justify-between gap-3 text-right font-bold text-xs sm:text-sm text-rose-800 transition cursor-pointer select-none"
            >
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-rose-600"></i>
                <span>سجل الأيام التي وقع بها تقصير (${incompleteHistory.length} يوم) - اضغط لتشريح الأسباب وتصحيح المسار</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span id="toggleIncompleteText" class="text-xs text-rose-700 font-mono font-bold">عرض التفاصيل 🔍</span>
                <i id="toggleIncompleteIcon" class="fa-solid fa-chevron-down text-rose-600 text-xs"></i>
              </div>
            </button>

            <div id="incompleteDetailsWrapper" class="hidden divide-y divide-slate-200 p-4 space-y-3 bg-white">
              ${incompleteHistory.map(day => `
                <div class="pt-3 first:pt-0 space-y-1.5">
                  <div class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="font-bold text-slate-900 font-mono">${day.date}</span>
                    <span class="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold">
                      ${day.missedCount} عناصر لم تكتمل
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    ${day.missed.map(item => `
                      <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-xmark text-rose-600 text-[10px]"></i> ${item}
                      </span>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 text-center shadow-2xs">
            <i class="fa-solid fa-crown text-amber-600 text-lg"></i>
            <span>سجلك ناصع البياض والتزامك 100% بدون أي تقصير حتى الآن! استمر في طريق المركز الأول 👑</span>
          </div>
        `}

        <!-- Data Operations Toolbar: Reset & Backup/Restore -->
        <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button 
            type="button"
            onclick="resetRoutineHistory()" 
            class="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm border border-rose-300 flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-2xs" 
            title="تصفير سجل الأيام والروتين فقط إلى 0 يوم"
          >
            <i class="fa-solid fa-rotate-left text-rose-600"></i> تصفير سجل الأيام التراكمي (0 يوم) 🔄
          </button>

          <div class="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button onclick="exportBackupData()" class="justify-center px-3 sm:px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs sm:text-sm border border-indigo-200 flex items-center gap-2 transition cursor-pointer shadow-2xs" title="تصدير نسخة احتياطية من كافة البيانات">
              <i class="fa-solid fa-download"></i> تصدير نسخة 📥
            </button>
            <label class="justify-center px-3 sm:px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 flex items-center gap-2 cursor-pointer transition shadow-2xs" title="استرجاع نسخة احتياطية">
              <i class="fa-solid fa-upload"></i> استرجاع نسخة 📤
              <input type="file" id="importFileInput" accept=".json" onchange="importBackupData(event)" class="hidden" />
            </label>
          </div>
        </div>

      </div>
    `;
  }
}

// 3. PROGRAMMING VIEW (AI & Data Analysis)
class ProgrammingView {
  static render(state = {}) {
    const container = document.getElementById('programmingCoursesContainer');
    if (!container) return;

    const stats = typeof ProgrammingService !== 'undefined' 
      ? ProgrammingService.getOverallStats(state) 
      : { total: 4, done: 0, percent: 0 };

    const pillars = [
      {
        id: 'ai_01',
        num: 'المحور 01',
        title: 'الذكاء الاصطناعي التوليدي',
        subtitle: 'Generative AI & Prompt Engineering',
        icon: 'fa-robot',
        color: 'purple',
        desc: 'تطبيقات (ChatGPT, Claude, Copilot) في البحث الأكاديمي، صياغة التقارير الإدارية، وتوليد الأفكار التسويقية وحل المشكلات التكتيكية.',
        feature: 'صياغة الأوامر الاحترافية',
        tag: 'تطبيق إداري مباشر ⚡'
      },
      {
        id: 'ai_02',
        num: 'المحور 02',
        title: 'تحليل البيانات بـ Excel المتقدم',
        subtitle: 'Advanced Excel for Business Analytics',
        icon: 'fa-file-excel',
        color: 'emerald',
        desc: 'الدوال المركبة (VLOOKUP, XLOOKUP, INDEX/MATCH)، الجداول الديناميكية Pivot Tables، والتحليل المالي لربط القوائم المحاسبية.',
        feature: 'النمذجة المحاسبية والمالية',
        tag: 'أساسيات المحاسبة والإدارة 📈'
      },
      {
        id: 'ai_03',
        num: 'المحور 03',
        title: 'لوحات القيادة بـ Power BI',
        subtitle: 'Business Intelligence & Power BI',
        icon: 'fa-chart-pie',
        color: 'amber',
        desc: 'ربط مصادر البيانات المتعددة، تنظيف البيانات بـ Power Query، وبناء لوحات المراقبة التفاعلية للمبيعات والأداء المؤسسي.',
        feature: 'تصور البيانات التفاعلي',
        tag: 'إشراف وقيادة المنظمات 👑'
      },
      {
        id: 'ai_04',
        num: 'المحور 04',
        title: 'برمجة وبحوث البيانات بـ Python',
        subtitle: 'Python for Data Analysis & Automation',
        icon: 'fa-python',
        isBrand: true,
        color: 'blue',
        desc: 'استخدام مكتبات (Pandas, NumPy, Matplotlib) للمعالجة التلقائية للبيانات الضخمة واستخلاص مؤشرات الأداء الرئيسية.',
        feature: 'الأتمتة واستخراج الرؤى',
        tag: 'مهارة المستقبل المطلوبة 🏆'
      }
    ];

    const badgeText = stats.percent === 0 
      ? '0% | انطلاقة عصر الذكاء الاصطناعي 📊' 
      : (stats.percent === 100 ? '100% إتقان تام للمحاور 👑' : `${stats.percent}% مكتمل 📊`);

    const pillarsCardsHtml = pillars.map(p => {
      const isDone = typeof ProgrammingService !== 'undefined' ? ProgrammingService.isDone(state, p.id) : false;
      return `
        <div class="bg-white rounded-3xl border-2 ${isDone ? 'border-emerald-500 shadow-xl bg-emerald-50/20' : 'border-slate-200 shadow-lg'} p-5 sm:p-6 space-y-4 card-lift hover-glow-${p.color} transition-all">
          <div class="flex items-center justify-between pb-3.5 border-b border-slate-200 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <input 
                type="checkbox" 
                id="programming-${p.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleProgrammingPillar('${p.id}')" 
                class="checkbox-custom w-6 h-6 shrink-0"
              />
              <div class="w-11 h-11 rounded-2xl bg-${p.color}-50 text-${p.color}-600 border border-${p.color}-200 flex items-center justify-center text-xl shadow-xs shrink-0">
                <i class="${p.isBrand ? 'fa-brands' : 'fa-solid'} ${p.icon} text-${p.color}-600"></i>
              </div>
              <div class="min-w-0 flex-1">
                <label for="programming-${p.id}" class="font-display font-black text-base sm:text-lg cursor-pointer select-none leading-snug block ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">
                  ${p.title}
                </label>
                <span class="text-xs text-slate-500 font-bold block truncate">${p.subtitle}</span>
              </div>
            </div>
            <span class="px-3 py-1 rounded-xl text-xs font-black shrink-0 ${isDone ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 border border-slate-300'}">
              ${isDone ? 'مكتمل ✅' : 'بانتظار الإنجاز ⏳'}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">
            ${p.desc}
          </p>
          <div class="pt-2 flex items-center justify-between text-xs font-bold text-slate-500 border-t border-slate-100">
            <span><i class="fa-solid fa-circle-check text-${p.color}-600"></i> ${p.feature}</span>
            <span class="text-${p.color}-700">${p.tag}</span>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="col-span-full space-y-6">

        <!-- AI & Data Track Hero Banner -->
        <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border-b-4 border-purple-500 relative overflow-hidden card-lift">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div class="space-y-2.5">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-black font-display inline-flex items-center gap-1.5 shadow-sm">
                  <i class="fa-solid fa-brain text-purple-400"></i> مسار الذكاء الاصطناعي وتحليل البيانات 📊🤖
                </span>
                <span class="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black font-display shadow-sm">
                  ${badgeText}
                </span>
              </div>
              <h2 class="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white leading-normal sm:leading-relaxed">
                دعم اتخاذ القرار الإداري <span class="text-purple-400">بأدوات الـ AI</span> و <span class="text-amber-400">تكنولوچيا البيانات 📊</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 font-medium">
                إتقان أدوات الذكاء الاصطناعي التوليدي، تحليل البيانات المالية والإدارية، ولوحات التقرير التفاعلية (Power BI & Advanced Excel)
              </p>
            </div>

            <!-- Live Progress Metric Capsule -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center shrink-0 w-full lg:w-64 shadow-inner">
              <span class="text-[10px] sm:text-xs text-slate-300 font-bold block mb-1">المحاور المنجزة:</span>
              <div class="text-2xl sm:text-3xl font-black font-display text-purple-300 font-mono" dir="ltr">${stats.done} / ${stats.total}</div>
              <span class="text-[10px] sm:text-xs text-purple-300 font-bold block mt-0.5">${stats.percent === 0 ? 'جاهزية كاملة للانطلاق 🚀' : stats.percent + '% إتقان تخصصي ⚡'}</span>
            </div>
          </div>

          <!-- Overall AI Progress Bar -->
          <div class="mt-6 pt-4 border-t border-white/10">
            <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-300 mb-2">
              <span class="flex items-center gap-2"><i class="fa-solid fa-chart-line text-purple-400"></i> مؤشر إتقان مسار الذكاء الاصطناعي والبيانات:</span>
              <span class="text-purple-300 font-black font-mono text-sm">${stats.percent}%</span>
            </div>
            <div class="w-full h-3.5 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
              <div class="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shimmer-progress-bar" style="width: ${stats.percent}%;"></div>
            </div>
          </div>
        </div>

        <!-- 4 Core AI & Data Analysis Pillars Grid with Checkboxes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          ${pillarsCardsHtml}
        </div>

      </div>
    `;
  }
}

// 4. HEADER VIEW (Live Header Metadata & Controls)
class HeaderView {
  static render(state = {}) {
    this.updateSoundIcon();
  }

  static updateSoundIcon() {
    const icon = document.getElementById('soundToggleIcon');
    const btn = document.getElementById('soundToggleBtn');
    if (!icon) return;
    const isMuted = typeof SoundService !== 'undefined' ? SoundService.isMuted() : false;
    icon.className = isMuted ? 'fa-solid fa-volume-xmark text-slate-400' : 'fa-solid fa-volume-high text-amber-400';
    if (btn) {
      btn.title = isMuted ? 'تشغيل المؤثرات الصوتية الفاخرة' : 'كتم المؤثرات الصوتية';
    }
  }

  static updateSyncStatus(status) {
    const badge = document.getElementById('cloudSyncHeaderBadge');
    if (!badge) return;

    if (status === 'syncing') {
      badge.className = 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-bold font-display shadow-sm backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition active:scale-95';
      badge.innerHTML = '<i class="fa-solid fa-rotate text-amber-400 animate-spin text-xs sm:text-sm"></i> <span>جاري الحفظ... 🔄</span>';
    } else if (status === 'connected') {
      badge.className = 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-xs font-bold font-display shadow-sm backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition active:scale-95';
      badge.innerHTML = '<i class="fa-solid fa-cloud-arrow-up text-emerald-400 text-xs sm:text-sm"></i> <span>مزامنة سحابية متصلة 🟢</span>';
    } else {
      badge.className = 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 text-[10px] sm:text-xs font-bold font-display shadow-md backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition active:scale-95';
      badge.innerHTML = '<i class="fa-solid fa-hard-drive text-amber-400 text-xs sm:text-sm"></i> <span>تخزين محلي ⚪</span>';
    }
  }
}

// 5. RESULT MODAL VIEW (Motivational Feedback on Day Registration)
class ResultModalView {
  static show(is100) {
    const modal = document.getElementById('dailyResultModal');
    const card = document.getElementById('dailyResultModalCard');
    const iconBox = document.getElementById('resultModalIconBox');
    const tag = document.getElementById('resultModalTag');
    const title = document.getElementById('resultModalTitle');
    const message = document.getElementById('resultModalMessage');
    const actionBtn = document.getElementById('resultModalActionBtn');

    if (!modal || !card) return;

    if (is100) {
      // 100% Perfect Day
      iconBox.className = 'w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30 animate-bounce';
      iconBox.innerHTML = '<i class="fa-solid fa-crown"></i>';

      tag.className = 'text-xs font-black font-display px-3.5 py-1 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300';
      tag.innerText = '🏆 يوم التزام تام 100% (أُضيف لسجل الشرف)';

      title.innerText = 'وحش يا بطل.. انضباط أسطوري اليوم! 🔥👑';
      message.innerHTML = 'ما شاء الله تبارك الله! قفّلت يومك بصلواتك الخمس كاملة، ورد القرآن، تمرين الجيم، والنوم المثالي (7-9 ساعات). الاستمرار على الانضباط الحديدي ده هو اللي هيصنع مستقبلك ويوصلك لامتياز الترم الأول. فخورين بيك يا بطل، استمر على نفس القوة! 🌟';

      actionBtn.className = 'w-full py-3.5 px-5 rounded-2xl font-display font-black text-sm text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-500/25 cursor-pointer';
      actionBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> يلا نبدأ اليوم الجديد بنفس القوة والتركيز 🚀';
    } else {
      // Incomplete Day
      iconBox.className = 'w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-rose-500/30';
      iconBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';

      tag.className = 'text-xs font-black font-display px-3.5 py-1 rounded-full border bg-rose-100 text-rose-800 border-rose-300';
      tag.innerText = '⚠️ يوم به نقص (أُضيف لسجل الأيام الناقصة)';

      title.innerText = 'محتاج تشد حيلك وتلتزم أكتر يا وحش! 💪';
      message.innerHTML = 'النهاردة فاتتك بعض المهام الأساسية (صلاة، جيم، أو ساعات النوم)، والنجاح الحقيقي مبيقبلش الأعذار. اعتبر اليوم ده درس وجرس إنذار، قفل على نفسك التشتيت، وعوّض بكرة بالتزام حديدي 100% بدون أي تهاون! 🎯';

      actionBtn.className = 'w-full py-3.5 px-5 rounded-2xl font-display font-black text-sm text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 shadow-slate-900/30 cursor-pointer';
      actionBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i> فهمت.. هعوّض بكرة والتزم 100% إن شاء الله 🎯';
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }

  static close() {
    const modal = document.getElementById('dailyResultModal');
    const card = document.getElementById('dailyResultModalCard');
    if (!modal || !card) return;

    modal.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
  }
}

// 6. ROADMAP VIEW (SRP: Renders 15 Courses, Skills, and Certifications)
class RoadmapView {
  static render(state) {
    if (!state) return;
    this.renderHeaderStats(state);
    this.renderYearsGrid(state);
  }

  static renderHeaderStats(state) {
    const stats = RoadmapService.getOverallStats(state);

    const overallBadge = document.getElementById('roadmapOverallBadge');
    if (overallBadge) {
      if (stats.percent === 0) {
        overallBadge.innerText = '0% | خطة بناء المستقبل والريادة 🏆';
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs font-black font-display shadow-sm';
      } else if (stats.percent === 100) {
        overallBadge.innerText = '100% ريادة واعتماد دولي 👑';
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black font-display shadow-sm';
      } else {
        overallBadge.innerText = stats.percent + '% مكتمل 🏆';
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black font-display shadow-sm';
      }
    }

    const skillsStat = document.getElementById('roadmapSkillsStat');
    if (skillsStat) skillsStat.innerText = stats.doneSkills + ' / ' + stats.totalSkills;

    const certsStat = document.getElementById('roadmapCertsStat');
    if (certsStat) certsStat.innerText = stats.doneCerts + ' / ' + stats.totalCerts;

    const percentText = document.getElementById('roadmapOverallPercentText');
    if (percentText) percentText.innerText = stats.percent + '%';

    const progressBar = document.getElementById('roadmapOverallProgressBar');
    if (progressBar) progressBar.style.width = stats.percent + '%';
  }

  static renderYearsGrid(state) {
    const container = document.getElementById('roadmapYearsGrid');
    if (!container) return;

    const years = (typeof ROADMAP_YEARS_DATA !== 'undefined') ? ROADMAP_YEARS_DATA : [];
    container.innerHTML = '';

    years.forEach(year => {
      const yearStats = RoadmapService.getYearStats(state, year);
      const isYearComplete = yearStats.percent === 100;

      const card = document.createElement('article');
      card.className = 'bg-white rounded-3xl border-2 ' + (isYearComplete ? 'border-emerald-500 shadow-lg' : 'border-slate-200') + ' p-5 sm:p-7 shadow-lg flex flex-col justify-between space-y-5 card-lift hover-glow-blue relative overflow-hidden';

      // Skills & Workshops List
      let skillsHtml = '';
      (year.skills || []).forEach(s => {
        const isDone = RoadmapService.isDone(state, s.id);
        
        let erpSubHtml = '';
        if (s.id === 'skill_09') {
          erpSubHtml = `
            <div class="mt-3 space-y-2 pr-3 border-r-4 border-blue-500">
              <div class="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm gap-2 shadow-2xs">
                <span class="font-bold text-slate-900 flex items-center gap-1.5"><i class="fa-solid fa-server text-blue-600"></i> 9.1. ساب المالي (SAP S/4HANA)</span>
                <span class="text-xs font-black text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-lg shrink-0">الشركات الكبرى والبترول</span>
              </div>
              <div class="flex items-center justify-between bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm gap-2 shadow-2xs">
                <span class="font-bold text-slate-900 flex items-center gap-1.5"><i class="fa-solid fa-cloud text-rose-600"></i> 9.2. أوراكل المالي (Oracle Cloud)</span>
                <span class="text-xs font-black text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-lg shrink-0">البنوك والحكومة</span>
              </div>
              <div class="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm gap-2 shadow-2xs">
                <span class="font-bold text-slate-900 flex items-center gap-1.5"><i class="fa-solid fa-network-wired text-emerald-600"></i> 9.3. داينامكس (Dynamics 365)</span>
                <span class="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg shrink-0">سلاسل الإمداد</span>
              </div>
            </div>
          `;
        }

        skillsHtml += `
          <li class="p-3.5 sm:p-4 rounded-2xl border-2 transition shadow-2xs ${isDone ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-sm font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg shrink-0 shadow-2xs">${s.num}</span>
              ${isDone ? '<span class="text-xs sm:text-sm font-black px-3 py-1 rounded-lg bg-indigo-600 text-white shrink-0 shadow-2xs">مكتسب ✨</span>' : '<span class="text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 shrink-0">' + s.category + '</span>'}
            </div>
            <div class="flex items-start gap-3 min-w-0">
              <input 
                type="checkbox" 
                id="roadmap-${s.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleRoadmapItem('${s.id}')" 
                class="checkbox-custom w-6 h-6 shrink-0 mt-0.5"
              />
              <div class="min-w-0 flex-1">
                <label for="roadmap-${s.id}" class="text-base sm:text-lg font-black cursor-pointer select-none leading-relaxed block ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">
                  ${s.name}
                </label>
                ${erpSubHtml}
              </div>
            </div>
          </li>
        `;
      });

      // Certifications List
      let certsHtml = '';
      (year.certifications || []).forEach(crt => {
        const isDone = RoadmapService.isDone(state, crt.id);
        
        let certSubHtml = '';
        if (crt.id === 'cert_02') {
          certSubHtml = `
            <div class="mt-2.5 flex items-center gap-2 flex-wrap">
              <span class="text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-certificate text-blue-600"></i> CertIFR: شهادة المعايير التمهيدية (Online)
              </span>
              <span class="text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-award text-emerald-600"></i> DipIFR: دبلومة المعايير المهنية الدولية
              </span>
            </div>
          `;
        }

        certsHtml += `
          <li class="p-3.5 sm:p-4 rounded-2xl border-2 transition shadow-2xs ${isDone ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}">
            <div class="flex items-center justify-between mb-2 gap-2">
              <span class="text-xs sm:text-sm font-mono font-black px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">${crt.id.toUpperCase()}</span>
              <span class="text-xs sm:text-sm font-black px-3 py-1 rounded-lg ${isDone ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 border border-slate-300'}">
                ${isDone ? 'حاصل عليها 🎓' : 'مستهدفة 🎯'}
              </span>
            </div>
            <div class="flex items-start gap-3 min-w-0">
              <input 
                type="checkbox" 
                id="roadmap-${crt.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleRoadmapItem('${crt.id}')" 
                class="checkbox-custom w-6 h-6 shrink-0 mt-0.5"
              />
              <div class="min-w-0 flex-1">
                <label for="roadmap-${crt.id}" class="text-base sm:text-lg font-black cursor-pointer select-none block leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">
                  ${crt.name}
                </label>
                ${certSubHtml}
                <span class="text-xs sm:text-sm text-slate-500 font-bold block mt-1.5"><i class="fa-solid fa-building-columns text-slate-500"></i> ${crt.org}</span>
              </div>
            </div>
          </li>
        `;
      });

      const yrText = year.yearNum === 1 ? 'سنة أولى' : (year.yearNum === 2 ? 'سنة ثانية' : (year.yearNum === 3 ? 'سنة ثالثة' : 'سنة رابعة'));
      const certBridgeText = year.yearNum === 4 ? 'الشهادات الكبرى عند التخرج:' : `الشهادات المهنية بعد ${yrText}:`;

      let certsSectionHtml = '';
      if ((year.certifications || []).length > 0) {
        certsSectionHtml = `
          <!-- Pathway Bridge: Certifications -->
          <div class="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm sm:text-base font-black py-2.5 px-4 rounded-xl my-3.5 shadow-2xs">
            <i class="fa-solid fa-award text-amber-600 text-base"></i> ${certBridgeText}
          </div>

          <!-- Part 2: Professional Certifications -->
          <ul class="space-y-3">
            ${certsHtml}
          </ul>
        `;
      } else {
        certsSectionHtml = `
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 justify-center my-3.5 shadow-2xs">
            <i class="fa-solid fa-shield-halved text-emerald-600 text-base shrink-0"></i>
            <span>التركيز 100% في سنة أولى على المناهج وحصد المركز الأول 🏆 (الشهادات الدولية تبدأ من سنة ثانية)</span>
          </div>
        `;
      }

      card.innerHTML = `
        <!-- Year Card Header -->
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <span class="text-sm sm:text-base font-black px-4 py-1.5 rounded-full ${year.pillColor ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-blue-50 text-blue-800 border-blue-200'} flex items-center gap-2 border shadow-2xs">
              <i class="fa-solid ${year.icon}"></i> ${year.stagePill}
            </span>
            <span dir="ltr" class="text-sm sm:text-base font-black font-display font-mono ${isYearComplete ? 'text-emerald-700' : 'text-blue-700'}">
              ${yearStats.percent}% (${yearStats.doneItems}/${yearStats.totalItems})
            </span>
          </div>

          <!-- Progress Bar for this Year -->
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 mb-4 border border-slate-200 shadow-inner">
            <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300" style="width: ${yearStats.percent}%;"></div>
          </div>

          <!-- Pathway Bridge: Skills -->
          <div class="flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm sm:text-base font-black py-2.5 px-4 rounded-xl my-3.5 shadow-2xs">
            <i class="fa-solid fa-laptop-code text-indigo-600 text-base"></i> الكورسات والمهارات العملية (${yrText}):
          </div>

          <!-- Part 1: Skills & Practical Workshops -->
          <ul class="space-y-3 mb-4">
            ${skillsHtml}
          </ul>

          ${certsSectionHtml}
        </div>

        <div class="pt-4 border-t border-slate-200 text-center">
          <span class="text-xs sm:text-sm font-bold text-slate-500">
            ${isYearComplete ? '🎉 تم إنجاز متطلبات السنة بالكامل!' : 'تتبع متطلبات التميز الأكاديمي والمهني'}
          </span>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

// 7. LANGUAGE TRACK VIEW (SRP: Renders 33 Language Courses with Playlists)
class LanguageTrackView {
  static render(state) {
    if (!state) return;
    this.renderHeaderStats(state);
    this.renderLevelsGrid(state);
  }

  static renderHeaderStats(state) {
    const stats = LanguageTrackService.getOverallStats(state);

    const badge = document.getElementById('langOverallBadge');
    if (badge) {
      if (stats.percent === 0) {
        badge.innerText = '0% | انطلاقة رحلة الطلاقة 🌐';
        badge.className = 'px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black font-display shadow-sm';
      } else if (stats.percent === 100) {
        badge.innerText = '100% طلاقة تامة معتمدة 🏆';
        badge.className = 'px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black font-display shadow-sm';
      } else {
        badge.innerText = stats.percent + '% مكتمل 🌐';
        badge.className = 'px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black font-display shadow-sm';
      }
    }

    const countEl = document.getElementById('langCompletedCount');
    if (countEl) countEl.innerText = stats.done + ' / ' + stats.total;

    const percentText = document.getElementById('langOverallPercentText');
    if (percentText) percentText.innerText = stats.percent + '%';

    const progressBar = document.getElementById('langOverallProgressBar');
    if (progressBar) progressBar.style.width = stats.percent + '%';
  }

  static renderLevelsGrid(state) {
    const container = document.getElementById('languageLevelsGrid');
    if (!container) return;

    const levels = (typeof LANGUAGE_LEVELS_DATA !== 'undefined') ? LANGUAGE_LEVELS_DATA : [];
    container.innerHTML = '';

    levels.forEach(level => {
      const levelStats = LanguageTrackService.getLevelStats(state, level);
      const isLevelComplete = levelStats.percent === 100;

      const card = document.createElement('article');
      card.className = 'bg-white rounded-3xl border-2 ' + (isLevelComplete ? 'border-emerald-500 shadow-lg' : 'border-slate-200') + ' p-5 sm:p-7 shadow-lg flex flex-col justify-between space-y-5 card-lift hover-glow-emerald relative overflow-hidden';

      let coursesHtml = '';
      (level.courses || []).forEach(c => {
        const isDone = LanguageTrackService.isDone(state, c.id);
        coursesHtml += `
          <li class="p-3.5 sm:p-4 rounded-2xl border-2 transition shadow-2xs ${isDone ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}">
            <div class="flex items-center justify-between mb-2 gap-2">
              <span class="text-xs sm:text-sm font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg shrink-0 shadow-2xs">
                ${c.num}
              </span>
              <span class="text-xs sm:text-sm font-black px-3 py-1 rounded-lg ${isDone ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 border border-slate-300'}">
                ${isDone ? 'مكتمل ✅' : 'قيد المتابعة ⏳'}
              </span>
            </div>

            <div class="flex items-start gap-3 min-w-0 mb-3">
              <input 
                type="checkbox" 
                id="lang-${c.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleLanguageCourse('${c.id}')" 
                class="checkbox-custom w-6 h-6 shrink-0 mt-0.5"
              />
              <div class="min-w-0 flex-1">
                <label for="lang-${c.id}" class="text-base sm:text-lg font-black cursor-pointer select-none leading-snug block ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">
                  ${c.name || c.title || ''}
                </label>
              </div>
            </div>

            <!-- YouTube Official Playlist Direct Link Button -->
            <div class="flex items-center justify-between pt-2 border-t border-slate-200">
              <a 
                href="${c.playlistUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold border border-rose-500 transition text-xs sm:text-sm cursor-pointer shadow-md shadow-rose-500/20 active:scale-95"
                title="مشاهدة قائمة التشغيل الرسمية على يوتيوب"
              >
                <i class="fa-brands fa-youtube text-white text-base"></i>
                <span>قائمة التشغيل 🎬</span>
              </a>
              ${isDone ? '<span class="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg shadow-2xs">تم الإنجاز ✅</span>' : '<span class="text-xs font-bold text-slate-500">اضغط للمشاهدة ↗</span>'}
            </div>
          </li>
        `;
      });

      card.innerHTML = `
        <!-- Level Card Header -->
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <span class="text-sm sm:text-base font-black px-4 py-1.5 rounded-full ${level.pillColor ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'} flex items-center gap-2 border shadow-2xs">
              <i class="fa-solid ${level.icon}"></i> ${level.title}
            </span>
            <span dir="ltr" class="text-sm sm:text-base font-black font-display font-mono ${isLevelComplete ? 'text-emerald-700' : 'text-emerald-700'}">
              ${levelStats.percent}% (${levelStats.done}/${levelStats.total})
            </span>
          </div>

          <p class="text-xs sm:text-sm text-slate-600 font-bold my-3">
            ${level.subtitle}
          </p>

          <!-- Level Progress Bar -->
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200 shadow-inner">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300" style="width: ${levelStats.percent}%;"></div>
          </div>

          <!-- Level Courses List -->
          <ul class="space-y-3">
            ${coursesHtml}
          </ul>
        </div>

        <div class="pt-4 border-t border-slate-200 text-center">
          <span class="text-xs sm:text-sm font-bold text-slate-500">
            ${isLevelComplete ? '🎉 مبروك! أتممت هذا المستوى بالكامل' : 'قوائم التشغيل الرسمية لقناة ZAmericanEnglish'}
          </span>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

if (typeof window !== 'undefined') {
  window.RoutineView = RoutineView;
  window.AchievementsView = AchievementsView;
  window.ProgrammingView = ProgrammingView;
  window.HeaderView = HeaderView;
  window.ResultModalView = ResultModalView;
  window.RoadmapView = RoadmapView;
  window.LanguageTrackView = LanguageTrackView;
}
