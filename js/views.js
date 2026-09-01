/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - VIEW RENDERERS (SRP / Clean UI Separation)
 * =========================================================================
 */

// 1. ROUTINE VIEW (Prayers, Gym, Sleep, Quran, Finalize Button)
class RoutineView {
  static render(dayLog) {
    if (!dayLog) return;
    this.renderPrayers(dayLog.prayers || {});
    this.renderGym(dayLog.gym || {});
    this.renderSleep(dayLog.sleep || {});
    this.renderQuran(dayLog.quran || {});
    this.renderFinalizeStatus(dayLog);
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
      if (badge) {
        badge.className = 'px-2.5 py-1 rounded-lg shimmer-gold text-slate-950 text-xs font-black whitespace-nowrap shrink-0 shadow-md shadow-amber-500/20';
        badge.innerText = 'أُقيمت بالكامل 🕌👑';
      }
      if (boxEl) boxEl.className = 'p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-amber-500/15 border-amber-300 gold-glow-border text-center mt-3';
      if (msgEl) msgEl.innerText = 'هنيئاً لك يا بطل! أتممت صلواتك الخمس كاملة في وقتها.. نور وتوفيق ورضا من الله 🌟🕌';
    } else if (completedCount > 0) {
      if (badge) {
        badge.className = 'px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold whitespace-nowrap shrink-0';
        badge.innerText = 'إقامة الصلاة 🕌';
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
    const btnText = document.getElementById('finalizeBtnText');
    const btnIcon = document.getElementById('finalizeBtnIcon');

    if (!pill || !btnText) return;

    if (dayLog.submitted) {
      const prayersDone = Object.values(dayLog.prayers || {}).filter(Boolean).length;
      const is100 = (prayersDone === 5 && Boolean(dayLog.quran?.done) && Boolean(dayLog.gym?.done) && Boolean(dayLog.sleep?.done));

      if (is100) {
        pill.innerText = 'تم الاعتماد: التزام تام 100% 👑';
        pill.className = 'px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold font-display';
      } else {
        pill.innerText = 'تم الاعتماد: يوم به نقص ⚠️';
        pill.className = 'px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[11px] font-bold font-display';
      }

      btnText.innerText = 'تحديث اعتماد اليوم 🔄';
      if (btnIcon) btnIcon.className = 'fa-solid fa-check-double';
    } else {
      pill.innerText = 'جاهز للتسجيل ⚡';
      pill.className = 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold font-display';
      btnText.innerText = 'تسجيل واعتماد اليوم ✅';
      if (btnIcon) btnIcon.className = 'fa-solid fa-lock-open';
    }
  }
}

// 2. CURRICULUM VIEW (6 Subjects Navigation & 10 Weeks Breakdown per Subject)
class CurriculumView {
  static render(activeSubject, lessonProgress, lessonNotes) {
    const subjIdx = (typeof activeSubject === 'number' && activeSubject >= 0 && activeSubject < APP_CONFIG.SUBJECT_NAMES.length) 
      ? activeSubject 
      : 0;
    this.renderSubjectPills(subjIdx, lessonProgress);
    this.renderActiveSubjectWeeks(subjIdx, lessonProgress, lessonNotes);
  }

  static renderSubjectPills(activeSubject, lessonProgress) {
    const container = document.getElementById('weekPillsBar');
    if (!container) return;
    container.innerHTML = '';

    APP_CONFIG.SUBJECTS.forEach((subj, sIdx) => {
      const stats = AcademicCalculator.getSubjectStats(weeksData, lessonProgress, sIdx);
      const isActive = sIdx === activeSubject;
      const style = colorStyles[subj.color] || colorStyles.blue;

      const btn = document.createElement('button');
      btn.className = `p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 text-right ${
        isActive 
          ? `${style.cardBg} ${style.border} ring-2 ring-indigo-500 shadow-md text-slate-950 font-black` 
          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
      }`;

      btn.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl ${isActive ? style.iconBg : 'bg-slate-100'} ${isActive ? style.iconColor : 'text-slate-600'} flex items-center justify-center text-sm shrink-0 shadow-2xs">
            <i class="fa-solid ${subj.icon}"></i>
          </div>
          <span class="text-xs sm:text-sm font-black text-slate-900 font-display">${subj.name}</span>
        </div>
        <span class="text-xs font-mono font-black px-2.5 py-1 rounded-xl ${isActive ? style.badge : 'bg-slate-100 text-slate-700 border border-slate-200'} shrink-0">
          ${stats.percentage}%
        </span>
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
    const stats = AcademicCalculator.getSubjectStats(weeksData, lessonProgress, activeSubject);

    // Subject Hero Header
    const headerHtml = `
      <div class="bg-white p-5 sm:p-6 rounded-3xl border ${style.border} ${style.cardBg} shadow-xs mb-6 space-y-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3.5 text-center sm:text-right">
            <div class="w-12 h-12 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center text-xl shadow-md shrink-0">
              <i class="fa-solid ${currentMeta.icon}"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h3 class="text-xl sm:text-2xl font-black font-display text-slate-900">${currentMeta.name}</h3>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-lg ${style.badge}">10 أسابيع</span>
              </div>
              <p class="text-xs text-slate-600 font-medium">${currentMeta.desc}</p>
            </div>
          </div>

          <div class="shrink-0 text-center sm:text-left bg-white/95 px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span class="text-xs font-bold text-slate-500 block">نسبة الإنجاز الكلية للمادة</span>
            <div class="flex items-center gap-2 justify-center sm:justify-start">
              <span class="text-lg sm:text-xl font-black font-display text-slate-900">${stats.completed} من ${stats.total} درس</span>
              <span class="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">${stats.percentage}%</span>
            </div>
          </div>
        </div>

        <div class="w-full h-2.5 rounded-full bg-white/80 overflow-hidden shadow-inner">
          <div class="h-full rounded-full ${style.badge} transition-all duration-500" style="width: ${stats.percentage}%"></div>
        </div>
      </div>
    `;

    // 10 Weeks Cards for this subject
    let weeksCardsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-5">';

    weeksData.forEach(w => {
      const wSubj = w.subjects[activeSubject];
      if (!wSubj) return;

      const lessons = wSubj.lessons || [];
      const totalLessons = lessons.length;
      let completedInWeek = 0;

      lessons.forEach((_, lIdx) => {
        const lessonKey = `w${w.week}_s${activeSubject}_l${lIdx}`;
        if (lessonProgress[lessonKey]) completedInWeek++;
      });

      const isWeekFull = (totalLessons > 0 && completedInWeek === totalLessons);
      const weekPercentage = totalLessons > 0 ? Math.round((completedInWeek / totalLessons) * 100) : 0;

      weeksCardsHtml += `
        <div class="bg-white rounded-3xl border transition card-lift animate-fade-in stagger-card ${
          isWeekFull 
            ? 'border-amber-400 gold-glow-border bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent shadow-xs' 
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
        } p-4 sm:p-5 space-y-4 flex flex-col justify-between">
          <div>
            <!-- Week Header inside Subject -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl ${isWeekFull ? 'shimmer-gold text-slate-950 font-black shadow-md shadow-amber-500/30' : 'bg-slate-900 text-white'} font-display font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                  ${w.week}
                </span>
                <div>
                  <h4 class="font-display font-black text-base text-slate-900">${w.title}</h4>
                  <span class="text-[11px] text-slate-500 font-medium">${wSubj.badge || `${totalLessons} دروس`}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-black ${isWeekFull ? 'text-amber-950 px-2 py-0.5 rounded-lg shimmer-gold shadow-2xs' : 'text-slate-600'}">
                  ${completedInWeek} / ${totalLessons} (${weekPercentage}%)
                </span>
                ${isWeekFull ? '<span class="text-xs">👑</span>' : ''}
              </div>
            </div>

            <!-- Mini Week Progress Bar -->
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div class="h-full rounded-full ${isWeekFull ? 'shimmer-gold' : 'bg-indigo-600'} transition-all duration-500" style="width: ${weekPercentage}%"></div>
            </div>

            <!-- Week Lessons Checklist for this Subject -->
            <div class="space-y-2.5 pt-4">
              ${lessons.map((lesson, lIdx) => {
                const lessonKey = `w${w.week}_s${activeSubject}_l${lIdx}`;
                const isCompleted = Boolean(lessonProgress[lessonKey]);
                const hasNote = Boolean(lessonNotes[lessonKey]);
                const lessonNumber = lIdx + 1 < 10 ? `0${lIdx + 1}` : `${lIdx + 1}`;

                return `
                  <div class="p-3 rounded-2xl border transition flex items-start justify-between gap-2.5 ${
                    isCompleted 
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs' 
                      : 'bg-white border-slate-200 shadow-2xs hover:bg-slate-50/70'
                  }">
                    <div class="flex items-start gap-2.5 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        id="chk_${lessonKey}" 
                        ${isCompleted ? 'checked' : ''} 
                        onchange="app.toggleLesson('${lessonKey}')" 
                        class="checkbox-custom mt-0.5"
                      />
                      <label 
                        for="chk_${lessonKey}" 
                        class="text-[13px] sm:text-[14px] font-bold leading-relaxed cursor-pointer select-none ${
                          isCompleted ? 'text-emerald-950 line-through opacity-85' : 'text-slate-900'
                        }"
                      >
                        <span class="font-display text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 ${style.bulletBg} ml-1 inline-block no-underline">${lessonNumber}</span>
                        ${lesson}
                      </label>
                    </div>
                    
                    <button 
                      onclick="app.openNoteModal('${lessonKey}')" 
                      class="p-1.5 rounded-lg text-xs shrink-0 ${hasNote ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-400'} transition"
                      title="${hasNote ? 'عرض الملاحظة' : 'إضافة ملاحظة'}"
                    >
                      <i class="fa-solid fa-note-sticky"></i>
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    });

    weeksCardsHtml += '</div>';
    container.innerHTML = headerHtml + weeksCardsHtml;
  }
}

// =========================================================================
// =========================================================================
// 3. ACHIEVEMENTS VIEW (Routine Discipline & Programming Mastery)
// =========================================================================
class AchievementsView {
  static render(state) {
    // 1. Routine Days History (Fair ratio & counts of perfect vs incomplete days)
    this.renderRoutineAchievements(state.dailyLogs || {});

    // 2. Programming Track Achievements (5 Courses)
    this.renderProgrammingAchievements(state.programmingCourses || {});
  }

  // 1. Render Routine & Days History (Unified & Streamlined against 112 Days Target)
  static renderRoutineAchievements(dailyLogs) {
    const container = document.getElementById('routineAchievementsContainer');
    if (!container) return;
    container.innerHTML = '';

    const totalSemesterDays = APP_CONFIG.TOTAL_SEMESTER_DAYS || 112;
    const stats = DisciplineCalculator.calculateHistoryStats(dailyLogs);
    const total = stats.totalLoggedDays || 0;
    const perfect = stats.perfectDays || 0;
    const incomplete = stats.incompleteDays || 0;
    const remainingDays = Math.max(0, totalSemesterDays - total);

    const perfectRate = total > 0 ? Math.round((perfect / total) * 100) : 0;
    const incompleteRate = total > 0 ? (100 - perfectRate) : 0;

    const perfectOfSemester = Math.round((perfect / totalSemesterDays) * 100);
    const totalOfSemester = Math.round((total / totalSemesterDays) * 100);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Stat Bar: 112 Days Target Timeline -->
        <div class="pb-4 border-b border-slate-100 text-center sm:text-right">
          <span class="text-xs font-bold text-slate-500 block">إجمالي أيام الترم الأول (112 يوماً)</span>
          <div class="flex items-center gap-2 justify-center sm:justify-start pt-1">
            <span class="text-2xl sm:text-3xl font-black font-display text-slate-900">${total}</span>
            <span class="text-xs font-bold text-slate-600">يوم مسجل من أصل 112 يوماً (${totalOfSemester}%)</span>
          </div>
        </div>

        <!-- 2 Main Cards: Perfect vs Incomplete -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Perfect Days Card -->
          <div class="p-5 rounded-2xl border ${perfect > 0 ? 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-amber-500/10 border-emerald-400 gold-glow-border' : 'bg-emerald-50/80 border-emerald-300'} space-y-3 shadow-2xs card-lift">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white flex items-center justify-center text-xs shadow-md shadow-amber-500/30">
                  <i class="fa-solid fa-crown text-amber-200"></i>
                </div>
                <span class="text-xs font-black text-slate-900 font-display">أيام الالتزام التام 100% 👑</span>
              </div>
              <span class="text-xs font-mono font-black text-emerald-950 px-2.5 py-0.5 rounded-lg shimmer-gold shadow-2xs">
                ${perfectRate}% من المسجل
              </span>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black font-display text-emerald-950">${perfect}</span>
              <span class="text-xs font-bold text-slate-600">يوم ناصع البياض بدون أي تقصير</span>
            </div>

            <!-- Mini Progress -->
            <div class="w-full h-1.5 rounded-full bg-emerald-100 overflow-hidden">
              <div class="h-full rounded-full shimmer-gold transition-all duration-500" style="width: ${perfectRate}%"></div>
            </div>

            <p class="text-[11px] font-semibold text-emerald-900 leading-relaxed">
              ${perfectOfSemester}% من إجمالي أيام الترم المستهدفة (112 يوماً).
            </p>
          </div>

          <!-- Incomplete Days Card -->
          <div class="p-5 rounded-2xl border ${incomplete > 0 ? 'bg-rose-50/80 border-rose-300' : 'bg-slate-50 border-slate-200'} space-y-3 shadow-2xs card-lift">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl ${incomplete > 0 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-xs shadow-2xs">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <span class="text-xs font-black text-slate-900 font-display">أيام بها تقصير أو نقص</span>
              </div>
              <span class="text-xs font-mono font-black ${incomplete > 0 ? 'text-rose-700 bg-rose-100' : 'text-slate-500 bg-slate-200'} px-2.5 py-0.5 rounded-lg">
                ${incompleteRate}% من المسجل
              </span>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black font-display ${incomplete > 0 ? 'text-rose-950' : 'text-slate-400'}">${incomplete}</span>
              <span class="text-xs font-bold text-slate-600">يوم لم تكتمل فيه جميع العادات والصلوات</span>
            </div>

            <!-- Mini Progress -->
            <div class="w-full h-1.5 rounded-full bg-rose-100 overflow-hidden">
              <div class="h-full rounded-full bg-rose-500 transition-all duration-500" style="width: ${incompleteRate}%"></div>
            </div>

            <p class="text-[11px] font-semibold text-slate-500 leading-relaxed">
              يتم رصد أسباب النقص بدقة لتصحيحها وعدم تكرارها.
            </p>
          </div>
        </div>

        <!-- Single Unified Progress Bar (112 Days Target Timeline) -->
        <div class="space-y-2 pt-2">
          <div class="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex shadow-inner border border-slate-200/80">
            <div class="h-full bg-emerald-500 transition-all duration-500" style="width: ${(perfect / totalSemesterDays) * 100}%" title="التزام تام: ${perfect} يوم"></div>
            <div class="h-full bg-rose-500 transition-all duration-500" style="width: ${(incomplete / totalSemesterDays) * 100}%" title="أيام نقص: ${incomplete} يوم"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 flex-wrap gap-2">
            <span class="text-emerald-700 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              التزام تام: ${perfect} يوم (${perfectRate}%)
            </span>
            <span class="text-rose-700 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              أيام نقص: ${incomplete} يوم (${incompleteRate}%)
            </span>
            <span class="text-slate-500 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
              متبقي: ${remainingDays} يوم من 112 يوم
            </span>
          </div>
        </div>

        <!-- Detailed Breakdown of Incomplete Days -->
        ${(() => {
          const incompleteDetails = DisciplineCalculator.getIncompleteDaysDetails(dailyLogs);
          if (incompleteDetails.length === 0) {
            return `
              <div class="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-center space-y-1">
                <div class="flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                  <span>لا يوجد أي أيام بها تقصير في سجلك حتى الآن!</span>
                </div>
                <p class="text-[11px] text-emerald-700">سجلك ناصع البياض والتزامك 100% بدون أي مخالفات 👑✨</p>
              </div>
            `;
          }

          return `
            <div class="bg-gradient-to-br from-rose-50/70 via-rose-50/30 to-white rounded-3xl p-4 sm:p-5 border border-rose-200/90 shadow-2xs space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-clipboard-list"></i>
                  </div>
                  <div>
                    <h4 class="font-display font-black text-sm text-slate-900">سجل تفاصيل أيام التقصير</h4>
                    <span class="text-[11px] text-slate-500">رصد دقيق لكل صلاة أو ورد أو تمرين أو نوم لم يكتمل</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-xl">
                  ${incompleteDetails.length} أيام مسجلة
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                ${incompleteDetails.map(item => `
                  <div class="p-3.5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black font-display text-slate-900">${item.date}</span>
                      <span class="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        ${item.score}% التزام
                      </span>
                    </div>

                    <div class="space-y-1">
                      <span class="text-[11px] font-bold text-slate-600 block">ما لم يكتمل في هذا اليوم:</span>
                      <div class="flex flex-wrap gap-1.5">
                        ${item.missed.map(m => `
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <i class="fa-solid fa-xmark text-rose-500 text-[9px]"></i> ${m}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        })()}
      </div>
    `;
  }

  // 2. Render Programming Track Achievements
  static renderProgrammingAchievements(programmingCourses) {
    const container = document.getElementById('programmingAchievementsContainer');
    const badge = document.getElementById('programmingAchievementsBadge');
    if (!container) return;
    container.innerHTML = '';

    const courses = (typeof programmingCoursesData !== 'undefined') ? programmingCoursesData : (APP_CONFIG.PROGRAMMING_COURSES || []);
    let totalCompletedCourses = 0;
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    const courseCards = courses.map(course => {
      const courseState = programmingCourses[course.id] || { completedLessons: {} };
      const completedInCourse = Object.keys(courseState.completedLessons || {}).length;
      const totalInCourse = (course.lessons && course.lessons.length) || (course.weeks ? course.weeks.reduce((acc, w) => acc + (w.lessons ? w.lessons.length : 0), 0) : 10);

      totalLessonsCount += totalInCourse;
      completedLessonsCount += completedInCourse;

      const isCourseDone = totalInCourse > 0 && completedInCourse === totalInCourse;
      if (isCourseDone) totalCompletedCourses++;

      const percent = totalInCourse > 0 ? Math.round((completedInCourse / totalInCourse) * 100) : 0;

      return `
        <div class="p-4 rounded-2xl border ${isCourseDone ? 'bg-gradient-to-br from-cyan-500/15 via-emerald-500/10 to-transparent border-cyan-400 gold-glow-border' : 'bg-slate-50/70 border-slate-200'} space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fa-solid ${course.icon || 'fa-code'} text-cyan-600 text-sm"></i>
              <span class="text-xs font-black text-slate-900 font-display">${course.title || course.name}</span>
            </div>
            <span class="text-xs font-mono font-black ${isCourseDone ? 'text-emerald-700 bg-emerald-100' : 'text-cyan-700 bg-cyan-100'} px-2 py-0.5 rounded-md">
              ${percent}%
            </span>
          </div>

          <div class="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div class="h-full rounded-full ${isCourseDone ? 'bg-emerald-500' : 'bg-cyan-600'} transition-all duration-500" style="width: ${percent}%"></div>
          </div>

          <div class="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>${completedInCourse} من ${totalInCourse} درس منجز</span>
            <span>${isCourseDone ? '👑 مكتمل 100%' : 'قيد التقدم'}</span>
          </div>
        </div>
      `;
    });

    const overallProgPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

    if (badge) {
      badge.innerText = `${totalCompletedCourses} من ${courses.length} كورسات مكتملة (${overallProgPercent}%)`;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        ${courseCards.join('')}
      </div>
    `;
  }
}



// 4. PROGRAMMING VIEW (Clean Course Title Cards - No Truncation)
class ProgrammingView {
  static render(programmingCourses = {}) {
    const container = document.getElementById('programmingCoursesContainer');
    if (!container) return;

    const coursesList = (typeof programmingCoursesData !== 'undefined' && Array.isArray(programmingCoursesData))
      ? programmingCoursesData
      : (APP_CONFIG.PROGRAMMING_COURSES || []);

    if (!coursesList.length) return;

    let html = '';
    coursesList.forEach((course) => {
      const isDone = Boolean(programmingCourses[course.id]);

      html += `
        <div class="bg-white rounded-3xl border transition card-lift animate-fade-in ${
          isDone
            ? 'border-emerald-400 emerald-glow-border bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent shadow-xs'
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
        } p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          
          <!-- Course Header & Badge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div class="w-10 h-10 rounded-2xl ${
                isDone 
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-500/25' 
                  : 'bg-slate-100 text-slate-700'
              } flex items-center justify-center text-lg shrink-0 transition">
                <i class="fa-solid ${course.icon}"></i>
              </div>

              <span class="text-xs font-black font-display px-3 py-1 rounded-xl ${
                isDone 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              } whitespace-nowrap shrink-0">
                ${isDone ? 'مكتمل 100% 🎓' : 'قيد المتابعة ⏳'}
              </span>
            </div>

            <!-- Full Course Title (No Truncation) -->
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-md shadow-emerald-500/25' 
                  : 'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-950 shadow-2xs'
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




// 5. HEADER VIEW (Live Header Metadata)
class HeaderView {
  static render(state) {
    // Header rendered cleanly
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
