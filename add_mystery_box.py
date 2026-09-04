import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Add HTML container for announcement
announcement_html = """  <div id="announcement" style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) scale(0.8); opacity: 0; pointer-events: none; text-align: center; font-size: 36px; font-weight: 900; color: #fff; text-shadow: 0 4px 12px rgba(0,0,0,0.8), 0 0 20px currentColor; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 1000; font-family: 'Arial Black', sans-serif; -webkit-text-stroke: 1px #000; white-space: nowrap;"></div>"""
text = text.replace('<div id="game-container">', '<div id="game-container">\n' + announcement_html)

# 2. Add globals
globals_add = """let mysteryTimer = 0;
let mysteryActive = '';
let mysteryBuffMultiplier = 1.0;
function showAnnouncement(txt, col) {
  const el = document.getElementById('announcement');
  el.innerText = txt; el.style.color = col;
  el.style.opacity = 1; el.style.transform = 'translate(-50%, -50%) scale(1)';
  setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translate(-50%, -50%) scale(0.8)'; }, 3500);
}"""
text = text.replace("let bossFlags = {", globals_add + "\nlet bossFlags = {")

# 3. Add drop in enemy death (where rand < 0.04)
drop_old = """  const rand = Math.random();
  if (rand < 0.04) {"""
drop_new = """  const rand = Math.random();
  if (rand < 0.015) {
    dropItems.push({ x: e.x, y: e.y, type: 'mystery_box', life: 40 });
  } else if (rand < 0.055) {"""
text = text.replace(drop_old, drop_new)

# 4. Item pickup logic
pickup_old = """      } else if (item.type === 'coffee_thermos') {"""
pickup_new = """      } else if (item.type === 'mystery_box') {
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
          for (let i = 0; i < 25; i++) {
             dropItems.push({ x: player.x + (Math.random()-0.5)*150, y: player.y + (Math.random()-0.5)*150, type: 'barcode_xp', val: 50, life: 30 });
          }
        } else {
          showAnnouncement("ZŁOTY KOD: COMBO x30!", "#c084fc");
          packageCombo = 30; packageComboTimer = 5;
        }
      } else if (item.type === 'coffee_thermos') {"""
text = text.replace(pickup_old, pickup_new)

# 5. Draw item
draw_old = """      } else if (it.type === 'coffee_thermos') {"""
draw_new = """      } else if (it.type === 'mystery_box') {
        ctx.font = '28px sans-serif';
        ctx.fillText('🎁', it.x - 14, it.y + 10);
      } else if (it.type === 'coffee_thermos') {"""
text = text.replace(draw_old, draw_new)

# 6. Update mystery timer
update_old = """  if (gameTime >= TOTAL_SHIFT_DURATION) {"""
update_new = """  if (mysteryTimer > 0) {
    mysteryTimer -= dt;
    if (mysteryTimer <= 0) {
       mysteryActive = ''; mysteryBuffMultiplier = 1.0;
       showAnnouncement("NADGODZINY ZAKOŃCZONE!", "#94a3b8");
    }
  }
  if (gameTime >= TOTAL_SHIFT_DURATION) {"""
text = text.replace(update_old, update_new)

# 7. Enemy speed modifier
enemy_old = """    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0);"""
enemy_new = """    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;"""
text = text.replace(enemy_old, enemy_new)

# 8. Reset on game over/start
reset_old = """  packageComboTimer = 0;
  maxPackageCombo = 0;"""
reset_new = """  packageComboTimer = 0;
  maxPackageCombo = 0;
  mysteryTimer = 0; mysteryActive = ''; mysteryBuffMultiplier = 1.0;"""
text = text.replace(reset_old, reset_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
