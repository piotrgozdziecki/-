import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

audio_patch = """  playTone(freq, type, duration, vol, endFreq = null, isLowPass = false) {
    if (!this.ctx || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      let filter = null;
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), this.ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      
      if (isLowPass) {
         filter = this.ctx.createBiquadFilter();
         filter.type = 'lowpass';
         filter.frequency.value = 400; // Muffled effect
         osc.connect(filter);
         filter.connect(gain);
      } else {
         osc.connect(gain);
      }
      
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e){}
  }
  
  lowBatteryWarning() {
     this.playTone(800, 'square', 0.15, 0.1, 400);
     setTimeout(() => this.playTone(800, 'square', 0.15, 0.1, 400), 200);
  }"""

content = re.sub(r'  playTone\(freq, type, duration, vol, endFreq = null\) \{[\s\S]*?osc\.stop\(now \+ duration\);\s*\} catch\(e\)\{\}\s*\}', audio_patch.strip(), content)


# 2. Add trigger for low battery warning inside update loop
battery_update = """  if (player.battery < player.maxBattery * 0.25) {
     if (!window.lastBatteryWarn || gameTime - window.lastBatteryWarn > 1.5) {
         sounds.lowBatteryWarning();
         window.lastBatteryWarn = gameTime;
     }
  }
  
  // Health/Battery Regeneration (DTA Strefa Relaksu - slow natural regen if not in red zone)
"""
content = content.replace("  // Health/Battery Regeneration", battery_update)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

