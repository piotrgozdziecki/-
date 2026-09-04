const fs = require('fs');
let content = fs.readFileSync('app/src/main/assets/game.html', 'utf8');

// Add new weapons
content = content.replace(
  "sledgehammer: { level: 0, timer: 0, cooldown: 2.4, damage: 95, radius: 150, icon: '🔨', isEvo: false }",
  "sledgehammer: { level: 0, timer: 0, cooldown: 2.4, damage: 95, radius: 150, icon: '🔨', isEvo: false },\n  faktura: { level: 0, timer: 0, cooldown: 1.8, damage: 60, speed: 450, icon: '📄', isEvo: false },\n  kawa: { level: 0, timer: 0, cooldown: 3.0, damage: 15, radius: 120, icon: '☕', isEvo: false }"
);

// Add new passives
content = content.replace(
  "battery: { level: 0, max: 3, name: 'Super Bateria', icon: '🔋', desc: '+35% pojemności baterii (+Cooldown Szybkość)' }",
  "battery: { level: 0, max: 3, name: 'Super Bateria', icon: '🔋', desc: '+35% pojemności baterii (+Cooldown Szybkość)' },\n  furia: { level: 0, max: 3, name: 'Furia Magazyniera', icon: '🤬', desc: '+25% Szybkości Ataku' },\n  alkomat: { level: 0, max: 3, name: 'Unik przed Alkomatem', icon: '🍺', desc: '+15% szans na Unik' }"
);

// Add to regular cards
content = content.replace(
  "{ id: 'sledgehammer', name: 'Młot Konserwatora BHP', icon: '🔨', desc: 'Uderzenie o posadzkę niszczące wrogów 360°.', cat: 'weapon' },",
  "{ id: 'sledgehammer', name: 'Młot Konserwatora BHP', icon: '🔨', desc: 'Uderzenie o posadzkę niszczące wrogów 360°.', cat: 'weapon' },\n    { id: 'faktura', name: 'Faktura Korygująca', icon: '📄', desc: 'Latające papiery tnące wrogów.', cat: 'weapon' },\n    { id: 'kawa', name: 'Toksyczna Kawa z Automatu', icon: '☕', desc: 'Rozlewa wrzący kwas (kawę) dookoła.', cat: 'weapon' },"
);
content = content.replace(
  "{ id: 'battery', name: 'Super Bateria', icon: '🔋', desc: '+35% POJ. Baterii (krótszy Cooldown)', cat: 'passive' }",
  "{ id: 'battery', name: 'Super Bateria', icon: '🔋', desc: '+35% POJ. Baterii (krótszy Cooldown)', cat: 'passive' },\n    { id: 'furia', name: 'Furia Magazyniera', icon: '🤬', desc: '+25% Szybkości Ataku', cat: 'passive' },\n    { id: 'alkomat', name: 'Unik przed Alkomatem', icon: '🍺', desc: '+15% Szans na Unik (obrażenia = 0)', cat: 'passive' }"
);

fs.writeFileSync('app/src/main/assets/game.html', content);
