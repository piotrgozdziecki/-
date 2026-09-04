import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all element IDs that have 'screen' or 'modal'
screens = re.findall(r'<div[^>]*id=["\']([^"\']+)["\'][^>]*>', text)
print("All DIV IDs:", screens)

# Find all event listeners added via addEventListener or onclick
listeners = re.findall(r'document\.getElementById\(["\']([^"\']+)["\']\)\.addEventListener', text)
print("\nAddEventListener IDs:", listeners)

# Find any onclick handlers in HTML
onclicks = re.findall(r'onclick=["\']([^"\']+)["\']', text)
print("\nOnclick handlers count:", len(onclicks))
for oc in set(onclicks):
    print("  ", oc)

