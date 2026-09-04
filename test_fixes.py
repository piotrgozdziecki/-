import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("Initial size:", len(text))

# 1. Define getDamage if not present
if 'function getDamage(' not in text:
    get_dmg_code = """
function getDamage(baseDmg) {
  let dmg = baseDmg || 20;
  if (player && player.damageMult) dmg *= player.damageMult;
  return Math.round(dmg);
}
"""
    text = text.replace("function fireHydrant() {", get_dmg_code + "\nfunction fireHydrant() {")
    print("Added getDamage function.")

# 2. Fix fireKawa
text = text.replace("takeDamage(e, dmg);\n      spawnDamageText(e.x, e.y - 20, dmg, '#78350f', true);", "damageEnemy(e, dmg);")
print("Fixed fireKawa takeDamage call.")

# 3. Fix damageEnemy thorns recursion
old_thorns = """  if (player.thorns && player.thorns > 0) {
      damageEnemy(e, player.thorns);
      createSparks(e.x, e.y, 10, '#facc15');
  }"""
new_thorns = """  // Thorns handled when player takes hit from enemy"""
text = text.replace(old_thorns, new_thorns)
print("Fixed damageEnemy thorns recursion.")

# 4. Fix spawnDamageText in dodge
text = text.replace("spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);", "spawnDamageNumber(player.x, player.y - 20, 'UNIK!', true);")

print("Size after initial fixes:", len(text))

