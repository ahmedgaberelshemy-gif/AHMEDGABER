/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - PARTS SYNC & BUILDER (parts/*.html -> parts-data.js)
 * =========================================================================
 */
const fs = require('fs');
const path = require('path');

function syncParts() {
  const partsDir = path.join(__dirname, 'parts');

  const header = fs.readFileSync(path.join(partsDir, 'header.html'), 'utf8').trim();
  const navigation = fs.readFileSync(path.join(partsDir, 'navigation.html'), 'utf8').trim();
  const sectionRoutine = fs.readFileSync(path.join(partsDir, 'section-routine.html'), 'utf8').trim();
  const sectionCurriculum = fs.readFileSync(path.join(partsDir, 'section-curriculum.html'), 'utf8').trim();
  const sectionAchievements = fs.readFileSync(path.join(partsDir, 'section-achievements.html'), 'utf8').trim();
  const sectionProgramming = fs.readFileSync(path.join(partsDir, 'section-programming.html'), 'utf8').trim();
  const modals = fs.readFileSync(path.join(partsDir, 'modals.html'), 'utf8').trim();
  const footer = fs.readFileSync(path.join(partsDir, 'footer.html'), 'utf8').trim();

  const partsDataJs = `/**
 * =========================================================================
 * JANAKLIS ACADEMIC OS - MODULAR PARTS LOADER & TEMPLATES
 * Auto-generated from files in parts/ directory
 * =========================================================================
 */

const PARTS_DATA = Object.freeze({
  header: ${JSON.stringify(header)},
  navigation: ${JSON.stringify(navigation)},
  sectionRoutine: ${JSON.stringify(sectionRoutine)},
  sectionCurriculum: ${JSON.stringify(sectionCurriculum)},
  sectionAchievements: ${JSON.stringify(sectionAchievements)},
  sectionProgramming: ${JSON.stringify(sectionProgramming)},
  modals: ${JSON.stringify(modals)},
  footer: ${JSON.stringify(footer)}
});

class PartsLoader {
  static mountAll() {
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    setHtml('part-header', PARTS_DATA.header);
    setHtml('part-navigation', PARTS_DATA.navigation);
    setHtml('part-main-workspace', PARTS_DATA.sectionRoutine + '\\n' + PARTS_DATA.sectionCurriculum + '\\n' + PARTS_DATA.sectionAchievements + '\\n' + PARTS_DATA.sectionProgramming);
    setHtml('part-modals', PARTS_DATA.modals);
    setHtml('part-footer', PARTS_DATA.footer);
  }
}

// Auto-mount immediately
if (typeof document !== 'undefined') {
  PartsLoader.mountAll();
}
`;

  fs.writeFileSync(path.join(partsDir, 'parts-data.js'), partsDataJs, 'utf8');
  console.log('✅ All parts synchronized successfully into parts/parts-data.js!');
}

syncParts();
