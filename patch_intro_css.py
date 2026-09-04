import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# Add thick borders to intro-modal
css_old = ".intro-modal {\n      background: #0f172a;\n      border: 2px solid #38bdf8;"
css_new = ".intro-modal {\n      background: #0f172a;\n      border: 4px solid #000000;\n      box-shadow: 12px 12px 0px rgba(0,0,0,0.5);"
text = text.replace(css_old, css_new)

# Add thick borders to art stage
css_old2 = ".intro-art-stage {\n      width: 100%;\n      height: 220px;\n      background: #020617;\n      border-radius: 8px;\n      border: 1px solid #334155;\n      position: relative;\n      overflow: hidden;\n    }"
css_new2 = ".intro-art-stage {\n      width: 100%;\n      height: 240px;\n      background: #020617;\n      border-radius: 4px;\n      border: 4px solid #000000;\n      position: relative;\n      overflow: hidden;\n    }"
text = text.replace(css_old2, css_new2)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
