import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all function calls inside onclick="..."
onclick_matches = re.findall(r'onclick=["\']([^"\']+)["\']', text)

fn_defs = set(re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', text))

print("=== ONCLICK FUNCTION CHECK ===")
for statement in onclick_matches:
    # Extract function name(s)
    calls = re.findall(r'([a-zA-Z0-9_]+)\s*\(', statement)
    for c in calls:
        if c not in fn_defs:
            print(f"ERROR: Function '{c}' called in onclick='{statement}' is NOT defined!")
        else:
            pass

print("Check completed.")
