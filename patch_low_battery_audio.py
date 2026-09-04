import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the end of SoundEngine with the new low battery function
audio_func = """  bark() {
    this.playTone(520, 'sawtooth', 0.08, 0.25, 220);
    setTimeout(() => this.playTone(640, 'sawtooth', 0.09, 0.28, 280), 90);
  }
  lowBatteryWarning() {
    this.playTone(850, 'square', 0.15, 0.18, 400);
    setTimeout(() => this.playTone(850, 'square', 0.15, 0.18, 400), 200);
  }
}
const sounds = new SoundEngine();"""

content = re.sub(r'  bark\(\) \{[\s\S]*?setTimeout\(\(\) => this\.playTone\(640, \'sawtooth\', 0\.09, 0\.28, 280\), 90\);\s*\}\s*\}\s*const sounds = new SoundEngine\(\);', audio_func.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

