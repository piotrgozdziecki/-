with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace or enhance CSS styles
old_css_marker = "/* MODALS & SCREENS */"
new_css_styles = """
    /* MODERN HIGH-TECH GLASSMORPHISM & NEON OVERLAYS */
    .screen-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 7, 18, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 100;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: max(env(safe-area-inset-top, 10px), 10px);
    }
    .card-modal {
      width: 96%;
      max-width: 680px;
      max-height: 92vh;
      background: rgba(15, 23, 42, 0.96);
      border: 2px solid #334155;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.15);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: #f8fafc;
    }
    .card-modal h1 {
      font-size: 18px;
      font-weight: 900;
      color: #f59e0b;
      text-align: center;
      letter-spacing: 0.5px;
      text-shadow: 0 0 10px rgba(245,158,11,0.5);
      margin-bottom: 2px;
    }
    .card-modal h2 {
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      text-align: center;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .menu-tabs {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      padding-bottom: 4px;
      border-bottom: 1px solid #334155;
    }
    .tab-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: rgba(245, 158, 11, 0.25);
      border-color: #f59e0b;
      color: #fef08a;
      box-shadow: 0 0 12px rgba(245,158,11,0.3);
    }
    .char-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1f));
      gap: 8px;
      margin-top: 6px;
    }
    .char-card {
      background: #0f172a;
      border: 1.5px solid #334155;
      border-radius: 10px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .char-card.selected {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      box-shadow: 0 0 14px rgba(56,189,248,0.3);
      transform: scale(1.02);
    }
    .char-header {
      font-size: 11px;
      font-weight: 900;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .char-skill {
      font-size: 9px;
      color: #cbd5e1;
      margin-top: 4px;
      line-height: 1.2;
    }
    .workshop-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .btn-action-primary {
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      border: none;
      color: #0f172a;
      font-size: 14px;
      font-weight: 900;
      padding: 12px 20px;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(245,158,11,0.4);
      width: 100%;
      text-align: center;
      letter-spacing: 0.5px;
      transition: transform 0.15s ease;
    }
    .btn-action-primary:active {
      transform: scale(0.97);
    }
"""

if '/* MODALS & SCREENS */' in text:
    text = text.replace('/* MODALS & SCREENS */', new_css_styles + '\n/* MODALS & SCREENS */')
    print("Enhanced UI styles in game.html.")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated game.html styling!")
