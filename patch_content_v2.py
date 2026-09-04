import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add new weapons to `weapons` object
weapons_patch = """  faktura: { level: 0, timer: 0, cooldown: 1.8, damage: 60, speed: 450, icon: '📄', isEvo: false },
  kawa: { level: 0, timer: 0, cooldown: 3.0, damage: 15, radius: 120, icon: '☕', isEvo: false },
  hydrant: { level: 0, timer: 0, cooldown: 1.6, damage: 65, range: 400, icon: '🚰', isEvo: false },
  megafon: { level: 0, timer: 0, cooldown: 2.1, damage: 40, range: 250, icon: '📢', isEvo: false }
};"""
content = re.sub(r'  faktura: \{ level: 0, timer: 0, cooldown: 1\.8, damage: 60, speed: 450, icon: \'📄\', isEvo: false \},\s*kawa: \{ level: 0, timer: 0, cooldown: 3\.0, damage: 15, radius: 120, icon: \'☕\', isEvo: false \}\s*\};', weapons_patch, content)

# 2. Add new passives to `passives` object
passives_patch = """  karta_multisport: { level: 0, max: 3, name: 'Karta Multisport', icon: '💳', desc: 'Szybsza regeneracja wózka i prędkość +10' },
  paczek: { level: 0, max: 3, name: 'Pączek z Biedronki', icon: '🍩', desc: '+20% Szans na Krytyk i +25% dropu jedzenia/kawy' },
  kamizelka: { level: 0, max: 3, name: 'Kamizelka Odblaskowa', icon: '🦺', desc: '-25% Otrzymywanych Obrażeń i oślepianie wrogów' },
  umowa: { level: 0, max: 3, name: 'Umowa Czas Nieokreślony', icon: '📜', desc: '+25% XP i 1x Ochrona przed Śmiercią (Extra Life!)' }
};"""
content = re.sub(r'  karta_multisport: \{ level: 0, max: 3, name: \'Karta Multisport\', icon: \'💳\', desc: \'Szybsza regeneracja wózka i prędkość \+10\' \}\s*\};', passives_patch, content)

# 3. Add new Evolutions to `EVOLUTIONS` object
evolutions_patch = """  redbull: {
    id: 'redbull', name: '⚡ Napój Energetyczny DTA 250ml', icon: '🥫', reqWeapon: 'kawa', reqPassive: 'furia',
    desc: 'Ekstremalna kofeina! Prędkość ruchu i ataku rośnie o +100%, zadając stałe obrażenia kwasowe.'
  },
  bubbleWrap: {
    id: 'bubbleWrap', name: '🫧 Pancerz z Folii Bąbelkowej', icon: '🫧', reqWeapon: 'stretchAura', reqPassive: 'buty_robocze',
    desc: 'Gigantyczna tarcza bąbelkowa strzelająca głośnymi PUKNIĘCIAMI (POP!), detonując wrogów!'
  },
  superHydrant: {
    id: 'superHydrant', name: '🌊 Fala Powodziowa PPOŻ', icon: '🌊', reqWeapon: 'hydrant', reqPassive: 'stoperan',
    desc: 'Ciągły cyklon wodny pod wysokim ciśnieniem spłukujący całe fale przeciwników z hali!'
  },
  systemDSO: {
    id: 'systemDSO', name: '🔊 System Nagłośnienia DSO 120dB', icon: '🔊', reqWeapon: 'megafon', reqPassive: 'karta_multisport',
    desc: 'Emituje stałe alarmy ewakucyjne DSO, wywołując panikę i obrażenia na całym ekranie!'
  }
};"""
content = re.sub(r'  redbull: \{\s*id: \'redbull\', name: \'⚡ Napój Energetyczny DTA 250ml\', icon: \'🥫\', reqWeapon: \'kawa\', reqPassive: \'furia\',\s*desc: \'Ekstremalna kofeina! Prędkość ruchu i ataku rośnie o \+100%, zadając stałe obrażenia kwasowe\.\'\s*\}\s*\};', evolutions_patch, content)

# 4. Update triggerLevelUpModal to check new evolutions & add cards to regularCards
lvlup_checks = """  if (weapons.kawa.level >= 5 && passives.furia.level >= 1 && !weapons.kawa.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.redbull });
  }
  if (weapons.stretchAura.level >= 5 && passives.buty_robocze.level >= 1 && !weapons.stretchAura.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.bubbleWrap });
  }
  if (weapons.hydrant.level >= 5 && passives.stoperan.level >= 1 && !weapons.hydrant.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.superHydrant });
  }
  if (weapons.megafon.level >= 5 && passives.karta_multisport.level >= 1 && !weapons.megafon.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.systemDSO });
  }"""
content = content.replace("  if (weapons.kawa.level >= 5 && passives.furia.level >= 1 && !weapons.kawa.isEvo) {\n    options.push({ type: 'evolution', evo: EVOLUTIONS.redbull });\n  }", lvlup_checks)

cards_patch = """    { id: 'faktura', name: 'Faktura Korygująca', icon: '📄', desc: 'Latające papiery tnące wrogów.', cat: 'weapon' },
    { id: 'kawa', name: 'Toksyczna Kawa z Automatu', icon: '☕', desc: 'Rozlewa wrzący kwas (kawę) dookoła.', cat: 'weapon' },
    { id: 'hydrant', name: 'Hydrant Magazynowy PPOŻ', icon: '🚰', desc: 'Wstrzeliwuje silne strumienie wody odpychające wrogów.', cat: 'weapon' },
    { id: 'megafon', name: 'Megafon Kierownika Hali', icon: '📢', desc: 'Fala dźwiękowa "DO ROBOTY!" ogłuszająca wrogów.', cat: 'weapon' },
    { id: 'magnet', name: passives.magnet.name, icon: passives.magnet.icon, desc: passives.magnet.desc, cat: 'passive' },
    { id: 'forks', name: passives.forks.name, icon: passives.forks.icon, desc: passives.forks.desc, cat: 'passive' },
    { id: 'coffee', name: passives.coffee.name, icon: passives.coffee.icon, desc: passives.coffee.desc, cat: 'passive' },
    { id: 'battery', name: passives.battery.name, icon: passives.battery.icon, desc: passives.battery.desc, cat: 'passive' },
    { id: 'furia', name: passives.furia.name, icon: passives.furia.icon, desc: passives.furia.desc, cat: 'passive' },
    { id: 'alkomat', name: passives.alkomat.name, icon: passives.alkomat.icon, desc: passives.alkomat.desc, cat: 'passive' },
    { id: 'stoperan', name: passives.stoperan.name, icon: passives.stoperan.icon, desc: passives.stoperan.desc, cat: 'passive' },
    { id: 'buty_robocze', name: passives.buty_robocze.name, icon: passives.buty_robocze.icon, desc: passives.buty_robocze.desc, cat: 'passive' },
    { id: 'karta_multisport', name: passives.karta_multisport.name, icon: passives.karta_multisport.icon, desc: passives.karta_multisport.desc, cat: 'passive' },
    { id: 'paczek', name: passives.paczek.name, icon: passives.paczek.icon, desc: passives.paczek.desc, cat: 'passive' },
    { id: 'kamizelka', name: passives.kamizelka.name, icon: passives.kamizelka.icon, desc: passives.kamizelka.desc, cat: 'passive' },
    { id: 'umowa', name: passives.umowa.name, icon: passives.umowa.icon, desc: passives.umowa.desc, cat: 'passive' }"""
content = re.sub(r"    \{ id: 'faktura', name: 'Faktura Korygująca'[\s\S]*?\{ id: 'karta_multisport', name: passives\.karta_multisport\.name, icon: passives\.karta_multisport\.icon, desc: passives\.karta_multisport\.desc, cat: 'passive' \}", cards_patch, content)

# 5. Update applyUpgrade logic
apply_upg_patch = """    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }
    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;
    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }
    if (opt.id === 'paczek') { player.critChance += 0.20; player.foodDropBoost = (player.foodDropBoost || 0) + 0.25; }
    if (opt.id === 'kamizelka') { player.damageReduction = (player.damageReduction || 0) + 0.25; }
    if (opt.id === 'umowa') { player.xpBonusMult = (player.xpBonusMult || 1.0) + 0.25; }"""
content = content.replace("    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;\n    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }\n    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;\n    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }", apply_upg_patch)

# 6. Add weapon update logic inside updateWeapons(dt)
update_weapons_code = """  if (weapons.kawa.level > 0) {
    weapons.kawa.timer += effectiveDt;
    if (weapons.kawa.timer >= weapons.kawa.cooldown) {
      weapons.kawa.timer = 0;
      fireKawa();
    }
  }
  if (weapons.hydrant.level > 0) {
    weapons.hydrant.timer += effectiveDt;
    if (weapons.hydrant.timer >= weapons.hydrant.cooldown) {
      weapons.hydrant.timer = 0;
      fireHydrant();
    }
  }
  if (weapons.megafon.level > 0) {
    weapons.megafon.timer += effectiveDt;
    if (weapons.megafon.timer >= weapons.megafon.cooldown) {
      weapons.megafon.timer = 0;
      fireMegafon();
    }
  }"""
content = content.replace("  if (weapons.kawa.level > 0) {\n    weapons.kawa.timer += effectiveDt;\n    if (weapons.kawa.timer >= weapons.kawa.cooldown) {\n      weapons.kawa.timer = 0;\n      fireKawa();\n    }\n  }", update_weapons_code)

# 7. Add weapon firing functions: fireHydrant and fireMegafon
firing_funcs = """function fireHydrant() {
  if (enemies.length === 0) return;
  sounds.freeze();
  const count = weapons.hydrant.isEvo ? 8 : (weapons.hydrant.level >= 3 ? 3 : 1);
  const dmg = getDamage(weapons.hydrant.damage);
  
  if (weapons.hydrant.isEvo) {
      // Super Hydrant: Swirling Flood Tornado around player
      screenShake = Math.max(screenShake, 6);
      for (let i = 0; i < 16; i++) {
         const a = (i / 16) * Math.PI * 2 + gameTime * 3;
         projectiles.push({
            type: 'hydrant_beam',
            x: player.x,
            y: player.y,
            vx: Math.cos(a) * 550,
            vy: Math.sin(a) * 550,
            damage: dmg * 1.5,
            pierce: 10,
            life: 0.8,
            maxLife: 0.8,
            isEvo: true
         });
      }
  } else {
      let closest = null, minD = 9999;
      enemies.forEach(e => {
         const d = Math.hypot(e.x - player.x, e.y - player.y);
         if (d < minD) { minD = d; closest = e; }
      });
      if (closest) {
         const baseA = Math.atan2(closest.y - player.y, closest.x - player.x);
         for (let i = 0; i < count; i++) {
             const spread = (i - count/2) * 0.15;
             projectiles.push({
                type: 'hydrant_beam',
                x: player.x,
                y: player.y,
                vx: Math.cos(baseA + spread) * 500,
                vy: Math.sin(baseA + spread) * 500,
                damage: dmg,
                pierce: 3,
                life: 0.7,
                maxLife: 0.7
             });
         }
      }
  }
}

function fireMegafon() {
  sounds.megaph();
  const dmg = getDamage(weapons.megafon.damage);
  screenShake = Math.max(screenShake, 5);
  
  if (weapons.megafon.isEvo) {
      // System DSO 120dB: Screen-wide emergency siren blast!
      showAnnouncement("🔊 SYSTEM DSO 120dB: EWAKUACJA HALI!", "#ef4444");
      createSparks(player.x, player.y, 45, '#ef4444');
      enemies.forEach(e => {
         damageEnemy(e, dmg * 2.0);
         e.stunTimer = 2.5;
         e.slowTimer = 4.0;
      });
  } else {
      // Cone shockwave in front of player
      const coneA = player.angle;
      const coneRadius = weapons.megafon.range;
      enemies.forEach(e => {
         const dx = e.x - player.x;
         const dy = e.y - player.y;
         const dist = Math.hypot(dx, dy);
         if (dist < coneRadius) {
            const angleToE = Math.atan2(dy, dx);
            let diffA = Math.abs(angleToE - coneA);
            if (diffA > Math.PI) diffA = Math.PI * 2 - diffA;
            if (diffA < 0.7) { // 80 deg cone
                damageEnemy(e, dmg);
                e.stunTimer = 1.2;
                e.x += Math.cos(angleToE) * 65; // Knockback
                e.y += Math.sin(angleToE) * 65;
            }
         }
      });
      addSpeechBubble(player.x, player.y - 30, '📢 DO ROBOTY!!', '#facc15');
  }
}"""
content = content.replace("function fireFaktura() {", firing_funcs + "\n\nfunction fireFaktura() {")

# 8. Add new enemies & secret items to ENEMY_TYPES & drops
new_enemies = """  PALECIAK_REZYGNACJI: { name: 'Rzucony Paleciak', hp: 60, speed: 140, radius: 22, renderType: 'pedestrian', color: '#475569', clothColor: '#1e293b', itemIcon: '🛒', xp: 6, straightLine: true, quotes: ['ZWALNIAM SIĘ!', 'NIE CHCE MI SIĘ!'] },

  JADZIA_KSIEGOWOSC: { name: 'Pani Jadzia z Księgowości', hp: 110, speed: 65, radius: 18, renderType: 'pedestrian', color: '#ec4899', clothColor: '#fbcfe8', itemIcon: '☕', xp: 8, shooter: true, quotes: ['PRZERWA KAWOWA!', 'FAKTURA BEZ NIP-U!', 'KTO TO PODPISAŁ?!'] },
  JUNGHEINRICH_SZALENIEC: { name: 'Młody na Jungheinrichu', hp: 180, speed: 195, radius: 25, renderType: 'reach_truck', color: '#facc15', itemIcon: '🏎️', xp: 12, canDash: true, quotes: ['BOKIEM PO RAMPART!', 'BEZ UDT ALE SZYBKO!', 'Z DROGI!'] },
  INWENTARYZACJA: { name: 'Roczna Inwentaryzacja', hp: 380, speed: 45, radius: 32, renderType: 'pedestrian', color: '#94a3b8', clothColor: '#334155', itemIcon: '📊', xp: 20, special: 'split_on_death', quotes: ['SPIS Z NATURY!', 'MANKO NA WAREHOUSE!', 'SZUKAMY 100 PALET!'] },
  BOSS_PREZES_WIZYTACJA: { isBoss: true, name: 'Prezes Zarządu na Wizytacji', hp: 10000, speed: 70, radius: 45, renderType: 'boss_bhp', color: '#f59e0b', clothColor: '#000000', itemIcon: '👔', xp: 1500, mechanics: 'kas_zone', quotes: ['DLACZEGO CI KIEROWCY STOJĄ?!', 'AUDYT LOGISTYCZNY!', 'WYSKOKIE KPI ALBO ZWOLNIENIA!'] },"""
content = content.replace("  PALECIAK_REZYGNACJI: { name: 'Rzucony Paleciak', hp: 60, speed: 140, radius: 22, renderType: 'pedestrian', color: '#475569', clothColor: '#1e293b', itemIcon: '🛒', xp: 6, straightLine: true, quotes: ['ZWALNIAM SIĘ!', 'NIE CHCE MI SIĘ!'] },", new_enemies)

# 9. Update spawn pools in WAREHOUSE_SECTORS
content = content.replace("    spawnPool: ['KARTON_B2C', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS', 'KURIER_DPD'],", "    spawnPool: ['KARTON_B2C', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS', 'KURIER_DPD', 'JADZIA_KSIEGOWOSC'],")
content = content.replace("    spawnPool: ['PALETA_KAM', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS', 'ZLECENIE_NA_CITO'],", "    spawnPool: ['PALETA_KAM', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS', 'ZLECENIE_NA_CITO', 'JUNGHEINRICH_SZALENIEC'],")
content = content.replace("    spawnPool: ['CELNIK', 'URZEDNIK', 'KARTON_B2C', 'KIEROWCA_TIR', 'RAMPA', 'UKRAINA_EKIPA', 'PALECIAK_REZYGNACJI'],", "    spawnPool: ['CELNIK', 'URZEDNIK', 'KARTON_B2C', 'KIEROWCA_TIR', 'RAMPA', 'UKRAINA_EKIPA', 'PALECIAK_REZYGNACJI', 'INWENTARYZACJA'],")

# 10. Update drop items pick-up logic for secrets (golden_forklift, cargo_mystery, boombox_radio)
drop_secret_pickup = """      } else if (item.type === 'golden_forklift') {
        sounds.achieve();
        screenShake = 15;
        player.goldenForkliftTimer = 12.0;
        player.invulnTimer = 12.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 50, '#facc15');
        addSpeechBubble(player.x, player.y - 45, '🌟 ZŁOTY WÓZEK BT OVERDRIVE (12s)! 🚜', '#facc15');
        showAnnouncement("🌟 ZŁOTY MECHA-WÓZEK BT ACTIVATED!", "#facc15");
        dropItems.splice(i, 1);
        continue;
      } else if (item.type === 'boombox_radio') {
        sounds.achieve();
        screenShake = 8;
        player.discoTimer = 15.0;
        addSpeechBubble(player.x, player.y - 35, '📻 DYSKOTEKA WMS 80s! BUFF SZYBKOŚCI (15s)! 🎶', '#a855f7');
        showAnnouncement("📻 DYSKOTEKA WMS: +50% SZYBKOŚCI!", "#a855f7");
        dropItems.splice(i, 1);
        continue;
      } else if (item.type === 'cargo_mystery') {
        sounds.achieve();
        screenShake = 12;
        const roll = Math.random();
        if (roll < 0.25) {
            showAnnouncement("🌟 SKRZYNY SUKCESU: ZŁOTY WÓZEK BT!", "#facc15");
            player.goldenForkliftTimer = 12.0;
            player.invulnTimer = 12.0;
            player.stamina = player.maxStamina;
        } else if (roll < 0.50) {
            showAnnouncement("💣 TOTALNA CZYSTKA RAMPIARZY (NUKE)!", "#ef4444");
            enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
            createSparks(player.x, player.y, 80, '#ef4444');
        } else if (roll < 0.75) {
            showAnnouncement("💰 BONANZA MONET DTA (+500 MONET)!", "#38bdf8");
            dtaCoins += 500;
            saveWorkshopData();
        } else {
            showAnnouncement("⚡ EKSTRA LEVEL UP!", "#22c55e");
            currentXP += neededXP;
            checkLevelUp();
        }
        dropItems.splice(i, 1);
        continue;
      } else if (item.type === 'golden_velvet') {"""
content = content.replace("      } else if (item.type === 'golden_velvet') {", drop_secret_pickup)

# 11. Add rendering for secret drop items in draw loop
drop_secret_render = """      } else if (it.type === 'golden_forklift') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const pulse = 1.1 + Math.sin(gameTime * 10) * 0.25;
        ctx.scale(pulse, pulse);
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🚜', 0, 0);
        ctx.fillStyle = '#facc15'; ctx.font = 'bold 9px sans-serif';
        ctx.shadowColor = '#facc15'; ctx.shadowBlur = 10;
        ctx.fillText('★ZŁOTY WÓZEK★', 0, -18);
        ctx.restore();
      } else if (it.type === 'boombox_radio') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const bob = Math.sin(gameTime * 8) * 4;
        ctx.translate(0, bob);
        ctx.font = '26px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('📻', 0, 0);
        ctx.restore();
      } else if (it.type === 'cargo_mystery') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const spin = gameTime * 4;
        ctx.rotate(Math.sin(spin) * 0.2);
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🎁', 0, 0);
        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 9px sans-serif';
        ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 10;
        ctx.fillText('❓TAJNA PACZKA❓', 0, -16);
        ctx.restore();
      } else if (it.type === 'golden_velvet') {"""
content = content.replace("      } else if (it.type === 'golden_velvet') {", drop_secret_render)

# 12. Add secret drops chance on obstacle destroy & enemy kill
obstacle_drop_patch = """        if (Math.random() < 0.02) {
            dropItems.push({ x: prop.x, y: prop.y, type: 'golden_forklift', life: 40 });
        } else if (Math.random() < 0.05) {
            dropItems.push({ x: prop.x, y: prop.y, type: 'cargo_mystery', life: 40 });
        } else if (Math.random() < 0.03) {
            dropItems.push({ x: prop.x, y: prop.y, type: 'boombox_radio', life: 40 });
        }"""
content = content.replace("        dropItems.push({ x: prop.x, y: prop.y, type: 'dta_coin', val: 15, life: 30 });", "        dropItems.push({ x: prop.x, y: prop.y, type: 'dta_coin', val: 15, life: 30 });\n" + obstacle_drop_patch)

# 13. Handle Golden Forklift and Disco Timer tick in update loop
timer_updates = """  if (player.goldenForkliftTimer > 0) {
      player.goldenForkliftTimer -= dt;
      player.stamina = player.maxStamina;
      player.speed = 320;
      createSparks(player.x, player.y, 2, '#facc15');
      // Ram enemies automatically
      enemies.forEach(en => {
         if (Math.hypot(en.x - player.x, en.y - player.y) < player.radius + en.radius + 15) {
             damageEnemy(en, 300);
             createSparks(en.x, en.y, 15, '#facc15');
             screenShake = Math.max(screenShake, 4);
         }
      });
  }
  if (player.discoTimer > 0) {
      player.discoTimer -= dt;
      player.attackSpeedMult = 1.6;
      if (Math.random() < 0.2) {
          spawnParticle(player.x + (Math.random()-0.5)*40, player.y + (Math.random()-0.5)*40, 0, -30, 0.4, 3, '#a855f7');
      }
  }"""
content = content.replace("  if (player.invulnTimer > 0) player.invulnTimer -= dt;", "  if (player.invulnTimer > 0) player.invulnTimer -= dt;\n" + timer_updates)

# 14. Check extra life protection in death check
death_check_patch = """  if (player.battery <= 0) {
    if (passives.umowa && passives.umowa.level > 0 && !player.extraLifeUsed) {
      player.extraLifeUsed = true;
      player.battery = player.maxBattery;
      player.invulnTimer = 3.5;
      screenShake = 20;
      sounds.bossAlert();
      showAnnouncement("📜 UMOWA BEZTERMINOWA: OCHRONA PRZED ŚMIERCIĄ!", "#22c55e");
      addSpeechBubble(player.x, player.y - 40, '📜 OCHRONA UMOWY! PEŁNA REGENERACJA!', '#22c55e');
      createSparks(player.x, player.y, 60, '#22c55e');
      enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
    } else {
      gameOver(timeStr, false);
      return;
    }
  }"""
content = content.replace("  if (player.battery <= 0) {\n    gameOver(timeStr, false);\n    return;\n  }", death_check_patch)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching script finished successfully!")
