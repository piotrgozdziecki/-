import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

new_drop_block = """// Update Drop Items & Magnet
  const magnetSpeed = (320 + player.magnetRange * 0.8) * dt;
  for (let i = dropItems.length - 1; i >= 0; i--) {
    const item = dropItems[i];
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const dist = Math.hypot(dx, dy);

    if (dist < player.magnetRange && dist > 1) {
      // Exponential succ - starts slow, gets extremely fast
      const succFactor = Math.pow(1.0 - (dist / player.magnetRange), 2.5);
      const dynamicSpeed = magnetSpeed + (succFactor * magnetSpeed * 6.0);
      item.x += (dx / dist) * dynamicSpeed;
      item.y += (dy / dist) * dynamicSpeed;
      
      // Visual trail
      if (Math.random() < 0.25) {
         createSparks(item.x, item.y, 1, item.type === 'barcode_xp' ? '#60a5fa' : '#facc15');
      }
    }

    if (dist < player.radius + 18) {
      packageCombo++;
      packageComboTimer = 3.2;
      if (packageCombo > maxPackageCombo) maxPackageCombo = packageCombo;
      const packageMultiplier = 1.0 + (packageCombo * 0.15);

      if (item.type === 'lucky_chest') {
        openLuckyChest(item.val || 1);
      } else if (item.type === 'dta_coin') {
        const cVal = item.val || 25;
        dtaCoins += cVal;
        saveWorkshopData();
        sounds.xp();
        score += cVal * 10;
        addSpeechBubble(player.x, player.y - 25, `+💰 ${cVal} MONET DTA`, '#facc15');
      } else if (item.type === 'golden_forklift') {
        sounds.achieve();
        screenShake = 15;
        player.goldenForkliftTimer = 12.0;
        player.invulnTimer = 12.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 50, '#facc15');
        addSpeechBubble(player.x, player.y - 45, '🌟 ZŁOTY WÓZEK BT OVERDRIVE (12s)! 🚜', '#facc15');
        showAnnouncement("🌟 ZŁOTY MECHA-WÓZEK BT ACTIVATED!", "#facc15");
      } else if (item.type === 'boombox_radio') {
        sounds.achieve();
        screenShake = 8;
        player.discoTimer = 15.0;
        addSpeechBubble(player.x, player.y - 35, '📻 DYSKOTEKA WMS 80s! BUFF SZYBKOŚCI (15s)! 🎶', '#a855f7');
        showAnnouncement("📻 DYSKOTEKA WMS: +50% SZYBKOŚCI!", "#a855f7");
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
      } else if (item.type === 'golden_velvet') {
        sounds.achieve();
        screenShake = 10;
        player.invulnTimer = 10.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 40, '#facc15');
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
      } else if (item.type === 'barcode_xp') {
        const earnedXP = Math.floor(item.val * (1 + packageCombo * 0.04));
        currentXP += earnedXP;
        const pts = Math.floor(item.val * 15 * packageMultiplier);
        score += pts;
        sounds.xp();
        checkLevelUp();
      } else if (item.type === 'pizza_szefa') {
        score += 1000;
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '🍕 PIZZA OD SZEFA! LEVEL UP!', '#ef4444');
        currentXP += neededXP;
        checkLevelUp();
      } else if (item.type === 'hotdog') {
        player.battery = Math.min(player.maxBattery, player.battery + 25);
        score += Math.floor(150 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '🌭 HOTDOG Z ŻABKI! +25% ⚡', '#4ade80');
      } else if (item.type === 'kinder_bueno') {
        player.battery = player.maxBattery;
        currentXP += Math.floor(50 * (1 + packageCombo * 0.05));
        score += Math.floor(350 * packageMultiplier);
        sounds.achieve();
        triggerAchievement('kinder_defender', 'Obrońca Kinder Bueno', '🍫');
        addSpeechBubble(player.x, player.y - 30, '🍫 KINDER BUENO ODNALEZIONE!', '#fbbf24');
        checkLevelUp();
      } else if (item.type === 'mystery_box') {
        const roll = Math.random();
        sounds.achieve();
        if (roll < 0.20) {
          showAnnouncement("BEZPŁATNE NADGODZINY!", "#ef4444");
          mysteryActive = 'nadgodziny'; mysteryTimer = 15; mysteryBuffMultiplier = 1.7;
          player.stamina = Math.max(0, player.stamina - 40);
        } else if (roll < 0.40) {
          showAnnouncement("KASK BHP: NIEŚMIERTELNOŚĆ!", "#facc15");
          player.invulnTimer = 10;
        } else if (roll < 0.60) {
          showAnnouncement("KONTROLA JAKOŚCI: CZYSTKA!", "#38bdf8");
          enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
        } else if (roll < 0.80) {
          showAnnouncement("PREMIA UZNANIOWA: WYSYP XP!", "#22c55e");
          for (let k = 0; k < 25; k++) {
             dropItems.push({ x: player.x + (Math.random()-0.5)*150, y: player.y + (Math.random()-0.5)*150, type: 'barcode_xp', val: 50, life: 30 });
          }
        } else {
          showAnnouncement("ZŁOTY KOD: COMBO x30!", "#c084fc");
          packageCombo = 30; packageComboTimer = 5;
        }
      } else if (item.type === 'coffee_thermos') {
        player.skillCooldown = 0;
        score += Math.floor(200 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '☕ TERMOS KAWY! SKILL READY!', '#f97316');
      }

      dropItems.splice(i, 1);
      continue;
    }
  }"""

pos_start = text.find('// Update Drop Items & Magnet')
pos_end = text.find('// Combo Milestones Floating Texts & Announcements')

if pos_start != -1 and pos_end != -1:
    text = text[:pos_start] + new_drop_block + "\n\n  " + text[pos_end:]
    print("Replaced drop items block successfully.")
else:
    print("ERROR finding drop items bounds!")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved updated game.html")
