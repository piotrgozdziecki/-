import re
import os

# Using current working directory based paths for robustness
file_path = 'app/src/main/assets/game.html'

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find stray content between the closed template literal and the next JS logic
# It looks for the end of the style block and the backtick-semicolon
pattern = re.compile(r'      </style>\s+`;\s+(.*?)\s+// Update Dialogue Box', re.DOTALL)
match = pattern.search(content)

if match:
    stray_content = match.group(1)
    print(f"Found stray content of length {len(stray_content)}")
    new_content = content.replace(stray_content, "")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Cleanup successful")
else:
    print("Stray content not found with pattern")
