import re

with open("app/src/main/assets/game.html", "r") as f:
    lines = f.readlines()

in_enemies = False
for i, line in enumerate(lines):
    if "const ENEMY_TYPES =" in line:
        in_enemies = True
    if "const BOSS_CATALOG =" in line:
        in_enemies = True
    if "let activeBoss =" in line:
        in_enemies = False

    if in_enemies and "speed: " in line:
        match = re.search(r"speed:\s*([0-9.]+)", line)
        if match:
            old_speed = float(match.group(1))
            new_speed = old_speed * 0.45  # Reduce enemy speed by ~55%
            lines[i] = re.sub(r"speed:\s*([0-9.]+)", f"speed: {new_speed:.1f}", line)

with open("app/src/main/assets/game.html", "w") as f:
    f.writelines(lines)
