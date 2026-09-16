/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - INTEGRATED ROADMAP & LANGUAGE TRACK DATA
 * =========================================================================
 * Solid Principles & Clean Code Architecture:
 * - Immutable data definitions (Object.freeze)
 * - Domain-driven structure for 4 academic years (15 courses, 16 skills, 9 certs)
 * - Complete 33-course language curriculum with verified official playlists
 */

// 1. WEEKS DATA (Ready for real lectures when semester begins)
const weeksData = [];
const programmingCoursesData = [];

// 2. THE INTEGRATED 4-YEAR ACADEMIC ROADMAP (15 Subjects + Skills + Certifications)
const ROADMAP_YEARS_DATA = Object.freeze([
  {
    id: 'year-1',
    yearNum: 1,
    title: 'السنة الأولى بالمعهد',
    stagePill: 'السنة الأولى بالمعهد',
    pillColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderColor: 'border-blue-500',
    icon: 'fa-seedling',
    courses: [
      { id: 'ACT_01', code: 'ACT 01', name: 'مبادئ المحاسبة المالية', type: 'إجباري' },
      { id: 'INS_09', code: 'INS 09', name: 'رياضيات الأعمال', type: 'إجباري' }
    ],
    skills: [
      { id: 'skill_01', num: '01', name: 'تعلم الـ WORD', category: 'مهارات مكتبية' },
      { id: 'skill_02', num: '02', name: 'تعلم الـ PowerPoint', category: 'مهارات العرض' },
      { id: 'skill_03', num: '03', name: 'تدريب: المحاسبة المالية (Financial Accounting)', category: 'تدريب عملي' },
      { id: 'skill_04', num: '04', name: 'تدريب: المحاسب المالي المحترف (PFA)', category: 'تأهيل مهني' },
      { id: 'skill_05', num: '05', name: 'تدريب: محاسبة التكاليف (Cost Accounting)', category: 'تدريب تخصصي' }
    ],
    certifications: [
      { id: 'cert_01', num: '01', name: 'Odoo Certified Functional Consultant', org: 'Odoo (بلجيكا)', badge: 'ERP سحابي' },
      { id: 'cert_02', num: '02', name: 'Power BI Data Analyst (PL-300)', org: 'Microsoft', badge: 'تحليل بيانات' }
    ]
  },
  {
    id: 'year-2',
    yearNum: 2,
    title: 'السنة الثانية بالمعهد',
    stagePill: 'السنة الثانية بالمعهد',
    pillColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderColor: 'border-indigo-500',
    icon: 'fa-chart-line',
    courses: [
      { id: 'ACT_02', code: 'ACT 02', name: 'مبادئ محاسبة التكاليف', type: 'إجباري' },
      { id: 'LAW_12', code: 'LAW 12', name: 'القانون التجاري', type: 'إجباري' },
      { id: 'ACT_03', code: 'ACT 03', name: 'مبادئ المحاسبة الإدارية', type: 'إجباري' },
      { id: 'MGT_07', code: 'MGT 07', name: 'مبادئ الإدارة المالية', type: 'إجباري' }
    ],
    skills: [
      { id: 'skill_06', num: '06', name: 'إكسيل محاسبي متقدم (Accounting Excel)', category: 'إكسيل متقدم' },
      { id: 'skill_07', num: '07', name: 'التطبيق العملي للمحاسبة - جزء 1', category: 'تطبيق عملي' },
      { id: 'skill_08', num: '08', name: 'التطبيق العملي للمحاسبة - جزء 2', category: 'تطبيق عملي' },
      { id: 'skill_09', num: '09', name: 'أنظمة تخطيط موارد المؤسسات (ERP: SAP + Oracle + Dynamics 365)', category: 'أنظمة ERP' },
      { id: 'skill_10', num: '10', name: 'أودو محاسبي (Odoo Accounting)', category: 'ERP محاسبي' }
    ],
    certifications: [
      { id: 'cert_03', num: '03', name: 'CMA (Certified Management Accountant) - Part 1', org: 'IMA (أمريكا)', badge: 'محاسبة إدارية' },
      { id: 'cert_04', num: '04', name: 'FMVA (Financial Modeling & Valuation Analyst)', org: 'CFI (كندا)', badge: 'نمذجة مالية' }
    ]
  },
  {
    id: 'year-3',
    yearNum: 3,
    title: 'السنة الثالثة بالمعهد',
    stagePill: 'السنة الثالثة بالمعهد',
    pillColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-500',
    icon: 'fa-scale-balanced',
    courses: [
      { id: 'ACT_05', code: 'ACT 05', name: 'المحاسبة المتوسطة (1)', type: 'إجباري' },
      { id: 'MGT_08', code: 'MGT 08', name: 'مبادئ الاستثمار', type: 'إجباري' },
      { id: 'ACT_07', code: 'ACT 07', name: 'نظم المعلومات المحاسبية', type: 'إجباري' },
      { id: 'ACT_15', code: 'ACT 15', name: 'محاسبة حكومية ومنشآت غير ربحية', type: 'اختياري' }
    ],
    skills: [
      { id: 'skill_11', num: '11', name: 'تدريب: تحليل البيانات بالإكسل (Data Analysis with Excel)', category: 'تحليل بيانات' },
      { id: 'skill_12', num: '12', name: 'تدريب: Power Query & Power Pivot', category: 'أدوات ذكاء أعمال' },
      { id: 'skill_13', num: '13', name: 'تدريب: لغة الاستعلام الهيكلية (SQL)', category: 'قواعد بيانات' }
    ],
    certifications: [
      { id: 'cert_05', num: '05', name: 'CertIFR / DipIFR (معايير المحاسبة الدولية IFRS)', org: 'ACCA (بريطانيا)', badge: 'معايير دولية' },
      { id: 'cert_06', num: '06', name: 'CIA (Certified Internal Auditor)', org: 'IIA (أمريكا)', badge: 'مراجعة داخلية' }
    ]
  },
  {
    id: 'year-4',
    yearNum: 4,
    title: 'السنة الرابعة بالمعهد (سنة التخرج)',
    stagePill: 'السنة الرابعة بالمعهد',
    pillColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'border-amber-500',
    icon: 'fa-crown',
    courses: [
      { id: 'ACT_08', code: 'ACT 08', name: 'المحاسبة الضريبية', type: 'إجباري' },
      { id: 'ACT_09', code: 'ACT 09', name: 'المحاسبة المالية المتقدمة', type: 'إجباري' },
      { id: 'ACT_12', code: 'ACT 12', name: 'محاسبة الشركات الدولية', type: 'اختياري' },
      { id: 'ACT_10', code: 'ACT 10', name: 'المراجعة ومعايير التدقيق', type: 'إجباري' },
      { id: 'ACT_11', code: 'ACT 11', name: 'محاسبة المنشآت المتخصصة', type: 'اختياري' }
    ],
    skills: [
      { id: 'skill_14', num: '14', name: 'الفاتورة والإقرارات الإلكترونية (ETA & ZATCA)', category: 'ضرائب رقمية' },
      { id: 'skill_15', num: '15', name: 'تدريب: النمذجة المالية المتقدمة (Financial Modeling)', category: 'تمويل واستثمار' },
      { id: 'skill_16', num: '16', name: 'هندسة الأوامر وتوظيف الذكاء الاصطناعي (AI & Prompt Engineering)', category: 'ذكاء اصطناعي' }
    ],
    certifications: [
      { id: 'cert_07', num: '07', name: 'CFA (Chartered Financial Analyst) - Level 1', org: 'CFA Institute', badge: 'تحليل مالي' },
      { id: 'cert_08', num: '08', name: 'CPA (Certified Public Accountant)', org: 'AICPA (أمريكا)', badge: 'محاسب قانوني' },
      { id: 'cert_09', num: '09', name: 'ACCA (Chartered Certified Accountant)', org: 'ACCA (بريطانيا)', badge: 'زمالة دولية' }
    ]
  }
]);

// 3. THE 33-COURSE OFFICIAL LANGUAGE CURRICULUM (ZAmericanEnglish)
const LANGUAGE_LEVELS_DATA = Object.freeze([
  {
    id: 'level-1',
    levelNum: 1,
    title: 'المستوى الأول: التأسيس وفك الأمية',
    subtitle: 'من الصفر الأبجدي وبناء الأساس الصوتي والقواعدي المتين',
    pillColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-500',
    icon: 'fa-seedling',
    courses: [
      {
        num: '01',
        id: 'lang_01',
        name: 'كورس الصوتيات تعلم نطق الحروف الانجليزية بشكل صحيح : المستوى الأول',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc'
      },
      {
        num: '02',
        id: 'lang_02',
        name: 'كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين من البداية الى الاحتراف - المستوى الاول',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ'
      },
      {
        num: '03',
        id: 'lang_03',
        name: 'كورس القراءة : المستوى الأول',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmI4PahZ0eyFjcihT7_VAs79'
      },
      {
        num: '04',
        id: 'lang_04',
        name: 'تعلم قواعد اللغة الانجليزية كاملة: شرح قواعد الانجليزي للمبتدئين : المستوى الأول',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr'
      },
      {
        num: '05',
        id: 'lang_05',
        name: 'كورس الاستماع - تقوية مهارة الاستماع - المستوى الاول',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ'
      },
      {
        num: '06',
        id: 'lang_06',
        name: 'كورس المحادثة تعلم اللغة الانجليزية - كورس - المستوى الاول',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKp2aC7PI7K0POsf812xLBN'
      },
      {
        num: '07',
        id: 'lang_07',
        name: 'كورس الكتابة : المستوى الأول : تعلم كتابة موضوع تعبير باللغة الانجليزية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmL_FPWuMEJQ7_thNjF7JS0Y'
      }
    ]
  },
  {
    id: 'level-2',
    levelNum: 2,
    title: 'المستوى الثاني: كسر حاجز الأزمنة وفهم اللهجات',
    subtitle: 'التمكن من كافة الأزمنة، التفكير بالإنجليزية، وفهم المتحدثين الأصليين',
    pillColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderColor: 'border-blue-500',
    icon: 'fa-book-open',
    courses: [
      {
        num: '08',
        id: 'lang_08',
        name: 'قواعد اللغة الانجليزية و شرح الازمنة - المستوى - الجميع',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLebd3vD0_WfIteVUlSA44G'
      },
      {
        num: '09',
        id: 'lang_09',
        name: 'شرح قواعد اللغة الانجليزية كاملة: تعلم قواعد الانجليزي للمبتدئين : المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLrOU3QTrnsogoRZGFmHnGk'
      },
      {
        num: '10',
        id: 'lang_10',
        name: 'شرح الصوتيات البريطانية والامريكية وتحسين النطق - المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIlFAg2fuo--xVxScz9_6h2'
      },
      {
        num: '11',
        id: 'lang_11',
        name: 'كيف تنطق الكلمات الإنجليزية بشكل صحيح',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLo5pyYSib-I69t2ktZjqcQ'
      },
      {
        num: '12',
        id: 'lang_12',
        name: 'كورس تقوية مهارة الاستماع وفهم اللهجات - المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLmnv85IWWhNL4PtzcqC5mS'
      },
      {
        num: '13',
        id: 'lang_13',
        name: 'المحادثات اليومية باللغة الانجليزية : تعلم المحادثة الانجليزية الامريكية المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmJl_sWnCTwL1yNFhq0AM7yk'
      },
      {
        num: '14',
        id: 'lang_14',
        name: 'تعلم التفكير باللغة الانجليزية - اهم الكلمات والمصطلحات المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIsGY5eUPt67tnd2ZBfQpIw'
      },
      {
        num: '15',
        id: 'lang_15',
        name: 'تعلم اللغة الانجليزية كما يتعلمها الغرب - المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIgc6vCBbX4aLOiQ6oCoyvN'
      },
      {
        num: '16',
        id: 'lang_16',
        name: 'سلسلة English Bits دروس تعليم اللغة الانجليزية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKFJFUO3JHaIAh7_Yq7Ka1_'
      },
      {
        num: '17',
        id: 'lang_17',
        name: 'تعلم اللغة الانجليزية من خلال قصة - المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmJV4nIwcfSzQpG0jkqn1jci'
      },
      {
        num: '18',
        id: 'lang_18',
        name: 'نشرة اخبار انجليزية مترجمة : كورس الاخبار - المستوى الثاني',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIZtXNNriSBxmSeCK7juwS_'
      }
    ]
  },
  {
    id: 'level-3',
    levelNum: 3,
    title: 'المستوى الثالث: الطلاقة ولغة الشارع والانغماس التام',
    subtitle: 'إتقان اللهجة الأمريكية، التعبيرات الاصطلاحية، وفهم الأدب والروايات',
    pillColor: 'bg-purple-100 text-purple-800 border-purple-200',
    borderColor: 'border-purple-500',
    icon: 'fa-comments',
    courses: [
      {
        num: '19',
        id: 'lang_19',
        name: 'الإنجليزية في قصة كرتونية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLp7sQVkZ_yHyZHQOXlZvOt'
      },
      {
        num: '20',
        id: 'lang_20',
        name: 'تعلم من خلال القصص - المستوى الثالث',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKw-mErNjoEWnyic9U7k_NM'
      },
      {
        num: '21',
        id: 'lang_21',
        name: 'كورس Phrase it up لتعلم المصطلحات والتعبيرات اليومية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmJPNgoOumAWL1Hmsq_e6uUj'
      },
      {
        num: '22',
        id: 'lang_22',
        name: 'سلسلة I Know لتعلم أسرار وقواعد المحادثة الإنجليزية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKTVrmFxV2EYpzzPaFs0M9F'
      },
      {
        num: '23',
        id: 'lang_23',
        name: 'كورس إتقان اللهجة الأمريكية (American Accent)',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIPxfMzIpbB766dcSrbdCug'
      },
      {
        num: '24',
        id: 'lang_24',
        name: 'كورس كلام أمريكاني لتعلم المحادثات ولغة الشارع',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmLS0lJv05C0jDG3B7kO2uo7'
      },
      {
        num: '25',
        id: 'lang_25',
        name: 'كورس Slango للمصطلحات العامية ولغة الشارع الأمريكية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKsvZbvnVJo-oF4fJKVyUeV'
      },
      {
        num: '26',
        id: 'lang_26',
        name: 'سلسلة Ask Joe للإجابة على أصعب الأسئلة اللغوية المحيرة',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmK1a3vHEw_bL_TclQUwpZsS'
      },
      {
        num: '27',
        id: 'lang_27',
        name: 'كورس القواعد شرح انجليزي المستوى 3 (English Grammar in English)',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmJSejQkuui_SrYWObQW7pWt'
      },
      {
        num: '28',
        id: 'lang_28',
        name: 'تعلم اللغة الإنجليزية من خلال روايات أمريكية: wordsmith',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKcPVkKIQ1fj4TBhFSkQ40C'
      },
      {
        num: '29',
        id: 'lang_29',
        name: 'دودة الكتب Bookworm: نادي القراءة والروايات بالإنجليزية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmIsCOWJ0D8lXBsbKfcyc3So'
      },
      {
        num: '30',
        id: 'lang_30',
        name: 'كورس القراءة المستوي الرابع وتحليل النصوص المتقدمة',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmKzTfbSx_nm0oCFSQ9-IpgL'
      }
    ]
  },
  {
    id: 'level-4',
    levelNum: 4,
    title: 'المستوى الرابع: الاحتراف المهني والاعتماد الدولي',
    subtitle: 'الترجمة الاحترافية والتجارية وتأهيل الآيلتس لاقتحام كبرى الشركات والمنح الدولية',
    pillColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'border-amber-500',
    icon: 'fa-graduation-cap',
    courses: [
      {
        num: '31',
        id: 'lang_31',
        name: 'كورس الترجمة العامة وتطبيقاتها العملية',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmISOyAhaSfLqrwDSpN6GDpG'
      },
      {
        num: '32',
        id: 'lang_32',
        name: 'كورس الترجمة الإنجليزية الإحترافية والتجارية المتقدمة',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmJfGUFUJUR2IQlv8oI735hE'
      },
      {
        num: '33',
        id: 'lang_33',
        name: 'كورس ايلتس الاحترافي IELTS Preparation Course',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLp22-4PivYmL2wmHCHXvbbZWcQaTXIBTV'
      }
    ]
  }
]);

if (typeof window !== 'undefined') {
  window.weeksData = weeksData;
  window.programmingCoursesData = programmingCoursesData;
  window.ROADMAP_YEARS_DATA = ROADMAP_YEARS_DATA;
  window.LANGUAGE_LEVELS_DATA = LANGUAGE_LEVELS_DATA;
}
