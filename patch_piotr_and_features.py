import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Update Character Card for Piotr in HTML
piotr_card_old = """<div class="char-card selected" onclick="selectCharacter('piotr', this)">
            <div class="char-header"><span>📦</span> Piotr (Magazynier Alfa)</div>
            <div class="char-skill">✨ Pasywka: <b>Szybkie Ładowanie</b> (+35% szybszy atak/cooldown)<br>⚡ Skill: <b>Laserowy Impuls 360°</b> (odprawa całej fali)</div>
          </div>"""

piotr_card_new = """<div class="char-card selected" onclick="selectCharacter('piotr', this)">
            <div class="char-header"><span>📦🐕</span> Piotr (Opiekun Kluski & Alfa)</div>
            <div class="char-skill">✨ Pasywka: <b>Kundel Kluska</b> (+35% ataku, pies przywołuje XP & gryzie)<br>🔫 Skill: <b>Pistolet na Gaz + Metalowe Kulki & Wściekła Kluska!</b></div>
          </div>"""

text = text.replace(piotr_card_old, piotr_card_new)

# 2. Update CHARACTERS.piotr JS object
piotr_obj_old = """  piotr: {
    id: 'piotr',
    name: 'Piotr (Magazynier Alfa)',
    icon: '📦',
    speed: 2.3,
    maxBattery: 105,
    magnet: 170,
    critBonus: 0.15,
    attackSpeedMult: 1.35, // Pasywka: Szybkie Ładowanie (+35% szybszy atak)
    skillIcon: '⚡',
    skillLabel: 'IMPULS',
    skillCooldown: 7.0
  },"""

piotr_obj_new = """  piotr: {
    id: 'piotr',
    name: 'Piotr & Kluska 🐕',
    icon: '📦🐕',
    speed: 2.3,
    maxBattery: 110,
    magnet: 180,
    critBonus: 0.20,
    attackSpeedMult: 1.35, // Pasywka: Szybkie Ładowanie (+35% szybszy atak)
    skillIcon: '🔫🐕',
    skillLabel: 'GAZ & KLUSKA',
    skillCooldown: 6.5
  },"""

text = text.replace(piotr_obj_old, piotr_obj_new)

# 3. Update Piotr's line in updateIntroView
hero_line_old = "if (selectedCharKey === 'piotr') heroLine = 'Piotr: Odpalam laserowy skaner i ładuję rolki papieru Velvet Max! Kto nie ma SAD-u, ten nie odjedzie stąd przed 07:00!';"
hero_line_new = "if (selectedCharKey === 'piotr') heroLine = 'Piotr: Odpalam pistolet na gaz na metalowe kulki, a moja suczka Kluska już ostrzy zęby na nogawki kierowców TIR-ów! Żaden bus nie odjedzie bez SAD-u! HAU HAU!';";

text = text.replace(hero_line_old, hero_line_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)

print("Patch 1 applied successfully.")
