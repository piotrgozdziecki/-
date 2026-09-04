import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

modal_css_enhancement = """
/* Mobile Responsive & Smooth Touch Scrolling for Modals */
.tab-content {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 120px);
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding-bottom: 30px;
}

.upgrade-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 4px;
}

.pause-modal, .workshop-grid, .intro-modal, .chest-modal {
  touch-action: pan-y !important;
  -webkit-overflow-scrolling: touch !important;
}

#levelup-screen, #pause-screen, #chest-screen, #stage-transition-screen, #gameover-screen, #win-screen {
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}
"""

text = text.replace("</style>", modal_css_enhancement + "\n</style>")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added modal CSS scrolling rules successfully.")
