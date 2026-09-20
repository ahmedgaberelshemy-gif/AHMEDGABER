/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - VIEW RENDERERS (SRP / Clean UI Separation)
 * =========================================================================
 * Solid Principles & Clean Code Architecture:
 * - Single Responsibility Principle (SRP): Each View class manages UI rendering for its specific domain context.
 * - Open/Closed Principle (OCP): Dark Glassmorphism Design Token system.
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
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-xs sm:text-sm font-black font-display shadow-sm';
      } else {
        overallBadge.innerText = `${percent}% مكتمل اليوم ⚡`;
        overallBadge.className = 'px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs sm:text-sm font-black font-display';
      }
    }

    const cardBadge = document.getElementById('routineTodayCardBadge');
    if (cardBadge) cardBadge.innerText = `${donePillars} من ${totalPillars} أركان منجزة`;
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
        <div class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition shadow-sm ${
          isDone 
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-emerald-950/30' 
            : 'bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-slate-600'
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
              <label for="prayer-${prayer.id}" class="text-sm sm:text-base font-black text-slate-100 cursor-pointer select-none leading-tight block ${isDone ? 'line-through text-slate-400' : ''}">
                ${prayer.name}
              </label>
              <span class="text-[11px] text-slate-400 font-medium block mt-0.5">${prayer.time}</span>
            </div>
          </div>
          ${isDone ? '<span class="text-xs font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-500/40 px-3 py-1 rounded-xl shadow-xs">تمت بنجاح ✅</span>' : '<span class="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">بانتظار الصلاة ⏳</span>'}
        </div>
      `;
    }).join('');

    if (box && msg) {
      if (count === 5) {
        box.className = 'p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center mt-4';
        msg.innerHTML = '🎉 ما شاء الله! أتممت الصلوات الخمس كاملة في أوقاتها.. جعلها الله في ميزان حسناتك 🌿';
      } else {
        box.className = 'p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center mt-4';
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
        ? 'text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-xl shadow-xs' 
        : 'text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700';
    }

    if (box) {
      box.className = isDone 
        ? 'p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-amber-950/50 border-amber-500/50 text-amber-200 shadow-amber-950/30' 
        : 'p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-slate-800/50 border-slate-700/60 hover:border-amber-500/50 shadow-xs';
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
        ? 'text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-500/40 px-3 py-1 rounded-xl shadow-xs' 
        : 'text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700';
    }

    if (box) {
      box.className = isDone 
        ? 'p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-indigo-950/50 border-indigo-500/50 text-indigo-200 shadow-indigo-950/30' 
        : 'p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-slate-800/50 border-slate-700/60 hover:border-indigo-500/50 shadow-xs';
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
        ? 'text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-500/40 px-3 py-1 rounded-xl shadow-xs' 
        : 'text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700';
    }

    if (box) {
      box.className = isDone 
        ? 'p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-teal-950/50 border-teal-500/50 text-teal-200 shadow-teal-950/30' 
        : 'p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 bg-slate-800/50 border-slate-700/60 hover:border-teal-500/50 shadow-xs';
    }
  }

  static renderFinalizeStatus(dayLog) {
    const pill = document.getElementById('finalizeStatusPill');
    const btn = document.getElementById('finalizeDayBtn');
    const btnText = document.getElementById('finalizeBtnText');
    const btnIcon = document.getElementById('finalizeBtnIcon');

    if (!pill || !btnText) return;

    const calmBtnClass = 'w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-display font-black text-sm sm:text-base border border-amber-400/80 flex items-center justify-center gap-2 transition cursor-pointer select-none shadow-md shadow-amber-500/20 shrink-0';

    if (dayLog && dayLog.submitted) {
      const prayersDone = Object.values(dayLog.prayers || {}).filter(Boolean).length;
      const is100 = (prayersDone === 5 && Boolean(dayLog.quran?.done) && Boolean(dayLog.gym?.done) && Boolean(dayLog.sleep?.done));

      if (is100) {
        pill.innerHTML = '<i class="fa-solid fa-crown text-emerald-300"></i> تم الاعتماد: التزام تام 100% 👑';
        pill.className = 'px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-2xs sm:text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      } else {
        pill.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-rose-300"></i> تم الاعتماد: يوم به نقص ⚠️';
        pill.className = 'px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-2xs sm:text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      }

      btnText.innerText = 'تحديث اعتماد اليوم 🔄';
      if (btnIcon) btnIcon.className = 'fa-solid fa-check-double text-slate-950 text-xs';
      if (btn) btn.className = calmBtnClass;
    } else {
      pill.innerHTML = '<i class="fa-solid fa-bolt text-amber-400"></i> جاهز للتسجيل ⚡';
      pill.className = 'px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-2xs sm:text-xs font-black inline-flex items-center gap-1';
      btnText.innerText = 'تسجيل واعتماد اليوم ✅';
      if (btnIcon) btnIcon.className = 'fa-solid fa-crown text-slate-950 text-xs';
      if (btn) btn.className = calmBtnClass;
    }
  }
}

// 2. CURRICULUM VIEW (6 Subjects Navigation & 10 Weeks Breakdown)
class CurriculumView {
  static render(activeSubject, lessonProgress = {}, lessonNotes = {}) {
    const subjIdx = (typeof activeSubject === 'number' && activeSubject >= 0 && activeSubject < (APP_CONFIG.SUBJECTS || []).length) 
      ? activeSubject 
      : 0;
    this.renderSubjectPills(subjIdx, lessonProgress);
    this.renderActiveSubjectWeeks(subjIdx, lessonProgress, lessonNotes);
  }

  static renderSubjectPills(activeSubject, lessonProgress) {
    const container = document.getElementById('weekPillsBar');
    if (!container) return;
    container.innerHTML = '';

    const subjects = APP_CONFIG.SUBJECTS || [];
    subjects.forEach((subj, sIdx) => {
      const stats = AcademicCalculator.getSubjectStats(weeksData, lessonProgress, sIdx);
      const isActive = sIdx === activeSubject;
      const style = colorStyles[subj.color] || colorStyles.blue;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `p-2.5 sm:p-3 rounded-2xl border transition flex flex-col justify-between gap-2 text-right cursor-pointer select-none active:scale-95 ${
        isActive 
          ? `${style.cardBg} ${style.border} ring-2 ring-indigo-500 shadow-md text-white` 
          : 'bg-slate-800/50 hover:bg-slate-800/80 text-slate-300 border-slate-700/60 shadow-2xs'
      }`;

      btn.innerHTML = `
        <div class="flex items-center justify-between w-full gap-2">
          <div class="w-8 h-8 rounded-xl ${isActive ? style.iconBg : 'bg-slate-800 border border-slate-700'} ${isActive ? style.iconColor : 'text-slate-300'} flex items-center justify-center text-xs shrink-0 shadow-2xs">
            <i class="fa-solid ${subj.icon}"></i>
          </div>
          <span class="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${isActive ? style.badge : 'bg-slate-800 text-slate-300 border border-slate-700'} shrink-0">
            ${stats.percentage}%
          </span>
        </div>
        <span class="text-xs sm:text-[13px] font-black font-display leading-tight ${isActive ? 'text-white' : 'text-slate-200'}">${subj.name}</span>
      `;
      btn.onclick = () => app.switchSubject(sIdx);
      container.appendChild(btn);
    });
  }

  static renderActiveSubjectWeeks(activeSubject, lessonProgress, lessonNotes) {
    const container = document.getElementById('curriculumWeekStage');
    if (!container) return;

    const subjectMeta = [
      { name: "مبادئ إدارة الأعمال", icon: "fa-briefcase", color: "blue", desc: "مدخل الأعمال، أنواع المنظمات، القيادة، التسويق، العمليات، والموارد البشرية" },
      { name: "المحاسبة المالية", icon: "fa-calculator", color: "emerald", desc: "المعادلة المحاسبية، القيد المزدوج، اليومية المساعدة، القوائم المالية، والشركات" },
      { name: "مبادئ الإقتصاد", icon: "fa-chart-line", color: "amber", desc: "العرض والطلب، المرونة، سلوك المستهلك، والتحليل الاقتصادي" },
      { name: "مبادئ القانون", icon: "fa-scale-balanced", color: "purple", desc: "القواعد القانونية، مصادر القانون، الحقوق والالتزامات" },
      { name: "علم النفس", icon: "fa-brain", color: "rose", desc: "السلوك الإنساني، الدوافع، الإدراك، والعمليات المعرفية" },
      { name: "اللغة الإنجليزية", icon: "fa-language", color: "cyan", desc: "المصطلحات التجارية، القواعد اللغوية، والقراءة المتخصصة" }
    ];

    const currentMeta = subjectMeta[activeSubject] || subjectMeta[0];
    const style = colorStyles[currentMeta.color] || colorStyles.blue;

    const headerHtml = `
      <div class="bg-slate-900/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border ${style.border} ${style.cardBg} shadow-2xl mb-5 flex items-center gap-3.5 text-right">
        <div class="w-12 h-12 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center text-xl shrink-0 shadow-sm">
          <i class="fa-solid ${currentMeta.icon}"></i>
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-black font-display text-white leading-snug">${currentMeta.name}</h3>
          <p class="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">${currentMeta.desc}</p>
        </div>
      </div>
    `;

    if (!weeksData || weeksData.length === 0) {
      container.innerHTML = `
        ${headerHtml}
        <div class="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-dashed border-slate-800 p-8 sm:p-14 text-center text-slate-400 space-y-3 shadow-2xl">
          <div class="w-16 h-16 rounded-3xl bg-slate-800 text-amber-400 flex items-center justify-center text-2xl mx-auto shadow-2xs border border-slate-700">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <h4 class="font-display font-black text-white text-base sm:text-lg">المقرر فارغ وجاهز للتسجيل 🎓</h4>
          <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            سيتم إضافة المحاضرات والملخصات الفعلية أسبوعاً بأسبوع فور انطلاق الدراسة بالمعهد بإذن الله.
          </p>
        </div>
      `;
      return;
    }

    let weeksHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">';

    weeksData.forEach((w) => {
      const subjectData = w.subjects ? w.subjects[activeSubject] : null;
      const lessons = subjectData ? (subjectData.lessons || []) : [];
      const isWeekDone = lessons.length > 0 && lessons.every((_, lIdx) => Boolean(lessonProgress[`w${w.week}_s${activeSubject}_l${lIdx}`]));

      weeksHtml += `
        <div class="bg-slate-900/85 backdrop-blur-xl rounded-3xl border transition card-lift ${
          isWeekDone ? 'border-amber-500/60 shadow-amber-950/20' : 'border-slate-800 hover:border-slate-700 shadow-xl'
        } p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
          
          <div>
            <!-- Week Header -->
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-800 gap-2">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-xl ${isWeekDone ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-800 text-slate-300 border border-slate-700'} flex items-center justify-center text-xs font-black font-mono">
                  ${w.week}
                </span>
                <h4 class="font-display font-black text-sm sm:text-base text-white">${w.title}</h4>
              </div>

              <span class="text-xs font-black font-display px-2.5 py-1 rounded-xl ${
                isWeekDone ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-xs' 
                  : (lessons.length === 0 ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-800 text-slate-300 border border-slate-700')
              } whitespace-nowrap shrink-0">
                ${isWeekDone ? 'مكتمل 100% 👑' : (lessons.length === 0 ? 'قيد الإعداد ⏳' : `${lessons.length} دروس`)}
              </span>
            </div>

            <!-- Lessons Checklist or Empty State Placeholder -->
            <div class="space-y-2.5 pt-2.5">
              ${lessons.length > 0 ? lessons.map((lesson, lIdx) => {
                const lessonKey = `w${w.week}_s${activeSubject}_l${lIdx}`;
                const isChecked = Boolean(lessonProgress[lessonKey]);
                const hasNote = Boolean(lessonNotes && lessonNotes[lessonKey] && lessonNotes[lessonKey].trim());
                const numStr = (lIdx + 1) < 10 ? `0${lIdx + 1}` : `${lIdx + 1}`;

                return `
                  <div class="p-2.5 sm:p-3 rounded-2xl border transition flex items-start justify-between gap-2.5 ${
                    isChecked 
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-slate-600'
                  }">
                    <div class="flex items-start gap-2.5 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        id="chk_${lessonKey}" 
                        ${isChecked ? 'checked' : ''} 
                        onchange="app.toggleLesson('${lessonKey}')" 
                        class="checkbox-custom mt-0.5"
                      />
                      <label 
                        for="chk_${lessonKey}" 
                        class="text-[12px] sm:text-[13px] font-bold leading-relaxed cursor-pointer select-none ${
                          isChecked ? 'text-emerald-300 line-through opacity-85' : 'text-slate-100'
                        }"
                      >
                        <span class="font-display text-[9px] font-black px-1.5 py-0.5 rounded-md border shrink-0 bg-slate-800 text-slate-300 border-slate-700 ml-1 inline-block no-underline">${numStr}</span>
                        ${lesson}
                      </label>
                    </div>

                    <button 
                      type="button"
                      onclick="app.openNoteModal('${lessonKey}')" 
                      title="ملاحظات وتلخيص الدرس"
                      class="p-1.5 rounded-xl border text-xs shrink-0 transition active:scale-90 cursor-pointer ${
                        hasNote 
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-xs' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                      }"
                    >
                      <i class="fa-solid fa-note-sticky"></i>
                    </button>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-6 border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs font-bold bg-slate-900/60 flex flex-col items-center justify-center gap-1.5">
                  <i class="fa-solid fa-hourglass-start text-amber-400 text-base"></i>
                  <span>قيد الإعداد والتجهيز.. سيتم إدراج دروس المقرر قريباً ⏳</span>
                </div>
              `}
            </div>
          </div>

        </div>
      `;
    });

    weeksHtml += '</div>';

    container.innerHTML = headerHtml + weeksHtml;
  }
}

// 3. ACHIEVEMENTS VIEW (Routine Discipline & Performance Diagnostics)
class AchievementsView {
  static render(dailyLogs = {}, weeks = [], lessonProgress = {}, programmingCourses = {}) {
    this.renderRoutineAchievements(dailyLogs);
    this.renderAcademicAchievements(weeks, lessonProgress);
    this.renderProgrammingAchievements(programmingCourses);
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
      <div class="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-2xl space-y-6 card-lift">
        
        <!-- Header: Diagnostic Purpose -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 gap-2 flex-wrap">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center text-xl shadow-lg shadow-indigo-500/25 shrink-0">
              <i class="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <div>
              <h3 class="font-display font-black text-lg sm:text-xl text-white leading-tight">
                سجل تشريح الأداء وتدارك التقصير 🔍
              </h3>
              <span class="text-xs sm:text-sm text-slate-400 font-medium leading-tight block mt-0.5">
                تتبع الأيام غير المكتملة وتشريح أسباب التقصير لتداركها فورياً، وأدوات إدارة البيانات
              </span>
            </div>
          </div>
          <span class="text-xs sm:text-sm font-black text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-3.5 py-1.5 rounded-xl shadow-xs">
            الرتبة: ${stats.rank?.title || 'طالب منضبط 🌟'} 🎖️
          </span>
        </div>

        <!-- 3 Unique Diagnostic Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <!-- Card 1: Incomplete Days -->
          <div class="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex flex-col justify-between space-y-3 shadow-sm">
            <div class="flex items-center justify-between gap-1 text-rose-300 text-xs sm:text-sm font-black">
              <span class="flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation text-rose-400 text-base"></i> أيام بها تقصير</span>
              <span class="font-mono text-sm font-black text-rose-300">${incompletePercentage}%</span>
            </div>
            <p class="text-xs text-slate-400 font-medium">أيام حدث بها نقص في الصلاة أو العادات</p>
            <div class="text-3xl sm:text-4xl font-black font-mono text-rose-400 my-1" dir="ltr">
              ${stats.incompleteDays} <span class="text-xs font-bold text-slate-400 font-cairo">يوم</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-rose-500 rounded-full transition-all duration-300" style="width: ${incompletePercentage}%;"></div>
            </div>
            <span class="text-xs font-bold text-rose-300 block">رصد النواقص لتداركها ومنع تكرارها</span>
          </div>

          <!-- Card 2: Remaining Days -->
          <div class="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex flex-col justify-between space-y-3 shadow-sm">
            <div class="flex items-center justify-between gap-1 text-indigo-300 text-xs sm:text-sm font-black">
              <span class="flex items-center gap-2"><i class="fa-solid fa-calendar-days text-indigo-400 text-base"></i> متبقي بالترم</span>
              <span class="font-mono text-sm font-black text-indigo-300">${totalSemesterDays > 0 ? Math.round((remainingDays / totalSemesterDays) * 100) : 0}%</span>
            </div>
            <p class="text-xs text-slate-400 font-medium">فرص قادمة كل يوم لتعزيز الامتياز</p>
            <div class="text-3xl sm:text-4xl font-black font-mono text-indigo-400 my-1" dir="ltr">
              ${remainingDays} <span class="text-xs font-bold text-slate-400 font-cairo">يوم</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full transition-all duration-300" style="width: ${totalSemesterDays > 0 ? Math.round((remainingDays / totalSemesterDays) * 100) : 0}%;"></div>
            </div>
            <span class="text-xs font-bold text-indigo-300 block">متبقي حتى نهاية الفصل الدراسي 🏆</span>
          </div>

          <!-- Card 3: Current Streak -->
          <div class="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex flex-col justify-between space-y-3 shadow-sm">
            <div class="flex items-center justify-between gap-1 text-amber-300 text-xs sm:text-sm font-black">
              <span class="flex items-center gap-2"><i class="fa-solid fa-fire text-amber-400 text-base"></i> سلسلة الالتزام</span>
              <span class="text-xs font-bold text-amber-400 font-mono">متواصل 🔥</span>
            </div>
            <p class="text-xs text-slate-400 font-medium">عدد الأيام المتتالية دون أي انقطاع</p>
            <div class="text-3xl sm:text-4xl font-black font-mono text-amber-400 my-1" dir="ltr">
              ${stats.streak} <span class="text-xs font-bold text-slate-400 font-cairo">أيام متتالية</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 rounded-full transition-all duration-300" style="width: ${Math.min(100, (stats.streak / 14) * 100)}%;"></div>
            </div>
            <span class="text-xs font-bold text-amber-300 block">استمر في حماية شعلة الالتزام 🔥</span>
          </div>

        </div>

        <!-- Incomplete Days Breakdown Log or Spotless Streak Banner -->
        ${incompleteHistory.length > 0 ? `
          <div class="border border-rose-800/60 rounded-2xl bg-slate-900 overflow-hidden shadow-xs">
            <button 
              type="button"
              onclick="toggleIncompleteDetailsSection()" 
              class="w-full p-4 bg-rose-950/50 hover:bg-rose-900/50 flex items-center justify-between gap-3 text-right font-bold text-xs sm:text-sm text-rose-200 transition cursor-pointer select-none"
            >
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-rose-400"></i>
                <span>سجل الأيام التي وقع بها تقصير (${incompleteHistory.length} يوم) - اضغط لتشريح الأسباب وتصحيح المسار</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span id="toggleIncompleteText" class="text-xs text-rose-300 font-mono font-bold">عرض التفاصيل 🔍</span>
                <i id="toggleIncompleteIcon" class="fa-solid fa-chevron-down text-rose-400 text-xs"></i>
              </div>
            </button>

            <div id="incompleteDetailsWrapper" class="hidden divide-y divide-slate-800 p-4 space-y-3 bg-slate-900">
              ${incompleteHistory.map(day => `
                <div class="pt-3 first:pt-0 space-y-1.5">
                  <div class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="font-bold text-white font-mono">${day.date}</span>
                    <span class="px-2.5 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold">
                      ${day.missedCount} عناصر لم تكتمل
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    ${day.missed.map(item => `
                      <span class="px-2.5 py-0.5 rounded-lg bg-slate-800 text-rose-300 border border-rose-800/50 text-xs font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-xmark text-rose-400 text-[10px]"></i> ${item}
                      </span>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 text-center shadow-xs">
            <i class="fa-solid fa-crown text-amber-400 text-lg"></i>
            <span>سجلك ناصع البياض والتزامك 100% بدون أي تقصير حتى الآن! استمر في طريق المركز الأول 👑</span>
          </div>
        `}

        <!-- Data Operations Toolbar: Reset & Backup/Restore -->
        <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button 
            type="button"
            onclick="resetRoutineHistory()" 
            class="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs sm:text-sm border border-rose-800/60 flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-xs" 
            title="تصفير سجل الأيام والروتين فقط إلى 0 يوم"
          >
            <i class="fa-solid fa-rotate-left text-rose-400"></i> تصفير سجل الأيام التراكمي (0 يوم) 🔄
          </button>

          <div class="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button onclick="exportBackupData()" class="justify-center px-3 sm:px-4 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-800/60 flex items-center gap-2 transition cursor-pointer shadow-xs" title="تصدير نسخة احتياطية من كافة البيانات">
              <i class="fa-solid fa-download"></i> تصدير نسخة 📥
            </button>
            <label class="justify-center px-3 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 cursor-pointer transition shadow-xs" title="استرجاع نسخة احتياطية">
              <i class="fa-solid fa-upload"></i> استرجاع نسخة 📤
              <input type="file" id="importFileInput" accept=".json" onchange="importBackupData(event)" class="hidden" />
            </label>
          </div>
        </div>

      </div>
    `;
  }

  static renderAcademicAchievements(weeksList = [], lessonProgress = {}) {
    const container = document.getElementById('academicAchievementsContainer');
    if (!container) return;

    let html = `
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between flex-wrap gap-2 px-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-book-bookmark text-indigo-400"></i>
            <span class="font-display font-black text-xs sm:text-sm text-white">إنجاز المواد الدراسية الـ 6 (50 درساً لكل مادة):</span>
          </div>
          <span class="text-[11px] font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
            6 مواد دراسية معتمدة
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
    `;

    (APP_CONFIG.SUBJECTS || []).forEach((subj, sIdx) => {
      const stats = AcademicCalculator.getSubjectStats(weeksList, lessonProgress, sIdx);
      const style = colorStyles[subj.color] || colorStyles.blue;
      const isSubject100 = (stats.totalCount > 0 && stats.completedCount === stats.totalCount);
      const isSubjectStarted = (stats.completedCount > 0);

      html += `
        <div class="p-4 rounded-2xl border transition duration-200 ${
          isSubject100 
            ? 'bg-emerald-950/60 border-emerald-500/50 shadow-2xs' 
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-2xs'
        } space-y-3 flex flex-col justify-between">
          
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-xl ${isSubject100 ? 'bg-emerald-500 text-slate-950 font-black' : style.iconBg + ' ' + style.iconColor} flex items-center justify-center text-xs shrink-0 shadow-2xs">
                <i class="fa-solid ${subj.icon}"></i>
              </div>
              <span class="text-xs sm:text-sm font-black font-display text-white truncate">${subj.name}</span>
            </div>
            <span class="text-xs font-mono font-black px-2.5 py-1 rounded-lg ${isSubject100 ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40' : style.badge} shrink-0">
              ${stats.percentage}%
            </span>
          </div>

          <div class="space-y-1.5">
            <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden shadow-inner">
              <div class="h-full rounded-full ${isSubject100 ? 'bg-emerald-500' : style.progressBar} transition-all duration-500" style="width: ${stats.percentage}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] font-bold">
              <span class="text-slate-400">الدروس المنجزة</span>
              <span class="font-mono text-slate-200">${stats.completedCount} / ${stats.totalCount} درس</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold">
            <span class="text-slate-400">حالة المادة</span>
            <span class="${
              isSubject100 
                ? 'text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/50' 
                : isSubjectStarted 
                  ? 'text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-700/50' 
                  : 'text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700'
            }">
              ${isSubject100 ? 'مكتملة 100% 👑' : isSubjectStarted ? 'قيد المذاكرة ⚡' : 'لم تبدأ بعد'}
            </span>
          </div>

        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  static renderProgrammingAchievements(programmingCourses = {}) {
    const container = document.getElementById("programmingAchievementsContainer");
    const badge = document.getElementById("programmingAchievementsBadge");
    if (!container) return;

    const courses = (typeof programmingCoursesData !== "undefined") ? programmingCoursesData : (APP_CONFIG.PROGRAMMING_COURSES || []);
    let completedCount = 0;

    courses.forEach(c => {
      if (programmingCourses[c.id]) {
        completedCount++;
      }
    });

    const totalCourses = courses.length;
    const percentage = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

    if (badge) {
      if (totalCourses === 0) {
        badge.innerText = `مسار AI & Data Analysis (0 كورس)`;
      } else {
        badge.innerText = `${completedCount} من ${totalCourses} كورس مكتمل (${percentage}%)`;
      }
    }

    if (totalCourses === 0) {
      container.innerHTML = `
        <div class="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 text-center space-y-3 shadow-2xl">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20">
            <i class="fa-solid fa-brain"></i>
          </div>
          <h4 class="font-display font-black text-base text-white">مسار AI & Data Analysis</h4>
          <p class="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
            تم ضبط وتصفير المسار بالكامل وهو جاهز لمسارات الذكاء الاصطناعي وتحليل البيانات المتوافقة مع المحاسبة والأعمال 📊🤖
          </p>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-xs font-bold">
            <i class="fa-solid fa-check"></i> تم التصفير (0%)
          </div>
        </div>
      `;
      return;
    }
  }
}

// 4. PROGRAMMING VIEW (AI & Data Analysis)
class ProgrammingView {
  static render(programmingCourses = {}) {
    const container = document.getElementById('programmingCoursesContainer');
    if (!container) return;

    const coursesList = (typeof programmingCoursesData !== 'undefined' && Array.isArray(programmingCoursesData))
      ? programmingCoursesData
      : (APP_CONFIG.PROGRAMMING_COURSES || []);

    if (!coursesList.length) {
      container.innerHTML = `
        <div class="col-span-full py-16 px-6 text-center bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-dashed border-slate-800 shadow-2xl space-y-4">
          <div class="w-20 h-20 mx-auto rounded-3xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center text-3xl shadow-sm border border-indigo-800/60">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div class="space-y-1.5">
            <h3 class="font-display font-black text-xl sm:text-2xl text-white">مسار AI & Data Analysis</h3>
            <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-medium">
              تم ضبط وتصفير المسار بالكامل وهو فاضي حالياً. المسار جاهز ومُخصص لإضافة وتثبيت كورسات الذكاء الاصطناعي وتحليل البيانات قريباً 📊🤖
            </p>
          </div>
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <i class="fa-solid fa-circle-check text-emerald-400"></i>
            <span>تم التصفير بنجاح (فارغ وجاهز)</span>
          </div>
        </div>
      `;
      return;
    }
  }
}

// 5. HEADER VIEW (Live Header Metadata & Controls)
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
      badge.className = 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-bold font-display shadow-sm backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition active:scale-95';
      badge.innerHTML = '<i class="fa-solid fa-rotate text-amber-400 animate-spin text-xs sm:text-sm"></i> <span>جاري الحفظ... 🔄</span>';
    } else if (status === 'connected') {
      badge.className = 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold font-display shadow-sm backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition active:scale-95';
      badge.innerHTML = '<i class="fa-solid fa-cloud-arrow-up text-emerald-400 text-xs sm:text-sm"></i> <span>مزامنة سحابية متصلة 🟢</span>';
    } else {
      badge.className = 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-950/90 text-slate-200 border border-indigo-500/30 text-[10px] sm:text-xs font-bold font-display shadow-sm backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition active:scale-95';
      badge.innerHTML = '<i class="fa-solid fa-hard-drive text-amber-400 text-xs sm:text-sm"></i> <span>تخزين محلي ⚪</span>';
    }
  }
}

// 6. RESULT MODAL VIEW (Motivational Feedback on Day Registration)
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

      tag.className = 'text-xs font-black font-display px-3.5 py-1 rounded-full border bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      tag.innerText = '🏆 يوم التزام تام 100% (أُضيف لسجل الشرف)';

      title.innerText = 'وحش يا بطل.. انضباط أسطوري اليوم! 🔥👑';
      message.innerHTML = 'ما شاء الله تبارك الله! قفّلت يومك بصلواتك الخمس كاملة، ورد القرآن، تمرين الجيم، والنوم المثالي (7-9 ساعات). الاستمرار على الانضباط الحديدي ده هو اللي هيصنع مستقبلك ويوصلك لامتياز الترم الأول. فخورين بيك يا بطل، استمر على نفس القوة! 🌟';

      actionBtn.className = 'w-full py-3.5 px-5 rounded-2xl font-display font-black text-sm text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-500/25 cursor-pointer';
      actionBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> يلا نبدأ اليوم الجديد بنفس القوة والتركيز 🚀';
    } else {
      // Incomplete Day
      iconBox.className = 'w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-rose-500/30';
      iconBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';

      tag.className = 'text-xs font-black font-display px-3.5 py-1 rounded-full border bg-rose-950/80 text-rose-300 border-rose-500/50';
      tag.innerText = '⚠️ يوم به نقص (أُضيف لسجل الأيام الناقصة)';

      title.innerText = 'محتاج تشد حيلك وتلتزم أكتر يا وحش! 💪';
      message.innerHTML = 'النهاردة فاتتك بعض المهام الأساسية (صلاة، جيم، أو ساعات النوم)، والنجاح الحقيقي مبيقبلش الأعذار. اعتبر اليوم ده درس وجرس إنذار، قفل على نفسك التشتيت، وعوّض بكرة بالتزام حديدي 100% بدون أي تهاون! 🎯';

      actionBtn.className = 'w-full py-3.5 px-5 rounded-2xl font-display font-black text-sm text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black shadow-slate-900/30 cursor-pointer';
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

// 7. ROADMAP VIEW (SRP: Renders 15 Courses, Skills, and Certifications)
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
      overallBadge.innerText = stats.percent + '% مكتمل 🏆';
      overallBadge.className = stats.percent === 100 
        ? 'px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-xs font-black font-display shadow-sm'
        : 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black font-display';
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
      card.className = 'bg-slate-900/85 backdrop-blur-xl rounded-3xl border ' + (isYearComplete ? 'border-emerald-500/50 shadow-emerald-950/30' : 'border-slate-800') + ' p-5 sm:p-7 shadow-2xl flex flex-col justify-between space-y-5 card-lift relative overflow-hidden';

      // Skills & Workshops List
      let skillsHtml = '';
      (year.skills || []).forEach(s => {
        const isDone = RoadmapService.isDone(state, s.id);
        
        let erpSubHtml = '';
        if (s.id === 'skill_09') {
          erpSubHtml = `
            <div class="mt-3 space-y-2 pr-3 border-r-3 border-blue-400">
              <div class="flex items-center justify-between bg-blue-950/60 border border-blue-700/60 px-3 py-1.5 rounded-xl text-xs sm:text-sm gap-2">
                <span class="font-bold text-slate-100 flex items-center gap-1.5"><i class="fa-solid fa-server text-blue-400"></i> 9.1. ساب المالي (SAP S/4HANA)</span>
                <span class="text-xs font-bold text-blue-300 bg-blue-900/80 px-2 py-0.5 rounded-lg shrink-0">الشركات الكبرى والبترول</span>
              </div>
              <div class="flex items-center justify-between bg-rose-950/60 border border-rose-700/60 px-3 py-1.5 rounded-xl text-xs sm:text-sm gap-2">
                <span class="font-bold text-slate-100 flex items-center gap-1.5"><i class="fa-solid fa-cloud text-rose-400"></i> 9.2. أوراكل المالي (Oracle Cloud)</span>
                <span class="text-xs font-bold text-rose-300 bg-rose-900/80 px-2 py-0.5 rounded-lg shrink-0">البنوك والحكومة</span>
              </div>
              <div class="flex items-center justify-between bg-emerald-950/60 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs sm:text-sm gap-2">
                <span class="font-bold text-slate-100 flex items-center gap-1.5"><i class="fa-solid fa-network-wired text-emerald-400"></i> 9.3. داينامكس (Dynamics 365)</span>
                <span class="text-xs font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-lg shrink-0">سلاسل الإمداد</span>
              </div>
            </div>
          `;
        }

        skillsHtml += `
          <li class="p-3.5 sm:p-4 rounded-2xl border transition shadow-2xs ${isDone ? 'bg-indigo-950/60 border-indigo-500/50' : 'bg-slate-800/40 border-slate-700/60'}">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-sm font-mono font-black text-amber-300 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-lg shrink-0 shadow-2xs">${s.num}</span>
              ${isDone ? '<span class="text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-indigo-600 text-white shrink-0">مكتسب ✨</span>' : '<span class="text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 shrink-0">' + s.category + '</span>'}
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
                <label for="roadmap-${s.id}" class="text-base sm:text-lg font-black text-white cursor-pointer select-none leading-relaxed block ${isDone ? 'line-through text-slate-400' : ''}">
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
              <span class="text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-700/60 flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-certificate text-blue-400"></i> CertIFR: شهادة المعايير التمهيدية (Online)
              </span>
              <span class="text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-award text-emerald-400"></i> DipIFR: دبلومة المعايير المهنية الدولية
              </span>
            </div>
          `;
        }

        certsHtml += `
          <li class="p-3.5 sm:p-4 rounded-2xl border transition shadow-2xs ${isDone ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/60'}">
            <div class="flex items-center justify-between mb-2 gap-2">
              <span class="text-xs sm:text-sm font-mono font-black px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-2xs">${crt.id.toUpperCase()}</span>
              <span class="text-xs sm:text-sm font-bold px-3 py-1 rounded-lg ${isDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}">
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
                <label for="roadmap-${crt.id}" class="text-base sm:text-lg font-black text-white cursor-pointer select-none block leading-snug ${isDone ? 'line-through text-slate-400' : ''}">
                  ${crt.name}
                </label>
                ${certSubHtml}
                <span class="text-xs sm:text-sm text-slate-400 font-bold block mt-1.5"><i class="fa-solid fa-building-columns text-slate-400"></i> ${crt.org}</span>
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
          <div class="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/40 text-emerald-300 text-sm sm:text-base font-black py-2.5 px-4 rounded-xl my-3.5 shadow-sm">
            <i class="fa-solid fa-award text-amber-400"></i> ${certBridgeText}
          </div>

          <!-- Part 2: Professional Certifications -->
          <ul class="space-y-3">
            ${certsHtml}
          </ul>
        `;
      } else {
        certsSectionHtml = `
          <div class="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 justify-center my-3.5 shadow-2xs">
            <i class="fa-solid fa-shield-halved text-emerald-400 text-base shrink-0"></i>
            <span>التركيز 100% في سنة أولى على المناهج وحصد المركز الأول 🏆 (الشهادات الدولية تبدأ من سنة ثانية)</span>
          </div>
        `;
      }

      card.innerHTML = `
        <!-- Year Card Header -->
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <span class="text-sm sm:text-base font-black px-4 py-1.5 rounded-full ${year.pillColor || 'bg-blue-950/80 text-blue-300 border-blue-700/60'} flex items-center gap-2 border shadow-xs">
              <i class="fa-solid ${year.icon}"></i> ${year.stagePill}
            </span>
            <span dir="ltr" class="text-sm sm:text-base font-black font-display font-mono ${isYearComplete ? 'text-emerald-400' : 'text-blue-400'}">
              ${yearStats.percent}% (${yearStats.doneItems}/${yearStats.totalItems})
            </span>
          </div>

          <!-- Progress Bar for this Year -->
          <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-3 mb-4 shadow-inner">
            <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300" style="width: ${yearStats.percent}%;"></div>
          </div>

          <!-- Pathway Bridge: Skills -->
          <div class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-indigo-500/40 text-blue-300 text-sm sm:text-base font-black py-2.5 px-4 rounded-xl my-3.5 shadow-sm">
            <i class="fa-solid fa-laptop-code text-indigo-400"></i> الكورسات والمهارات العملية (${yrText}):
          </div>

          <!-- Part 1: Skills & Practical Workshops -->
          <ul class="space-y-3 mb-4">
            ${skillsHtml}
          </ul>

          ${certsSectionHtml}
        </div>

        <div class="pt-4 border-t border-slate-800 text-center">
          <span class="text-xs sm:text-sm font-bold text-slate-400">
            ${isYearComplete ? '🎉 تم إنجاز متطلبات السنة بالكامل!' : 'تتبع متطلبات التميز الأكاديمي والمهني'}
          </span>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

// 8. LANGUAGE TRACK VIEW (SRP: Renders 33 Language Courses with Playlists)
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
      badge.innerText = stats.percent + '% مكتمل 🌐';
      badge.className = stats.percent === 100
        ? 'px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-xs font-black font-display shadow-sm'
        : 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black font-display';
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
      card.className = 'bg-slate-900/85 backdrop-blur-xl rounded-3xl border ' + (isLevelComplete ? 'border-emerald-500/50 shadow-emerald-950/30' : 'border-slate-800') + ' p-5 sm:p-7 shadow-2xl flex flex-col justify-between space-y-5 card-lift relative overflow-hidden';

      let coursesHtml = '';
      (level.courses || []).forEach(c => {
        const isDone = LanguageTrackService.isDone(state, c.id);
        coursesHtml += `
          <li class="p-3.5 sm:p-4 rounded-2xl border transition shadow-2xs ${isDone ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/60'}">
            <div class="flex items-center justify-between mb-2 gap-2">
              <span class="text-xs sm:text-sm font-mono font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg shrink-0 shadow-2xs">
                ${c.num}
              </span>
              <span class="text-xs sm:text-sm font-bold px-3 py-1 rounded-lg ${isDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}">
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
                <label for="lang-${c.id}" class="text-base sm:text-lg font-black text-white cursor-pointer select-none leading-snug block ${isDone ? 'line-through text-slate-400' : ''}">
                  ${c.name || c.title || ''}
                </label>
              </div>
            </div>

            <!-- YouTube Official Playlist Direct Link -->
            <div class="flex items-center justify-between pt-2 border-t border-slate-800">
              <a 
                href="${c.playlistUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold border border-rose-800/60 transition text-xs sm:text-sm cursor-pointer shadow-2xs"
                title="مشاهدة قائمة التشغيل الرسمية على يوتيوب"
              >
                <i class="fa-brands fa-youtube text-rose-400 text-base"></i>
                <span>قائمة التشغيل 🎬</span>
              </a>
              ${isDone ? '<span class="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-1 rounded-lg">تم الإنجاز ✅</span>' : '<span class="text-xs font-bold text-slate-400">اضغط للمشاهدة ↗</span>'}
            </div>
          </li>
        `;
      });

      card.innerHTML = `
        <!-- Level Card Header -->
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <span class="text-sm sm:text-base font-black px-4 py-1.5 rounded-full ${level.pillColor || 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'} flex items-center gap-2 border shadow-xs">
              <i class="fa-solid ${level.icon}"></i> ${level.title}
            </span>
            <span dir="ltr" class="text-sm sm:text-base font-black font-display font-mono ${isLevelComplete ? 'text-emerald-400' : 'text-emerald-300'}">
              ${levelStats.percent}% (${levelStats.done}/${levelStats.total})
            </span>
          </div>

          <p class="text-xs sm:text-sm text-slate-400 font-medium my-3">
            ${level.subtitle}
          </p>

          <!-- Level Progress Bar -->
          <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4 shadow-inner">
            <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300" style="width: ${levelStats.percent}%;"></div>
          </div>

          <!-- Level Courses List -->
          <ul class="space-y-3">
            ${coursesHtml}
          </ul>
        </div>

        <div class="pt-4 border-t border-slate-800 text-center">
          <span class="text-xs sm:text-sm font-bold text-slate-400">
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
  window.CurriculumView = CurriculumView;
  window.AchievementsView = AchievementsView;
  window.ProgrammingView = ProgrammingView;
  window.HeaderView = HeaderView;
  window.ResultModalView = ResultModalView;
  window.RoadmapView = RoadmapView;
  window.LanguageTrackView = LanguageTrackView;
}
