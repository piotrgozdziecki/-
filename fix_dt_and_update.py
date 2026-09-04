import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix dt parameter inside updateAndRenderGibs and updateAndRenderPowerUps
text = text.replace('function updateAndRenderGibs(dt, ctx)', 'function updateAndRenderGibs(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016);')
text = text.replace('function updateAndRenderPowerUps(dt, ctx)', 'function updateAndRenderPowerUps(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016);')

# Update update(dt) to process powerup timers & effects
update_start = "function update(dt) {"
update_injection = """function update(dt) {
  // Power-Up Timers & Modifiers
  if (bulletTimeTimer > 0) {
    bulletTimeTimer -= dt;
    dt *= 0.25; // Slow-mo for enemies & world
  }
  if (freezeTimer > 0) {
    freezeTimer -= dt;
  }
  if (fireBulletsTimer > 0) {
    fireBulletsTimer -= dt;
  }
  if (player.kamikazeIntern) {
    kamikazeTimer += dt;
    if (kamikazeTimer >= 5.0) {
      kamikazeTimer = 0;
      // Spawn exploding intern near player
      const angle = Math.random() * Math.PI * 2;
      const ex = player.x + Math.cos(angle) * 120;
      const ey = player.y + Math.sin(angle) * 120;
      createSparks(ex, ey, 25, '#ef4444');
      stampPermanentDecal(ex, ey, 35, 'oil');
      screenShake = Math.max(screenShake, 14);
      sounds.pallet();
      addSpeechBubble(ex, ey, '💣 PRAKTYKANT: BOOM!', '#ef4444');
      enemies.forEach(en => {
        if (!en.dead && Math.hypot(en.x - ex, en.y - ey) < 160) {
          damageEnemy(en, 180);
        }
      });
    }
  }
  
  // Handling Pip Bribe Invincibility
  if (player.pipBribe && player.battery <= 0 && !player.pipBribeActive) {
    player.pipBribeActive = true;
    player.pipBribeTimer = 10.0;
    player.battery = 1;
    addSpeechBubble(player.x, player.y - 40, '💼 ŁAPÓWKA DLA PIP: 10S OCHRONY!', '#38bdf8');
    showAnnouncement('💼 ŁAPÓWKA DLA PIP: KONTROLA WSTRZYMANA!', '#38bdf8');
  }
  if (player.pipBribeActive) {
    player.pipBribeTimer -= dt;
    player.battery = Math.max(1, player.battery);
    if (player.pipBribeTimer <= 0) {
      player.pipBribeActive = false;
      player.pipBribe = false; // Used up
    }
  }"""

text = text.replace(update_start, update_injection, 1)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated dt references and update loop powerup mechanics.")
