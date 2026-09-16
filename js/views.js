/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - VIEW RENDERERS (SRP / Clean UI Separation)
 * =========================================================================
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
    const quranDone = Boolean(dayLog.quran?.done);
    const gymDone = Boolean(dayLog.gym?.done);
    const sleepDone = Boolean(dayLog.sleep?.done);

    const doneCount = prayersDone + (quranDone ? 1 : 0) + (gymDone ? 1 : 0) + (sleepDone ? 1 : 0);
    const totalCount = 8; // 5 prayers + 1 quran + 1 gym + 1 sleep
    const percent = Math.round((doneCount / totalCount) * 100);

    const overallBadge = document.getElementById('routineOverallBadge');
    if (overallBadge) {
      if (percent === 100) {
        overallBadge.innerText = '100% يوم مثالي معتمد 👑';
        overallBadge.className = 'px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-xs font-black font-display shadow-sm';
      } else {
        overallBadge.innerText = `${percent}% مكتمل اليوم ⚡`;
        overallBadge.className = 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black font-display';
      }
    }

    const prayersStat = document.getElementById('routinePrayersStat');
    if (prayersStat) prayersStat.innerText = `${prayersDone} / 5`;

    const quranStat = document.getElementById('routineQuranStat');
    if (quranStat) quranStat.innerText = `${quranDone ? 1 : 0} / 1`;

    const gymStat = document.getElementById('routineGymStat');
    if (gymStat) gymStat.innerText = `${gymDone ? 1 : 0} / 1`;

    const sleepStat = document.getElementById('routineSleepStat');
    if (sleepStat) sleepStat.innerText = `${sleepDone ? 1 : 0} / 1`;

    const percentText = document.getElementById('routineOverallPercentText');
    if (percentText) percentText.innerText = `${percent}%`;

    const progressBar = document.getElementById('routineOverallProgressBar');
    if (progressBar) progressBar.style.width = `${percent}%`;
  }

  static renderPrayers(prayers) {
    const container = document.getElementById('prayersListContainer');
    if (!container) return;

    container.innerHTML = '';
    let completedCount = 0;

    APP_CONFIG.PRAYERS.forEach(prayer => {
      const isDone = Boolean(prayers[prayer.id]);
      if (isDone) completedCount++;

      const prayerCard = document.createElement('div');
      prayerCard.className = `flex items-center justify-between p-2.5 rounded-2xl border transition gap-2 ${
        isDone ? 'bg-emerald-50/90 border-emerald-300' : 'bg-slate-50 border-slate-200'
      }`;
      prayerCard.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <input 
            type="checkbox" 
            id="prayer-${prayer.id}" 
            ${isDone ? 'checked' : ''} 
            onchange="app.togglePrayer('${prayer.id}')" 
            class="checkbox-custom w-5 h-5 shrink-0"
          />
          <label for="prayer-${prayer.id}" class="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer flex items-center gap-2 select-none truncate">
            <i class="fa-solid ${prayer.icon} text-emerald-600 text-xs shrink-0"></i>
            <span>${prayer.name}</span>
          </label>
        </div>
        ${isDone ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 bg-emerald-600 text-white shadow-2xs">تمت ✅</span>' : ''}
      `;
      container.appendChild(prayerCard);
    });

    const badge = document.getElementById('prayersCountBadge');
    const boxEl = document.getElementById('prayersStatusBox');
    const msgEl = document.getElementById('prayersStatusMsg');

    if (completedCount === 5) {
      if (badge && badge.innerText !== undefined) {
        badge.className = 'px-2.5 py-1 rounded-lg shimmer-gold text-slate-950 text-xs font-black whitespace-nowrap shrink-0 shadow-md shadow-amber-500/20';
        badge.innerText = '5 / 5 كاملة 👑'; badge.className = 'px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold whitespace-nowrap shrink-0 shadow-sm font-mono';
      }
      if (boxEl) boxEl.className = 'p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-amber-500/15 border-amber-300 gold-glow-border text-center mt-3';
      if (msgEl) msgEl.innerText = 'هنيئاً لك يا بطل! أتممت صلواتك الخمس كاملة في وقتها.. نور وتوفيق ورضا من الله 🌟🕌';
    } else if (completedCount > 0) {
      if (badge) {
        badge.className = 'px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold whitespace-nowrap shrink-0';
        badge.innerText = completedCount > 0 ? `${completedCount} / 5 صلوات` : '0 / 5 صلوات'; badge.className = 'px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap shrink-0 font-mono';
      }
      if (boxEl) boxEl.className = 'p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center mt-3';
      if (msgEl) msgEl.innerText = `أحسنت! أنجزت (${completedCount} من 5 صلوات).. كمّل باقي الفروض لتنال التوفيق التام 🕌✨`;
    } else {
      if (badge) {
        badge.className = 'px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold whitespace-nowrap shrink-0';
        badge.innerText = 'إقامة الصلاة 🕌';
      }
      if (boxEl) boxEl.className = 'p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center mt-3';
      if (msgEl) msgEl.innerText = 'الصلاة عماد الدين وأول ما يُحاسب عليه العبد.. ابدأ يومك بالبركة 🌿';
    }
  }

  static renderGym(gym) {
    const isDone = Boolean(gym.done);
    const checkEl = document.getElementById('gymCheck');
    const boxEl = document.getElementById('gymCardBox');
    const badgeEl = document.getElementById('gymStatusBadge');
    const msgEl = document.getElementById('gymStatusMsg');

    if (checkEl) checkEl.checked = isDone;

    if (isDone) {
      if (boxEl) boxEl.className = 'p-5 rounded-2xl border transition flex items-center justify-between gap-3 bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-400 gold-glow-border shadow-xs';
      if (badgeEl) {
        badgeEl.className = 'text-xs font-black px-3 py-1 rounded-lg shimmer-gold text-slate-950 whitespace-nowrap shrink-0 shadow-md shadow-amber-500/20';
        badgeEl.innerText = 'تم الإنجاز 💪🔥';
      }
      if (msgEl) msgEl.innerText = 'عاش يا وحش! بنيت قوتك وانضباطك النهاردة 🦍✨';
    } else {
      if (boxEl) boxEl.className = 'p-5 rounded-2xl border transition flex items-center justify-between gap-3 bg-slate-50 border-slate-200';
      if (badgeEl) {
        badgeEl.className = 'text-xs font-bold px-3 py-1 rounded-lg bg-slate-200 text-slate-600 whitespace-nowrap shrink-0';
        badgeEl.innerText = 'لم يتم ⏳';
      }
      if (msgEl) msgEl.innerText = 'لا أعذار.. تمرين اليوم يبني قوتك وصلابتك! 🔥';
    }
  }

  static renderSleep(sleep) {
    const isDone = Boolean(sleep.done);
    const checkEl = document.getElementById('sleepCheck');
    const boxEl = document.getElementById('sleepCardBox');
    const badgeEl = document.getElementById('sleepStatusBadge');
    const msgEl = document.getElementById('sleepEvalText');

    if (checkEl) checkEl.checked = isDone;

    if (isDone) {
      if (boxEl) boxEl.className = 'p-4 sm:p-5 rounded-2xl border transition flex items-center justify-between gap-2 bg-gradient-to-r from-indigo-500/15 to-amber-500/10 border-indigo-400 gold-glow-border shadow-xs';
      if (badgeEl) {
        badgeEl.className = 'text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white whitespace-nowrap shrink-0 shadow-2xs';
        badgeEl.innerText = 'تم الالتزام ✅';
      }
      if (msgEl) msgEl.innerText = 'عاش يا بطل! أتممت ساعات النوم المثالية وجاهز للتركيز الأكاديمي 🌟';
    } else {
      if (boxEl) boxEl.className = 'p-4 sm:p-5 rounded-2xl border transition flex items-center justify-between gap-2 bg-slate-50 border-slate-200';
      if (badgeEl) {
        badgeEl.className = 'text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-200 text-slate-600 whitespace-nowrap shrink-0';
        badgeEl.innerText = 'لم يتم ⏳';
      }
      if (msgEl) msgEl.innerText = 'النوم الصحي: بين 7 إلى 9 ساعات (لو أقل أو أكثر تُترك فارغة وتُحسب غير منجزة) ⚠️';
    }
  }

  static renderQuran(quran) {
    const checkEl = document.getElementById('quranCheck');
    const cardBox = document.getElementById('quranCardBox');
    const statusBadge = document.getElementById('quranStatusBadge');
    const statusMsg = document.getElementById('quranStatusMsg');

    if (checkEl) checkEl.checked = Boolean(quran.done);

    if (quran.done) {
      if (cardBox) cardBox.className = 'p-5 rounded-2xl border transition flex items-center justify-between gap-3 bg-gradient-to-r from-teal-500/15 to-amber-500/10 border-teal-400 gold-glow-border shadow-xs';
      if (statusBadge) {
        statusBadge.className = 'text-xs font-bold px-3 py-1 rounded-lg bg-teal-600 text-white whitespace-nowrap shrink-0';
        statusBadge.innerText = 'تمت التلاوة 📖';
      }
      if (statusMsg) statusMsg.innerText = 'تقبّل الله وردك وطاعتك.. نور وبركة لقلبك ويومك ✨';
    } else {
      if (cardBox) cardBox.className = 'p-5 rounded-2xl border transition flex items-center justify-between gap-3 bg-slate-50 border-slate-200';
      if (statusBadge) {
        statusBadge.className = 'text-xs font-bold px-3 py-1 rounded-lg bg-slate-200 text-slate-600 whitespace-nowrap shrink-0';
        statusBadge.innerText = 'لم يتم ⏳';
      }
      if (statusMsg) statusMsg.innerText = '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ 🌿';
    }
  }

    static renderFinalizeStatus(dayLog) {
    const pill = document.getElementById('finalizeStatusPill');
    const btn = document.getElementById('finalizeDayBtn');
    const btnText = document.getElementById('finalizeBtnText');
    const btnIcon = document.getElementById('finalizeBtnIcon');

    if (!pill || !btnText) return;

    if (dayLog && dayLog.submitted) {
      const prayersDone = Object.values(dayLog.prayers || {}).filter(Boolean).length;
      const is100 = (prayersDone === 5 && Boolean(dayLog.quran?.done) && Boolean(dayLog.gym?.done) && Boolean(dayLog.sleep?.done));

      if (is100) {
        pill.innerHTML = '<i class="fa-solid fa-crown text-amber-300"></i> تم الاعتماد: التزام تام 100% 👑';
        pill.className = 'px-3.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      } else {
        pill.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-rose-300"></i> تم الاعتماد: يوم به نقص ⚠️';
        pill.className = 'px-3.5 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/50 text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      }

      btnText.innerText = 'تحديث اعتماد اليوم 🔄';
      if (btnIcon) btnIcon.className = 'fa-solid fa-check-double text-slate-950 text-lg';
      if (btn) {
        btn.className = 'w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display font-black text-sm sm:text-base shadow-xl shadow-amber-500/35 border-2 border-amber-200 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 cursor-pointer select-none relative z-10';
      }
    } else {
      pill.innerHTML = '<i class="fa-solid fa-bolt text-amber-400"></i> جاهز للتسجيل ⚡';
      pill.className = 'px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black font-display shadow-2xs inline-flex items-center gap-1.5';
      btnText.innerText = 'تسجيل واعتماد اليوم ✅';
      if (btnIcon) btnIcon.className = 'fa-solid fa-crown text-slate-950 text-lg';
      if (btn) {
        btn.className = 'w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display font-black text-sm sm:text-base shadow-xl shadow-amber-500/35 border-2 border-amber-200 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 cursor-pointer select-none relative z-10';
      }
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
          ? `${style.cardBg} ${style.border} ring-2 ring-indigo-500 shadow-md` 
          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
      }`;

      btn.innerHTML = `
        <div class="flex items-center justify-between w-full gap-2">
          <div class="w-8 h-8 rounded-xl ${isActive ? style.iconBg : 'bg-white border border-slate-200'} ${isActive ? style.iconColor : 'text-slate-700'} flex items-center justify-center text-xs shrink-0 shadow-2xs">
            <i class="fa-solid ${subj.icon}"></i>
          </div>
          <span class="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${isActive ? style.badge : 'bg-white text-slate-600 border border-slate-200'} shrink-0">
            ${stats.percentage}%
          </span>
        </div>
        <span class="text-xs sm:text-[13px] font-black font-display leading-tight text-slate-900">${subj.name}</span>
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

    // Subject Hero Header (Clean without "نسبة إتمام المقرر" widget)
    const headerHtml = `
      <div class="bg-white p-4 sm:p-5 rounded-3xl border ${style.border} ${style.cardBg} shadow-xs mb-5 flex items-center gap-3.5 text-right">
        <div class="w-12 h-12 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center text-xl shrink-0 shadow-sm">
          <i class="fa-solid ${currentMeta.icon}"></i>
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-black font-display text-slate-900 leading-snug">${currentMeta.name}</h3>
          <p class="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">${currentMeta.desc}</p>
        </div>
      </div>
    `;

    if (!weeksData || weeksData.length === 0) {
      container.innerHTML = `
        ${headerHtml}
        <div class="bg-white rounded-3xl border border-dashed border-slate-200 p-8 sm:p-14 text-center text-slate-500 space-y-3 shadow-xs">
          <div class="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto shadow-2xs">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <h4 class="font-display font-black text-slate-800 text-base sm:text-lg">المقرر فارغ وجاهز للتسجيل 🎓</h4>
          <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            سيتم إضافة المحاضرات والملخصات الفعلية أسبوعاً بأسبوع فور انطلاق الدراسة بالمعهد بإذن الله.
          </p>
        </div>
      `;
      return;
    }

    // 10 Weeks Breakdown Grid
    let weeksHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">';

    weeksData.forEach((w) => {
      const subjectData = w.subjects ? w.subjects[activeSubject] : null;
      const lessons = subjectData ? (subjectData.lessons || []) : [];
      const isWeekDone = lessons.length > 0 && lessons.every((_, lIdx) => Boolean(lessonProgress[`w${w.week}_s${activeSubject}_l${lIdx}`]));

      weeksHtml += `
        <div class="bg-white rounded-3xl border transition card-lift ${
          isWeekDone ? 'gold-card-100 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        } p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
          
          <div>
            <!-- Week Header -->
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-xl ${isWeekDone ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'} flex items-center justify-center text-xs font-black font-mono shadow-2xs">
                  ${w.week}
                </span>
                <h4 class="font-display font-black text-sm sm:text-base text-slate-900">${w.title}</h4>
              </div>

              <span class="text-xs font-black font-display px-2.5 py-1 rounded-xl ${
                isWeekDone ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs' 
                  : (lessons.length === 0 ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-slate-100 text-slate-600')
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
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50/70 shadow-2xs'
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
                          isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-slate-900'
                        }"
                      >
                        <span class="font-display text-[9px] font-black px-1.5 py-0.5 rounded-md border shrink-0 bg-slate-100 text-slate-700 ml-1 inline-block no-underline">${numStr}</span>
                        ${lesson}
                      </label>
                    </div>

                    <button 
                      type="button"
                      onclick="app.openNoteModal('${lessonKey}')" 
                      title="ملاحظات وتلخيص الدرس"
                      class="p-1.5 rounded-xl border text-xs shrink-0 transition active:scale-90 cursor-pointer ${
                        hasNote 
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                      }"
                    >
                      <i class="fa-solid fa-note-sticky"></i>
                    </button>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-6 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs font-bold bg-slate-50/60 flex flex-col items-center justify-center gap-1.5">
                  <i class="fa-solid fa-hourglass-start text-slate-400 text-base"></i>
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




// =========================================================================
// =========================================================================
// 3. ACHIEVEMENTS VIEW (Routine Discipline, Academic Subjects & Programming)
// =========================================================================
class AchievementsView {
  static render(dailyLogs = {}, weeks = [], lessonProgress = {}, programmingCourses = {}) {
    this.renderRoutineAchievements(dailyLogs);
    this.renderAcademicAchievements(weeks, lessonProgress);
    this.renderProgrammingAchievements(programmingCourses);
  }

  // 1. Routine Discipline & Days History
  static renderRoutineAchievements(dailyLogs = {}) {
    const container = document.getElementById('routineAchievementsContainer');
    if (!container) return;

    const stats = DisciplineCalculator.calculateHistoryStats(dailyLogs);
    const incompleteHistory = DisciplineCalculator.getIncompleteDaysDetails(dailyLogs);
    const totalSemesterDays = APP_CONFIG.TOTAL_SEMESTER_DAYS || 112;
    const loggedPercentage = totalSemesterDays > 0 ? Math.round((stats.totalLoggedDays / totalSemesterDays) * 100) : 0;
    const perfectSemesterPercentage = totalSemesterDays > 0 ? Math.round((stats.perfectDays / totalSemesterDays) * 100) : 0;
    const remainingDays = Math.max(0, totalSemesterDays - stats.totalLoggedDays);
    const incompletePercentage = stats.totalLoggedDays > 0 ? Math.round((stats.incompleteDays / stats.totalLoggedDays) * 100) : 0;

    container.innerHTML = `
      <!-- Hero Banner: Cumulative Discipline Dashboard (Styled like English & Roadmap Hero) -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-500/30 relative overflow-hidden card-lift">
        <div class="absolute -right-16 -top-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black font-display inline-flex items-center gap-1.5">
                <i class="fa-solid fa-calendar-check text-indigo-400"></i> الالتزام التراكمي المستمر 🏆
              </span>
              <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black font-display" id="routineDisciplineBadge">
                ${stats.perfectRate}% التزام تام 👑
              </span>
            </div>
            <h2 class="font-display font-black text-xl sm:text-2xl text-white">
              سجل ومؤشر الالتزام اليومي التراكمي (${totalSemesterDays} يوماً نحو الامتياز والمركز الأول)
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              متابعة حية وشاملة لكل يوم دراسي؛ رصد الأيام المثالية ناصعة البياض ومعالجة أي تقصير فورياً لضمان صدارة الدفعة والتعيين معيداً بقسم المحاسبة والمراجعة.
            </p>
          </div>

          <!-- Live Progress Capsule in Hero -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shrink-0 w-full lg:w-64">
            <span class="text-xs text-slate-300 font-bold block mb-1">الأيام المسجلة بالترم:</span>
            <div class="text-2xl font-black font-display text-amber-300" id="routineLoggedDaysCount" dir="ltr">${stats.totalLoggedDays} / ${totalSemesterDays}</div>
            <span class="text-2xs text-amber-200/80 font-medium block mt-1">يوم معتمد في الكنترول الذاتي</span>
          </div>
        </div>

        <!-- Semester Coverage Progress Bar -->
        <div class="mt-5 pt-4 border-t border-white/10">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>مؤشر تغطية أيام الترم الدراسي:</span>
            <span class="text-amber-300 font-black font-mono" dir="ltr">${loggedPercentage}% (${stats.totalLoggedDays} من أصل ${totalSemesterDays} يوماً)</span>
          </div>
          <div class="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div class="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-300 rounded-full transition-all duration-500" style="width: ${loggedPercentage}%;"></div>
          </div>
        </div>
      </div>

      <!-- 3 Luxury Stat Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        <!-- Card 1: Perfect 100% Days (Emerald) -->
        <div class="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-5 shadow-sm card-lift flex flex-col justify-between transition relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <span class="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1.5 border">
                <i class="fa-solid fa-crown text-emerald-600"></i> أيام الالتزام التام 100%
              </span>
              <span dir="ltr" class="text-xs font-black font-display font-mono text-emerald-700">
                ${stats.perfectRate}%
              </span>
            </div>

            <p class="text-[11px] text-slate-500 font-medium my-2">
              أيام ناصعة البياض بدون أي تقصير في الصلوات الخمس أو العادات
            </p>

            <div class="text-3xl sm:text-4xl font-black font-mono text-emerald-700 my-2" dir="ltr">
              ${stats.perfectDays} <span class="text-xs font-bold text-slate-500 font-cairo">يوم</span>
            </div>

            <!-- Mini Progress Bar -->
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300" style="width: ${stats.perfectRate}%;"></div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-center">
            <span class="text-[11px] font-bold text-emerald-800">
              ${perfectSemesterPercentage}% من إجمالي أيام الترم (${totalSemesterDays} يوماً)
            </span>
          </div>
        </div>

        <!-- Card 2: Incomplete Days (Rose) -->
        <div class="bg-white rounded-3xl border border-slate-200 hover:border-rose-400 p-5 shadow-sm card-lift flex flex-col justify-between transition relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <span class="text-xs font-black px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border-rose-200 flex items-center gap-1.5 border">
                <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> أيام بها تقصير أو نقص
              </span>
              <span dir="ltr" class="text-xs font-black font-display font-mono text-rose-700">
                ${incompletePercentage}%
              </span>
            </div>

            <p class="text-[11px] text-slate-500 font-medium my-2">
              أيام لم تكتمل فيها الصلوات أو القرآن أو الجيم أو النوم
            </p>

            <div class="text-3xl sm:text-4xl font-black font-mono text-rose-700 my-2" dir="ltr">
              ${stats.incompleteDays} <span class="text-xs font-bold text-slate-500 font-cairo">يوم</span>
            </div>

            <!-- Mini Progress Bar -->
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div class="h-full bg-gradient-to-r from-rose-400 to-amber-500 rounded-full transition-all duration-300" style="width: ${incompletePercentage}%;"></div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-center">
            <span class="text-[11px] font-bold text-rose-800">
              رصد الأسباب لتداركها فورياً وعدم تكرارها
            </span>
          </div>
        </div>

        <!-- Card 3: Remaining Days (Indigo) -->
        <div class="bg-white rounded-3xl border border-slate-200 hover:border-indigo-400 p-5 shadow-sm card-lift flex flex-col justify-between transition relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <span class="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border-indigo-200 flex items-center gap-1.5 border">
                <i class="fa-solid fa-calendar-days text-indigo-600"></i> الأيام المتبقية في الترم
              </span>
              <span dir="ltr" class="text-xs font-black font-display font-mono text-indigo-700">
                ${100 - loggedPercentage}%
              </span>
            </div>

            <p class="text-[11px] text-slate-500 font-medium my-2">
              فرص مستمرة كل يوم لتعزيز الالتزام وتحقيق المركز الأول 🏆
            </p>

            <div class="text-3xl sm:text-4xl font-black font-mono text-indigo-700 my-2" dir="ltr">
              ${remainingDays} <span class="text-xs font-bold text-slate-500 font-cairo">يوم</span>
            </div>

            <!-- Mini Progress Bar -->
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div class="h-full bg-gradient-to-r from-indigo-400 to-sky-500 rounded-full transition-all duration-300" style="width: ${Math.max(0, 100 - loggedPercentage)}%;"></div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-center">
            <span class="text-[11px] font-bold text-indigo-800">
              متبقي من إجمالي ${totalSemesterDays} يوماً بالترم الأول
            </span>
          </div>
        </div>

      </div>

      <!-- Cumulative Days Dual-Timeline Meter Card -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 card-lift">
        <div class="flex items-center justify-between text-xs font-bold flex-wrap gap-2">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-emerald-700 flex items-center gap-1.5 font-bold">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              التزام تام: ${stats.perfectDays} يوم (${stats.perfectRate}%)
            </span>
            <span class="text-rose-700 flex items-center gap-1.5 font-bold">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              أيام تقصير: ${stats.incompleteDays} يوم (${incompletePercentage}%)
            </span>
          </div>
          <span class="text-slate-500 font-mono text-xs font-bold" dir="ltr">
            متبقي: ${remainingDays} يوم من ${totalSemesterDays} يوم
          </span>
        </div>
        <div class="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner border border-slate-200">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style="width: ${stats.perfectRate}%" title="التزام تام"></div>
          <div class="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500" style="width: ${incompletePercentage}%" title="أيام تقصير"></div>
        </div>
      </div>

      <!-- Incomplete Days Breakdown Log or Spotless Streak Banner -->
      ${incompleteHistory.length > 0 ? `
        <div class="border border-rose-200 rounded-3xl bg-white overflow-hidden shadow-xs card-lift">
          <button 
            type="button"
            onclick="toggleIncompleteDetailsSection()" 
            class="w-full p-4 sm:p-5 bg-rose-50/80 hover:bg-rose-100/80 flex items-center justify-between gap-3 text-right font-bold text-xs sm:text-sm text-rose-950 transition cursor-pointer select-none"
          >
            <div class="flex items-center gap-2.5">
              <i class="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i>
              <span>سجل الأيام التي وقع بها تقصير (${incompleteHistory.length} يوم) - اضغط لتشريح الأسباب وتصحيح المسار</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span id="toggleIncompleteText" class="text-xs text-rose-700 font-mono font-bold">عرض التفاصيل 🔍</span>
              <i id="toggleIncompleteIcon" class="fa-solid fa-chevron-down text-rose-600 text-xs"></i>
            </div>
          </button>

          <div id="incompleteDetailsWrapper" class="hidden divide-y divide-slate-100 p-5 space-y-3 bg-white">
            ${incompleteHistory.map(day => `
              <div class="pt-3 first:pt-0 space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-900 font-mono">${day.date}</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-bold">
                    ${day.missedCount} عناصر لم تكتمل
                  </span>
                </div>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  ${day.missed.map(item => `
                    <span class="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1.5">
                      <i class="fa-solid fa-xmark text-rose-500 text-[9px]"></i> ${item}
                    </span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 text-center shadow-xs card-lift">
          <i class="fa-solid fa-crown text-amber-500 text-lg"></i>
          <span>سجلك ناصع البياض والتزامك 100% بدون أي تقصير أو مخالفات حتى الآن! استمر في طريق المركز الأول 👑</span>
        </div>
      `}

      <!-- Bottom Toolbar: Reset Routine History Safe Button -->
      <div class="flex items-center justify-between pt-2">
        <span class="text-xs text-slate-400 font-medium">سجل الالتزام يُحدث لحظياً بعد كل اعتماد يومي</span>
        <button 
          type="button"
          onclick="resetRoutineHistory()" 
          class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs" 
          title="تصفير سجل الأيام والروتين فقط إلى 0 يوم"
        >
          <i class="fa-solid fa-rotate-left text-rose-600"></i> تصفير سجل الأيام التراكمي (0 يوم) 🔄
        </button>
      </div>
    `;
  }

  static renderAcademicAchievements(weeks = [], lessonProgress = {}) {
    const container = document.getElementById('academicAchievementsContainer');
    const badge = document.getElementById('academicAchievementsBadge');
    if (!container) return;

    let totalLessons = 0;
    let completedLessons = 0;
    let completedWeeksCount = 0;
    const weeksList = (weeks && weeks.length > 0) ? weeks : (weeksData || []);

    weeksList.forEach(w => {
      const wStats = AcademicCalculator.getWeekStats(w, lessonProgress);
      totalLessons += wStats.totalCount;
      completedLessons += wStats.completedCount;
      if (wStats.totalCount > 0 && wStats.completedCount === wStats.totalCount) {
        completedWeeksCount++;
      }
    });

    const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    if (badge) {
      badge.innerText = `${completedLessons} من ${totalLessons} درس منجز (${overallPercentage}%)`;
    }

    let html = `
      <!-- 1. Master Overall Academic Progress Headline -->
      <div class="bg-gradient-to-r from-indigo-50 via-slate-50 to-purple-50 border border-indigo-100 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">
              <i class="fa-solid fa-graduation-cap"></i>
            </span>
            <div>
              <h4 class="font-display font-black text-sm sm:text-base text-slate-900">التحصيل الأكاديمي الإجمالي للمقررات</h4>
              <p class="text-xs text-slate-500 font-medium">مجموع الدروس المنجزة من جميع المواد والأسابيع</p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <span class="font-mono font-black text-xs sm:text-sm text-indigo-950 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
              ${completedLessons} / ${totalLessons} درس (${overallPercentage}%)
            </span>
          </div>
        </div>

        <div class="w-full h-3 rounded-full bg-slate-200/80 overflow-hidden shadow-inner">
          <div class="h-full rounded-full shimmer-progress-bar bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 shadow-sm" style="width: ${overallPercentage}%"></div>
        </div>
      </div>

      <!-- 2. The 6 Subjects Section -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between flex-wrap gap-2 px-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-book-bookmark text-indigo-600"></i>
            <span class="font-display font-black text-xs sm:text-sm text-slate-900">إنجاز المواد الدراسية الـ 6 (50 درساً لكل مادة):</span>
          </div>
          <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
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
            ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-300 shadow-2xs' 
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
        } space-y-3 flex flex-col justify-between">
          
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-xl ${isSubject100 ? 'bg-emerald-500 text-white' : style.iconBg + ' ' + style.iconColor} flex items-center justify-center text-xs shrink-0 shadow-2xs">
                <i class="fa-solid ${subj.icon}"></i>
              </div>
              <span class="text-xs sm:text-sm font-black font-display text-slate-900 truncate">${subj.name}</span>
            </div>
            <span class="text-xs font-mono font-black px-2.5 py-1 rounded-lg ${isSubject100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : style.badge} shrink-0">
              ${stats.percentage}%
            </span>
          </div>

          <div class="space-y-1.5">
            <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
              <div class="h-full rounded-full ${isSubject100 ? 'bg-emerald-500' : style.progressBar} transition-all duration-500" style="width: ${stats.percentage}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] font-bold">
              <span class="text-slate-500">الدروس المنجزة</span>
              <span class="font-mono text-slate-800">${stats.completedCount} / ${stats.totalCount} درس</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
            <span class="text-slate-400">حالة المادة</span>
            <span class="${
              isSubject100 
                ? 'text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200' 
                : isSubjectStarted 
                  ? 'text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100' 
                  : 'text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md'
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

      <!-- 3. The 19 Weeks Section -->
      <div class="space-y-3 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between flex-wrap gap-2 px-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-calendar-days text-indigo-600"></i>
            <span class="font-display font-black text-xs sm:text-sm text-slate-900">إنجاز أسابيع الترم الـ 19 (من 6 سبتمبر حتى 17 يناير):</span>
          </div>
          <span class="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
            ${completedWeeksCount} من ${weeksList.length} أسبوع مكتمل (100%)
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
    `;

    weeksList.forEach((w) => {
      const wStats = AcademicCalculator.getWeekStats(w, lessonProgress);
      const isWeek100 = (wStats.totalCount > 0 && wStats.completedCount === wStats.totalCount);
      const isWeekStarted = (wStats.completedCount > 0);

      html += `
        <div class="p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
          isWeek100 
            ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-300 shadow-2xs' 
            : isWeekStarted 
              ? 'bg-white border-indigo-200 hover:border-indigo-300 shadow-2xs' 
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
        } space-y-2.5 text-right flex flex-col justify-between">
          
          <div class="flex items-center justify-between gap-1.5">
            <span class="px-2 py-0.5 rounded-lg ${
              isWeek100 
                ? 'bg-emerald-500 text-white shadow-2xs' 
                : isWeekStarted 
                  ? 'bg-indigo-100 text-indigo-900' 
                  : 'bg-slate-100 text-slate-700'
            } text-[10px] font-black font-mono">
              W${w.week}
            </span>
            <span class="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${
              isWeek100 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : isWeekStarted 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                  : 'bg-slate-100 text-slate-500'
            }">
              ${wStats.percentage}%
            </span>
          </div>

          <div>
            <h5 class="text-xs font-black font-display text-slate-900 truncate">${w.title}</h5>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5 shadow-inner">
              <div class="h-full rounded-full ${isWeek100 ? 'bg-emerald-500' : isWeekStarted ? 'bg-indigo-600' : 'bg-slate-300'} transition-all duration-500" style="width: ${wStats.percentage}%"></div>
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] font-bold pt-1.5 border-t border-slate-100 text-slate-500">
            <span class="font-mono text-slate-700">${wStats.completedCount} / ${wStats.totalCount} درس</span>
            ${isWeek100 ? '<span title="أسبوع مكتمل بالكامل">👑</span>' : isWeekStarted ? '<span class="text-indigo-600 font-bold">⚡</span>' : '<span class="text-slate-300">⏳</span>'}
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

    // 3. AI & Data Analysis Track Progress
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
        <div class="bg-gradient-to-r from-indigo-50/80 via-slate-50 to-blue-50/80 border border-indigo-100 rounded-3xl p-6 text-center space-y-3">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20">
            <i class="fa-solid fa-brain"></i>
          </div>
          <h4 class="font-display font-black text-base text-slate-900">مسار AI & Data Analysis</h4>
          <p class="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
            تم ضبط وتصفير المسار بالكامل وهو جاهز لمسارات الذكاء الاصطناعي وتحليل البيانات المتوافقة مع المحاسبة والأعمال 📊🤖
          </p>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <i class="fa-solid fa-check"></i> تم التصفير (0%)
          </div>
        </div>
      `;
      return;
    }

    let html = `
      <!-- Master AI & Data Analysis Progress Headline -->
      <div class="bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 border border-indigo-100 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">
              <i class="fa-solid fa-brain"></i>
            </span>
            <div>
              <h4 class="font-display font-black text-sm sm:text-base text-slate-900">إجمالي إنجاز مسار AI & Data Analysis</h4>
              <p class="text-xs text-slate-500 font-medium">متابعة مسارات الذكاء الاصطناعي وتحليل البيانات</p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <span class="font-mono font-black text-xs sm:text-sm text-indigo-950 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
              ${completedCount} / ${totalCourses} كورس (${percentage}%)
            </span>
          </div>
        </div>

        <div class="w-full h-3 rounded-full bg-slate-200/80 overflow-hidden shadow-inner">
          <div class="h-full rounded-full shimmer-progress-bar bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 transition-all duration-500 shadow-sm" style="width: ${percentage}%"></div>
        </div>
      </div>

      <!-- Clean Grid of Courses -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
    `;

    courses.forEach(c => {
      const isDone = Boolean(programmingCourses[c.id]);

      html += `
        <div class="p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
          isDone 
            ? "bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-300 shadow-2xs" 
            : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
        } space-y-3 flex flex-col justify-between text-right">
          
          <div class="flex items-center justify-between gap-2">
            <div class="w-8 h-8 rounded-xl ${
              isDone ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-100 text-slate-700"
            } flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid ${c.icon}"></i>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
              isDone ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-600 border border-slate-200"
            }">
              ${isDone ? "مكتمل 🎓" : "قيد التعلم ⏳"}
            </span>
          </div>

          <div>
            <h5 class="text-xs sm:text-sm font-black font-display text-slate-900 leading-snug">
              ${c.title}
            </h5>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>مسار AI & Data Analysis</span>
            <span class="${isDone ? "text-emerald-700 font-black" : "text-slate-500"}">
              ${isDone ? "تم الإنجاز ✅" : "مستمر 🚀"}
            </span>
          </div>

        </div>
      `;
    });

    html += `</div>`;

    container.innerHTML = html;
  }
}


// 4. PROGRAMMING VIEW (AI & Data Analysis - Clean Empty State or Cards)
class ProgrammingView {
  static render(programmingCourses = {}) {
    const container = document.getElementById('programmingCoursesContainer');
    if (!container) return;

    const coursesList = (typeof programmingCoursesData !== 'undefined' && Array.isArray(programmingCoursesData))
      ? programmingCoursesData
      : (APP_CONFIG.PROGRAMMING_COURSES || []);

    if (!coursesList.length) {
      container.innerHTML = `
        <div class="col-span-full py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-xs space-y-4">
          <div class="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-sm border border-indigo-100">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div class="space-y-1.5">
            <h3 class="font-display font-black text-xl sm:text-2xl text-slate-900">مسار AI & Data Analysis</h3>
            <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
              تم ضبط وتصفير المسار بالكامل وهو فاضي حالياً. المسار جاهز ومُخصص لإضافة وتثبيت كورسات الذكاء الاصطناعي وتحليل البيانات قريباً 📊🤖
            </p>
          </div>
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <i class="fa-solid fa-circle-check text-emerald-500"></i>
            <span>تم التصفير بنجاح (فارغ وجاهز)</span>
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    coursesList.forEach((course) => {
      const isDone = Boolean(programmingCourses[course.id]);

      html += `
        <div class="rounded-3xl border transition card-lift animate-fade-in ${
          isDone ? 'gold-card-100 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        } p-5 sm:p-6 space-y-4 flex flex-col justify-between text-right">
          
          <!-- Course Header & Badge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div class="w-10 h-10 rounded-2xl ${
                isDone 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-100 text-slate-700'
              } flex items-center justify-center text-lg shrink-0 transition">
                <i class="fa-solid ${course.icon}"></i>
              </div>

              <span class="text-xs font-black font-display px-3 py-1 rounded-xl ${
                isDone 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              } whitespace-nowrap shrink-0">
                ${isDone ? 'مكتمل 100% 🎓' : 'قيد المتابعة ⏳'}
              </span>
            </div>

            <!-- Full Course Title -->
            <h3 class="font-display font-black text-base sm:text-lg text-slate-900 leading-snug">
              ${course.title}
            </h3>
          </div>

          <!-- Interactive Completion Toggle Button -->
          <div class="pt-2 border-t border-slate-100">
            <button 
              type="button"
              onclick="toggleProgrammingCourse('${course.id}')" 
              class="w-full py-3 px-4 rounded-2xl border font-display font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer select-none ${
                isDone 
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-emerald-500 text-white shadow-md shadow-emerald-600/20' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
              }"
            >
              <div class="w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 transition ${
                isDone ? 'bg-white text-emerald-700 font-black' : 'border border-slate-300 bg-white text-transparent'
              }">
                <i class="fa-solid fa-check ${isDone ? 'opacity-100' : 'opacity-0'}"></i>
              </div>
              <span class="font-bold">
                ${isDone ? 'أتممت الكورس بنجاح (100%)' : 'تعليم الكورس كمكتمل'}
              </span>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
}




// 5. HEADER VIEW (Live Header Metadata & Controls - SRP / ISP)
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
      badge.className = 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-display shadow-2xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/30 transition';
      badge.innerHTML = '<i class="fa-solid fa-rotate text-amber-400 animate-spin"></i> <span>جاري الحفظ في Firebase...</span>';
    } else {
      badge.className = 'px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-display shadow-2xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/30 transition';
      badge.innerHTML = `<i class="fa-solid fa-fire text-amber-400"></i> <span>فايربيز متصل 🟢</span>`;
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
      // 100% Perfect Day (كلام دعم وتشجيع وفخر قوي جداً)
      iconBox.className = 'w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30 animate-bounce';
      iconBox.innerHTML = '<i class="fa-solid fa-crown"></i>';

      tag.className = 'text-xs font-black font-display px-3.5 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-300';
      tag.innerText = '🏆 يوم التزام تام 100% (أُضيف لسجل الشرف)';

      title.innerText = 'وحش يا بطل.. انضباط أسطوري اليوم! 🔥👑';
      message.innerHTML = 'ما شاء الله تبارك الله! قفّلت يومك بصلواتك الخمس كاملة، ورد القرآن، تمرين الجيم، والنوم المثالي (7-9 ساعات). الاستمرار على الانضباط الحديدي ده هو اللي هيصنع مستقبلك ويوصلك لامتياز الترم الأول. فخورين بيك يا بطل، استمر على نفس القوة! 🌟';

      actionBtn.className = 'w-full py-3.5 px-5 rounded-2xl font-display font-black text-sm text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-500/25';
      actionBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> يلا نبدأ اليوم الجديد بنفس القوة والتركيز 🚀';
    } else {
      // Incomplete Day (كلام تحفيزي مباشر يدفعه للالتزام والتعويض)
      iconBox.className = 'w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-rose-500/30';
      iconBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';

      tag.className = 'text-xs font-black font-display px-3.5 py-1 rounded-full border bg-rose-50 text-rose-800 border-rose-300';
      tag.innerText = '⚠️ يوم به نقص (أُضيف لسجل الأيام الناقصة)';

      title.innerText = 'محتاج تشد حيلك وتلتزم أكتر يا وحش! 💪';
      message.innerHTML = 'النهاردة فاتتك بعض المهام الأساسية (صلاة، جيم، أو ساعات النوم)، والنجاح الحقيقي مبيقبلش الأعذار. اعتبر اليوم ده درس وجرس إنذار، قفل على نفسك التشتيت، وعوّض بكرة بالتزام حديدي 100% بدون أي تهاون! 🎯';

      actionBtn.className = 'w-full py-3.5 px-5 rounded-2xl font-display font-black text-sm text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black shadow-slate-900/30';
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

// =========================================================================
// 8. ROADMAP VIEW (SRP: Renders 15 Courses, Skills, and Certifications)
// =========================================================================
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

    const coursesStat = document.getElementById('roadmapCoursesStat');
    if (coursesStat) coursesStat.innerText = stats.doneCourses + ' / ' + stats.totalCourses;

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
      card.className = 'bg-white rounded-3xl border ' + (isYearComplete ? 'border-emerald-300 shadow-emerald-500/10' : 'border-slate-200') + ' p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 card-lift relative overflow-hidden';

      // 1. Courses List (Stacked with Code and Name without truncation)
      let coursesHtml = '';
      (year.courses || []).forEach(c => {
        const isDone = RoadmapService.isDone(state, c.id);
        coursesHtml += `
          <li class="p-2.5 rounded-xl border transition ${isDone ? 'bg-emerald-50/90 border-emerald-300' : 'bg-slate-50 border-slate-200/80'}">
            <div class="flex items-center justify-between mb-1.5 gap-2">
              <span class="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">${c.code}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${isDone ? 'bg-emerald-600 text-white shadow-2xs' : (c.type === 'إجباري' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200')}">
                ${isDone ? 'منجز ✅' : c.type}
              </span>
            </div>
            <div class="flex items-start gap-2.5 min-w-0">
              <input 
                type="checkbox" 
                id="roadmap-${c.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleRoadmapItem('${c.id}')" 
                class="checkbox-custom w-5 h-5 shrink-0 mt-0.5"
              />
              <label for="roadmap-${c.id}" class="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer select-none leading-snug ${isDone ? 'line-through text-slate-400' : ''}">
                ${c.name}
              </label>
            </div>
          </li>
        `;
      });

      // 2. Skills & Workshops List (Full details, no truncation, and ERP sub-items)
      let skillsHtml = '';
      (year.skills || []).forEach(s => {
        const isDone = RoadmapService.isDone(state, s.id);
        
        let erpSubHtml = '';
        if (s.id === 'skill_09') {
          erpSubHtml = `
            <div class="mt-2.5 space-y-1.5 pr-2 border-r-2 border-blue-400">
              <div class="flex items-center justify-between bg-blue-50/70 border border-blue-200/70 px-2 py-1 rounded text-[11px] gap-1.5">
                <span class="font-bold text-slate-800 flex items-center gap-1"><i class="fa-solid fa-server text-blue-600"></i> 9.1. ساب المالي (SAP S/4HANA)</span>
                <span class="text-[9px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">الشركات الكبرى والبترول</span>
              </div>
              <div class="flex items-center justify-between bg-rose-50/70 border border-rose-200/70 px-2 py-1 rounded text-[11px] gap-1.5">
                <span class="font-bold text-slate-800 flex items-center gap-1"><i class="fa-solid fa-cloud text-rose-600"></i> 9.2. أوراكل المالي (Oracle Cloud)</span>
                <span class="text-[9px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">البنوك والحكومة</span>
              </div>
              <div class="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/70 px-2 py-1 rounded text-[11px] gap-1.5">
                <span class="font-bold text-slate-800 flex items-center gap-1"><i class="fa-solid fa-network-wired text-emerald-600"></i> 9.3. داينامكس (Dynamics 365)</span>
                <span class="text-[9px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">سلاسل الإمداد</span>
              </div>
            </div>
          `;
        }

        skillsHtml += `
          <li class="p-2.5 rounded-xl border transition ${isDone ? 'bg-indigo-50/90 border-indigo-200' : 'bg-slate-50 border-slate-200/70'}">
            <div class="flex items-start gap-2.5 min-w-0">
              <input 
                type="checkbox" 
                id="roadmap-${s.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleRoadmapItem('${s.id}')" 
                class="checkbox-custom w-4 h-4 shrink-0 mt-0.5"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-1.5 mb-1">
                  <span class="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded shrink-0">${s.num}</span>
                  ${isDone ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white shrink-0">مكتسب ✨</span>' : '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">' + s.category + '</span>'}
                </div>
                <label for="roadmap-${s.id}" class="text-xs font-bold text-slate-900 cursor-pointer select-none leading-relaxed block ${isDone ? 'line-through text-slate-400' : ''}">
                  ${s.name}
                </label>
                ${erpSubHtml}
              </div>
            </div>
          </li>
        `;
      });

      // 3. Certifications List (Stacked, complete names, organizations)
      let certsHtml = '';
      (year.certifications || []).forEach(crt => {
        const isDone = RoadmapService.isDone(state, crt.id);
        certsHtml += `
          <li class="p-2.5 rounded-xl border transition ${isDone ? 'bg-emerald-50 border-emerald-300 shadow-2xs' : 'bg-amber-50/40 border-amber-200/70'}">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded">${crt.num}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${isDone ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-amber-100 text-amber-900 border border-amber-200'}">
                ${isDone ? 'معتمد 🏆' : crt.badge}
              </span>
            </div>
            <div class="flex items-start gap-2.5 min-w-0">
              <input 
                type="checkbox" 
                id="roadmap-${crt.id}" 
                ${isDone ? 'checked' : ''} 
                onchange="app.toggleRoadmapItem('${crt.id}')" 
                class="checkbox-custom w-5 h-5 shrink-0 mt-0.5"
              />
              <div class="min-w-0 flex-1">
                <label for="roadmap-${crt.id}" class="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer select-none block leading-snug ${isDone ? 'line-through text-slate-400' : ''}">
                  ${crt.name}
                </label>
                <span class="text-[10px] text-slate-500 font-bold block mt-1"><i class="fa-solid fa-building-columns text-slate-400"></i> ${crt.org}</span>
              </div>
            </div>
          </li>
        `;
      });

      const yrText = year.yearNum === 1 ? 'سنة أولى' : (year.yearNum === 2 ? 'سنة ثانية' : (year.yearNum === 3 ? 'سنة ثالثة' : 'سنة رابعة'));
      const certBridgeText = year.yearNum === 4 ? 'الشهادات الكبرى عند التخرج:' : `الشهادات المهنية بعد ${yrText}:`;

      card.innerHTML = `
        <!-- Year Card Header -->
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <span class="text-xs font-black px-2.5 py-1 rounded-full ${year.pillColor} flex items-center gap-1.5 border">
              <i class="fa-solid ${year.icon}"></i> ${year.stagePill}
            </span>
            <span dir="ltr" class="text-xs font-black font-display font-mono ${isYearComplete ? 'text-emerald-600' : 'text-blue-600'}">
              ${yearStats.percent}% (${yearStats.doneItems}/${yearStats.totalItems})
            </span>
          </div>

          <!-- Progress Bar for this Year -->
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2.5 mb-3.5">
            <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300" style="width: ${yearStats.percent}%;"></div>
          </div>

          <!-- Part 1: Academic Courses -->
          <div class="space-y-2 mb-3">
            <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <i class="fa-solid fa-graduation-cap text-blue-600"></i> المقررات الدراسية المعتمدة:
            </span>
            <ul class="space-y-2">
              ${coursesHtml}
            </ul>
          </div>

          <!-- Pathway Bridge 1: Skills -->
          <div class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-xs font-black py-1.5 px-3 rounded-xl my-2.5 shadow-xs">
            <i class="fa-solid fa-arrow-down"></i> الكورسات والمهارات بعد ${yrText}:
          </div>

          <!-- Part 2: Skills & Practical Workshops -->
          <ul class="space-y-2 mb-3">
            ${skillsHtml}
          </ul>

          <!-- Pathway Bridge 2: Certifications -->
          <div class="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-600 text-white text-xs font-black py-1.5 px-3 rounded-xl my-2.5 shadow-xs">
            <i class="fa-solid fa-award"></i> ${certBridgeText}
          </div>

          <!-- Part 3: Professional Certifications -->
          <ul class="space-y-2">
            ${certsHtml}
          </ul>
        </div>

        <div class="pt-3 border-t border-slate-100 text-center">
          <span class="text-[11px] font-bold text-slate-600">
            ${isYearComplete ? '🎉 تم إنجاز متطلبات السنة بالكامل!' : 'تتبع متطلبات التميز الأكاديمي والمهني'}
          </span>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

// =========================================================================
// 9. LANGUAGE TRACK VIEW (SRP: Renders 33 Language Courses with Playlists)
// =========================================================================
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
      card.className = 'bg-white rounded-3xl border ' + (isLevelComplete ? 'border-emerald-300 shadow-emerald-500/10' : 'border-slate-200') + ' p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 card-lift relative overflow-hidden';

      let coursesHtml = '';
      (level.courses || []).forEach(c => {
        const isDone = LanguageTrackService.isDone(state, c.id);
        coursesHtml += `
          <li class="p-2.5 rounded-xl border transition space-y-2 ${isDone ? 'bg-emerald-50/90 border-emerald-300' : 'bg-slate-50 border-slate-200/80'}">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start gap-2.5 min-w-0">
                <input 
                  type="checkbox" 
                  id="lang-${c.id}" 
                  ${isDone ? 'checked' : ''} 
                  onchange="app.toggleLanguageCourse('${c.id}')" 
                  class="checkbox-custom w-5 h-5 shrink-0 mt-0.5"
                />
                <span class="text-[11px] font-mono font-black text-purple-900 bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded shrink-0">${c.num}</span>
                <label for="lang-${c.id}" class="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer select-none leading-snug ${isDone ? 'line-through text-slate-400' : ''}">
                  ${c.name}
                </label>
              </div>
            </div>

            <!-- YouTube Official Playlist Direct Link -->
            <div class="flex items-center justify-between pt-1 text-xs">
              <a 
                href="${c.playlistUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition text-[11px] cursor-pointer"
                title="مشاهدة قائمة التشغيل الرسمية على يوتيوب"
              >
                <i class="fa-brands fa-youtube text-rose-600 text-sm"></i>
                <span>قائمة التشغيل 🎬</span>
              </a>
              ${isDone ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">مكتمل ✅</span>' : '<span class="text-[10px] font-bold text-slate-400">قيد المتابعة ⏳</span>'}
            </div>
          </li>
        `;
      });

      card.innerHTML = `
        <!-- Level Card Header -->
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <span class="text-xs font-black px-2.5 py-1 rounded-full ${level.pillColor} flex items-center gap-1.5 border">
              <i class="fa-solid ${level.icon}"></i> ${level.title}
            </span>
            <span dir="ltr" class="text-xs font-black font-display font-mono ${isLevelComplete ? 'text-emerald-600' : 'text-emerald-700'}">
              ${levelStats.percent}% (${levelStats.done}/${levelStats.total})
            </span>
          </div>

          <p class="text-[11px] text-slate-500 font-medium my-2">
            ${level.subtitle}
          </p>

          <!-- Level Progress Bar -->
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300" style="width: ${levelStats.percent}%;"></div>
          </div>

          <!-- Level Courses List -->
          <ul class="space-y-2">
            ${coursesHtml}
          </ul>
        </div>

        <div class="pt-3 border-t border-slate-100 text-center">
          <span class="text-[11px] font-semibold text-slate-500">
            ${isLevelComplete ? '🎉 مبروك! أتممت هذا المستوى بالكامل' : 'قوائم التشغيل الرسمية لقناة ZAmericanEnglish'}
          </span>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

if (typeof window !== 'undefined') {
  window.RoadmapView = RoadmapView;
  window.LanguageTrackView = LanguageTrackView;
}
