with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

sound_engine_old = """  xp() { this.playTone(1400, 'sine', 0.05, 0.09, 1800); }
  dash() { this.playTone(220, 'sawtooth', 0.25, 0.25, 600); }"""
sound_engine_new = """  xp() { this.playTone(1400, 'sine', 0.05, 0.09, 1800); }
  dash() { this.playTone(220, 'sawtooth', 0.25, 0.25, 600); }
  footstep() { this.playTone(120, 'triangle', 0.06, 0.03, 80); }"""

text = text.replace(sound_engine_old, sound_engine_new)

# Add footstep sound when moving on foot
update_motor_call = """  sounds.updateMotor(spdRatio, player.isForklift);"""
new_update_motor = """  sounds.updateMotor(spdRatio, player.isForklift);
  if (!player.isForklift && moveLen > 0.05 && Math.random() < 0.15) {
      if ((gameTime * 10) % 2 < 0.5) sounds.footstep();
  }"""
text = text.replace(update_motor_call, new_update_motor)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
