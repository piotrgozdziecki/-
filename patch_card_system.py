import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update HTML for levelup-screen
old_html = """  <!-- LEVEL UP SCREEN -->
  <div id="levelup-screen" class="screen-overlay">
    <div class="card-modal" style="border-color: #38bdf8;">
      <h1 style="color: #38bdf8;">⭐ AWANS ZAWODOWY!</h1>
      <p>Wybierz ulepszenie magazynowe wózka:</p>
      <div id="upgrade-container" class="upgrade-list"></div>
    </div>
  </div>"""

new_html = """  <!-- LEVEL UP SCREEN -->
  <div id="levelup-screen" class="screen-overlay" style="display: none;">
    <div class="card-modal levelup-modal-container">
      <div class="card-modal-header">
        <h1 class="levelup-modal-title">⭐ AWANS ZAWODOWY!</h1>
        <p class="levelup-modal-subtitle">Wybierz kartę ulepszenia magazynowego wózka:</p>
      </div>
      <div id="upgrade-container" class="upgrade-list"></div>
      <div class="card-action-bar">
        <button id="btn-reroll-cards" class="btn-card-action btn-reroll" onclick="rerollLevelUpCards()">🔄 PRZELOSUJ (<span id="reroll-count">2</span>)</button>
        <button id="btn-skip-card" class="btn-card-action btn-skip" onclick="skipLevelUpCard()">⏩ POMIŃ (+50💰)</button>
      </div>
    </div>
  </div>"""

if old_html in text:
    text = text.replace(old_html, new_html)
    print("Replaced levelup-screen HTML.")
else:
    print("Warning: old_html not found exactly, doing regex replace.")
    text = re.sub(
        r'<div id="levelup-screen".*?</div>\s*</div>',
        new_html,
        text,
        flags=re.DOTALL
    )

# 2. Add CSS for Level-Up Card System
card_system_css = """
/* Enhanced Level-Up Card System Styling */
.levelup-modal-container {
  border-color: #38bdf8 !important;
  max-width: 520px;
  width: 92%;
  background: rgba(15, 23, 42, 0.98) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.95), 0 0 20px rgba(56, 189, 248, 0.3) !important;
  padding: 18px !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.levelup-modal-title {
  color: #38bdf8;
  font-size: 22px;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
  letter-spacing: 0.5px;
}

.levelup-modal-subtitle {
  color: #cbd5e1;
  font-size: 13px;
  margin: 4px 0 0 0;
}

.upgrade-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 58vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 4px;
}

.upgrade-card {
  position: relative;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.99));
  border: 2px solid #38bdf8;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15);
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s, box-shadow 0.2s;
  animation: cardSlideIn 0.3s ease-out forwards;
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(15px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.upgrade-card:hover, .upgrade-card:active {
  transform: translateY(-2px) scale(1.02);
  border-color: #7dd3fc;
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

.upgrade-card.is-weapon {
  border-color: #38bdf8;
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.35), rgba(15, 23, 42, 0.98));
}

.upgrade-card.is-passive {
  border-color: #22c55e;
  background: linear-gradient(135deg, rgba(21, 128, 61, 0.35), rgba(15, 23, 42, 0.98));
}

.upgrade-card.is-passive:hover {
  border-color: #4ade80;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
}

.upgrade-card.is-evolution {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(180, 83, 9, 0.6), rgba(30, 58, 138, 0.95));
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), inset 0 1px 2px rgba(254, 240, 138, 0.4);
  animation: cardSlideIn 0.3s ease-out forwards, pulseGoldBorder 1.2s infinite alternate;
}

@keyframes pulseGoldBorder {
  0% { border-color: #f59e0b; box-shadow: 0 0 15px rgba(245, 158, 11, 0.5); }
  100% { border-color: #fde047; box-shadow: 0 0 30px rgba(250, 204, 21, 0.8); }
}

.upgrade-card.is-bonus {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(185, 28, 28, 0.35), rgba(15, 23, 42, 0.98));
}

.card-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
}

.card-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9));
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-header-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}

.card-badge {
  font-size: 9px;
  font-weight: 900;
  padding: 2px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-weapon { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.5); }
.badge-passive { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.5); }
.badge-evo { background: rgba(245, 158, 11, 0.3); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.8); }
.badge-bonus { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.5); }

.card-title {
  font-weight: 900;
  font-size: 14.5px;
  color: #f8fafc;
  letter-spacing: 0.3px;
}

.card-stars {
  font-size: 11px;
  color: #facc15;
  letter-spacing: 1px;
}

.card-level-tag {
  font-size: 10.5px;
  font-weight: 800;
  color: #facc15;
  background: rgba(0,0,0,0.5);
  padding: 1px 5px;
  border-radius: 4px;
}

.card-desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.3;
  font-weight: 500;
}

.card-stat-boost {
  font-size: 11px;
  font-weight: 700;
  margin-top: 1px;
}

.card-action-bar {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.btn-card-action {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}

.btn-reroll {
  background: linear-gradient(135deg, #1e293b, #334155);
  color: #38bdf8;
  border: 1.5px solid #38bdf8;
}

.btn-reroll:hover {
  background: #334155;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.btn-reroll:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #64748b;
  color: #64748b;
}

.btn-skip {
  background: linear-gradient(135deg, #27272a, #3f3f46);
  color: #facc15;
  border: 1.5px solid #eab308;
}

.btn-skip:hover {
  background: #3f3f46;
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.4);
}
"""

text = text.replace("</style>", card_system_css + "\n</style>")

# 3. Add rerolls init in startGamePlay()
text = text.replace(
    "player.detentionCooldown = 0;",
    "player.detentionCooldown = 0;\n  player.rerolls = selectedCharKey === 'klaus' ? 4 : 2;"
)

# 4. Replace triggerLevelUpModal, closeLevelUp, applyEvolution, applyUpgrade with new implementation
new_js = """function triggerLevelUpModal(isReroll = false) {
  gameState = STATE.LEVELUP;
  const container = document.getElementById('upgrade-container');
  container.innerHTML = '';

  if (typeof player.rerolls === 'undefined') {
    player.rerolls = selectedCharKey === 'klaus' ? 4 : 2;
  }

  const rerollBtn = document.getElementById('btn-reroll-cards');
  const rerollCountEl = document.getElementById('reroll-count');
  if (rerollCountEl) rerollCountEl.innerText = player.rerolls;
  if (rerollBtn) {
    if (player.rerolls > 0) {
      rerollBtn.disabled = false;
      rerollBtn.innerHTML = `🔄 PRZELOSUJ (${player.rerolls})`;
    } else {
      rerollBtn.disabled = true;
      rerollBtn.innerHTML = `🔄 BRAK REROLLI`;
    }
  }

  const options = [];

  // 1. Check possible Weapon Evolutions
  Object.keys(EVOLUTIONS).forEach(evoKey => {
    const evo = EVOLUTIONS[evoKey];
    const w = weapons[evo.reqWeapon];
    const p = passives[evo.reqPassive];
    if (w && w.level >= 5 && p && p.level >= 1 && !w.isEvo) {
      options.push({ type: 'evolution', evo: evo });
    }
  });

  // Count active weapons and passives
  let activeWeaponsCount = 0;
  Object.keys(weapons).forEach(k => { if (weapons[k].level > 0) activeWeaponsCount++; });
  let activePassivesCount = 0;
  Object.keys(passives).forEach(k => { if (passives[k].level > 0) activePassivesCount++; });

  // 2. Build list of regular weapon & passive upgrades
  const regularCards = [];

  const weaponDataList = [
    { id: 'scanner', name: 'Skaner Kodów Kreskowych', icon: '🔦', desc: 'Promień laserowy w najbliższego wroga.', stat: '+12 Obrażeń | Promień laserowy' },
    { id: 'toiletPaper', name: 'Pistolet na Taśmę "Pakowa"', icon: '🧻', desc: 'Wystrzeliwuje lepkie taśmy niszczące wrogów.', stat: '+2 Pociski taśmowe | +12 Obrażeń' },
    { id: 'stretchAura', name: 'Aura z Folii Stretch', icon: '🌀', desc: 'Wirujące rolki folii tnące wrogów.', stat: '+1 Rolka folii | Wzmocniony promień tnący' },
    { id: 'pallets', name: 'Ręczny Paleciak', icon: '🪵', desc: 'Taran odpychający wrogów przed graczem.', stat: '+15 Obrażeń taranowania | Odpychanie' },
    { id: 'extinguisher', name: 'Gaśnica Proszkowa PPOŻ', icon: '🧯', desc: 'Stożek zamrażający/spowalniający.', stat: 'Większy stożek zamrażający | -10% Cooldown' },
    { id: 'zipTies', name: 'Trytytki Samozaciskowe', icon: '🔗', desc: 'Wystrzeliwuje taśmy blokujące wrogów.', stat: '+1 Taśma blokująca | Dłuższe spowolnienie' },
    { id: 'cutter', name: 'Nóż do Tapet (Gilotyna)', icon: '🔪', desc: 'Przecina wrogów na pół, przenikając ich.', stat: '+1 Przebicie wrogów | +12 Obrażeń' },
    { id: 'stapler', name: 'Zszywacz Pneumatyczny', icon: '📌', desc: 'Szybka seria stalowych zszywek magazynowych.', stat: '+2 Stalowe zszywki | Szybszy wystrzał' },
    { id: 'sledgehammer', name: 'Młot Konserwatora BHP', icon: '🔨', desc: 'Uderzenie o posadzkę niszczące wrogów 360°.', stat: '+20 Obrażeń obszarowych | Fala uderzeniowa' },
    { id: 'faktura', name: 'Faktura Korygująca', icon: '📄', desc: 'Latające papiery tnące wrogów.', stat: '+1 Faktura | Większa prędkość rotacji' },
    { id: 'kawa', name: 'Toksyczna Kawa z Automatu', icon: '☕', desc: 'Rozlewa wrzący kwas (kawę) dookoła.', stat: 'Większa plama kaustyczna | +10 Obrażeń' },
    { id: 'hydrant', name: 'Hydrant Magazynowy PPOŻ', icon: '🚰', desc: 'Wstrzeliwuje silne strumienie wody odpychające wrogów.', stat: '+1 Strumień wody | Silniejsze odepchnięcie' },
    { id: 'megafon', name: 'Megafon Kierownika Hali', icon: '📢', desc: 'Fala dźwiękowa "DO ROBOTY!" ogłuszająca wrogów.', stat: '+15% Zasięgu ogłuszenia | Szybsza syrena' }
  ];

  weaponDataList.forEach(w => {
    const obj = weapons[w.id];
    if (obj && obj.level < 5 && !obj.isEvo) {
      if (obj.level > 0 || activeWeaponsCount < 6) {
        regularCards.push({ cat: 'weapon', ...w });
      }
    }
  });

  Object.keys(passives).forEach(k => {
    const p = passives[k];
    const maxLvl = p.max || 3;
    if (p.level < maxLvl) {
      if (p.level > 0 || activePassivesCount < 6) {
        regularCards.push({
          cat: 'passive',
          id: k,
          name: p.name,
          icon: p.icon,
          desc: p.desc,
          stat: `Wzmocnienie Poziomu ${p.level + 1} z ${maxLvl}`
        });
      }
    }
  });

  regularCards.sort(() => 0.5 - Math.random());

  const maxChoices = selectedCharKey === 'klaus' ? 4 : 3;

  regularCards.forEach(c => {
    if (options.length < maxChoices) options.push(c);
  });

  if (options.length === 0) {
    options.push({
      type: 'bonus',
      id: 'bateria_naprawa',
      name: '⚡ Bateria Ogniwo Litowe',
      icon: '🔋',
      desc: 'Pełna regeneracja baterii wózka oraz premia +150 DTA.',
      stat: '+100% Baterii | +150 Monet DTA'
    });
    options.push({
      type: 'bonus',
      id: 'kawa_premia',
      name: '☕ Podwójne Espresso z Automatu',
      icon: '☕',
      desc: 'Natychmiastowy reset umiejętności specjalnej i +500 pkt.',
      stat: 'Reset Skill CD | +500 Pkt'
    });
  }

  options.slice(0, maxChoices).forEach((opt, idx) => {
    const card = document.createElement('div');
    card.style.animationDelay = (idx * 0.08) + 's';

    if (opt.type === 'evolution') {
      card.className = 'upgrade-card is-evolution';
      card.innerHTML = `
        <div class="card-icon-wrapper" style="border-color: #f59e0b;">
          <div class="card-icon">${opt.evo.icon}</div>
        </div>
        <div class="card-info">
          <div class="card-header-line">
            <span class="card-badge badge-evo">⚡ SUPREME EWOLUCJA</span>
            <span class="card-level-tag" style="color:#fde047;">★ EWOLUCJA</span>
          </div>
          <div class="card-title">${opt.evo.name}</div>
          <div class="card-desc">${opt.evo.desc}</div>
        </div>
      `;
      card.onclick = () => { applyEvolution(opt.evo); closeLevelUp(); };
    } else if (opt.type === 'bonus') {
      card.className = 'upgrade-card is-bonus';
      card.innerHTML = `
        <div class="card-icon-wrapper" style="border-color: #ef4444;">
          <div class="card-icon">${opt.icon}</div>
        </div>
        <div class="card-info">
          <div class="card-header-line">
            <span class="card-badge badge-bonus">🎁 BONUS ZMIANY</span>
            <span class="card-level-tag">REGENERACJA</span>
          </div>
          <div class="card-title">${opt.name}</div>
          <div class="card-desc">${opt.desc}</div>
          <div class="card-stat-boost" style="color:#fca5a5;">${opt.stat}</div>
        </div>
      `;
      card.onclick = () => { applyBonusUpgrade(opt); closeLevelUp(); };
    } else {
      const isWeapon = opt.cat === 'weapon';
      card.className = 'upgrade-card ' + (isWeapon ? 'is-weapon' : 'is-passive');
      let lvl = isWeapon ? weapons[opt.id].level : passives[opt.id].level;
      let maxLvl = isWeapon ? 5 : (passives[opt.id] ? passives[opt.id].max || 3 : 3);
      
      let stars = '';
      for (let s = 1; s <= maxLvl; s++) {
        stars += (s <= lvl + 1) ? '★' : '☆';
      }

      let badgeClass = isWeapon ? 'badge-weapon' : 'badge-passive';
      let badgeLabel = isWeapon ? '⚔️ BROŃ MAGNA' : '🛡️ PERK BHP';
      let levelLabel = lvl === 0 ? 'NOWOŚĆ!' : `POZ. ${lvl} → ${lvl + 1}`;

      card.innerHTML = `
        <div class="card-icon-wrapper" style="border-color: ${isWeapon ? '#38bdf8' : '#22c55e'};">
          <div class="card-icon">${opt.icon}</div>
        </div>
        <div class="card-info">
          <div class="card-header-line">
            <span class="card-badge ${badgeClass}">${badgeLabel}</span>
            <span class="card-stars">${stars}</span>
            <span class="card-level-tag">${levelLabel}</span>
          </div>
          <div class="card-title">${opt.name}</div>
          <div class="card-desc">${opt.desc}</div>
          ${opt.stat ? `<div class="card-stat-boost" style="color: ${isWeapon ? '#38bdf8' : '#4ade80'};">${opt.stat}</div>` : ''}
        </div>
      `;
      card.onclick = () => { applyUpgrade(opt); closeLevelUp(); };
    }

    container.appendChild(card);
  });

  document.getElementById('levelup-screen').style.display = 'flex';
}

function rerollLevelUpCards() {
  if (player.rerolls > 0) {
    player.rerolls--;
    sounds.beep();
    triggerLevelUpModal(true);
  }
}

function skipLevelUpCard() {
  sounds.achieve();
  dtaCoins += 50;
  saveWorkshopData();
  player.battery = Math.min(player.maxBattery, player.battery + 20);
  addSpeechBubble(player.x, player.y - 30, '+50💰 BONUS ZA BRAK ULEPSZENIA!', '#facc15');
  closeLevelUp();
}

function applyBonusUpgrade(opt) {
  sounds.achieve();
  if (opt.id === 'bateria_naprawa') {
    player.battery = player.maxBattery;
    dtaCoins += 150;
    saveWorkshopData();
    addSpeechBubble(player.x, player.y - 30, '⚡ PEŁNA BATERIA +150 DTA!', '#facc15');
  } else if (opt.id === 'kawa_premia') {
    player.skillCooldown = 0;
    score += 500;
    addSpeechBubble(player.x, player.y - 30, '☕ RESET SKILL +500 PKT!', '#38bdf8');
  }
}

function closeLevelUp() {
  document.getElementById('levelup-screen').style.display = 'none';
  gameState = STATE.PLAYING;
  updateWeaponsHud();
}

function applyEvolution(evo) {
  sounds.evoSound();
  screenShake = 12;
  createSparks(player.x, player.y, 40, '#f59e0b');
  triggerAchievement('weapon_evolution', 'Ewolucja Magazynowa', '💥');
  if (evo.id === 'bramkaRFID') {
    weapons.scanner.isEvo = true;
    weapons.scanner.damage = 100;
  } else if (evo.id === 'owijarka') {
    weapons.toiletPaper.isEvo = true;
    weapons.toiletPaper.damage = 60;
  } else if (evo.id === 'btHighStack') {
    weapons.pallets.isEvo = true;
    weapons.pallets.damage = 90;
    weapons.pallets.cooldown = 0.5;
  } else if (evo.id === 'zraszacz') {
    weapons.extinguisher.isEvo = true;
    weapons.extinguisher.damage = 150;
    weapons.extinguisher.timer = 0;
    weapons.extinguisher.cooldown = 10.0;
  } else if (evo.id === 'steelTies') {
    weapons.zipTies.isEvo = true;
    weapons.zipTies.damage = 60;
    weapons.zipTies.cooldown = 0.8;
  } else if (evo.id === 'machete') {
    weapons.cutter.isEvo = true;
    weapons.cutter.damage = 45;
    weapons.cutter.cooldown = 0.35;
  } else if (evo.id === 'staplerGun') {
    weapons.stapler.isEvo = true;
    weapons.stapler.damage = 70;
    weapons.stapler.cooldown = 0.45;
    weapons.stapler.count = 6;
  } else if (evo.id === 'hydraulicHammer') {
    weapons.sledgehammer.isEvo = true;
    weapons.sledgehammer.damage = 180;
    weapons.sledgehammer.cooldown = 1.6;
    weapons.sledgehammer.radius = 240;
  } else if (evo.id === 'urzadSkarbowy') {
    weapons.faktura.isEvo = true;
    weapons.faktura.damage = 120;
    weapons.faktura.cooldown = 1.2;
    weapons.faktura.speed = 600;
  } else if (evo.id === 'redbull') {
    weapons.kawa.isEvo = true;
    weapons.kawa.damage = 60;
    weapons.kawa.cooldown = 1.5;
    player.speed += 30;
  }
}

function applyUpgrade(opt) {
  sounds.xp();
  createSparks(player.x, player.y, 25, opt.cat === 'weapon' ? '#38bdf8' : '#4ade80');
  if (opt.cat === 'weapon') {
    const w = weapons[opt.id];
    w.level++;
    w.damage += 12;
    w.cooldown = Math.max(0.3, w.cooldown * 0.9);
    if (opt.id === 'toiletPaper') w.count = Math.min(6, 2 + Math.floor(w.level / 2));
    if (opt.id === 'stapler') w.count = Math.min(8, 3 + Math.floor(w.level));
  } else if (opt.cat === 'passive') {
    const p = passives[opt.id];
    p.level++;
    if (opt.id === 'magnet') player.magnetRange += 75;
    if (opt.id === 'forks') player.critChance += 0.12;
    if (opt.id === 'coffee') { player.speed += 18; player.maxSkillCooldown = Math.max(3.5, player.maxSkillCooldown - 1.0); }
    if (opt.id === 'battery') { player.maxBattery += 35; player.battery = Math.min(player.maxBattery, player.battery + 40); }
    if (opt.id === 'furia') player.attackSpeedMult = (player.attackSpeedMult || 1.0) + 0.25;
    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }
    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;
    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }
    if (opt.id === 'paczek') { player.critChance += 0.20; player.foodDropBoost = (player.foodDropBoost || 0) + 0.25; }
    if (opt.id === 'kamizelka') { player.damageReduction = (player.damageReduction || 0) + 0.25; }
    if (opt.id === 'umowa') { player.xpBonusMult = (player.xpBonusMult || 1.0) + 0.25; }
  }
}"""

pos_js_start = text.find('function triggerLevelUpModal()')
pos_js_end = text.find('function updateWeaponsHud()')

if pos_js_start != -1 and pos_js_end != -1:
    text = text[:pos_js_start] + new_js + "\n\n" + text[pos_js_end:]
    print("Replaced JS functions for Card System successfully.")
else:
    print("ERROR: Could not find JS bounds for triggerLevelUpModal to updateWeaponsHud!")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved updated game.html with new Card System!")
