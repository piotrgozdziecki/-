import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Announcement HTML & Toast HTML styling
old_ann_div = '<div id="announcement" style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) scale(0.8); opacity: 0; pointer-events: none; text-align: center; font-size: 36px; font-weight: 900; color: #fff; text-shadow: 0 4px 12px rgba(0,0,0,0.8), 0 0 20px currentColor; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 1000; font-family: \'Arial Black\', sans-serif; -webkit-text-stroke: 1px #000; white-space: nowrap;"></div>'

new_ann_div = '<div id="announcement" style="position: absolute; top: max(env(safe-area-inset-top, 12px), 36px); left: 50%; transform: translate(-50%, -10px) scale(0.95); opacity: 0; pointer-events: none; text-align: center; font-size: 13px; font-weight: 900; color: #38bdf8; background: rgba(15, 23, 42, 0.94); border: 1.5px solid #38bdf8; border-radius: 20px; padding: 6px 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.7), 0 0 15px rgba(56, 189, 248, 0.25); transition: all 0.3s ease; z-index: 9999; white-space: nowrap; letter-spacing: 0.5px;"></div>'

if old_ann_div in text:
    text = text.replace(old_ann_div, new_ann_div)
    print("Replaced old_ann_div")

# 2. Update Ach Toast HTML styling
old_toast = '<div id="ach-toast">'
new_toast = '<div id="ach-toast" style="position: absolute; top: max(env(safe-area-inset-top, 10px), 12px); right: 12px; z-index: 10000; display: flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #f59e0b; border-radius: 12px; padding: 8px 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(245, 158, 11, 0.3); transform: translateX(120%); opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none;">'

if old_toast in text:
    text = text.replace(old_toast, new_toast)
    print("Replaced old_toast")

# 3. Replace showAnnouncement and triggerAchievement logic
ann_func_old = """function showAnnouncement(txt, col) {  const el = document.getElementById('announcement');  el.innerText = txt; el.style.color = col;  el.style.opacity = 1; el.style.transform = 'translate(-50%, -50%) scale(1)';  setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translate(-50%, -50%) scale(0.8)'; }, 3500);}"""

ann_func_new = """// --- QUEUED NON-INTRUSIVE ANNOUNCEMENT ENGINE ---
const announcementQueue = [];
let isAnnouncementShowing = false;
let lastAnnouncementText = '';
let lastAnnouncementTime = 0;

function showAnnouncement(txt, col = '#38bdf8') {
  const now = Date.now();
  if (txt === lastAnnouncementText && (now - lastAnnouncementTime < 4000)) return;
  announcementQueue.push({ txt, col, time: now });
  processAnnouncementQueue();
}

function processAnnouncementQueue() {
  if (isAnnouncementShowing || announcementQueue.length === 0) return;
  const item = announcementQueue.shift();
  isAnnouncementShowing = true;
  lastAnnouncementText = item.txt;
  lastAnnouncementTime = item.time;

  const el = document.getElementById('announcement');
  if (el) {
    el.innerText = item.txt;
    el.style.color = item.col;
    el.style.borderColor = item.col;
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, 0) scale(1)';
  }

  setTimeout(() => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -10px) scale(0.95)';
    }
    setTimeout(() => {
      isAnnouncementShowing = false;
      processAnnouncementQueue();
    }, 250);
  }, 2200);
}"""

if ann_func_old in text:
    text = text.replace(ann_func_old, ann_func_new)
    print("Replaced showAnnouncement")

# Replace triggerAchievement
ach_func_old_pos = text.find('function triggerAchievement')
if ach_func_old_pos != -1:
    ach_func_old_end = text.find('function ', ach_func_old_pos + 20)
    print("Found triggerAchievement at", ach_func_old_pos)

ach_func_new = """function triggerAchievement(key, name, icon) {
  if (unlockedRunAchievements.has(key)) return;
  unlockedRunAchievements.add(key);

  const ach = roomAchievements.find(a => a.key === key);
  if (ach && !ach.unlocked) {
    ach.unlocked = true;
    renderAchievementsTab();
  }
  if (window.AndroidBridge && window.AndroidBridge.unlockAchievement) {
    window.AndroidBridge.unlockAchievement(key);
  }

  let rewardText = '';
  const reward = ACHIEVEMENT_REWARDS[key];
  if (reward) {
    reward.apply();
    rewardText = reward.text;
    createSparks(player.x, player.y, 35, '#facc15');
    screenShake = Math.max(screenShake, 8);
  }

  achievementQueue.push({ name, icon: icon || '🏆', rewardText });
  processAchievementQueue();
}

function processAchievementQueue() {
  if (isAchievementToastShowing || achievementQueue.length === 0) return;
  const item = achievementQueue.shift();
  isAchievementToastShowing = true;

  const toast = document.getElementById('ach-toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastName = document.getElementById('toast-name');
  if (toastIcon) toastIcon.innerText = item.icon;
  if (toastName) toastName.innerText = item.name + (item.rewardText ? ' (' + item.rewardText + ')' : '');

  if (toast) {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
    sounds.levelUp();
  }

  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
    }
    setTimeout(() => {
      isAchievementToastShowing = false;
      processAchievementQueue();
    }, 350);
  }, 2800);
}
"""

# Let's add achievementQueue definition before triggerAchievement if not there
if 'const achievementQueue = [];' not in text:
    text = text.replace('let unlockedRunAchievements', 'const achievementQueue = [];\nlet isAchievementToastShowing = false;\nlet unlockedRunAchievements')

# 4. Throttled Speech Bubbles
speech_func_old = "function addSpeechBubble(x, y, text, color = '#ffffff') {  if (speechBubbles.length >= 3) speechBubbles.shift(); // Max 3 active speech bubbles to prevent screen clutter  speechBubbles.push({ x, y, text, color, life: 2.2, maxLife: 2.2 });}"

speech_func_new = """let lastPlayerSpeechTime = 0;
function addSpeechBubble(x, y, text, color = '#ffffff') {
  const isPlayer = Math.hypot(x - player.x, y - player.y) < 25;
  const now = Date.now();
  if (isPlayer) {
    if (now - lastPlayerSpeechTime < 2800) return;
    lastPlayerSpeechTime = now;
  }
  if (speechBubbles.length >= 3) speechBubbles.shift();
  speechBubbles.push({ x, y, text, color, life: 1.8, maxLife: 1.8 });
}"""

if speech_func_old in text:
    text = text.replace(speech_func_old, speech_func_new)
    print("Replaced speechBubbles")

# 5. Milestone Combo Logic in killEnemy
kill_combo_old = """  if (comboCount === 25) showAnnouncement('🔥 25 COMBO: NA ZMIANIE!', '#f59e0b');
  if (comboCount === 50) showAnnouncement('⚡ 50 COMBO: RAMPAGE DTA!', '#ec4899');
  if (comboCount === 100) showAnnouncement('💥 100 COMBO: LEGENDA WMS!', '#a855f7');
  if (comboCount === 200) showAnnouncement('👑 200 COMBO: KIEROWNIK HALI!', '#38bdf8');
  if (comboCount === 350) showAnnouncement('🚀 350 COMBO: GODLIKE DTA!', '#facc15');
  if (comboCount === 25 || comboCount === 50 || comboCount === 100 || comboCount === 200 || comboCount === 350) {
    screenShake = 14;
    sounds.levelUp();
    addSpeechBubble(player.x, player.y - 45, '🔥 COMBO x' + comboCount + '!', '#facc15');
  }"""

kill_combo_new = """  // Non-intrusive Combo Milestones (Announced in Top Queue)
  if (comboCount === 50) showAnnouncement('⚡ 50 COMBO: NA ZMIANIE!', '#f59e0b');
  else if (comboCount === 100) showAnnouncement('🔥 100 COMBO: SERIA WMS!', '#ec4899');
  else if (comboCount === 250) showAnnouncement('👑 250 COMBO: LEGENDA HALI!', '#38bdf8');
  else if (comboCount === 500) showAnnouncement('🚀 500 COMBO: MISTRZ EPAL!', '#facc15');
  
  if (comboCount === 50 || comboCount === 100 || comboCount === 250 || comboCount === 500) {
    screenShake = 8;
    sounds.levelUp();
  }"""

if kill_combo_old in text:
    text = text.replace(kill_combo_old, kill_combo_new)
    print("Replaced kill_combo_old")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Engine script patch completed!")
