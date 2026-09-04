import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Passives to `passives` dict
passives_to_add = """  furia: { level: 0, max: 3, name: 'Furia Magazyniera', icon: '🤬', desc: '+25% Szybkości Ataku' },
  alkomat: { level: 0, max: 3, name: 'Unik przed Alkomatem', icon: '🍺', desc: '+15% szans na Unik' },
  stoperan: { level: 0, max: 3, name: 'Stoperan Przed Zmianą', icon: '💊', desc: '+30 do Max Baterii (HP)' },
  buty_robocze: { level: 0, max: 3, name: 'Buty Robocze S3', icon: '🥾', desc: 'Zadajesz obrażenia wrogom, którzy Cię dotkną' },
  karta_multisport: { level: 0, max: 3, name: 'Karta Multisport', icon: '💳', desc: 'Szybsza regeneracja wózka i prędkość +10' }"""
content = re.sub(r"  furia: \{ level: 0, max: 3, name: 'Furia Magazyniera', icon: '🤬', desc: '\+25% Szybkości Ataku' \},\n  alkomat: \{ level: 0, max: 3, name: 'Unik przed Alkomatem', icon: '🍺', desc: '\+15% szans na Unik' \}", passives_to_add, content)

# 2. Add standard passives to `regularCards` array
regularCards_to_add = """    { id: 'battery', name: passives.battery.name, icon: passives.battery.icon, desc: passives.battery.desc, cat: 'passive' },
    { id: 'furia', name: passives.furia.name, icon: passives.furia.icon, desc: passives.furia.desc, cat: 'passive' },
    { id: 'alkomat', name: passives.alkomat.name, icon: passives.alkomat.icon, desc: passives.alkomat.desc, cat: 'passive' },
    { id: 'stoperan', name: passives.stoperan.name, icon: passives.stoperan.icon, desc: passives.stoperan.desc, cat: 'passive' },
    { id: 'buty_robocze', name: passives.buty_robocze.name, icon: passives.buty_robocze.icon, desc: passives.buty_robocze.desc, cat: 'passive' },
    { id: 'karta_multisport', name: passives.karta_multisport.name, icon: passives.karta_multisport.icon, desc: passives.karta_multisport.desc, cat: 'passive' }"""
content = re.sub(r"    \{ id: 'battery', name: passives\.battery\.name, icon: passives\.battery\.icon, desc: passives\.battery\.desc, cat: 'passive' \}", regularCards_to_add, content)

# 3. Add to `applyUpgrade`
applyUpgrade_to_add = """    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }
    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;
    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }"""
content = re.sub(r"    if \(opt\.id === 'alkomat'\) player\.dodgeChance = \(player\.dodgeChance \|\| 0\) \+ 0\.15;", applyUpgrade_to_add, content)

# 4. Use player.staminaRegenMult and player.thorns
staminaRegen = """    // Recharge stamina (takes ~6 seconds to fully recharge)
    player.stamina += dt * 16 * (player.staminaRegenMult || 1.0);"""
content = re.sub(r"    // Recharge stamina \(takes ~6 seconds to fully recharge\)\n    player\.stamina \+= dt \* 16;", staminaRegen, content)

thorns_logic = """  if (player.thorns && player.thorns > 0) {
      damageEnemy(e, player.thorns);
      createSparks(e.x, e.y, 10, '#facc15');
  }"""
content = content.replace("  if (e.info.armor) dmg *= 0.3; // 70% damage reduction", "  if (e.info.armor) dmg *= 0.3; // 70% damage reduction\n" + thorns_logic)

# 5. Add new enemies
enemies_to_add = """  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 35, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner', quotes: ['CAŁY MORSKI ŁADUNEK!', 'ZARAZ FAJRANT!'] },

  KURIER_DPD: { name: 'Spóźniony Kurier DPD', hp: 45, speed: 170, radius: 14, renderType: 'pedestrian', color: '#ef4444', clothColor: '#fca5a5', itemIcon: '📦', xp: 4, canDash: true, quotes: ['PRZESYŁKA AWIZOWANA!', 'NIE MAM CZASU!', 'RZUĆ TO!'] },
  BHP_INSPECTOR_SUPER: { isBoss: true, name: 'Główny Inspektor BHP', hp: 3500, speed: 65, radius: 28, renderType: 'pedestrian', color: '#f59e0b', clothColor: '#451a03', itemIcon: '📋', xp: 750, mechanics: 'kas_zone', quotes: ['BRAK KASKU!', 'KARA FINANSOWA!', 'PROSZĘ O PRZEPUSTKĘ!'] },
  ZLECENIE_NA_CITO: { name: 'Zlecenie na Cito', hp: 5, speed: 220, radius: 10, renderType: 'pedestrian', color: '#ffffff', clothColor: '#f8fafc', itemIcon: '📄', xp: 1, quotes: ['NA WCZORAJ!', 'BARDZO PILNE!'] },
  PALECIAK_REZYGNACJI: { name: 'Rzucony Paleciak', hp: 60, speed: 140, radius: 22, renderType: 'pedestrian', color: '#475569', clothColor: '#1e293b', itemIcon: '🛒', xp: 6, straightLine: true, quotes: ['ZWALNIAM SIĘ!', 'NIE CHCE MI SIĘ!'] },"""
content = re.sub(r"  BOSS_KONTENER: \{ isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 35, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner', quotes: \['CAŁY MORSKI ŁADUNEK!', 'ZARAZ FAJRANT!'\] \},", enemies_to_add, content)

# 6. Add new enemies to spawnPool
content = content.replace("    spawnPool: ['KARTON_B2C', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS'],", "    spawnPool: ['KARTON_B2C', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS', 'KURIER_DPD'],")
content = content.replace("    spawnPool: ['PALETA_KAM', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS'],", "    spawnPool: ['PALETA_KAM', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS', 'ZLECENIE_NA_CITO'],")
content = content.replace("    spawnPool: ['CELNIK', 'URZEDNIK', 'KARTON_B2C', 'KIEROWCA_TIR', 'RAMPA', 'UKRAINA_EKIPA'],", "    spawnPool: ['CELNIK', 'URZEDNIK', 'KARTON_B2C', 'KIEROWCA_TIR', 'RAMPA', 'UKRAINA_EKIPA', 'PALECIAK_REZYGNACJI'],")


# 7. One of the Bosses can spawn randomly at high levels
content = content.replace("    bossKey: 'BOSS_ZBIGNIEW',", "    bossKey: 'BHP_INSPECTOR_SUPER',")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
