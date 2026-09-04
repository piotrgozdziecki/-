import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

expanded_handler = """
window.onCardSelectedInCompose = function(cardId) {
  console.log('Card selected in Compose:', cardId);
  if (typeof sounds !== 'undefined' && sounds.xp) sounds.xp();
  
  // ⚔️ ACTIVE WEAPONS
  if (cardId === 'scanner_active' && weapons.scanner) {
    weapons.scanner.level++;
    weapons.scanner.damage += 15;
  } else if (cardId === 'toilet_paper_active' && weapons.toiletPaper) {
    weapons.toiletPaper.level++;
    weapons.toiletPaper.count += 2;
  } else if (cardId === 'stretch_aura_active' && weapons.folia) {
    weapons.folia.level++;
    weapons.folia.count++;
  } else if (cardId === 'pallet_truck_active' && weapons.pallets) {
    weapons.pallets.level++;
    weapons.pallets.damage += 30;
  } else if (cardId === 'extinguisher_active' && weapons.extinguisher) {
    weapons.extinguisher.level++;
    weapons.extinguisher.damage += 18;
  } else if (cardId === 'zip_ties_active' && weapons.trytytki) {
    weapons.trytytki.level++;
    weapons.trytytki.count++;
  } else if (cardId === 'cutter_active' && weapons.noz) {
    weapons.noz.level++;
    weapons.noz.pierce++;
    weapons.noz.damage += 15;
  } else if (cardId === 'stapler_active' && weapons.zszywacz) {
    weapons.zszywacz.level++;
    weapons.zszywacz.count += 2;
  } else if (cardId === 'sledgehammer_active' && weapons.mlot) {
    weapons.mlot.level++;
    weapons.mlot.damage += 40;
  } else if (cardId === 'faktura_active' && weapons.faktura) {
    weapons.faktura.level++;
    weapons.faktura.count++;
  } else if (cardId === 'kawa_active' && weapons.kawa) {
    weapons.kawa.level++;
    weapons.kawa.radius += 30;
  } else if (cardId === 'hydrant_active' && weapons.hydrant) {
    weapons.hydrant.level++;
    weapons.hydrant.damage += 40;
  } else if (cardId === 'megafon_active' && weapons.megafon) {
    weapons.megafon.level++;
    weapons.megafon.damage += 25;
  }
  
  // 🛡️ PASSIVE BUFFS
  else if (cardId === 'iso_cert_passive' && passives.magnet) {
    passives.magnet.level++;
    player.magnetRange += 75;
  } else if (cardId === 'safety_bhp_passive' && passives.protokol_bhp) {
    passives.protokol_bhp.level++;
    player.ramDamageMult = (player.ramDamageMult || 1.0) + 0.4;
  } else if (cardId === 'synthetic_oil_passive' && passives.smar_syntetyczny) {
    passives.smar_syntetyczny.level++;
    player.speed += 25;
  } else if (cardId === 'super_battery_passive' && passives.battery) {
    passives.battery.level++;
    player.maxBattery += 35;
    player.battery = Math.min(player.maxBattery, player.battery + 40);
  } else if (cardId === 'furia_passive' && passives.furia) {
    passives.furia.level++;
    player.attackSpeedMult = (player.attackSpeedMult || 1.0) * 1.25;
  } else if (cardId === 'alkomat_passive' && passives.unik_alkomat) {
    passives.unik_alkomat.level++;
    player.dodgeChance = (player.dodgeChance || 0) + 0.15;
  } else if (cardId === 'stoperan_passive' && passives.stoperan) {
    passives.stoperan.level++;
    player.maxBattery += 30;
    player.battery = Math.min(player.maxBattery, player.battery + 30);
  } else if (cardId === 'safety_shoes_passive' && passives.buty_robocze) {
    passives.buty_robocze.level++;
    player.thorns = (player.thorns || 0) + 25;
  } else if (cardId === 'multisport_passive' && passives.karta_multisport) {
    passives.karta_multisport.level++;
    player.speed += 15;
  } else if (cardId === 'paczek_passive' && passives.paczek) {
    passives.paczek.level++;
    player.critChance = (player.critChance || 0) + 0.20;
  } else if (cardId === 'kamizelka_passive' && passives.kamizelka) {
    passives.kamizelka.level++;
    player.damageReduction = (player.damageReduction || 0) + 0.25;
  } else if (cardId === 'umowa_passive' && passives.umowa) {
    passives.umowa.level++;
    player.extraLives = (player.extraLives || 0) + 1;
  }

  // ⚡ GOLDEN EVOLUTIONS
  else if (cardId === 'bramka_rfid_evo' && weapons.scanner) {
    weapons.scanner.evolved = true;
    weapons.scanner.damage = 100;
  } else if (cardId === 'owijarka_evo' && weapons.toiletPaper) {
    weapons.toiletPaper.evolved = true;
    weapons.toiletPaper.damage = 60;
  } else if (cardId === 'bt_highstack_evo' && weapons.pallets) {
    weapons.pallets.evolved = true;
    weapons.pallets.damage = 90;
  } else if (cardId === 'zraszacz_evo' && weapons.extinguisher) {
    weapons.extinguisher.evolved = true;
    weapons.extinguisher.damage = 150;
  } else if (cardId === 'steel_ties_evo' && weapons.trytytki) {
    weapons.trytytki.evolved = true;
    weapons.trytytki.damage = 60;
  } else if (cardId === 'machete_evo' && weapons.noz) {
    weapons.noz.evolved = true;
    weapons.noz.damage = 45;
  } else if (cardId === 'stapler_gun_evo' && weapons.zszywacz) {
    weapons.zszywacz.evolved = true;
    weapons.zszywacz.damage = 70;
  } else if (cardId === 'hydraulic_hammer_evo' && weapons.mlot) {
    weapons.mlot.evolved = true;
    weapons.mlot.damage = 180;
  } else if (cardId === 'urzad_skarbowy_evo' && weapons.faktura) {
    weapons.faktura.evolved = true;
    weapons.faktura.damage = 120;
  } else if (cardId === 'redbull_evo' && weapons.kawa) {
    weapons.kawa.evolved = true;
    weapons.kawa.damage = 60;
  }

  // ⚠️ DEBUFF & RISK/REWARD CARDS
  else if (cardId === 'overtime_debuff') {
    player.damageMult = (player.damageMult || 1.0) * 1.45;
    player.speed = Math.max(120, player.speed * 0.82);
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ NADGODZINY: +45% DMG / -18% SPEED', '#ef4444');
  } else if (cardId === 'kas_audit_debuff') {
    player.xpBonusMult = (player.xpBonusMult || 1.0) * 1.6;
    player.maxBattery = Math.max(50, player.maxBattery - 20);
    player.battery = Math.min(player.maxBattery, player.battery);
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ KONTROLA KAS: +60% XP / -20 BATTERY', '#f59e0b');
  } else if (cardId === 'leaking_hydraulics_debuff') {
    if (weapons.kawa) weapons.kawa.radius += 50;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ WYCIEK OLEJU: +40% AREA EFEKT', '#eab308');
  } else if (cardId === 'ramp_breakdown_debuff') {
    player.knockbackMult = (player.knockbackMult || 1.0) * 1.5;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🚧 ZABLOKOWANA RAMPA: +50% KNOCKBACK', '#f59e0b');
  }
  
  closeLevelUp();
};
"""

pattern = r"window\.onCardSelectedInCompose\s*=\s*function\(cardId\)\s*\{[\s\S]*?\};\n"
if re.search(pattern, text):
    text = re.sub(pattern, expanded_handler + "\n", text)
    print("Replaced existing onCardSelectedInCompose handler.")
else:
    print("Pattern not found, appending handler.")
    text += "\n" + expanded_handler

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated game.html with expanded card handlers successfully.")
