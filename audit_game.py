import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("File size:", len(text))

# 1. Check projectile types in projectiles.push vs updateProjectiles
p_pushes = set(re.findall(r"type:\s*['\"]([^'\"]+)['\"]", text))
print("Projectile types pushed:", p_pushes)

# Find updateProjectiles or projectile update loop
proj_handled = set()
for p in ['scanner', 'toilet_paper', 'cutter', 'box_mortar', 'faktura', 'stapler', 'zip_tie', 'hydrant_beam', 'shockwave', 'enemy_shoot', 'pallet']:
    if f"p.type === '{p}'" in text or f'p.type === "{p}"' in text:
        proj_handled.add(p)
print("Projectile types handled in update:", proj_handled)
unhandled_proj = p_pushes - proj_handled
print("Unhandled projectile types in update:", unhandled_proj)

# 2. Check weapon evolution conditions in triggerLevelUpModal vs EVOLUTIONS
evos = re.findall(r"EVOLUTIONS\.(\w+)", text)
print("Evolutions referenced:", set(evos))

# 3. Check CSS for touch-action and overflow-y
print("\n--- CSS OVERFLOW & TOUCH ACTION CHECK ---")
modal_ids = ['upgrade-container', 'character-selection-screen', 'workshop-screen', 'pause-screen', 'stage-transition-screen', 'chest-screen', 'bestiary-screen', 'sector-selection-screen']
for m_id in modal_ids:
    if f"#{m_id}" in text or f'id="{m_id}"' in text:
        print(f"Modal/Container '{m_id}' present in file.")

# 4. Search for undefined function calls
fn_defs = set(re.findall(r"function\s+(\w+)\s*\(", text))
fn_calls = set(re.findall(r"(\w+)\s*\(", text))
# Check calls to custom functions
suspicious_calls = [c for c in ['getDamage', 'damageEnemy', 'takeDamage', 'createSparks', 'spawnParticle', 'spawnDamageText', 'addSpeechBubble', 'showAnnouncement', 'triggerAchievement', 'saveWorkshopData', 'checkLevelUp'] if c not in fn_defs]
print("Missing function definitions:", suspicious_calls)

