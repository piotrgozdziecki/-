import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_apply_evo = """  } else if (evo.id === 'hydraulicHammer') {
    weapons.sledgehammer.isEvo = true;
    weapons.sledgehammer.damage = 180;
    weapons.sledgehammer.cooldown = 1.6;
    weapons.sledgehammer.radius = 240;
  } else if (evo.id === 'urzadSkarbowy') {
    weapons.faktura.isEvo = true;
    weapons.faktura.damage = 120;
    weapons.faktura.cooldown = 1.2;
    weapons.faktura.speed = 600;
  } else if (evo.id === 'redbull') {
    weapons.kawa.isEvo = true;
    weapons.kawa.damage = 60;
    weapons.kawa.cooldown = 1.5;
    player.speed += 30; // Permanent speed boost
  }
}
"""

content = re.sub(r'  \} else if \(evo\.id === \'hydraulicHammer\'\) \{\s*weapons\.sledgehammer\.isEvo = true;\s*weapons\.sledgehammer\.damage = 180;\s*weapons\.sledgehammer\.cooldown = 1\.6;\s*weapons\.sledgehammer\.radius = 240;\s*\}\s*\}', new_apply_evo.strip() + '\n}', content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

