import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add window.onCardSelectedInCompose handler
compose_handler = """
window.onCardSelectedInCompose = function(cardId) {
  console.log('Card selected in Compose:', cardId);
  if (typeof sounds !== 'undefined' && sounds.xp) sounds.xp();
  
  // Active Weapons
  if (cardId === 'scanner_active' && weapons.scanner) {
    weapons.scanner.level++;
    weapons.scanner.damage += 15;
  } else if (cardId === 'toilet_paper_active' && weapons.toiletPaper) {
    weapons.toiletPaper.level++;
    weapons.toiletPaper.count += 2;
  } else if (cardId === 'pallet_truck_active' && weapons.pallets) {
    weapons.pallets.level++;
    weapons.pallets.damage += 30;
  } else if (cardId === 'extinguisher_active' && weapons.extinguisher) {
    weapons.extinguisher.level++;
    weapons.extinguisher.damage += 18;
  } else if (cardId === 'hydrant_active' && weapons.hydrant) {
    weapons.hydrant.level++;
    weapons.hydrant.damage += 40;
  }
  // Passives
  else if (cardId === 'iso_cert_passive' && passives.magnet) {
    passives.magnet.level++;
    player.magnetRange += 75;
  } else if (cardId === 'super_battery_passive' && passives.battery) {
    passives.battery.level++;
    player.maxBattery += 35;
    player.battery = Math.min(player.maxBattery, player.battery + 40);
  } else if (cardId === 'safety_shoes_passive' && passives.buty_robocze) {
    passives.buty_robocze.level++;
    player.thorns = (player.thorns || 0) + 25;
  } else if (cardId === 'multisport_passive' && passives.karta_multisport) {
    passives.karta_multisport.level++;
    player.speed += 15;
  }
  // Debuffs & Risk-Reward
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
  }
  
  closeLevelUp();
};
"""

text = text.replace("function triggerLevelUpModal(isReroll = false) {", compose_handler + "\nfunction triggerLevelUpModal(isReroll = false) {\n  if (window.AndroidBridge && window.AndroidBridge.triggerComposeLevelUp) {\n    window.AndroidBridge.triggerComposeLevelUp(player.level);\n  }")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added onCardSelectedInCompose handler and bridge notification successfully.")
