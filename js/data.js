/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - OFFICIAL UNIVERSITY SYLLABUS & 12 PROGRAMMING TRACKS
 * =========================================================================
 */

// Weeks data cleared - Ready to receive real lectures when the semester starts
const weeksData = [];

const programmingCoursesData = [
  {
    "id": "cs50",
    "title": "كورس CS50",
    "icon": "fa-laptop-code",
    "color": "indigo"
  },
  {
    "id": "html_intro",
    "title": "كورس HTML - شرح أول مرة",
    "icon": "fa-code",
    "color": "orange"
  },
  {
    "id": "html_review",
    "title": "كورس HTML - مراجعة وتطوير",
    "icon": "fa-wrench",
    "color": "amber"
  },
  {
    "id": "css_intro",
    "title": "كورس CSS - شرح أول مرة",
    "icon": "fa-palette",
    "color": "blue"
  },
  {
    "id": "css_review",
    "title": "كورس CSS - مراجعة وتطوير",
    "icon": "fa-wand-magic-sparkles",
    "color": "sky"
  },
  {
    "id": "js_intro",
    "title": "كورس JavaScript - شرح أول مرة",
    "icon": "fa-bolt",
    "color": "yellow"
  },
  {
    "id": "js_review",
    "title": "كورس JavaScript - مراجعة وتطوير",
    "icon": "fa-gears",
    "color": "amber"
  },
  {
    "id": "python_intro",
    "title": "كورس بايثون (Python) - شرح أول مرة",
    "icon": "fa-terminal",
    "color": "emerald"
  },
  {
    "id": "python_review",
    "title": "كورس بايثون (Python) - مراجعة وتطوير",
    "icon": "fa-microchip",
    "color": "teal"
  },
  {
    "id": "bootstrap",
    "title": "كورس بوت ستراب (Bootstrap)",
    "icon": "fa-cubes",
    "color": "purple"
  },
  {
    "id": "ai",
    "title": "كورس ذكاء اصطناعي",
    "icon": "fa-brain",
    "color": "rose"
  },
  {
    "id": "projects_lab",
    "title": "كورس بناء المشاريع والتجريب العملي",
    "icon": "fa-rocket",
    "color": "emerald"
  }
];

if (typeof window !== 'undefined') {
  window.weeksData = weeksData;
  window.programmingCoursesData = programmingCoursesData;
}
